# Tiara Native Tooling

Standalone monorepo for Tiara Stack native lint tooling.

This repo owns the native forks and publishable npm package boundaries for:

- `@tiara-stack/tsgolint-effect`
- `@tiara-stack/oxlint-effect`

The package layer uses normal Vite+ for TypeScript build, lint, format, and
tests. Native Go/Rust builds are explicit root scripts because they produce
platform binaries that are later staged into package `vendor/` directories.

## Development

```sh
pnpm install
pnpm build
pnpm native:build
pnpm native:stage
pnpm native:smoke
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

The `patches/` directory contains the current consumer-side pnpm patches for
Vite+ and Oxlint. These are kept here so app repos can consume a versioned patch
source until the integration can be upstreamed or replaced with first-class
configuration.
