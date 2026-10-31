# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/effect-tsgo/.github/workflows/validate-oxlint.yml`

Mode `100644`, blob `679694c53ff96b73d95dd3e298fba6f0329cc54b`, SHA256 `969f1897819930972b808f75294483cc37cf9e4d61d8b04628a52eb2cec27fa4`, 2084 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Validate Oxlint

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

concurrency:
  group: validate-oxlint-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

permissions: {}

jobs:
  matrix:
    uses: ./.github/workflows/repoctl-matrix.yml
    permissions:
      contents: read
    with:
      name: test-oxlint

  validate:
    name: Validate ${{ matrix.name }}
    needs: matrix
    if: github.repository_owner == 'Effect-TS'
    runs-on: ubuntu-latest
    timeout-minutes: 45
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.matrix.outputs.matrix) }}

    steps:
      - name: Checkout source
        uses: actions/checkout@v7

      - name: Setup ${{ matrix.tsgolint.component }} ${{ matrix.tsgolint.version }}
        uses: ./.github/actions/setup-repo
        with:
          component: ${{ matrix.tsgolint.component }}
          version: ${{ matrix.tsgolint.version }}

      - name: Build tsgolint
        id: tsgolint
        run: >
          pnpm exec repoctl build artifact
          --component "${{ matrix.tsgolint.component }}"
          --version "${{ matrix.tsgolint.version }}"
          --target linux-x64

      - name: Setup ${{ matrix.oxlint.component }} ${{ matrix.oxlint.version }}
        uses: ./.github/actions/setup-repo
        with:
          component: ${{ matrix.oxlint.component }}
          version: ${{ matrix.oxlint.version }}
          target: linux-x64

      - name: Build Oxlint binding
        env:
          TARGET_CC: clang
        run: >
          pnpm exec repoctl build artifact
          --component "${{ matrix.oxlint.component }}"
          --version "${{ matrix.oxlint.version }}"
          --target linux-x64

      - name: Build @effect/tsgo package
        run: pnpm --filter @effect/tsgo build

      - name: Smoke test Oxlint runtime
        env:
          TSGOLINT_PATH: ${{ steps.tsgolint.outputs.artifact_path }}
        run: node testdata/tests/oxlint/smoke.mjs "$GITHUB_WORKSPACE" "$TSGOLINT_PATH"
```

### `native/effect-tsgo/.github/workflows/validate.yml`

Mode `100644`, blob `db9b505aa088a98d1373cdf12d325c1439887409`, SHA256 `7ab9256934782f13f26ee73c25805c81fa16a48a8e2e65a9ac272d10124de973`, 1423 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Validate

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

concurrency:
  group: validate-${{ github.ref }}
  cancel-in-progress: true

permissions: {}

jobs:
  matrix:
    uses: ./.github/workflows/repoctl-matrix.yml
    permissions:
      contents: read
    with:
      name: test-typescript

  validate:
    name: Validate ${{ matrix.component }} ${{ matrix.name }} (${{ matrix.version }})
    needs: matrix
    if: github.repository_owner == 'Effect-TS'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.matrix.outputs.matrix) }}

    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup ${{ matrix.component }} ${{ matrix.version }}
        uses: ./.github/actions/setup-repo
        with:
          component: ${{ matrix.component }}
          version: ${{ matrix.version }}

      - name: Build
        run: pnpm exec repoctl build local

      - name: Validate repoctl
        if: matrix.repoctl
        run: pnpm run check:repoctl && pnpm run test:repoctl

      - name: Install golangci-lint
        if: matrix.repoctl
        run: go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.13.2

      - name: Lint
        if: matrix.repoctl
        run: pnpm lint

      - name: Test
        run: pnpm exec repoctl test
```

### `native/effect-tsgo/.gitmodules`

Mode `100644`, blob `bd0114176b112a1712cb80c16ade28e3869990ef`, SHA256 `4815df3875fac992932f8b9cc48523e6e85ed2a49fa1db49198113a984045511`, 111 bytes.

Dependency role: Read submodule path and upstream URL for the pinned TypeScript source.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
[submodule "typescript"]
	path = typescript
	url = https://github.com/microsoft/TypeScript.git
	ignore = dirty
```

### `native/effect-tsgo/.golangci.yml`

Mode `100644`, blob `7ff0dac806b13813a2a46d1403783ced4ed018de`, SHA256 `2eeee8385d6de3c18b0d9c65690a7daf306e58bcc9c72b83b28fe04a36ac5cca`, 2364 bytes.

Dependency role: Read Go lint version/config, package exclusions and Go 1.26 compatibility boundary relative to Go 1.27 CI/toolchain.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

Source block 4 representation: `literal-and-json-source-lines-v1`; original language `text`. Decode lines prefixed `@@json-source-line: ` as JSON strings, including their exact line endings. Keep all other lines literal, concatenate in order and review the recovered source.

The rendered block retains the previously reviewed file rendering, whose final newline is LF instead of the canonical file's CRLF. Its decoded identity is 2363 bytes, SHA256 `77871f405c0760450a8db55c8a06aebd3e5b4ff1ede7a2092a1050e5453fde07`. The canonical source identity above and this rendered-block identity are separate; decoding preserves the rendered bytes exactly.

```text
@@json-source-line: "# yaml-language-server: $schema=https://golangci-lint.run/jsonschema/golangci.jsonschema.json\r\n"
@@json-source-line: "\r\n"
@@json-source-line: "version: \"2\"\r\n"
@@json-source-line: "\r\n"
@@json-source-line: "run:\r\n"
@@json-source-line: "  allow-parallel-runners: true\r\n"
@@json-source-line: "\r\n"
linters:
  default: none
  enable:
    - copyloopvar
    - bodyclose
    - asasalint
    - bidichk
    - errcheck
    - errchkjson
    - errname
    - errorlint
    - fatcontext
    - forbidigo
    - gocritic
    - gocheckcompilerdirectives
    - goprintffuncname
    - govet
    - grouper
    - ineffassign
    - inamedparam
    - intrange
    - makezero
    - mirror
    - misspell
    - modernize
    - musttag
    - nakedret
    - nolintlint
    - perfsprint
    - paralleltest
    - predeclared
    - reassign
    - revive
    - staticcheck
    - testableexamples
    - tparallel
    - unconvert
    - usestdlibvars
    - usetesting
    - durationcheck

  settings:
    forbidigo:
      analyze-types: true
      forbid:
        - pattern: '.*'
          msg: tspath should likely be used instead
          pkg: ^(path|path/filepath)$
        - pattern: '.*'
          msg: a host implementation should likely be used instead
          pkg: ^os(/|$)
        - pattern: GOOS
          msg: a host implementation should likely be used instead
          pkg: ^runtime$
    paralleltest:
      ignore-missing-subtests: true
    revive:
      rules:
        - name: increment-decrement
        - name: unused-parameter

  exclusions:
    presets:
      - comments
      - std-error-handling
    rules:
      # Keep Effect-owned modules source-compatible with their declared Go 1.26
      # minimum even though the workspace and CI toolchain use Go 1.27.
      - text: '^(slicesbackward|stringscut):'
        linters:
          - modernize
      # Compatibility fixtures intentionally construct raw upstream compiler
      # options instead of passing through TypeScript's option parser.
      - text: 'CompilerOptions\)\.(ESModuleInterop|AllowSyntheticDefaultImports) is deprecated:'
        linters:
          - staticcheck
      - path: '(.+)_test\.go$'
        linters:
          - forbidigo
      - path: internal/effecttest
        linters:
          - forbidigo
      - path: internal/bundledeffect
        linters:
          - forbidigo
      - path: _tools
        linters:
          - forbidigo
    paths:
      - typescript-go
      - shim
@@json-source-line: "\r\n"
@@json-source-line: "issues:\r\n"
@@json-source-line: "  max-issues-per-linter: 0\r\n"
  max-same-issues: 0
```

### `native/effect-tsgo/_packages/tsgo-darwin-arm64/package.json`

Mode `100644`, blob `b581ace0521db90decd52c027559ac76db592184`, SHA256 `95234d5ac738dd8639454fc913ca77e05df9f9816c8efb8fcab2bc6230f35c90`, 798 bytes.

Dependency role: Read package metadata: name=@effect/tsgo-darwin-arm64, version=0.46.1, os=['darwin'], cpu=['arm64'], package file set=['artifacts/', 'lib/tsc', 'README.md', 'lib/upstream.json']; checked platform target and tsc binary artifact naming against wrapper/package resolver.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "@effect/tsgo-darwin-arm64",
  "version": "0.46.1",
  "description": "Effect Language Service for TypeScript-Go — Effect-specific diagnostics and hover features.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Effect-TS/tsgo.git",
    "directory": "_packages/tsgo-darwin-arm64"
  },
  "bugs": "https://github.com/Effect-TS/tsgo/issues",
  "homepage": "https://github.com/Effect-TS/tsgo#readme",
  "publishConfig": {
    "access": "public",
    "provenance": true,
    "executableFiles": [
      "./lib/tsc",
      "./lib/tsc-next",
      "./lib/tsgolint"
    ]
  },
  "preferUnplugged": true,
  "files": [
    "artifacts/",
    "lib/tsc",
    "README.md",
    "lib/upstream.json"
  ],
  "os": [
    "darwin"
  ],
  "cpu": [
    "arm64"
  ]
}
```

### `native/effect-tsgo/_packages/tsgo-darwin-x64/package.json`

Mode `100644`, blob `e8642562b8e18cd8d7640e8443c418211c78701a`, SHA256 `d7cc1027b850827a80bbf17123806abd8dcf53b928bfda15a342f383b44f206f`, 792 bytes.

Dependency role: Read package metadata: name=@effect/tsgo-darwin-x64, version=0.46.1, os=['darwin'], cpu=['x64'], package file set=['artifacts/', 'lib/tsc', 'README.md', 'lib/upstream.json']; checked platform target and tsc binary artifact naming against wrapper/package resolver.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "@effect/tsgo-darwin-x64",
  "version": "0.46.1",
  "description": "Effect Language Service for TypeScript-Go — Effect-specific diagnostics and hover features.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Effect-TS/tsgo.git",
    "directory": "_packages/tsgo-darwin-x64"
  },
  "bugs": "https://github.com/Effect-TS/tsgo/issues",
  "homepage": "https://github.com/Effect-TS/tsgo#readme",
  "publishConfig": {
    "access": "public",
    "provenance": true,
    "executableFiles": [
      "./lib/tsc",
      "./lib/tsc-next",
      "./lib/tsgolint"
    ]
  },
  "preferUnplugged": true,
  "files": [
    "artifacts/",
    "lib/tsc",
    "README.md",
    "lib/upstream.json"
  ],
  "os": [
    "darwin"
  ],
  "cpu": [
    "x64"
  ]
}
```

### `native/effect-tsgo/_packages/tsgo-linux-arm/package.json`

Mode `100644`, blob `ad557aecef7089b1293b71e4a1f8c3fb675b6bd1`, SHA256 `e7e079ef4a9ce57030bc2f281a05575c5e788a291b5d281bd1d36baef5ddc7aa`, 765 bytes.

Dependency role: Read package metadata: name=@effect/tsgo-linux-arm, version=0.46.1, os=['linux'], cpu=['arm'], package file set=['artifacts/', 'lib/tsc', 'README.md', 'lib/upstream.json']; checked platform target and tsc binary artifact naming against wrapper/package resolver.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "@effect/tsgo-linux-arm",
  "version": "0.46.1",
  "description": "Effect Language Service for TypeScript-Go — Effect-specific diagnostics and hover features.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Effect-TS/tsgo.git",
    "directory": "_packages/tsgo-linux-arm"
  },
  "bugs": "https://github.com/Effect-TS/tsgo/issues",
  "homepage": "https://github.com/Effect-TS/tsgo#readme",
  "publishConfig": {
    "access": "public",
    "provenance": true,
    "executableFiles": [
      "./lib/tsc",
      "./lib/tsc-next"
    ]
  },
  "preferUnplugged": true,
  "files": [
    "artifacts/",
    "lib/tsc",
    "README.md",
    "lib/upstream.json"
  ],
  "os": [
    "linux"
  ],
  "cpu": [
    "arm"
  ]
}
```

### `native/effect-tsgo/_packages/tsgo-linux-arm64/package.json`

Mode `100644`, blob `80599c9d1cbd3e2ac75ebbe0b0841189d7e4c4c9`, SHA256 `bf0bb8fdf1a61949d5af997baf96e352a0619bd13a6a1a837b2b74197147c61e`, 795 bytes.

Dependency role: Read package metadata: name=@effect/tsgo-linux-arm64, version=0.46.1, os=['linux'], cpu=['arm64'], package file set=['artifacts/', 'lib/tsc', 'README.md', 'lib/upstream.json']; checked platform target and tsc binary artifact naming against wrapper/package resolver.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "@effect/tsgo-linux-arm64",
  "version": "0.46.1",
  "description": "Effect Language Service for TypeScript-Go — Effect-specific diagnostics and hover features.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Effect-TS/tsgo.git",
    "directory": "_packages/tsgo-linux-arm64"
  },
  "bugs": "https://github.com/Effect-TS/tsgo/issues",
  "homepage": "https://github.com/Effect-TS/tsgo#readme",
  "publishConfig": {
    "access": "public",
    "provenance": true,
    "executableFiles": [
      "./lib/tsc",
      "./lib/tsc-next",
      "./lib/tsgolint"
    ]
  },
  "preferUnplugged": true,
  "files": [
    "artifacts/",
    "lib/tsc",
    "README.md",
    "lib/upstream.json"
  ],
  "os": [
    "linux"
  ],
  "cpu": [
    "arm64"
  ]
}
```
