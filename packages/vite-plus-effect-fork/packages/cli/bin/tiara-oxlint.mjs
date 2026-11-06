#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, unwatchFile, watchFile } from "node:fs";
import { rename, unlink, writeFile } from "node:fs/promises";
import { constants } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

const args = process.argv.slice(2);
process.env.VP_RESOLVING_CONFIG_METADATA = "1";
let native = process.env.TIARA_OXLINT_EFFECT_PATH;
if (!native || !process.env.OXLINT_TSGOLINT_PATH) {
  const { resolveTiaraNative } = await import("../dist/tiara-native.js");
  native ||= resolveTiaraNative("oxlint");
  process.env.OXLINT_TSGOLINT_PATH ||= resolveTiaraNative("tsgolint");
}

const viteNames = [
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.ts",
  "vite.config.cjs",
  "vite.config.mts",
  "vite.config.cts",
];
let configIndex = -1;
let configCount = 0;
let configPath;
for (let index = 0; index < args.length && args[index] !== "--"; index++) {
  const arg = args[index];
  if (arg === "--config" || arg === "-c") {
    configIndex = index;
    configCount = 2;
    configPath = args[index + 1];
    break;
  }
  if (arg.startsWith("--config=") || (arg.startsWith("-c") && arg.length > 2)) {
    configIndex = index;
    configCount = 1;
    configPath = arg.startsWith("--config=") ? arg.slice(9) : arg.slice(2);
    break;
  }
}
if (!configPath && !args.includes("--no-config")) {
  const nativeConfigs = [
    ".oxlintrc.json",
    ".oxlintrc.jsonc",
    "oxlint.config.ts",
    "oxlint.config.js",
    "oxlint.config.mts",
    "oxlint.config.mjs",
    "oxlint.config.cts",
    "oxlint.config.cjs",
  ];
  let directory = process.cwd();
  while (true) {
    if (nativeConfigs.some((name) => existsSync(join(directory, name)))) break;
    configPath = viteNames.map((name) => join(directory, name)).find(existsSync);
    if (configPath || dirname(directory) === directory) break;
    directory = dirname(directory);
  }
}
const temporary = new Set();
const watched = new Set();
let closing = false;
let updates = Promise.resolve();
let preparedArgs = args;
const lsp = args.includes("--lsp");

async function prepareViteConfig(path) {
  const { resolveConfig } = await import("../dist/index.js");
  const prefix = join(dirname(path), `.tiara-oxlint-${randomUUID()}`);
  const rootFile = prefix + "-root.json";
  const materialized = new Set();
  async function refresh() {
    const config = await resolveConfig(
      { root: process.cwd(), configFile: path, logLevel: "silent" },
      "build",
    );
    if (closing) return;
    const writes = new Map();
    const visiting = new Set();
    function materialize(value, file) {
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error("The Vite lint configuration must be an object.");
      if (visiting.has(value)) throw new Error("Circular Vite lint configuration extends.");
      visiting.add(value);
      const { options: _options, ...json } = value;
      if (json.extends && !Array.isArray(json.extends))
        throw new Error("Vite lint extends must be an array.");
      if (json.extends)
        json.extends = json.extends.map((item) =>
          typeof item === "string" ? item : materialize(item),
        );
      const text = JSON.stringify(json, (_key, item) => {
        if (typeof item === "function" || typeof item === "symbol" || typeof item === "bigint")
          throw new Error(
            "Native Oxlint configuration must contain serializable Rust rule settings.",
          );
        return item;
      });
      file ??= `${prefix}-${createHash("sha256").update(text).digest("hex")}.json`;
      if (file === rootFile || !materialized.has(file)) writes.set(file, text);
      visiting.delete(value);
      return file;
    }
    materialize(config.lint ?? {}, rootFile);
    // Share unchanged immutable children across updates. Published snapshots
    // remain valid until the native reader exits: it can still hold an old root.
    // Replace the root only after every child exists, beside the source config.
    const created = [];
    try {
      for (const [file, text] of writes) {
        if (closing) return;
        const staging = file + ".writing";
        temporary.add(file);
        temporary.add(staging);
        await writeFile(staging, text, { flag: "wx" });
        await rename(staging, file);
        if (file !== rootFile) {
          materialized.add(file);
          created.push(file);
        }
      }
    } catch (error) {
      // These files were never published, so no root reader can need them.
      for (const file of created) {
        await unlink(file);
        materialized.delete(file);
        temporary.delete(file);
      }
      throw error;
    }
    if (lsp) {
      for (const dependency of [path, ...(config.configFileDependencies ?? [])]) {
        if (watched.has(dependency)) continue;
        watched.add(dependency);
        watchFile(dependency, { interval: 500, persistent: false }, () => {
          updates = updates
            .then(() => (closing ? undefined : refresh()))
            .catch((error) => console.error(error.message));
        });
      }
    }
    return config;
  }
  const config = await refresh();
  const options = [];
  for (const [key, value] of Object.entries(config.lint?.options ?? {})) {
    const flag = "--" + key.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase());
    if (
      value == null ||
      value === false ||
      args.some((arg) => arg === flag || arg.startsWith(flag + "="))
    )
      continue;
    for (const item of Array.isArray(value) ? value : [value])
      options.push(flag, ...(item === true ? [] : [String(item)]));
  }
  const remaining = [...args];
  if (configIndex >= 0) remaining.splice(configIndex, configCount);
  preparedArgs = [...options, "--config", rootFile, ...remaining];
}

try {
  if (configPath && viteNames.includes(basename(configPath)))
    await prepareViteConfig(resolve(configPath));
  const child = spawn(native, preparedArgs, { stdio: "inherit", env: process.env });
  const handlers = new Map(
    ["SIGINT", "SIGTERM"].map((signal) => [signal, () => child.kill(signal)]),
  );
  for (const [signal, handler] of handlers) process.on(signal, handler);
  try {
    const result = await new Promise((done, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) => done({ code, signal }));
    });
    process.exitCode = result.code ?? 128 + (constants.signals[result.signal] ?? 1);
  } finally {
    for (const [signal, handler] of handlers) process.off(signal, handler);
  }
} finally {
  closing = true;
  for (const path of watched) unwatchFile(path);
  await updates;
  await Promise.all(
    [...temporary].map((file) =>
      unlink(file).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      }),
    ),
  );
}
