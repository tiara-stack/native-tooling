# Tiara Native Tooling

Standalone monorepo for Tiara Stack native lint tooling.

This repo owns the native forks and publishable npm package boundaries for:

- `@tiara-stack/tsgolint-effect`
- `@tiara-stack/oxlint-effect`
- `@tiara-stack/effect-vitest`
- `@tiara-stack/vite-plus`
- `@tiara-stack/vite-plus-core`

The GitHub Action that installs the scoped Vite+ package lives separately at
`tiara-stack/setup-vp`. This repo carries the Vite+ integration fork at
`packages/vite-plus-effect-fork` and an upstream-clean Effect v4 source fork at
`packages/effect-smol-fork`. Vite+ and Effect helper forks are JavaScript/CLI
tooling, so they live under `packages/` rather than `native/`; the actual
Go/Rust/compiler forks stay under `native/`.

The package layer uses normal Vite+ for TypeScript build, lint, format, and
tests. Native Go/Rust builds are explicit root scripts because they produce
platform binaries that are later staged into package `vendor/` directories.
Those `vendor/` directories are generated publish artifacts and are not tracked
in git.

## Development

```sh
pnpm install
pnpm build
pnpm native:build
pnpm native:stage
pnpm native:smoke
```

The custom Oxlint source is pinned to 1.87.0. Build it with Rust 1.99.0
and run `pnpm native:test:oxlint` to check the existing Effect rules through
the local CLI. See [the fork notes](native/oxc-oxlint-effect-fork/TIARA.md)
for the source commit and integration details.

`@tiara-stack/effect-vitest` is generated from
`packages/effect-smol-fork/packages/vitest` with Vitest imports rewritten to
Vite+ test exports. After pulling the Effect source fork, run:

```sh
pnpm effect-vitest:sync
```

The helper uses the Effect 4.0.1 source and the root Vitest 5 `TestRunner`
API. Runtime and type imports go through `@tiara-stack/vite-plus/test`.
Generation checks the runner, built exports, expected source imports, and README
before replacing the retained helper. The scoped Vite+ peer floor is derived
from the generated artifact's version. The optional Vitest peer describes the
`>=5.0.0 <6.0.0` compatibility range without installing another runner.

Vite+ is pinned to stable 1.0.0 at
`fc287d7b1c0dc008dbc65d1d2b2f51a44e2a5ea4`, with its Vitest 5.0.1 family.
Its source workspace bootstraps the pinned Vite and Rolldown sources, builds
Rolldown and Vite types, builds core, then builds the CLI and native binding.
It requires Node.js `^22.18.0 || ^24.11.0 || >=26.0.0` and the source fork's
`nightly-2026-08-02` Rust toolchain.
Source builds also require Corepack to select the fork's pinned pnpm 11.24.0.

```sh
pnpm install --frozen-lockfile
pnpm vite-plus:build:source
pnpm vite-plus:sync
pnpm effect-vitest:sync
```

The Vite+ generator packs these built local inputs into
`@tiara-stack/vite-plus` and `@tiara-stack/vite-plus-core`, both version 1.0.0.
The scoped core keeps the local build in the package dependency chain. Generation
checks the build hashes before replacing packages and records provenance in
`SOURCE.json`. It never copies an independently installed upstream CLI.
Run `pnpm check:vite-plus` and `pnpm check:effect-vitest:consumer` after building
the wrappers to check package contracts and the packed helper runtime.

Repository scripts resolve `vite-plus` and `vite` to the local source workspace.
Development linting selects explicit `TIARA_*` overrides first, then native builds
in this checkout. Missing builds fail with their expected path. Published
consumers resolve the native wrapper packages instead. The Vite lint config
handoff remains enabled. The `vp-oxlint` launcher loads serializable Vite lint
settings and passes them to the native binary while preserving relative paths.
Use `vp-oxlint --lsp` for editor integration. It refreshes the native settings
when the Vite configuration changes and removes its temporary files on exit.

These version labels identify local generated artifacts. They do not publish
packages.

## Publishing Shape

The current packages resolve binaries in this order:

1. explicit environment overrides
2. `vendor/<platform>-<arch>/<binary>` in the published package
3. local development builds under `native/`

Release CI should build native binaries per platform, stage them with
`pnpm native:stage`, and upload package builds through Vite+'s staged
publishing passthrough:

```sh
pnpm publish:stage
vp pm stage list
vp pm stage approve <stage-id>
```

`vp pm stage publish` uploads without 2FA so CI can perform the staging step.
Approval or rejection should happen from a trusted maintainer device.

## CI and Trusted Publishing

GitHub Actions owns three workflows:

- `.github/workflows/ci.yml` builds, lints, tests, builds native Go/Rust
  tooling, stages the Linux x64 binaries, and runs the headless smoke test.
- `.github/workflows/publish.yml` builds the same artifacts and calls
  `vp pm stage publish --provenance` with GitHub OIDC enabled.
- `.github/workflows/vite-plus.yml` runs a focused check for the scoped Vite+
  package and setup action wiring.

To enable npm trusted publishing, configure each npm package with a trusted
publisher entry:

- package: `@tiara-stack/tsgolint-effect`
- package: `@tiara-stack/oxlint-effect`
- package: `@tiara-stack/effect-vitest`
- package: `@tiara-stack/vite-plus`
- package: `@tiara-stack/vite-plus-core`
- owner/repository: `tiara-stack/native-tooling`
- workflow file: `publish.yml`
- environment: `npm`

The workflow is safe to run manually with its default `dry-run` input. For a
real staged publish, run it with `dry-run=false` or push a `v*` tag. After CI
stages the packages, approve the staged versions from a trusted maintainer
device:

```sh
vp pm stage list
vp pm stage approve <stage-id>
```

The `patches/` directory contains the current consumer-side pnpm patches for
Vite+ and Oxlint. Vite+ customizations now live in
`packages/vite-plus-effect-fork` and its generated scoped artifacts. The old
Vite+ 0.1.15 patch is historical and is no longer checked against that retired
release. The Oxlint patch remains a separate native tooling check.
