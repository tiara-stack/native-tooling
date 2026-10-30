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
      { encoding: "utf8", env: { ...cleanEnv, ...resolved.envs } },
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

const adapter = join(root, "packages/vite-plus-effect-fork/packages/cli/bin/tiara-oxlint.mjs");
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
  "native lint adapter reloads LSP settings and cleans up after termination",
  { timeout: 15000 },
  async () => {
    const fixture = adapterFixture();
    let child;
    let exited;
    const waitFor = async (check) => {
      const deadline = Date.now() + 8000;
      while (Date.now() < deadline) {
        if (check()) return;
        await new Promise((done) => setTimeout(done, 40));
      }
      throw new Error("Timed out waiting for native lint adapter state");
    };
    try {
      const configPath = join(fixture.directory, "vite.config.ts");
      writeFileSync(
        configPath,
        'export default { lint: { rules: { "no-debugger": "error" } } };\n',
      );
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
      assert.equal(
        JSON.parse(readFileSync(record.configPath, "utf8")).rules["no-debugger"],
        "error",
      );
      writeFileSync(configPath, 'export default { lint: { rules: { "no-debugger": "off" } } };\n');
      await waitFor(
        () => JSON.parse(readFileSync(record.configPath, "utf8")).rules["no-debugger"] === "off",
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
