import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test } from "node:test";

const root = dirname(fileURLToPath(new URL("../../package.json", import.meta.url)));
const lint = pathToFileURL(
  join(root, "packages/vite-plus-effect-fork/packages/cli/src/resolve-lint.ts"),
).href;
const resolve = pathToFileURL(
  join(root, "packages/vite-plus-effect-fork/packages/cli/src/utils/tiara-native.ts"),
).href;
const cleanEnv = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => !name.startsWith("TIARA_")),
);

test("lint keeps the Vite config handoff while selecting explicit native overrides", () => {
  const fixture = mkdtempSync(join(tmpdir(), "tiara-lint-paths-"));
  try {
    const oxlint = process.execPath;
    const tsgolint = join(fixture, "tsgolint");
    writeFileSync(join(fixture, ".oxlintrc.json"), "{}");
    writeFileSync(tsgolint, "");
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { lint } from ${JSON.stringify(lint)}; console.log(JSON.stringify(await lint()));`,
      ],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...cleanEnv,
          TIARA_OXLINT_EFFECT_PATH: oxlint,
          TIARA_TSGOLINT_EFFECT_PATH: tsgolint,
        },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const resolved = JSON.parse(result.stdout);
    assert.equal(
      resolved.binPath,
      join(root, "packages/vite-plus-effect-fork/packages/cli/bin/tiara-oxlint.mjs"),
    );
    assert.equal(resolved.envs.TIARA_OXLINT_EFFECT_PATH, oxlint);
    assert.equal(resolved.envs.OXLINT_TSGOLINT_PATH, tsgolint);
    assert.equal(resolved.envs.VP_RESOLVING_CONFIG_METADATA, "1");
    const launched = spawnSync(
      process.execPath,
      [
        resolved.binPath,
        "--input-type=module",
        "-e",
        "console.log(JSON.stringify({ metadata: process.env.VP_RESOLVING_CONFIG_METADATA, tsgolint: process.env.OXLINT_TSGOLINT_PATH }))",
      ],
      { cwd: fixture, encoding: "utf8", env: { ...cleanEnv, ...resolved.envs } },
    );
    assert.equal(launched.status, 0, launched.stderr);
    assert.deepEqual(JSON.parse(launched.stdout), { metadata: "1", tsgolint });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("source tooling fails clearly on a missing local build instead of resolving a published tool", () => {
  const fixture = mkdtempSync(join(tmpdir(), "tiara-empty-source-"));
  try {
    writeFileSync(
      join(fixture, "package.json"),
      JSON.stringify({ name: "@tiara-stack/native-tooling-monorepo" }),
    );
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { resolveTiaraNative } from ${JSON.stringify(resolve)}; resolveTiaraNative("tsgo");`,
      ],
      { cwd: fixture, encoding: "utf8", env: cleanEnv },
    );
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /Missing Tiara tsgo build at .*tiara-empty-source-.*native\/typescript-go\/built\/local\/tsgo/,
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("source tooling selects each native build from the command's checkout", () => {
  const fixture = mkdtempSync(join(tmpdir(), "tiara-built-source-"));
  try {
    writeFileSync(
      join(fixture, "package.json"),
      JSON.stringify({ name: "@tiara-stack/native-tooling-monorepo" }),
    );
    const suffix = process.platform === "win32" ? ".exe" : "";
    const expected = {
      oxlint: join(fixture, "native/oxc-oxlint-effect-fork/target/release", `oxlint${suffix}`),
      tsgolint: join(fixture, "native/tsgolint-effect-fork", `tsgolint${suffix}`),
      tsgo: join(fixture, "native/typescript-go/built/local", `tsgo${suffix}`),
    };
    for (const path of Object.values(expected)) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, "");
    }
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { resolveTiaraNative } from ${JSON.stringify(resolve)}; console.log(JSON.stringify(Object.fromEntries(["oxlint", "tsgolint", "tsgo"].map((tool) => [tool, resolveTiaraNative(tool)]))));`,
      ],
      { cwd: fixture, encoding: "utf8", env: cleanEnv },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), expected);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("source detection skips malformed and unreadable ancestor manifests", () => {
  const fixture = mkdtempSync(join(tmpdir(), "tiara-source-manifests-"));
  try {
    writeFileSync(
      join(fixture, "package.json"),
      JSON.stringify({ name: "@tiara-stack/native-tooling-monorepo" }),
    );
    const expected = join(
      fixture,
      `native/typescript-go/built/local/tsgo${process.platform === "win32" ? ".exe" : ""}`,
    );
    mkdirSync(dirname(expected), { recursive: true });
    writeFileSync(expected, "");
    for (const { name, manifest } of [
      { name: "malformed", manifest: "{" },
      { name: "non-object", manifest: "null" },
      { name: "unreadable", manifest: undefined },
    ]) {
      const ancestor = join(fixture, name);
      const cwd = join(ancestor, "project");
      mkdirSync(cwd, { recursive: true });
      writeFileSync(join(cwd, "package.json"), "{}");
      if (manifest === undefined) mkdirSync(join(ancestor, "package.json"));
      else writeFileSync(join(ancestor, "package.json"), manifest);
      const result = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `import { resolveTiaraNative } from ${JSON.stringify(resolve)}; console.log(resolveTiaraNative("tsgo"));`,
        ],
        { cwd, encoding: "utf8", env: cleanEnv },
      );
      assert.equal(result.status, 0, `${name}: ${result.stderr}`);
      assert.equal(result.stdout.trim(), expected);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("an invalid override fails instead of silently selecting another binary", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { resolveTiaraNative } from ${JSON.stringify(resolve)}; resolveTiaraNative("tsgo");`,
    ],
    {
      cwd: root,
      encoding: "utf8",
      env: { ...cleanEnv, TIARA_TSGO_EFFECT_PATH: join(root, ".tmp/missing-tsgo") },
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing Tiara tsgo build at .*\.tmp\/missing-tsgo/);
});

const adapter =
  process.env.TIARA_TEST_ADAPTER ??
  join(root, "packages/vite-plus-effect-fork/packages/cli/bin/tiara-oxlint.mjs");
function adapterFixture() {
  mkdirSync(join(root, ".tmp"), { recursive: true });
  const directory = mkdtempSync(join(root, ".tmp/native-lint-test-"));
  writeFileSync(join(directory, "package.json"), JSON.stringify({ type: "module", private: true }));
  const native = join(directory, "native.mjs");
  writeFileSync(
    native,
    `#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
const args = process.argv.slice(2);
const configPath = args[args.indexOf("--config") + 1];
const config = JSON.parse(readFileSync(configPath, "utf8"));
const record = { args, configPath, config, inherited: (config.extends ?? []).map((path) => JSON.parse(readFileSync(path, "utf8"))), metadata: process.env.VP_RESOLVING_CONFIG_METADATA, backend: process.env.OXLINT_TSGOLINT_PATH };
writeFileSync(process.env.TIARA_TEST_RECORD, JSON.stringify(record));
if (args.includes("--lsp")) { process.on("SIGTERM", () => process.exit(0)); setInterval(() => {}, 1000); }
else process.exit(Number(process.env.TIARA_TEST_EXIT ?? 0));
`,
    { mode: 0o755 },
  );
  return {
    directory,
    record: join(directory, "record.json"),
    env: {
      ...cleanEnv,
      TIARA_OXLINT_EFFECT_PATH: native,
      OXLINT_TSGOLINT_PATH: process.execPath,
      TIARA_TEST_RECORD: join(directory, "record.json"),
    },
  };
}
function temporaryConfigs(directory) {
  return readdirSync(directory).filter((name) => name.startsWith(".tiara-oxlint-"));
}
async function waitFor(check) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    if (check()) return;
    await new Promise((done) => setTimeout(done, 40));
  }
  throw new Error("Timed out waiting for native lint adapter state");
}

test("native lint adapter preserves configuration origins and cleans up a failed child", () => {
  const fixture = adapterFixture();
  try {
    writeFileSync(
      join(fixture.directory, "vite.config.ts"),
      'export default { lint: { extends: [{ rules: { "no-debugger": "off" } }], rules: { "no-debugger": "error" }, ignorePatterns: ["ignored/**"], options: { typeAware: true } } };\n',
    );
    const result = spawnSync(process.execPath, [adapter, "input.js"], {
      cwd: fixture.directory,
      encoding: "utf8",
      env: { ...fixture.env, TIARA_TEST_EXIT: "7" },
    });
    assert.equal(result.status, 7, result.stderr);
    const record = JSON.parse(readFileSync(fixture.record, "utf8"));
    assert.equal(dirname(record.configPath), fixture.directory);
    assert.deepEqual(record.config.ignorePatterns, ["ignored/**"]);
    assert.equal(record.config.rules["no-debugger"], "error");
    assert.equal(record.inherited[0].rules["no-debugger"], "off");
    assert.ok(record.args.includes("--type-aware"));
    assert.equal(record.metadata, "1");
    assert.equal(record.backend, process.execPath);
    assert.deepEqual(temporaryConfigs(fixture.directory), []);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test("native lint adapter rejects nonserializable settings before starting a child", () => {
  const fixture = adapterFixture();
  try {
    writeFileSync(
      join(fixture.directory, "vite.config.ts"),
      "export default { lint: { rules: { invalid: () => true } } };\n",
    );
    const result = spawnSync(process.execPath, [adapter], {
      cwd: fixture.directory,
      encoding: "utf8",
      env: fixture.env,
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /serializable Rust rule settings/);
    assert.equal(existsSync(fixture.record), false);
    assert.deepEqual(temporaryConfigs(fixture.directory), []);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test(
  "native lint adapter reuses LSP snapshots and cleans up after termination",
  { timeout: 20000 },
  async () => {
    const fixture = adapterFixture();
    let child;
    let exited;
    try {
      const configPath = join(fixture.directory, "vite.config.ts");
      const update = (version, inherited = "warn") =>
        writeFileSync(
          configPath,
          `export default { lint: { settings: { react: { version: ${JSON.stringify(String(version))} } }, extends: [{ rules: { "no-console": ${JSON.stringify(inherited)} }, extends: [{ rules: { "no-alert": "error" } }] }], rules: { "no-debugger": "error" } } };\n`,
        );
      update(0);
      child = spawn(process.execPath, [adapter, "--lsp"], {
        cwd: fixture.directory,
        env: fixture.env,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stderr = "";
      child.stderr.on("data", (bytes) => {
        stderr += bytes;
      });
      exited = new Promise((done, reject) => {
        child.once("error", reject);
        child.once("exit", (code) => done(code));
      });
      await waitFor(() => existsSync(fixture.record));
      const record = JSON.parse(readFileSync(fixture.record, "utf8"));
      const current = () => JSON.parse(readFileSync(record.configPath, "utf8"));
      const initial = current();
      const initialChild = JSON.parse(readFileSync(initial.extends[0], "utf8"));
      assert.equal(initial.rules["no-debugger"], "error");
      assert.equal(temporaryConfigs(fixture.directory).length, 3);
      update(1);
      await waitFor(() => current().settings.react.version === "1");
      assert.deepEqual(current().extends, initial.extends);
      assert.equal(temporaryConfigs(fixture.directory).length, 3);

      update(2, "off");
      await waitFor(() => current().settings.react.version === "2");
      assert.notDeepEqual(current().extends, initial.extends);
      assert.equal(temporaryConfigs(fixture.directory).length, 4);
      // A reader can hold an older root while it opens that root's children.
      assert.deepEqual(JSON.parse(readFileSync(initial.extends[0], "utf8")), initialChild);
      assert.equal(
        JSON.parse(readFileSync(initialChild.extends[0], "utf8")).rules["no-alert"],
        "error",
      );
      update(3);
      await waitFor(() => current().settings.react.version === "3");
      assert.deepEqual(current().extends, initial.extends);
      assert.equal(temporaryConfigs(fixture.directory).length, 4);

      writeFileSync(
        configPath,
        "export default { lint: { extends: [{ rules: { invalid: () => true } }] } };\n",
      );
      await waitFor(() => stderr.includes("serializable Rust rule settings"));
      assert.equal(current().settings.react.version, "3");
      assert.equal(temporaryConfigs(fixture.directory).length, 4);

      // A failed root publication must reclaim its never-published children.
      const staging = record.configPath + ".writing";
      mkdirSync(staging);
      update(4, "error");
      await waitFor(() => stderr.includes("EEXIST"));
      assert.equal(current().settings.react.version, "3");
      assert.equal(
        temporaryConfigs(fixture.directory).filter((name) => !name.endsWith(".writing")).length,
        4,
      );
      rmSync(staging, { recursive: true });
      update(5, "error");
      await waitFor(() => current().settings.react.version === "5");
      assert.equal(temporaryConfigs(fixture.directory).length, 5);
      assert.deepEqual(JSON.parse(readFileSync(initial.extends[0], "utf8")), initialChild);
      child.kill("SIGTERM");
      assert.equal(await exited, 0, stderr);
      assert.deepEqual(temporaryConfigs(fixture.directory), []);
    } finally {
      if (child && child.exitCode === null) {
        child.kill("SIGTERM");
        await exited;
      }
      rmSync(fixture.directory, { recursive: true, force: true });
    }
  },
);

test(
  "native lint adapter isolates concurrently active LSP readers",
  { timeout: 15000 },
  async () => {
    const fixture = adapterFixture();
    const children = [];
    try {
      const configPath = join(fixture.directory, "vite.config.ts");
      const update = (level) =>
        writeFileSync(
          configPath,
          `export default { lint: { extends: [{ rules: { "no-console": "warn" } }], rules: { "no-debugger": ${JSON.stringify(level)} } } };\n`,
        );
      update("error");
      for (let index = 0; index < 2; index++) {
        const recordPath = join(fixture.directory, `record-${index}.json`);
        const child = spawn(process.execPath, [adapter, "--lsp"], {
          cwd: fixture.directory,
          env: { ...fixture.env, TIARA_TEST_RECORD: recordPath },
          stdio: ["ignore", "ignore", "pipe"],
        });
        const exited = new Promise((done, reject) => {
          child.once("error", reject);
          child.once("exit", done);
        });
        child.stderr.resume();
        children.push({ child, exited, recordPath });
      }
      await waitFor(() => children.every(({ recordPath }) => existsSync(recordPath)));
      const records = children.map(({ recordPath }) =>
        JSON.parse(readFileSync(recordPath, "utf8")),
      );
      assert.notEqual(records[0].configPath, records[1].configPath);
      children[0].child.kill("SIGTERM");
      assert.equal(await children[0].exited, 0);
      assert.equal(existsSync(records[0].configPath), false);
      const current = () => JSON.parse(readFileSync(records[1].configPath, "utf8"));
      assert.equal(
        JSON.parse(readFileSync(current().extends[0], "utf8")).rules["no-console"],
        "warn",
      );
      update("off");
      await waitFor(() => current().rules["no-debugger"] === "off");
      assert.equal(temporaryConfigs(fixture.directory).length, 2);
      children[1].child.kill("SIGTERM");
      assert.equal(await children[1].exited, 0);
      assert.deepEqual(temporaryConfigs(fixture.directory), []);
    } finally {
      for (const { child } of children) {
        if (child.exitCode === null) child.kill("SIGTERM");
      }
      await Promise.allSettled(children.map(({ exited }) => exited));
      rmSync(fixture.directory, { recursive: true, force: true });
    }
  },
);

test("native lint adapter cleans up when the native child cannot start", () => {
  const fixture = adapterFixture();
  try {
    writeFileSync(
      join(fixture.directory, "vite.config.ts"),
      'export default { lint: { extends: [{ rules: { "no-console": "warn" } }] } };\n',
    );
    const result = spawnSync(process.execPath, [adapter], {
      cwd: fixture.directory,
      encoding: "utf8",
      env: { ...fixture.env, TIARA_OXLINT_EFFECT_PATH: join(fixture.directory, "missing") },
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ENOENT/);
    assert.deepEqual(temporaryConfigs(fixture.directory), []);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

for (const fault of [
  "missing-child",
  "unlink-denied",
  "child-write",
  "child-rename",
  "root-rename",
]) {
  test(
    "native lint adapter recovers from " + fault + " during publication",
    { timeout: 15000 },
    async () => {
      const fixture = adapterFixture();
      let child;
      let exited;
      try {
        const configPath = join(fixture.directory, "vite.config.ts");
        const armed = join(fixture.directory, "armed");
        const preloader = join(fixture.directory, "fault.mjs");
        writeFileSync(
          preloader,
          [
            'import fs from "node:fs/promises";',
            'import { existsSync } from "node:fs";',
            'import { syncBuiltinESMExports } from "node:module";',
            "const armed = " + JSON.stringify(armed) + ";",
            "const mode = " + JSON.stringify(fault) + ";",
            "const original = { rename: fs.rename, unlink: fs.unlink, writeFile: fs.writeFile, open: fs.open };",
            "let failed = false, reclaimed = false;",
            'const childStage = (path) => String(path).includes(".tiara-oxlint-") && String(path).endsWith(".writing") && !String(path).endsWith("-root.json.writing");',
            'const fail = (message, code = "EIO") => Object.assign(new Error(message), { code });',
            "fs.rename = async (from, to) => {",
            '  if (existsSync(armed) && !failed && ((mode === "child-rename" && childStage(from)) || (mode !== "child-write" && mode !== "child-rename" && String(to).endsWith("-root.json")))) {',
            '    failed = true; throw fail("publication fault");',
            "  }",
            "  return original.rename(from, to);",
            "};",
            "fs.unlink = async (path) => {",
            '  if (failed && !reclaimed && ["missing-child", "unlink-denied"].includes(mode) && String(path).endsWith(".json") && !String(path).endsWith("-root.json")) {',
            "    reclaimed = true;",
            '    if (mode === "missing-child") { await original.unlink(path); throw fail("already removed child", "ENOENT"); }',
            '    throw fail("reclamation fault", "EACCES");',
            "  }",
            "  return original.unlink(path);",
            "};",
            "fs.writeFile = async (path, ...args) => {",
            "  const result = await original.writeFile(path, ...args);",
            '  if (existsSync(armed) && !failed && mode === "child-write" && childStage(path)) { failed = true; throw fail("publication fault"); }',
            "  return result;",
            "};",
            "fs.open = async (path, ...args) => {",
            "  const handle = await original.open(path, ...args);",
            "  const write = handle.writeFile.bind(handle);",
            "  handle.writeFile = async (...args) => {",
            "    const result = await write(...args);",
            '    if (existsSync(armed) && !failed && mode === "child-write" && childStage(path)) { failed = true; throw fail("publication fault"); }',
            "    return result;",
            "  };",
            "  return handle;",
            "};",
            "syncBuiltinESMExports();",
          ].join("\n"),
        );
        const update = (version, level) =>
          writeFileSync(
            configPath,
            "export default " +
              JSON.stringify({
                lint: {
                  settings: { version },
                  extends: [
                    { rules: { "no-console": level }, extends: [{ rules: { "no-alert": level } }] },
                  ],
                },
              }) +
              ";\n",
          );
        update(0, "warn");
        child = spawn(process.execPath, ["--import", preloader, adapter, "--lsp"], {
          cwd: fixture.directory,
          env: fixture.env,
          stdio: ["ignore", "ignore", "pipe"],
        });
        let stderr = "";
        child.stderr.on("data", (bytes) => {
          stderr += bytes;
        });
        exited = new Promise((done, reject) => {
          child.once("error", reject);
          child.once("exit", done);
        });
        await waitFor(() => existsSync(fixture.record));
        const record = JSON.parse(readFileSync(fixture.record, "utf8"));
        const current = () => JSON.parse(readFileSync(record.configPath, "utf8"));
        const initial = current();
        writeFileSync(armed, "");
        update(1, "off");
        await waitFor(() => stderr.length > 0);
        assert.match(stderr, /publication fault/);
        assert.doesNotMatch(stderr, /already removed child|reclamation fault/);
        assert.deepEqual(current(), initial);
        assert.equal(
          temporaryConfigs(fixture.directory).some((name) => name.endsWith(".writing")),
          false,
        );
        assert.equal(temporaryConfigs(fixture.directory).length, fault === "unlink-denied" ? 4 : 3);
        update(2, "off");
        await waitFor(() => current().settings.version === 2);
        const inherited = JSON.parse(readFileSync(current().extends[0], "utf8"));
        assert.equal(inherited.rules["no-console"], "off");
        assert.equal(
          JSON.parse(readFileSync(inherited.extends[0], "utf8")).rules["no-alert"],
          "off",
        );
        child.kill("SIGTERM");
        assert.equal(await exited, 0, stderr);
        assert.deepEqual(temporaryConfigs(fixture.directory), []);
      } finally {
        if (child && child.exitCode === null) {
          child.kill("SIGTERM");
          await exited;
        }
        rmSync(fixture.directory, { recursive: true, force: true });
      }
    },
  );
}

test(
  "native lint adapter preserves a staging file it did not create",
  { timeout: 15000 },
  async () => {
    const fixture = adapterFixture();
    let child;
    let exited;
    try {
      const configPath = join(fixture.directory, "vite.config.ts");
      writeFileSync(configPath, "export default { lint: { settings: { version: 0 } } };\n");
      child = spawn(process.execPath, [adapter, "--lsp"], {
        cwd: fixture.directory,
        env: fixture.env,
        stdio: ["ignore", "ignore", "pipe"],
      });
      let stderr = "";
      child.stderr.on("data", (bytes) => {
        stderr += bytes;
      });
      exited = new Promise((done, reject) => {
        child.once("error", reject);
        child.once("exit", done);
      });
      await waitFor(() => existsSync(fixture.record));
      const record = JSON.parse(readFileSync(fixture.record, "utf8"));
      const staging = record.configPath + ".writing";
      writeFileSync(staging, "pre-existing bytes");
      writeFileSync(configPath, "export default { lint: { settings: { version: 1 } } };\n");
      await waitFor(() => stderr.includes("EEXIST"));
      child.kill("SIGTERM");
      assert.equal(await exited, 0, stderr);
      assert.equal(readFileSync(staging, "utf8"), "pre-existing bytes");
      assert.deepEqual(temporaryConfigs(fixture.directory), [
        staging.slice(fixture.directory.length + 1),
      ]);
    } finally {
      if (child && child.exitCode === null) {
        child.kill("SIGTERM");
        await exited;
      }
      rmSync(fixture.directory, { recursive: true, force: true });
    }
  },
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  for (const phase of [
    "resolve-config",
    "child-write",
    "child-published",
    "root-published",
    "spawn",
    "cleanup",
  ]) {
    test(`native lint adapter handles ${signal} during ${phase}`, () => {
      const fixture = adapterFixture();
      try {
        const preloader = join(fixture.directory, "signal.mjs");
        writeFileSync(
          preloader,
          [
            'import fs from "node:fs/promises";',
            'import cp from "node:child_process";',
            'import { syncBuiltinESMExports } from "node:module";',
            `const phase = ${JSON.stringify(phase)}, signal = ${JSON.stringify(signal)};`,
            "const original = { open: fs.open, rename: fs.rename, unlink: fs.unlink, spawn: cp.spawn };",
            "let interrupted = false;",
            "async function interrupt() {",
            "  if (interrupted) return;",
            "  interrupted = true; process.kill(process.pid, signal);",
            "  await new Promise((done) => setTimeout(done, 100));",
            "}",
            'const owned = (path) => String(path).includes(".tiara-oxlint-");',
            "fs.open = async (path, ...args) => {",
            "  const handle = await original.open(path, ...args);",
            "  const write = handle.writeFile.bind(handle);",
            "  handle.writeFile = async (...args) => {",
            "    const result = await write(...args);",
            '    if (phase === "child-write" && owned(path) && !String(path).endsWith("-root.json.writing")) await interrupt();',
            "    return result;",
            "  };",
            "  return handle;",
            "};",
            "fs.rename = async (from, to) => {",
            "  const result = await original.rename(from, to);",
            '  if (owned(to) && ((phase === "child-published" && !String(to).endsWith("-root.json")) || (phase === "root-published" && String(to).endsWith("-root.json")))) await interrupt();',
            "  return result;",
            "};",
            "fs.unlink = async (path) => {",
            '  if (phase === "cleanup" && owned(path)) await interrupt();',
            "  return original.unlink(path);",
            "};",
            "cp.spawn = (...args) => {",
            "  const child = original.spawn(...args);",
            '  if (phase === "spawn") process.kill(process.pid, signal);',
            "  return child;",
            "};",
            "syncBuiltinESMExports();",
          ].join("\n"),
        );
        writeFileSync(
          join(fixture.directory, "vite.config.ts"),
          (phase === "resolve-config"
            ? `process.kill(process.pid, ${JSON.stringify(signal)}); await new Promise((done) => setTimeout(done, 100));\n`
            : "") +
            'export default { lint: { extends: [{ rules: { "no-console": "warn" } }] } };\n',
        );
        const result = spawnSync(process.execPath, ["--import", preloader, adapter], {
          cwd: fixture.directory,
          encoding: "utf8",
          env: { ...fixture.env, TIARA_TEST_EXIT: "7" },
          timeout: 10000,
        });
        assert.equal(result.error, undefined, result.stderr);
        assert.deepEqual(temporaryConfigs(fixture.directory), []);
        assert.equal(result.signal, null, result.stderr);
        if (phase === "cleanup") {
          assert.equal(result.status, 7, result.stderr);
          assert.equal(existsSync(fixture.record), true);
        } else if (phase === "spawn") {
          assert.ok([7, signal === "SIGINT" ? 130 : 143].includes(result.status));
        } else {
          assert.equal(result.status, signal === "SIGINT" ? 130 : 143, result.stderr);
          assert.equal(existsSync(fixture.record), false);
        }
      } finally {
        rmSync(fixture.directory, { recursive: true, force: true });
      }
    });
  }
}

test("native lint adapter forwards SIGINT to an active native reader before cleanup", async () => {
  const fixture = adapterFixture();
  let child;
  let exited;
  try {
    writeFileSync(
      join(fixture.directory, "vite.config.ts"),
      'export default { lint: { extends: [{ rules: { "no-console": "warn" } }] } };\n',
    );
    child = spawn(process.execPath, [adapter, "--lsp"], {
      cwd: fixture.directory,
      env: fixture.env,
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    child.stderr.on("data", (bytes) => {
      stderr += bytes;
    });
    exited = new Promise((done, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) => done({ code, signal }));
    });
    await waitFor(() => existsSync(fixture.record));
    child.kill("SIGINT");
    assert.deepEqual(await exited, { code: 130, signal: null }, stderr);
    assert.deepEqual(temporaryConfigs(fixture.directory), []);
  } finally {
    if (child && child.exitCode === null) {
      child.kill("SIGTERM");
      await exited;
    }
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});
