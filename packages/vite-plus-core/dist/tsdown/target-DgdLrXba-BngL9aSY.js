import { d as toArray, r as importWithError, s as resolveComma, u as styleText$1 } from "./style-DiMP8pYv-DIC5PXeH.js";
import { n as x, r as createDebug } from "./main-RJSjZfzp.js";
import { a as GREATER_LESS_THAN, c as LOOSE_PLAIN, d as compareParsed, f as formatComparableVersion, g as tryParse, h as safeRegex, i as FULL_PLAIN, l as XRANGE_PLAIN, m as parse$1, n as normalize$1, o as LONE_CARET, p as isGreaterOrEqual, r as BUILD, s as LONE_TILDE, u as XRANGE_PLAIN_LOOSE, v as RE_DTS } from "./version-CQ98ZBpL-jJD4zZs9.js";
import process from "node:process";
import path from "node:path";
import { access, cp, mkdir, mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
//#region ../../../../../build-virtual-store/tsdown@0.23.0_@arethetypeswrong+core@0.18.2_@tsdown+css@0.23.0_@tsdown+exe@0.23.0_@type_322c16727ed86a15fb2ecef349e911e9/node_modules/tsdown/dist/format-DLxyxnif.mjs
function fsExists(path) {
	return access(path).then(() => true, () => false);
}
function fsStat(path) {
	return stat(path).catch(() => null);
}
function fsRemove(path) {
	return rm(path, {
		force: true,
		recursive: true
	}).catch(() => {});
}
function fsCopy(from, to) {
	return cp(from, to, {
		recursive: true,
		force: true
	});
}
function lowestCommonAncestor(...filepaths) {
	if (filepaths.length === 0) return "";
	if (filepaths.length === 1) return path.dirname(filepaths[0]);
	filepaths = filepaths.map(path.normalize);
	const [first, ...rest] = filepaths;
	let ancestor = first.split(path.sep);
	for (const filepath of rest) {
		const directories = filepath.split(path.sep, ancestor.length);
		let index = 0;
		for (const directory of directories) if (directory === ancestor[index]) index += 1;
		else {
			ancestor = ancestor.slice(0, index);
			break;
		}
		ancestor = ancestor.slice(0, index);
	}
	return ancestor.length <= 1 && ancestor[0] === "" ? path.sep + ancestor[0] : ancestor.join(path.sep);
}
function stripExtname(filePath) {
	const ext = path.extname(filePath);
	if (!ext.length) return filePath;
	return filePath.slice(0, -ext.length);
}
function formatBytes(bytes) {
	if (bytes === Infinity) return void 0;
	if (bytes > 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
	return `${(bytes / 1e3).toFixed(2)} kB`;
}
//#endregion
//#region ../../../../../build-virtual-store/verkit@0.4.0/node_modules/verkit/dist/set-CC5YeoYX.js
const STRICT_COMPARATOR = safeRegex(String.raw`^${GREATER_LESS_THAN}\s*(${FULL_PLAIN})$|^$`);
const LOOSE_COMPARATOR$1 = safeRegex(String.raw`^${GREATER_LESS_THAN}\s*(${LOOSE_PLAIN})$|^$`);
function parseComparator(comparator, options = {}) {
	if (typeof comparator !== "string") return comparator;
	const normalized = comparator.trim().replaceAll(/\s+/g, " ");
	const match = normalized.match(options.loose ? LOOSE_COMPARATOR$1 : STRICT_COMPARATOR);
	if (!match) throw new TypeError(`Invalid comparator: ${normalized}`);
	const operator = match[1] === "=" ? "" : match[1] || "";
	const version = match[2] ? parse$1(match[2], options) : null;
	return {
		operator,
		options,
		value: version ? `${operator}${formatComparableVersion(version)}` : "",
		version
	};
}
function testParsedComparator(comparator, version) {
	if (!comparator.version) return true;
	const comparison = compareParsed(version, comparator.version);
	switch (comparator.operator) {
		case "": return comparison === 0;
		case ">": return comparison > 0;
		case ">=": return comparison >= 0;
		case "<": return comparison < 0;
		case "<=": return comparison <= 0;
	}
}
function comparatorAllowsPrerelease(comparator, version) {
	const allowed = comparator.version;
	return allowed !== null && !!allowed.prerelease?.length && allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch;
}
function testComparatorSet(set, version, options) {
	if (set.some((comparator) => !testParsedComparator(comparator, version))) return false;
	return !version.prerelease?.length || !!options.includePrerelease || set.some((comparator) => comparatorAllowsPrerelease(comparator, version));
}
//#endregion
//#region ../../../../../build-virtual-store/verkit@0.4.0/node_modules/verkit/dist/range-DvX-Y6iv.js
const BUILD_STRIP = new RegExp(BUILD, "g");
const BUILD_SAFE = safeRegex(BUILD);
const STRICT_HYPHEN = safeRegex(String.raw`^\s*(${XRANGE_PLAIN})\s+-\s+(${XRANGE_PLAIN})\s*$`);
const LOOSE_HYPHEN = safeRegex(String.raw`^\s*(${XRANGE_PLAIN_LOOSE})\s+-\s+(${XRANGE_PLAIN_LOOSE})\s*$`);
const COMPARATOR_TRIM = safeRegex(String.raw`(\s*)${GREATER_LESS_THAN}\s*(${LOOSE_PLAIN}|${XRANGE_PLAIN})`, "g");
const TILDE_TRIM = safeRegex(String.raw`(\s*)${LONE_TILDE}\s+`, "g");
const CARET_TRIM = safeRegex(String.raw`(\s*)${LONE_CARET}\s+`, "g");
const STRICT_TILDE = safeRegex(`^${LONE_TILDE}${XRANGE_PLAIN}$`);
const LOOSE_TILDE = safeRegex(`^${LONE_TILDE}${XRANGE_PLAIN_LOOSE}$`);
const STRICT_CARET = safeRegex(`^${LONE_CARET}${XRANGE_PLAIN}$`);
const LOOSE_CARET = safeRegex(`^${LONE_CARET}${XRANGE_PLAIN_LOOSE}$`);
const STRICT_XRANGE = safeRegex(String.raw`^${GREATER_LESS_THAN}\s*${XRANGE_PLAIN}$`);
const LOOSE_XRANGE = safeRegex(String.raw`^${GREATER_LESS_THAN}\s*${XRANGE_PLAIN_LOOSE}$`);
const STAR = safeRegex(String.raw`(<|>)?=?\s*\*`);
const GTE_ZERO = /^\s*>=\s*0\.0\.0\s*$/;
const GTE_ZERO_PRERELEASE = /^\s*>=\s*0\.0\.0-0\s*$/;
const LOOSE_COMPARATOR = safeRegex(String.raw`^${GREATER_LESS_THAN}\s*(${LOOSE_PLAIN})$|^$`);
function isWildcard(value) {
	return !value || String(value).toLowerCase() === "x" || String(value) === "*";
}
function hasInvalidWildcardOrder(major, minor, patch) {
	return isWildcard(major) && !isWildcard(minor) || isWildcard(minor) && Boolean(patch) && !isWildcard(patch);
}
function replaceTilde(comparator, options) {
	const expression = options.loose ? LOOSE_TILDE : STRICT_TILDE;
	const lowerPrerelease = options.includePrerelease ? "-0" : "";
	return comparator.replace(expression, (_match, major, minor, patch, prerelease) => {
		if (isWildcard(major)) return "";
		if (isWildcard(minor)) return `>=${major}.0.0${lowerPrerelease} <${Number(major) + 1}.0.0-0`;
		if (isWildcard(patch)) return `>=${major}.${minor}.0${lowerPrerelease} <${major}.${Number(minor) + 1}.0-0`;
		return prerelease ? `>=${major}.${minor}.${patch}-${prerelease} <${major}.${Number(minor) + 1}.0-0` : `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
	});
}
function replaceTildes(comparator, options) {
	return comparator.trim().split(/\s+/).map((part) => replaceTilde(part, options)).join(" ");
}
function replaceCaret(comparator, options) {
	const expression = options.loose ? LOOSE_CARET : STRICT_CARET;
	const lowerPrerelease = options.includePrerelease ? "-0" : "";
	return comparator.replace(expression, (_match, major, minor, patch, prerelease) => {
		if (isWildcard(major)) return "";
		if (isWildcard(minor)) return `>=${major}.0.0${lowerPrerelease} <${Number(major) + 1}.0.0-0`;
		if (isWildcard(patch)) return major === "0" ? `>=${major}.${minor}.0${lowerPrerelease} <${major}.${Number(minor) + 1}.0-0` : `>=${major}.${minor}.0${lowerPrerelease} <${Number(major) + 1}.0.0-0`;
		if (prerelease) return major === "0" ? minor === "0" ? `>=${major}.${minor}.${patch}-${prerelease} <${major}.${minor}.${Number(patch) + 1}-0` : `>=${major}.${minor}.${patch}-${prerelease} <${major}.${Number(minor) + 1}.0-0` : `>=${major}.${minor}.${patch}-${prerelease} <${Number(major) + 1}.0.0-0`;
		return major === "0" ? minor === "0" ? `>=${major}.${minor}.${patch} <${major}.${minor}.${Number(patch) + 1}-0` : `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0` : `>=${major}.${minor}.${patch} <${Number(major) + 1}.0.0-0`;
	});
}
function replaceCarets(comparator, options) {
	return comparator.trim().split(/\s+/).map((part) => replaceCaret(part, options)).join(" ");
}
function replaceXRange(comparator, options) {
	const expression = options.loose ? LOOSE_XRANGE : STRICT_XRANGE;
	return comparator.trim().replace(expression, (match, rawOperator, rawMajor, rawMinor, rawPatch) => {
		let operator = rawOperator;
		let major = rawMajor;
		let minor = rawMinor;
		let patch = rawPatch;
		if (hasInvalidWildcardOrder(String(major), minor === void 0 ? void 0 : String(minor), patch === void 0 ? void 0 : String(patch))) return comparator;
		const wildcardMajor = isWildcard(major);
		const wildcardMinor = wildcardMajor || isWildcard(minor);
		const wildcardPatch = wildcardMinor || isWildcard(patch);
		if (operator === "=" && wildcardPatch) operator = "";
		if (wildcardMajor) return operator === ">" || operator === "<" ? "<0.0.0-0" : "*";
		let prerelease = options.includePrerelease ? "-0" : "";
		if (operator && wildcardPatch) {
			if (wildcardMinor) minor = 0;
			patch = 0;
			if (operator === ">") {
				operator = ">=";
				if (wildcardMinor) {
					major = Number(major) + 1;
					minor = 0;
				} else minor = Number(minor) + 1;
			} else if (operator === "<=") {
				operator = "<";
				if (wildcardMinor) major = Number(major) + 1;
				else minor = Number(minor) + 1;
			}
			if (operator === "<") prerelease = "-0";
			return `${operator}${major}.${minor}.${patch}${prerelease}`;
		}
		if (wildcardMinor) return `>=${major}.0.0${prerelease} <${Number(major) + 1}.0.0-0`;
		if (wildcardPatch) return `>=${major}.${minor}.0${prerelease} <${major}.${Number(minor) + 1}.0-0`;
		return match;
	});
}
function replaceXRanges(comparator, options) {
	return comparator.split(/\s+/).map((part) => replaceXRange(part, options)).join(" ");
}
function replaceHyphenRange(range, options) {
	const expression = options.loose ? LOOSE_HYPHEN : STRICT_HYPHEN;
	return range.replace(expression, (_match, rawFrom, fromMajor, fromMinor, fromPatch, fromPrerelease, _fromBuild, rawTo, toMajor, toMinor, toPatch, toPrerelease) => {
		let from = rawFrom;
		let to = rawTo;
		if (isWildcard(fromMajor)) from = "";
		else if (isWildcard(fromMinor)) from = `>=${fromMajor}.0.0${options.includePrerelease ? "-0" : ""}`;
		else if (isWildcard(fromPatch)) from = `>=${fromMajor}.${fromMinor}.0${options.includePrerelease ? "-0" : ""}`;
		else if (fromPrerelease) from = `>=${from}`;
		else from = `>=${from}${options.includePrerelease ? "-0" : ""}`;
		if (isWildcard(toMajor)) to = "";
		else if (isWildcard(toMinor)) to = `<${Number(toMajor) + 1}.0.0-0`;
		else if (isWildcard(toPatch)) to = `<${toMajor}.${Number(toMinor) + 1}.0-0`;
		else if (toPrerelease) to = `<=${toMajor}.${toMinor}.${toPatch}-${toPrerelease}`;
		else if (options.includePrerelease) to = `<${toMajor}.${toMinor}.${Number(toPatch) + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	});
}
function expandComparator(comparator, options) {
	return replaceXRanges(replaceTildes(replaceCarets(comparator.replace(BUILD_SAFE, ""), options), options), options).trim().replace(STAR, "");
}
function parseSimpleRange(input, options) {
	let parts = replaceHyphenRange(input.replace(BUILD_STRIP, ""), options).replace(COMPARATOR_TRIM, "$1$2$3").replace(TILDE_TRIM, "$1~").replace(CARET_TRIM, "$1^").split(" ").map((part) => expandComparator(part, options)).join(" ").split(/\s+/).map((part) => part.trim().replace(options.includePrerelease ? GTE_ZERO_PRERELEASE : GTE_ZERO, ""));
	if (options.loose) parts = parts.filter((part) => LOOSE_COMPARATOR.test(part));
	const unique = /* @__PURE__ */ new Map();
	for (const comparator of parts.map((part) => parseComparator(part, options))) {
		if (comparator.value === "<0.0.0-0") return [comparator];
		unique.set(comparator.value, comparator);
	}
	if (unique.size > 1) unique.delete("");
	return [...unique.values()];
}
function parseRange(range, options = {}) {
	if (typeof range !== "string") return range;
	const parsedOptions = { ...options };
	const normalizedRange = range.trim().replaceAll(/\s+/g, " ");
	let sets = normalizedRange.split("||").map((part) => parseSimpleRange(part.trim(), parsedOptions)).filter((set) => set.length);
	if (!sets.length) throw new TypeError(`Range contains no valid comparator sets: ${normalizedRange}`);
	if (sets.length > 1) {
		const first = sets[0];
		sets = sets.filter((set) => set[0]?.value !== "<0.0.0-0");
		if (!sets.length) sets = [first];
		else if (sets.length > 1) {
			const any = sets.find((set) => set.length === 1 && set[0]?.value === "");
			if (any) sets = [any];
		}
	}
	return {
		options: parsedOptions,
		sets
	};
}
function tryParseRange(range, options = {}) {
	try {
		return parseRange(range, options);
	} catch {
		return null;
	}
}
function testParsedRange(range, version) {
	return range.sets.some((set) => testComparatorSet(set, version, range.options));
}
function testRangeVersion(range, version) {
	const parsed = tryParse(version, range.options);
	return parsed ? testParsedRange(range, parsed) : false;
}
function satisfies(version, range, options = {}) {
	const parsed = tryParseRange(range, options);
	return parsed ? testRangeVersion(parsed, version) : false;
}
function nextVersionAfter(version) {
	const { prerelease } = version;
	return prerelease?.length ? {
		major: version.major,
		minor: version.minor,
		patch: version.patch,
		prerelease: [...prerelease, 0]
	} : {
		major: version.major,
		minor: version.minor,
		patch: version.patch + 1
	};
}
function findMinimumForRange(range, options = {}) {
	const parsedRange = parseRange(range, options);
	const zero = {
		major: 0,
		minor: 0,
		patch: 0
	};
	if (testParsedRange(parsedRange, zero)) return zero;
	const zeroPrerelease = {
		...zero,
		prerelease: [0]
	};
	if (testParsedRange(parsedRange, zeroPrerelease)) return zeroPrerelease;
	let minimum = null;
	for (const set of parsedRange.sets) {
		let setMinimum = null;
		for (const comparator of set) {
			if (!comparator.version) continue;
			const candidate = comparator.operator === ">" ? nextVersionAfter(comparator.version) : comparator.operator === "" || comparator.operator === ">=" ? structuredClone(comparator.version) : null;
			if (candidate && (!setMinimum || compareParsed(candidate, setMinimum) > 0)) setMinimum = candidate;
		}
		if (setMinimum && (!minimum || compareParsed(minimum, setMinimum) > 0)) minimum = setMinimum;
	}
	return minimum && testParsedRange(parsedRange, minimum) ? minimum : null;
}
//#endregion
//#region ../../../../../build-virtual-store/tsdown@0.23.0_@arethetypeswrong+core@0.18.2_@tsdown+css@0.23.0_@tsdown+exe@0.23.0_@type_322c16727ed86a15fb2ecef349e911e9/node_modules/tsdown/dist/target-DgdLrXba.mjs
const NODE_SEA_MIN_VERSION = "25.7.0";
const NODE_SEA_MIN_VERSION_PARSED = {
	major: 25,
	minor: 7,
	patch: 0
};
const debug = createDebug("tsdown:exe");
function validateSea({ dts, entry, logger, nameLabel }) {
	if (process.versions.bun || process.versions.deno) throw new Error("The `exe` option is not supported in Bun and Deno environments.");
	if (!isGreaterOrEqual(process.version, NODE_SEA_MIN_VERSION_PARSED)) throw new Error(`Node.js version ${process.version} does not support \`exe\` option. Please upgrade to Node.js ${NODE_SEA_MIN_VERSION} or later.`);
	if (Object.keys(entry).length > 1) throw new Error(`The \`exe\` feature currently only supports single entry points. Found entries:\n${JSON.stringify(entry, void 0, 2)}`);
	if (dts) logger.warn(nameLabel, `Generating .d.ts files with \`exe\` option is not recommended since they won't be included in the executable. Consider separating your library and executable targets if you need type declarations.`);
	logger.info(nameLabel, "`exe` option is experimental and may change in future releases.");
}
async function buildExe(config, chunks) {
	if (!config.exe) return;
	const filteredChunks = chunks.filter((chunk) => !RE_DTS.test(chunk.fileName));
	if (filteredChunks.length > 1) throw new Error(`The 'exe' feature currently only supports single-chunk outputs. Found ${filteredChunks.length} chunks.\nChunks:\n${filteredChunks.map((c) => `- ${c.fileName}`).join("\n")}`);
	const chunk = filteredChunks[0];
	debug("Building executable with SEA for chunk:", chunk.fileName);
	const bundledFile = path.join(config.outDir, chunk.fileName);
	const { targets } = config.exe;
	if (targets?.length) {
		if (config.exe.seaConfig?.executable) config.logger.warn(config.nameLabel, "`seaConfig.executable` is ignored when `targets` is specified.");
		const { resolveNodeBinary, getTargetSuffix } = await import("./tsdown-exe.js");
		for (const target of targets) {
			const nodeBinaryPath = await resolveNodeBinary(target, config.exe, config.logger);
			const suffix = getTargetSuffix(target);
			await buildSingleExe(config, bundledFile, resolveOutputFileName(config.exe, chunk, bundledFile, target, suffix), nodeBinaryPath, target);
		}
	} else await buildSingleExe(config, bundledFile, resolveOutputFileName(config.exe, chunk, bundledFile));
}
function resolveOutputFileName(exe, chunk, bundledFile, target, suffix) {
	let baseName;
	if (exe.fileName) baseName = typeof exe.fileName === "function" ? exe.fileName(chunk) : exe.fileName;
	else baseName = path.basename(bundledFile, path.extname(bundledFile));
	if (suffix) baseName += suffix;
	if (target?.platform ? target.platform === "win" : process.platform === "win32") baseName += ".exe";
	return baseName;
}
async function buildSingleExe(config, bundledFile, outputFile, executable, target) {
	const exe = config.exe;
	const exeOutDir = path.resolve(config.cwd, exe.outDir || "build");
	await mkdir(exeOutDir, { recursive: true });
	const outputPath = path.join(exeOutDir, outputFile);
	debug("Building SEA executable: %s -> %s", bundledFile, outputPath);
	const t = performance.now();
	const tempDir = await mkdtemp(path.join(tmpdir(), "tsdown-sea-"));
	try {
		const seaConfig = {
			disableExperimentalSEAWarning: true,
			...exe.seaConfig,
			main: bundledFile,
			output: outputPath,
			mainFormat: config.format === "es" ? "module" : "commonjs"
		};
		if (executable) seaConfig.executable = executable;
		const seaConfigPath = path.join(tempDir, "sea-config.json");
		await writeFile(seaConfigPath, JSON.stringify(seaConfig));
		debug("Wrote sea-config.json: %O -> %s", seaConfig, seaConfigPath);
		debug("Running: %s --build-sea %s", process.execPath, seaConfigPath);
		await x(process.execPath, ["--build-sea", seaConfigPath], {
			nodeOptions: { stdio: [
				"ignore",
				"ignore",
				"inherit"
			] },
			throwOnError: true,
			nodePath: false
		});
	} finally {
		if (debug.enabled) debug("Preserving temp directory for debugging: %s", tempDir);
		else await fsRemove(tempDir);
	}
	if ((target?.platform || process.platform) === "darwin") try {
		await x("codesign", [
			"--sign",
			"-",
			outputPath
		], {
			nodeOptions: { stdio: "inherit" },
			throwOnError: true,
			nodePath: false
		});
	} catch {
		config.logger.warn(config.nameLabel, `Failed to code-sign the executable. ${process.platform === "darwin" ? `You can sign it manually using:\n  codesign --sign - "${outputPath}"` : `Automatic code signing is not supported on ${process.platform}.`}`);
	}
	const stat = await fsStat(outputPath);
	if (stat) {
		const sizeText = formatBytes(stat.size);
		config.logger.info(config.nameLabel, styleText$1.bold(path.relative(config.cwd, outputPath)), ` ${styleText$1.dim(sizeText)}`);
	}
	config.logger.success(config.nameLabel, `Built executable: ${styleText$1.red(path.relative(config.cwd, outputPath))}`, styleText$1.dim(`(${Math.round(performance.now() - t)}ms)`));
}
const BASELINE_WIDELY_AVAILABLE_TARGET = [
	"chrome111",
	"edge111",
	"firefox114",
	"safari16.4",
	"ios16.4"
];
function expandBaselineTarget(targets) {
	return targets.flatMap((t) => t === "baseline-widely-available" ? BASELINE_WIDELY_AVAILABLE_TARGET : t);
}
function resolveTarget(logger, target, color, pkg, nameLabel) {
	if (target === false) return;
	if (target == null) {
		const pkgTarget = resolvePackageTarget(pkg);
		if (pkgTarget) target = pkgTarget;
		else return;
	}
	if (typeof target === "number") throw new TypeError(`Invalid target: ${target}`);
	const targets = expandBaselineTarget(resolveComma(toArray(target)));
	if (targets.length) logger.info(nameLabel, `target${targets.length > 1 ? "s" : ""}: ${color(targets.join(", "))}`);
	return targets;
}
function resolvePackageTarget(pkg) {
	const nodeVersion = pkg?.engines?.node;
	if (!nodeVersion) return;
	const nodeMinVersion = findMinimumForRange(nodeVersion);
	if (!nodeMinVersion) return;
	const normalized = normalize$1(nodeMinVersion);
	if (normalized === "0.0.0") return;
	return `node${normalized}`;
}
//#endregion
export { parseRange as a, fsCopy as c, fsStat as d, lowestCommonAncestor as f, validateSea as i, fsExists as l, expandBaselineTarget as n, satisfies as o, stripExtname as p, resolveTarget as r, formatBytes as s, buildExe as t, fsRemove as u };
