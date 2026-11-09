import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export async function rolldownBuildRecord(source) {
  const root = join(source, "rolldown");
  const inputs = {};
  const outputs = {};
  async function hash(path, result) {
    result[path] = createHash("sha256")
      .update(await readFile(join(root, path)))
      .digest("hex");
  }
  async function walk(path, result) {
    for (const entry of await readdir(join(root, path), { withFileTypes: true })) {
      if (["node_modules", "target", ".git"].includes(entry.name)) continue;
      const relative = `${path}/${entry.name}`;
      if (entry.isDirectory()) await walk(relative, result);
      else if (entry.isFile()) await hash(relative, result);
    }
  }
  for (const path of [
    "Cargo.toml",
    "Cargo.lock",
    ".cargo/config.toml",
    ".tiara-source.json",
    "packages/rolldown/build.ts",
    "packages/rolldown/build-binding.ts",
    "packages/rolldown/package.json",
  ])
    await hash(path, inputs);
  await walk("crates", inputs);
  await walk("packages/rolldown/dist", outputs);
  for (const file of await readdir(join(root, "packages/rolldown/src"))) {
    if (/binding.*\.(?:node|cjs|cts)$/.test(file))
      await hash(`packages/rolldown/src/${file}`, outputs);
  }
  if (!Object.keys(outputs).some((path) => path.endsWith(".node")))
    throw new Error("Missing built local Rolldown binding");
  return {
    upstream: "8df421985114ecfaf52cce038d4a5a6ea8c05408",
    inputs: Object.fromEntries(Object.entries(inputs).sort()),
    outputs: Object.fromEntries(Object.entries(outputs).sort()),
  };
}
