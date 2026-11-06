import { mkdir, mkdtemp, readdir, rename, rm, rmdir } from "node:fs/promises";
import { join } from "node:path";

export async function replacePackageTrees(pairs, backupParent) {
  const prepared = await Promise.all(
    pairs.map(async (pair) => {
      const entries = await readdir(pair.source);
      if (entries.includes("node_modules"))
        throw new Error("Generated package staging must not contain node_modules");
      return { ...pair, entries };
    }),
  );
  const backup = await mkdtemp(join(backupParent, "vite-plus-backup-"));
  const retained = [];
  const installed = [];
  const created = [];
  async function cleanup() {
    try {
      await rm(backup, { recursive: true, force: true });
    } catch (error) {
      console.error("Could not remove package backup " + backup + ": " + error.message);
    }
  }
  try {
    for (const [index, pair] of prepared.entries()) {
      try {
        await mkdir(pair.target);
        created.push(pair.target);
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
      const directory = join(backup, String(index));
      await mkdir(directory);
      for (const entry of await readdir(pair.target)) {
        if (entry === "node_modules") continue;
        const move = { from: join(pair.target, entry), to: join(directory, entry) };
        await rename(move.from, move.to);
        retained.push(move);
      }
    }
    for (const pair of prepared) {
      for (const entry of pair.entries) {
        const move = { from: join(pair.source, entry), to: join(pair.target, entry) };
        await rename(move.from, move.to);
        installed.push(move);
      }
    }
  } catch (error) {
    const failures = [];
    for (const move of [...installed].reverse().concat([...retained].reverse())) {
      try {
        await rename(move.to, move.from);
      } catch (failure) {
        failures.push(failure);
      }
    }
    for (const directory of created.reverse()) {
      try {
        await rmdir(directory);
      } catch (failure) {
        failures.push(failure);
      }
    }
    if (failures.length) {
      throw new AggregateError(
        [error, ...failures],
        "Package replacement rollback is incomplete; retained backup: " + backup,
        { cause: error },
      );
    }
    await cleanup();
    throw error;
  }
  await cleanup();
}
