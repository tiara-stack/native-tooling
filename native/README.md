# Native Go sources

The compiler, Effect language service, and tsgolint backend share the source
revisions in [sources.json](./sources.json). Effect-tsgo has its own version,
0.46.1. Its Effect v4 fixtures and retained Node platform dependencies use 4.0.1.
The native compiler is TypeScript 7.0.2. The root TypeScript dependency remains
5.9 for package consumers.

Use Go 1.27 or newer to regenerate the bindings. From the repository root:

```sh
pnpm --dir native/effect-tsgo install --frozen-lockfile
pnpm native:generate
pnpm native:build:tsgo
pnpm native:build:tsgolint
pnpm native:smoke
```

`native:generate` reads the checked-in, patched compiler. It does not reset or
fetch source checkouts. It regenerates compiler diagnostics, merges Effect's
and tsgolint's shim configuration, creates the canonical TypeScript shim
facades for the TypeScript-Go provider, and synchronizes the retained tsgolint
bindings and collections. It also builds the embedded fixture archive from the
installed v3 and stable v4 fixture packages. Go module replacements resolve these bindings and
both tools to workspace source. The embedded Effect package's `setup-repo`
script invokes this same generation command.

When refreshing the compiler source, apply the patches in
`tsgolint-effect-fork/patches` first, then those in
`effect-tsgo/_patches/typescript-go`, each in filename order. The diagnostics
patch uses this monorepo's sibling directory layout. Apply the Tiara overlays in
[`patches/typescript-go`](./patches/typescript-go) last. These overlays preserve
the original imported patches and restore the native configuration contract:
Effect plugin state stays internal to compiler options, incremental build info
retains that state, and JSON syntax diagnostics follow TypeScript 7.0.2.
Regenerate after applying the patches and before building either binary. Keep
both the patch inputs and generated files in the change.

The development Effect CLI resolves the compiler at
`typescript-go/built/local/tsgo`. The Tiara wrappers retain their explicit
binary overrides and repository-local source discovery. Source checkouts require
the local builds even when staged wrapper binaries are present. Build the native
binaries before invoking these development commands.
