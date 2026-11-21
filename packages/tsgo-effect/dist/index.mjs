import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/index.ts
const executableName = process.platform === "win32" ? "tsgo.exe" : "tsgo";
const packageRoot = findPackageRoot(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const resolveTsgoEffectPath = () => {
	const explicitPath = [process.env.TIARA_TSGO_EFFECT_PATH, process.env.TIARA_TSGO_PATH].find((path) => Boolean(path && existsSync(path)));
	if (explicitPath) return explicitPath;
	const sourceRoot = resolve(packageRoot, "../..");
	if (existsSync(join(sourceRoot, "native", "typescript-go", "go.mod"))) {
		const sourceBinary = join(sourceRoot, "native", "typescript-go", "built", "local", executableName);
		if (existsSync(sourceBinary)) return sourceBinary;
		throw new Error("Repository-local tsgo-effect is not built. Run pnpm native:build:tsgo.");
	}
	const binaryPath = [
		resolvePlatformBinary(),
		join(packageRoot, "vendor", `${process.platform}-${process.arch}`, executableName),
		findUp(process.cwd(), join("native", "typescript-go", "built", "local", executableName)),
		findUp(packageRoot, join("native", "typescript-go", "built", "local", executableName))
	].filter((path) => Boolean(path)).find((path) => existsSync(path));
	if (!binaryPath) throw new Error([
		"Unable to locate tsgo-effect.",
		"Build native/typescript-go/built/local/tsgo or install a platform package that provides vendor binaries.",
		"Set TIARA_TSGO_EFFECT_PATH to override the binary path."
	].join(" "));
	return binaryPath;
};
function resolvePlatformBinary() {
	if (process.platform !== "linux" || process.arch !== "x64") return void 0;
	try {
		const manifest = require.resolve("@tiara-stack/tsgo-effect-linux-x64/package.json");
		return join(dirname(manifest), "vendor", executableName);
	} catch {
		return;
	}
}
function findPackageRoot(start) {
	let directory = dirname(start);
	while (true) {
		if (existsSync(join(directory, "package.json"))) return directory;
		const parent = dirname(directory);
		if (parent === directory) return resolve(".");
		directory = parent;
	}
}
function findUp(start, relativePath) {
	let directory = resolve(start);
	while (true) {
		const candidate = join(directory, relativePath);
		if (existsSync(candidate)) return candidate;
		const parent = dirname(directory);
		if (parent === directory) return;
		directory = parent;
	}
}
//#endregion
export { resolveTsgoEffectPath };

//# sourceMappingURL=index.mjs.map