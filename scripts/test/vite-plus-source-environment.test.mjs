import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import test from "node:test";
import { sourceEnvironment } from "../lib/vite-plus-source-environment.mjs";
import { rolldownBuildRecord } from "../lib/vite-plus-build-record.mjs";

function rolldownFixture() {
  const source = mkdtempSync(join(tmpdir(), "rolldown-inputs-"));
  const files = [
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    ...[
      "Cargo.toml",
      "Cargo.lock",
      ".cargo/config.toml",
      ".tiara-source.json",
      "package.json",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "tsconfig.json",
      "crates/test/lib.rs",
      "packages/rolldown/build.ts",
      "packages/rolldown/build-binding.ts",
      "packages/rolldown/copy-addon-plugin.ts",
      "packages/rolldown/package.json",
      "packages/rolldown/tsconfig.json",
      "packages/rolldown/src/index.ts",
      "packages/rolldown/src/nested/helper.ts",
      "packages/rolldown/src/rolldown-binding.linux-x64-gnu.node",
      "packages/rolldown/dist/index.mjs",
      "packages/rolldown/dist/rolldown-binding.linux-x64-gnu.node",
      "examples/unrelated.ts",
    ].map((path) => "rolldown/" + path),
  ];
  for (const path of files) {
    mkdirSync(join(source, path, ".."), { recursive: true });
    writeFileSync(join(source, path), path + "\n");
  }
  return source;
}

for (const input of [
  "packages/rolldown/src/index.ts",
  "packages/rolldown/src/nested/helper.ts",
  "packages/rolldown/copy-addon-plugin.ts",
  "packages/rolldown/tsconfig.json",
  "tsconfig.json",
  "../pnpm-lock.yaml",
  "crates/test/lib.rs",
]) {
  test(`Rolldown reuse invalidates when build input changes: ${input}`, async () => {
    const source = rolldownFixture();
    try {
      const before = await rolldownBuildRecord(source);
      const file = join(source, "rolldown", input);
      const original = readFileSync(file);
      writeFileSync(file, Buffer.concat([original, Buffer.from("changed\n")]));
      const after = await rolldownBuildRecord(source);
      assert.notDeepEqual(
        after.inputs,
        before.inputs,
        "recorded outputs alone cannot authorize reuse",
      );
      assert.deepEqual(after.outputs, before.outputs);
      writeFileSync(file, original);
      assert.deepEqual(await rolldownBuildRecord(source), before);
    } finally {
      rmSync(source, { recursive: true, force: true });
    }
  });
}

test("Rolldown reuse keeps unrelated examples outside inputs and validates output bytes", async () => {
  const source = rolldownFixture();
  try {
    const before = await rolldownBuildRecord(source);
    writeFileSync(join(source, "rolldown/examples/unrelated.ts"), "unrelated change");
    assert.deepEqual(await rolldownBuildRecord(source), before);
    writeFileSync(join(source, "rolldown/packages/rolldown/dist/index.mjs"), "changed output");
    const after = await rolldownBuildRecord(source);
    assert.deepEqual(after.inputs, before.inputs);
    assert.notDeepEqual(after.outputs, before.outputs);
  } finally {
    rmSync(source, { recursive: true, force: true });
  }
});

function fixture(corepack) {
  const root = mkdtempSync(join(tmpdir(), "source environment "));
  const bin = join(root, "root-bin");
  mkdirSync(bin);
  for (const [name, body] of Object.entries({
    corepack,
    pnpm: 'process.stderr.write("wrong root pnpm"); process.exit(42);',
  })) {
    const file = join(bin, name);
    writeFileSync(file, `#!/usr/bin/env node\n${body}\n`);
    chmodSync(file, 0o755);
  }
  const previous = { ...process.env };
  process.env.PATH = `${bin}${delimiter}${process.env.PATH}`;
  return {
    root,
    restore() {
      process.env = previous;
      rmSync(root, { recursive: true, force: true });
    },
  };
}

test("nested pnpm uses a private Corepack shim while root pnpm stays intact", () => {
  const f = fixture(`
    const fs = require("node:fs");
    const path = require("node:path");
    const args = process.argv.slice(2);
    const bin = args[args.indexOf("--install-directory") + 1];
    if (args[0] !== "enable" || !bin || args.at(-1) !== "pnpm") process.exit(7);
    fs.appendFileSync(path.join(bin, "enable.log"), "enabled\\n");
    const shim = path.join(bin, "pnpm");
    fs.writeFileSync(shim, '#!/usr/bin/env node\\nconsole.log("selected source manager");\\n');
    fs.chmodSync(shim, 0o755);
  `);
  try {
    process.env.COREPACK_ENABLE_PROJECT_SPEC = "0";
    process.env.TIARA_VITE_PLUS_PNPM_STORE_DIR = "/owned/store";
    process.env.TIARA_VITE_PLUS_PNPM_VIRTUAL_STORE_DIR = "/owned/virtual-store";
    const env = sourceEnvironment(f.root);
    const nested = spawnSync("pnpm", ["run", "nested"], { env, encoding: "utf8" });
    assert.equal(nested.status, 0, nested.stderr);
    assert.equal(nested.stdout.trim(), "selected source manager");
    assert.equal(env.COREPACK_ENABLE_PROJECT_SPEC, "1");
    assert.equal(env.PNPM_CONFIG_STORE_DIR, "/owned/store");
    assert.equal(env.PNPM_CONFIG_VIRTUAL_STORE_DIR, "/owned/virtual-store");
    sourceEnvironment(f.root);
    assert.equal(
      readFileSync(join(f.root, ".tmp/vite-plus-corepack/enable.log"), "utf8"),
      "enabled\n",
    );
    const root = spawnSync("pnpm", ["--version"], { encoding: "utf8" });
    assert.equal(root.status, 42);
    assert.equal(root.stderr, "wrong root pnpm");
    assert.equal(process.env.COREPACK_ENABLE_PROJECT_SPEC, "0");
  } finally {
    f.restore();
  }
});

test("Corepack shim failure stops the source command without a root fallback", () => {
  const f = fixture('process.stderr.write("shim creation failed"); process.exit(7);');
  try {
    assert.throws(
      () => sourceEnvironment(f.root),
      /Preparing source pnpm shim failed: shim creation failed/,
    );
  } finally {
    f.restore();
  }
});
