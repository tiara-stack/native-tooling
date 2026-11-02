# Tiara Oxlint fork

The source baseline is Oxlint 1.87.0, upstream commit
[`2bd08ebe8f36fcf1954a675ffdeb4c6d0129f609`](https://github.com/oxc-project/oxc/commit/2bd08ebe8f36fcf1954a675ffdeb4c6d0129f609).
The Rust toolchain is 1.99.0, as pinned by upstream. `.gitrepo` records the
release tag and commit.

Tiara carries 82 Effect marker rules from its Oxlint 1.58.0 fork. Their
public `effect/*` names, categories, and default severities are retained.
The markers now include the introduction-version metadata required by
Oxlint 1.87.0. They delegate semantic analysis to the repo's tsgolint fork
through headless protocol version 2.

The custom integration consists of:

- The Effect plugin and marker modules in `crates/oxc_linter/src`.
- Translation between public kebab-case names and the backend's snake_case
  names for requests, severity lookup, diagnostics, and disable comments.
- Effect defaults in the terminal and JSON rule lists.
- Repo-local backend discovery after an explicit `OXLINT_TSGOLINT_PATH`
  override and before package or global binaries. A checkout with no local
  tsgolint build reports the build command instead of selecting another binary.

Regenerate the rule enum and runners with `cargo lintgen` after changing
the marker modules. Do not edit their generated files by hand.

From the monorepo root, build and exercise the source binaries with:

```sh
pnpm install --frozen-lockfile
pnpm native:build:tsgolint
pnpm native:build:oxlint
pnpm native:test:oxlint
pnpm native:smoke
```

`native:test:oxlint` runs the release CLI against a framed protocol fixture
for every marker. It checks rule names, severities, disabled rules, source
locations, disable comments, TypeScript rule reporting, and backend selection.
It also runs a real Effect diagnostic through the local tsgolint binary.

The consumer patch in `patches/oxlint@1.87.0-native-effect.patch` targets
the matching npm CLI and retains the Vite lint-config handoff. Its source
checkout path selects the local Oxlint build before installed wrappers.
`pnpm check:patches` checks application to the released npm artifact.

This port does not add the 34 later Effect markers or implement new Effect
fixes and suggestions. Those changes belong to TIA-316. Oxlint 1.87.0 is
the approved custom port; it is not an upstream-certified pairing with
Effect-tsgo 0.46.1.
