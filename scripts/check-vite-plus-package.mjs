#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const packageRoot = join(root, "packages/vite-plus");
const coreRoot = join(root, "packages/vite-plus-core");
const pkg = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
const core = JSON.parse(await readFile(join(coreRoot, "package.json"), "utf8"));
const helper = JSON.parse(
  await readFile(join(root, "packages/effect-vitest/package.json"), "utf8"),
);
assert.equal(pkg.name, "@tiara-stack/vite-plus");
assert.equal(core.name, "@tiara-stack/vite-plus-core");
assert.equal(pkg.version, "1.0.0");
assert.equal(core.version, pkg.version);
assert.equal(pkg.dependencies.vite, `npm:@tiara-stack/vite-plus-core@${core.version}`);
assert.equal(pkg.dependencies.vitest, "5.0.1");
for (const [name, version] of Object.entries(pkg.dependencies)) {
  if (name.startsWith("@vitest/")) assert.equal(version, "5.0.1", name);
  assert.doesNotMatch(version, /^(?:link|workspace|catalog):/, name);
}
for (const tool of ["oxlint", "tsgo", "tsgolint"])
  assert.equal(pkg.dependencies[`@tiara-stack/${tool}-effect`], "^0.1.2");
assert.equal(pkg.dependencies["@vitest/runner"], undefined);
assert.equal(pkg.dependencies["@vitest/expect"], undefined);
assert.equal(pkg.bin.vp, "bin/vp");
assert.equal(pkg.bin.vpr, "bin/vpr");
assert.equal(pkg.bin["vp-oxlint"], "bin/tiara-oxlint.mjs");
assert.equal(pkg.napi.packageName, "@voidzero-dev/vite-plus");
assert.equal(pkg.napi.binaryName, "vite-plus");
assert.equal(pkg.engines.node, "^22.18.0 || ^24.11.0 || >=26.0.0");
assert.equal(core.peerDependencies.typescript, "^5.9.3 || ^6.0.0");
for (const version of Object.values(pkg.optionalDependencies)) assert.equal(version, pkg.version);
assert.ok(pkg.exports["./test"]);
assert.equal(pkg.exports["./test/suite"], undefined);
assert.equal(helper.version, "4.0.1");
assert.equal(helper.peerDependencies["@tiara-stack/vite-plus"], `>=${pkg.version} <2.0.0`);
assert.equal(helper.peerDependencies.effect, "^4.0.1");
assert.equal(helper.peerDependencies.vitest, ">=5.0.0 <6.0.0");
assert.equal(helper.peerDependenciesMeta.vitest.optional, true);

for (const [directory, manifest] of [
  [packageRoot, pkg],
  [coreRoot, core],
]) {
  for (const path of exportPaths(manifest.exports)) {
    if (path.includes("*")) continue;
    await access(join(directory, path));
  }
  const provenance = JSON.parse(await readFile(join(directory, "SOURCE.json"), "utf8"));
  assert.equal(provenance.pin, "fc287d7b1c0dc008dbc65d1d2b2f51a44e2a5ea4");
  assert.equal(provenance.vitest, "5.0.1");
  const prefix = directory === packageRoot ? "packages/cli/" : "packages/core/";
  const nativeFiles = Object.keys(provenance.outputs).filter(
    (path) => path.startsWith(prefix) && /\.(?:node|wasm)$/.test(path),
  );
  assert.ok(nativeFiles.length, "provenance must include the package's built local native binding");
  for (const path of nativeFiles) {
    const local = path.slice(prefix.length);
    const hash = createHash("sha256")
      .update(await readFile(join(directory, local)))
      .digest("hex");
    assert.equal(hash, provenance.outputs[path], `native input ${local}`);
  }
}
const dist = await readdir(join(packageRoot, "dist"));
const code = (
  await Promise.all(
    dist
      .filter((file) => file.endsWith(".js"))
      .map((file) => readFile(join(packageRoot, "dist", file), "utf8")),
  )
).join("\n");
assert.doesNotMatch(
  code,
  /(?:from\s*|import\s*\(\s*|require\s*\(\s*)["']@voidzero-dev\/vite-plus-prompts/,
  "The local prompts workspace must be built and bundled into the CLI",
);
for (const marker of [
  "TIARA_TSGOLINT_EFFECT_PATH",
  "TIARA_OXLINT_EFFECT_PATH",
  "TIARA_TSGO_EFFECT_PATH",
  "VP_RESOLVING_CONFIG_METADATA",
  "Missing Tiara",
]) {
  assert.ok(code.includes(marker), `generated CLI lost ${marker}`);
}
const internal = await readFile(
  join(root, "packages/effect-vitest/src/internal/internal.ts"),
  "utf8",
);
assert.ok(internal.includes("V.TestRunner.getCurrentSuite"));
assert.doesNotMatch(internal, /from ["'](?:vitest|@vitest\/|fast-check)|vite-plus\/test\/suite/);
console.log(
  `Verified local-source Vite+ ${pkg.version}, scoped core, native binding, and Effect helper package contracts`,
);

function exportPaths(value) {
  return typeof value === "string" ? [value] : Object.values(value ?? {}).flatMap(exportPaths);
}
