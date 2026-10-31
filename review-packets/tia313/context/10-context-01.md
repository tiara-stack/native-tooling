# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/effect-tsgo/.changeset/config.json`

Mode `100644`, blob `13f457d903b0f66dd396f2219c0dd303d43f15b4`, SHA256 `e19b07d52bb6a5a61ab8328807513fd288d1cb5b80b05a03abf5a8b9e93451c1`, 546 bytes.

Dependency role: Read Changesets config fixed platform package group, public access and base branch; package release versions move together.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "$schema": "https://unpkg.com/@changesets/config@4.0.0-next.8/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [
    [
      "@effect/tsgo",
      "@effect/tsgo-darwin-arm64",
      "@effect/tsgo-darwin-x64",
      "@effect/tsgo-linux-arm",
      "@effect/tsgo-linux-arm64",
      "@effect/tsgo-linux-x64",
      "@effect/tsgo-win32-arm64",
      "@effect/tsgo-win32-x64"
    ]
  ],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### `native/effect-tsgo/.gitattributes`

Mode `100644`, blob `f55c829b89be1ac9540c231512d5331848f2657c`, SHA256 `cda814c3e9439ab0809e3d157531011a8f38f6880553fa0c4918186d32e07811`, 94 bytes.

Dependency role: Read patch/shell text attributes; confirms source patch normalization and whitespace policy context.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
*.sh text eol=lf
*.patch text eol=lf whitespace=-blank-at-eol,-blank-at-eof,-space-before-tab
```

### `native/effect-tsgo/.github/actions/setup-repo/action.yml`

Mode `100644`, blob `5e31a62716fc1717e75fb8ba7b03e6a4b0ed345d`, SHA256 `711cc656e6749f19853b1471ab351f52bce270d2cdac76ff3b9ba87bc0861fd4`, 8506 bytes.

Dependency role: Inspected composite action phases: Node/pnpm install, component resolution, Rust condition, Go 1.27 setup, generated-shim cache and upstream materialization.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Setup repo
description: Install repository toolchains and materialize an upstream component

inputs:
  component:
    description: Upstream component to materialize
    required: false
    default: typescript
  version:
    description: Component version; TypeScript defaults to the configured next tag
    required: false
    default: ""
  materialize:
    description: Whether to materialize the selected upstream component
    required: false
    default: "true"
  target:
    description: Platform package target; used to derive native toolchain targets
    required: false
    default: ""

runs:
  using: composite
  steps:
    - name: Setup Node
      uses: actions/setup-node@v6
      with:
        node-version: "24"

    - name: Setup pnpm
      uses: pnpm/action-setup@v6

    - name: Install dependencies
      shell: bash
      run: pnpm install --frozen-lockfile

    - name: Resolve upstream component
      id: upstream-component
      shell: bash
      env:
        COMPONENT: ${{ inputs.component }}
        TARGET: ${{ inputs.target }}
        VERSION: ${{ inputs.version }}
      run: |
        args=(upstream resolve --component "$COMPONENT")
        if [ -n "$VERSION" ]; then
          args+=(--version "$VERSION")
        fi
        if [ -n "$TARGET" ]; then
          args+=(--target "$TARGET")
        fi
        pnpm exec repoctl "${args[@]}"

    - name: Setup Rust
      if: steps.upstream-component.outputs.component == 'oxlint'
      uses: dtolnay/rust-toolchain@stable
      with:
        toolchain: "1.93.0"
        components: rustfmt

    - name: Install native build tools
      if: steps.upstream-component.outputs.component == 'oxlint' && runner.os == 'Linux'
      shell: bash
      run: |
        sudo apt-get update
        sudo apt-get install --yes cmake

    - name: Configure Rust build cache
      if: steps.upstream-component.outputs.component == 'oxlint'
      shell: bash
      run: echo "CARGO_TARGET_DIR=${RUNNER_TEMP}/oxlint-target" >> "$GITHUB_ENV"

    - name: Cache Rust build
      if: steps.upstream-component.outputs.component == 'oxlint' && github.ref == 'refs/heads/main'
      uses: actions/cache@v6
      with:
        path: |
          ~/.cargo/git
          ~/.cargo/registry
          ${{ runner.temp }}/oxlint-target
        key: rust-build-oxlint-1.93.0-${{ runner.os }}-${{ runner.arch }}-${{ steps.upstream-component.outputs.rust-target }}-${{ hashFiles('_packages/tsgo/upstream.json', '_patches/oxlint/**') }}
        restore-keys: |
          rust-build-oxlint-1.93.0-${{ runner.os }}-${{ runner.arch }}-${{ steps.upstream-component.outputs.rust-target }}-

    - name: Restore Rust build cache
      if: steps.upstream-component.outputs.component == 'oxlint' && github.ref != 'refs/heads/main'
      uses: actions/cache/restore@v6
      with:
        path: |
          ~/.cargo/git
          ~/.cargo/registry
          ${{ runner.temp }}/oxlint-target
        key: rust-build-oxlint-1.93.0-${{ runner.os }}-${{ runner.arch }}-${{ steps.upstream-component.outputs.rust-target }}-${{ hashFiles('_packages/tsgo/upstream.json', '_patches/oxlint/**') }}
        restore-keys: |
          rust-build-oxlint-1.93.0-${{ runner.os }}-${{ runner.arch }}-${{ steps.upstream-component.outputs.rust-target }}-

    - name: Setup Go
      id: go
      uses: actions/setup-go@v6
      with:
        go-version: "1.27"
        cache: false

    - name: Resolve Go cache paths
      id: go-cache
      shell: bash
      run: |
        echo "build=$(go env GOCACHE)" >> "$GITHUB_OUTPUT"
        echo "modules=$(go env GOMODCACHE)" >> "$GITHUB_OUTPUT"

    # Go caches are keyed by the resolved go-cache identity (the TypeScript
    # dependency of the component) so oxlint-tsgolint restores the compiler
    # objects cached by the typescript jobs. Only materialized jobs whose
    # component owns the cache (go-cache-save) persist it, and only on main;
    # everything else is restore-only to keep the repository cache under the
    # 10GB eviction limit.
    - name: Cache Go modules
      if: inputs.materialize == 'true' && steps.upstream-component.outputs.go-cache-save == 'true' && github.ref == 'refs/heads/main'
      uses: actions/cache@v6
      with:
        path: ${{ steps.go-cache.outputs.modules }}/cache/download
        key: go-modules-1.26-${{ steps.upstream-component.outputs.go-cache-component }}-${{ steps.upstream-component.outputs.go-cache-version }}-${{ runner.os }}-${{ hashFiles('**/go.mod', '**/go.sum', '_packages/tsgo/upstream.json', '_patches/**/*.patch') }}

    - name: Restore Go modules
      if: steps.upstream-component.outputs.go-cache-component != '' && (inputs.materialize != 'true' || steps.upstream-component.outputs.go-cache-save != 'true' || github.ref != 'refs/heads/main')
      uses: actions/cache/restore@v6
      with:
        path: ${{ steps.go-cache.outputs.modules }}/cache/download
        key: go-modules-1.26-${{ steps.upstream-component.outputs.go-cache-component }}-${{ steps.upstream-component.outputs.go-cache-version }}-${{ runner.os }}-${{ hashFiles('**/go.mod', '**/go.sum', '_packages/tsgo/upstream.json', '_patches/**/*.patch') }}

    - name: Cache Go build
      if: runner.os == 'Linux' && inputs.materialize == 'true' && steps.upstream-component.outputs.go-cache-save == 'true' && github.ref == 'refs/heads/main'
      uses: actions/cache@v6
      with:
        path: ${{ steps.go-cache.outputs.build }}
        key: go-build-${{ steps.upstream-component.outputs.go-cache-component }}-${{ steps.upstream-component.outputs.go-cache-version }}-Linux-${{ hashFiles('**/go.mod', '**/go.sum', '_packages/tsgo/upstream.json', '_patches/**/*.patch') }}
        restore-keys: |
          go-build-${{ steps.upstream-component.outputs.go-cache-component }}-${{ steps.upstream-component.outputs.go-cache-version }}-Linux-

    - name: Restore Go build cache
      if: runner.os == 'Linux' && steps.upstream-component.outputs.go-cache-component != '' && (inputs.materialize != 'true' || steps.upstream-component.outputs.go-cache-save != 'true' || github.ref != 'refs/heads/main')
      uses: actions/cache/restore@v6
      with:
        path: ${{ steps.go-cache.outputs.build }}
        key: go-build-${{ steps.upstream-component.outputs.go-cache-component }}-${{ steps.upstream-component.outputs.go-cache-version }}-Linux-${{ hashFiles('**/go.mod', '**/go.sum', '_packages/tsgo/upstream.json', '_patches/**/*.patch') }}
        restore-keys: |
          go-build-${{ steps.upstream-component.outputs.go-cache-component }}-${{ steps.upstream-component.outputs.go-cache-version }}-Linux-

    - name: Configure generated shim cache
      shell: bash
      run: echo "TSGO_SHIM_CACHE_DIR=${RUNNER_TEMP}/gen-shims-cache" >> "$GITHUB_ENV"

    - name: Cache generated shims
      if: github.ref == 'refs/heads/main'
      uses: actions/cache@v6
      with:
        path: ${{ runner.temp }}/gen-shims-cache
        key: generated-shims-v1-${{ steps.go.outputs.go-version }}-${{ steps.upstream-component.outputs.component }}-${{ steps.upstream-component.outputs.version }}-${{ hashFiles('_tools/gen_shims/**', '_tools/repoctl/src/**', '_packages/tsgo/upstream.json', '_patches/typescript-go/**', '_patches/typescript/**', '_patches/tsgolint/**') }}
        enableCrossOsArchive: true

    - name: Restore generated shim cache
      if: github.ref != 'refs/heads/main'
      uses: actions/cache/restore@v6
      with:
        path: ${{ runner.temp }}/gen-shims-cache
        key: generated-shims-v1-${{ steps.go.outputs.go-version }}-${{ steps.upstream-component.outputs.component }}-${{ steps.upstream-component.outputs.version }}-${{ hashFiles('_tools/gen_shims/**', '_tools/repoctl/src/**', '_packages/tsgo/upstream.json', '_patches/typescript-go/**', '_patches/typescript/**', '_patches/tsgolint/**') }}
        enableCrossOsArchive: true

    - name: Materialize upstream component
      if: inputs.materialize == 'true'
      shell: bash
      env:
        COMPONENT: ${{ steps.upstream-component.outputs.component }}
        VERSION: ${{ steps.upstream-component.outputs.version }}
      run: pnpm exec repoctl submodules setup --component "$COMPONENT" --version "$VERSION"

    - name: Install Oxlint Rust target
      if: steps.upstream-component.outputs.component == 'oxlint' && inputs.materialize == 'true'
      shell: bash
      working-directory: oxlint
      env:
        RUST_TARGET: ${{ steps.upstream-component.outputs.rust-target }}
      run: rustup target add "$RUST_TARGET"
```

### `native/effect-tsgo/.github/workflows/release.yml`

Mode `100644`, blob `51b5a99aaf8d8dea796c7cb58c8a283892c9e3d3`, SHA256 `779b71a1ea063881af2d6e9c64f4beef483355821cc101a353d108addea4d3d6`, 6291 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Release

on:
  push:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false
  queue: max

permissions: {}

jobs:
  select-mode:
    name: Select Mode
    if: github.repository_owner == 'Effect-TS'
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: read
    outputs:
      mode: ${{ steps.select-mode.outputs.mode }}
      publish-plan-artifact-id: ${{ steps.select-mode.outputs.publish-plan-artifact-id }}
    steps:
      - name: Checkout
        uses: actions/checkout@v7
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "24"

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Select release mode
        id: select-mode
        uses: changesets/action/select-mode@2d9f7af6402422be60d377f151c7618011bba45a # v2.0.0-next.4

  version:
    name: Version Packages
    needs: select-mode
    if: needs.select-mode.outputs.mode == 'version'
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: Checkout
        uses: actions/checkout@v7
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "24"

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Create or update release PR
        uses: changesets/action/version@2d9f7af6402422be60d377f151c7618011bba45a # v2.0.0-next.4
        with:
          github-token: ${{ github.token }}
          script: pnpm exec repoctl changeset version

  release-matrix:
    name: Generate Release Matrix
    needs: select-mode
    if: needs.select-mode.outputs.mode == 'publish'
    uses: ./.github/workflows/repoctl-matrix.yml
    permissions:
      contents: read
    with:
      name: release

  build-release-artifacts:
    name: Build ${{ matrix.component }} ${{ matrix.version }} for ${{ matrix.target }}
    needs: [select-mode, release-matrix]
    if: needs.select-mode.outputs.mode == 'publish'
    runs-on: ${{ matrix.runner }}
    timeout-minutes: 45
    permissions:
      contents: read
    defaults:
      run:
        shell: bash
    strategy:
      fail-fast: true
      matrix: ${{ fromJSON(needs.release-matrix.outputs.matrix) }}
    steps:
      - name: Enable long Git paths
        if: runner.os == 'Windows'
        run: git config --system core.longpaths true

      - name: Checkout
        uses: actions/checkout@v7
        with:
          ref: ${{ github.sha }}
          submodules: recursive
          persist-credentials: false

      - name: Setup ${{ matrix.component }} ${{ matrix.version }}
        uses: ./.github/actions/setup-repo
        with:
          component: ${{ matrix.component }}
          version: ${{ matrix.version }}
          target: ${{ matrix.target }}

      - name: Build release artifact
        id: build
        env:
          TARGET_CC: clang
        run: >
          pnpm exec repoctl build artifact
          --component "${{ matrix.component }}"
          --version "${{ matrix.version }}"
          --target "${{ matrix.target }}"

      - name: Upload release artifact
        uses: actions/upload-artifact@v7
        with:
          name: ${{ matrix.artifactName }}
          path: ${{ steps.build.outputs.artifact_path }}
          if-no-files-found: error

  pack:
    name: Pack Packages
    needs: [select-mode, build-release-artifacts]
    if: needs.select-mode.outputs.mode == 'publish'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    outputs:
      pack-dir-artifact-id: ${{ steps.pack.outputs.pack-dir-artifact-id }}
    steps:
      - name: Checkout
        uses: actions/checkout@v7
        with:
          ref: ${{ github.sha }}
          persist-credentials: false

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "24"

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Download platform binaries
        uses: actions/download-artifact@v8
        with:
          pattern: "*__*"
          path: _release-artifacts

      - name: Assemble platform packages
        run: pnpm exec repoctl packages assemble --artifacts _release-artifacts

      - name: Prepare platform packages
        run: pnpm exec repoctl packages prepare

      - name: Verify platform binaries
        run: pnpm exec repoctl build verify-release

      - name: Build CLI bundle
        run: pnpm exec repoctl build cli

      - name: Pack packages
        id: pack
        uses: changesets/action/pack@2d9f7af6402422be60d377f151c7618011bba45a # v2.0.0-next.4
        with:
          publish-plan-artifact-id: ${{ needs.select-mode.outputs.publish-plan-artifact-id }}

  publish:
    name: Publish Packages
    needs: [select-mode, pack]
    if: needs.select-mode.outputs.mode == 'publish'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write
      id-token: write
    steps:
      - name: Checkout
        uses: actions/checkout@v7
        with:
          ref: ${{ github.sha }}
          persist-credentials: false

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "24"
          registry-url: "https://registry.npmjs.org"

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Publish packages and create releases
        uses: changesets/action/publish@2d9f7af6402422be60d377f151c7618011bba45a # v2.0.0-next.4
        with:
          github-token: ${{ github.token }}
          pack-dir-artifact-id: ${{ needs.pack.outputs.pack-dir-artifact-id }}
          push-git-tags: true
          create-github-releases: true
        env:
          NPM_CONFIG_PROVENANCE: "true"
```

### `native/effect-tsgo/.github/workflows/repoctl-matrix.yml`

Mode `100644`, blob `6f1805e7a11e0a80d220d296f8814734df2a95ba`, SHA256 `0d7b3ecdf66eaeb3359ce1745792f47e674d4638af7b49eb9b89bc7fcedb4788`, 1029 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Generate repoctl Matrix

on:
  workflow_call:
    inputs:
      name:
        description: repoctl matrix name
        required: true
        type: string
    outputs:
      matrix:
        description: Generated JSON matrix
        value: ${{ jobs.matrix.outputs.matrix }}

permissions: {}

jobs:
  matrix:
    name: Generate ${{ inputs.name }} matrix
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
    outputs:
      matrix: ${{ steps.matrix.outputs.matrix }}

    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "24"

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate matrix
        id: matrix
        env:
          MATRIX_NAME: ${{ inputs.name }}
        run: echo "matrix=$(pnpm --silent exec repoctl matrix "$MATRIX_NAME")" >> "$GITHUB_OUTPUT"
```

### `native/effect-tsgo/.github/workflows/update-generated.yml`

Mode `100644`, blob `63df6622173db238234da9b4ed21880befdf4e03`, SHA256 `3f9136158391b718c2dbc653a9f11b105570126f1f0ea5a413922284834b648b`, 1651 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Update Generated Branches

on:
  push:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: update-generated-${{ github.ref }}
  cancel-in-progress: true

permissions: {}

jobs:
  matrix:
    if: github.repository_owner == 'Effect-TS'
    uses: ./.github/workflows/repoctl-matrix.yml
    permissions:
      contents: read
    with:
      name: generated

  update:
    name: Update ${{ matrix.branch }}
    needs: matrix
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write
      pull-requests: write
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

      - name: Open generated branch pull request
        env:
          COMPONENT: ${{ matrix.component }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GENERATED_BRANCH: ${{ matrix.branch }}
          GENERATED_NAME: ${{ matrix.name }}
        run: |
          generated_slug="${GENERATED_BRANCH//\//-}"
          pnpm exec repoctl github open-pr-if-changed \
            --base "$GENERATED_BRANCH" \
            --head-prefix "automation/update-${generated_slug}" \
            --title "chore: update ${GENERATED_BRANCH}" \
            --body "Generated ${GENERATED_NAME} ${COMPONENT} component from main commit ${{ github.sha }}." \
            --commit-message "chore: update ${GENERATED_BRANCH}"
```

### `native/effect-tsgo/.github/workflows/update-upstreams.yml`

Mode `100644`, blob `2b813bee0b596f23ce7832f9857c3da73c7576eb`, SHA256 `7c582066d3874b418a8e4ec462a61a8cba45d85b76e8bf7a0affebb8df0d3386`, 5385 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Update Upstreams

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

concurrency:
  group: update-upstreams-${{ github.ref }}
  cancel-in-progress: true

permissions: {}

jobs:
  update:
    name: Update upstream metadata
    if: github.repository_owner == 'Effect-TS'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      checks: write
      contents: write
      pull-requests: write

    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup repository tools
        uses: ./.github/actions/setup-repo
        with:
          materialize: "false"

      - name: Update upstream metadata
        id: upstream
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm exec repoctl upstream update

      - name: Open metadata update pull request
        id: generated
        if: steps.upstream.outputs.has_changes == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_BODY: ${{ steps.upstream.outputs.description }}
        run: |
          pnpm exec repoctl github open-pr-if-changed \
            --base main \
            --head update-upstreams \
            --title 'chore: update upstreams' \
            --body "$PR_BODY" \
            --commit-message 'chore: update upstream metadata' \
            --check generation_check_id='Generate TypeScript next tag'

      - name: Setup TypeScript next tag
        if: steps.upstream.outputs.has_changes == 'true'
        run: pnpm exec repoctl submodules setup

      - name: Regenerate tsconfig schema
        if: steps.upstream.outputs.schema_changed == 'true'
        run: UPDATE_TSCONFIG_SCHEMA=1 go test ./etscore -run '^TestGenerateTSConfigSchemaMatchesReference$'

      - name: Regenerate Oxlint configuration schema
        if: steps.upstream.outputs.oxlint_schema_changed == 'true'
        run: UPDATE_OXLINT_SCHEMA=1 go test ./etscore -run '^TestGenerateOxlintSchemaMatchesReference$'

      - name: Install Nix
        if: steps.upstream.outputs.has_changes == 'true'
        uses: DeterminateSystems/determinate-nix-action@v3

      - name: Setup Nix cache
        if: steps.upstream.outputs.has_changes == 'true'
        uses: DeterminateSystems/flakehub-cache-action@e62e272c914d4ad8e4d1587a864e9c3ad2cba9de

      - name: Update Nix flake
        if: steps.upstream.outputs.has_changes == 'true'
        run: pnpm exec repoctl flake update

      - name: Write changeset
        if: steps.upstream.outputs.has_changes == 'true'
        run: |
          pnpm exec repoctl changeset add \
            --id update-upstreams \
            'Update the TypeScript next tag to [`${{ steps.upstream.outputs.next_spec }}`](https://www.npmjs.com/package/typescript/v/${{ steps.upstream.outputs.next_version }}), which ships [`typescript-go`](https://github.com/microsoft/typescript-go/commit/${{ steps.upstream.outputs.next_git_head }}) commit `${{ steps.upstream.outputs.next_git_head }}`, and update the TypeScript latest tag to [`${{ steps.upstream.outputs.latest_spec }}`](https://www.npmjs.com/package/typescript/v/${{ steps.upstream.outputs.latest_version }}).${{ steps.upstream.outputs.schema_changed == 'true' && ' Refresh the tsconfig schema from JSON Schema Store.' || '' }}${{ steps.upstream.outputs.oxlint_schema_changed == 'true' && ' Refresh the Oxlint configuration schema from the selected package.' || '' }}'

      - name: Update pull request with TypeScript next tag
        id: generated-tag
        if: steps.upstream.outputs.has_changes == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_BODY: ${{ steps.upstream.outputs.description }}
        run: |
          pnpm exec repoctl github open-pr-if-changed \
            --base main \
            --head update-upstreams \
            --title 'chore: update upstreams' \
            --body "$PR_BODY" \
            --commit-message 'chore: generate TypeScript next tag' \
            --check validation_check_id='Validate TypeScript next tag'

      - name: Publish generation result
        if: always()
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          pnpm exec repoctl github complete-check \
            --check-id '${{ steps.generated.outputs.generation_check_id }}' \
            --result '${{ job.status }}' \
            --success-message 'TypeScript next tag generated' \
            --failure-message 'TypeScript next-tag generation failed' \
            --summary 'See the workflow run for upstream setup and Nix output.'

      - name: Build TypeScript next tag
        if: steps.upstream.outputs.has_changes == 'true'
        run: pnpm exec repoctl build local

      - name: Test TypeScript next tag
        if: steps.upstream.outputs.has_changes == 'true'
        run: pnpm exec repoctl test

      - name: Publish TypeScript next-tag validation result
        if: always()
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          pnpm exec repoctl github complete-check \
            --check-id '${{ steps.generated-tag.outputs.validation_check_id }}' \
            --result '${{ job.status }}' \
            --success-message 'TypeScript next-tag validation passed' \
            --failure-message 'TypeScript next-tag validation failed' \
            --summary 'See the workflow run for setup, build, and test output.'
```

### `native/effect-tsgo/.github/workflows/validate-nix.yml`

Mode `100644`, blob `2f3fc8b99e447d83b0a889e460151c19cbb57260`, SHA256 `679316ff19aedddb760264b5a5e9e643012e60d073046882d5744ce461c03525`, 685 bytes.

Dependency role: Inspected workflow trigger, jobs/needs/matrix, permissions, toolchain setup and the build/test/release steps relevant to compiler, shim, backend or fixture use.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
name: Validate Nix

on:
  push:
    branches:
      - main

concurrency:
  group: validate-nix-${{ github.ref }}
  cancel-in-progress: true

permissions: {}

jobs:
  validate:
    name: Validate Nix (${{ matrix.os }})
    runs-on: ${{ matrix.os }}
    timeout-minutes: 30
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        os:
          - ubuntu-latest
          - ubuntu-24.04-arm
          - macos-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Install Nix
        uses: DeterminateSystems/determinate-nix-action@v3

      - name: Check flake
        run: nix flake check --no-write-lock-file
```
