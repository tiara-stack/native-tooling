import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";
import { removeMissingDeclarationMapReferences } from "../../scripts/lib/declaration-source-maps.mjs";

export default defineConfig({
  pack: {
    entry: {
      index: fileURLToPath(new URL("src/index.ts", import.meta.url)),
    },
    sourcemap: true,
    deps: {
      onlyBundle: false,
    },
    dts: {
      generator: "tsc",
      sourcemap: false,
    },
    hooks: {
      "build:done": () =>
        removeMissingDeclarationMapReferences(fileURLToPath(new URL("dist", import.meta.url))),
    },
  },
  lint: {
    ignorePatterns: ["dist", "vendor"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
