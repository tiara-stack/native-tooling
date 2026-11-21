#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { constants } from "node:os";
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
let child;
let interrupted;
const controller = new AbortController();
const handlers = new Map(
  ["SIGINT", "SIGTERM"].map((signal) => [
    signal,
    () => {
      interrupted = signal;
      process.exitCode = 128 + constants.signals[signal];
      controller.abort();
      child?.kill(signal);
    },
  ]),
);
for (const [signal, handler] of handlers) process.on(signal, handler);
function assertActive() {
  if (interrupted) throw new Error(`Source preparation interrupted by ${interrupted}`);
}
try {
  for (const [name, hash] of Object.entries(archives)) {
    assertActive();
    const { repo, hash: commit } = versions[name];
    const target = join(source, name);
    const marker = join(target, ".tiara-source.json");
    try {
      const saved = JSON.parse(await readFile(marker, "utf8"));
      if (saved.repo !== repo || saved.commit !== commit || saved.sha256 !== hash)
        throw new Error(`Unexpected ${name} checkout provenance`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      try {
        await access(target);
        throw new Error(
          `Unverified ${name} source exists at ${target}; preserve it and prepare a clean pinned checkout`,
        );
      } catch (existing) {
        if (existing.code !== "ENOENT") throw existing;
      }
      const slug = new URL(repo).pathname.replace(/^\//, "").replace(/\.git$/, "");
      const response = await fetch(`https://codeload.github.com/${slug}/tar.gz/${commit}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Downloading ${name} failed with HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (createHash("sha256").update(bytes).digest("hex") !== hash)
        throw new Error(`Unexpected ${name} archive hash`);
      const archive = join(root, ".tmp/vite-plus-sources", `${name}.tar.gz`);
      await writeFile(archive, bytes);
      assertActive();
      const staging = await mkdtemp(join(source, `.tiara-source-${name}-`));
      try {
        assertActive();
        child = spawn("tar", ["-xzf", archive, "--strip-components=1", "-C", staging], {
          stdio: "inherit",
        });
        const status = await new Promise((resolve, reject) => {
          child.once("error", reject);
          child.once("close", resolve);
        });
        child = undefined;
        if (status !== 0) throw new Error(`Extracting ${name} failed`);
        assertActive();
        await writeFile(
          join(staging, ".tiara-source.json"),
          `${JSON.stringify({ repo, commit, sha256: hash }, null, 2)}\n`,
        );
        assertActive();
        await rename(staging, target);
      } finally {
        await rm(staging, { recursive: true, force: true });
      }
    }
  }
  // This is the selected upstream bootstrap transformation. It aligns Vite's
  // development runner without changing Effect's separate Vitest 5.0.2 pin.
  const { alignVendoredVitestDependencies } =
    await import("../packages/vite-plus-effect-fork/packages/tools/src/vendored-vitest.ts");
  alignVendoredVitestDependencies(source, "5.0.1");
  console.log("Prepared pinned Vite and Rolldown source inputs");
} finally {
  for (const [signal, handler] of handlers) process.off(signal, handler);
}
