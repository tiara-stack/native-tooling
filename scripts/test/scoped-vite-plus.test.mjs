import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { rewriteScopedVitePlus } from "../lib/scoped-vite-plus.mjs";

test("scoping distinguishes executable module references from semantic input identities", () => {
  const input = `import {test} from 'vite-plus/test'; export * from "@voidzero-dev/vite-plus-core";
const a=import("vite-plus/test/node"), b=require.resolve('vite-plus/package.json');
const c=resolveBundled("vite-plus/package.json");
const installed={name:"vite-plus"}; if(installed.name!=="vite-plus")throw Error();
const dependencies={"vite-plus":"1.0.0"}; catalog.has("vite-plus");
const labels=["vite-plus", "@voidzero-dev/vite-plus-core"];
const inputSources=["vite-plus/test", "vitest"];
`;
  const output = rewriteScopedVitePlus(input, "dist/example.js");
  assert.match(output, /from '@tiara-stack\/vite-plus\/test'/);
  assert.match(output, /from "@tiara-stack\/vite-plus-core"/);
  assert.match(output, /import\("@tiara-stack\/vite-plus\/test\/node"\)/);
  assert.match(output, /require.resolve\('@tiara-stack\/vite-plus\/package.json'\)/);
  assert.match(output, /resolveBundled\("@tiara-stack\/vite-plus\/package.json"\)/);
  assert.ok(output.endsWith(input.slice(input.indexOf("const installed"))));
});

test("scoping retains both legacy migration input namespaces and scoped replacement values", () => {
  const filter =
    'const TSCONFIG_TYPE_REPLACEMENTS = { ...Object.fromEntries(Object.entries(table).filter(([source]) => source.startsWith("vite-plus/"))) };';
  assert.match(
    rewriteScopedVitePlus(filter, "dist/tsconfig-fixture.js"),
    /source.startsWith\("vite-plus\/"\) \|\| source.startsWith\("@tiara-stack\/vite-plus\/"\)/,
  );
  const table = JSON.parse(
    readFileSync(
      new URL(
        "../../packages/vite-plus-effect-fork/packages/cli/src/vitest-v5-entry-points.json",
        import.meta.url,
      ),
    ),
  );
  const output = rewriteScopedVitePlus(
    `var vitest_v5_entry_points_default = ${JSON.stringify(table)};`,
    "dist/vitest-v5-entry-points-fixture.js",
  );
  const result = JSON.parse(output.slice(output.indexOf("{"), output.lastIndexOf("}") + 1));
  for (const [key, value] of Object.entries(table)) {
    const expected = value.replace(/^vite-plus(?=\/|$)/, "@tiara-stack/vite-plus");
    assert.equal(result[key], expected);
    if (key.startsWith("vite-plus/")) assert.equal(result["@tiara-stack/" + key], expected);
  }
  assert.equal(result["vite-plus/test/coverage"], "@tiara-stack/vite-plus/test/node");
  assert.equal(result["@tiara-stack/vite-plus/test/coverage"], "@tiara-stack/vite-plus/test/node");
});

test("module-producing import fixes, declarations and project templates are scoped", () => {
  const input =
    'function rewriteVitePlusImportSpecifier(x) { if(x === "vite") return "vite-plus"; return `vite-plus/${x}`; }';
  const output = rewriteScopedVitePlus(input, "dist/oxlint-plugin.js");
  assert.match(output, /return "@tiara-stack\/vite-plus"/);
  assert.match(output, /`@tiara-stack\/vite-plus\/\$\{x\}`/);
  const declaration =
    "export type T = import('vite-plus/test').Test; declare module 'vite-plus' {}";
  assert.equal(
    rewriteScopedVitePlus(declaration, "dist/test.d.ts"),
    declaration.replaceAll("'vite-plus", "'@tiara-stack/vite-plus"),
  );
  assert.deepEqual(
    JSON.parse(
      rewriteScopedVitePlus(
        '{"devDependencies":{"vite-plus":"^1"}}',
        "templates/monorepo/package.json",
      ),
    ),
    { devDependencies: { "@tiara-stack/vite-plus": "^1" } },
  );
  const graph = '{"nodes":[{"id":"vite-plus","name":"@voidzero-dev/vite-plus-core"}]}';
  assert.equal(rewriteScopedVitePlus(graph, "dist/toolchain.json"), graph);
});
