import { dirname, join } from "node:path";
import { existsSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
//#region src/utils/tsgolint-path.ts
function resolveWindowsTsgolintExecutable(pathCandidates, options) {
	let oxlintTsgolintPath = pathCandidates.find((p) => options.exists(p)) ?? "";
	if (!oxlintTsgolintPath && options.getRealpathCandidates) try {
		oxlintTsgolintPath = options.getRealpathCandidates().find((p) => options.exists(p)) ?? "";
	} catch {}
	if (!oxlintTsgolintPath) throw new Error("Unable to resolve oxlint-tsgolint executable, tried:\n" + pathCandidates.map((path) => `- ${path}`).join("\n"));
	return oxlintTsgolintPath;
}
function resolveTiaraTsgolintExecutable() {
	let packagedTsgolintPath;
	try {
		packagedTsgolintPath = require.resolve("@tiara-stack/tsgolint-effect/bin/tsgolint-effect");
	} catch {}
	const candidate = process.env.TIARA_TSGOLINT_EFFECT_PATH ?? packagedTsgolintPath;
	return candidate && existsSync(candidate) ? candidate : undefined;
}
function resolveTsgolintExecutable(tsgolintBinPath, scriptUrl) {
	const tiaraTsgolintPath = resolveTiaraTsgolintExecutable();
	if (tiaraTsgolintPath) return tiaraTsgolintPath;
	if (process.platform !== "win32") return tsgolintBinPath;
	const scriptDir = dirname(fileURLToPath(scriptUrl));
	const localBinDir = join(scriptDir, "..", "node_modules", ".bin");
	const projectBinDir = join(dirname(dirname(tsgolintBinPath)), "..", ".bin");
	return resolveWindowsTsgolintExecutable([
		join(localBinDir, "tsgolint.exe"),
		join(localBinDir, "tsgolint.cmd"),
		join(projectBinDir, "tsgolint.exe"),
		join(projectBinDir, "tsgolint.cmd")
	], {
		exists: existsSync,
		getRealpathCandidates: () => {
			const realBinDir = join(dirname(realpathSync(join(scriptDir, ".."))), ".bin");
			return [join(realBinDir, "tsgolint.exe"), join(realBinDir, "tsgolint.cmd")];
		}
	});
}
//#endregion
export { resolveWindowsTsgolintExecutable as n, resolveTsgolintExecutable as t };
