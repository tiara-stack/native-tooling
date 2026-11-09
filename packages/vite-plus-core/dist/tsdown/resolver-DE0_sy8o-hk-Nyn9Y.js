import { a as createDebug, r as requireTSApi } from "./require-BbBF8Ii0-C9u53Wjd.js";
import path from "node:path";
//#region ../../../../../build-virtual-store/rolldown-plugin-dts@0.28.6_@typescript+native-preview@7.0.0-dev.20260605.1_oxc-resolver_d7b1f0f9db662f38e672c8f14bf9ba00/node_modules/rolldown-plugin-dts/dist/resolver-DE0_sy8o.mjs
const debug = createDebug("rolldown-plugin-dts:tsc-resolver");
const ts = requireTSApi();
function tscResolve(id, importer, cwd, tsconfig, tsconfigRaw, reference) {
	const baseDir = tsconfig ? path.dirname(tsconfig) : cwd;
	const parsedConfig = ts.parseJsonConfigFileContent(tsconfigRaw, ts.sys, baseDir);
	const resolved = ts.bundlerModuleNameResolver(id, importer, {
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		...parsedConfig.options
	}, ts.sys, void 0, reference);
	debug(`tsc resolving id "%s" from "%s" -> %O`, id, importer, resolved.resolvedModule);
	return resolved.resolvedModule?.resolvedFileName;
}
//#endregion
export { tscResolve };
