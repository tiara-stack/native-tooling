#!/usr/bin/env node
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const packageRoot = join(root, "packages", "vite-plus");
const packageJsonPath = join(packageRoot, "package.json");
const pkg = JSON.parse(await readFile(packageJsonPath, "utf8"));

assertEqual(pkg.name, "@tiara-stack/vite-plus", "package name");
assertEqual(pkg.bin?.vp, "bin/vp", "vp bin path");
assertEqual(pkg.bin?.vpr, "bin/vpr", "vpr bin path");
assertEqual(pkg.bin?.oxlint, "bin/oxlint", "oxlint bin path");
assertEqual(pkg.bin?.oxfmt, "bin/oxfmt", "oxfmt bin path");
assertEqual(pkg.dependencies?.["@tiara-stack/tsgo-effect"], "^0.1.2", "tsgo dependency");
assertEqual(pkg.dependencies?.["@tiara-stack/tsgolint-effect"], "^0.1.2", "tsgolint dependency");
assertEqual(pkg.napi?.packageName, "@tiara-stack/vite-plus", "napi package name");

for (const file of ["bin/vp", "bin/vpr", "bin/oxlint", "bin/oxfmt", "dist/bin.js"]) {
  await assertExists(join(packageRoot, file));
}

const distFiles = await readdir(join(packageRoot, "dist"));
const tsgolintPathFile = distFiles.find((file) => file.startsWith("tsgolint-path-") && file.endsWith(".js"));
if (!tsgolintPathFile) {
  throw new Error("Unable to find generated dist/tsgolint-path-*.js file");
}

const tsgolintPathSource = await readFile(join(packageRoot, "dist", tsgolintPathFile), "utf8");
assertIncludes(
  tsgolintPathSource,
  "@tiara-stack/tsgolint-effect/bin/tsgolint-effect",
  "custom tsgolint package resolver",
);
assertIncludes(tsgolintPathSource, "TIARA_TSGOLINT_EFFECT_PATH", "custom tsgolint override env");

const oxlintBinSource = await readFile(join(packageRoot, "bin", "oxlint"), "utf8");
assertIncludes(oxlintBinSource, "resolveTsgolintExecutable", "oxlint LSP wrapper resolver import");
assertIncludes(oxlintBinSource, "OXLINT_TSGOLINT_PATH", "oxlint LSP wrapper tsgolint env");

const packBinFile =
  distFiles.find((file) => file.startsWith("pack-bin-") && file.endsWith(".js")) ??
  (distFiles.includes("pack-bin.js") ? "pack-bin.js" : undefined);
if (!packBinFile) {
  throw new Error("Unable to find generated dist/pack-bin*.js file");
}
const packBinSource = await readFile(join(packageRoot, "dist", packBinFile), "utf8");
assertIncludes(packBinSource, "@tiara-stack/tsgo-effect/bin/tsgo-effect", "custom tsgo package resolver");
assertIncludes(packBinSource, "TIARA_TSGO_EFFECT_PATH", "custom tsgo override env");
assertIncludes(packBinSource, "withTiaraTsgoDtsConfig", "custom dts tsgo path rewrite");

await import(pathToFileURL(join(packageRoot, "dist", "test", "index.js")).href);
await import(pathToFileURL(join(packageRoot, "dist", "test", "suite.js")).href);

console.log(`Verified @tiara-stack/vite-plus package wiring (${pkg.version})`);

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`Expected ${label} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) {
    throw new Error(`Expected ${label} to include ${JSON.stringify(needle)}`);
  }
}

async function assertExists(path) {
  try {
    await access(path);
  } catch {
    throw new Error(`Expected file to exist: ${path}`);
  }
}
