#!/usr/bin/env node

import { spawn } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const forkRoot = resolve(__dirname, "..");
const repoRoot = resolve(forkRoot, "..", "..");
const packageRoot = resolve(repoRoot, "packages", "typhoon-core");
const binary = resolve(forkRoot, "tsgolint");
const tsconfigPath = resolve(packageRoot, "tsconfig.json");
const probePath = resolve(packageRoot, "src", "__native_effect_smoke.ts");

const tsconfig = JSON.parse(await readFile(tsconfigPath, "utf8"));
tsconfig.compilerOptions ??= {};
tsconfig.compilerOptions.plugins = [
  {
    name: "@effect/language-service",
    diagnostics: true,
    diagnosticSeverity: {}
  }
];

const payload = {
  version: 2,
  configs: [
    {
      file_paths: [probePath],
      rules: [{ name: "floating_effect" }]
    }
  ],
  source_overrides: {
    [tsconfigPath]: JSON.stringify(tsconfig, null, 2)
  },
  report_syntactic: false,
  report_semantic: false
};

await writeFile(probePath, 'import { Effect } from "effect";\n\nEffect.succeed("probe");\n');

try {
  const child = spawn(binary, ["headless"], {
    cwd: packageRoot,
    stdio: ["pipe", "pipe", "pipe"]
  });

  child.stdin.end(JSON.stringify(payload));

  const stdout = [];
  const stderr = [];

  child.stdout.on("data", (chunk) => stdout.push(Buffer.from(chunk)));
  child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));

  const status = await new Promise((resolveStatus, reject) => {
    child.on("error", reject);
    child.on("close", (code) => resolveStatus(code ?? 1));
  });

  const output = Buffer.concat(stdout);
  const messages = [];
  let offset = 0;
  while (offset < output.length) {
    if (offset + 5 > output.length) {
      throw new Error(`truncated frame header at byte ${offset}`);
    }
    const length = output.readUInt32LE(offset);
    const type = output.readUInt8(offset + 4);
    offset += 5;
    if (offset + length > output.length) {
      throw new Error(`truncated frame payload at byte ${offset}`);
    }
    const body = JSON.parse(output.subarray(offset, offset + length).toString("utf8"));
    offset += length;
    messages.push({ type, body });
  }

  if (status !== 0) {
    throw new Error(`tsgolint exited with ${status}: ${Buffer.concat(stderr).toString("utf8")}`);
  }

  const errors = messages.filter((message) => message.type === 0);
  if (errors.length > 0) {
    throw new Error(`headless returned error frames: ${JSON.stringify(errors)}`);
  }

  const diagnostics = messages.filter((message) => message.type === 1).map((message) => message.body);
  const floatingEffect = diagnostics.find((diagnostic) => diagnostic.rule === "floating_effect");
  if (!floatingEffect) {
    throw new Error(`expected floating_effect diagnostic, got ${JSON.stringify(messages)}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        diagnostics: diagnostics.length,
        rule: floatingEffect.rule,
        message: floatingEffect.message?.description
      },
      null,
      2
    )
  );
} finally {
  await rm(probePath, { force: true });
}
