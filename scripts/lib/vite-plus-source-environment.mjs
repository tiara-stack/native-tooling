import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { delimiter, join } from "node:path";

const prepared = new Set();

export function sourceEnvironment(root) {
  const env = { ...process.env, COREPACK_ENABLE_PROJECT_SPEC: "1" };
  if (env.TIARA_VITE_PLUS_PNPM_STORE_DIR)
    env.PNPM_CONFIG_STORE_DIR = env.TIARA_VITE_PLUS_PNPM_STORE_DIR;
  if (env.TIARA_VITE_PLUS_PNPM_VIRTUAL_STORE_DIR)
    env.PNPM_CONFIG_VIRTUAL_STORE_DIR = env.TIARA_VITE_PLUS_PNPM_VIRTUAL_STORE_DIR;

  // A root pnpm installation can shadow Corepack in lifecycle scripts even
  // after Corepack selected the fork's version for the initial command.
  const bin = join(root, ".tmp", "vite-plus-corepack");
  if (!prepared.has(bin)) {
    mkdirSync(bin, { recursive: true });
    const result = spawnSync("corepack", ["enable", "--install-directory", bin, "pnpm"], {
      env,
      encoding: "utf8",
    });
    if (result.error || result.status !== 0)
      throw new Error(
        `Preparing source pnpm shim failed: ${result.error?.message ?? (result.stderr?.trim() || result.status)}`,
      );
    prepared.add(bin);
  }
  env.PATH = `${bin}${delimiter}${env.PATH ?? ""}`;
  return env;
}
