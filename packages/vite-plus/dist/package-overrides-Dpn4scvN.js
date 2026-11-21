//#region src/utils/package-overrides.ts
function extractOverrideTargetName(key) {
	let target = key.trim();
	for (let delimiter = target.search(/[^ |@]>/); delimiter !== -1; delimiter = target.search(/[^ |@]>/)) target = target.slice(delimiter + 2).trim();
	if (!target) return target;
	if (target.includes("/")) {
		const segments = target.split("/");
		const last = segments[segments.length - 1];
		const scope = segments[segments.length - 2];
		target = scope?.startsWith("@") ? `${scope}/${last}` : last;
	}
	const nameStart = target.startsWith("@") ? target.indexOf("/") + 1 : 0;
	const versionAt = target.indexOf("@", nameStart);
	return versionAt > 0 ? target.slice(0, versionAt) : target;
}
//#endregion
export { extractOverrideTargetName as t };
