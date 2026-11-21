#!/usr/bin/env node
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { replacePackageTrees } from "./lib/replace-package-trees.mjs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const upstream = join(root, "packages/effect-smol-fork/packages/vitest");
const target = join(root, "packages/effect-vitest");

const upstreamPackage = JSON.parse(await readFile(join(upstream, "package.json"), "utf8"));
const vitePackage = JSON.parse(
  await readFile(join(root, "packages/vite-plus/package.json"), "utf8"),
);
if (vitePackage.name !== "@tiara-stack/vite-plus")
  throw new Error("Expected the generated scoped Vite+ package");
const requiredRunner = upstreamPackage.peerDependencies?.vitest;
const runnerVersion = vitePackage.dependencies?.vitest;
// The released helper declares a bounded range of complete runner majors.
// Reject other range shapes until their compatibility can be checked explicitly.
const bounds = /^>=(\d+)\.0\.0 <(\d+)\.0\.0$/.exec(requiredRunner ?? "");
const runner = /^(\d+)\.\d+\.\d+$/.exec(runnerVersion ?? "");
if (
  !bounds ||
  !runner ||
  Number(runner[1]) < Number(bounds[1]) ||
  Number(runner[1]) >= Number(bounds[2])
) {
  throw new Error(
    `Effect helper ${upstreamPackage.version} requires Vitest ${requiredRunner}, but Vite+ embeds ${runnerVersion}. ` +
      "Upgrade the runner before regenerating the helper.",
  );
}

const upstreamReadme = await readFile(join(upstream, "README.md"), "utf8");
const upstreamInstallCommand = "npm install -D vitest@^5 @effect/vitest";
if (!upstreamReadme.includes(upstreamInstallCommand)) {
  throw new Error(
    `Effect helper README is missing the expected installation command: ${upstreamInstallCommand}`,
  );
}
const readme = upstreamReadme.replace(
  upstreamInstallCommand,
  "npm install -D @tiara-stack/vite-plus @tiara-stack/effect-vitest",
);

// Validate every input and rewrite before touching the retained helper.
const testExport = vitePackage.exports?.["./test"];
const exportPaths = (value) =>
  typeof value === "string" ? [value] : Object.values(value ?? {}).flatMap(exportPaths);
const paths = exportPaths(testExport);
if (
  !paths.some((path) => /\.[cm]?js$/.test(path)) ||
  !paths.some((path) => /\.d\.[cm]?ts$/.test(path))
) {
  throw new Error("Vite+ is missing its built root ./test runtime or type export");
}
for (const path of paths) await readFile(join(root, "packages/vite-plus", path));
const version = /^(\d+)\.\d+\.\d+$/.exec(vitePackage.version ?? "");
if (!version || Number(version[1]) < 1) {
  throw new Error(`Vite+ ${vitePackage.version} is not a Vitest 5 scoped release`);
}

const sources = new Map();
async function readSources(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) await readSources(join(directory, entry.name), relative);
    else sources.set(relative, await readFile(join(directory, entry.name), "utf8"));
  }
}
await readSources(join(upstream, "src"));
for (const path of ["index.ts", "internal/internal.ts", "utils.ts"]) {
  if (!sources.get(path)?.includes('from "vitest"')) {
    throw new Error(`Effect helper ${path} is missing the expected vitest import`);
  }
}
if (!sources.get("internal/internal.ts").includes("V.TestRunner.getCurrentSuite")) {
  throw new Error("Effect helper is missing the root TestRunner.getCurrentSuite API");
}
for (const [path, source] of sources) {
  const rewritten = source
    .replaceAll('from "vitest"', 'from "@tiara-stack/vite-plus/test"')
    .replaceAll("@effect/vitest", "@tiara-stack/effect-vitest");
  if (/(?:from\s+|import\s*\()\s*["'](?:vitest|@vitest\/|fast-check)/.test(rewritten)) {
    throw new Error(`Unrewritten test runtime import in ${path}`);
  }
  sources.set(path, rewritten);
}
const license = await readFile(join(upstream, "LICENSE"), "utf8");
const pkgPath = join(target, "package.json");
const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
pkg.version = upstreamPackage.version;
pkg.peerDependencies = {
  "@tiara-stack/vite-plus": `>=${vitePackage.version} <${Number(version[1]) + 1}.0.0`,
  effect: `^${upstreamPackage.version}`,
  vitest: requiredRunner,
};
pkg.peerDependenciesMeta = { ...pkg.peerDependenciesMeta, vitest: { optional: true } };

// Normalize the scoped rewrites with the selected workspace formatter before
// replacing retained files, so a missing formatter or parse error is harmless.
const require = createRequire(
  join(root, "packages/vite-plus-effect-fork/packages/cli/package.json"),
);
const { format } = await import(pathToFileURL(require.resolve("oxfmt")).href);
async function formatOutput(path, source) {
  const result = await format(path, source);
  if (result.errors.length)
    throw new Error(
      `Unable to format Effect helper ${path}: ${result.errors.map((error) => error.message).join("; ")}`,
    );
  return result.code;
}
for (const [relative, source] of sources)
  sources.set(relative, await formatOutput(join(target, "src", relative), source));
const formattedReadme = await formatOutput(
  join(target, "README.md"),
  readme
    .replaceAll("@effect/vitest", "@tiara-stack/effect-vitest")
    .replace(
      "testing Effect-based applications using `vitest`",
      "testing Effect-based applications using Vite+",
    )
    .replace(
      "This package simplifies running tests for Effect-based code with Vitest.",
      "This package routes runtime and type imports through `@tiara-stack/vite-plus/test` to share Vite+'s Vitest runner.",
    )
    .replace(
      "Install Vitest 5 (`>=5.0.0 <6.0.0`) with the package as a dev dependency:",
      "Install the Vite+ runner and Effect helper as dev dependencies:",
    ),
);

await mkdir(join(root, ".tmp"), { recursive: true });
const staging = await mkdtemp(join(root, ".tmp/effect-vitest-sync-"));
try {
  for (const [relative, source] of sources) {
    await mkdir(dirname(join(staging, "src", relative)), { recursive: true });
    await writeFile(join(staging, "src", relative), source);
  }
  await writeFile(join(staging, "LICENSE"), license);
  await writeFile(join(staging, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
  await writeFile(join(staging, "README.md"), formattedReadme);
  await replacePackageTrees(
    [{ source: staging, target, preserveOtherEntries: true }],
    join(root, ".tmp"),
  );
} finally {
  await rm(staging, { recursive: true, force: true });
}

console.log(
  `Synced Effect ${upstreamPackage.version} helper for Vite+ ${vitePackage.version} / Vitest ${runnerVersion}`,
);
