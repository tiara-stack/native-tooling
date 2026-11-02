# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/tsgolint-effect-fork/.github/workflows/dprint.yml`

Mode `100644`, blob `c9a9987f91e6c7479a73207d2a73521239614d6e`, SHA256 `700d93b9a7181e3c3590ac3491dfaa4072edbd87a3c4b9d7e864a600407bed0a`, 700 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Save dprint plugin cache

permissions: {}

on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - "dprint.json"
      - ".github/workflows/dprint.yml"

jobs:
  cache:
    runs-on: ubuntu-latest
    steps:
      - uses: taiki-e/checkout-action@7d1e50e93dc4fb3bba58f85018fadf77898aee8b # v1.4.2

      - uses: taiki-e/install-action@76c2e6406e52637deed7160d77bded76bd83e06e # v2.87.14
        with:
          tool: dprint

      - run: dprint check

      - name: Save dprint plugin cache
        uses: actions/cache/save@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          key: dprint-${{ hashFiles('dprint.json') }}
          path: ~/.cache/dprint
```

### `native/tsgolint-effect-fork/.github/workflows/release.yml`

Mode `100644`, blob `7f2afa5ebd5cfa37287e6c91aea6a65ac24a5c84`, SHA256 `e9eb822f8a00f791207e7bf3db57e43ea0845f7f04973eae8eca5fd34dd36986`, 2373 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Release

permissions: {}

on:
  workflow_dispatch:
    inputs:
      version:
        type: string
        required: true
        description: version without leading `v`

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        goos: [windows, linux, darwin]
        goarch: [amd64, arm64]
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0 # required for git am --3way to work properly
          submodules: true
          persist-credentials: false

      - uses: ./.github/actions/setup

      - name: Build binaries
        env:
          GOOS: ${{ matrix.goos }}
          GOARCH: ${{ matrix.goarch }}
        run: just build

      - name: Upload artifacts
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: tsgolint-${{ matrix.goos }}-${{ matrix.goarch }}
          path: tsgolint

  publish:
    runs-on: ubuntu-latest
    needs: build
    permissions:
      contents: write # for softprops/action-gh-release
      id-token: write # for `pnpm publish --provenance`
    steps:
      - name: Checkout repo
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - uses: oxc-project/setup-node@f46a72f95efdc55273fcd042d61c84e723b2892c # v1.4.1

      - name: Download artifacts
        uses: actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1
        with:
          pattern: tsgolint-*
          path: build

      - name: chmod +x
        run: find build -type f -name tsgolint -exec chmod +x {} \;

      - name: Generate npm packages
        env:
          TSGOLINT_VERSION: ${{ inputs.version }}
        run: node ./tools/gen-npm-packages.mjs

      - name: Publish
        run: |
          for package in npm/*; do
            pushd "$package"
            pnpm publish --no-git-checks --provenance --access public
            popd
          done

      - name: Create GitHub Release
        uses: softprops/action-gh-release@efb35369e0ad2afab669f228072c1b0d510eae64 # v3.0.3
        with:
          draft: false
          name: v${{ inputs.version }}
          tag_name: v${{ inputs.version }}
          target_commitish: ${{ github.sha }}
          generate_release_notes: true
```

### `native/tsgolint-effect-fork/.github/workflows/update-typescript-go.yml`

Mode `100644`, blob `3f28e804637c359c5baab103fa5ebd21b008b628`, SHA256 `48b5d762c9d3794caaa637267a6ad3934f6b9c1e7ca230048e8f2cdeea437204`, 1847 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Update typescript-go

permissions: {}

on:
  push:
    branches:
      - renovate/typescript-go-*
    paths:
      - typescript-go

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/create-github-app-token@bcd2ba49218906704ab6c1aa796996da409d3eb1 # v3.2.0
        id: app-token
        with:
          client-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Checkout repo
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0 # required for git am --3way to work properly
          submodules: true
          persist-credentials: true
          # Using secrets.GITHUB_TOKEN isn't allowed to trigger downstream
          # workflow runs, so we're using a Personal Access Token (PAT) instead
          token: ${{ steps.app-token.outputs.token }}

      - name: Install Go
        uses: actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e # v7.0.0
        with:
          go-version-file: go.mod

      - name: Set committer identity
        run: |
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git config --global user.name "github-actions"

      - shell: bash
        run: |
          mkdir -p internal/collections
          find ./typescript-go/internal/collections -type f ! -name '*_test.go' -exec cp {} internal/collections/ \;

      - run: ./tools/update-typescript-go-shims.sh

      - name: Check for changes
        id: check_changes
        run: |
          if ! git diff --staged --quiet; then
            echo 'has_changes=true' >> "$GITHUB_OUTPUT"
          fi

      - name: Push changes
        if: steps.check_changes.outputs.has_changes == 'true'
        run: |
          git commit -m "update typescript-go"
          git push
```

### `native/tsgolint-effect-fork/.gitignore`

Mode `100644`, blob `f737bf7cbbce36bbdc79c7ff61848b27c0814e6b`, SHA256 `662701471c7684e4dd6b09a3f41d0df8d66145a3c463fdbf232561cf9df37f4a`, 80 bytes.

Dependency role: Read ignore patterns for generated/platform artifacts and local build outputs; checked against package contents/build generation boundary.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

The rendered block retains the previously reviewed file rendering, with the canonical file's final blank-line LF omitted. Its decoded identity is 79 bytes, SHA256 `ffaf3ce55af48d7fbf10fbff723a7d3f37e873765989ebb1879c26910682a65d`. The canonical source identity above and this rendered-block identity are separate; decoding preserves the rendered bytes exactly.

```text
/tsgolint
internal/collections/
e2e/node_modules/
node_modules/

*.pprof
*.out
```

### `native/tsgolint-effect-fork/benchmarks/eslint.config.mjs`

Mode `100644`, blob `91f5933c6e8380a698b22834ca3721e581e885fb`, SHA256 `e1c242b4c6ea77a57712f8afe393374a22f5d9b8374158d676352b643c75139b`, 5019 bytes.

Dependency role: Read benchmark ESLint project selection and TypeScript parser project wiring; imported benchmark context has no custom behavior delta.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const { TSGOLINT_BENCHMARK_PROJECT } = process.env;

let files = [];
let project = '';

if (TSGOLINT_BENCHMARK_PROJECT === 'vscode') {
  files = ['src/**/*.ts'];
  project = './src/tsconfig.json';
} else if (TSGOLINT_BENCHMARK_PROJECT === 'typescript') {
  files = ['src/**/*.ts'];
  project = './src/tsconfig-eslint.json';
} else if (TSGOLINT_BENCHMARK_PROJECT === 'typeorm') {
  files = ['src/**/*.ts', 'sample/**/*.ts', 'test/**/*.ts'];
  project = './tsconfig.json';
} else if (TSGOLINT_BENCHMARK_PROJECT === 'vuejs') {
  files = [
    'packages/global.d.ts',
    'packages/*/src/**/*.ts',
    'packages/*/__tests__/**/*.ts',
    'packages/vue/jsx-runtime/**/*.ts',
    'packages/runtime-dom/types/jsx.d.ts',
    'scripts/*.ts',
  ];
  project = './tsconfig.json';
}

export default tseslint.config(
  {
    ignores: ['**/*.js', '**/*.mjs', '**/*.cjs'],
  },
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedInlineConfigs: 'off',
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    files,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project,
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/no-array-delete': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-misused-spread': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unnecessary-type-conversion': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'error',
      '@typescript-eslint/no-useless-default-assignment': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-unary-minus': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/prefer-find': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/related-getter-setter-pairs': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/strict-void-return': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
    },
  },
);
```

### `native/tsgolint-effect-fork/dprint.json`

Mode `100644`, blob `a12383aa4a613fbeb2c86b3a67a8081316d2e517`, SHA256 `0a28ce0d120eeda8241b9c09cd8dc05efaf785f74f92c5a077c5ba643388947d`, 691 bytes.

Dependency role: Read formatter plugin pins and excludes for generated/native paths; no review behavior or runtime contract derives from excluded fixtures.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "lineWidth": 120,
  "typescript": {
    "quoteStyle": "preferSingle",
    "binaryExpression.operatorPosition": "sameLine"
  },
  "json": {
    "indentWidth": 2
  },
  "toml": {},
  "excludes": ["e2e/fixtures/**", "pnpm-lock.yaml", "internal/rules/**", "typescript-go/**"],
  "plugins": [
    "https://plugins.dprint.dev/typescript-0.96.1.wasm",
    "https://plugins.dprint.dev/json-0.24.0.wasm",
    "https://plugins.dprint.dev/markdown-0.24.0.wasm",
    "https://plugins.dprint.dev/g-plane/pretty_yaml-v0.6.0.wasm",
    "https://plugins.dprint.dev/toml-0.8.0.wasm",
    "https://plugins.dprint.dev/exec-0.5.1.json@492414e39dea4dccc07b4af796d2f4efdb89e84bae2bd4e1e924c0cc050855bf"
  ]
}
```

### `native/tsgolint-effect-fork/e2e/package.json`

Mode `100644`, blob `67b082faac2a973d4cd66b873cf01aced3125532`, SHA256 `8abbc6dcf38a6cf7c424c70bdc4762156c0ae702a661de09d4bbb3a33e01bd9e`, 303 bytes.

Dependency role: Read full fixture/package manifest name, scripts, dependency and engine pins: {'name': 'tsgolint-e2e', 'version': '1.0.0', 'private': True, 'type': 'module', 'scripts': {'test': 'vitest'}, 'devDependencies': {'@types/node': '^24.3.1', 'fast-glob': '^3.3.3', 'typescript': '^7.0.0', 'vitest': '^5.0.0'}, 'packageManager': 'pnpm@11.24.0'}; checked runtime boundary against the distinct retained v3 and stable v4 fixture packages.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "tsgolint-e2e",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest"
  },
  "devDependencies": {
    "@types/node": "^24.3.1",
    "fast-glob": "^3.3.3",
    "typescript": "^7.0.0",
    "vitest": "^5.0.0"
  },
  "packageManager": "pnpm@11.24.0"
}
```

### `native/tsgolint-effect-fork/e2e/pnpm-lock.yaml`

Mode `100644`, blob `17f2bbaab1a7d01cc5ca1e45f712abf3a7c76f0d`, SHA256 `c31f7c3fd00943c834b670a381abf0a117fdffdc68b7f4fac387fbee996e2987`, 35737 bytes.

Dependency role: Read lock importer and package-resolution context for this workspace; checked pinned runtime/developer dependencies and platform transitive packages against adjacent package manifests.

Current frozen importer context. Package snapshots unrelated to these dependency edges are omitted.

```yaml
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    devDependencies:
      '@types/node':
        specifier: ^24.3.1
        version: 24.10.3
      fast-glob:
        specifier: ^3.3.3
        version: 3.3.3
      typescript:
        specifier: ^7.0.0
        version: 7.0.2
      vitest:
        specifier: ^5.0.0
        version: 5.0.0(@types/node@24.10.3)(vite@8.0.1(@emnapi/core@1.9.0)(@emnapi/runtime@1.9.0)(@types/node@24.10.3))
```
