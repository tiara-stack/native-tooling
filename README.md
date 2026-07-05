# Tiara Native Tooling

Standalone monorepo for Tiara Stack native lint tooling.

This repo owns the native forks and publishable npm package boundaries for:

- `@tiara-stack/tsgolint-effect`
- `@tiara-stack/oxlint-effect`
- `@tiara-stack/effect-vitest`
- `@tiara-stack/vite-plus`

It also carries the Vite+ integration fork at
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

`@tiara-stack/effect-vitest` is generated from
`packages/effect-smol-fork/packages/vitest` with Vitest imports rewritten to
Vite+ test exports. After pulling the Effect source fork, run:

```sh
pnpm effect-vitest:sync
```

`@tiara-stack/vite-plus` is generated from the installed upstream `vite-plus`
package with the tsgolint resolver patched to prefer
`@tiara-stack/tsgolint-effect`. After updating the Vite+ source fork and
installed upstream package, run:

```sh
pnpm vite-plus:sync
```

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

GitHub Actions owns two workflows:

- `.github/workflows/ci.yml` builds, lints, tests, builds native Go/Rust
  tooling, stages the Linux x64 binaries, and runs the headless smoke test.
- `.github/workflows/publish.yml` builds the same artifacts and calls
  `vp pm stage publish --provenance` with GitHub OIDC enabled.

To enable npm trusted publishing, configure each npm package with a trusted
publisher entry:

- package: `@tiara-stack/tsgolint-effect`
- package: `@tiara-stack/oxlint-effect`
- package: `@tiara-stack/effect-vitest`
- package: `@tiara-stack/vite-plus`
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
Vite+ and Oxlint. The Vite+ fork source now lives in
`packages/vite-plus-effect-fork`; the patch files are transitional consumer
artifacts until app repos can depend directly on the forked packages or the
integration is upstreamed.
