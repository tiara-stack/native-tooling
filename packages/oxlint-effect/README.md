# @tiara-stack/oxlint-effect

Package boundary for the patched Oxlint binary that knows how to request the
Effect tsgolint rules.

The package currently resolves a locally built development binary from
`native/oxc-oxlint-effect-fork/target/release/oxlint`. When extracted to the
standalone native tooling monorepo, published packages should place platform
binaries under `vendor/<platform>-<arch>/oxlint`.

Consumers should execute `oxlint-effect` or resolve the exported
`./bin/oxlint-effect` subpath instead of depending on the app repo's `native/`
directory layout.
