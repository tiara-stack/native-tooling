import { createRequire } from "node:module";
import { formatWithOptions, inspect } from "node:util";
import { isatty } from "node:tty";
//#region ../../../../../build-virtual-store/obug@3.0.0/node_modules/obug/dist/core.js
/**
* Coerce `value`.
*/
function coerce(value) {
	if (value instanceof Error) return value.stack || value.message;
	return value;
}
/**
* Selects a color for a debug namespace
* @return An ANSI color code for the given namespace
*/
function selectColor(colors, namespace) {
	let hash = 0;
	for (let i = 0; i < namespace.length; i++) {
		hash = (hash << 5) - hash + namespace.charCodeAt(i);
		hash |= 0;
	}
	return colors[Math.abs(hash) % colors.length];
}
/**
* Checks if the given string matches a namespace template, honoring
* asterisks as wildcards.
*/
function matchesTemplate(search, template) {
	let searchIndex = 0;
	let templateIndex = 0;
	let starIndex = -1;
	let matchIndex = 0;
	while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
		if (template[templateIndex] === "*") {
			starIndex = templateIndex;
			matchIndex = searchIndex;
			templateIndex++;
		} else {
			searchIndex++;
			templateIndex++;
		}
	} else if (starIndex !== -1) {
		templateIndex = starIndex + 1;
		matchIndex++;
		searchIndex = matchIndex;
	} else return false;
	while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
	return templateIndex === template.length;
}
function humanize(value) {
	if (value >= 1e3) return `${(value / 1e3).toFixed(1)}s`;
	return `${value}ms`;
}
let globalNamespaces = "";
function createDebug$1(namespace, options) {
	let prevTime;
	let enableOverride;
	let namespacesCache;
	let enabledCache;
	const debug = ((...args) => {
		if (!debug.enabled) return;
		const curr = Date.now();
		const diff = curr - (prevTime || curr);
		prevTime = curr;
		args[0] = coerce(args[0]);
		if (typeof args[0] !== "string") args.unshift("%O");
		let index = 0;
		args[0] = args[0].replace(/%([a-z%])/gi, (match, format) => {
			if (match === "%%") return "%";
			index++;
			const formatter = options.formatters[format];
			if (typeof formatter === "function") {
				const value = args[index];
				match = formatter.call(debug, value);
				args.splice(index, 1);
				index--;
			}
			return match;
		});
		options.formatArgs.call(debug, diff, args);
		debug.log(...args);
	});
	debug.extend = function(namespace, delimiter = ":") {
		return createDebug$1(this.namespace + delimiter + namespace, {
			useColors: this.useColors,
			color: this.color,
			formatArgs: this.formatArgs,
			formatters: this.formatters,
			inspectOpts: this.inspectOpts,
			log: this.log,
			humanize: this.humanize
		});
	};
	Object.assign(debug, options);
	debug.namespace = namespace;
	Object.defineProperty(debug, "enabled", {
		enumerable: true,
		configurable: false,
		get: () => {
			if (enableOverride != null) return enableOverride;
			if (namespacesCache !== globalNamespaces) {
				namespacesCache = globalNamespaces;
				enabledCache = enabled(namespace);
			}
			return enabledCache;
		},
		set: (v) => {
			enableOverride = v;
		}
	});
	return debug;
}
let names = [];
let skips = [];
function enable(namespaces) {
	globalNamespaces = namespaces;
	names = [];
	skips = [];
	const split = globalNamespaces.trim().replace(/\s+/g, ",").split(",").filter(Boolean);
	for (const ns of split) if (ns[0] === "-") skips.push(ns.slice(1));
	else names.push(ns);
}
/**
* Returns true if the given mode name is enabled, false otherwise.
*/
function enabled(name) {
	for (const skip of skips) if (matchesTemplate(name, skip)) return false;
	for (const ns of names) if (matchesTemplate(name, ns)) return true;
	return false;
}
//#endregion
//#region ../../../../../build-virtual-store/obug@3.0.0/node_modules/obug/dist/ansi.js
let env = {};
try {
	process.env.DEBUG;
	env = process.env;
} catch (_unused) {}
const colors = process.stderr.getColorDepth && process.stderr.getColorDepth(env) > 2 ? [
	20,
	21,
	26,
	27,
	32,
	33,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	56,
	57,
	62,
	63,
	68,
	69,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	92,
	93,
	98,
	99,
	112,
	113,
	128,
	129,
	134,
	135,
	148,
	149,
	160,
	161,
	162,
	163,
	164,
	165,
	166,
	167,
	168,
	169,
	170,
	171,
	172,
	173,
	178,
	179,
	184,
	185,
	196,
	197,
	198,
	199,
	200,
	201,
	202,
	203,
	204,
	205,
	206,
	207,
	208,
	209,
	214,
	215,
	220,
	221
] : [
	6,
	2,
	3,
	4,
	5,
	1
];
const inspectOpts = Object.keys(env).filter((key) => /^debug_/i.test(key)).reduce((obj, key) => {
	const prop = key.slice(6).toLowerCase().replace(/_([a-z])/g, (_, k) => k.toUpperCase());
	let value = env[key];
	const lowerCase = typeof value === "string" && value.toLowerCase();
	if (value === "null") value = null;
	else if (lowerCase === "yes" || lowerCase === "on" || lowerCase === "true" || lowerCase === "enabled") value = true;
	else if (lowerCase === "no" || lowerCase === "off" || lowerCase === "false" || lowerCase === "disabled") value = false;
	else value = Number(value);
	obj[prop] = value;
	return obj;
}, Object.create(null));
/**
* Is stdout a TTY? Colored output is enabled when `true`.
*/
function useColors() {
	return "colors" in inspectOpts ? Boolean(inspectOpts.colors) : isatty(process.stderr.fd);
}
function getDate() {
	if (inspectOpts.hideDate) return "";
	return `${(/* @__PURE__ */ new Date()).toISOString()} `;
}
/**
* Adds ANSI color escape codes if enabled.
*/
function formatArgs(diff, args) {
	const { namespace: name, useColors } = this;
	if (useColors) {
		const c = this.color;
		const colorCode = `\u{1B}[3${c < 8 ? c : `8;5;${c}`}`;
		const prefix = `  ${colorCode};1m${name} \u{1B}[0m`;
		args[0] = prefix + args[0].split("\n").join(`\n${prefix}`);
		args.push(`${colorCode}m+${this.humanize(diff)}\u{1B}[0m`);
	} else args[0] = `${getDate()}${name} ${args[0]}`;
}
function log(...args) {
	process.stderr.write(`${formatWithOptions(this.inspectOpts, ...args)}\n`);
}
const defaultOptions = {
	useColors: useColors(),
	formatArgs,
	formatters: {
		/**
		* Map %o to `util.inspect()`, all on a single line.
		*/
		o(v) {
			this.inspectOpts.colors = this.useColors;
			return inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
		},
		/**
		* Map %O to `util.inspect()`, allowing multiple lines if needed.
		*/
		O(v) {
			this.inspectOpts.colors = this.useColors;
			return inspect(v, this.inspectOpts);
		}
	},
	inspectOpts,
	log,
	humanize
};
function createDebug(namespace, options) {
	var _ref;
	const color = (_ref = options && options.color) !== null && _ref !== void 0 ? _ref : selectColor(colors, namespace);
	return createDebug$1(namespace, Object.assign(defaultOptions, { color }, options));
}
enable(env.DEBUG || "");
//#endregion
//#region ../../../../../build-virtual-store/rolldown-plugin-dts@0.28.6_@typescript+native-preview@7.0.0-dev.20260605.1_oxc-resolver_d7b1f0f9db662f38e672c8f14bf9ba00/node_modules/rolldown-plugin-dts/dist/require-BbBF8Ii0.mjs
const require = createRequire(import.meta.url);
const debug = createDebug("rolldown-plugin-dts:utils");
function tryRequire(moduleName) {
	try {
		return require(moduleName);
	} catch {}
}
function tryResolve(id) {
	try {
		return require.resolve(id);
	} catch {}
}
let _ts;
function isTS70Installed() {
	return tryRequire("typescript/package.json")?.version.slice(0, 3) === "7.0";
}
function requireTSApi(mode = "tsc", message = ".") {
	if (_ts) return _ts;
	if (isTS70Installed()) throw new Error(`TypeScript 7.0 is not supported when using ${mode}. Please use TypeScript 6.0 or below${message}`);
	let ts;
	try {
		ts = require("typescript");
	} catch (cause) {
		throw new Error(`TypeScript is not installed. Please install the \`typescript\` package (v7.0 is not yet supported)${message}`, { cause });
	}
	if (debug.enabled) debug(`Loaded TypeScript version ${ts.version} from ${require.resolve("typescript")}`);
	return _ts = ts;
}
//#endregion
export { createDebug as a, tryResolve as i, require as n, requireTSApi as r, isTS70Installed as t };
