# Effect 4.0.1 upgrade investigation

_Reviewed 2026-10-06._ This is an upgrade assessment for the native-tooling monorepo. It does not apply the upgrade or run the test suite.

## Recommendation

Proceed with a coordinated refresh to Effect 4.0.1. This repo already carries Effect v4 source, so the v3-to-v4 migration guide is not the whole job. The main work is bringing the beta.93 source fork forward, aligning the older Effect language-service fixtures, and resolving one concrete test-runner mismatch before updating the generated `@tiara-stack/effect-vitest` package.

The immediate compatibility blocker is Vitest. Effect's `@effect/vitest@4.0.1` declares Vitest `>=5.0.0 <6.0.0`, while this repo's Vite+ package ships Vitest and `@vitest/*` 4.1.9. Bumping only `effect` would leave the custom test helper on an unsupported runner. The [Effect 4.0.1 Vitest manifest](https://github.com/Effect-TS/effect/blob/effect%404.0.1/packages/vitest/package.json) and this repo's [Vite+ package manifest](../packages/vite-plus/package.json) show the mismatch.

## Current state in this repo

- The root pnpm catalog and lockfile resolve `effect@4.0.0-beta.93`. The source snapshot in `packages/effect-smol-fork` is also beta.93, and its `@effect/vitest` package accepts Vitest 3 or 4. The generated `@tiara-stack/effect-vitest` package is versioned `4.0.0-beta.93.tiara.2`. See [pnpm-workspace.yaml](../pnpm-workspace.yaml), [effect source manifest](../packages/effect-smol-fork/packages/effect/package.json), [upstream Vitest manifest](../packages/effect-smol-fork/packages/vitest/package.json), and [generated package manifest](../packages/effect-vitest/package.json).
- `scripts/sync-effect-vitest.mjs` copies the helper from the source fork and rewrites its imports to Vite+ exports. It also carries local type workarounds. Regenerate from the refreshed source, then review those replacements against the new source rather than assuming they still apply.
- The embedded Effect TypeScript-Go subrepo is at `@effect/tsgo@0.16.0`. Its dev dependencies and three v4 test fixtures still use `effect@4.0.0-beta.83`; the CLI also depends on matching `@effect/platform-node` and `@effect/platform-node-shared` betas. See [tsgo package manifest](../native/effect-tsgo/_packages/tsgo/package.json) and `native/effect-tsgo/testdata/tests/effect-v4*/package.json`.
- The beta.93 source snapshot contains 1,191 textual `effect/unstable/` import-path references across 341 TypeScript files. The 4.0.1 migration guide says these paths no longer have compatibility exports: for example, `effect/unstable/http` becomes `effect/http`. This is a broad source refresh, not a small catalog change. See the [tagged migration guide](https://github.com/Effect-TS/effect/blob/effect%404.0.1/MIGRATION.md).
- The root workspace uses TypeScript `^5.9.3`. That meets Effect's TypeScript 5.9 minimum. Effect recommends TypeScript 7 for its tooling, but does not require TypeScript 7 to use the core package. The source-fork workspace currently uses TypeScript 6 plus a TypeScript 7 native-preview build. Effect's TypeScript-Go service has its own requirement: its [README](https://github.com/Effect-TS/tsgo) calls for a native TypeScript 7 installation.

## What 4.0.1 changes

Effect 4.0.1 is a stable patch release. Its core release notes include a change to shared-cache interruption behavior: an in-flight computation continues until all callers are interrupted, interrupted results are not cached, and a new call can start while an abandoned computation finishes finalizing. The release also changes AI system-message handling and caches AI response schemas. The source fork contains those areas, so the upstream source refresh should include regression coverage for affected cache and AI behavior. See the [4.0.1 release notes](https://github.com/Effect-TS/effect/releases/tag/effect%404.0.1).

The stable v4 ecosystem publishes related Effect packages at matching versions. Keep `effect`, `@effect/vitest`, `@effect/platform-node`, `@effect/platform-node-shared`, and any other retained Effect packages on 4.0.1 together. The v3 migration guide is useful for package consolidation and the Schema rewrite, but this repo's beta source has already adopted much of v4's structure. Focus review on changes since beta.93 and on the modules marked unstable, whose APIs can still change. Effect's [core requirements](https://github.com/Effect-TS/effect/blob/effect%404.0.1/README.md) are TypeScript 5.9+, strict type-checking, and Node 18+ for the core runtime. Some integration packages require newer Node versions.

## Suggested upgrade sequence

1. Refresh `packages/effect-smol-fork` from the Effect 4.0.1 release source and update its lockfile and package manifests as a unit. Review the import-path changes and any beta-to-stable API changes before treating it as a mechanical sync.
2. Align the root Effect catalog and lockfile. Update the embedded tsgo package and its v4 fixtures to 4.0.1, including the matching Node platform packages. Keep `@effect/tsgo`'s own version separate from Effect's synchronized package version.
3. Upgrade the Vite+ test stack to Vitest 5, then raise the minimum `@tiara-stack/vite-plus` version required by `@tiara-stack/effect-vitest`. Sync the helper from the new upstream `@effect/vitest` source and review its local Vite+ rewrites and workarounds.
4. Check Effect-specific Oxlint and TypeScript-Go diagnostics against the refreshed API and fixtures. The native lint and compiler packages have their own release versions; update their Effect behavior and tests without tying their package versions to `4.0.1` automatically.
5. Once implementation starts, run the repo's package checks and native smoke path. Include focused coverage for Effect core, `@effect/vitest` with Vite+ and Vitest 5, and the Effect-specific diagnostics. TypeScript 7 is a worthwhile toolchain target for tsgo, but can be a separate decision from making the core dependency update.

## Toolchain judgment

The Effect 4.0.1 source repository provides a useful reference toolchain, including TypeScript 7, Vitest 5, Oxlint, and dprint ([tagged root manifest](https://github.com/Effect-TS/effect/blob/effect%404.0.1/package.json)). Those versions are not all requirements for consuming Effect. Here, Vitest 5 is required by the Effect test helper; TypeScript 7 is required if this repo adopts the native TypeScript-Go Effect service; formatter changes are optional. The deciding upgrade work is therefore the Effect source/fixture refresh and the Vite+ to Vitest 5 compatibility step.

## Addendum: Oxlint custom type-aware rules

_Reviewed 2026-10-06._ The latest Oxlint release is v1.87.0, released October 5. Oxlint now has stable type-aware linting through its separate `oxlint-tsgolint` backend, which runs rules built around the TypeScript-Go checker. That covers upstream TypeScript-ESLint type-aware rules, but it does not provide a supported API for adding new semantic rules. The current [type-aware guide](https://oxc.rs/docs/guide/usage/linter/type-aware.html) describes that built-in backend, and the upstream [tsgolint README](https://github.com/oxc-project/tsgolint/blob/main/README.md) says it is not accepting rules beyond TypeScript-ESLint's set.

Oxlint's JS plugin API can load custom rules and ESLint-compatible plugins, but its [support table](https://oxc.rs/docs/guide/usage/linter/js-plugins.html) still lists rules that require TypeScript type-awareness as unsupported. The latest Oxlint release notes do not add a custom semantic-rule API ([v1.87.0](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.87.0)). JS plugins are therefore an option for new AST-only checks, not a replacement for the Effect checks that inspect types.

The repo's current integration confirms this distinction. The [custom tsgolint bridge](../native/tsgolint-effect-fork/internal/effectlint/effectlint.go) runs Effect-tsgo diagnostics with a TypeScript program, checker, and source file. The custom [Oxlint Effect rules](../native/oxc-oxlint-effect-fork/crates/oxc_linter/src/rules/effect/outdated_api.rs) are marker rules that forward those diagnostic IDs into Oxlint's configuration and reporting system. There are 82 of these marker rules in the fork. This is the integration the regular Oxlint JS plugin API still cannot express.

**Recommendation.** Keep the custom tsgolint bridge for Effect semantic diagnostics. Keep the `@tiara-stack/oxlint-effect` binary if consumers need the Effect rule namespace, rule configuration, and diagnostics in the Oxlint CLI. A separate `effect-tsgo` check path could replace those parts only after its diagnostics, severity configuration, and output are wired into CI as a separate tool. This would be an architecture change, not a version bump. Some rules may later move to a JS plugin if they need only AST information, but the current 82 rules are wired through the type-aware bridge.

There is also a maintenance gap to plan for. The Rust fork's Cargo manifests say Oxlint 1.58.0, while the Vite+ package manifest pins upstream Oxlint 1.72.0 and the current upstream release is 1.87.0. If the Rust fork stays, rebasing its marker-rule changes onto a newer Oxlint release should be part of maintenance; this research did not test that rebase.

One routing detail matters when deciding whether to keep both forks. The generated Vite+ `bin/oxlint` resolves the upstream `oxlint` package and sets `OXLINT_TSGOLINT_PATH` to the Tiara tsgolint package. The separate `@tiara-stack/oxlint-effect` wrapper resolves the custom Rust binary. So the tsgolint fork is wired into Vite+, while the Rust Oxlint fork is a separate CLI path. If Vite+ is expected to expose the custom `effect/*` rule IDs, the current wrapper path needs a closer runtime check; this investigation did not run it.

## Addendum: Effect diagnostic ruleset

The embedded `@effect/tsgo@0.16.0` metadata has 82 diagnostics. Its matching Oxlint fork has 82 marker rules, one per diagnostic. Current upstream `@effect/tsgo@0.48.1` has 118 diagnostics: 36 names were added, none of the 82 existing names were removed or renamed. The exact Effect 4.0.1 source tag declares `@effect/tsgo: ^0.46.1`; that version's metadata has 116 rules, 34 more than the embedded copy. The two rules added later in 0.47.0 are `experimentalApiUsage` and `unstableApiUsage`. See the [Effect 4.0.1 package manifest](https://github.com/Effect-TS/effect/blob/effect%404.0.1/package.json), [0.46.1 metadata](https://github.com/Effect-TS/tsgo/blob/f1a7cad0292d9d315e7f87694f127f605711d55e/_packages/tsgo/src/metadata.json), [latest metadata](https://github.com/Effect-TS/tsgo/blob/d1e539c4956bf4b2d1643c58e1477f7597b20d5b/_packages/tsgo/src/metadata.json), and the [tsgo changelog](https://github.com/Effect-TS/tsgo/blob/main/_packages/tsgo/CHANGELOG.md).

The 34 rules present by `@effect/tsgo@0.46.1` are:

- **Correctness:** `floatingEffectInVitest`, `obsoleteMatchImport`, `obsoleteSchemaImport`, `promiseInEffectSuccess`, `schemaLiteralNonFinite`, `schemaOpaqueInstanceMember`.
- **Anti-pattern:** `preferUnsafeConstructor`.
- **Effect-native:** `abortControllerInEffect`, `schemaSync`.
- **Style:** `acquireReleaseDisposable`, `allOfMapToForEach`, `catchAllTagDispatchToCatchTag`, `catchChainToFirstSuccessOf`, `catchConditionalRefailToCatchIf`, `catchDieToOrDie`, `catchIfTagToCatchTag`, `catchRefailToTapError`, `catchTagToCatchReason`, `flatMapConditionalToFilterOrFail`, `flatMapIgnoredParamToAndThen`, `flatMapToMap`, `mapSomeToAsSome`, `matchEffectToMapBoth`, `matchEffectToMatch`, `missingPipeableSignature`, `optionMatchToFromOption`, `preferSchemaTypeProperty`, `preferSucceedSomeOrNone`, `preferTypedSchemaDecoder`, `provideLayerSucceedToProvideService`, `raceFirstWithSleepToTimeout`, `runOfExitToRunExit`, `syncToSucceed`, `timeoutCatchTagToTimeoutOrElse`.

The new rules mostly add suggestions for current Effect APIs. `floatingEffectInVitest` flags Effects returned from non-Effect-aware Vitest callbacks. The two later stability rules warn when code uses APIs marked `@stability experimental` or `@stability unstable`.

None of the 82 shared rules changed default severity. Other metadata changed: `floatingEffect` gained a fixer; `genericEffectServices` is now marked v3-only; `schemaSyncInEffect` now supports v3 and v4; `unsafeEffectTypeAssertion` moved from Effect-native to correctness; and the two `cryptoRandomUUID` descriptions now recommend Effect Crypto instead of Effect Random. The local metadata has only the `effect-native` preset. Upstream adds `recommended`, `strict`, `correctness`, `antipattern`, and `style`; its `effect-native` preset adds `abortControllerInEffect` and `schemaSync` and drops `unsafeEffectTypeAssertion`.

This changes the fork work estimate. The tsgolint adapter builds its marker rules from Effect-tsgo's `effectrules.All`, but the Oxlint Rust fork has a static list of 82 marker files. To expose the full Effect 4.0.1 toolchain ruleset through `oxlint-effect`, add 34 markers for the `0.46.1` baseline. To target the latest `0.48.1`, add 36.
