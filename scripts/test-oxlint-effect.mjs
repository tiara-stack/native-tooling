import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
if (process.argv.includes("--patch-selection-only")) {
  const cases = testPatchedCliSelection();
  writeFileSync(1, `${JSON.stringify({ ok: true, patchedCliSelectionCases: cases })}\n`);
  process.exit(0);
}

const binary = join(
  root,
  "native/oxc-oxlint-effect-fork/target/release",
  process.platform === "win32" ? "oxlint.exe" : "oxlint",
);
const markerDirectory = join(
  root,
  "native/oxc-oxlint-effect-fork/crates/oxc_linter/src/rules/effect",
);
const names = readdirSync(markerDirectory)
  .filter((name) => name.endsWith(".rs"))
  .map((name) => name.slice(0, -3))
  .sort();
const temporaryRoot = join(root, ".tmp");
mkdirSync(temporaryRoot, { recursive: true });
const fixture = mkdtempSync(join(temporaryRoot, "oxlint-effect-"));
const sourcePath = join(fixture, "src/probe.ts");
const configPath = join(fixture, ".oxlintrc.json");
const requestPath = join(fixture, "request.json");
const backendPath = join(fixture, "native/tsgolint-effect-fork/tsgolint");
const overridePath = join(fixture, "override-tsgolint");
const source = "export const probe = 1;\n";
const publicName = (name) => `effect/${name.replaceAll("_", "-")}`;

// This backend exercises the CLI's protocol boundary independently of Effect's compiler.
// The real native backend is covered separately below.
const backend = `#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
const input = JSON.parse(readFileSync(0, "utf8"));
if (input.version !== 2) throw new Error("expected protocol version 2");
writeFileSync(process.env.OXLINT_EFFECT_TEST_REQUEST, JSON.stringify(input));
for (const config of input.configs) {
  for (const file of config.file_paths) {
    const text = input.source_overrides?.[file] ?? readFileSync(file, "utf8");
    const pos = text.indexOf("probe");
    for (const rule of config.rules) {
      const body = Buffer.from(JSON.stringify({
        kind: 0, rule: rule.name, file_path: file,
        range: { pos, end: pos + 5 },
        message: { id: rule.name, description: "protocol fixture: " + rule.name }
      }));
      const header = Buffer.alloc(5);
      header.writeUInt32LE(body.length);
      header.writeUInt8(1, 4);
      process.stdout.write(header);
      process.stdout.write(body);
    }
  }
}
`;

function run(args, env = {}) {
  const childEnv = { ...process.env, OXLINT_EFFECT_TEST_REQUEST: requestPath };
  delete childEnv.OXLINT_TSGOLINT_PATH;
  const result = spawnSync(binary, args, {
    cwd: fixture,
    env: { ...childEnv, ...env },
    encoding: "utf8",
    timeout: 60_000,
  });
  assert.ifError(result.error);
  return result;
}

function configure(rules) {
  writeFileSync(
    configPath,
    JSON.stringify({
      plugins: ["effect", "typescript"],
      categories: { correctness: "off" },
      rules,
    }),
  );
}

function lint(env) {
  const result = run(
    ["--no-ignore", "--type-aware", "--format", "json", "--config", configPath, sourcePath],
    env,
  );
  assert.ok(result.status === 0 || result.status === 1, result.stderr || result.stdout);
  return { status: result.status, diagnostics: JSON.parse(result.stdout).diagnostics };
}

try {
  testPatchedCliSelection();
  mkdirSync(join(fixture, "src"), { recursive: true });
  mkdirSync(join(fixture, "native/oxc-oxlint-effect-fork"), { recursive: true });
  mkdirSync(join(fixture, "native/tsgolint-effect-fork"), { recursive: true });
  mkdirSync(join(fixture, "node_modules/.bin"), { recursive: true });
  writeFileSync(join(fixture, "package.json"), '{"type":"module"}\n');
  writeFileSync(sourcePath, source);
  writeFileSync(backendPath, backend);
  writeFileSync(overridePath, backend);
  chmodSync(backendPath, 0o755);
  chmodSync(overridePath, 0o755);
  const decoy = join(fixture, "node_modules/.bin/tsgolint");
  writeFileSync(
    decoy,
    '#!/usr/bin/env node\nthrow new Error("selected a package binary instead of local source");\n',
  );
  chmodSync(decoy, 0o755);

  const version = run(["--version"]);
  assert.equal(version.status, 0, version.stderr);
  assert.match(version.stdout, /1\.87\.0/);
  const listing = run(["--no-ignore", "--rules", "--format", "json", sourcePath]);
  assert.equal(listing.status, 0, listing.stderr || listing.stdout);
  const effectRules = JSON.parse(listing.stdout).filter((rule) => rule.scope === "effect");
  assert.deepEqual(
    effectRules.map((rule) => rule.value).sort(),
    names.map((name) => name.replaceAll("_", "-")).sort(),
  );
  assert.ok(effectRules.every((rule) => rule.type_aware && rule.default));

  configure(Object.fromEntries(names.map((name) => [publicName(name), "warn"])));
  let result = lint();
  assert.equal(result.status, 0);
  assert.equal(result.diagnostics.length, names.length);
  for (const name of names) {
    const diagnostic = result.diagnostics.find(
      (item) => item.code === `effect(${name.replaceAll("_", "-")})`,
    );
    assert.ok(diagnostic, `missing ${publicName(name)}`);
    assert.equal(diagnostic.severity, "warning");
    assert.equal(diagnostic.message, `protocol fixture: ${name}`);
    assert.equal(resolve(fixture, diagnostic.filename), sourcePath);
    assert.deepEqual(diagnostic.labels[0].span, {
      offset: source.indexOf("probe"),
      length: 5,
      line: 1,
      column: 14,
    });
  }

  configure(
    Object.fromEntries(names.map((name, index) => [publicName(name), index % 2 ? "off" : "error"])),
  );
  result = lint();
  assert.equal(result.status, 1);
  assert.equal(result.diagnostics.length, Math.ceil(names.length / 2));
  assert.ok(result.diagnostics.every((diagnostic) => diagnostic.severity === "error"));
  const requested = JSON.parse(readFileSync(requestPath, "utf8")).configs.flatMap((config) =>
    config.rules.map((rule) => rule.name),
  );
  assert.deepEqual(
    requested.sort(),
    names.filter((_, index) => index % 2 === 0),
  );

  configure({ "effect/floating-effect": "warn" });
  for (const directive of ["effect/floating-effect", "floating-effect", "floating_effect"]) {
    writeFileSync(sourcePath, `// oxlint-disable-next-line ${directive}\n${source}`);
    assert.equal(lint().diagnostics.length, 0, directive);
  }
  writeFileSync(sourcePath, source);

  configure({ "typescript/no-floating-promises": "warn" });
  result = lint();
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, "typescript(no-floating-promises)");

  configure({ "effect/floating-effect": "warn" });
  // An explicit override wins even when the checkout's local build is absent.
  rmSync(backendPath);
  result = lint({ OXLINT_TSGOLINT_PATH: overridePath });
  assert.equal(result.diagnostics.length, 1);
  const missing = run(["--no-ignore", "--type-aware", "--config", configPath, sourcePath]);
  assert.notEqual(missing.status, 0);
  assert.match(
    missing.stderr + missing.stdout,
    /Missing repo-local tsgolint.*native:build:tsgolint/s,
  );

  // Use the real source-built tsgolint and installed Effect for the semantic smoke case.
  writeFileSync(
    join(fixture, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        module: "ESNext",
        moduleResolution: "Bundler",
        target: "ES2022",
        strict: true,
        skipLibCheck: true,
        plugins: [{ name: "@effect/language-service", diagnostics: true, diagnosticSeverity: {} }],
      },
      include: ["src/**/*.ts"],
    }),
  );
  const metadata = JSON.parse(
    readFileSync(join(root, "native/effect-tsgo/_packages/tsgo/src/metadata.json"), "utf8"),
  );
  const preview = metadata.rules.find((rule) => rule.name === "floatingEffect").preview;
  const expected = preview.diagnostics[0];
  writeFileSync(sourcePath, preview.sourceText);
  const realBackend = {
    OXLINT_TSGOLINT_PATH: join(
      root,
      "native/tsgolint-effect-fork",
      process.platform === "win32" ? "tsgolint.exe" : "tsgolint",
    ),
  };
  result = lint(realBackend);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, "effect(floating-effect)");
  assert.equal(result.diagnostics[0].severity, "warning");
  assert.equal(result.diagnostics[0].message, expected.text);
  assert.equal(result.diagnostics[0].labels[0].span.offset, expected.start);
  assert.equal(result.diagnostics[0].labels[0].span.length, expected.end - expected.start);
  assert.equal(result.diagnostics[0].labels[0].span.line, 3);
  assert.equal(result.diagnostics[0].labels[0].span.column, 1);

  configure({ "effect/floating-effect": "error" });
  result = lint(realBackend);
  assert.equal(result.status, 1);
  assert.equal(result.diagnostics[0].severity, "error");

  configure({ "effect/floating-effect": "warn", "typescript/no-floating-promises": "warn" });
  const timingResult = run(
    [
      "--no-ignore",
      "--type-aware",
      "--format",
      "default",
      "--debug",
      "timings",
      "--config",
      configPath,
      sourcePath,
    ],
    realBackend,
  );
  assert.ok(
    timingResult.status === 0 || timingResult.status === 1,
    timingResult.stderr || timingResult.stdout,
  );
  assert.match(timingResult.stdout, /^effect\/floating-effect\s/m);
  assert.match(timingResult.stdout, /^typescript\/no-floating-promises\s/m);
  assert.doesNotMatch(timingResult.stdout, /^typescript\/floating_effect\s/m);

  configure({ "effect/floating-effect": "off" });
  assert.deepEqual(lint(realBackend), { status: 0, diagnostics: [] });

  // Exercise the released CLI patch with a TypeScript Vite lint config.
  // Both native resolvers must prefer this checkout over installed decoys.
  rmSync(join(fixture, "native"), { recursive: true });
  const patchedPackage = createPatchedPackage(fixture);
  const packageDecoy = join(fixture, "node_modules/@tiara-stack/oxlint-effect/bin");
  mkdirSync(packageDecoy, { recursive: true });
  writeFileSync(join(packageDecoy, "../package.json"), '{"type":"module"}\n');
  writeFileSync(
    join(packageDecoy, "oxlint-effect"),
    '#!/usr/bin/env node\nthrow new Error("selected a packaged Oxlint");\n',
  );
  chmodSync(join(packageDecoy, "oxlint-effect"), 0o755);
  const viteConfig = join(fixture, "vite.config.ts");
  writeFileSync(
    viteConfig,
    `export default { lint: {
    plugins: ["effect"], categories: { correctness: "off" },
    options: { typeAware: true }, rules: { "effect/floating-effect": "error" }
  } } as const;\n`,
  );
  const patchEnv = { ...process.env };
  delete patchEnv.TIARA_REAL_OXLINT_PATH;
  delete patchEnv.TIARA_OXLINT_EFFECT_PATH;
  delete patchEnv.OXLINT_TSGOLINT_PATH;
  const patched = spawnSync(
    process.execPath,
    [
      join(patchedPackage, "bin/oxlint"),
      "--no-ignore",
      "--config",
      viteConfig,
      "--format",
      "json",
      sourcePath,
    ],
    { cwd: fixture, env: patchEnv, encoding: "utf8", timeout: 60_000 },
  );
  assert.ifError(patched.error);
  assert.equal(patched.status, 1, patched.stderr || patched.stdout);
  const patchedDiagnostics = JSON.parse(patched.stdout).diagnostics;
  assert.equal(patchedDiagnostics.length, 1);
  assert.equal(patchedDiagnostics[0].code, "effect(floating-effect)");
  assert.equal(patchedDiagnostics[0].severity, "error");
  assert.equal(patchedDiagnostics[0].message, expected.text);

  console.log(
    JSON.stringify(
      {
        ok: true,
        version: version.stdout.trim(),
        effectRules: names.length,
        protocol: 2,
        semanticRule: "effect/floating-effect",
      },
      null,
      2,
    ),
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

function createPatchedPackage(directory) {
  const patchedPackage = join(directory, "patched-oxlint");
  mkdirSync(join(patchedPackage, "bin"), { recursive: true });
  writeFileSync(
    join(patchedPackage, "bin/oxlint"),
    readFileSync(join(root, "native/oxc-oxlint-effect-fork/npm/oxlint/bin/oxlint")),
  );
  const initialized = spawnSync("git", ["init", "--quiet"], {
    cwd: patchedPackage,
    encoding: "utf8",
  });
  assert.ifError(initialized.error);
  assert.equal(initialized.status, 0, initialized.stderr);
  const applied = spawnSync(
    "git",
    ["apply", "--no-index", join(root, "patches/oxlint@1.87.0-native-effect.patch")],
    { cwd: patchedPackage, encoding: "utf8" },
  );
  assert.ifError(applied.error);
  assert.equal(applied.status, 0, applied.stderr);
  assert.match(readFileSync(join(patchedPackage, "bin/oxlint"), "utf8"), /findRepoNativeBin/);
  return patchedPackage;
}

function testPatchedCliSelection() {
  const directory = mkdtempSync(join(tmpdir(), "oxlint-patch-selection-"));
  try {
    // The upstream fallback case requires a cwd with no real checkout ancestor.
    let ancestor = realpathSync(directory);
    while (true) {
      assert.ok(
        !existsSync(join(ancestor, "native/oxc-oxlint-effect-fork/Cargo.toml")),
        `Patch selection fixture requires scratch outside a native Oxlint checkout. Set TMPDIR/TEMP outside ${JSON.stringify(ancestor)}.`,
      );
      const parent = resolve(ancestor, "..");
      if (parent === ancestor) break;
      ancestor = parent;
    }
    writeFileSync(join(directory, "package.json"), '{"type":"module"}\n');
    const patchedPackage = createPatchedPackage(directory);
    mkdirSync(join(patchedPackage, "dist"));
    writeFileSync(join(patchedPackage, "dist/cli.js"), 'process.stdout.write("upstream fallback\\n");\n');
    const checkout = join(directory, "checkout");
    const fork = join(checkout, "native/oxc-oxlint-effect-fork");
    mkdirSync(fork, { recursive: true });
    writeFileSync(join(fork, "Cargo.toml"), "# checkout sentinel\n");
    const missing = join(directory, "missing-override");
    const environment = { ...process.env };
    delete environment.TIARA_REAL_OXLINT_PATH;
    delete environment.TIARA_OXLINT_EFFECT_PATH;
    delete environment.NODE_PATH;
    const cases = [
      [checkout, { TIARA_REAL_OXLINT_PATH: missing }, "TIARA_REAL_OXLINT_PATH"],
      [checkout, { TIARA_OXLINT_EFFECT_PATH: missing }, "TIARA_OXLINT_EFFECT_PATH"],
      [
        checkout,
        { TIARA_REAL_OXLINT_PATH: missing, TIARA_OXLINT_EFFECT_PATH: process.execPath },
        "TIARA_REAL_OXLINT_PATH",
      ],
      [
        checkout,
        { TIARA_REAL_OXLINT_PATH: process.execPath, TIARA_OXLINT_EFFECT_PATH: missing },
        "override selected",
      ],
      [checkout, { TIARA_OXLINT_EFFECT_PATH: process.execPath }, "override selected"],
      [
        checkout,
        { TIARA_REAL_OXLINT_PATH: "", TIARA_OXLINT_EFFECT_PATH: process.execPath },
        "TIARA_REAL_OXLINT_PATH",
      ],
      [checkout, {}, "repo-local"],
      [directory, { TIARA_REAL_OXLINT_PATH: missing }, "TIARA_REAL_OXLINT_PATH"],
      [directory, { TIARA_OXLINT_EFFECT_PATH: missing }, "TIARA_OXLINT_EFFECT_PATH"],
      [directory, {}, "upstream fallback"],
    ];
    for (const [cwd, overrides, expected] of cases) {
      const result = spawnSync(
        process.execPath,
        [join(patchedPackage, "bin/oxlint"), "--eval", 'process.stdout.write("override selected\\n")'],
        { cwd, env: { ...environment, ...overrides }, encoding: "utf8", timeout: 10_000 },
      );
      assert.ifError(result.error);
      if (expected.startsWith("TIARA_")) {
        assert.equal(result.status, 1, result.stderr || result.stdout);
        assert.ok(result.stderr.includes(expected), result.stderr);
        assert.ok(!result.stderr.includes("native:build:oxlint"), result.stderr);
      } else if (expected === "repo-local") {
        assert.equal(result.status, 1, result.stderr || result.stdout);
        assert.match(result.stderr, /Missing repo-local Oxlint.*native:build:oxlint/s);
      } else {
        assert.equal(result.status, 0, result.stderr || result.stdout);
        assert.equal(result.stdout.trim(), expected);
      }
    }
    return cases.length;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
