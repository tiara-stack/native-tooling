#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const executableName = process.platform === "win32" ? "tsgolint.exe" : "tsgolint";
const packageRoot = findPackageRoot(fileURLToPath(import.meta.url));

const binaryPath = resolveBinary();

if (process.argv.includes("--print-path")) {
  console.log(binaryPath);
  process.exit(0);
}

const result = spawnSync(binaryPath, process.argv.slice(2), {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);

function resolveBinary() {
  /** @type {string[]} */
  const candidates = [];
  for (const candidate of [
    process.env.TIARA_TSGOLINT_EFFECT_PATH,
    process.env.TIARA_REAL_TSGOLINT_PATH,
    join(packageRoot, "vendor", `${process.platform}-${process.arch}`, executableName),
    findUp(process.cwd(), join("native", "tsgolint-effect-fork", executableName)),
    findUp(packageRoot, join("native", "tsgolint-effect-fork", executableName)),
  ]) {
    if (candidate) {
      candidates.push(candidate);
    }
  }

  const binaryPath = candidates.find((path) => existsSync(path));
  if (!binaryPath) {
    console.error(
      [
        "Unable to locate tsgolint-effect.",
        "Build native/tsgolint-effect-fork/tsgolint or install a platform package that provides vendor binaries.",
        "Set TIARA_TSGOLINT_EFFECT_PATH to override the binary path.",
      ].join(" "),
    );
    process.exit(1);
  }

  return binaryPath;
}

/**
 * @param {string} start
 * @returns {string}
 */
function findPackageRoot(start) {
  let directory = dirname(start);
  while (true) {
    if (existsSync(join(directory, "package.json"))) {
      return directory;
    }
    const parent = dirname(directory);
    if (parent === directory) {
      return resolve(".");
    }
    directory = parent;
  }
}

/**
 * @param {string} start
 * @param {string} relativePath
 * @returns {string | undefined}
 */
function findUp(start, relativePath) {
  let directory = resolve(start);
  while (true) {
    const candidate = join(directory, relativePath);
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = dirname(directory);
    if (parent === directory) {
      return undefined;
    }
    directory = parent;
  }
}
