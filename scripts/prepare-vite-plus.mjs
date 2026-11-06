#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const source = join(root, "packages/vite-plus-effect-fork");
const versions = JSON.parse(
  await readFile(join(source, "packages/tools/.upstream-versions.json"), "utf8"),
);
const archives = {
  rolldown: "99da6c5e65bc435c662f03876559e960ae7102d4fcffda6332f010e41dbf2684",
  vite: "2c54cd4cf73904e844e899b52b8a7d62d98b5d3e263c9bbf037e989ac8621180",
};
await mkdir(join(root, ".tmp/vite-plus-sources"), { recursive: true });
for (const [name, hash] of Object.entries(archives)) {
  const { repo, hash: commit } = versions[name];
  const target = join(source, name);
  const marker = join(target, ".tiara-source.json");
  try {
    const saved = JSON.parse(await readFile(marker, "utf8"));
    if (saved.commit !== commit || saved.sha256 !== hash)
      throw new Error(`Unexpected ${name} checkout provenance`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    try {
      await access(join(target, "package.json"));
      throw new Error(
        `Unverified ${name} source exists at ${target}; preserve it and prepare a clean pinned checkout`,
      );
    } catch (existing) {
      if (existing.code !== "ENOENT") throw existing;
    }
    const slug = new URL(repo).pathname.replace(/^\//, "").replace(/\.git$/, "");
    const response = await fetch(`https://codeload.github.com/${slug}/tar.gz/${commit}`);
    if (!response.ok) throw new Error(`Downloading ${name} failed with HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (createHash("sha256").update(bytes).digest("hex") !== hash)
      throw new Error(`Unexpected ${name} archive hash`);
    const archive = join(root, ".tmp/vite-plus-sources", `${name}.tar.gz`);
    await writeFile(archive, bytes);
    await mkdir(target, { recursive: true });
    const unpack = spawnSync("tar", ["-xzf", archive, "--strip-components=1", "-C", target], {
      stdio: "inherit",
    });
    if (unpack.error || unpack.status !== 0) throw new Error(`Extracting ${name} failed`);
    await writeFile(marker, `${JSON.stringify({ repo, commit, sha256: hash }, null, 2)}\n`);
  }
}
// This is the selected upstream bootstrap transformation. It aligns Vite's
// development runner without changing Effect's separate Vitest 5.0.2 pin.
const { alignVendoredVitestDependencies } =
  await import("../packages/vite-plus-effect-fork/packages/tools/src/vendored-vitest.ts");
alignVendoredVitestDependencies(source, "5.0.1");
console.log("Prepared pinned Vite and Rolldown source inputs");
