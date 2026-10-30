import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
//#region src/utils/tiara-native.ts
const require = createRequire(import.meta.url);
const binaries = {
	oxlint: {
		overrides: ["TIARA_OXLINT_EFFECT_PATH", "TIARA_REAL_OXLINT_PATH"],
		local: [
			"native",
			"oxc-oxlint-effect-fork",
			"target",
			"release",
			"oxlint"
		]
	},
	tsgolint: {
		overrides: ["TIARA_TSGOLINT_EFFECT_PATH"],
		local: [
			"native",
			"tsgolint-effect-fork",
			"tsgolint"
		]
	},
	tsgo: {
		overrides: ["TIARA_TSGO_EFFECT_PATH", "TIARA_TSGO_PATH"],
		local: [
			"native",
			"typescript-go",
			"built",
			"local",
			"tsgo"
		]
	}
};
function resolveTiaraNative(tool) {
	const spec = binaries[tool];
	const override = spec.overrides.map((name) => process.env[name]).find(Boolean);
	if (override) return assertBinary(resolve(override), tool);
	const sourceRoot = findSourceRoot(process.cwd()) ?? findSourceRoot(import.meta.dirname);
	if (sourceRoot) {
		const parts = [...spec.local];
		if (process.platform === "win32") parts[parts.length - 1] += ".exe";
		return assertBinary(join(sourceRoot, ...parts), tool);
	}
	const wrapper = resolveTiaraWrapper(tool);
	const result = spawnSync(process.execPath, [wrapper, "--print-path"], { encoding: "utf8" });
	if (result.error || result.status !== 0) throw new Error(`Unable to resolve Tiara ${tool}: ${result.error?.message ?? result.stderr}`);
	return assertBinary(result.stdout.trim(), tool);
}
function resolveTiaraWrapper(tool) {
	return require.resolve(`@tiara-stack/${tool}-effect/bin/${tool}-effect`);
}
function assertBinary(path, tool) {
	if (!path || !existsSync(path)) throw new Error(`Missing Tiara ${tool} build at ${path}. Build the repo-local native tool or set ${binaries[tool].overrides[0]}.`);
	return path;
}
function findSourceRoot(start) {
	let directory = resolve(start);
	while (true) {
		const manifest = join(directory, "package.json");
		if (existsSync(manifest)) {
			if (JSON.parse(readFileSync(manifest, "utf8")).name === "@tiara-stack/native-tooling-monorepo") return directory;
		}
		const parent = dirname(directory);
		if (parent === directory) return void 0;
		directory = parent;
	}
}
//#endregion
export { resolveTiaraWrapper as n, resolveTiaraNative as t };
