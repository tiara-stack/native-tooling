import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const effect = join(root, "native/effect-tsgo");
const compiler = join(root, "native/typescript-go");
const lint = join(root, "native/tsgolint-effect-fork");

run(join(compiler, "internal/diagnostics"), [
  "run",
  "generate.go",
  "-diagnostics",
  "./diagnostics_generated.go",
  "-loc",
  "./loc_generated.go",
  "-locdir",
  "./loc",
]);
run(join(effect, "_tools/gen_shims"), [
  "run",
  ".",
  "--repository-root",
  effect,
  "--source-root",
  compiler,
  "--module-prefix",
  "github.com/microsoft/typescript-go",
  "--provider-shim-prefix",
  "github.com/microsoft/typescript-go/shim",
  "--extra-shim-root",
  join(effect, "_tools/gen_shims/providers/typescript-go"),
  "--extra-shim-root",
  join(lint, "shim"),
]);

// Both tools must compile against the same generated provider and canonical
// facade. The tsgolint config above contributes its additional checker exports.
const shimModules = [];
function collectModules(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectModules(path);
    else if (entry.name === "go.mod") {
      const module = readFileSync(path, "utf8").match(/^module (\S+)/m)?.[1];
      if (!module) throw new Error(`Missing module declaration in ${path}`);
      shimModules.push({ module, dir: dirname(path) });
    }
  }
}
collectModules(join(effect, "shim"));
for (const dir of [effect, compiler, lint]) {
  const replacements = [
    ...shimModules,
    { module: "github.com/microsoft/typescript-go", dir: compiler },
    { module: "github.com/effect-ts/tsgo", dir: effect },
    { module: "github.com/effect-ts/tsgo/etscore", dir: join(effect, "etscore") },
  ].filter((entry) => entry.dir !== dir);
  run(dir, [
    "mod",
    "edit",
    ...replacements.map(
      (entry) => `-replace=${entry.module}=./${relative(dir, entry.dir).replaceAll("\\", "/")}`,
    ),
  ]);
}
run(compiler, [
  "mod",
  "edit",
  "-require=github.com/effect-ts/tsgo@v0.0.0",
  "-require=github.com/effect-ts/tsgo/etscore@v0.0.0",
]);
run(lint, [
  "mod",
  "edit",
  "-require=github.com/effect-ts/tsgo@v0.0.0",
  "-require=github.com/effect-ts/tsgo/etscore@v0.0.0",
]);
run(effect, ["work", "edit", "-use=../tsgolint-effect-fork"], { GOWORK: join(effect, "go.work") });

for (const entry of readdirSync(join(compiler, "internal/collections"))) {
  if (entry.endsWith(".go") && !entry.endsWith("_test.go")) {
    copyFileSync(
      join(compiler, "internal/collections", entry),
      join(lint, "internal/collections", entry),
    );
  }
}
// Keep the retained tsgolint shim outputs derived from the shared generator.
for (const module of shimModules) {
  const path = relative(join(effect, "shim"), module.dir);
  if (path.startsWith("_backport")) continue;
  const target = join(lint, "shim", path);
  if (!existsSync(target)) continue;
  for (const entry of readdirSync(module.dir)) {
    if (entry.endsWith(".go") || entry === "go.mod") {
      copyFileSync(join(module.dir, entry), join(target, entry));
    }
  }
}
// vfsmatch belongs to the vfs module, as in the selected upstream sources.
rmSync(join(lint, "shim/vfs/vfsmatch/go.mod"), { force: true });
copyFileSync(join(effect, "shim/vfs/vfsmatch/shim.go"), join(lint, "shim/vfs/vfsmatch/shim.go"));
run(lint, [
  "mod",
  "edit",
  "-dropreplace=github.com/microsoft/typescript-go/shim/vfs/vfsmatch",
  "-droprequire=github.com/microsoft/typescript-go/shim/vfs/vfsmatch",
]);

const fixtureResult = spawnSync(
  process.execPath,
  ["--experimental-strip-types", join(effect, "_tools/repoctl/src/generate-fixtures.ts")],
  {
    cwd: effect,
    stdio: "inherit",
    env: process.env,
  },
);
if (fixtureResult.error) throw fixtureResult.error;
if (fixtureResult.status !== 0) {
  throw new Error(
    "Fixture generation failed. Install native/effect-tsgo workspace dependencies first.",
  );
}

function run(cwd, args, env = {}) {
  const result = spawnSync("go", args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, GOWORK: "off", ...env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`go ${args.join(" ")} failed with ${result.status}`);
}
