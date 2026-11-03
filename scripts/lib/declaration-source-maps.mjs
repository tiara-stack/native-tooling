import { access, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** Remove dangling declaration-map comments left when the DTS plugin omits maps.
 * @param {string} directory
 */
export async function removeMissingDeclarationMapReferences(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.d\.[cm]?ts$/.test(entry.name)) continue;
    const path = join(directory, entry.name);
    const original = await readFile(path, "utf8");
    let text = original;
    for (const match of original.matchAll(
      /^[\t ]*\/\/[#@][\t ]*sourceMappingURL=(\S+)[\t ]*(?:\r?\n|$)/gm,
    )) {
      const map = new URL(match[1], pathToFileURL(path));
      if (map.protocol !== "file:") continue;
      try {
        await access(map);
      } catch (error) {
        if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
        text = text.replace(match[0], "");
      }
    }
    if (text !== original) await writeFile(path, text);
  }
}
