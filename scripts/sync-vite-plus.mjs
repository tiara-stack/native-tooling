#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { sourceEnvironment } from "./lib/vite-plus-source-environment.mjs";
import { replacePackageTrees } from "./lib/replace-package-trees.mjs";
import { rewriteScopedVitePlus } from "./lib/scoped-vite-plus.mjs";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const source = join(root, "packages/vite-plus-effect-fork");
const pin = "fc287d7b1c0dc008dbc65d1d2b2f51a44e2a5ea4";
const cli = JSON.parse(await readFile(join(source, "packages/cli/package.json"), "utf8"));
const core = JSON.parse(await readFile(join(source, "packages/core/package.json"), "utf8"));
const build = JSON.parse(await readFile(join(root, ".tmp/vite-plus-source-build.json"), "utf8"));
if (build.pin !== pin || cli.version !== "1.0.0" || core.version !== cli.version) {
  throw new Error(
    "Build the approved local Vite+ 1.0.0 core and CLI before generating scoped packages",
  );
}
if (!Object.keys(build.rootInputs ?? {}).length)
  throw new Error("Local Vite+ build is missing its build-script provenance");
for (const [relative, hash] of Object.entries(build.rootInputs)) {
  const actual = createHash("sha256")
    .update(await readFile(join(root, relative)))
    .digest("hex");
  if (actual !== hash) throw new Error(`Build script changed after validation: ${relative}`);
}
for (const [relative, hash] of Object.entries({ ...build.inputs, ...build.outputs })) {
  const actual = createHash("sha256")
    .update(await readFile(join(source, relative)))
    .digest("hex");
  if (actual !== hash) throw new Error(`Local build changed after validation: ${relative}`);
}
for (const relative of [
  "packages/core/dist/vite/node/index.js",
  "packages/core/dist/tsdown/index.js",
  "packages/cli/dist/bin.js",
  "packages/cli/dist/test/index.js",
  "packages/cli/dist/test/index.d.ts",
]) {
  await readFile(join(source, relative));
}
if (!cli.exports?.["./test"] || cli.exports["./test/suite"]) {
  throw new Error(
    "The local CLI must expose the Vitest 5 root ./test API without the old ./test/suite export",
  );
}

await mkdir(join(root, ".tmp"), { recursive: true });
const staging = await mkdtemp(join(root, ".tmp/vite-plus-sync-"));
try {
  for (const [kind, name] of [
    ["core", "vite-plus-core"],
    ["cli", "vite-plus"],
  ]) {
    const archive = join(staging, `${kind}.tgz`);
    run("pnpm", ["pack", "--out", archive], join(source, "packages", kind));
    const unpacked = join(staging, kind);
    await mkdir(unpacked);
    run("tar", ["-xzf", archive, "--strip-components=1", "-C", unpacked], staging);
    const path = join(unpacked, "package.json");
    const pkg = JSON.parse(await readFile(path, "utf8"));
    pkg.name = `@tiara-stack/${name}`;
    pkg.description = `Tiara Stack ${kind === "cli" ? "Vite+ with native Effect tooling" : "Vite+ core built from the pinned local source"}.`;
    pkg.homepage = "https://github.com/tiara-stack/native-tooling#readme";
    pkg.bugs = { url: "https://github.com/tiara-stack/native-tooling/issues" };
    pkg.repository = {
      type: "git",
      url: "git+https://github.com/tiara-stack/native-tooling.git",
      directory: `packages/${name}`,
    };
    pkg.publishConfig = { access: "public" };
    pkg.bin =
      pkg.bin &&
      Object.fromEntries(
        Object.entries(pkg.bin).map(([name, path]) => [name, path.replace(/^\.\//, "")]),
      );
    delete pkg.devDependencies;
    pkg.scripts = {
      build: "echo 'generated from the built local Vite+ fork'",
      format: "echo 'generated package'",
      "format:apply": "echo 'generated package'",
      lint: "echo 'generated package'",
      test:
        kind === "cli"
          ? "node bin/vp --version"
          : "node -e \"import('./dist/vite/node/index.js')\"",
    };
    if (kind === "cli") {
      pkg.dependencies.vite = `npm:@tiara-stack/vite-plus-core@${core.version}`;
      for (const tool of ["oxlint", "tsgo", "tsgolint"])
        pkg.dependencies[`@tiara-stack/${tool}-effect`] = "^0.1.2";
      if (pkg.dependencies.vitest !== "5.0.1")
        throw new Error(`Unexpected packed Vitest version ${pkg.dependencies.vitest}`);
      for (const [name, version] of Object.entries(pkg.dependencies)) {
        if (name.startsWith("@vitest/") && version !== "5.0.1")
          throw new Error(`Unexpected ${name} version ${version}`);
      }
      // The native Rust binding is unchanged from 1.0.0. Keep its generated
      // upstream namespace and exact platform versions; include the local build.
      pkg.optionalDependencies = Object.fromEntries(
        [
          "darwin-arm64",
          "darwin-x64",
          "linux-arm64-gnu",
          "linux-arm64-musl",
          "linux-x64-gnu",
          "linux-x64-musl",
          "win32-arm64-msvc",
          "win32-x64-msvc",
        ].map((platform) => [`@voidzero-dev/vite-plus-${platform}`, cli.version]),
      );
      await writeFile(join(unpacked, ".gitignore"), "binding/*.node\nbinding/*.wasm\n");
    }
    if (kind === "core")
      await writeFile(join(unpacked, ".gitignore"), "dist/**/*.node\ndist/**/*.wasm\n");
    pkg.files = [...new Set([...pkg.files, "SOURCE.json"])];
    await rewriteTree(unpacked, unpacked);
    // Preserve the native binding's file name and upstream platform package
    // names when rewriting runtime specifiers.
    await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`);
    await writeFile(join(unpacked, "SOURCE.json"), `${JSON.stringify(build, null, 2)}\n`);
  }
  // Both packages are staged and validated before replacing either retained tree.
  await replacePackageTrees(
    [
      { source: join(staging, "core"), target: join(root, "packages/vite-plus-core") },
      { source: join(staging, "cli"), target: join(root, "packages/vite-plus") },
    ],
    join(root, ".tmp"),
  );
} finally {
  await rm(staging, { recursive: true, force: true });
}
console.log(`Generated scoped Vite+ ${cli.version} and its core from the built local fork`);

async function rewriteTree(directory, base) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await rewriteTree(path, base);
    else if (/\.(?:[cm]?js|[cm]?ts|json|md)$/.test(entry.name)) {
      const text = rewriteScopedVitePlus(
        await readFile(path, "utf8"),
        relative(base, path).replaceAll("\\", "/"),
      );
      await writeFile(path, text);
    }
  }
}
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
    throw new Error(`${command} failed: ${result.error?.message ?? result.status}`);
}
