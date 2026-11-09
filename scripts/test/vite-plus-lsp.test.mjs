import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const adapter =
  process.env.TIARA_TEST_ADAPTER ??
  join(root, "packages/vite-plus-effect-fork/packages/cli/bin/tiara-oxlint.mjs");

for (const configuration of [false, true, "type-aware", "type-aware-cli"]) {
  test(
    `native LSP applies Vite config initially and on refresh, workspace/configuration=${configuration}`,
    { timeout: 40000 },
    async () => {
      mkdirSync(join(root, ".tmp"), { recursive: true });
      const directory = mkdtempSync(join(root, ".tmp/lsp-handoff-"));
      const uri = pathToFileURL(directory).href;
      const typed = String(configuration).startsWith("type-aware");
      const filename = typed ? "input.ts" : "input.js";
      const rule = typed ? "effect/floating-effect" : "no-console";
      const code = typed ? "floating-effect" : "no-console";
      const file = pathToFileURL(join(directory, filename)).href;
      const config = join(directory, "vite.config.ts");
      const update = (severity) =>
        writeFileSync(
          config,
          `export default { lint: { plugins: ${JSON.stringify(typed ? ["effect"] : [])}, categories: { correctness: "off" }, rules: { ${JSON.stringify(rule)}: ${JSON.stringify(severity)} }, options: { typeAware: ${typed && configuration !== "type-aware-cli"}, reportUnusedDisableDirectives: "error", respectEslintDisableDirectives: true } } };\n`,
        );
      writeFileSync(join(directory, "package.json"), '{"type":"module","private":true}');
      const text = typed
        ? JSON.parse(
            readFileSync(join(root, "native/effect-tsgo/_packages/tsgo/src/metadata.json")),
          ).rules.find((item) => item.name === "floatingEffect").preview.sourceText
        : 'console.log("日本語");\n';
      if (typed) {
        symlinkSync(join(root, "node_modules"), join(directory, "node_modules"), "dir");
        writeFileSync(
          join(directory, "tsconfig.json"),
          JSON.stringify({
            compilerOptions: {
              module: "ESNext",
              moduleResolution: "Bundler",
              target: "ES2022",
              strict: true,
              skipLibCheck: true,
              types: [],
              plugins: [
                { name: "@effect/language-service", diagnostics: true, diagnosticSeverity: {} },
              ],
            },
            include: [filename],
          }),
        );
      }
      writeFileSync(join(directory, filename), text);
      update("error");
      const child = spawn(
        process.execPath,
        [adapter, "--lsp", ...(configuration === "type-aware-cli" ? ["--type-aware"] : [])],
        {
          cwd: directory,
          env: {
            ...process.env,
            TIARA_OXLINT_EFFECT_PATH: join(
              root,
              "native/oxc-oxlint-effect-fork/target/release/oxlint",
            ),
            OXLINT_TSGOLINT_PATH: join(root, "native/tsgolint-effect-fork/tsgolint"),
          },
          stdio: ["pipe", "pipe", "pipe"],
        },
      );
      const messages = [];
      let buffer = Buffer.alloc(0),
        stderr = "";
      const send = (message) => {
        const body = Buffer.from(JSON.stringify({ jsonrpc: "2.0", ...message }));
        child.stdin.write(`Content-Length: ${body.length}\r\n\r\n`);
        child.stdin.write(body);
      };
      child.stderr.on("data", (bytes) => {
        stderr += bytes;
      });
      child.stdout.on("data", (bytes) => {
        buffer = Buffer.concat([buffer, bytes]);
        while (true) {
          const header = buffer.indexOf("\r\n\r\n");
          if (header < 0) return;
          const length = Number(
            /Content-Length:\s*(\d+)/i.exec(buffer.subarray(0, header).toString())[1],
          );
          if (buffer.length < header + 4 + length) return;
          const message = JSON.parse(buffer.subarray(header + 4, header + 4 + length));
          buffer = buffer.subarray(header + 4 + length);
          messages.push(message);
          if (message.method === "workspace/configuration")
            send({
              id: message.id,
              result: message.params.items.map(() => ({
                run: "onType",
                rulesCustomization: { "no-console": { severity: "warn" } },
              })),
            });
          else if (message.id != null && message.method) send({ id: message.id, result: null });
        }
      });
      const exit = new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("exit", (code, signal) => resolve({ code, signal }));
      });
      const wait = async (predicate) => {
        const deadline = Date.now() + 10000;
        while (Date.now() < deadline) {
          const value = messages.find(predicate);
          if (value) return value;
          if (child.exitCode !== null) throw new Error(`LSP exited: ${stderr}`);
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        throw new Error(`No expected native LSP message: ${JSON.stringify(messages)}\n${stderr}`);
      };
      try {
        send({
          id: 1,
          method: "initialize",
          params: {
            processId: process.pid,
            rootUri: uri,
            workspaceFolders: [{ uri, name: "fixture" }],
            capabilities: { workspace: { configuration: configuration !== false } },
          },
        });
        await wait((message) => message.id === 1);
        send({ method: "initialized", params: {} });
        send({
          method: "textDocument/didOpen",
          params: {
            textDocument: {
              uri: file,
              languageId: typed ? "typescript" : "javascript",
              version: 1,
              text,
            },
          },
        });
        const diagnostics = (message) =>
          message.method === "textDocument/publishDiagnostics" && message.params.uri === file;
        const initial = await wait(
          (message) =>
            diagnostics(message) &&
            message.params.diagnostics.some((item) => String(item.code).includes(code)),
        );
        // The client's rulesCustomization is preserved when requested, rather than discarded by the bridge.
        assert.equal(
          initial.params.diagnostics.find((item) => String(item.code).includes(code)).severity,
          configuration === true ? 2 : 1,
        );
        if (configuration === "type-aware") {
          messages.length = 0;
          send({
            method: "workspace/didChangeConfiguration",
            params: { settings: [{ workspaceUri: uri, options: { typeAware: false } }] },
          });
          await wait((message) => diagnostics(message) && message.params.diagnostics.length === 0);
          messages.length = 0;
          send({
            method: "workspace/didChangeConfiguration",
            params: { settings: [{ workspaceUri: uri, options: { typeAware: true } }] },
          });
          await wait(
            (message) =>
              diagnostics(message) &&
              message.params.diagnostics.some((item) => String(item.code).includes(code)),
          );
        }
        messages.length = 0;
        update("off");
        await wait((message) => diagnostics(message) && message.params.diagnostics.length === 0);
        messages.length = 0;
        update("error");
        await wait(
          (message) =>
            diagnostics(message) &&
            message.params.diagnostics.some((item) => String(item.code).includes(code)),
        );
        // Failed refresh must preserve the published native config and recover on the next valid edit.
        writeFileSync(config, "export default { lint: { rules: { invalid: () => true } } };\n");
        const deadline = Date.now() + 5000;
        while (!stderr.includes("serializable Rust rule settings") && Date.now() < deadline)
          await new Promise((resolve) => setTimeout(resolve, 30));
        assert.match(stderr, /serializable Rust rule settings/);
        const temporary = readdirSync(directory).find((name) => name.endsWith("-root.json"));
        assert.equal(JSON.parse(readFileSync(join(directory, temporary))).rules[rule], "error");
        messages.length = 0;
        update("off");
        await wait((message) => diagnostics(message) && message.params.diagnostics.length === 0);
        send({ id: 2, method: "shutdown", params: null });
        await wait((message) => message.id === 2);
        send({ method: "exit" });
        assert.equal((await exit).code, 0, stderr);
        assert.deepEqual(
          readdirSync(directory).filter((name) => name.startsWith(".tiara-oxlint-")),
          [],
        );
      } finally {
        if (child.exitCode === null && child.signalCode === null) {
          child.kill("SIGTERM");
          await exit;
        }
        rmSync(directory, { recursive: true, force: true });
      }
    },
  );
}
