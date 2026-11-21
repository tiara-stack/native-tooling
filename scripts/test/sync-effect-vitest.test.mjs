import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { removeMissingDeclarationMapReferences } from "../lib/declaration-source-maps.mjs";

const generator = fileURLToPath(new URL("../sync-effect-vitest.mjs", import.meta.url));
const upstreamReadme = fileURLToPath(
  new URL("../../packages/effect-smol-fork/packages/vitest/README.md", import.meta.url),
);

test("package normalization removes only missing local declaration-map references", async () => {
  const root = mkdtempSync(join(tmpdir(), "declaration-source-maps-"));
  try {
    const declaration = "export declare const value: number;\n";
    const valid = `${declaration}//# sourceMappingURL=present.d.cts.map\n`;
    const inline = `${declaration}//# sourceMappingURL=data:application/json;base64,e30=\n`;
    const javascript = "export const value = 1;\n//# sourceMappingURL=missing.mjs.map\n";
    writeFileSync(join(root, "missing.d.mts"), `${declaration}//# sourceMappingURL=missing.map\n`);
    writeFileSync(join(root, "present.d.cts"), valid);
    writeFileSync(join(root, "present.d.cts.map"), "{}");
    writeFileSync(join(root, "inline.d.ts"), inline);
    writeFileSync(join(root, "index.mjs"), javascript);
    await removeMissingDeclarationMapReferences(root);
    assert.equal(readFileSync(join(root, "missing.d.mts"), "utf8"), declaration);
    assert.equal(readFileSync(join(root, "present.d.cts"), "utf8"), valid);
    assert.equal(readFileSync(join(root, "inline.d.ts"), "utf8"), inline);
    assert.equal(readFileSync(join(root, "index.mjs"), "utf8"), javascript);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function fixture(runner) {
  const root = mkdtempSync(join(tmpdir(), "effect-vitest-sync-"));
  const write = (path, value) => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, value);
  };
  write("package.json", JSON.stringify({ type: "module" }));
  write(
    "packages/vite-plus/package.json",
    JSON.stringify({
      name: "@tiara-stack/vite-plus",
      version: "1.0.0",
      dependencies: { vitest: runner },
      exports: { "./test": { types: "./dist/test/index.d.ts", default: "./dist/test/index.js" } },
    }),
  );
  write("packages/vite-plus/dist/test/index.js", 'export * from "vitest";\n');
  write("packages/vite-plus/dist/test/index.d.ts", 'export * from "vitest";\n');
  write(
    "packages/effect-vitest/package.json",
    JSON.stringify({ peerDependencies: { effect: "^4.0.1", "@tiara-stack/vite-plus": "^0.2.2" } }),
  );
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
  write(
    "packages/vite-plus-effect-fork/packages/cli/node_modules/oxfmt/package.json",
    JSON.stringify({ type: "module", exports: "./index.mjs" }),
  );
  write(
    "packages/vite-plus-effect-fork/packages/cli/node_modules/oxfmt/index.mjs",
    "export async function format(_path, code) { return { code, errors: [] }; }\n",
  );
  copyFileSync(upstreamReadme, join(root, "packages/effect-smol-fork/packages/vitest/README.md"));
  write("packages/effect-vitest/src/index.ts", "existing helper\n");
  write("packages/effect-vitest/LICENSE", "existing license\n");
  write("packages/effect-vitest/README.md", "existing readme\n");
  mkdirSync(join(root, "scripts"));
  copyFileSync(generator, join(root, "scripts/sync-effect-vitest.mjs"));
  mkdirSync(join(root, "scripts/lib"));
  copyFileSync(
    new URL("../lib/replace-package-trees.mjs", import.meta.url),
    join(root, "scripts/lib/replace-package-trees.mjs"),
  );
  return root;
}

function snapshot(directory) {
  return Object.fromEntries(
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? Object.entries(snapshot(path)).map(([key, value]) => [entry.name + "/" + key, value])
        : [[entry.name, readFileSync(path, "utf8")]];
    }),
  );
}

for (const fault of ["stage", "backup", "install", "rollback", "none"]) {
  test(`helper replacement ${fault} preserves retained entries and runtime`, () => {
    const root = fixture("5.0.1"),
      target = join(root, "packages/effect-vitest");
    try {
      for (const path of ["node_modules", "dist"]) {
        mkdirSync(join(target, path));
        writeFileSync(join(target, path, "sentinel"), "retained " + path);
      }
      const before = snapshot(target),
        inode = statSync(join(target, "node_modules")).ino;
      const preload = join(root, "fault.mjs");
      writeFileSync(
        preload,
        `
import fs from "node:fs/promises";
import { syncBuiltinESMExports } from "node:module";
const target = ${JSON.stringify(target)}, mode = ${JSON.stringify(fault)};
const write = fs.writeFile, rename = fs.rename;
let failed = false;
fs.writeFile = async (path, ...rest) => {
  if (!failed && mode === "stage" && String(path).endsWith("/internal/internal.ts")) {
    failed = true; throw new Error("staging fault");
  }
  return write(path, ...rest);
};
fs.rename = async (from, to) => {
  if (!failed && ((mode === "backup" && from === target + "/README.md") ||
      (["install", "rollback"].includes(mode) && to === target + "/README.md"))) {
    failed = true; throw new Error("replacement fault");
  }
  if (mode === "rollback" && failed && String(from).includes("/vite-plus-backup-") && to === target + "/LICENSE")
    throw new Error("rollback fault");
  return rename(from, to);
};
syncBuiltinESMExports();
`,
      );
      const result = spawnSync(
        process.execPath,
        ["--import", preload, "scripts/sync-effect-vitest.mjs"],
        { cwd: root, encoding: "utf8" },
      );
      assert.equal(statSync(join(target, "node_modules")).ino, inode);
      assert.equal(readFileSync(join(target, "dist/sentinel"), "utf8"), "retained dist");
      if (fault === "none") {
        assert.equal(result.status, 0, result.stderr);
        assert.match(
          readFileSync(join(target, "src/index.ts"), "utf8"),
          /@tiara-stack\/vite-plus\/test/,
        );
      } else {
        assert.notEqual(result.status, 0, "fault must reach the actual publication path");
        if (fault === "rollback") {
          assert.match(result.stderr, /rollback is incomplete; retained backup/);
          const backup = readdirSync(join(root, ".tmp")).find((name) =>
            name.startsWith("vite-plus-backup-"),
          );
          assert.equal(
            readFileSync(join(root, ".tmp", backup, "0/LICENSE"), "utf8"),
            before.LICENSE,
          );
        } else assert.deepEqual(snapshot(target), before);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
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
    const pkg = JSON.parse(readFileSync(join(root, "packages/effect-vitest/package.json"), "utf8"));
    assert.equal(pkg.peerDependencies["@tiara-stack/vite-plus"], ">=1.0.0 <2.0.0");
    assert.equal(pkg.peerDependencies.effect, "^4.0.1");
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

for (const missing of [
  "runtime export",
  "type export",
  "built runtime",
  "source rewrite",
  "TestRunner API",
]) {
  test(`sync preserves the retained helper when missing ${missing}`, () => {
    const root = fixture("5.0.1");
    try {
      const manifestPath = join(root, "packages/vite-plus/package.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      if (missing === "runtime export") delete manifest.exports["./test"].default;
      if (missing === "type export") delete manifest.exports["./test"].types;
      writeFileSync(manifestPath, JSON.stringify(manifest));
      if (missing === "built runtime") rmSync(join(root, "packages/vite-plus/dist/test/index.js"));
      if (missing === "source rewrite")
        writeFileSync(
          join(root, "packages/effect-smol-fork/packages/vitest/src/utils.ts"),
          'export { assert } from "changed-runner";\n',
        );
      if (missing === "TestRunner API")
        writeFileSync(
          join(root, "packages/effect-smol-fork/packages/vitest/src/internal/internal.ts"),
          'import * as V from "vitest";\n',
        );
      const result = spawnSync(process.execPath, ["scripts/sync-effect-vitest.mjs"], {
        cwd: root,
        encoding: "utf8",
      });
      assert.notEqual(result.status, 0, missing);
      assert.equal(
        readFileSync(join(root, "packages/effect-vitest/src/index.ts"), "utf8"),
        "existing helper\n",
      );
      assert.equal(
        readFileSync(join(root, "packages/effect-vitest/README.md"), "utf8"),
        "existing readme\n",
      );
      const pkg = JSON.parse(
        readFileSync(join(root, "packages/effect-vitest/package.json"), "utf8"),
      );
      assert.equal(pkg.peerDependencies["@tiara-stack/vite-plus"], "^0.2.2");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}

for (const failure of ["missing formatter", "formatter error"]) {
  test(`sync preserves the retained helper on ${failure}`, () => {
    const root = fixture("5.0.1");
    try {
      const formatter = join(
        root,
        "packages/vite-plus-effect-fork/packages/cli/node_modules/oxfmt",
      );
      if (failure === "missing formatter") rmSync(formatter, { recursive: true });
      else
        writeFileSync(
          join(formatter, "index.mjs"),
          "export async function format(path, code) { return { code, errors: path.endsWith('utils.ts') ? [{ message: 'formatting failed' }] : [] }; }\n",
        );
      const result = spawnSync(process.execPath, ["scripts/sync-effect-vitest.mjs"], {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, NODE_PATH: "" },
      });
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, failure === "missing formatter" ? /oxfmt/ : /formatting failed/);
      for (const [path, expected] of [
        ["src/index.ts", "existing helper\n"],
        ["LICENSE", "existing license\n"],
        ["README.md", "existing readme\n"],
      ])
        assert.equal(readFileSync(join(root, "packages/effect-vitest", path), "utf8"), expected);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}
