#!/usr/bin/env node
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const upstream = dirname(require.resolve("vite-plus/package.json"));
const target = join(root, "packages/vite-plus");

const copyEntries = [
  "AGENTS.md",
  "LICENSE",
  "README.md",
  "bin",
  "binding",
  "dist",
  "docs",
  "rules",
  "templates",
  "package.json",
];

await rm(target, { force: true, recursive: true });
await mkdir(target, { recursive: true });
for (const entry of copyEntries) {
  await cp(join(upstream, entry), join(target, entry), { recursive: true });
}

const pkgPath = join(target, "package.json");
const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
pkg.name = "@tiara-stack/vite-plus";
pkg.description = "Tiara Stack fork of Vite+ wired to native Effect tsgolint tooling.";
pkg.homepage = "https://github.com/tiara-stack/native-tooling#readme";
pkg.bugs = {
  url: "https://github.com/tiara-stack/native-tooling/issues",
};
pkg.repository = {
  type: "git",
  url: "git+https://github.com/tiara-stack/native-tooling.git",
  directory: "packages/vite-plus",
};
pkg.bin = Object.fromEntries(
  Object.entries(pkg.bin ?? {}).map(([name, path]) => [name, String(path).replace(/^\.\//, "")]),
);
pkg.publishConfig = {
  access: "public",
};
pkg.scripts = {
  build: "echo 'prebuilt from packages/vite-plus-effect-fork'",
  format: "echo 'prebuilt package; no format step'",
  "format:apply": "echo 'prebuilt package; no format step'",
  lint: "echo 'prebuilt package; no lint step'",
  test: "node bin/vp --version",
};
pkg.dependencies ??= {};
pkg.dependencies["@tiara-stack/tsgolint-effect"] = "^0.1.0";
delete pkg.devDependencies;
if (pkg.napi) {
  pkg.napi.packageName = "@tiara-stack/vite-plus";
}
await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

const patchFile = async (relativePath, replacements) => {
  const path = join(target, relativePath);
  let text = await readFile(path, "utf8");
  for (const [from, to] of replacements) {
    if (!text.includes(from)) {
      throw new Error(`Unable to patch ${relativePath}; missing expected text: ${from.slice(0, 120)}`);
    }
    text = text.replace(from, to);
  }
  await writeFile(path, text);
};

await patchFile("dist/tsgolint-path-B-yOos8p.js", [
  [
    'import { fileURLToPath } from "node:url";',
    'import { fileURLToPath } from "node:url";\nimport { createRequire } from "node:module";\nconst require = createRequire(import.meta.url);',
  ],
  [
    'function resolveTsgolintExecutable(tsgolintBinPath, scriptUrl) {\n\tif (process.platform !== "win32") return tsgolintBinPath;',
    'function resolveTiaraTsgolintExecutable() {\n\tlet packagedTsgolintPath;\n\ttry {\n\t\tpackagedTsgolintPath = require.resolve("@tiara-stack/tsgolint-effect/bin/tsgolint-effect");\n\t} catch {}\n\tconst candidate = process.env.TIARA_TSGOLINT_EFFECT_PATH ?? packagedTsgolintPath;\n\treturn candidate && existsSync(candidate) ? candidate : undefined;\n}\nfunction resolveTsgolintExecutable(tsgolintBinPath, scriptUrl) {\n\tconst tiaraTsgolintPath = resolveTiaraTsgolintExecutable();\n\tif (tiaraTsgolintPath) return tiaraTsgolintPath;\n\tif (process.platform !== "win32") return tsgolintBinPath;',
  ],
]);

await patchFile("bin/oxlint", [
  [
    "process.env.OXLINT_TSGOLINT_PATH ??= tsgolintBin;",
    "process.env.OXLINT_TSGOLINT_PATH ??= tsgolintBin;",
  ],
]);

console.log("Synced packages/vite-plus from installed vite-plus package");
