import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { lint, resolveWindowsTsgolintExecutable } from '../resolve-lint.js';

describe('resolve-lint', () => {
  let fixture: string;
  beforeEach(() => {
    fixture = mkdtempSync(join(tmpdir(), 'tiara-lint-'));
    for (const tool of ['oxlint', 'tsgolint']) {
      const path = join(fixture, tool);
      writeFileSync(path, '');
      vi.stubEnv(`TIARA_${tool.toUpperCase()}_EFFECT_PATH`, path);
    }
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    rmSync(fixture, { recursive: true, force: true });
  });

  it('should resolve binPath and OXLINT_TSGOLINT_PATH to existing files', async () => {
    const result = await lint();

    expect(result.binPath).toMatch(/tiara-oxlint\.mjs$/);
    expect(result.envs.TIARA_OXLINT_EFFECT_PATH).toBe(join(fixture, 'oxlint'));
    expect(result.envs.VP_RESOLVING_CONFIG_METADATA).toBe('1');
    expect(
      existsSync(result.binPath),
      `oxlint binPath should point to an existing file, got: ${result.binPath}`,
    ).toBe(true);

    const tsgolintPath = result.envs.OXLINT_TSGOLINT_PATH;
    expect(tsgolintPath).toBe(join(fixture, 'tsgolint'));
    expect(
      existsSync(tsgolintPath),
      `OXLINT_TSGOLINT_PATH should point to an existing file, got: ${tsgolintPath}`,
    ).toBe(true);
  });

  it('should keep the Windows tsgolint executable path absolute', () => {
    const tsgolintPath =
      'C:\\repo\\node_modules\\.pnpm\\vite-plus@0.1.24\\node_modules\\vite-plus\\node_modules\\.bin\\tsgolint.cmd';
    const result = resolveWindowsTsgolintExecutable(
      [
        'C:\\repo\\node_modules\\.pnpm\\vite-plus@0.1.24\\node_modules\\vite-plus\\node_modules\\.bin\\tsgolint.exe',
        tsgolintPath,
      ],
      {
        exists: (path) => path === tsgolintPath,
      },
    );

    expect(result).toBe(tsgolintPath);
    expect(result).not.toMatch(/^\.\\/);
  });
});
