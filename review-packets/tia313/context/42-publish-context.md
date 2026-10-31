# Actual repository publication boundary

The nested Vite source manifest is used for local development. The root workspace selects the public packages/vite-plus wrapper, whose registry manifest is regenerated and checked. Assess the following current source when reconsidering TIA313-CR-R2-02-001. Direct publication of the raw source fork is outside this repository publication contract.

### `pnpm-workspace.yaml`

Mode `100644`, blob `619852dee8d670326fb699265d21bd34ced96174`, SHA256 `8fd468217630de588f60c8da7e431cbda0ddc9d9403fc37283ba966ab06ecc84`, 1018 bytes.

Canonical source lines 1-10, excerpt SHA256 `bc0e2d68eb828b3fa8fd63ee86dfd683ae21bda85752035c50a8e8e72c6ee8fe`.

The rendered block retains the previously reviewed selection of canonical source lines 1-10, with the final blank-line LF omitted. Its decoded identity is 252 bytes, SHA256 `ca80e6a05f7ddc1e747392063944ec1bcdef4b064e5f022638ba95c523f9b65e`. The canonical source identity above and this rendered-block identity are separate; decoding preserves the rendered bytes exactly.

```text
packages:
  - packages/effect-vitest
  - packages/oxlint-effect
  - packages/oxlint-effect-linux-x64
  - packages/tsgo-effect
  - packages/tsgo-effect-linux-x64
  - packages/tsgolint-effect
  - packages/tsgolint-effect-linux-x64
  - packages/vite-plus
```

### `scripts/sync-vite-plus.mjs`

Mode `100644`, blob `40e011579c6a815476e0c05c56f66baf5f4aa829`, SHA256 `613f9fdb04c8d0f05b2a28e01602a7c24509898b6d285eaaee9e1e84a3034182`, 6748 bytes.

Current source lines 31-64, excerpt SHA256 `9cd2623d5b924c610d8481a4e7f7a4d3d5b9c51e64c473578e3c73ad995f990f`.

```text
const pkgPath = join(target, "package.json");
const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
pkg.name = "@tiara-stack/vite-plus";
pkg.version = "0.2.4";
pkg.description = "Tiara Stack fork of Vite+ wired to native Effect tsgolint tooling.";
pkg.homepage = "https://github.com/tiara-stack/native-tooling#readme";
pkg.bugs = {
  url: "https://github.com/tiara-stack/native-tooling/issues",
};
pkg.repository = {
  type: "git",
  url: "git+https://github.com/tiara-stack/native-tooling.git",
  directory: "packages/vite-plus",
};
pkg.bin = Object.fromEntries(
  Object.entries(pkg.bin ?? {}).map(([name, path]) => [name, String(path).replace(/^\.\//, "")]),
);
pkg.publishConfig = {
  access: "public",
};
pkg.scripts = {
  build: "echo 'prebuilt from packages/vite-plus-effect-fork'",
  format: "echo 'prebuilt package; no format step'",
  "format:apply": "echo 'prebuilt package; no format step'",
  lint: "echo 'prebuilt package; no lint step'",
  test: "node bin/vp --version",
};
pkg.dependencies ??= {};
pkg.dependencies["@tiara-stack/tsgo-effect"] = "^0.1.2";
pkg.dependencies["@tiara-stack/tsgolint-effect"] = "^0.1.2";
delete pkg.devDependencies;
if (pkg.napi) {
  pkg.napi.packageName = "@tiara-stack/vite-plus";
}
```

### `scripts/check-vite-plus-package.mjs`

Mode `100644`, blob `2a6c28f0778c6cc78cb5f8b49bd5155dd95eda5f`, SHA256 `93b070873fcb80f52bf9b8cc207cc63d234e17963aa1be8eb5710c0aeee65d80`, 3326 bytes.

Current source lines 1-22, excerpt SHA256 `fefbce5f7b28c365cb74a47b9f7546534ca03c9304e3035959547bcff2de3a05`.

```text
#!/usr/bin/env node
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const packageRoot = join(root, "packages", "vite-plus");
const packageJsonPath = join(packageRoot, "package.json");
const pkg = JSON.parse(await readFile(packageJsonPath, "utf8"));

assertEqual(pkg.name, "@tiara-stack/vite-plus", "package name");
assertEqual(pkg.bin?.vp, "bin/vp", "vp bin path");
assertEqual(pkg.bin?.vpr, "bin/vpr", "vpr bin path");
assertEqual(pkg.bin?.oxlint, "bin/oxlint", "oxlint bin path");
assertEqual(pkg.bin?.oxfmt, "bin/oxfmt", "oxfmt bin path");
assertEqual(pkg.dependencies?.["@tiara-stack/tsgo-effect"], "^0.1.2", "tsgo dependency");
assertEqual(pkg.dependencies?.["@tiara-stack/tsgolint-effect"], "^0.1.2", "tsgolint dependency");
assertEqual(pkg.napi?.packageName, "@tiara-stack/vite-plus", "napi package name");

for (const file of ["bin/vp", "bin/vpr", "bin/oxlint", "bin/oxfmt", "dist/bin.js"]) {
  await assertExists(join(packageRoot, file));
}
```

### `packages/vite-plus/package.json`

Mode `100644`, blob `9fa178a15a6da0edb54f0d43c8f3963939706138`, SHA256 `fcb48357973698da51202c454c3d0c1407da0db9eaee5f15564772cab8469d91`, 13225 bytes.

Current source lines 369-373, excerpt SHA256 `aca236c6ed87e97840aa01c04e6417bcab506ffca719853db88bb4436b6922c8`.

```text
    "vitest": "4.1.9",
    "@voidzero-dev/vite-plus-core": "0.2.2",
    "@tiara-stack/tsgo-effect": "^0.1.2",
    "@tiara-stack/tsgolint-effect": "^0.1.2"
  },
```

### `.github/workflows/publish.yml`

Mode `100644`, blob `292c9b6c102e8213eace3ce84e35718d297edcc0`, SHA256 `2881f122f4c9e2e18d880957657683f4947e87a481e432ba345a800e36519e1b`, 3950 bytes.

Current source lines 111-117, excerpt SHA256 `aaed423ba303ced3f8aab6bc06bcc8c1bd53125f4598342c3e04e4dfae710ab5`.

```text
      - name: Dry-run staged publish
        if: ${{ github.event_name == 'workflow_dispatch' && inputs['dry-run'] }}
        run: vp pm stage publish -r --filter "${{ inputs['package-filter'] }}" --access public --provenance --tag "${{ inputs.tag }}" --dry-run -- --no-git-checks

      - name: Stage packages for npm trusted publishing
        if: ${{ github.event_name != 'workflow_dispatch' || !inputs['dry-run'] }}
        run: vp pm stage publish -r --filter "${{ inputs['package-filter'] || './packages/*' }}" --access public --provenance --tag "${{ inputs.tag || 'latest' }}" -- --no-git-checks
```
