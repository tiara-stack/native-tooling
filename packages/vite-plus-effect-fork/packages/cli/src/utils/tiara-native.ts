import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const binaries = {
  oxlint: {
    overrides: ['TIARA_OXLINT_EFFECT_PATH', 'TIARA_REAL_OXLINT_PATH'],
    local: ['native', 'oxc-oxlint-effect-fork', 'target', 'release', 'oxlint'],
  },
  tsgolint: {
    overrides: ['TIARA_TSGOLINT_EFFECT_PATH'],
    local: ['native', 'tsgolint-effect-fork', 'tsgolint'],
  },
  tsgo: {
    overrides: ['TIARA_TSGO_EFFECT_PATH', 'TIARA_TSGO_PATH'],
    local: ['native', 'typescript-go', 'built', 'local', 'tsgo'],
  },
} as const;

// Source checkouts must use their own native builds, including when a published
// wrapper happens to be installed. A missing build is an error, not a fallback.
export function resolveTiaraNative(tool: keyof typeof binaries): string {
  const spec = binaries[tool];
  const override = spec.overrides.map((name) => process.env[name]).find(Boolean);
  if (override) return assertBinary(resolve(override), tool);

  const sourceRoot = findSourceRoot(process.cwd()) ?? findSourceRoot(import.meta.dirname);
  if (sourceRoot) {
    const parts: string[] = [...spec.local];
    if (process.platform === 'win32') parts[parts.length - 1] += '.exe';
    return assertBinary(join(sourceRoot, ...parts), tool);
  }

  const wrapper = resolveTiaraWrapper(tool);
  const result = spawnSync(process.execPath, [wrapper, '--print-path'], { encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    throw new Error(`Unable to resolve Tiara ${tool}: ${result.error?.message ?? result.stderr}`);
  }
  return assertBinary(result.stdout.trim(), tool);
}

export function resolveTiaraWrapper(tool: keyof typeof binaries): string {
  return require.resolve(`@tiara-stack/${tool}-effect/bin/${tool}-effect`);
}

function assertBinary(path: string, tool: keyof typeof binaries): string {
  if (!path || !existsSync(path)) {
    throw new Error(
      `Missing Tiara ${tool} build at ${path}. Build the repo-local native tool or set ${binaries[tool].overrides[0]}.`,
    );
  }
  return path;
}

function findSourceRoot(start: string): string | undefined {
  let directory = resolve(start);
  while (true) {
    const manifest = join(directory, 'package.json');
    if (existsSync(manifest)) {
      try {
        const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
        if (pkg?.name === '@tiara-stack/native-tooling-monorepo') return directory;
      } catch {
        // Unrelated malformed or unreadable manifests do not identify a source root.
      }
    }
    const parent = dirname(directory);
    if (parent === directory) return undefined;
    directory = parent;
  }
}
