#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { rolldownBuildRecord } from "./lib/vite-plus-build-record.mjs";
import { sourceEnvironment } from "./lib/vite-plus-source-environment.mjs";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const source = join(root, "packages/vite-plus-effect-fork");
const metadata = await readFile(join(source, ".gitrepo"), "utf8");
if (!/^\s*commit = fc287d7b1c0dc008dbc65d1d2b2f51a44e2a5ea4$/m.test(metadata)) {
  throw new Error("Vite+ source is not on the approved stable 1.0.0 pin");
}
run(process.execPath, [join(root, "scripts/prepare-vite-plus.mjs")], root);
const brokenDependencies =
  existsSync(join(source, "node_modules")) &&
  !existsSync(join(source, "node_modules/vitest/package.json"));
run(
  "pnpm",
  [
    "install",
    "--frozen-lockfile",
    "--ignore-scripts",
    "--no-optimistic-repeat-install",
    ...(brokenDependencies ? ["--force"] : []),
  ],
  source,
);
if (!existsSync(join(source, "node_modules/vitest/package.json")))
  throw new Error("Source dependency restoration left dangling links");
await mkdir(join(root, ".tmp"), { recursive: true });
const rolldownRecordPath = join(root, ".tmp/vite-plus-rolldown-build.json");
if (
  process.argv.includes("--reuse-rolldown") ||
  process.env.TIARA_VITE_PLUS_REUSE_ROLLDOWN === "1"
) {
  const saved = JSON.parse(await readFile(rolldownRecordPath, "utf8"));
  assert.deepEqual(
    saved.artifacts,
    await rolldownBuildRecord(source),
    "Retained Rolldown inputs or outputs changed; rebuild them",
  );
  console.log("Reusing the verified completed local Rolldown build");
} else {
  run("pnpm", ["--filter", "rolldown", "run", "build-binding:release"], source);
  run("pnpm", ["--filter", "rolldown", "run", "build-node"], source);
  await writeFile(
    rolldownRecordPath,
    `${JSON.stringify({ artifacts: await rolldownBuildRecord(source), profile: { lto: process.env.CARGO_PROFILE_RELEASE_LTO ?? "source default", codegenUnits: process.env.CARGO_PROFILE_RELEASE_CODEGEN_UNITS ?? "source default" } }, null, 2)}\n`,
  );
}
for (const [pkg, script] of [
  ["vite", "build-types-roll"],
  ["vite", "build-types-check"],
  ["@voidzero-dev/vite-plus-core", "build"],
  ["@voidzero-dev/vite-plus-prompts", "build"],
  ["vite-plus", "build"],
])
  run("pnpm", ["--filter", pkg, "run", script], source);

const inputs = {};
const outputs = {};
async function hashTree(directory, hashes) {
  for (const entry of await readdir(join(source, directory), { withFileTypes: true })) {
    if (
      ["node_modules", "dist", "target", "docs", "snap-tests", "snap-tests-global"].includes(
        entry.name,
      )
    )
      continue;
    const relative = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await hashTree(relative, hashes);
    else if (entry.isFile())
      hashes[relative] = createHash("sha256")
        .update(await readFile(join(source, relative)))
        .digest("hex");
  }
}
for (const directory of [
  "packages/cli/src",
  "packages/cli/bin",
  "packages/core",
  "packages/prompts",
  "packages/tools/src",
  "crates",
  "scripts",
  "vite/packages/vite",
  "vite/scripts",
  "rolldown/packages/rolldown/src",
])
  await hashTree(directory, inputs);
for (const relative of [
  ".gitrepo",
  "Cargo.toml",
  "Cargo.lock",
  ".cargo/config.toml",
  "rust-toolchain.toml",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml",
  "packages/cli/build.ts",
  "packages/cli/tsdown.config.ts",
  "packages/cli/package.json",
  "packages/cli/binding/Cargo.toml",
  "packages/tools/.upstream-versions.json",
  "vite/.tiara-source.json",
  "vite/package.json",
  "rolldown/package.json",
]) {
  inputs[relative] = createHash("sha256")
    .update(await readFile(join(source, relative)))
    .digest("hex");
}
for (const directory of ["packages/core/dist", "packages/cli/dist", "packages/cli/binding"])
  await hashTree(directory, outputs);
const rootInputs = {};
for (const relative of [
  "scripts/build-vite-plus.mjs",
  "scripts/prepare-vite-plus.mjs",
  "scripts/lib/vite-plus-build-record.mjs",
  "scripts/lib/vite-plus-source-environment.mjs",
]) {
  rootInputs[relative] = createHash("sha256")
    .update(await readFile(join(root, relative)))
    .digest("hex");
}
const build = {
  pin: "fc287d7b1c0dc008dbc65d1d2b2f51a44e2a5ea4",
  version: "1.0.0",
  toolchain: {
    node: process.version,
    pnpm: capture("pnpm", ["--version"]),
    cargo: capture("cargo", ["--version", "--verbose"]),
    rustc: capture("rustc", ["--version", "--verbose"]),
  },
  rolldownBuild: JSON.parse(await readFile(rolldownRecordPath, "utf8")),
  buildOptions: {
    cliReleaseLto: process.env.CARGO_PROFILE_RELEASE_LTO ?? "source default",
    cliReleaseCodegenUnits: process.env.CARGO_PROFILE_RELEASE_CODEGEN_UNITS ?? "source default",
  },
  vitest: "5.0.1",
  upstream: JSON.parse(
    await readFile(join(source, "packages/tools/.upstream-versions.json"), "utf8"),
  ),
  rootInputs,
  inputs: Object.fromEntries(Object.entries(inputs).sort()),
  outputs: Object.fromEntries(Object.entries(outputs).sort()),
};
await mkdir(join(root, ".tmp"), { recursive: true });
await writeFile(
  join(root, ".tmp/vite-plus-source-build.json"),
  `${JSON.stringify(build, null, 2)}\n`,
);
console.log("Built the selected local core before CLI and recorded input/output hashes");

function run(command, args, cwd) {
  const result = spawnSync(
    command === "pnpm" ? "corepack" : command,
    command === "pnpm" ? ["pnpm", ...args] : args,
    {
      cwd,
      stdio: "inherit",
      env: sourceEnvironment(root),
    },
  );
  if (result.error || result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed: ${result.error?.message ?? result.status}`,
    );
}

function capture(command, args) {
  const result = spawnSync(
    command === "pnpm" ? "corepack" : command,
    command === "pnpm" ? ["pnpm", ...args] : args,
    {
      cwd: source,
      encoding: "utf8",
      env: sourceEnvironment(root),
    },
  );
  if (result.error || result.status !== 0)
    throw new Error(
      `Reading ${command} build identity failed: ${result.error?.message ?? result.stderr}`,
    );
  return result.stdout.trim();
}
