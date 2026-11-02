import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const executableName = process.platform === "win32" ? "tsgolint.exe" : "tsgolint";

const packageRoot = findPackageRoot(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

export const resolveTsgolintEffectPath = (): string => {
  const explicitPath = [process.env.TIARA_TSGOLINT_EFFECT_PATH].find((path): path is string =>
    Boolean(path && existsSync(path)),
  );
  if (explicitPath) return explicitPath;

  const sourceRoot = resolve(packageRoot, "../..");
  if (existsSync(join(sourceRoot, "native", "tsgolint-effect-fork", "go.mod"))) {
    const sourceBinary = join(sourceRoot, "native", "tsgolint-effect-fork", executableName);
    if (existsSync(sourceBinary)) return sourceBinary;
    throw new Error(
      "Repository-local tsgolint-effect is not built. Run pnpm native:build:tsgolint.",
    );
  }

  const candidates = [
    resolvePlatformBinary(),
    join(packageRoot, "vendor", `${process.platform}-${process.arch}`, executableName),
    findUp(process.cwd(), join("native", "tsgolint-effect-fork", executableName)),
    findUp(packageRoot, join("native", "tsgolint-effect-fork", executableName)),
  ].filter((path): path is string => Boolean(path));

  const binaryPath = candidates.find((path) => existsSync(path));
  if (!binaryPath) {
    throw new Error(
      [
        "Unable to locate tsgolint-effect.",
        "Build native/tsgolint-effect-fork/tsgolint or install a platform package that provides vendor binaries.",
        "Set TIARA_TSGOLINT_EFFECT_PATH to override the binary path.",
      ].join(" "),
    );
  }

  return binaryPath;
};

function resolvePlatformBinary(): string | undefined {
  if (process.platform !== "linux" || process.arch !== "x64") return undefined;
  try {
    const manifest = require.resolve("@tiara-stack/tsgolint-effect-linux-x64/package.json");
    return join(dirname(manifest), "vendor", executableName);
  } catch {
    return undefined;
  }
}

function findPackageRoot(start: string): string {
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

function findUp(start: string, relativePath: string): string | undefined {
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
