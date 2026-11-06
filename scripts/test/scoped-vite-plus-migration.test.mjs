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
