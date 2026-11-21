import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

for (const fail of [false, true]) {
  test(`packed consumer ${fail ? "failure retains" : "success removes"} its owned fixture`, () => {
    const root = mkdtempSync(join(tmpdir(), "consumer-lifetime-"));
    let fixture;
    const put = (path, value) => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), value);
    };
    try {
      const source =
        process.env.TIARA_TEST_CONSUMER_SCRIPT ??
        new URL("./effect-vitest-consumer.mjs", import.meta.url);
      put("scripts/test/effect-vitest-consumer.mjs", readFileSync(source));
      put("package.json", '{"type":"module"}');
      put("packages/vite-plus-core/package.json", '{"version":"1.0.0"}');
      put("packages/vite-plus/package.json", '{"version":"1.0.0"}');
      put(
        "packages/effect-vitest/package.json",
        '{"peerDependencies":{"@tiara-stack/vite-plus":">=1.0.0 <2.0.0"}}',
      );
      // This isolates ownership/cleanup of the actual driver. Native/runtime,
      // package and type correctness are covered by the real packed consumer.
      put(
        "commands.mjs",
        `import child from 'node:child_process';import fs from 'node:fs/promises';import{syncBuiltinESMExports}from'node:module';
child.spawnSync=(_command,args)=>({status:${fail}&&args.some(arg=>String(arg).includes('/typescript/bin/tsc'))?7:0});
fs.realpath=async(path)=>path;syncBuiltinESMExports();\n`,
      );
      const result = spawnSync(
        process.execPath,
        ["--import", "./commands.mjs", "scripts/test/effect-vitest-consumer.mjs"],
        { cwd: root, encoding: "utf8" },
      );
      fixture = readFileSync(join(root, ".tmp/TIA-314/consumer-path.txt"), "utf8").trim();
      assert.equal(result.status, fail ? 1 : 0, result.stderr);
      assert.equal(existsSync(fixture), fail, "only successful fixtures are removed");
      assert.match(fixture, /tiara-vitest5-consumer-/);
    } finally {
      if (fixture) rmSync(fixture, { recursive: true, force: true });
      rmSync(root, { recursive: true, force: true });
    }
  });
}
