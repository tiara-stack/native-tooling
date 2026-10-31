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
    delete environment.TIARA_TSGO_EFFECT_PATH;
    delete environment.TIARA_TSGO_PATH;
    delete environment.TIARA_TSGOLINT_EFFECT_PATH;
    for (const override of [undefined, process.execPath]) {
      if (override) environment[wrapper.override] = override;
      const expected = override ?? join(root, wrapper.binary);
      for (const command of wrapperCommands(wrapper)) {
        const result = spawnSync(process.execPath, command, {
          cwd: root,
          env: environment,
          encoding: "utf8",
        });
        assert.ifError(result.error);
        assert.equal(result.status, 0, result.stderr);
        assert.equal(result.stdout.trim(), expected);
      }
    }
  }
});

test("source wrappers explain which local build is missing", () => {
  for (const wrapper of wrappers) {
    const binary = join(root, wrapper.binary);
    const saved = `${binary}.test-backup-${process.pid}`;
    renameSync(binary, saved);
    try {
      const environment = { ...process.env };
      delete environment.TIARA_TSGO_EFFECT_PATH;
      delete environment.TIARA_TSGO_PATH;
      delete environment.TIARA_TSGOLINT_EFFECT_PATH;
      for (const command of wrapperCommands(wrapper)) {
        const result = spawnSync(process.execPath, command, {
          cwd: root,
          env: environment,
          encoding: "utf8",
        });
        assert.ifError(result.error);
        assert.equal(result.status, 1);
        assert.ok(result.stderr.includes(`Run pnpm ${wrapper.build}`), result.stderr);
      }
    } finally {
      renameSync(saved, binary);
    }
  }
});

test("installed wrapper APIs and commands resolve their optional platform binaries", () => {
  const fixture = mkdtempSync(join(tmpdir(), "tiara-installed-wrappers-"));
  try {
    for (const wrapper of wrappers) {
      const packageRoot = join(fixture, "packages", wrapper.name);
      const platformRoot = join(
        fixture,
        "node_modules",
        "@tiara-stack",
        `${wrapper.name}-linux-x64`,
      );
      const executableName = wrapper.name === "tsgo-effect" ? "tsgo" : "tsgolint";
      const expected = join(platformRoot, "vendor", executableName);
      mkdirSync(join(packageRoot, "bin"), { recursive: true });
      mkdirSync(join(packageRoot, "src"), { recursive: true });
      mkdirSync(join(platformRoot, "vendor"), { recursive: true });
      writeFileSync(join(packageRoot, "package.json"), JSON.stringify({ type: "module" }));
      writeFileSync(
        join(platformRoot, "package.json"),
        JSON.stringify({
          name: `@tiara-stack/${wrapper.name}-linux-x64`,
          exports: { "./package.json": "./package.json" },
        }),
      );
      copyFileSync(
        join(root, "packages", wrapper.name, "src", "index.ts"),
        join(packageRoot, "src", "index.ts"),
      );
      copyFileSync(
        join(root, "packages", wrapper.name, "bin", `${wrapper.name}.mjs`),
        join(packageRoot, "bin", `${wrapper.name}.mjs`),
      );
      symlinkSync(join(root, wrapper.binary), expected);
      const environment = { ...process.env };
      delete environment.TIARA_TSGO_EFFECT_PATH;
      delete environment.TIARA_TSGO_PATH;
      delete environment.TIARA_TSGOLINT_EFFECT_PATH;
      const commands = [
        [join(packageRoot, "bin", `${wrapper.name}.mjs`), "--print-path"],
        [
          "--experimental-strip-types",
          "--input-type=module",
          "--eval",
          `import { ${wrapper.api} } from ${JSON.stringify(pathToFileURL(join(packageRoot, "src", "index.ts")).href)}; console.log(${wrapper.api}());`,
        ],
      ];
      for (const command of commands) {
        const result = spawnSync(process.execPath, command, {
          cwd: fixture,
          env: environment,
          encoding: "utf8",
        });
        assert.ifError(result.error);
        assert.equal(result.status, 0, result.stderr);
        assert.equal(result.stdout.trim(), expected);
      }
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

function wrapperCommands(wrapper) {
  return [
    [join(root, "packages", wrapper.name, "bin", `${wrapper.name}.mjs`), "--print-path"],
    [
      "--experimental-strip-types",
      "--input-type=module",
      "--eval",
      `import { ${wrapper.api} } from ${JSON.stringify(pathToFileURL(join(root, "packages", wrapper.name, "src/index.ts")).href)}; console.log(${wrapper.api}());`,
    ],
  ];
}

test("the local compiler includes the selected TypeScript and Effect language service", () => {
  const result = spawnSync(join(root, "native/typescript-go/built/local/tsgo"), ["--version"], {
    encoding: "utf8",
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "Version 7.0.2+effect-tsgo.0.46.1");
});

test("the backend reports generated empty object types without panicking", () => {
  const source = 'export type Empty = Omit<{ value: number }, "value">;\n';
  const [diagnostic] = lint(source, "no-generated-empty-object-type");
  assert.equal(diagnostic.rule, "no-generated-empty-object-type");
  assert.equal(diagnostic.message.id, "noGeneratedEmptyObjectType");
  assert.equal(
    diagnostic.message.description,
    "This type resolves to `{}`, the empty object type. This was likely not intentional.",
  );
  assert.equal(
    source.slice(diagnostic.range.pos, diagnostic.range.end),
    'Omit<{ value: number }, "value">',
  );
});

test("promise diagnostics preserve the explanatory label and its source range", () => {
  const source = "Promise.resolve(1);\nexport {};\n";
  const [diagnostic] = lint(source, "no-floating-promises");
  assert.equal(diagnostic.rule, "no-floating-promises");
  assert.equal(diagnostic.message.id, "floatingVoid");
  assert.equal(
    diagnostic.message.description,
    "Promises must be awaited, add void operator to ignore.",
  );
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
