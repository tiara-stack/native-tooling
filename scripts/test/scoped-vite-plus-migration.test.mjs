import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
test("the generated migrator rewrites scoped and unscoped removed tsconfig exports", async () => {
  const dist = join(root, "packages/vite-plus/dist");
  const file = readdirSync(dist).find(
    (name) =>
      /^tsconfig-.*\.js$/.test(name) &&
      readFileSync(join(dist, name), "utf8").includes("TSCONFIG_TYPE_REPLACEMENTS"),
  );
  const module = await import(pathToFileURL(join(dist, file)).href);
  const rewrite = Object.values(module).find((value) => value.name === "rewriteTypesInTsconfig");
  const detect = Object.values(module).find(
    (value) => value.name === "hasTypesToRewriteInTsconfig",
  );
  const fixture = mkdtempSync(join(tmpdir(), "scoped-types-"));
  try {
    const config = join(fixture, "tsconfig.json");
    writeFileSync(
      config,
      JSON.stringify({
        compilerOptions: {
          types: [
            "vite-plus/test/coverage",
            "@tiara-stack/vite-plus/test/coverage",
            "vite-plus/test/snapshot",
            "tsdown/client",
            "vite/client",
          ],
        },
      }),
    );
    assert.equal(detect(config), true);
    assert.equal(rewrite(config), true);
    assert.deepEqual(JSON.parse(readFileSync(config)).compilerOptions.types, [
      "@tiara-stack/vite-plus/test/node",
      "@tiara-stack/vite-plus/test/node",
      "@tiara-stack/vite-plus/test/runtime",
      "@tiara-stack/vite-plus/pack/client",
      "vite/client",
    ]);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("the source and generated templates ignore all owned native lint snapshot names", () => {
  for (const relative of [
    "packages/vite-plus-effect-fork/packages/cli/templates/monorepo/_gitignore",
    "packages/vite-plus/templates/monorepo/_gitignore",
  ]) {
    const fixture = mkdtempSync(join(tmpdir(), "lint-ignore-"));
    try {
      assert.equal(spawnSync("git", ["init", "--quiet", fixture]).status, 0);
      writeFileSync(join(fixture, ".gitignore"), readFileSync(join(root, relative)));
      const paths = [
        ".tiara-oxlint-id-root.json",
        ".tiara-oxlint-id-sha256.json",
        ".tiara-oxlint-id-root.json.writing",
      ];
      const result = spawnSync("git", ["check-ignore", ...paths], {
        cwd: fixture,
        encoding: "utf8",
      });
      assert.equal(result.status, 0, relative);
      assert.deepEqual(result.stdout.trim().split("\n"), paths);
    } finally {
      rmSync(fixture, { recursive: true, force: true });
    }
  }
});

test("the generated core validator accepts the scoped release and rejects mismatched identities", () => {
  const text = readFileSync(join(root, "packages/vite-plus/dist/bin.js"), "utf8");
  const start = text.indexOf("const CORE_PACKAGE_NAME =");
  const end = text.indexOf("function checkProjectCoreVersion", start);
  assert.ok(start >= 0 && end > start, "the pinned core validator must be present");
  const check = new Function("readFileSync", text.slice(start, end) + "; return checkCoreVersion;")(
    readFileSync,
  );
  const corePath = join(root, "packages/vite-plus-core/package.json");
  const core = JSON.parse(readFileSync(corePath));
  assert.doesNotThrow(() => check(corePath, core.version));
  const fixture = mkdtempSync(join(tmpdir(), "scoped-core-identity-"));
  try {
    const path = join(fixture, "package.json");
    for (const pkg of [
      { name: "@voidzero-dev/vite-plus-core", version: core.version },
      { name: core.name, version: "0.0.0" },
      { name: "vite", version: core.version },
    ]) {
      writeFileSync(path, JSON.stringify(pkg));
      assert.throws(() => check(path, core.version), /Expected/);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("generated migration defaults write a scoped core alias and preserve explicit overrides", () => {
  const dist = join(root, "packages/vite-plus/dist");
  const file = readdirSync(dist).find(
    (name) =>
      /^constants-.*\.js$/.test(name) &&
      readFileSync(join(dist, name), "utf8").includes("VITE_PLUS_OVERRIDE_PACKAGES"),
  );
  assert.ok(file, "the pinned migration constants must be present");
  const script = `const module = await import(${JSON.stringify(pathToFileURL(join(dist, file)).href)});
const overrides = Object.values(module).find(value => value && typeof value === "object" && "vite" in value && "vitest" in value);
process.stdout.write(JSON.stringify(overrides));`;
  const env = { ...process.env };
  delete env.VP_VERSION;
  delete env.VP_OVERRIDE_PACKAGES;
  const read = (extra) => {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], {
      env: { ...env, ...extra },
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  const { version } = JSON.parse(readFileSync(join(root, "packages/vite-plus/package.json")));
  assert.equal(read({}).vite, `npm:@tiara-stack/vite-plus-core@${version}`);
  const custom = { vite: "file:../custom-core", vitest: "5.0.1" };
  assert.deepEqual(read({ VP_OVERRIDE_PACKAGES: JSON.stringify(custom) }), custom);
});

test("generated version alignment handles scoped and upstream dependencies, aliases and catalogs", () => {
  const { version } = JSON.parse(readFileSync(join(root, "packages/vite-plus/package.json")));
  const before = {
    devDependencies: {
      "@tiara-stack/vite-plus": "^0.2.0",
      vite: "npm:@tiara-stack/vite-plus-core@^0.2.0",
      "vite-plus": "^0.2.0",
      "@voidzero-dev/vite-plus-core": "^0.2.0",
      unrelated: "^0.2.0",
      local: "file:../local",
    },
    overrides: { vite: "npm:@tiara-stack/vite-plus-core@^0.2.0" },
    catalog: { "@tiara-stack/vite-plus": "^0.2.0" },
    peerDependencies: { "@tiara-stack/vite-plus": "^0.2.0" },
  };
  const manifests = [
    { path: "package.json", kind: "packageJson", contents: JSON.stringify(before, null, 2) },
    {
      path: "pnpm-workspace.yaml",
      kind: "pnpmWorkspace",
      contents:
        'catalog:\n  "@tiara-stack/vite-plus": "^0.2.0"\n  vite: "npm:@tiara-stack/vite-plus-core@^0.2.0"\n  local: "workspace:*"\n',
    },
    {
      path: ".yarnrc.yml",
      kind: "yarnRc",
      contents:
        'catalogs:\n  shared:\n    "@tiara-stack/vite-plus": "^0.2.0"\n    vite: "npm:@tiara-stack/vite-plus-core@^0.2.0"\n    local: "workspace:*"\n',
    },
  ];
  const plan = (snapshots, entry = "bin.js") => {
    const result = spawnSync(
      process.execPath,
      [join(root, "packages/vite-plus/dist/sync-versions", entry), "--json"],
      {
        input: JSON.stringify({ schemaVersion: 1, workspace: ".", manifests: snapshots }),
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  const result = plan(manifests);
  assert.equal(result.tool.name, "vite-plus", "the protocol graph identity remains upstream");
  assert.equal(result.replacements.length, 3);
  assert.deepEqual(plan(manifests, "bin.mjs"), result);
  const pkg = JSON.parse(result.replacements.find((row) => row.path === "package.json").after);
  assert.equal(pkg.devDependencies["@tiara-stack/vite-plus"], version);
  assert.equal(pkg.devDependencies.vite, `npm:@tiara-stack/vite-plus-core@${version}`);
  assert.equal(pkg.devDependencies["vite-plus"], version);
  assert.equal(pkg.devDependencies["@voidzero-dev/vite-plus-core"], version);
  assert.equal(pkg.overrides.vite, `npm:@tiara-stack/vite-plus-core@${version}`);
  assert.equal(pkg.catalog["@tiara-stack/vite-plus"], version);
  assert.equal(pkg.devDependencies.unrelated, before.devDependencies.unrelated);
  assert.equal(pkg.devDependencies.local, before.devDependencies.local);
  assert.deepEqual(pkg.peerDependencies, before.peerDependencies);
  const yaml = result.replacements.find((row) => row.path === "pnpm-workspace.yaml").after;
  assert.ok(yaml.includes(`"@tiara-stack/vite-plus": "${version}"`));
  assert.ok(yaml.includes(`vite: "npm:@tiara-stack/vite-plus-core@${version}"`));
  assert.ok(yaml.includes('local: "workspace:*"'));
  const yarn = result.replacements.find((row) => row.path === ".yarnrc.yml").after;
  assert.ok(yarn.includes(`"@tiara-stack/vite-plus": "${version}"`));
  assert.ok(yarn.includes(`vite: "npm:@tiara-stack/vite-plus-core@${version}"`));
  assert.ok(yarn.includes('local: "workspace:*"'));
  assert.deepEqual(
    plan(
      manifests.map((row) => ({
        ...row,
        contents: result.replacements.find((r) => r.path === row.path).after,
      })),
    ).replacements,
    [],
  );
});

test("the generated catalog resolver recognizes stale scoped core aliases", () => {
  const dist = join(root, "packages/vite-plus/dist");
  const file = readdirSync(dist).find(
    (name) =>
      /^editor-.*\.js$/.test(name) &&
      readFileSync(join(dist, name), "utf8").includes("function isVitePlusOverrideSpec"),
  );
  assert.ok(file, "the pinned catalog resolver must be present");
  const text = readFileSync(join(dist, file), "utf8");
  const start = text.indexOf("function isVitePlusOverrideSpec");
  const end = text.indexOf("function createCatalogDependencyResolver", start);
  assert.ok(end > start);
  const accepts = new Function(
    "VITE_PLUS_OVERRIDE_PACKAGES",
    text.slice(start, end) + "; return isVitePlusOverrideSpec;",
  )({ vite: "file:../custom-core" });
  for (const spec of [
    "file:../custom-core",
    "npm:@voidzero-dev/vite-plus-core@0.2.0",
    "npm:@tiara-stack/vite-plus-core@0.2.0",
  ])
    assert.equal(accepts(spec), true, spec);
  assert.equal(accepts("npm:@tiara-stack/vite-plus-other@0.2.0"), false);
  assert.equal(accepts("npm:unrelated@0.2.0"), false);
});
