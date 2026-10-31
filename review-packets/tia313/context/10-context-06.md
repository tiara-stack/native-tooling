# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/effect-tsgo/go.work.sum`

Mode `100644`, blob `700a20dcc3ff02d1548ec4fbf0caacd4320729f6`, SHA256 `b5026f52788d11095ab91ee605d4c38b608adcee6639b4ee5c85970255956b77`, 5207 bytes.

Dependency role: Read full workspace checksum boundary; considered with go.work modules, per-module go.mod requirements and replacement graph for compiler, Effect service, and tsgolint.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
github.com/dlclark/regexp2/v2 v2.5.2 h1:HAsucWRhsqcDzl6Ua9aR8JwYOTzrZyPrF0/FNxJVAI0=
github.com/dlclark/regexp2/v2 v2.5.2/go.mod h1:avUrQvPaLz2DrFNHJF0taWAFFX2C1GMSSoeiqFjcBmU=
github.com/google/go-cmp v0.6.0/go.mod h1:17dUlkBOakJ0+DkrSSNjCkIjxS6bF9zb3elmeNGIjoY=
github.com/sirupsen/logrus v1.9.3/go.mod h1:naHLuLoDiP4jHNo9R0sCBMtWGeIprob74mVsIT4qYEQ=
github.com/yuin/goldmark v1.4.13/go.mod h1:6yULJ656Px+3vBD8DxQVa3kxgyrAnzto9xy5taEt/CY=
golang.org/x/crypto v0.47.0/go.mod h1:ff3Y9VzzKbwSSEzWqJsJVBnWmRwRSHt/6Op5n9bQc4A=
golang.org/x/crypto v0.48.0/go.mod h1:r0kV5h3qnFPlQnBSrULhlsRfryS2pmewsg+XfMgkVos=
golang.org/x/crypto v0.49.0/go.mod h1:ErX4dUh2UM+CFYiXZRTcMpEcN8b/1gxEuv3nODoYtCA=
golang.org/x/crypto v0.50.0/go.mod h1:3muZ7vA7PBCE6xgPX7nkzzjiUq87kRItoJQM1Yo8S+Q=
golang.org/x/crypto v0.51.0/go.mod h1:8AdwkbraGNABw2kOX6YFPs3WM22XqI4EXEd8g+x7Oc8=
golang.org/x/crypto v0.53.0/go.mod h1:DNLU434OwVakk9PzuwV8w62mAJpRJL3vsgcfp4Qnsio=
golang.org/x/crypto v0.54.0/go.mod h1:KWL8ny2AZdGR2cWmzeHrp2azQPGogOv+HeQaVEXC2dk=
golang.org/x/mod v0.32.0/go.mod h1:SgipZ/3h2Ci89DlEtEXWUk/HteuRin+HHhN+WbNhguU=
golang.org/x/mod v0.33.0/go.mod h1:swjeQEj+6r7fODbD2cqrnje9PnziFuw4bmLbBZFrQ5w=
golang.org/x/mod v0.34.0/go.mod h1:ykgH52iCZe79kzLLMhyCUzhMci+nQj+0XkbXpNYtVjY=
golang.org/x/mod v0.35.0/go.mod h1:+GwiRhIInF8wPm+4AoT6L0FA1QWAad3OMdTRx4tFYlU=
golang.org/x/mod v0.36.0/go.mod h1:moc6ELqsWcOw5Ef3xVprK5ul/MvtVvkIXLziUOICjUQ=
golang.org/x/mod v0.38.0 h1:MECBjubtXD7yj4HrhIUcywNaGeNVUdfVnxmPajOk4yk=
golang.org/x/mod v0.38.0/go.mod h1:V6Xz0pq8TQ3dGqVQ1FVHuelZpAL0uNhSkk9ogYP3c40=
golang.org/x/net v0.48.0/go.mod h1:+ndRgGjkh8FGtu1w1FGbEC31if4VrNVMuKTgcAAnQRY=
golang.org/x/net v0.49.0/go.mod h1:/ysNB2EvaqvesRkuLAyjI1ycPZlQHM3q01F02UY/MV8=
golang.org/x/net v0.50.0/go.mod h1:UgoSli3F/pBgdJBHCTc+tp3gmrU4XswgGRgtnwWTfyM=
golang.org/x/net v0.52.0/go.mod h1:R1MAz7uMZxVMualyPXb+VaqGSa3LIaUqk0eEt3w36Sw=
golang.org/x/net v0.53.0/go.mod h1:JvMuJH7rrdiCfbeHoo3fCQU24Lf5JJwT9W3sJFulfgs=
golang.org/x/net v0.54.0/go.mod h1:Sj4oj8jK6XmHpBZU/zWHw3BV3abl4Kvi+Ut7cQcY+cQ=
golang.org/x/net v0.56.0/go.mod h1:D3Ku6r+V6JROoZK144D2XfMHFcMq/0zSfLelVTCFKec=
golang.org/x/net v0.57.0/go.mod h1:KpXc8iv+r3XplLAG/f7Jsf9RPszJzdR0f58q9vGOuEU=
golang.org/x/net v0.59.0/go.mod h1:2DA/G1UfVbCpQPeWTmMPGY7Cs2PkBkwu743bVX5PIVg=
golang.org/x/sync v0.22.0 h1:SZjpbeLmrCk4xhRSZFNZW5gFUeCeFgjekvI/+gfScek=
golang.org/x/sync v0.22.0/go.mod h1:9xrNwdLfx4jkKbNva9FpL6vEN7evnE43NNNJQ2LF3+0=
golang.org/x/sys v0.30.0/go.mod h1:/VUhepiaJMQUp4+oa/7Zr1D23ma6VTLIYjOOTFZPUcA=
golang.org/x/sys v0.40.0/go.mod h1:OgkHotnGiDImocRcuBABYBEXf8A9a87e/uXjp9XT3ks=
golang.org/x/sys v0.42.0 h1:omrd2nAlyT5ESRdCLYdm3+fMfNFE/+Rf4bDIQImRJeo=
golang.org/x/sys v0.42.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/sys v0.44.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/sys v0.46.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/sys v0.47.0 h1:o7XGOvZQCADBQQ4Y7VNq2dRWQR7JmOUW8Kxx4ZsNgWs=
golang.org/x/sys v0.47.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/telemetry v0.0.0-20251203150158-8fff8a5912fc/go.mod h1:hKdjCMrbv9skySur+Nek8Hd0uJ0GuxJIoIX2payrIdQ=
golang.org/x/telemetry v0.0.0-20260109210033-bd525da824e2/go.mod h1:b7fPSJ0pKZ3ccUh8gnTONJxhn3c/PS6tyzQvyqw4iA8=
golang.org/x/telemetry v0.0.0-20260209163413-e7419c687ee4/go.mod h1:g5NllXBEermZrmR51cJDQxmJUHUOfRAaNyWBM+R+548=
golang.org/x/telemetry v0.0.0-20260311193753-579e4da9a98c/go.mod h1:TpUTTEp9frx7rTdLpC9gFG9kdI7zVLFTFFlqaH2Cncw=
golang.org/x/telemetry v0.0.0-20260409153401-be6f6cb8b1fa/go.mod h1:kHjTxDEnAu6/Nl9lDkzjWpR+bmKfxeiRuSDlsMb70gE=
golang.org/x/telemetry v0.0.0-20260508192327-42602be52be6/go.mod h1:Eqhaxk/wZsWEH8CRxLwj6xzEJbz7k1EFGqx7nyCoabE=
golang.org/x/telemetry v0.0.0-20260625142307-59b4966ccb57/go.mod h1:3AWMyWHS+caVoiEXpiq6+tzKA40J4vQT3MYr80ZtQpc=
golang.org/x/telemetry v0.0.0-20260708182218-49f421fb7959/go.mod h1:LV7u5Oco+Z/g6XI7PqN+EUUUGGkEcmB1uj2ceI0fOVg=
golang.org/x/telemetry v0.0.0-20260908163034-4bcc4b2ee518/go.mod h1:i+ivNqjDnTF3WTElsdk5g9V5DTSBYgdNo7xTU9SDwYA=
golang.org/x/term v0.39.0 h1:RclSuaJf32jOqZz74CkPA9qFuVTX7vhLlpfj/IGWlqY=
golang.org/x/term v0.39.0/go.mod h1:yxzUCTP/U+FzoxfdKmLaA0RV1WgE0VY7hXBwKtY/4ww=
golang.org/x/term v0.45.0 h1:NwWyBmoJCbfTHpxrWoZ9C6/VxOf7ic219I8xZZFdrf0=
golang.org/x/term v0.45.0/go.mod h1:9aqxs0blBcrm/n0L9QW0aRVD+ktan8ssZromtqJC43w=
golang.org/x/text v0.40.0 h1:Ub2Z6/xjgF1WrYQz2nuITOEegKFtiIy+rieRJ5lHZKs=
golang.org/x/text v0.40.0/go.mod h1:hpnzDAfGV753zIKo+wk3u1bVKCGPbrnF7+7LBF/UHVY=
golang.org/x/tools v0.41.0/go.mod h1:XSY6eDqxVNiYgezAVqqCeihT4j1U2CCsqvH3WhQpnlg=
golang.org/x/tools v0.42.0/go.mod h1:Ma6lCIwGZvHK6XtgbswSoWroEkhugApmsXyrUmBhfr0=
golang.org/x/tools v0.43.0/go.mod h1:uHkMso649BX2cZK6+RpuIPXS3ho2hZo4FVwfoy1vIk0=
golang.org/x/tools v0.44.0/go.mod h1:KA0AfVErSdxRZIsOVipbv3rQhVXTnlU6UhKxHd1seDI=
golang.org/x/tools v0.45.0/go.mod h1:LuUGqqaXcXMEFEruIVJVm5mgDD8vww/z/SR1gQ4uE/0=
golang.org/x/tools v0.48.0 h1:3+hClM1aLL5mjMKm5ovokw9epgRXPuu2tILgismM6RE=
golang.org/x/tools v0.48.0/go.mod h1:08xX0orndb/F7jJxGDicx061tyd5pcMto75YMAXr6lk=
golang.org/x/tools v0.49.0/go.mod h1:SJNXV9DBKT0UbdttsQjbfJlAE/q+y36++zo3uL3N0Oo=
```

### `native/effect-tsgo/internal/diagnostics/effectDiagnosticMessages.json`

Mode `100644`, blob `9ff46b55e276af1a39e032f038d627b8ceb099fc`, SHA256 `22ac094615ca962f3735f15e27d77b9c2119d7fe4e23c53c15d124b61351cb8f`, 29336 bytes.

Dependency role: Parsed all133 message-map keys:132 are Effect diagnostic-tagged (plus the shared @effect-diagnostics directive). This is compiler language-service diagnostic text input, distinct from the public82-rule tsgolint bridge; generation source is covered substantively by reviewer A.

The current message input has 133 entries; language-service diagnostic messages and public lint marker registrations are separate surfaces. Selected primary integration messages:

```json
[
  {
    "message": "@effect-diagnostics directive has no effect.",
    "category": "Warning",
    "code": 377000
  },
  {
    "message": "This Effect value is neither yielded nor used in an assignment. effect(floatingEffect)",
    "category": "Error",
    "code": 377001
  },
  {
    "message": "This Effect-able `{0}` value is neither yielded nor assigned to a variable. effect(floatingEffect)",
    "category": "Error",
    "code": 377058
  },
  {
    "message": "This code declares an async function, consider representing this async control flow with Effect values and `Effect.gen`. effect(asyncFunction)",
    "category": "Warning",
    "code": 377081
  }
]
```

### `native/effect-tsgo/oxlint-schema.json`

Mode `100644`, blob `5cfe59d0b9e70485586212264f58d6bd1776375b`, SHA256 `e229b9b0a0df2695665243f5850a35e64dff77ef6ea3591cc61389981e7fea4b`, 776938 bytes.

Dependency role: Parsed generated Oxlint configuration schema: LintPluginOptionsSchema adds effecttsgo to the stock plugin enum and DummyRuleMap contains116 effecttsgo/* rule configuration keys. This unchanged imported tool-config schema reflects the upstream Oxlint diagnostic/rule surface; B’s tsgolint integration deliberately registers only82 public Effect markers pending TIA316.

Extracted current JSON subtrees relevant to plugin/rule integration. Descriptions and examples are omitted; structural keys and values are preserved. Internal116 schema support is separate from the public82 marker bridge.

```json
{
  "properties": {
    "plugins": {
      "allOf": [
        {
          "$ref": "#/definitions/LintPlugins"
        }
      ],
      "default": null
    },
    "rules": {
      "allOf": [
        {
          "$ref": "#/definitions/OxlintRules"
        }
      ],
      "default": {}
    },
    "overrides": {
      "allOf": [
        {
          "$ref": "#/definitions/OxlintOverrides"
        }
      ]
    }
  },
  "plugin_definitions": {
    "LintPluginOptionsSchema": {
      "enum": [
        "eslint",
        "react",
        "unicorn",
        "typescript",
        "oxc",
        "import",
        "jsdoc",
        "jest",
        "vitest",
        "jsx-a11y",
        "nextjs",
        "react-perf",
        "promise",
        "node",
        "vue",
        "effecttsgo"
      ],
      "type": "string"
    },
    "LintPlugins": {
      "items": {
        "anyOf": [
          {
            "$ref": "#/definitions/LintPluginOptionsSchema"
          }
        ]
      },
      "type": "array"
    }
  },
  "effect_rule_property_names": [
    "effecttsgo/abort-controller-in-effect",
    "effecttsgo/acquire-release-disposable",
    "effecttsgo/all-of-map-to-for-each",
    "effecttsgo/any-unknown-in-error-context",
    "effecttsgo/async-function",
    "effecttsgo/catch-all-tag-dispatch-to-catch-tag",
    "effecttsgo/catch-all-to-map-error",
    "effecttsgo/catch-chain-to-first-success-of",
    "effecttsgo/catch-conditional-refail-to-catch-if",
    "effecttsgo/catch-die-to-or-die",
    "effecttsgo/catch-if-tag-to-catch-tag",
    "effecttsgo/catch-refail-to-tap-error",
    "effecttsgo/catch-tag-to-catch-reason",
    "effecttsgo/catch-to-ignore",
    "effecttsgo/catch-to-or-else-succeed",
    "effecttsgo/catch-unfailable-effect",
    "effecttsgo/class-self-mismatch",
    "effecttsgo/crypto-random-uuid",
    "effecttsgo/crypto-random-uuid-in-effect",
    "effecttsgo/deterministic-keys",
    "effecttsgo/duplicate-package",
    "effecttsgo/effect-do-notation",
    "effecttsgo/effect-fn-iife",
    "effecttsgo/effect-fn-implicit-any",
    "effecttsgo/effect-fn-opportunity",
    "effecttsgo/effect-gen-uses-adapter",
    "effecttsgo/effect-in-failure",
    "effecttsgo/effect-in-void-success",
    "effecttsgo/effect-map-flatten",
    "effecttsgo/effect-map-void",
    "effecttsgo/effect-succeed-with-void",
    "effecttsgo/extends-native-error",
    "effecttsgo/flat-map-conditional-to-filter-or-fail",
    "effecttsgo/flat-map-ignored-param-to-and-then",
    "effecttsgo/flat-map-to-map",
    "effecttsgo/floating-effect",
    "effecttsgo/floating-effect-in-vitest",
    "effecttsgo/generic-effect-services",
    "effecttsgo/global-console",
    "effecttsgo/global-console-in-effect",
    "effecttsgo/global-date",
    "effecttsgo/global-date-in-effect",
    "effecttsgo/global-error-in-effect-catch",
    "effecttsgo/global-error-in-effect-failure",
    "effecttsgo/global-fetch",
    "effecttsgo/global-fetch-in-effect",
    "effecttsgo/global-random",
    "effecttsgo/global-random-in-effect",
    "effecttsgo/global-timers",
    "effecttsgo/global-timers-in-effect",
    "effecttsgo/instance-of-schema",
    "effecttsgo/layer-merge-all-with-dependencies",
    "effecttsgo/lazy-effect",
    "effecttsgo/lazy-promise-in-effect-sync",
    "effecttsgo/leaking-requirements",
    "effecttsgo/map-some-to-as-some",
    "effecttsgo/match-effect-to-map-both",
    "effecttsgo/match-effect-to-match",
    "effecttsgo/missed-pipeable-opportunity",
    "effecttsgo/missing-effect-context",
    "effecttsgo/missing-effect-error",
    "effecttsgo/missing-effect-service-dependency",
    "effecttsgo/missing-layer-context",
    "effecttsgo/missing-pipeable-signature",
    "effecttsgo/missing-return-yield-star",
    "effecttsgo/missing-star-in-yield-effect-gen",
    "effecttsgo/multiple-catch-tag",
    "effecttsgo/multiple-effect-provide",
    "effecttsgo/nested-effect-gen-yield",
    "effecttsgo/new-promise",
    "effecttsgo/new-schema-class",
    "effecttsgo/node-builtin-import",
    "effecttsgo/non-object-effect-service-type",
    "effecttsgo/obsolete-match-import",
    "effecttsgo/obsolete-schema-import",
    "effecttsgo/option-match-to-from-option",
    "effecttsgo/outdated-api",
    "effecttsgo/overridden-schema-constructor",
    "effecttsgo/prefer-schema-over-json",
    "effecttsgo/prefer-schema-type-property",
    "effecttsgo/prefer-succeed-some-or-none",
    "effecttsgo/prefer-typed-schema-decoder",
    "effecttsgo/prefer-unsafe-constructor",
    "effecttsgo/process-env",
    "effecttsgo/process-env-in-effect",
    "effecttsgo/promise-in-effect-success",
    "effecttsgo/provide-layer-succeed-to-provide-service",
    "effecttsgo/race-first-with-sleep-to-timeout",
    "effecttsgo/redundant-map-error",
    "effecttsgo/redundant-or-die",
    "effecttsgo/redundant-schema-tag-identifier",
    "effecttsgo/return-effect-in-gen",
    "effecttsgo/run-effect-inside-effect",
    "effecttsgo/run-of-exit-to-run-exit",
    "effecttsgo/schema-literal-non-finite",
    "effecttsgo/schema-number",
    "effecttsgo/schema-opaque-instance-member",
    "effecttsgo/schema-struct-with-tag",
    "effecttsgo/schema-sync",
    "effecttsgo/schema-sync-in-effect",
    "effecttsgo/schema-union-of-literals",
    "effecttsgo/scope-in-layer-effect",
    "effecttsgo/service-not-as-class",
    "effecttsgo/strict-boolean-expressions",
    "effecttsgo/strict-effect-provide",
    "effecttsgo/sync-to-succeed",
    "effecttsgo/timeout-catch-tag-to-timeout-or-else",
    "effecttsgo/try-catch-in-effect-gen",
    "effecttsgo/unknown-in-effect-catch",
    "effecttsgo/unnecessary-arrow-block",
    "effecttsgo/unnecessary-effect-gen",
    "effecttsgo/unnecessary-fail-yieldable-error",
    "effecttsgo/unnecessary-pipe",
    "effecttsgo/unnecessary-pipe-chain",
    "effecttsgo/unnecessary-typeof-type",
    "effecttsgo/unsafe-effect-type-assertion"
  ]
}
```

### `native/effect-tsgo/schema.json`

Mode `100644`, blob `1b8bb790f19ed2e0bf50920017f6af02a62971e4`, SHA256 `a3e1545f9d61af998b066a8188b6413e64d8cea3c4b48dfeb7bc5939474a5a48`, 570037 bytes.

Dependency role: Parsed the generated TSConfig schema’s compilerOptions.plugins node: the stock generic {name:string} plugin shape is specialized with name const @effect/language-service and Effect option fields (including diagnosticSeverity, diagnostics, overrides, and LSP features). diagnosticSeverity enumerates116 language-service diagnostics internally; this is distinct from B’s82 public tsgolint bridge allowlist.

Extracted current JSON subtrees for compilerOptions.plugins and Effect plugin options. Generic TS options remain the stock template; derived Effect state is not a direct user option. Descriptive strings are omitted; validation structure remains.

```json
{
  "compilerOptions_plugin_nodes": [
    {
      "json_pointer": "/properties/compilerOptions/anyOf/0/properties/plugins",
      "value": {
        "anyOf": [
          {
            "items": {
              "anyOf": [
                {
                  "additionalProperties": false,
                  "properties": {
                    "allowedDuplicatedPackages": {
                      "default": [],
                      "items": {
                        "type": "string"
                      },
                      "type": "array"
                    },
                    "barrelImportPackages": {
                      "default": [],
                      "items": {
                        "type": "string"
                      },
                      "type": "array"
                    },
                    "completions": {
                      "default": true,
                      "type": "boolean"
                    },
                    "debug": {
                      "default": false,
                      "type": "boolean"
                    },
                    "diagnosticSeverity": {
                      "$ref": "#/definitions/effectLanguageServicePluginDiagnosticSeverityDefinition",
                      "default": {}
                    },
                    "diagnostics": {
                      "default": true,
                      "type": "boolean"
                    },
                    "effectFn": {
                      "default": [
                        "span"
                      ],
                      "items": {
                        "enum": [
                          "span",
                          "untraced",
                          "no-span",
                          "inferred-span",
                          "suggested-span"
                        ],
                        "type": "string"
                      },
                      "type": "array",
                      "uniqueItems": true
                    },
                    "extendedKeyDetection": {
                      "default": false,
                      "type": "boolean"
                    },
                    "goto": {
                      "default": true,
                      "type": "boolean"
                    },
                    "ignoreEffectErrorsInTscExitCode": {
                      "default": false,
                      "type": "boolean"
                    },
                    "ignoreEffectSuggestionsInTscExitCode": {
                      "default": true,
                      "type": "boolean"
                    },
                    "ignoreEffectWarningsInTscExitCode": {
                      "default": false,
                      "type": "boolean"
                    },
                    "importAliases": {
                      "additionalProperties": {
                        "type": "string"
                      },
                      "default": {},
                      "type": "object"
                    },
                    "includeSuggestionsInTsc": {
                      "default": true,
                      "type": "boolean"
                    },
                    "inlays": {
                      "default": false,
                      "type": "boolean"
                    },
                    "keyPatterns": {
                      "default": [
                        {
                          "target": "service",
                          "pattern": "default",
                          "skipLeadingPath": [
                            "src/"
                          ]
                        },
                        {
                          "target": "custom",
                          "pattern": "default",
                          "skipLeadingPath": [
                            "src/"
                          ]
                        }
                      ],
                      "items": {
                        "$ref": "#/definitions/effectLanguageServicePluginKeyPatternDefinition"
                      },
                      "type": "array"
                    },
                    "layerGraphFollowDepth": {
                      "default": 0,
                      "minimum": 0,
                      "type": "integer"
                    },
                    "mermaidProvider": {
                      "default": "mermaid.live",
                      "type": "string"
                    },
                    "name": {
                      "const": "@effect/language-service",
                      "type": "string"
                    },
                    "namespaceImportPackages": {
                      "default": [],
                      "items": {
                        "type": "string"
                      },
                      "type": "array"
                    },
                    "noExternal": {
                      "default": false,
                      "type": "boolean"
                    },
                    "overrides": {
                      "items": {
                        "$ref": "#/definitions/effectLanguageServicePluginOverrideDefinition"
                      },
                      "type": "array"
                    },
                    "pipeableMinArgCount": {
                      "default": 2,
                      "minimum": 1,
                      "type": "integer"
                    },
                    "quickinfo": {
                      "default": true,
                      "type": "boolean"
                    },
                    "refactors": {
                      "default": true,
                      "type": "boolean"
                    },
                    "renames": {
                      "default": true,
                      "type": "boolean"
                    },
                    "skipDisabledOptimization": {
                      "default": false,
                      "type": "boolean"
                    },
                    "topLevelNamedReexports": {
                      "default": "ignore",
                      "enum": [
                        "ignore",
                        "follow"
                      ],
                      "type": "string"
                    }
                  },
                  "required": [
                    "name"
                  ],
                  "title": "@effect/language-service plugin",
                  "type": "object"
                },
                {
                  "properties": {
                    "name": {
                      "not": {
                        "enum": [
                          "@effect/language-service"
                        ]
                      },
                      "type": "string"
                    }
                  },
                  "type": "object"
                }
              ]
            },
            "type": "array"
          },
          {
            "type": "null"
          }
        ],
        "x-intellij-html-description": "<p>List of language service plugins to run inside the editor.</p>\n<p>Language service plugins are a way to provide additional information to a user based on existing TypeScript files. They can enhance existing messages between TypeScript and an editor, or to provide their own error messages.</p>\n<p>For example:</p>\n<ul>\n<li><a href=\"https://github.com/xialvjun/ts-sql-plugin#readme\">ts-sql-plugin</a> &mdash; Adds SQL linting with a template strings SQL builder.</li>\n<li><a href=\"https://github.com/Microsoft/typescript-styled-plugin\">typescript-styled-plugin</a> &mdash; Provides CSS linting inside template strings .</li>\n<li><a href=\"https://github.com/Quramy/typescript-eslint-language-service\">typescript-eslint-language-service</a> &mdash; Provides eslint error messaging and fix-its inside the compiler&#39;s output.</li>\n<li><a href=\"https://github.com/Quramy/ts-graphql-plugin\">ts-graphql-plugin</a> &mdash; Provides validation and auto-completion inside GraphQL query template strings.</li>\n</ul>\n<p>VS Code has the ability for a extension to <a href=\"https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins\">automatically include language service plugins</a>, and so you may have some running in your editor without needing to define them in your <code>tsconfig.json</code>.</p>\n"
      }
    }
  ],
  "effect_definitions": {
    "effectLanguageServicePluginDiagnosticSeverityDefinition": {
      "additionalProperties": {
        "enum": [
          "off",
          "error",
          "warning",
          "message",
          "suggestion"
        ],
        "type": "string"
      },
      "properties": {
        "abortControllerInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "acquireReleaseDisposable": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "allOfMapToForEach": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "anyUnknownInErrorContext": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "asyncFunction": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "catchAllTagDispatchToCatchTag": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchAllToMapError": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchChainToFirstSuccessOf": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchConditionalRefailToCatchIf": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchDieToOrDie": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchIfTagToCatchTag": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchRefailToTapError": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchTagToCatchReason": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchToIgnore": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchToOrElseSucceed": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "catchUnfailableEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "classSelfMismatch": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "cryptoRandomUUID": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "cryptoRandomUUIDInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "deterministicKeys": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "duplicatePackage": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "effectDoNotation": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "effectFnIife": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "effectFnImplicitAny": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "effectFnOpportunity": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "effectGenUsesAdapter": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "effectInFailure": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "effectInVoidSuccess": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "effectMapFlatten": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "effectMapVoid": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "effectSucceedWithVoid": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "extendsNativeError": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "flatMapConditionalToFilterOrFail": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "flatMapIgnoredParamToAndThen": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "flatMapToMap": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "floatingEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "floatingEffectInVitest": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "genericEffectServices": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "globalConsole": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalConsoleInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalDate": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalDateInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalErrorInEffectCatch": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "globalErrorInEffectFailure": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "globalFetch": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalFetchInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalRandom": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalRandomInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalTimers": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "globalTimersInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "instanceOfSchema": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "layerMergeAllWithDependencies": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "lazyEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "lazyPromiseInEffectSync": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "leakingRequirements": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "mapSomeToAsSome": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "matchEffectToMapBoth": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "matchEffectToMatch": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "missedPipeableOpportunity": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "missingEffectContext": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "missingEffectError": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "missingEffectServiceDependency": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "missingLayerContext": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "missingPipeableSignature": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "missingReturnYieldStar": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "missingStarInYieldEffectGen": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "multipleCatchTag": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "multipleEffectProvide": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "nestedEffectGenYield": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "newPromise": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "newSchemaClass": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "nodeBuiltinImport": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "nonObjectEffectServiceType": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "obsoleteMatchImport": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "obsoleteSchemaImport": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "optionMatchToFromOption": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "outdatedApi": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "overriddenSchemaConstructor": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "preferSchemaOverJson": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "preferSchemaTypeProperty": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "preferSucceedSomeOrNone": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "preferTypedSchemaDecoder": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "preferUnsafeConstructor": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "processEnv": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "processEnvInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "promiseInEffectSuccess": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "provideLayerSucceedToProvideService": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "raceFirstWithSleepToTimeout": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "redundantMapError": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "redundantOrDie": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "redundantSchemaTagIdentifier": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "returnEffectInGen": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "runEffectInsideEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "runOfExitToRunExit": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "schemaLiteralNonFinite": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "schemaNumber": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "schemaOpaqueInstanceMember": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "error"
        },
        "schemaStructWithTag": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "schemaSync": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "schemaSyncInEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "schemaUnionOfLiterals": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "scopeInLayerEffect": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "serviceNotAsClass": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "strictBooleanExpressions": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "strictEffectProvide": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "syncToSucceed": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "timeoutCatchTagToTimeoutOrElse": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "tryCatchInEffectGen": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "unknownInEffectCatch": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "warning"
        },
        "unnecessaryArrowBlock": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        },
        "unnecessaryEffectGen": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "unnecessaryFailYieldableError": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "unnecessaryPipe": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "unnecessaryPipeChain": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "unnecessaryTypeofType": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "suggestion"
        },
        "unsafeEffectTypeAssertion": {
          "$ref": "#/definitions/effectLanguageServicePluginSeverityDefinition",
          "default": "off"
        }
      },
      "type": "object"
    },
    "effectLanguageServicePluginKeyPatternDefinition": {
      "additionalProperties": false,
      "properties": {
        "pattern": {
          "default": "default",
          "enum": [
            "default",
            "package-identifier",
            "default-hashed"
          ],
          "type": "string"
        },
        "skipLeadingPath": {
          "default": [
            "src/"
          ],
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "target": {
          "default": "service",
          "enum": [
            "service",
            "error",
            "custom"
          ],
          "type": "string"
        }
      },
      "type": "object"
    },
    "effectLanguageServicePluginOptionsDefinition": {
      "additionalProperties": false,
      "properties": {
        "allowedDuplicatedPackages": {
          "default": [],
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "barrelImportPackages": {
          "default": [],
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "completions": {
          "default": true,
          "type": "boolean"
        },
        "debug": {
          "default": false,
          "type": "boolean"
        },
        "diagnosticSeverity": {
          "$ref": "#/definitions/effectLanguageServicePluginDiagnosticSeverityDefinition",
          "default": {}
        },
        "diagnostics": {
          "default": true,
          "type": "boolean"
        },
        "effectFn": {
          "default": [
            "span"
          ],
          "items": {
            "enum": [
              "span",
              "untraced",
              "no-span",
              "inferred-span",
              "suggested-span"
            ],
            "type": "string"
          },
          "type": "array",
          "uniqueItems": true
        },
        "extendedKeyDetection": {
          "default": false,
          "type": "boolean"
        },
        "goto": {
          "default": true,
          "type": "boolean"
        },
        "ignoreEffectErrorsInTscExitCode": {
          "default": false,
          "type": "boolean"
        },
        "ignoreEffectSuggestionsInTscExitCode": {
          "default": true,
          "type": "boolean"
        },
        "ignoreEffectWarningsInTscExitCode": {
          "default": false,
          "type": "boolean"
        },
        "importAliases": {
          "additionalProperties": {
            "type": "string"
          },
          "default": {},
          "type": "object"
        },
        "includeSuggestionsInTsc": {
          "default": true,
          "type": "boolean"
        },
        "inlays": {
          "default": false,
          "type": "boolean"
        },
        "keyPatterns": {
          "default": [
            {
              "target": "service",
              "pattern": "default",
              "skipLeadingPath": [
                "src/"
              ]
            },
            {
              "target": "custom",
              "pattern": "default",
              "skipLeadingPath": [
                "src/"
              ]
            }
          ],
          "items": {
            "$ref": "#/definitions/effectLanguageServicePluginKeyPatternDefinition"
          },
          "type": "array"
        },
        "layerGraphFollowDepth": {
          "default": 0,
          "minimum": 0,
          "type": "integer"
        },
        "mermaidProvider": {
          "default": "mermaid.live",
          "type": "string"
        },
        "namespaceImportPackages": {
          "default": [],
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "noExternal": {
          "default": false,
          "type": "boolean"
        },
        "overrides": {
          "items": {
            "$ref": "#/definitions/effectLanguageServicePluginOverrideDefinition"
          },
          "type": "array"
        },
        "pipeableMinArgCount": {
          "default": 2,
          "minimum": 1,
          "type": "integer"
        },
        "quickinfo": {
          "default": true,
          "type": "boolean"
        },
        "refactors": {
          "default": true,
          "type": "boolean"
        },
        "renames": {
          "default": true,
          "type": "boolean"
        },
        "skipDisabledOptimization": {
          "default": false,
          "type": "boolean"
        },
        "topLevelNamedReexports": {
          "default": "ignore",
          "enum": [
            "ignore",
            "follow"
          ],
          "type": "string"
        }
      },
      "type": "object"
    },
    "effectLanguageServicePluginOverrideDefinition": {
      "additionalProperties": false,
      "properties": {
        "exclude": {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "include": {
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "options": {
          "$ref": "#/definitions/effectLanguageServicePluginOverrideOptionsDefinition"
        }
      },
      "type": "object"
    },
    "effectLanguageServicePluginOverrideOptionsDefinition": {
      "additionalProperties": false,
      "properties": {
        "allowedDuplicatedPackages": {},
        "diagnosticSeverity": {
          "$ref": "#/definitions/effectLanguageServicePluginDiagnosticSeverityDefinition"
        },
        "effectFn": {
          "uniqueItems": true
        },
        "extendedKeyDetection": {},
        "keyPatterns": {
          "items": {
            "$ref": "#/definitions/effectLanguageServicePluginKeyPatternDefinition"
          },
          "type": "array"
        },
        "pipeableMinArgCount": {
          "minimum": 1
        }
      },
      "type": "object"
    },
    "effectLanguageServicePluginSeverityDefinition": {
      "enum": [
        "off",
        "error",
        "warning",
        "message",
        "suggestion"
      ],
      "type": "string"
    }
  }
}
```

### `native/effect-tsgo/shim/.generated-by-gen-shims`

Mode `100644`, blob `fc5d1f1cb8e5bb5378bf08663a704ed63e71a0ad`, SHA256 `9efa84e3a81ce243cec7e9bcb02f7815f907457f9e72ced9ec6d3c0051e77b0b`, 44 bytes.

Dependency role: Inspected structural content and role in the imported source boundary; no direct generator configuration role identified.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
Generated by _tools/gen_shims. DO NOT EDIT.
```

### `native/effect-tsgo/testdata/tests/cli-test/package.json`

Mode `100644`, blob `84c662c476a227b595e992997bcaafb87f8374b5`, SHA256 `28fb0aba9d346907828b4c43fd628caf668dd9da47d61badf4347e37742234b7`, 107 bytes.

Dependency role: Read full fixture/package manifest name, scripts, dependency and engine pins: {'name': 'cli-test', 'private': True, 'dependencies': {'typescript': 'next'}}; checked runtime boundary against the distinct retained v3 and stable v4 fixture packages.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

Source block 6 representation: `literal-and-json-source-lines-v1`; original language `text`. Decode lines prefixed `@@json-source-line: ` as JSON strings, including their exact line endings. Keep all other lines literal, concatenate in order and review the recovered source.

```text
@@json-source-line: "{\r\n"
    "name": "cli-test",
    "private": true,
    "dependencies": {
        "typescript": "next"
    }
}
```

### `native/effect-tsgo/testdata/tests/cli-test/pnpm-lock.yaml`

Mode `100644`, blob `09e61f1c334fbe4501143822bbb2894efd2eaa0f`, SHA256 `2f8512168ca007ed4ede28347a78fd926188089b9d4110e4df8551e2d97d7788`, 3274 bytes.

Dependency role: Read lock importer and package-resolution context for this workspace; checked pinned runtime/developer dependencies and platform transitive packages against adjacent package manifests.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      typescript:
        specifier: next
        version: 7.1.0-dev.20260708.3

packages:

  '@typescript/typescript-darwin-arm64@7.1.0-dev.20260708.3':
    resolution: {integrity: sha512-eFMFNFqjNxw1Kc4R3XdqOtecWqIWLg2z/qEtnGXveGeTS/5o11av1emmMhuBSvJxwFW7e/1fdlqR/5h8GvQmXQ==}
    engines: {node: '>=16.20.0'}
    cpu: [arm64]
    os: [darwin]

  '@typescript/typescript-darwin-x64@7.1.0-dev.20260708.3':
    resolution: {integrity: sha512-DvnY0up5xyTTKRXR2NpDkgAWsTY0YQsXi3NqJ5D7OXzl7TRHzJm2qY84+pBxGg1ePreH9S3B6szpL089sQnBYg==}
    engines: {node: '>=16.20.0'}
    cpu: [x64]
    os: [darwin]

  '@typescript/typescript-linux-arm64@7.1.0-dev.20260708.3':
    resolution: {integrity: sha512-XMjlzOjKtm4mMXlyFDayUgAC5mVtct0r1fQc8cUfPEpwSKY8X6I8dZMXDvcVmb4oqtQl1Wp9ovohNRZW+RZ6kw==}
    engines: {node: '>=16.20.0'}
    cpu: [arm64]
    os: [linux]

  '@typescript/typescript-linux-arm@7.1.0-dev.20260708.3':
    resolution: {integrity: sha512-Lgu+C0qaBQj6YlWQK1CSXSuRGOikpZ31oIYDlwlBX0mt3W+gR8SM32/VvnuUiKVH+NtzG8x/76e8tTPI6/n3/w==}
    engines: {node: '>=16.20.0'}
    cpu: [arm]
    os: [linux]

  '@typescript/typescript-linux-x64@7.1.0-dev.20260708.3':
    resolution: {integrity: sha512-vcrbeLuAdNuW+hPI+XmYdgHHaL3rWWiK9xCK52XWu+AZGnoibXG7C4IV7wEzQGv9qYb3N9/rO3BIr/Xgx5KBgQ==}
    engines: {node: '>=16.20.0'}
    cpu: [x64]
    os: [linux]

  '@typescript/typescript-win32-arm64@7.1.0-dev.20260708.3':
    resolution: {integrity: sha512-LQvNIycyWMBZ6e4e1Pn1RDhUPtYK7Ifnr9pDDF9M3fIMug5paiTIyX+nEYbDogIqSkgBh8EjGxD90KDVuGls5Q==}
    engines: {node: '>=16.20.0'}
    cpu: [arm64]
    os: [win32]

  '@typescript/typescript-win32-x64@7.1.0-dev.20260708.3':
    resolution: {integrity: sha512-kg0yQJJ1TJi2E7aMaZkUDg2ChHD4iF7/F2Nvj2DsntNWXgDvoz4rINn5LAbITmp0Fv8r2oJQjC1RUMs+n3ToIQ==}
    engines: {node: '>=16.20.0'}
    cpu: [x64]
    os: [win32]

  typescript@7.1.0-dev.20260708.3:
    resolution: {integrity: sha512-XZJ/eynNOqyE2tz8kkCZO8x7CmJBp40c1ljuBgMotrIFfjK4uH0Br2e94FaXr29q7CvwpaL+CNCW4DynxuNCeA==}
    engines: {node: '>=16.20.0'}
    hasBin: true

snapshots:

  '@typescript/typescript-darwin-arm64@7.1.0-dev.20260708.3':
    optional: true

  '@typescript/typescript-darwin-x64@7.1.0-dev.20260708.3':
    optional: true

  '@typescript/typescript-linux-arm64@7.1.0-dev.20260708.3':
    optional: true

  '@typescript/typescript-linux-arm@7.1.0-dev.20260708.3':
    optional: true

  '@typescript/typescript-linux-x64@7.1.0-dev.20260708.3':
    optional: true

  '@typescript/typescript-win32-arm64@7.1.0-dev.20260708.3':
    optional: true

  '@typescript/typescript-win32-x64@7.1.0-dev.20260708.3':
    optional: true

  typescript@7.1.0-dev.20260708.3:
    optionalDependencies:
      '@typescript/typescript-darwin-arm64': 7.1.0-dev.20260708.3
      '@typescript/typescript-darwin-x64': 7.1.0-dev.20260708.3
      '@typescript/typescript-linux-arm': 7.1.0-dev.20260708.3
      '@typescript/typescript-linux-arm64': 7.1.0-dev.20260708.3
      '@typescript/typescript-linux-x64': 7.1.0-dev.20260708.3
      '@typescript/typescript-win32-arm64': 7.1.0-dev.20260708.3
      '@typescript/typescript-win32-x64': 7.1.0-dev.20260708.3
```

### `native/effect-tsgo/testdata/tests/effect-v3/package.json`

Mode `100644`, blob `d3ef8d7f5bade82493bc01003b49cd8e56e49d13`, SHA256 `4cf71b644ddc1d37097b7140c8fa06810a2b1f9223666fca6cee0fa44eb193b3`, 353 bytes.

Dependency role: Read full fixture/package manifest name, scripts, dependency and engine pins: {'name': 'effect-v3-tests', 'private': True, 'dependencies': {'@effect/vitest': '0.27.0', '@standard-schema/spec': '^1.0.0', '@types/node': '^22.0.0', '@vitest/runner': '3.2.4', 'effect': '3.19.19', 'fast-check': '^3.23.1', 'pure-rand': '^6.1.0', 'vitest': '3.2.4'}}; checked runtime boundary against the distinct retained v3 and stable v4 fixture packages.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

Source block 8 representation: `literal-and-json-source-lines-v1`; original language `text`. Decode lines prefixed `@@json-source-line: ` as JSON strings, including their exact line endings. Keep all other lines literal, concatenate in order and review the recovered source.

```text
@@json-source-line: "{\r\n"
@@json-source-line: "    \"name\": \"effect-v3-tests\",\r\n"
    "private": true,
    "dependencies": {
        "@effect/vitest": "0.27.0",
        "@standard-schema/spec": "^1.0.0",
        "@types/node": "^22.0.0",
        "@vitest/runner": "3.2.4",
        "effect": "3.19.19",
        "fast-check": "^3.23.1",
        "pure-rand": "^6.1.0",
        "vitest": "3.2.4"
    }
}
```
