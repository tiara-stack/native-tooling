import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import test from "node:test";
import {
  bridgeLsp,
  lspOptions,
} from "../../packages/vite-plus-effect-fork/packages/cli/bin/tiara-oxlint-lsp.mjs";

function fixture() {
  const input = new PassThrough(),
    output = new PassThrough();
  const child = { stdin: new PassThrough(), stdout: new PassThrough() };
  const received = [],
    sent = [];
  function collect(stream, target) {
    let buffer = Buffer.alloc(0);
    stream.on("data", (bytes) => {
      buffer = Buffer.concat([buffer, bytes]);
      while (true) {
        const index = buffer.indexOf("\r\n\r\n");
        if (index < 0) return;
        const length = Number(
          /Content-Length:\s*(\d+)/i.exec(buffer.subarray(0, index).toString())[1],
        );
        if (buffer.length < index + 4 + length) return;
        target.push(JSON.parse(buffer.subarray(index + 4, index + 4 + length)));
        buffer = buffer.subarray(index + 4 + length);
      }
    });
  }
  collect(child.stdin, received);
  collect(output, sent);
  const value = {
    defaults: { typeAware: false },
    overrides: { configPath: "/project/.tiara-oxlint-test-root.json" },
  };
  const bridge = bridgeLsp(child, () => value, input, output);
  const send = (stream, message, fragmented = false) => {
    const body = Buffer.from(JSON.stringify({ jsonrpc: "2.0", ...message }));
    const frame = Buffer.concat([Buffer.from(`Content-Length: ${body.length}\r\n\r\n`), body]);
    if (fragmented) for (const byte of frame) stream.write(Buffer.from([byte]));
    else stream.write(frame);
  };
  return {
    input,
    output,
    child,
    received,
    sent,
    value,
    bridge,
    send,
    close: () => {
      bridge.close();
      input.destroy();
      output.destroy();
      child.stdin.destroy();
      child.stdout.destroy();
    },
  };
}

test("LSP bridge preserves fragmented Unicode traffic, workspace settings and forced CLI overrides", () => {
  const f = fixture();
  try {
    f.value.overrides.typeAware = true;
    f.send(
      f.input,
      {
        id: 1,
        method: "initialize",
        params: {
          rootUri: "file:///project",
          capabilities: { workspace: { configuration: true } },
        },
      },
      true,
    );
    f.send(f.child.stdout, {
      id: 12,
      method: "workspace/configuration",
      params: {
        items: [
          { scopeUri: "file:///project", section: "oxc_language_server" },
          { scopeUri: "file:///other", section: "unrelated" },
        ],
      },
    });
    // JSON-RPC IDs are independent in each direction.
    f.send(f.input, {
      id: 12,
      method: "textDocument/diagnostic",
      params: { textDocument: { uri: "file:///project/input.ts" } },
    });
    assert.equal(f.received.at(-1).method, "textDocument/diagnostic");
    f.send(
      f.input,
      {
        id: 12,
        result: [
          {
            typeAware: false,
            run: "onSave",
            rulesCustomization: { "no-console": { severity: "hint" } },
          },
          { message: "日本語" },
        ],
      },
      true,
    );
    const result = f.received.at(-1).result;
    assert.equal(result[0].typeAware, true);
    assert.equal(result[0].run, "onSave");
    assert.deepEqual(result[0].rulesCustomization, { "no-console": { severity: "hint" } });
    assert.equal(result[0].configPath, f.value.overrides.configPath);
    assert.deepEqual(result[1], { message: "日本語" });
    f.send(f.input, { method: "initialized", params: {} });
    f.value.defaults.disableNestedConfig = true;
    f.bridge.refresh();
    assert.equal(f.received.at(-2).params.settings[0].options.disableNestedConfig, true);
    assert.equal(f.received.at(-2).params.settings[0].options.run, "onSave");
    assert.equal(f.received.at(-1).method, "workspace/didChangeWatchedFiles");
    f.send(f.input, {
      method: "workspace/didChangeConfiguration",
      params: { settings: [{ workspaceUri: "file:///project", options: { run: "onType" } }] },
    });
    assert.equal(f.received.at(-1).params.settings[0].options.run, "onType");
    assert.equal(f.received.at(-1).params.settings[0].options.typeAware, true);
    f.send(f.input, { id: 90, method: "unrelated/request", params: { message: "日本語" } }, true);
    assert.equal(f.received.at(-1).params.message, "日本語");
  } finally {
    f.close();
  }
});

test("LSP bridge supplies initial, newly-added workspace and single-file options without editor configuration support", () => {
  const f = fixture();
  try {
    f.send(f.input, { id: 1, method: "initialize", params: { capabilities: {} } });
    const params = f.received[0].params;
    assert.match(params.rootUri, /^file:/);
    assert.equal(params.initializationOptions[0].options.configPath, f.value.overrides.configPath);
    const before = f.sent.length;
    f.send(f.child.stdout, {
      id: 44,
      method: "workspace/configuration",
      params: { items: [{ scopeUri: "file:///new", section: "oxc_language_server" }] },
    });
    assert.equal(f.sent.length, before);
    assert.equal(f.received.at(-1).id, 44);
    assert.equal(f.received.at(-1).result[0].configPath, f.value.overrides.configPath);
  } finally {
    f.close();
  }
});

test("LSP bridge reports malformed framing rather than forwarding corrupted messages", async () => {
  const f = fixture();
  try {
    const failed = assert.rejects(f.bridge.failed, /Invalid LSP Content-Length/);
    f.input.write("Broken: 2\r\n\r\n{}");
    await failed;
    assert.equal(f.received.length, 0);
  } finally {
    f.close();
  }
});

test("LSP bridge rejects a truncated frame at EOF", async () => {
  const f = fixture();
  try {
    const failed = assert.rejects(f.bridge.failed, /Incomplete LSP frame/);
    f.input.end("Content-Length: 200\r\n\r\n{}");
    await failed;
    assert.equal(f.received.length, 0);
  } finally {
    f.close();
  }
});

for (const side of ["input", "output"])
  test(`LSP bridge propagates ${side} I/O failure`, async () => {
    const f = fixture();
    try {
      const failed = assert.rejects(f.bridge.failed, /client I\/O failure/);
      const stream = side === "input" ? f.input : null;
      if (stream) stream.emit("error", new Error("client I/O failure"));
      else {
        // The pipe destination is deliberately supplied by the caller.
        f.output.emit("error", new Error("client I/O failure"));
      }
      await failed;
    } finally {
      f.close();
    }
  });

test("LSP option translation uses the native server's supported field names", () => {
  assert.throws(
    () => lspOptions({ fixSuggestions: true }),
    /suggestion-only fixKind is unsupported/,
  );
  assert.equal(lspOptions({ fix: true, fixDangerously: true }).fixKind, "all");
  assert.equal(lspOptions({ fix: true, fixSuggestions: true }).fixKind, "safe_fix_or_suggestion");
  assert.deepEqual(lspOptions({ reportUnusedDisableDirectives: "error", typeAware: false }), {
    unusedDisableDirectives: "deny",
    typeAware: false,
  });
  assert.deepEqual(
    lspOptions({
      typeAware: false,
      disableNestedConfig: true,
      tsconfig: "/project/tsconfig.json",
      reportUnusedDisableDirectivesSeverity: "error",
      fix: true,
    }),
    {
      typeAware: false,
      disableNestedConfig: true,
      tsConfigPath: "/project/tsconfig.json",
      unusedDisableDirectives: "deny",
      fixKind: "safe_fix",
    },
  );
  assert.deepEqual(lspOptions({ reportUnusedDisableDirectives: true, fixDangerously: true }), {
    unusedDisableDirectives: "warn",
    fixKind: "dangerous_fix_or_suggestion",
  });
});
