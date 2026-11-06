import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import test from "node:test";
import { sourceEnvironment } from "../lib/vite-plus-source-environment.mjs";

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
