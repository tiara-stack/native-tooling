#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../../package.json", import.meta.url)));
const fixture = await mkdtemp(join(tmpdir(), "tiara-vitest5-consumer-"));
await mkdir(join(root, ".tmp/TIA-314"), { recursive: true });
await writeFile(join(root, ".tmp/TIA-314/consumer-path.txt"), `${fixture}\n`);
const tarballs = {};
for (const name of [
  "vite-plus-core",
  "vite-plus",
  "effect-vitest",
  "oxlint-effect",
  "tsgo-effect",
  "tsgolint-effect",
]) {
  const archive = join(fixture, `${name}.tgz`);
  run("pnpm", ["pack", "--out", archive], join(root, "packages", name));
  tarballs[`@tiara-stack/${name}`] = `file:${archive}`;
}
const core = JSON.parse(await readFile(join(root, "packages/vite-plus-core/package.json"), "utf8"));
const cli = JSON.parse(await readFile(join(root, "packages/vite-plus/package.json"), "utf8"));
const helper = JSON.parse(
  await readFile(join(root, "packages/effect-vitest/package.json"), "utf8"),
);
assert.equal(helper.peerDependencies["@tiara-stack/vite-plus"], `>=${cli.version} <2.0.0`);
assert.equal(core.version, cli.version);
const dependencies = {
  ...tarballs,
  vite: tarballs["@tiara-stack/vite-plus-core"],
  effect: "4.0.1",
  typescript: "5.9.3",
  "@types/node": "24.7.2",
};
await writeFile(
  join(fixture, "package.json"),
  `${JSON.stringify(
    {
      name: "tiara-vitest5-consumer",
      private: true,
      type: "module",
      packageManager: "pnpm@11.9.0",
      dependencies,
    },
    null,
    2,
  )}\n`,
);
await writeFile(
  join(fixture, "pnpm-workspace.yaml"),
  `overrides:\n${Object.entries({ ...tarballs, vite: dependencies.vite })
    .map(([name, value]) => `  '${name}': '${value}'`)
    .join("\n")}\npeerDependencyRules:\n  allowAny:\n    - vite\n`,
);
run(
  "pnpm",
  [
    "install",
    "--ignore-scripts",
    "--store-dir",
    join(fixture, "store"),
    "--virtual-store-dir",
    join(fixture, "node_modules/.pnpm"),
  ],
  fixture,
);
await writeFile(
  join(fixture, "check-native.cjs"),
  `
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { dirname, join, relative, sep } = require("node:path");
const { readFileSync, realpathSync } = require("node:fs");
async function main() {
  const packageRoot = dirname(require.resolve("@tiara-stack/vite-plus/package.json"));
  const coreRoot = dirname(require.resolve("vite/package.json"));
  const binding = require(join(packageRoot, "binding/index.cjs"));
  assert.equal(typeof binding.run, "function");
  await import("vite/rolldown");
  const loaded = Object.keys(require.cache).filter((path) => path.endsWith(".node"));
  for (const [root, directory, prefix] of [[packageRoot, "binding", "packages/cli/"], [coreRoot, "dist/rolldown", "packages/core/"]]) {
    const files = loaded.filter((path) => realpathSync(path).startsWith(join(realpathSync(root), directory) + sep));
    assert.ok(files.length, JSON.stringify({ directory, loaded }));
    const provenance = JSON.parse(readFileSync(join(root, "SOURCE.json"), "utf8"));
    for (const path of files) {
      const key = prefix + relative(realpathSync(root), realpathSync(path)).split(sep).join("/");
      assert.equal(createHash("sha256").update(readFileSync(path)).digest("hex"), provenance.outputs[key], key);
    }
  }
  console.log("Loaded packed local core and CLI native bindings: " + JSON.stringify(loaded));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
`,
);
run(process.execPath, [join(fixture, "check-native.cjs")], fixture);
await writeFile(
  join(fixture, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        module: "NodeNext",
        moduleResolution: "NodeNext",
        target: "ES2022",
        lib: ["ES2023", "ESNext.Disposable", "DOM", "DOM.Iterable"],
        types: ["node"],
        noEmit: true,
      },
      include: ["*.ts"],
    },
    null,
    2,
  ),
);
await writeFile(
  join(fixture, "vite.config.ts"),
  `import { defineConfig } from "@tiara-stack/vite-plus";\nexport default defineConfig({ test: { include: ["consumer.test.ts"] } });\n`,
);
await writeFile(join(fixture, "value.ts"), 'export const value = "original";\n');
await writeFile(
  join(fixture, "consumer.test.ts"),
  `
import { createRequire } from "node:module";
import { realpathSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import * as Runner from "@tiara-stack/vite-plus/test";
import { vi } from "@tiara-stack/vite-plus/test";
import * as Helper from "@tiara-stack/effect-vitest";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import { value } from "./value.js";

vi.mock("./value.js", () => ({ value: "mocked" }));
class Label extends Context.Service<Label, string>()("consumer/Label") {}

Runner.describe("Vitest 5 packed Effect helper", () => {
  Helper.it.effect("shares the assertion, mock, and TestRunner instances", () => Effect.gen(function* () {
    const require = createRequire(import.meta.url);
    const fromCli = createRequire(require.resolve("@tiara-stack/vite-plus/package.json"));
    const vitestPath = fromCli.resolve("vitest/package.json");
    const runtime = yield* Effect.promise(() => import(pathToFileURL(join(dirname(vitestPath), "dist/index.js")).href));
    Helper.assert.strictEqual(JSON.parse(readFileSync(vitestPath, "utf8")).version, "5.0.1");
    Helper.assert.strictEqual(Helper.expect, Runner.expect);
    Helper.assert.strictEqual(Helper.vi, Runner.vi);
    Helper.assert.strictEqual(Helper.TestRunner, Runner.TestRunner);
    Helper.assert.strictEqual(Runner.expect, runtime.expect);
    Helper.assert.strictEqual(Runner.vi, runtime.vi);
    Helper.assert.strictEqual(Runner.TestRunner, runtime.TestRunner);
    Helper.assert.isFunction(Runner.TestRunner.getCurrentSuite);
    Helper.assert.strictEqual(value, "mocked");
    for (const name of ["@tiara-stack/vite-plus", "@tiara-stack/effect-vitest", "vite"]) {
      Helper.assert.isFalse(realpathSync(require.resolve(name + "/package.json")).includes(${JSON.stringify(root)}));
    }
    console.log("Shared packed Vitest runtime: " + vitestPath);
  }));

  Helper.it.layer(Layer.succeed(Label, "provided"))("layer", (it) => {
    it.effect("runs with the layer service", () => Effect.gen(function* () {
      Helper.assert.strictEqual(yield* Label, "provided");
    }));
  });

  let runs = 0;
  Helper.afterAll(() => Helper.assert.strictEqual(runs, 2));
  Helper.it.effect.prop("runs stable Schema properties", [Schema.Int], ([value]) => Effect.sync(() => {
    runs++;
    Helper.assert.isTrue(Number.isInteger(value));
  }), { arbitrary: { runs: 2, seed: "vitest5-consumer" } });
});
`,
);
run(
  process.execPath,
  [join(fixture, "node_modules/typescript/bin/tsc"), "--pretty", "false"],
  fixture,
);
const vp = join(fixture, "node_modules/@tiara-stack/vite-plus/bin/vp");
assert.ok((await realpath(vp)).startsWith(fixture));
run(process.execPath, [vp, "test", "--run", "--maxWorkers=2"], fixture);
console.log(
  `Packed Effect helper passed with one Vitest 5 runtime and TypeScript 5.9.3 at ${fixture}`,
);
await rm(fixture, { recursive: true, force: true });

function run(command, args, cwd) {
  const env = { ...process.env, NODE_PATH: "" };
  for (const name of Object.keys(env)) {
    if (/^p?npm_config_(?:virtual_store_dir|store_dir)$/i.test(name)) delete env[name];
  }
  const result = spawnSync(command, args, { cwd, stdio: "inherit", env });
  if (result.error || result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed: ${result.error?.message ?? result.status}`,
    );
}
