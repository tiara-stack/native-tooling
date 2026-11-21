import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const pack =
  process.env.TIARA_TEST_PACK ??
  join(root, "packages/vite-plus-effect-fork/packages/cli/src/pack-bin.ts");
for (const kind of ["null", "legacy", "path", "options-only", "oxc", "oxc-legacy"]) {
  test(`declaration compiler selection respects ${kind}`, () => {
    mkdirSync(join(root, ".tmp"), { recursive: true });
    const directory = mkdtempSync(join(root, ".tmp/dts-native-"));
    try {
      const compiler = join(directory, "tsgo.mjs"),
        record = join(directory, "compiler.json");
      writeFileSync(
        compiler,
        `#!${process.execPath}\nimport {writeFileSync} from 'node:fs';import {spawnSync}from'node:child_process';
writeFileSync(${JSON.stringify(record)},JSON.stringify(process.argv.slice(2)));
const result=spawnSync(${JSON.stringify(join(root, "native/typescript-go/built/local/tsgo"))},process.argv.slice(2),{stdio:'inherit'});process.exit(result.status??1);\n`,
        { mode: 0o755 },
      );
      const dts =
        kind === "null"
          ? { generator: "tsgo", tsgo: null }
          : kind === "legacy"
            ? { tsgo: true }
            : kind === "path"
              ? { generator: "tsgo", tsgo: { path: compiler } }
              : kind === "oxc"
                ? { generator: "oxc", tsgo: { path: compiler } }
                : kind === "oxc-legacy"
                  ? { generator: "oxc", tsgo: true }
                  : { tsgo: { path: compiler } };
      writeFileSync(
        join(directory, "package.json"),
        '{"name":"dts-fixture","type":"module","private":true}',
      );
      writeFileSync(
        join(directory, "vite.config.ts"),
        `export default {pack:{entry:['./input.ts'],dts:${JSON.stringify(dts)}}};\n`,
      );
      writeFileSync(join(directory, "input.ts"), "export const value: number = 1;\n");
      writeFileSync(
        join(directory, "tsconfig.json"),
        JSON.stringify({
          compilerOptions: {
            strict: true,
            target: "ES2022",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            types: [],
            skipLibCheck: true,
          },
          include: ["input.ts"],
        }),
      );
      const result = spawnSync(process.execPath, ["--import", "tsx", pack], {
        cwd: directory,
        encoding: "utf8",
        env: {
          ...process.env,
          TIARA_TSGO_EFFECT_PATH: kind === "path" ? join(directory, "missing-override") : compiler,
        },
      });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(existsSync(record), ["null", "legacy", "path"].includes(kind));
      const declaration = readdirSync(join(directory, "dist")).find((name) =>
        /^input\.d\.[cm]?ts$/.test(name),
      );
      assert.ok(declaration, result.stdout + result.stderr);
      assert.match(readFileSync(join(directory, "dist", declaration), "utf8"), /value: number/);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
