# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/effect-tsgo/testdata/tests/oxlint/.oxlintrc-recommended-override.json`

Mode `100644`, blob `a06a958d267e07c7dedfd8a5bcdf49f217aae775`, SHA256 `60e570659eefb602bdd65c198747ab93b96702a79cb2b78aef3cfc4272b3e6b4`, 120 bytes.

Dependency role: Read full Oxlint fixture config keys and selected rules/preset override: {'extends': ['../../../oxlint-presets/recommended.json'], 'rules': {'effecttsgo/floating-effect': 'off'}}; checked fixture consumer uses public Effect rules and expected override.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "extends": ["../../../oxlint-presets/recommended.json"],
  "rules": {
    "effecttsgo/floating-effect": "off"
  }
}
```

### `native/effect-tsgo/testdata/tests/oxlint/.oxlintrc-recommended.json`

Mode `100644`, blob `7621794a03d4bfe3c8fbafd7b1c056da7fc57b04`, SHA256 `178b94235499d164d4e641a5898c0170a37275d8fc5dc743265db637df79aee6`, 62 bytes.

Dependency role: Read full Oxlint fixture config keys and selected rules/preset override: {'extends': ['../../../oxlint-presets/recommended.json']}; checked fixture consumer uses public Effect rules and expected override.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "extends": ["../../../oxlint-presets/recommended.json"]
}
```

### `native/effect-tsgo/testdata/tests/oxlint/.oxlintrc.json`

Mode `100644`, blob `cc1bcca1a27972ac0ec9117dd9fb8a0a7f0411ef`, SHA256 `4f07efb723d979af28549c347ccf6ac3799a0ce7bbba96566763961cb0f31578`, 254 bytes.

Dependency role: Read full Oxlint fixture config keys and selected rules/preset override: {'plugins': ['effecttsgo'], 'categories': {'correctness': 'off'}, 'rules': {'effecttsgo/floating-effect': 'error', 'effecttsgo/missing-star-in-yield-effect-gen': 'error', 'effecttsgo/strict-boolean-expressions': 'error'}}; checked fixture consumer uses public Effect rules and expected override.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "plugins": ["effecttsgo"],
  "categories": {
    "correctness": "off"
  },
  "rules": {
    "effecttsgo/floating-effect": "error",
    "effecttsgo/missing-star-in-yield-effect-gen": "error",
    "effecttsgo/strict-boolean-expressions": "error"
  }
}
```

### `native/effect-tsgo/testdata/tests/oxlint/tsconfig.json`

Mode `100644`, blob `8fa8f3242d24a568c28155395ed9578aaed8c8bd`, SHA256 `8ed307c00fcc70b06a4e8514a87ce0dc114523ffbd43fd4a3ab69473795a4f26`, 232 bytes.

Dependency role: Read tsconfig compilerOptions/plugins/files keys: {'module': 'NodeNext', 'moduleResolution': 'NodeNext', 'skipLibCheck': True}; checked plugin-enabled vs plugin-free fixture boundary and included file set.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "skipLibCheck": true
  },
  "files": ["diagnostic.ts", "disabled.ts", "related-diagnostic.ts", "strict-boolean-expressions-duplicates.ts"]
}
```

### `native/tsgolint-effect-fork/.github/actions/setup/action.yml`

Mode `100644`, blob `3c25c14e67597524de23948ac76c325bbf8afdb6`, SHA256 `2c4bcf70ffff62417cef2e0735fe501a0a6ca03c18b6f894403a4c7d1b94c878`, 1021 bytes.

Dependency role: Inspected boundary content and its package/workflow consumer in source projection; unchanged context only, no upstream diff review performed.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Setup

description: Setup

runs:
  using: composite
  steps:
    - uses: actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e # v7.0.0
      with:
        go-version-file: go.mod

    - uses: extractions/setup-crate@7577c1bdf2d95e6d65d532788f35ed79d4b1dda2 # v2.0.1
      with:
        repo: casey/just
        version: ${{ inputs.just-version }}
        github-token: ${{ inputs.github-token }}

    - name: Set committer identity
      shell: bash
      run: |
        git config --global user.email "github-actions[bot]@users.noreply.github.com"
        git config --global user.name "github-actions"

    - name: Apply typescript-go patches
      shell: bash
      run: |
        pushd typescript-go
        git am --3way --no-gpg-sign ../patches/*.patch
        popd

    - name: Expose typescript-go collections package
      shell: bash
      run: |
        mkdir -p internal/collections
        find ./typescript-go/internal/collections -type f ! -name '*_test.go' -exec cp {} internal/collections/ \;
```

### `native/tsgolint-effect-fork/.github/workflows/autofix.yml`

Mode `100644`, blob `30ed3943508322fb782cb9718147a261635d6439`, SHA256 `0082d433eb49e920cd65c9dc798a217b952f501bff5af44b1b658a7b0aa605a0`, 1134 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: autofix.ci # For security reasons, the workflow in which the autofix.ci action is used must be named "autofix.ci".

permissions: {}

on:
  pull_request:
    types: [opened, synchronize]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref_name }}-${{ github.event.pull_request.number || github.sha }}
  cancel-in-progress: ${{ github.ref_name != 'main' }}

jobs:
  autofix:
    runs-on: ubuntu-latest
    steps:
      - uses: taiki-e/checkout-action@7d1e50e93dc4fb3bba58f85018fadf77898aee8b # v1.4.2

      - name: Restore dprint plugin cache
        id: cache-restore
        uses: actions/cache/restore@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          key: dprint-${{ hashFiles('dprint.json') }}
          path: ~/.cache/dprint

      - uses: oxc-project/setup-node@f46a72f95efdc55273fcd042d61c84e723b2892c # v1.4.1

      - uses: extractions/setup-crate@7577c1bdf2d95e6d65d532788f35ed79d4b1dda2 # v2.0.1
        with:
          repo: casey/just

      - run: just fmt

      - uses: autofix-ci/action@c5b2d67aa2274e7b5a18224e8171550871fc7e4a # v1.3.4
        with:
          fail-fast: false
```

### `native/tsgolint-effect-fork/.github/workflows/check-schemas.yml`

Mode `100644`, blob `38ed6d8f752bc77c4b369c9926623fc9b1bc369d`, SHA256 `029cf7c0f8cc74118c5e0303609dcf357a35b16871ee7f756aee87ecc26b9e99`, 1420 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Check Generated Schemas

permissions: {}

on:
  workflow_dispatch:
  pull_request:
  push:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref_name }}-${{ github.event.pull_request.number || github.sha }}
  cancel-in-progress: ${{ github.ref_name != 'main' }}

jobs:
  check-schemas:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 1 # sufficient for checking changes
          submodules: true
          persist-credentials: false

      - name: Setup Node.js
        uses: oxc-project/setup-node@f46a72f95efdc55273fcd042d61c84e723b2892c # v1.4.1

      - name: Install Go
        uses: actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e # v7.0.0
        with:
          go-version-file: go.mod

      - name: Install go-jsonschema
        run: go install github.com/atombender/go-jsonschema@v0.23.0

      - name: Generate JSON schemas
        run: node tools/gen-json-schemas.ts

      - name: Check for uncommitted changes
        run: |
          if ! git diff --exit-code; then
            echo "::error::Generated schema files don't match committed versions. Please run 'node tools/gen-json-schemas.ts' and commit the changes."
            exit 1
          fi
          echo "✓ All generated schemas match committed versions"
```

### `native/tsgolint-effect-fork/.github/workflows/ci.yml`

Mode `100644`, blob `62b3365d53ebd0327216309207ed05c18139a22a`, SHA256 `a0ddb19f6502d23dee7f003eccd8c82de9adea7161e2a22eec4a4899f9962e39`, 2964 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: CI

permissions: {}

on:
  workflow_dispatch:
  pull_request:
  push:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref_name }}-${{ github.event.pull_request.number || github.sha }}
  cancel-in-progress: ${{ github.ref_name != 'main' }}

jobs:
  test-go:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0 # required for git am --3way to work properly
          submodules: true
          persist-credentials: false

      - uses: oxc-project/setup-node@f46a72f95efdc55273fcd042d61c84e723b2892c # v1.4.1

      - uses: ./.github/actions/setup

      - name: Run go tests
        run: go test ./internal/...

  test-e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0 # required for git am --3way to work properly
          submodules: true
          persist-credentials: false

      - uses: oxc-project/setup-node@f46a72f95efdc55273fcd042d61c84e723b2892c # v1.4.1

      - uses: ./.github/actions/setup

      - name: Build
        run: just build

      - name: Run e2e tests
        run: |
          pnpm --ignore-workspace install --frozen-lockfile
          pnpm --ignore-workspace run test
        working-directory: e2e

  test-windows:
    if: ${{ github.ref_name == 'main' }}
    runs-on: windows-latest
    timeout-minutes: 120
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0 # required for git am --3way to work properly
          submodules: true
          persist-credentials: false

      - uses: oxc-project/setup-node@f46a72f95efdc55273fcd042d61c84e723b2892c # v1.4.1

      - uses: ./.github/actions/setup

      - name: Build
        run: go build -o tsgolint.exe ./cmd/tsgolint

      - name: Run e2e tests
        run: |
          pnpm --ignore-workspace install --frozen-lockfile
          pnpm --ignore-workspace run test
        working-directory: e2e

  lint:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0 # required for git am --3way to work properly
          submodules: true
          persist-credentials: false

      - uses: ./.github/actions/setup

      - name: Run golangci-lint
        uses: golangci/golangci-lint-action@ba0d7d2ec06a0ea1cb5fa41b2e4a3ab91d21278a # v9.3.0
        with:
          version: latest

  typos:
    name: Typos
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: taiki-e/checkout-action@7d1e50e93dc4fb3bba58f85018fadf77898aee8b # v1.4.2
      - uses: crate-ci/typos@512fc24f32f44ab01972217aaaf3dc86ec234d53 # v1.50.2
        with:
          files: .
```
