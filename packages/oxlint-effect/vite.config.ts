import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

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
      tsgo: { enabled: false },
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
