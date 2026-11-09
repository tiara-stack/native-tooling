import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repository = dirname(fileURLToPath(new URL("../../package.json", import.meta.url)));
test("scoped package tools resolve their Vite config peer to local source", () => {
  const expected = realpathSync(
    join(repository, "packages/vite-plus-effect-fork/packages/cli/package.json"),
  );
  for (const name of ["oxfmt", "oxlint"]) {
    const from = realpathSync(
      join(repository, "packages/vite-plus/node_modules", name, "package.json"),
    );
    assert.equal(realpathSync(createRequire(from).resolve("vite-plus/package.json")), expected);
  }
});
function put(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
function snapshot(path, base = path) {
  return Object.fromEntries(
    readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
      const file = join(path, entry.name);
      return entry.isDirectory()
        ? Object.entries(snapshot(file, base))
        : [[relative(base, file), readFileSync(file, "utf8")]];
    }),
  );
}
function fixture(fault) {
  const root = mkdtempSync(join(tmpdir(), "vite-plus-sync-"));
  put(join(root, "package.json"), "{}");
  for (const path of [
    "scripts/sync-vite-plus.mjs",
    "scripts/lib/vite-plus-source-environment.mjs",
    "scripts/lib/replace-package-trees.mjs",
    "scripts/lib/scoped-vite-plus.mjs",
  ]) {
    if (existsSync(join(repository, path))) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      cpSync(join(repository, path), join(root, path));
    }
  }
  mkdirSync(join(root, "node_modules"));
  symlinkSync(
    dirname(createRequire(import.meta.url).resolve("typescript/package.json")),
    join(root, "node_modules/typescript"),
  );
  const source = join(root, "packages/vite-plus-effect-fork");
  const archives = {};
  const outputs = {};
  for (const kind of ["core", "cli"]) {
    const path = join(source, "packages", kind);
    const files =
      kind === "core"
        ? ["dist/vite/node/index.js", "dist/tsdown/index.js"]
        : ["dist/bin.js", "dist/test/index.js", "dist/test/index.d.ts"];
    for (const file of files) {
      put(join(path, file), "export {};\n");
      outputs["packages/" + kind + "/" + file] = createHash("sha256")
        .update("export {};\n")
        .digest("hex");
    }
    put(
      join(path, "package.json"),
      JSON.stringify({
        name: kind === "core" ? "@voidzero-dev/vite-plus-core" : "vite-plus",
        version: "1.0.0",
        files: ["dist"],
        ...(kind === "cli"
          ? { exports: { "./test": "./dist/test/index.js" }, dependencies: { vitest: "5.0.1" } }
          : {}),
      }),
    );
    const payload = join(root, "payloads", kind);
    mkdirSync(payload, { recursive: true });
    cpSync(path, join(payload, "package"), { recursive: true });
    const archive = join(root, kind + ".tgz");
    const tar = spawnSync("tar", ["-czf", archive, "-C", payload, "package"], { encoding: "utf8" });
    assert.equal(tar.status, 0, tar.stderr);
    archives[kind] = archive;
  }
  const script = "scripts/sync-vite-plus.mjs";
  put(
    join(root, ".tmp/vite-plus-source-build.json"),
    JSON.stringify({
      pin: "fc287d7b1c0dc008dbc65d1d2b2f51a44e2a5ea4",
      rootInputs: {
        [script]: createHash("sha256")
          .update(readFileSync(join(root, script)))
          .digest("hex"),
      },
      inputs: {},
      outputs,
    }),
  );
  const bin = join(root, "mock-bin");
  put(
    join(bin, "corepack"),
    [
      "#!/usr/bin/env node",
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      "const args = process.argv.slice(2);",
      'if (args[0] === "enable") process.exit(0);',
      'if (args[0] !== "pnpm" || args[1] !== "pack") process.exit(7);',
      "const archives = " + JSON.stringify(archives) + ";",
      'fs.copyFileSync(archives[path.basename(process.cwd())], args[args.indexOf("--out") + 1]);',
    ].join("\n"),
  );
  chmodSync(join(bin, "corepack"), 0o755);
  const targets = ["vite-plus-core", "vite-plus"].map((name) => join(root, "packages", name));
  for (const target of targets) {
    put(join(target, "package.json"), JSON.stringify({ name: "retained", version: "old" }));
    put(join(target, "SOURCE.json"), JSON.stringify({ retained: target }));
    put(join(target, "sentinel.txt"), "retained bytes");
    put(join(target, "node_modules/sentinel"), "retained runtime");
  }
  const before = targets.map((path) => snapshot(path));
  const runtimeInodes = targets.map((path) => statSync(join(path, "node_modules")).ino);
  const preloader = join(root, "fault.mjs");
  put(
    preloader,
    [
      'import fs from "node:fs/promises";',
      'import { syncBuiltinESMExports } from "node:module";',
      "const target = " + JSON.stringify(targets[1]) + ";",
      "const coreTarget = " + JSON.stringify(targets[0]) + ";",
      "const mode = " + JSON.stringify(fault) + ";",
      "const original = { cp: fs.cp, rm: fs.rm, rename: fs.rename };",
      "let failed = false, rollbackFailed = false;",
      'const fail = () => { failed = true; throw new Error("replacement fault"); };',
      "fs.cp = async (from, to, ...args) => {",
      '  if (!failed && ["install", "rollback"].includes(mode) && to === target) fail();',
      "  return original.cp(from, to, ...args);",
      "};",
      "fs.rm = async (path, ...args) => {",
      '  if (!failed && mode === "backup" && path === target + "/SOURCE.json") fail();',
      "  return original.rm(path, ...args);",
      "};",
      "fs.rename = async (from, to) => {",
      '  if (!failed && ((mode === "backup" && from === target + "/SOURCE.json") ||',
      '      (["install", "rollback"].includes(mode) && to === target + "/package.json" && from.includes("/.tmp/vite-plus-sync-")))) fail();',
      '  if (mode === "rollback" && failed && !rollbackFailed && from.includes("/vite-plus-backup-") && to === coreTarget + "/SOURCE.json") {',
      '    rollbackFailed = true; throw new Error("rollback fault");',
      "  }",
      "  return original.rename(from, to);",
      "};",
      "syncBuiltinESMExports();",
    ].join("\n"),
  );
  return { root, bin, targets, before, runtimeInodes, preloader };
}

for (const fault of ["backup", "install", "rollback", undefined]) {
  test(
    "scoped package pair " +
      (fault === "rollback"
        ? "retains backups when rollback fails"
        : fault
          ? "rolls back after " + fault + " failure"
          : "commits with retained runtimes"),
    () => {
      const f = fixture(fault);
      try {
        const result = spawnSync(
          process.execPath,
          ["--import", f.preloader, join(f.root, "scripts/sync-vite-plus.mjs")],
          {
            cwd: f.root,
            encoding: "utf8",
            env: {
              ...process.env,
              PATH: f.bin + ":" + dirname(process.execPath) + ":" + process.env.PATH,
            },
          },
        );
        if (fault) {
          assert.notEqual(result.status, 0);
          assert.match(result.stderr, /replacement fault/);
          if (fault === "rollback") {
            assert.match(result.stderr, /rollback is incomplete; retained backup/);
            const retained = readdirSync(join(f.root, ".tmp")).find((name) =>
              name.startsWith("vite-plus-backup-"),
            );
            assert.ok(retained);
            assert.equal(
              readFileSync(join(f.root, ".tmp", retained, "0/SOURCE.json"), "utf8"),
              f.before[0]["SOURCE.json"],
            );
          } else {
            assert.deepEqual(
              f.targets.map((path) => snapshot(path)),
              f.before,
            );
          }
        } else {
          assert.equal(result.status, 0, result.stderr);
          assert.deepEqual(
            f.targets.map(
              (path) => JSON.parse(readFileSync(join(path, "package.json"), "utf8")).name,
            ),
            ["@tiara-stack/vite-plus-core", "@tiara-stack/vite-plus"],
          );
          assert.equal(
            readFileSync(join(f.targets[0], "SOURCE.json"), "utf8"),
            readFileSync(join(f.targets[1], "SOURCE.json"), "utf8"),
          );
          for (const path of f.targets) assert.equal(existsSync(join(path, "sentinel.txt")), false);
        }
        assert.deepEqual(
          f.targets.map((path) => statSync(join(path, "node_modules")).ino),
          f.runtimeInodes,
        );
        for (const path of f.targets)
          assert.equal(
            readFileSync(join(path, "node_modules/sentinel"), "utf8"),
            "retained runtime",
          );
      } finally {
        rmSync(f.root, { recursive: true, force: true });
      }
    },
  );
}
