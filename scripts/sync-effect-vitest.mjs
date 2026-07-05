#!/usr/bin/env node
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const upstream = join(root, "packages/effect-smol-fork/packages/vitest");
const target = join(root, "packages/effect-vitest");

await rm(join(target, "src"), { force: true, recursive: true });
await mkdir(target, { recursive: true });
await cp(join(upstream, "src"), join(target, "src"), { recursive: true });
await cp(join(upstream, "LICENSE"), join(target, "LICENSE"));
await cp(join(upstream, "README.md"), join(target, "README.md"));

const rewriteFile = async (path, replacements) => {
  let text = await readFile(path, "utf8");
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  await writeFile(path, text);
};

await rewriteFile(join(target, "src/index.ts"), [
  ['from "vitest"', 'from "vite-plus/test"'],
  ['from "@effect/vitest"', 'from "@tiara-stack/effect-vitest"'],
  ["@effect/vitest", "@tiara-stack/effect-vitest"],
]);
await rewriteFile(join(target, "src/internal/internal.ts"), [
  ['from "@vitest/runner"', 'from "vite-plus/test/suite"'],
  ['from "vitest"', 'from "vite-plus/test"'],
  ["ctx?: V.TestContext | undefined", "ctx?: V.TestContext"],
  [
    'export const prop: Vitest.Vitest.Methods["prop"] = (name, arbitraries, self, timeout) => {\n  if (Array.isArray(arbitraries)) {',
    'export const prop: Vitest.Vitest.Methods["prop"] = (name, arbitraries, self, timeout) => {\n  const fastCheckOptions = isObject(timeout)\n    ? (timeout as { readonly fastCheck?: fc.Parameters<any> }).fastCheck\n    : undefined;\n\n  if (Array.isArray(arbitraries)) {',
  ],
  [
    "      // @ts-ignore\n      (ctx) => fc.assert(fc.property(...arbs, (...as) => self(as, ctx)), isObject(timeout) ? timeout?.fastCheck : {})",
    '      (ctx) =>\n        fc.assert(\n          (fc.property as any)(...arbs, (...as: Array<unknown>) => self(as as any, ctx)),\n          fastCheckOptions,\n        ),',
  ],
  [
    "    // @ts-ignore\n    (ctx) => fc.assert(fc.property(arbs, (as) => self(as, ctx)), isObject(timeout) ? timeout?.fastCheck : {})",
    '    (ctx) =>\n      fc.assert(\n        (fc.property as any)(arbs, (as: Record<string, unknown>) => self(as as any, ctx)),\n        fastCheckOptions,\n      ),',
  ],
  ["const previousTasks = new Set(currentSuite.tasks)", "const previousTasks = new Set<unknown>(currentSuite.tasks)"],
]);
await rewriteFile(join(target, "src/utils.ts"), [
  ['from "vitest"', 'from "vite-plus/test"'],
  ["@effect/vitest", "@tiara-stack/effect-vitest"],
]);
await rewriteFile(join(target, "README.md"), [
  ["testing Effect-based applications using `vitest` and the `@effect/vitest` package", "testing Effect-based applications using Vite+ and the `@tiara-stack/effect-vitest` package"],
  ["This package simplifies running tests for Effect-based code with Vitest.", "This package is derived from `@effect/vitest` and routes Vitest imports through Vite+'s test exports so workspaces use the same test runner instance."],
  ["[`vitest`](https://vitest.dev/guide/) installed (version `1.6.0` or later)", "[`vite-plus`](https://github.com/voidzero-dev/vite-plus) installed"],
  ["pnpm add -D vitest", "pnpm add -D vite-plus"],
  ["install the `@effect/vitest` package, which integrates Effect with Vitest", "install the `@tiara-stack/effect-vitest` package, which integrates Effect with the Vite+ test runner"],
  ["pnpm add -D @effect/vitest", "pnpm add -D @tiara-stack/effect-vitest"],
  ['from "@effect/vitest"', 'from "@tiara-stack/effect-vitest"'],
  ["@effect/vitest", "@tiara-stack/effect-vitest"],
]);

console.log("Synced packages/effect-vitest from packages/effect-smol-fork/packages/vitest");
