#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, unwatchFile, watchFile } from "node:fs";
import { open, rename, unlink } from "node:fs/promises";
import { constants } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { bridgeLsp, lspOptions } from "./tiara-oxlint-lsp.mjs";

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
let bridge;
let effectiveLspOptions = { defaults: {}, overrides: {} };
const explicitLsp = {};
for (let index = 0; index < args.length && args[index] !== "--"; index++) {
  const [flag, inline] = args[index].split(/=(.*)/s);
  const key = {
    "--type-aware": "typeAware",
    "--disable-nested-config": "disableNestedConfig",
    "--tsconfig": "tsconfig",
    "--report-unused-disable-directives": "reportUnusedDisableDirectives",
    "--report-unused-disable-directives-severity": "reportUnusedDisableDirectivesSeverity",
    "--fix": "fix",
    "--fix-suggestions": "fixSuggestions",
    "--fix-dangerously": "fixDangerously",
  }[flag];
  if (key)
    explicitLsp[key] = ["tsconfig", "reportUnusedDisableDirectivesSeverity"].includes(key)
      ? (inline ?? args[++index])
      : true;
}
if (explicitLsp.tsconfig) explicitLsp.tsconfig = resolve(explicitLsp.tsconfig);
effectiveLspOptions.overrides = lsp ? lspOptions(explicitLsp) : {};
if (configPath) effectiveLspOptions.overrides.configPath = resolve(configPath);

async function prepareViteConfig(path) {
  const { resolveConfig } = await import("../dist/index.js");
  const prefix = join(dirname(path), `.tiara-oxlint-${randomUUID()}`);
  const rootFile = prefix + "-root.json";
  const materialized = new Set();
  const stagingFiles = new Set();
  async function reclaim(file) {
    try {
      await unlink(file);
    } catch (error) {
      if (error.code !== "ENOENT") return;
    }
    materialized.delete(file);
    stagingFiles.delete(file);
    temporary.delete(file);
  }
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
      // These are native root-config options too. Keep settings such as
      // respectEslintDisableDirectives that have no equivalent CLI flag.
      const json = { ...value };
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
      for (const file of stagingFiles) await reclaim(file);
      for (const [file, text] of writes) {
        if (closing) return;
        const staging = file + ".writing";
        const handle = await open(staging, "wx");
        stagingFiles.add(staging);
        temporary.add(staging);
        let failure;
        try {
          await handle.writeFile(text);
        } catch (error) {
          failure = error;
        }
        try {
          await handle.close();
        } catch (error) {
          failure ??= error;
        }
        if (failure) throw failure;
        await rename(staging, file);
        stagingFiles.delete(staging);
        temporary.delete(staging);
        temporary.add(file);
        if (file !== rootFile) {
          materialized.add(file);
          created.push(file);
        }
      }
    } catch (error) {
      for (const file of stagingFiles) await reclaim(file);
      // These files were never published, so no root reader can need them.
      for (const file of created) await reclaim(file);
      throw error;
    }
    effectiveLspOptions = {
      defaults: lsp ? lspOptions(config.lint?.options ?? {}) : {},
      overrides: { ...(lsp ? lspOptions(explicitLsp) : {}), configPath: rootFile },
    };
    bridge?.refresh();
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
  await refresh();
  if (closing) return;
  const remaining = [...args];
  if (configIndex >= 0) remaining.splice(configIndex, configCount);
  preparedArgs = ["--config", rootFile, ...remaining];
}

let child;
const handlers = new Map(
  ["SIGINT", "SIGTERM"].map((signal) => [
    signal,
    () => {
      closing = true;
      if (child) child.kill(signal);
      else process.exitCode = 128 + constants.signals[signal];
    },
  ]),
);
// Own interruption before creating snapshots and until cleanup has settled.
for (const [signal, handler] of handlers) process.on(signal, handler);
try {
  if (configPath && viteNames.includes(basename(configPath)))
    await prepareViteConfig(resolve(configPath));
  if (!closing) {
    child = spawn(native, preparedArgs, {
      stdio: lsp ? ["pipe", "pipe", "inherit"] : "inherit",
      env: process.env,
    });
    const exited = new Promise((done, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) => done({ code, signal }));
    });
    if (lsp) bridge = bridgeLsp(child, () => effectiveLspOptions);
    let result;
    try {
      result = await (bridge ? Promise.race([exited, bridge.failed]) : exited);
    } catch (error) {
      child.kill("SIGTERM");
      await exited.catch(() => {});
      throw error;
    } finally {
      bridge?.close();
    }
    process.exitCode = result.code ?? 128 + (constants.signals[result.signal] ?? 1);
  }
} finally {
  closing = true;
  for (const path of watched) unwatchFile(path);
  try {
    await updates;
    const cleanup = await Promise.allSettled(
      [...temporary].map((file) =>
        unlink(file).catch((error) => {
          if (error.code !== "ENOENT") throw error;
        }),
      ),
    );
    const failures = cleanup
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);
    if (failures.length)
      throw new AggregateError(failures, "Could not remove native lint snapshots");
  } finally {
    for (const [signal, handler] of handlers) process.off(signal, handler);
  }
}
