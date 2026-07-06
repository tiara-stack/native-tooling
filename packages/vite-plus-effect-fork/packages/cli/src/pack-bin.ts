#!/usr/bin/env node
import module from 'node:module';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import {
  buildWithConfigs,
  resolveUserConfig,
  globalLogger,
  enableDebug,
  type InlineConfig,
  type ResolvedConfig,
} from '@voidzero-dev/vite-plus-core/pack';
import { cac } from 'cac';

import { resolveViteConfig } from './resolve-vite-config.ts';

// Matches a `.d.ts` / `.d.mts` / `.d.cts` importer.
const RE_DTS = /\.d\.[cm]?ts$/;
// Bare specifier for postcss / lightningcss / vitest / `@vitest/*` /
// vite-plus (root or any subpath).
const EXTERNAL_DTS_PKG_RE = /^(?:postcss|lightningcss|vitest|@vitest\/[^/]+|vite-plus)(?:\/|$)/;

/**
 * Rolldown plugin that keeps `postcss` / `lightningcss` / `vitest` / `@vitest/*`
 * / `vite-plus` external to the DTS bundle.
 *
 * The DTS bundler resolves these packages and tries to inline their `.d.ts`
 * files. postcss ships its public types as a CJS `export = postcss` over a
 * `declare namespace postcss { export { AtRule, ... } }` (see
 * postcss/lib/postcss.d.ts), and its ESM types entry (postcss.d.mts) re-exports
 * those names with `export { AtRule, ... } from './postcss.js'`. The bundler
 * cannot map named imports onto an `export =`'d namespace's members, so every
 * consumer `import type { AtRule } from 'postcss'` becomes a MISSING_EXPORT
 * error.
 *
 * vitest fails for a different reason: `vitest@4.1.9`'s `dist/index.d.ts`
 * re-exports `ExpectPollOptions` from `@vitest/expect`, but `@vitest/expect`
 * does not actually export that name. `tsc` tolerates the dangling re-export
 * because it only resolves re-exports lazily on use, but the DTS bundler
 * eagerly resolves every re-export while inlining and so hits the missing
 * export. `@vitest/browser/matchers.d.ts` then re-imports the same name from
 * `vitest`, propagating the failure. Established vite-plus projects reach
 * these files through the `vite-plus/test*` shims, which re-export `vitest` /
 * `@vitest/*` from declaration files.
 *
 * `vite-plus` itself (root and `vite-plus/test*` shims) is kept external so the
 * PUBLIC specifier survives in the emitted declarations. If the shim were
 * inlined instead, its private `vitest` / `@vitest/*` re-exports would be the
 * ones externalized above and the published `.d.ts` would carry bare `vitest`
 * specifiers — unresolvable for consumers under strict pnpm / Yarn PnP layouts,
 * where `vitest` is a dependency of `vite-plus` and not of the packed package.
 *
 * Marking these packages external for `.d.ts` importers leaves the import
 * untouched in the emitted declarations (`import type { AtRule } from 'postcss'`),
 * which is how third-party packages should be treated in a DTS bundle anyway.
 * They are only externalized when imported *from a declaration file*, so runtime
 * bundling is unaffected.
 */
function externalDtsTypeOnlyPlugin() {
  return {
    name: 'vite-plus:external-dts-type-only',
    resolveId: {
      order: 'pre' as const,
      handler(id: string, importer: string | undefined) {
        // Normalize Windows backslash paths to forward slashes for regex matching
        const normalizedImporter = importer?.replaceAll('\\', '/');
        if (normalizedImporter && RE_DTS.test(normalizedImporter) && EXTERNAL_DTS_PKG_RE.test(id)) {
          return { id, external: true };
        }
        return undefined;
      },
    },
  };
}

const cli = cac('vp pack');
cli.help();

// support `TSDOWN_` for migration compatibility
const DEFAULT_ENV_PREFIXES = ['VITE_PACK_', 'TSDOWN_'];
const require = module.createRequire(import.meta.url);

function resolveTiaraTsgoPath(): string {
  const executableName = process.platform === 'win32' ? 'tsgo.exe' : 'tsgo';
  const candidates = [
    process.env.TIARA_TSGO_EFFECT_PATH,
    process.env.TIARA_TSGO_PATH,
    resolvePackagedTsgoPath(executableName),
    findUp(process.cwd(), join('native', 'typescript-go', 'built', 'local', executableName)),
  ].filter((path): path is string => Boolean(path));

  const binaryPath = candidates.find((path) => existsSync(path));
  if (!binaryPath) {
    throw new Error(
      [
        'Unable to locate tsgo-effect for dts generation.',
        'Install @tiara-stack/tsgo-effect with a platform binary or build native/typescript-go/built/local/tsgo.',
        'Set TIARA_TSGO_EFFECT_PATH to override the binary path.',
      ].join(' '),
    );
  }

  return binaryPath;
}

function resolvePackagedTsgoPath(_executableName: string): string | undefined {
  try {
    const binPath = require.resolve('@tiara-stack/tsgo-effect/bin/tsgo-effect');
    const result = spawnSync(process.execPath, [binPath, '--print-path'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const binaryPath = result.status === 0 ? result.stdout.trim() : undefined;
    return binaryPath && existsSync(binaryPath) ? binaryPath : undefined;
  } catch {
    return undefined;
  }
}

function withTiaraTsgoDtsConfig(dts: InlineConfig['dts']): InlineConfig['dts'] {
  if (!dts || typeof dts !== 'object' || dts.tsgo !== true) {
    return dts;
  }

  return {
    ...dts,
    tsgo: {
      path: resolveTiaraTsgoPath(),
    },
  };
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

cli
  .command('[...files]', 'Bundle files', {
    ignoreOptionDefaultValue: true,
    allowUnknownOptions: true,
  })
  // Only support config file in vite.config.ts
  // .option('-c, --config <filename>', 'Use a custom config file')
  .option('--config-loader <loader>', 'Config loader to use: auto, native, tsx, unrun', {
    default: 'auto',
  })
  .option('--no-config', 'Disable config file')
  .option('-f, --format <format>', 'Bundle format: esm, cjs, iife, umd', {
    default: 'esm',
  })
  .option('--clean', 'Clean output directory, --no-clean to disable')
  .option('--deps.never-bundle <module>', 'Mark dependencies as external')
  .option('--minify', 'Minify output')
  .option('--devtools', 'Enable devtools integration')
  .option('--debug [feat]', 'Show debug logs')
  .option('--target <target>', 'Bundle target, e.g "es2015", "esnext"')
  .option('-l, --logLevel <level>', 'Set log level: info, warn, error, silent')
  .option('--fail-on-warn', 'Fail on warnings', { default: true })
  .option('--no-write', 'Disable writing files to disk, incompatible with watch mode')
  .option('-d, --out-dir <dir>', 'Output directory', { default: 'dist' })
  .option('--treeshake', 'Tree-shake bundle', { default: true })
  .option('--sourcemap', 'Generate source map', { default: false })
  .option('--shims', 'Enable cjs and esm shims', { default: false })
  .option('--platform <platform>', 'Target platform', {
    default: 'node',
  })
  .option('--dts', 'Generate dts files')
  .option('--publint', 'Enable publint', { default: false })
  .option('--attw', 'Enable Are the types wrong integration', {
    default: false,
  })
  .option('--unused', 'Enable unused dependencies check', { default: false })
  .option('-w, --watch [path]', 'Watch mode')
  .option('--ignore-watch <path>', 'Ignore custom paths in watch mode')
  .option('--from-vite [vitest]', 'Reuse config from Vite or Vitest')
  .option('--report', 'Size report', { default: true })
  .option('--env.* <value>', 'Define compile-time env variables')
  .option(
    '--env-file <file>',
    'Load environment variables from a file, when used together with --env, variables in --env take precedence',
  )
  .option('--env-prefix <prefix>', 'Prefix for env variables to inject into the bundle', {
    default: DEFAULT_ENV_PREFIXES,
  })
  .option('--on-success <command>', 'Command to run on success')
  .option('--copy <dir>', 'Copy files to output dir')
  .option('--public-dir <dir>', 'Alias for --copy, deprecated')
  .option('--tsconfig <tsconfig>', 'Set tsconfig path')
  .option('--unbundle', 'Unbundle mode')
  .option('--root <dir>', 'Root directory of input files')
  .option('--exe', 'Bundle as executable')
  .option('-W, --workspace [dir]', 'Enable workspace mode')
  .option('-F, --filter <pattern>', 'Filter configs (cwd or name), e.g. /pkg-name$/ or pkg-name')
  .option('--exports', 'Generate export-related metadata for package.json (experimental)')
  .action(async (input: string[], flags: InlineConfig) => {
    if (input.length > 0) {
      flags.entry = input;
    }
    if (flags.envPrefix === undefined) {
      flags.envPrefix = DEFAULT_ENV_PREFIXES;
    }

    async function runBuild() {
      const viteConfig = await resolveViteConfig(process.cwd(), {
        traverseUp: flags.config !== false,
      });

      const configDeps = new Set<string>();
      if (viteConfig.configFile) {
        configDeps.add(viteConfig.configFile);
      }

      const configs: ResolvedConfig[] = [];
      const packConfigs = Array.isArray(viteConfig.pack)
        ? viteConfig.pack
        : [viteConfig.pack ?? {}];
      for (const packConfig of packConfigs) {
        const merged = { ...packConfig, ...flags };
        merged.dts = withTiaraTsgoDtsConfig(merged.dts);
        // Keep postcss/lightningcss external to the dts bundle (see plugin doc)
        if (merged.dts) {
          const existingPlugins = Array.isArray(merged.plugins) ? merged.plugins : [];
          merged.plugins = [...existingPlugins, externalDtsTypeOnlyPlugin()];
        }
        const resolvedConfig = await resolveUserConfig(merged, flags, configDeps);
        configs.push(...resolvedConfig);
      }

      await buildWithConfigs(configs, configDeps, runBuild);
    }

    await runBuild();
  });

export async function runCLI(): Promise<void> {
  cli.parse(process.argv, { run: false });

  enableDebug(cli.options.debug);

  try {
    await cli.runMatchedCommand();
  } catch (error) {
    globalLogger.error(error instanceof Error ? error.stack || error.message : error);
    process.exit(1);
  }
}

if (module.enableCompileCache) {
  module.enableCompileCache();
}

await runCLI();
