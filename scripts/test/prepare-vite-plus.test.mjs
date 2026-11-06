import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

const script = readFileSync(new URL("../prepare-vite-plus.mjs", import.meta.url), "utf8");
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "prepare-vite-plus-"));
  const put = (path, bytes) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), bytes);
  };
  put("package.json", '{"type":"module"}');
  const archives = {},
    versions = {};
  let source = script;
  for (const [name, oldHash] of Object.entries({
    rolldown: "99da6c5e65bc435c662f03876559e960ae7102d4fcffda6332f010e41dbf2684",
    vite: "2c54cd4cf73904e844e899b52b8a7d62d98b5d3e263c9bbf037e989ac8621180",
  })) {
    put(`payload/${name}/package.json`, JSON.stringify({ name }));
    const archive = join(root, `${name}.tgz`);
    assert.equal(spawnSync("tar", ["-czf", archive, "-C", join(root, "payload"), name]).status, 0);
    const hash = createHash("sha256").update(readFileSync(archive)).digest("hex");
    source = source.replace(oldHash, hash);
    archives[name] = archive;
    versions[name] = { repo: "https://github.com/test/" + name, hash: "fixture-pin" };
  }
  put("scripts/prepare-vite-plus.mjs", source);
  put(
    "packages/vite-plus-effect-fork/packages/tools/.upstream-versions.json",
    JSON.stringify(versions),
  );
  put(
    "packages/vite-plus-effect-fork/packages/tools/src/vendored-vitest.ts",
    "export function alignVendoredVitestDependencies() {}\n",
  );
  put(
    "fetch.mjs",
    `import { readFile } from "node:fs/promises";
const archives=${JSON.stringify(archives)};
globalThis.fetch=async (url) => ({ok:process.env.TIARA_PREPARE_FAULT!=='fetch',status:503,arrayBuffer:()=>process.env.TIARA_PREPARE_FAULT==='hash'?Buffer.from('bad archive'):readFile(archives[new URL(url).pathname.split('/')[2]])});
`,
  );
  put(
    "bin/tar",
    `#!${process.execPath}
import {spawnSync} from 'node:child_process';
const result=spawnSync('/usr/bin/tar',process.argv.slice(2),{stdio:'inherit'});
if(process.env.TIARA_PREPARE_FAULT?.startsWith('signal-')) { process.kill(process.ppid,process.env.TIARA_PREPARE_FAULT==='signal-int'?'SIGINT':'SIGTERM'); setTimeout(()=>process.exit(0),100); }
else process.exit(process.env.TIARA_PREPARE_FAULT==='extract' ? 42 : result.status);
`,
  );
  chmodSync(join(root, "bin/tar"), 0o755);
  put(
    "fault.mjs",
    `import fs from 'node:fs/promises';import{syncBuiltinESMExports}from'node:module';
const write=fs.writeFile,rename=fs.rename;
fs.writeFile=async(path,...rest)=>{if(process.env.TIARA_PREPARE_FAULT==='marker'&&String(path).endsWith('/.tiara-source.json'))throw new Error('marker fault');return write(path,...rest)};
fs.rename=async(from,to)=>{if(process.env.TIARA_PREPARE_FAULT==='publish')throw new Error('publish fault');return rename(from,to)};
syncBuiltinESMExports();
`,
  );
  const run = (fault) =>
    spawnSync(
      process.execPath,
      ["--import", "./fetch.mjs", "--import", "./fault.mjs", "scripts/prepare-vite-plus.mjs"],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          TIARA_PREPARE_FAULT: fault ?? "",
          PATH: join(root, "bin") + ":" + process.env.PATH,
        },
      },
    );
  return { root, put, run };
}
for (const fault of [
  "fetch",
  "hash",
  "extract",
  "marker",
  "publish",
  "signal-int",
  "signal-term",
]) {
  test(`source preparation ${fault} failure permits a complete retry`, () => {
    const f = fixture();
    try {
      const first = f.run(fault);
      assert.notEqual(first.status, 0, first.stderr);
      const parent = join(f.root, "packages/vite-plus-effect-fork");
      assert.deepEqual(
        readdirSync(parent),
        ["packages"],
        "failed staging must not become a retained partial source",
      );
      const second = f.run();
      assert.equal(second.status, 0, second.stderr);
      for (const name of ["rolldown", "vite"])
        assert.equal(
          JSON.parse(readFileSync(join(parent, name, ".tiara-source.json"))).commit,
          "fixture-pin",
        );
      assert.equal(f.run().status, 0, "verified inputs are reusable");
    } finally {
      rmSync(f.root, { recursive: true, force: true });
    }
  });
}
test("source preparation preserves unverified and mismatched existing source", () => {
  for (const verified of [false, true]) {
    const f = fixture();
    try {
      f.put("packages/vite-plus-effect-fork/rolldown/package.json", '{"retained":true}');
      if (verified)
        f.put(
          "packages/vite-plus-effect-fork/rolldown/.tiara-source.json",
          '{"commit":"different","sha256":"different"}',
        );
      const result = f.run();
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        verified ? /Unexpected rolldown checkout provenance/ : /Unverified rolldown source exists/,
      );
      assert.equal(
        readFileSync(join(f.root, "packages/vite-plus-effect-fork/rolldown/package.json"), "utf8"),
        '{"retained":true}',
      );
    } finally {
      rmSync(f.root, { recursive: true, force: true });
    }
  }
});
