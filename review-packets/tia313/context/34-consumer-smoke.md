# Backend diagnostics and framed headless output

Independently assess this consumer against the producer/input/output packets. Preserve diagnostic IDs/counts/ranges and framed protocol behavior.

### `scripts/test/native-backend.test.mjs`

Mode `100644`, blob `f9012cd804397f79f3c43ef9a161d283b82f6004`, SHA256 `3f808e02fa3c1c5523826261d0f06a3cf23901fce1c733693b573595228e969f`, 10339 bytes.

Current source lines 1-40, excerpt SHA256 `994ef6c8e115b571311b960f6a4541d1d7b482e70d68f3eef07378dc42753fe1`.

```text
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const backend =
  process.env.OXLINT_TSGOLINT_PATH ?? join(root, "native/tsgolint-effect-fork/tsgolint");

const wrappers = [
  {
    name: "tsgo-effect",
    api: "resolveTsgoEffectPath",
    binary: "native/typescript-go/built/local/tsgo",
    override: "TIARA_TSGO_EFFECT_PATH",
    build: "native:build:tsgo",
  },
  {
    name: "tsgolint-effect",
    api: "resolveTsgolintEffectPath",
    binary: "native/tsgolint-effect-fork/tsgolint",
    override: "TIARA_TSGOLINT_EFFECT_PATH",
    build: "native:build:tsgolint",
  },
];

test("source wrapper commands and APIs select local builds and honor explicit overrides", () => {
  for (const wrapper of wrappers) {
    const environment = { ...process.env };
```

Current source lines 194-274, excerpt SHA256 `ddad9eacdd045ff14c8e8d85b27b3834ade19a5d6df9f29d0731a7ba42a7cf74`.

```text
  assert.match(diagnostic.message.help, /rejection handler/);
  assert.deepEqual(diagnostic.labeled_ranges, [
    {
      label: "This unhandled promise-like value has type `Promise<number>`.",
      range: { pos: 0, end: 18 },
    },
  ]);
  assert.equal(source.slice(diagnostic.range.pos, diagnostic.range.end), "Promise.resolve(1)");
});

test("readonly diagnostics retain their message, help and member range", () => {
  const source = "class Example { private value = 1; get() { return this.value; } }\n";
  const [diagnostic] = lint(source, "prefer-readonly");
  assert.equal(diagnostic.rule, "prefer-readonly");
  assert.equal(diagnostic.message.id, "preferReadonly");
  assert.equal(diagnostic.message.description, "Member 'value' is never reassigned.");
  assert.equal(diagnostic.message.help, "Mark it as `readonly`.");
  assert.equal(source.slice(diagnostic.range.pos, diagnostic.range.end), "private value");
});

test("the stable Effect package still produces floating Effect diagnostics", () => {
  const source = 'import { Effect } from "effect";\nEffect.succeed("probe");\n';
  const [diagnostic] = lint(source, "floating_effect");
  assert.equal(diagnostic.rule, "floating_effect");
  assert.equal(diagnostic.message.id, "floatingEffect");
  assert.match(diagnostic.message.description, /effect\(floatingEffect\)/);
  assert.equal(source.slice(diagnostic.range.pos, diagnostic.range.end), 'Effect.succeed("probe")');
});

function lint(source, rule) {
  mkdirSync(join(root, ".tmp"), { recursive: true });
  const fixture = mkdtempSync(join(root, ".tmp/native-backend-"));
  const file = join(fixture, "source.ts");
  try {
    writeFileSync(file, source);
    writeFileSync(
      join(fixture, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          module: "ESNext",
          moduleResolution: "Bundler",
          target: "ES2022",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          plugins: [{ name: "@effect/language-service", diagnostics: true }],
        },
        files: ["source.ts"],
      }),
    );
    const result = spawnSync(backend, ["headless"], {
      cwd: fixture,
      input: JSON.stringify({
        version: 2,
        configs: [{ file_paths: [file], rules: [{ name: rule }] }],
      }),
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr.toString());
    const diagnostics = [];
    for (let offset = 0; offset < result.stdout.length; ) {
      assert.ok(offset + 5 <= result.stdout.length, "complete frame header");
      const length = result.stdout.readUInt32LE(offset);
      const kind = result.stdout[offset + 4];
      offset += 5;
      assert.ok(offset + length <= result.stdout.length, "complete frame body");
      const body = JSON.parse(result.stdout.subarray(offset, offset + length).toString());
      offset += length;
      assert.notEqual(kind, 0, JSON.stringify(body));
      if (kind === 1) {
        assert.equal(body.kind, 0, "rule diagnostic");
        assert.equal(body.file_path, file);
        diagnostics.push(body);
      }
    }
    assert.equal(diagnostics.length, 1, JSON.stringify(diagnostics));
    return diagnostics;
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}
```

### `scripts/headless-smoke.mjs`

Mode `100644`, blob `6a23dfe57ad2318e89677467da93323740e48b75`, SHA256 `61a005629c02c99766baa06cca2e16f27897059ff5bfdb3fc937d0c49712aca1`, 3383 bytes.

Current source lines 1-48, excerpt SHA256 `b178b2de74b220b788edae9cb95a2fdcf1afc6ffd2eee5a958f7cff353310687`.

```text
#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const fixtureRoot = resolve(root, ".tmp", "headless-smoke");
const srcDir = resolve(fixtureRoot, "src");
const tsconfigPath = resolve(fixtureRoot, "tsconfig.json");
const probePath = resolve(srcDir, "native-effect-smoke.ts");
const binary = resolve(root, "native", "tsgolint-effect-fork", "tsgolint");

await rm(fixtureRoot, { recursive: true, force: true });
await mkdir(srcDir, { recursive: true });

await writeFile(
  tsconfigPath,
  JSON.stringify(
    {
      compilerOptions: {
        module: "ESNext",
        moduleResolution: "Bundler",
        target: "ES2022",
        strict: true,
        skipLibCheck: true,
        plugins: [
          {
            name: "@effect/language-service",
            diagnostics: true,
            diagnosticSeverity: {}
          }
        ]
      },
      include: ["src/**/*.ts"]
    },
    null,
    2
  )
);

await writeFile(probePath, 'import { Effect } from "effect";\n\nEffect.succeed("probe");\n');

const payload = {
  version: 2,
  configs: [
    {
      file_paths: [probePath],
```

Current source lines 80-118, excerpt SHA256 `bcd3266fa3af8a75ff544692f1f64e9b97d349ca05ba84725f7a0a969ab8d56d`.

```text
      throw new Error(`truncated frame header at byte ${offset}`);
    }
    const length = output.readUInt32LE(offset);
    const type = output.readUInt8(offset + 4);
    offset += 5;
    if (offset + length > output.length) {
      throw new Error(`truncated frame payload at byte ${offset}`);
    }
    const body = JSON.parse(output.subarray(offset, offset + length).toString("utf8"));
    offset += length;
    messages.push({ type, body });
  }

  if (status !== 0) {
    throw new Error(`tsgolint exited with ${status}: ${Buffer.concat(stderr).toString("utf8")}`);
  }

  const errors = messages.filter((message) => message.type === 0);
  if (errors.length > 0) {
    throw new Error(`headless returned error frames: ${JSON.stringify(errors)}`);
  }

  const diagnostics = messages.filter((message) => message.type === 1).map((message) => message.body);
  const floatingEffect = diagnostics.find((diagnostic) => diagnostic.rule === "floating_effect");
  if (!floatingEffect) {
    throw new Error(`expected floating_effect diagnostic, got ${JSON.stringify(messages)}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        diagnostics: diagnostics.length,
        rule: floatingEffect.rule,
        message: floatingEffect.message?.description
      },
      null,
      2
    )
```
