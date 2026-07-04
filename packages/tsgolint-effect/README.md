# @tiara-stack/tsgolint-effect

Package boundary for the native tsgolint fork that runs Effect diagnostics.

The package currently resolves a locally built development binary from
`native/tsgolint-effect-fork/tsgolint`. When extracted to the standalone native
tooling monorepo, published packages should place platform binaries under
`vendor/<platform>-<arch>/tsgolint`.

Consumers should execute `tsgolint-effect` or resolve the exported
`./bin/tsgolint-effect` subpath instead of depending on the app repo's `native/`
directory layout.
