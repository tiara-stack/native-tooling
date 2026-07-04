import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const cases = [
  {
    packageName: "vite-plus",
    version: "0.1.15",
    patch: join(root, "patches", "vite-plus@0.1.15-native-tsgolint.patch"),
  },
  {
    packageName: "oxlint",
    version: "1.58.0",
    patch: join(root, "patches", "oxlint@1.58.0-native-effect.patch"),
  },
];

for (const entry of cases) {
  const dir = mkdtempSync(join(tmpdir(), `${entry.packageName}-patch-`));
  try {
    run("npm", ["pack", `${entry.packageName}@${entry.version}`, "--silent"], dir);
    run("tar", ["-xzf", `${entry.packageName}-${entry.version}.tgz`], dir);
    const packageDir = join(dir, "package");
    run("git", ["init", "-q"], packageDir);
    run("git", ["add", "."], packageDir);
    run("git", ["commit", "-qm", "init"], packageDir);
    run("git", ["apply", "--check", entry.patch], packageDir);
    console.log(`${entry.patch} applies cleanly`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with ${result.status}`);
  }
}
