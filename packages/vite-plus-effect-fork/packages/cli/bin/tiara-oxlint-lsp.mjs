import { Transform } from "node:stream";
import { pathToFileURL } from "node:url";

// Oxlint's native LSP reads options from protocol messages, not CLI flags.
// Keep editor settings and unrelated messages while supplying the launcher's
// effective configuration through that supported contract.
export function bridgeLsp(child, settings, input = process.stdin, output = process.stdout) {
  const workspaces = new Map();
  const requests = new Map();
  let initialized = false;
  let editorConfiguration = false;
  const merge = (uri, options) => {
    if (options && typeof options === "object" && !Array.isArray(options))
      workspaces.set(uri, options);
    const { defaults, overrides } = settings();
    return { ...defaults, ...workspaces.get(uri), ...overrides };
  };
  const encode = (message) => {
    const body = Buffer.from(JSON.stringify(message));
    return Buffer.concat([Buffer.from(`Content-Length: ${body.length}\r\n\r\n`), body]);
  };
  const workspaceOptions = () =>
    [...workspaces].map(([workspaceUri]) => ({
      workspaceUri,
      options: merge(workspaceUri),
    }));
  function fromClient(message) {
    if (message.method === "initialize") {
      const params = message.params;
      editorConfiguration = params.capabilities?.workspace?.configuration === true;
      params.capabilities ??= {};
      params.capabilities.workspace ??= {};
      // The bridge can answer configuration requests for editors without this
      // capability, including newly added workspaces after initialization.
      params.capabilities.workspace.configuration = true;
      const uris = params.workspaceFolders?.map((folder) => folder.uri) ?? [
        params.rootUri ?? pathToFileURL(process.cwd()).href,
      ];
      // The native server otherwise creates single-file workers with defaults,
      // without initialization options. The explicit launcher config has a cwd.
      if (!params.workspaceFolders && !params.rootUri) params.rootUri = uris[0];
      const initial = params.initializationOptions;
      for (const uri of uris) {
        const own = Array.isArray(initial)
          ? initial.find((item) => item.workspaceUri === uri)?.options
          : initial?.settings;
        workspaces.set(uri, own ?? {});
      }
      // Let configuration-capable editors provide their current settings first.
      if (initial != null || !editorConfiguration)
        params.initializationOptions = workspaceOptions();
    } else if (message.method === "initialized") {
      initialized = true;
    } else if (message.method === "workspace/didChangeConfiguration") {
      const value = message.params.settings;
      if (value != null) {
        if (Array.isArray(value)) {
          message.params.settings = value.map((item) => ({
            ...item,
            options: merge(item.workspaceUri, item.options),
          }));
        } else {
          for (const uri of workspaces.keys()) merge(uri, value);
          message.params.settings = workspaceOptions();
        }
      }
    } else if (!message.method && requests.has(message.id)) {
      const items = requests.get(message.id);
      requests.delete(message.id);
      const failed = Boolean(message.error);
      const result = Array.isArray(message.result) ? message.result : [];
      delete message.error;
      message.result = items.map((item, index) =>
        item.section === "oxc_language_server"
          ? merge(item.scopeUri, failed ? undefined : (result[index] ?? {}))
          : (result[index] ?? null),
      );
    }
    return message;
  }
  function fromServer(message) {
    if (message.method === "workspace/configuration") {
      if (!editorConfiguration) {
        child.stdin.write(
          encode({
            jsonrpc: "2.0",
            id: message.id,
            result: message.params.items.map((item) =>
              item.section === "oxc_language_server" ? merge(item.scopeUri, {}) : null,
            ),
          }),
        );
        return;
      }
      requests.set(message.id, message.params.items);
    }
    return message;
  }
  function frames(transform) {
    let pending = Buffer.alloc(0);
    return new Transform({
      transform(bytes, _encoding, done) {
        try {
          pending = Buffer.concat([pending, bytes]);
          while (true) {
            const end = pending.indexOf("\r\n\r\n");
            if (end < 0) break;
            const header = /(?:^|\r\n)Content-Length:\s*(\d+)(?:\r\n|$)/i.exec(
              pending.subarray(0, end).toString(),
            );
            if (!header) throw new Error("Invalid LSP Content-Length header");
            const length = Number(header[1]);
            if (pending.length < end + 4 + length) break;
            const message = JSON.parse(pending.subarray(end + 4, end + 4 + length));
            pending = pending.subarray(end + 4 + length);
            const value = transform(message);
            if (value) this.push(encode(value));
          }
          done();
        } catch (error) {
          done(error);
        }
      },
      flush(done) {
        done(pending.length ? new Error("Incomplete LSP frame") : undefined);
      },
    });
  }
  const client = frames(fromClient),
    server = frames(fromServer);
  const failed = new Promise((_resolve, reject) => {
    for (const stream of [client, server, child.stdin, child.stdout, input, output])
      stream.on("error", reject);
  });
  input.pipe(client).pipe(child.stdin);
  child.stdout.pipe(server).pipe(output, { end: false });
  return {
    failed,
    refresh() {
      if (!initialized || child.stdin.destroyed || child.stdin.writableEnded) return;
      child.stdin.write(
        encode({
          jsonrpc: "2.0",
          method: "workspace/didChangeConfiguration",
          params: { settings: workspaceOptions() },
        }),
      );
      const path = settings().overrides.configPath;
      if (path)
        child.stdin.write(
          encode({
            jsonrpc: "2.0",
            method: "workspace/didChangeWatchedFiles",
            params: { changes: [{ uri: pathToFileURL(path).href, type: 2 }] },
          }),
        );
    },
    close() {
      input.unpipe(client);
      input.pause();
      child.stdout.unpipe(server);
      client.unpipe(child.stdin);
      server.unpipe(output);
      client.destroy();
      server.destroy();
    },
  };
}

export function lspOptions(options) {
  const result = {};
  for (const key of ["typeAware", "disableNestedConfig"]) {
    if (typeof options[key] === "boolean") result[key] = options[key];
  }
  if (options.tsconfig != null) result.tsConfigPath = options.tsconfig;
  if (options.reportUnusedDisableDirectives === true) result.unusedDisableDirectives = "warn";
  else if (options.reportUnusedDisableDirectives != null)
    result.unusedDisableDirectives = {
      error: "deny",
      warn: "warn",
      off: "allow",
      deny: "deny",
      allow: "allow",
    }[options.reportUnusedDisableDirectives];
  const severity = options.reportUnusedDisableDirectivesSeverity;
  if (severity != null)
    result.unusedDisableDirectives = { error: "deny", warn: "warn", off: "allow" }[severity];
  if (options.fixDangerously) result.fixKind = options.fix ? "all" : "dangerous_fix_or_suggestion";
  else if (options.fixSuggestions) {
    if (!options.fix)
      throw new Error(
        "Native LSP requires --fix with --fix-suggestions; suggestion-only fixKind is unsupported.",
      );
    result.fixKind = "safe_fix_or_suggestion";
  } else if (options.fix) result.fixKind = "safe_fix";
  return result;
}
