#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
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
pkg.version = "0.2.3";
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
pkg.dependencies["@tiara-stack/tsgo-effect"] = "workspace:^";
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

const distFiles = await readdir(join(target, "dist"));
const constantsFile = distFiles.find((file) => file.startsWith("constants-") && file.endsWith(".js"));
if (!constantsFile) {
  throw new Error("Unable to find generated dist/constants-*.js file");
}
await patchFile(join("dist", constantsFile), [[`var version = "0.2.2";`, `var version = "${pkg.version}";`]]);

const packBinFile =
  distFiles.find((file) => file.startsWith("pack-bin-") && file.endsWith(".js")) ??
  (distFiles.includes("pack-bin.js") ? "pack-bin.js" : undefined);
if (!packBinFile) {
  throw new Error("Unable to find generated dist/pack-bin*.js file");
}
await patchFile(join("dist", packBinFile), [
  [
    'import module from "node:module";',
    'import module from "node:module";\nimport { existsSync } from "node:fs";\nimport { dirname, join, resolve } from "node:path";',
  ],
  [
    'const DEFAULT_ENV_PREFIXES = ["VITE_PACK_", "TSDOWN_"];',
    'const require = module.createRequire(import.meta.url);\nfunction resolveTiaraTsgoPath() {\n\tconst executableName = process.platform === "win32" ? "tsgo.exe" : "tsgo";\n\tconst candidates = [process.env.TIARA_TSGO_EFFECT_PATH, process.env.TIARA_TSGO_PATH, resolvePackagedTsgoPath(executableName), findUp(process.cwd(), join("native", "typescript-go", "built", "local", executableName))].filter((path) => Boolean(path));\n\tconst binaryPath = candidates.find((path) => existsSync(path));\n\tif (!binaryPath) throw new Error(["Unable to locate tsgo-effect for dts generation.", "Install @tiara-stack/tsgo-effect with a platform binary or build native/typescript-go/built/local/tsgo.", "Set TIARA_TSGO_EFFECT_PATH to override the binary path."].join(" "));\n\treturn binaryPath;\n}\nfunction resolvePackagedTsgoPath(executableName) {\n\ttry {\n\t\tconst packageJsonPath = require.resolve("@tiara-stack/tsgo-effect/package.json");\n\t\treturn join(dirname(packageJsonPath), "vendor", `${process.platform}-${process.arch}`, executableName);\n\t} catch {\n\t\treturn;\n\t}\n}\nfunction withTiaraTsgoDtsConfig(dts) {\n\tif (!dts || typeof dts !== "object" || dts.tsgo !== true) return dts;\n\treturn { ...dts, tsgo: { path: resolveTiaraTsgoPath() } };\n}\nfunction findUp(start, relativePath) {\n\tlet directory = resolve(start);\n\twhile (true) {\n\t\tconst candidate = join(directory, relativePath);\n\t\tif (existsSync(candidate)) return candidate;\n\t\tconst parent = dirname(directory);\n\t\tif (parent === directory) return;\n\t\tdirectory = parent;\n\t}\n}\nconst DEFAULT_ENV_PREFIXES = ["VITE_PACK_", "TSDOWN_"];',
  ],
  [
    "const merged = {\n\t\t\t\t...packConfig,\n\t\t\t\t...flags\n\t\t\t};",
    "const merged = {\n\t\t\t\t...packConfig,\n\t\t\t\t...flags\n\t\t\t};\n\t\t\tmerged.dts = withTiaraTsgoDtsConfig(merged.dts);",
  ],
]);

console.log("Synced packages/vite-plus from installed vite-plus package");
