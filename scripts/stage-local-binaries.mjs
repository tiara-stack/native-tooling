import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const platformDir = `${process.platform}-${process.arch}`;
const root = process.cwd();

stage({
  source: join(root, "native", "typescript-go", "built", "local", process.platform === "win32" ? "tsgo.exe" : "tsgo"),
  target: join(root, "packages", "tsgo-effect", "vendor", platformDir, process.platform === "win32" ? "tsgo.exe" : "tsgo"),
});

stage({
  source: join(root, "native", "tsgolint-effect-fork", process.platform === "win32" ? "tsgolint.exe" : "tsgolint"),
  target: join(root, "packages", "tsgolint-effect", "vendor", platformDir, process.platform === "win32" ? "tsgolint.exe" : "tsgolint"),
});

stage({
  source: join(
    root,
    "native",
    "oxc-oxlint-effect-fork",
    "target",
    "release",
    process.platform === "win32" ? "oxlint.exe" : "oxlint",
  ),
  target: join(root, "packages", "oxlint-effect", "vendor", platformDir, process.platform === "win32" ? "oxlint.exe" : "oxlint"),
});

function stage({ source, target }) {
  if (!existsSync(source)) {
    throw new Error(`Missing native binary: ${source}`);
  }
  mkdirSync(join(target, ".."), { recursive: true });
  copyFileSync(source, target);
  console.log(`${source} -> ${target}`);
}
