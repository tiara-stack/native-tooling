# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/effect-tsgo/_tools/gen_shims/config/ls/change/extra-shim.json`

Mode `100644`, blob `ec88b9395a02beee2c7d59bbd6d647fd4d31b5a2`, SHA256 `a47b18838d3d9e5d1a5feab5d43e903938db6ef23b29e5afdc6ecc0a523aa61f`, 67 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "ExtraMethods": {
    "Tracker": ["getNonformattedText"]
  }
}
```

### `native/effect-tsgo/_tools/gen_shims/config/ls/extra-shim.json`

Mode `100644`, blob `1b3ed841fd756268dc92951534d43d45e2fbb87d`, SHA256 `2844c364b9d1d119652fc38390142836ba700b6d7cc102a66f92dc03cd6b2196`, 194 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "ExtraFunctions": ["getJSDocOrTag"],
  "ExtraMethods": {
    "LanguageService": ["getQuickInfoAndDocumentationForSymbol"]
  },
  "ExtraFields": {
    "LanguageService": ["converters"]
  }
}
```

### `native/effect-tsgo/_tools/gen_shims/go.mod`

Mode `100644`, blob `e75a93f240ee807089ae24e290c31822cdb96a57`, SHA256 `1d70c04f4b0c0e313d6263061803b690e002038c4ec0c6b5e0e341eb9c34710b`, 287 bytes.

Dependency role: Inspected module identity and dependency/replacement boundary against selected provider/compiler modules and local consumer graph.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
module github.com/effect-ts/tsgo/_tools/gen_shims

go 1.27.0

require (
	golang.org/x/mod v0.37.0
	golang.org/x/text v0.38.0
	golang.org/x/tools v0.47.0
)

require (
	github.com/google/go-cmp v0.7.0 // indirect
	golang.org/x/sync v0.21.0 // indirect
)

ignore (
	./config
	./providers
)
```

### `native/effect-tsgo/_tools/gen_shims/go.sum`

Mode `100644`, blob `a1cf1f108e699fa1e4daf455ecd0461faf7b68eb`, SHA256 `3336790aa43c6bc9fbc352914b8c35f7d82e9650f3dc1b90473634f876dfeaea`, 787 bytes.

Dependency role: Inspected checksum/module boundary and its relation to selected provider/compiler modules.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
github.com/google/go-cmp v0.7.0 h1:wk8382ETsv4JYUZwIsn6YpYiWiBsYLSJiTsyBybVuN8=
github.com/google/go-cmp v0.7.0/go.mod h1:pXiqmnSA92OHEEa9HXL2W4E7lf9JzCmGVUdgjX3N/iU=
golang.org/x/mod v0.37.0 h1:vF1DjpVEshcIqoEaauuHebaLk1O1forxjxBaVn884JQ=
golang.org/x/mod v0.37.0/go.mod h1:m8S8VeM9r4dzDwjrKO0a1sZP3YjeMamRRlD+fmR2Q/0=
golang.org/x/sync v0.21.0 h1:HLII4xRRTtCRkxYp4HNFF0Js/Og6q2i++KXbg0gHCwM=
golang.org/x/sync v0.21.0/go.mod h1:9xrNwdLfx4jkKbNva9FpL6vEN7evnE43NNNJQ2LF3+0=
golang.org/x/text v0.38.0 h1:sXmwo9DwP3OK9EZ7PqAdaooSGozfl/3a6/xJcbzPRhE=
golang.org/x/text v0.38.0/go.mod h1:YXZt3QhHUKYT53r2lLKFIVi6Ao1jdzrTR/KQ09qyxF4=
golang.org/x/tools v0.47.0 h1:7Kn5x/d1svx/PzryTsqeoZN4TZwqeH5pGWjefhLi/1Q=
golang.org/x/tools v0.47.0/go.mod h1:dFHnyTvFWY212G+h7ZY4Vsp/K3U4/7W9TyVaAul8uCA=
```

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/compiler/extra-shim.json`

Mode `100644`, blob `27b41f956264a9c981560db8bfd40f4e4ab56719`, SHA256 `bb4c96450330adb5b2ec1b27550ef813a4a6b5220a5c7753f88058b9f824ffb0`, 45 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "IgnoreFunctions": ["NewCompilerHost"]
}
```

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/tsoptions/extra-shim.json`

Mode `100644`, blob `cb667a607b060fc386c3d833f4b0d5e4fc4909e4`, SHA256 `d28beee7c3bbc3fbed70d787b226bcc5d1e49dcbd1cfc2f1bb54f20f4758c18c`, 96 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "IgnoreFunctions": ["ParseJsonSourceFileConfigFileContent", "ParseJsonConfigFileContent"]
}
```

### `native/effect-tsgo/_tools/gen_shims/providers/typescript/compiler/extra-shim.json`

Mode `100644`, blob `27b41f956264a9c981560db8bfd40f4e4ab56719`, SHA256 `bb4c96450330adb5b2ec1b27550ef813a4a6b5220a5c7753f88058b9f824ffb0`, 45 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "IgnoreFunctions": ["NewCompilerHost"]
}
```

### `native/effect-tsgo/_tools/gen_shims/providers/typescript/tsoptions/extra-shim.json`

Mode `100644`, blob `cb667a607b060fc386c3d833f4b0d5e4fc4909e4`, SHA256 `d28beee7c3bbc3fbed70d787b226bcc5d1e49dcbd1cfc2f1bb54f20f4758c18c`, 96 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "IgnoreFunctions": ["ParseJsonSourceFileConfigFileContent", "ParseJsonConfigFileContent"]
}
```
