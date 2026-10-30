#!/usr/bin/env node
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const upstream = join(root, "packages/effect-smol-fork/packages/vitest");
const target = join(root, "packages/effect-vitest");

const upstreamPackage = JSON.parse(await readFile(join(upstream, "package.json"), "utf8"));
const vitePackage = JSON.parse(
  await readFile(join(root, "packages/vite-plus/package.json"), "utf8"),
);
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

await rm(join(target, "src"), { force: true, recursive: true });
await mkdir(target, { recursive: true });
await cp(join(upstream, "src"), join(target, "src"), { recursive: true });
await cp(join(upstream, "LICENSE"), join(target, "LICENSE"));
await writeFile(join(target, "README.md"), readme);

const rewriteFile = async (path, replacements) => {
  let text = await readFile(path, "utf8");
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  await writeFile(path, text);
};

await rewriteFile(join(target, "src/index.ts"), [
  ['from "vitest"', 'from "@tiara-stack/vite-plus/test"'],
  ['from "@effect/vitest"', 'from "@tiara-stack/effect-vitest"'],
  ["@effect/vitest", "@tiara-stack/effect-vitest"],
]);
await rewriteFile(join(target, "src/internal/internal.ts"), [
  ['from "@vitest/runner"', 'from "@tiara-stack/vite-plus/test/suite"'],
  ['from "vitest"', 'from "@tiara-stack/vite-plus/test"'],
  ["ctx?: V.TestContext | undefined", "ctx?: V.TestContext"],
  [
    "const previousTasks = new Set(currentSuite.tasks)",
    "const previousTasks = new Set<unknown>(currentSuite.tasks)",
  ],
]);
await rewriteFile(join(target, "src/utils.ts"), [
  ['from "vitest"', 'from "@tiara-stack/vite-plus/test"'],
  ["@effect/vitest", "@tiara-stack/effect-vitest"],
]);
await rewriteFile(join(target, "README.md"), [
  [
    "testing Effect-based applications using `vitest` and the `@effect/vitest` package",
    "testing Effect-based applications using Vite+ and the `@tiara-stack/effect-vitest` package",
  ],
  [
    "This package simplifies running tests for Effect-based code with Vitest.",
    "This package is derived from `@effect/vitest` and routes Vitest imports through Vite+'s test exports so workspaces use the same test runner instance.",
  ],
  [
    "Install Vitest 5 (`>=5.0.0 <6.0.0`) with the package as a dev dependency:",
    "Install the Vite+ runner and Effect helper as dev dependencies:",
  ],
  ['from "@effect/vitest"', 'from "@tiara-stack/effect-vitest"'],
  ["@effect/vitest", "@tiara-stack/effect-vitest"],
]);

console.log("Synced packages/effect-vitest from packages/effect-smol-fork/packages/vitest");
