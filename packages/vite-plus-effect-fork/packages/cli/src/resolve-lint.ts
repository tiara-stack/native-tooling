/**
 * Oxlint tool resolver for the vite-plus CLI.
 *
 * This module exports a function that resolves the oxlint binary path
 * using Node.js module resolution. The resolved path is passed back
 * to the Rust core, which then executes oxlint for code linting.
 *
 * Used for: `vite-plus lint` command
 *
 * Oxlint is a fast JavaScript/TypeScript linter written in Rust that
 * provides ESLint-compatible linting with significantly better performance.
 */

import { dirname, join } from 'node:path';

import { CONFIG_METADATA_ENV, DEFAULT_ENVS, resolveBundled } from './utils/constants.ts';
import { resolveTiaraNative } from './utils/tiara-native.ts';

export { resolveWindowsTsgolintExecutable } from './utils/tsgolint-path.ts';

/**
 * Resolves the oxlint binary path and environment variables.
 *
 * @returns Promise containing:
 *   - binPath: Absolute path to the oxlint binary
 *   - envs: Environment variables to set when executing oxlint
 *
 * The environment variables provide runtime context to oxlint,
 * including Node.js version information and package manager details.
 */
export async function lint(): Promise<{
  binPath: string;
  envs: Record<string, string>;
}> {
  // Use the patched native chain and retain the upstream Vite config handoff.
  const oxlintPath = resolveTiaraNative('oxlint');
  // Vite+ invokes lint with Node. The launcher reads Vite's lint block and
  // forwards serializable configuration to the selected standalone binary.
  const binPath = join(
    dirname(resolveBundled('vite-plus/package.json')),
    'bin',
    'tiara-oxlint.mjs',
  );
  const oxlintTsgolintPath = resolveTiaraNative('tsgolint');
  const result = {
    binPath,
    // TODO: provide envs inference API
    envs: {
      ...DEFAULT_ENVS,
      TIARA_OXLINT_EFFECT_PATH: oxlintPath,
      OXLINT_TSGOLINT_PATH: oxlintTsgolintPath,
      // oxlint loads vite.config.ts only to read the `lint` block, so skip the
      // user's Vite plugin factory (lazyPlugins) while it evaluates the config.
      [CONFIG_METADATA_ENV]: '1',
    },
  };
  return result;
}
