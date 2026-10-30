import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const generator = fileURLToPath(new URL("../sync-effect-vitest.mjs", import.meta.url));
const upstreamReadme = fileURLToPath(
  new URL("../../packages/effect-smol-fork/packages/vitest/README.md", import.meta.url),
);

function fixture(runner) {
  const root = mkdtempSync(join(tmpdir(), "effect-vitest-sync-"));
  const write = (path, value) => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, value);
  };
  write("package.json", JSON.stringify({ type: "module" }));
  write("packages/vite-plus/package.json", JSON.stringify({ dependencies: { vitest: runner } }));
  write(
    "packages/effect-smol-fork/packages/vitest/package.json",
    JSON.stringify({
      version: "4.0.1",
      peerDependencies: { vitest: ">=5.0.0 <6.0.0" },
      devDependencies: { vitest: "5.0.2" },
    }),
  );
  write("packages/effect-smol-fork/packages/vitest/src/index.ts", 'export * from "vitest";\n');
  write(
    "packages/effect-smol-fork/packages/vitest/src/internal/internal.ts",
    'import * as Arbitrary from "effect/Arbitrary";\nimport * as V from "vitest";\nconst getCurrentSuite = V.TestRunner.getCurrentSuite;\n',
  );
  write(
    "packages/effect-smol-fork/packages/vitest/src/utils.ts",
    'export { assert } from "vitest";\n',
  );
  write("packages/effect-smol-fork/packages/vitest/LICENSE", "MIT\n");
  copyFileSync(upstreamReadme, join(root, "packages/effect-smol-fork/packages/vitest/README.md"));
  write("packages/effect-vitest/src/index.ts", "existing helper\n");
  write("packages/effect-vitest/LICENSE", "existing license\n");
  write("packages/effect-vitest/README.md", "existing readme\n");
  mkdirSync(join(root, "scripts"));
  copyFileSync(generator, join(root, "scripts/sync-effect-vitest.mjs"));
  return root;
}

test("sync rejects an incompatible runner before replacing the existing helper", () => {
  const root = fixture("4.1.9");
  try {
    const result = spawnSync(process.execPath, ["scripts/sync-effect-vitest.mjs"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /requires Vitest >=5\.0\.0 <6\.0\.0.*embeds 4\.1\.9/);
    assert.equal(
      readFileSync(join(root, "packages/effect-vitest/src/index.ts"), "utf8"),
      "existing helper\n",
    );
    assert.equal(
      readFileSync(join(root, "packages/effect-vitest/LICENSE"), "utf8"),
      "existing license\n",
    );
    assert.equal(
      readFileSync(join(root, "packages/effect-vitest/README.md"), "utf8"),
      "existing readme\n",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("sync accepts a compatible runner without requiring the source development patch version", () => {
  const root = fixture("5.0.1");
  try {
    const result = spawnSync(process.execPath, ["scripts/sync-effect-vitest.mjs"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(join(root, "packages/effect-vitest/src/index.ts"), "utf8"),
      'export * from "@tiara-stack/vite-plus/test";\n',
    );
    const internal = readFileSync(
      join(root, "packages/effect-vitest/src/internal/internal.ts"),
      "utf8",
    );
    assert.match(internal, /from "effect\/Arbitrary"/);
    assert.match(internal, /from "@tiara-stack\/vite-plus\/test"/);
    assert.match(internal, /V\.TestRunner\.getCurrentSuite/);
    const readme = readFileSync(join(root, "packages/effect-vitest/README.md"), "utf8");
    assert.match(readme, /npm install -D @tiara-stack\/vite-plus @tiara-stack\/effect-vitest/);
    assert.doesNotMatch(readme, /npm install -D vitest/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("sync rejects an unexpected README installation command before replacing the helper", () => {
  const root = fixture("5.0.1");
  try {
    writeFileSync(
      join(root, "packages/effect-smol-fork/packages/vitest/README.md"),
      "# @effect/vitest\n\nnpm install -D changed-upstream-command\n",
    );
    const result = spawnSync(process.execPath, ["scripts/sync-effect-vitest.mjs"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /README.*expected installation command/);
    assert.equal(
      readFileSync(join(root, "packages/effect-vitest/src/index.ts"), "utf8"),
      "existing helper\n",
    );
    assert.equal(
      readFileSync(join(root, "packages/effect-vitest/LICENSE"), "utf8"),
      "existing license\n",
    );
    assert.equal(
      readFileSync(join(root, "packages/effect-vitest/README.md"), "utf8"),
      "existing readme\n",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
