import { B as runCommandSilently, M as multiselect, P as select, R as isCancel, j as log, k as confirm, l as cancelAndExit, w as getSpinner } from "./tsconfig-fvpxgUq2.js";
import { a as writeJsonFile, c as parse, i as readJsonFile, n as editJsonFile, o as applyEdits, s as modify, t as detectFormattingOptions } from "./json-DiRs8ceZ.js";
import { G as detectConfigs, J as warnMigration, U as PRETTIER_CONFIG_FILES, Y as displayRelative, z as rewriteToolLintStagedConfigFiles } from "./agent-D7O7mSeO.js";
import path from "node:path";
import { rewritePrettier } from "../binding/index.js";
import fs from "node:fs";
import { styleText } from "node:util";
import fsPromises from "node:fs/promises";
//#region src/migration/migrator/prettier.ts
function detectPrettierProject(projectPath, packages) {
	const packageJsonPath = path.join(projectPath, "package.json");
	if (!fs.existsSync(packageJsonPath)) return { hasDependency: false };
	const pkg = readJsonFile(packageJsonPath);
	let hasDependency = !!(pkg.devDependencies?.prettier || pkg.dependencies?.prettier);
	const configFile = detectConfigs(projectPath).prettierConfig;
	if (!hasDependency && packages) for (const wp of packages) {
		const pkgJsonPath = path.join(projectPath, wp.path, "package.json");
		if (!fs.existsSync(pkgJsonPath)) continue;
		const wpPkg = readJsonFile(pkgJsonPath);
		if (wpPkg.devDependencies?.prettier || wpPkg.dependencies?.prettier) {
			hasDependency = true;
			break;
		}
	}
	return {
		hasDependency,
		configFile
	};
}
/**
* Run `vp fmt --migrate=prettier` step with graceful error handling.
* Returns true on success, false on failure.
*/
async function runPrettierMigrateStep(vpBin, cwd, spinner, failMessage, manualHint) {
	try {
		const result = await runCommandSilently({
			command: vpBin,
			args: ["fmt", "--migrate=prettier"],
			cwd,
			envs: process.env
		});
		if (result.exitCode !== 0) {
			spinner.stop(failMessage);
			const stderr = result.stderr.toString().trim();
			if (stderr) log.warn(`⚠ ${stderr}`);
			log.info(manualHint);
			return false;
		}
		return true;
	} catch {
		spinner.stop(failMessage);
		log.info(manualHint);
		return false;
	}
}
async function migratePrettierToOxfmt(projectPath, interactive, prettierConfigFile, packages, options) {
	const vpBin = process.env.VP_CLI_BIN ?? "vp";
	const spinner = options?.silent ? {
		start: () => {},
		stop: () => {},
		pause: () => {},
		resume: () => {},
		cancel: () => {},
		error: () => {},
		clear: () => {},
		message: () => {},
		isCancelled: false
	} : getSpinner(interactive);
	if (prettierConfigFile) {
		let tempPrettierConfig;
		if (prettierConfigFile === "package.json#prettier") {
			const pkg = readJsonFile(path.join(projectPath, "package.json"));
			if (pkg.prettier) {
				tempPrettierConfig = path.join(projectPath, ".prettierrc.json");
				fs.writeFileSync(tempPrettierConfig, JSON.stringify(pkg.prettier, null, 2));
			} else return true;
		}
		try {
			spinner.start("Migrating Prettier config to Oxfmt...");
			if (!await runPrettierMigrateStep(vpBin, projectPath, spinner, "Prettier migration failed", "You can run `vp fmt --migrate=prettier` manually later")) return false;
			spinner.stop("Prettier config migrated to .oxfmtrc.json");
		} finally {
			if (tempPrettierConfig) try {
				fs.unlinkSync(tempPrettierConfig);
			} catch {}
		}
	}
	if (options?.report) options.report.prettierMigrated = true;
	deletePrettierConfigFiles(projectPath, options?.report, options?.silent);
	rewritePrettierPackageJson(path.join(projectPath, "package.json"));
	if (packages) for (const pkg of packages) rewritePrettierPackageJson(path.join(projectPath, pkg.path, "package.json"));
	rewritePrettierLintStagedConfigFiles(projectPath, options?.report);
	const prettierIgnorePath = path.join(projectPath, ".prettierignore");
	if (fs.existsSync(prettierIgnorePath)) warnMigration(`${displayRelative(prettierIgnorePath)} found — Oxfmt supports .prettierignore, but using the \`ignorePatterns\` option is recommended.`, options?.report);
	return true;
}
function deletePrettierConfigFiles(basePath, report, silent = false) {
	const configs = detectConfigs(basePath);
	if (configs.prettierConfig && configs.prettierConfig !== "package.json#prettier") {
		const configPath = path.join(basePath, configs.prettierConfig);
		if (fs.existsSync(configPath)) {
			fs.unlinkSync(configPath);
			if (report) report.removedConfigCount++;
			if (!silent) log.success(`✔ Removed ${displayRelative(configPath)}`);
		}
	}
	for (const file of PRETTIER_CONFIG_FILES) {
		if (file === configs.prettierConfig) continue;
		const configPath = path.join(basePath, file);
		if (fs.existsSync(configPath)) {
			fs.unlinkSync(configPath);
			if (report) report.removedConfigCount++;
			if (!silent) log.success(`✔ Removed ${displayRelative(configPath)}`);
		}
	}
	editJsonFile(path.join(basePath, "package.json"), (pkg) => {
		if (pkg.prettier) {
			delete pkg.prettier;
			return pkg;
		}
	});
}
function rewritePrettierPackageJson(packageJsonPath) {
	if (!fs.existsSync(packageJsonPath)) return;
	editJsonFile(packageJsonPath, (pkg) => {
		let changed = false;
		if (pkg.devDependencies) {
			for (const dep of Object.keys(pkg.devDependencies)) if (dep === "prettier" || dep.startsWith("prettier-plugin-")) {
				delete pkg.devDependencies[dep];
				changed = true;
			}
		}
		if (pkg.dependencies) {
			for (const dep of Object.keys(pkg.dependencies)) if (dep === "prettier" || dep.startsWith("prettier-plugin-")) {
				delete pkg.dependencies[dep];
				changed = true;
			}
		}
		if (pkg.scripts) {
			const updated = rewritePrettier(JSON.stringify(pkg.scripts));
			if (updated) {
				pkg.scripts = JSON.parse(updated);
				changed = true;
			}
		}
		if (pkg["lint-staged"]) {
			const updated = rewritePrettier(JSON.stringify(pkg["lint-staged"]));
			if (updated) {
				pkg["lint-staged"] = JSON.parse(updated);
				changed = true;
			}
		}
		return changed ? pkg : void 0;
	});
}
function rewritePrettierLintStagedConfigFiles(projectPath, report) {
	rewriteToolLintStagedConfigFiles(projectPath, rewritePrettier, "prettier", report);
}
function warnPackageLevelPrettier() {
	log.warn("Prettier detected in workspace packages but no root config found. Package-level Prettier must be migrated manually.");
}
async function confirmPrettierMigration(interactive) {
	if (interactive) {
		const confirmed = await confirm({
			message: "Migrate Prettier to Oxfmt?\n  " + styleText("gray", "Oxfmt is Vite+'s built-in formatter that replaces Prettier with faster performance. Your configuration will be converted automatically."),
			initialValue: true
		});
		if (isCancel(confirmed)) cancelAndExit();
		return confirmed;
	}
	log.info("Prettier configuration detected. Auto-migrating to Oxfmt...");
	return true;
}
async function promptPrettierMigration(projectPath, interactive, packages) {
	const prettierProject = detectPrettierProject(projectPath, packages);
	if (!prettierProject.hasDependency) return false;
	if (!prettierProject.configFile) {
		warnPackageLevelPrettier();
		return false;
	}
	if (!await confirmPrettierMigration(interactive)) return false;
	if (!await migratePrettierToOxfmt(projectPath, interactive, prettierProject.configFile, packages)) cancelAndExit("Prettier migration failed.", 1);
	return true;
}
//#endregion
//#region src/migration/migrator/framework-shim.ts
const FRAMEWORK_SHIMS = {
	vue: [
		"declare module '*.vue' {",
		"  import type { DefineComponent } from 'vue';",
		"  const component: DefineComponent<{}, {}, unknown>;",
		"  export default component;",
		"}"
	].join("\n"),
	astro: "/// <reference types=\"astro/client\" />"
};
function detectFramework(projectPath) {
	const packageJsonPath = path.join(projectPath, "package.json");
	if (!fs.existsSync(packageJsonPath)) return [];
	const pkg = readJsonFile(packageJsonPath);
	const allDeps = {
		...pkg.dependencies,
		...pkg.devDependencies
	};
	return ["vue", "astro"].filter((framework) => !!allDeps[framework]);
}
function getEnvDtsPath(projectPath) {
	const srcEnvDts = path.join(projectPath, "src", "env.d.ts");
	const rootEnvDts = path.join(projectPath, "env.d.ts");
	for (const candidate of [srcEnvDts, rootEnvDts]) if (fs.existsSync(candidate)) return candidate;
	return fs.existsSync(path.join(projectPath, "src")) ? srcEnvDts : rootEnvDts;
}
function hasFrameworkShim(projectPath, framework) {
	const dirsToScan = [projectPath, path.join(projectPath, "src")];
	for (const dir of dirsToScan) {
		if (!fs.existsSync(dir)) continue;
		let entries;
		try {
			entries = fs.readdirSync(dir);
		} catch {
			continue;
		}
		for (const entry of entries) {
			if (!entry.endsWith(".d.ts")) continue;
			const content = fs.readFileSync(path.join(dir, entry), "utf-8");
			if (framework === "astro") {
				if (content.includes("astro/client")) return true;
			} else if (content.includes(`'*.${framework}'`) || content.includes(`"*.${framework}"`)) return true;
		}
	}
	return false;
}
function addFrameworkShim(projectPath, framework, report) {
	const envDtsPath = getEnvDtsPath(projectPath);
	const shim = FRAMEWORK_SHIMS[framework];
	if (fs.existsSync(envDtsPath)) {
		const existing = fs.readFileSync(envDtsPath, "utf-8");
		fs.writeFileSync(envDtsPath, `${existing.trimEnd()}\n\n${shim}\n`, "utf-8");
	} else {
		fs.mkdirSync(path.dirname(envDtsPath), { recursive: true });
		fs.writeFileSync(envDtsPath, `${shim}\n`, "utf-8");
	}
	if (report) report.frameworkShimAdded = true;
}
const EDITORS = [{
	id: "vscode",
	label: "VSCode",
	targetDir: ".vscode",
	files: {
		"settings.json": {
			"editor.defaultFormatter": "oxc.oxc-vscode",
			"[javascript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
			"[javascriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
			"[typescript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
			"[typescriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
			"oxc.fmt.configPath": "./vite.config.ts",
			"editor.formatOnSave": true,
			"editor.formatOnSaveMode": "file",
			"editor.codeActionsOnSave": { "source.fixAll.oxc": "explicit" }
		},
		"extensions.json": { recommendations: ["VoidZero.vite-plus-extension-pack"] }
	}
}, {
	id: "zed",
	label: "Zed",
	targetDir: ".zed",
	files: { "settings.json": {
		lsp: {
			oxlint: { initialization_options: { settings: {
				run: "onType",
				fixKind: "safe_fix",
				typeAware: true,
				unusedDisableDirectives: "deny"
			} } },
			oxfmt: { initialization_options: { settings: {
				"fmt.configPath": "./vite.config.ts",
				run: "onSave"
			} } }
		},
		languages: {
			CSS: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			GraphQL: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			Handlebars: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			HTML: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			JavaScript: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }],
				code_action: "source.fixAll.oxc"
			},
			JSX: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			JSON: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			JSON5: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			JSONC: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			Less: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			Markdown: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			MDX: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			SCSS: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			TypeScript: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			TSX: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			"Vue.js": {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			},
			YAML: {
				format_on_save: "on",
				prettier: { allowed: false },
				formatter: [{ language_server: { name: "oxfmt" } }]
			}
		}
	} }
}];
async function selectEditor({ interactive, editor, onCancel }) {
	if (editor === false) return;
	if (interactive && !editor) {
		const editorOptions = EDITORS.map((option) => ({
			label: option.label,
			value: option.id,
			hint: option.targetDir
		}));
		const otherOption = {
			label: "Other",
			value: null,
			hint: "Skip writing editor configs"
		};
		const selectedEditor = await select({
			message: "Which editor are you using?\n  " + styleText("gray", "Writes editor config files to enable recommended extensions and Oxlint/Oxfmt integrations."),
			options: [...editorOptions, otherOption],
			initialValue: "vscode"
		});
		if (isCancel(selectedEditor)) {
			onCancel();
			return;
		}
		if (selectedEditor === null) return;
		return resolveEditorId(selectedEditor);
	}
	if (editor) return resolveEditorId(editor);
}
async function selectEditors({ interactive, editor, onCancel }) {
	if (editor === false) return;
	if (interactive && !editor) {
		const selectedEditors = await multiselect({
			message: "Which editors are you using?\n  " + styleText("gray", "Writes editor config files to enable recommended extensions and Oxlint/Oxfmt integrations."),
			options: EDITORS.map((option) => ({
				label: option.label,
				value: option.id,
				hint: option.targetDir
			})),
			initialValues: ["vscode"],
			required: false
		});
		if (isCancel(selectedEditors)) {
			onCancel();
			return;
		}
		return selectedEditors.length === 0 ? void 0 : resolveEditorIds(selectedEditors);
	}
	if (editor) {
		const editorId = resolveEditorId(editor);
		return editorId ? [editorId] : void 0;
	}
}
function detectExistingEditors(projectRoot) {
	const editors = [];
	for (const option of EDITORS) for (const fileName of Object.keys(option.files)) {
		const filePath = path.join(projectRoot, option.targetDir, fileName);
		if (fs.existsSync(filePath)) {
			editors.push(option.id);
			break;
		}
	}
	return editors.length === 0 ? void 0 : editors;
}
/**
* Detect editor config files that would conflict (already exist).
* Read-only — does not write or modify any files.
*/
function detectEditorConflicts({ projectRoot, editorId }) {
	if (!editorId) return [];
	const editorConfig = EDITORS.find((e) => e.id === editorId);
	if (!editorConfig) return [];
	const conflicts = [];
	for (const fileName of Object.keys(editorConfig.files)) {
		const filePath = path.join(projectRoot, editorConfig.targetDir, fileName);
		if (fs.existsSync(filePath)) conflicts.push({
			fileName,
			displayPath: `${editorConfig.targetDir}/${fileName}`
		});
	}
	return conflicts;
}
async function writeEditorConfigs({ projectRoot, editorId, interactive, conflictDecisions, silent = false, extraVsCodeSettings }) {
	const editorIds = normalizeEditorSelection(editorId);
	if (editorIds.length === 0) return;
	for (const currentEditorId of editorIds) await writeEditorConfig({
		projectRoot,
		editorId: currentEditorId,
		interactive,
		conflictDecisions,
		silent,
		extraVsCodeSettings
	});
}
async function writeEditorConfig({ projectRoot, editorId, interactive, conflictDecisions, silent, extraVsCodeSettings }) {
	const editorConfig = EDITORS.find((e) => e.id === editorId);
	if (!editorConfig) return;
	const targetDir = path.join(projectRoot, editorConfig.targetDir);
	await fsPromises.mkdir(targetDir, { recursive: true });
	for (const [fileName, baseIncoming] of Object.entries(editorConfig.files)) {
		const incoming = editorId === "vscode" && fileName === "settings.json" && extraVsCodeSettings ? {
			...extraVsCodeSettings,
			...baseIncoming
		} : baseIncoming;
		const filePath = path.join(targetDir, fileName);
		if (fs.existsSync(filePath)) {
			const displayPath = `${editorConfig.targetDir}/${fileName}`;
			let conflictAction;
			const preResolved = conflictDecisions?.get(displayPath) ?? conflictDecisions?.get(fileName);
			if (preResolved) conflictAction = preResolved;
			else if (interactive) {
				const action = await select({
					message: `${displayPath} already exists.\n  ` + styleText("gray", `Vite+ adds ${editorConfig.label} settings for the built-in linter and formatter. Merge adds new keys without overwriting existing ones.`),
					options: [{
						label: "Merge",
						value: "merge",
						hint: "Merge new settings into existing file"
					}, {
						label: "Skip",
						value: "skip",
						hint: "Leave existing file unchanged"
					}],
					initialValue: "skip"
				});
				conflictAction = isCancel(action) || action === "skip" ? "skip" : "merge";
			} else conflictAction = "merge";
			if (conflictAction === "merge") mergeAndWriteEditorConfig(filePath, incoming, fileName, displayPath, silent);
			else if (!silent) log.info(`Skipped writing ${displayPath}`);
			continue;
		}
		writeJsonFile(filePath, incoming);
		if (!silent) log.success(`Wrote editor config to ${editorConfig.targetDir}/${fileName}`);
	}
}
function normalizeEditorSelection(editorId) {
	if (!editorId) return [];
	return [...new Set(Array.isArray(editorId) ? editorId : [editorId])];
}
/**
* Merge incoming settings into an existing editor JSON/JSONC file by patching the
* original text with `jsonc-parser` instead of re-serializing a merged object.
* This preserves comments, key order, trailing commas, and untouched formatting.
* Existing values always win; only missing keys/branches are inserted.
*/
function mergeAndWriteEditorConfig(filePath, incoming, fileName, displayPath, silent = false) {
	const originalText = fs.readFileSync(filePath, "utf-8");
	const existing = parse(originalText);
	if (!isPlainObject(existing)) throw new Error(`Cannot merge editor config: ${displayPath} is not a JSON object`);
	const formattingOptions = detectFormattingOptions(originalText);
	const newText = fileName === "extensions.json" ? mergeExtensionsText(originalText, existing, incoming, formattingOptions) : mergeSettingsText(originalText, existing, incoming, formattingOptions);
	if (newText === originalText) {
		if (!silent) log.info(`No changes needed for ${displayPath}`);
		return;
	}
	fs.writeFileSync(filePath, newText, "utf-8");
	if (!silent) log.success(`Merged editor config into ${displayPath}`);
}
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Apply a single `jsonc-parser` modification to `text` and return the patched text. */
function applyJsoncEdit(text, path, value, options) {
	return applyEdits(text, modify(text, path, value, options));
}
/**
* Deep-merge missing keys from `incoming` into the existing text. Inserts a whole
* branch when it is absent, and recurses only when both sides are non-array objects
* so comments inside existing branches are preserved.
*/
function mergeSettingsText(text, existing, incoming, formattingOptions) {
	let currentText = text;
	const insertMissing = (existingNode, incomingNode, basePath) => {
		for (const [key, value] of Object.entries(incomingNode)) {
			const fullPath = [...basePath, key];
			if (!(key in existingNode)) currentText = applyJsoncEdit(currentText, fullPath, value, { formattingOptions });
			else if (isPlainObject(existingNode[key]) && isPlainObject(value)) insertMissing(existingNode[key], value, fullPath);
		}
	};
	insertMissing(existing, incoming, []);
	return currentText;
}
/**
* For `extensions.json`, append missing recommendations without rebuilding the array,
* so comments inside the array survive. Existing entries always win.
*/
function mergeExtensionsText(text, existing, incoming, formattingOptions) {
	const incomingRecs = Array.isArray(incoming["recommendations"]) ? incoming["recommendations"] : [];
	const existingValue = existing["recommendations"];
	if (!("recommendations" in existing)) return applyJsoncEdit(text, ["recommendations"], incomingRecs, { formattingOptions });
	if (!Array.isArray(existingValue)) return text;
	const existingRecs = new Set(existingValue);
	let currentText = text;
	let nextIndex = existingValue.length;
	for (const rec of incomingRecs) {
		if (existingRecs.has(rec)) continue;
		currentText = applyJsoncEdit(currentText, ["recommendations", nextIndex], rec, {
			formattingOptions,
			isArrayInsertion: true
		});
		nextIndex++;
	}
	return currentText;
}
function resolveEditorId(editor) {
	const normalized = editor.trim().toLowerCase();
	return EDITORS.find((option) => option.id === normalized || option.label.toLowerCase() === normalized)?.id;
}
function resolveEditorIds(editors) {
	const editorIds = editors.flatMap((editor) => {
		const editorId = resolveEditorId(editor);
		return editorId ? [editorId] : [];
	});
	const uniqueEditorIds = [...new Set(editorIds)];
	return uniqueEditorIds.length === 0 ? void 0 : uniqueEditorIds;
}
//#endregion
export { writeEditorConfigs as a, hasFrameworkShim as c, migratePrettierToOxfmt as d, promptPrettierMigration as f, selectEditors as i, confirmPrettierMigration as l, detectExistingEditors as n, addFrameworkShim as o, warnPackageLevelPrettier as p, selectEditor as r, detectFramework as s, detectEditorConflicts as t, detectPrettierProject as u };
