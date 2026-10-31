# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/tsgolint-effect-fork/go.work`

Mode `100644`, blob `bc6c2e8beccccfef16ccad97ca4533011da391b0`, SHA256 `c2e25c3808013135f8cbc233b0c4acd486c899bb996cb007867208fed9d3ea9a`, 37 bytes.

Dependency role: Read workspace module membership (root and local typescript-go checkout); related it to generator's local shim replacements and update/build workflow.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
go 1.26

use (
	.
	./typescript-go
)
```

### `native/tsgolint-effect-fork/package.json`

Mode `100644`, blob `dc89dbcb1cb7eff4cefe85c0b6e7b8e9a99bd5ad`, SHA256 `f1365f58937bf11458d2e70aa128a3d92d4acd6e274f4b77c54acd0f0d237d66`, 188 bytes.

Dependency role: Read full fixture/package manifest name, scripts, dependency and engine pins: {'name': 'tsgolint', 'scripts': {'fmt': 'dprint fmt'}, 'devDependencies': {'@types/node': '^24.10.0', 'dprint': '^0.57.0'}, 'packageManager': 'pnpm@11.24.0'}; checked runtime boundary against the distinct retained v3 and stable v4 fixture packages.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "tsgolint",
  "scripts": {
    "fmt": "dprint fmt"
  },
  "devDependencies": {
    "@types/node": "^24.10.0",
    "dprint": "^0.57.0"
  },
  "packageManager": "pnpm@11.24.0"
}
```

### `native/tsgolint-effect-fork/pnpm-lock.yaml`

Mode `100644`, blob `f15574be314fa94a42697d839dd14888125b77b2`, SHA256 `a617fac66d1ba2c8c2bece3e152641a24647de5a4588295188f2d9d7717210b1`, 5397 bytes.

Dependency role: Read lock importer and package-resolution context for this workspace; checked pinned runtime/developer dependencies and platform transitive packages against adjacent package manifests.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    devDependencies:
      '@types/node':
        specifier: ^24.10.0
        version: 24.13.2
      dprint:
        specifier: ^0.57.0
        version: 0.57.4

packages:

  '@dprint/android-arm64@0.57.4':
    resolution: {integrity: sha512-vpafWVSNbB5ShCThZC3O5xOPsdxc2oeLedFVCsscSRf/iR6WZ62ROU2AGcxsJyE2y4/vxivejenbNYjWxL24sQ==}
    cpu: [arm64]
    os: [android]

  '@dprint/android-x64@0.57.4':
    resolution: {integrity: sha512-Zv2I12Zs9IK8yv1wdXGWluUram9h8Acy3NuF/7WzsxIfdlmnWzUGxoc4Z0dno6aJpv0ViXybkIHPvDKrQnvxVA==}
    cpu: [x64]
    os: [android]

  '@dprint/darwin-arm64@0.57.4':
    resolution: {integrity: sha512-2V1BzlP+5aLxMaq77MUn2EdRX+UtOq34QjyMwpq1wQkR5MAT2cglJro4Eh1tsI+btjt3FMsX4/PLvz6eUSLl3g==}
    cpu: [arm64]
    os: [darwin]

  '@dprint/darwin-x64@0.57.4':
    resolution: {integrity: sha512-dQfzBLBQro1O+CxIkIVc9LJqgYsWCKXTf+3QA0Gq/NjW6KPBwlbiCquew3UOeWwGEvarNSA0/Rvz5J8HnykTPA==}
    cpu: [x64]
    os: [darwin]

  '@dprint/linux-arm64-glibc@0.57.4':
    resolution: {integrity: sha512-zFCgx2E2szEnMgtBCKiI/G5vV5mi7rnTVDMB2FrIa6JheqF8pgfrx6m3HWzIed74cFM3/KCH0LmIfCNZT5vRfw==}
    cpu: [arm64]
    os: [linux]
    libc: [glibc]

  '@dprint/linux-arm64-musl@0.57.4':
    resolution: {integrity: sha512-8DV33dU5c5vp/TJJp4Dy/4HYc4r5KidlMJgoiG0S9JMygVGjhrXRNiI/C7M9hLgsamqeLYt4MWfEGKvtgOwoew==}
    cpu: [arm64]
    os: [linux]
    libc: [musl]

  '@dprint/linux-loong64-glibc@0.57.4':
    resolution: {integrity: sha512-166HbqGPMiKjCUuaiG6xyKrw8EKFF6vPBcmwFWUYHpZE6ipVVxt1Zen9957FXoxqyA5aspmK72eQGm72dQI2Yg==}
    cpu: [loong64]
    os: [linux]
    libc: [glibc]

  '@dprint/linux-loong64-musl@0.57.4':
    resolution: {integrity: sha512-TTNKhwDj4qCWSiP20pdktb/mF0MfjVnXEcCXAd37ll6lx+ri4M5aQKyeyFL1pVGU9msjQv++UTU7MGF9uKfOzA==}
    cpu: [loong64]
    os: [linux]
    libc: [musl]

  '@dprint/linux-ppc64-glibc@0.57.4':
    resolution: {integrity: sha512-kQGTaEoZIk+aHtEltz+nBQ54dhJ3dSxN4jxBOnK2wYCTaMkRnGxfF9Uwc29u/BL3Fw6ieDOJCSHy2VWFZdyctA==}
    cpu: [ppc64]
    os: [linux]
    libc: [glibc]

  '@dprint/linux-ppc64-musl@0.57.4':
    resolution: {integrity: sha512-NuhwpDFzyBovfpI3M47eBUju8eCxR7tfrMpPBWXyl9YgX0JeBZt6clOV/fwJ2P3DE/ARD9xoyQSGgHzDoSFlOQ==}
    cpu: [ppc64]
    os: [linux]
    libc: [musl]

  '@dprint/linux-riscv64-glibc@0.57.4':
    resolution: {integrity: sha512-pWBdHK8SKt9IGldbuZGbec37RyQqP4zqsWfpq7iyH+m33f7Aagus5ktvKF85KYfLTewIg+ev3vlxryB9iHBiNA==}
    cpu: [riscv64]
    os: [linux]
    libc: [glibc]

  '@dprint/linux-x64-glibc@0.57.4':
    resolution: {integrity: sha512-BYrSdjYo+nfUgXqgIbZZQnHvpM6UP7Dipfsuzxs0JmuHZRRkJIPjDdj/Qpbn/5Qv1gC4eV0cZsxRu8B634wkig==}
    cpu: [x64]
    os: [linux]
    libc: [glibc]

  '@dprint/linux-x64-musl@0.57.4':
    resolution: {integrity: sha512-pBRF5Kfv59FLtWYWWKpDLOv2+uTIr/XG2oMuRBiXXZom0b506aMm3zKCZ7z5ELeIYutPpASfkDbHcsyTY0ky6w==}
    cpu: [x64]
    os: [linux]
    libc: [musl]

  '@dprint/win32-arm64@0.57.4':
    resolution: {integrity: sha512-bGEtcSjl6T4xjwr9nUF5kgd3174NP7yb338+Ulqq5DMYcSN4ibI62eVQKBTuyLWByz56aVOL06dj8pKTUzn+yQ==}
    cpu: [arm64]
    os: [win32]

  '@dprint/win32-x64@0.57.4':
    resolution: {integrity: sha512-P91JJG2sDvK+SvZHdqjKygy7fYABbMH1KYop+WCowyjZUin09977qltdXwJ1vb77Cbi2OD0GWUuAlqO0PjNmaw==}
    cpu: [x64]
    os: [win32]

  '@types/node@24.13.2':
    resolution: {integrity: sha512-fRa09kZTgu8o71KFcDjUFuc7F+dEbZYZmkI0mg5YBTRs0yMKjYHsq/c0urDKeDb+D5qVgXOdFcuu+DZPKOITwA==}

  dprint@0.57.4:
    resolution: {integrity: sha512-iiorgfJrrV7DDf7S9AB/d5ZB59Jn5idMDQoU7o6H9m6AvGVaLAPrGTAslmTwykkft9CYbWzqUrKjmKT80KWmAA==}
    hasBin: true

  undici-types@7.18.2:
    resolution: {integrity: sha512-AsuCzffGHJybSaRrmr5eHr81mwJU3kjw6M+uprWvCXiNeN9SOGwQ3Jn8jb8m3Z6izVgknn1R0FTCEAP2QrLY/w==}

snapshots:

  '@dprint/android-arm64@0.57.4':
    optional: true

  '@dprint/android-x64@0.57.4':
    optional: true

  '@dprint/darwin-arm64@0.57.4':
    optional: true

  '@dprint/darwin-x64@0.57.4':
    optional: true

  '@dprint/linux-arm64-glibc@0.57.4':
    optional: true

  '@dprint/linux-arm64-musl@0.57.4':
    optional: true

  '@dprint/linux-loong64-glibc@0.57.4':
    optional: true

  '@dprint/linux-loong64-musl@0.57.4':
    optional: true

  '@dprint/linux-ppc64-glibc@0.57.4':
    optional: true

  '@dprint/linux-ppc64-musl@0.57.4':
    optional: true

  '@dprint/linux-riscv64-glibc@0.57.4':
    optional: true

  '@dprint/linux-x64-glibc@0.57.4':
    optional: true

  '@dprint/linux-x64-musl@0.57.4':
    optional: true

  '@dprint/win32-arm64@0.57.4':
    optional: true

  '@dprint/win32-x64@0.57.4':
    optional: true

  '@types/node@24.13.2':
    dependencies:
      undici-types: 7.18.2

  dprint@0.57.4:
    optionalDependencies:
      '@dprint/android-arm64': 0.57.4
      '@dprint/android-x64': 0.57.4
      '@dprint/darwin-arm64': 0.57.4
      '@dprint/darwin-x64': 0.57.4
      '@dprint/linux-arm64-glibc': 0.57.4
      '@dprint/linux-arm64-musl': 0.57.4
      '@dprint/linux-loong64-glibc': 0.57.4
      '@dprint/linux-loong64-musl': 0.57.4
      '@dprint/linux-ppc64-glibc': 0.57.4
      '@dprint/linux-ppc64-musl': 0.57.4
      '@dprint/linux-riscv64-glibc': 0.57.4
      '@dprint/linux-x64-glibc': 0.57.4
      '@dprint/linux-x64-musl': 0.57.4
      '@dprint/win32-arm64': 0.57.4
      '@dprint/win32-x64': 0.57.4

  undici-types@7.18.2: {}
```

### `native/tsgolint-effect-fork/shim/ast/go.sum`

Mode `100644`, blob `5e422426262e3136460e741d05113e33e64af3d6`, SHA256 `df95752937676ce695f2dc86f1cebf23e018a07e48fdef492748095f2ada5740`, 1770 bytes.

Dependency role: Inspected checksum/module boundary and its relation to selected provider/compiler modules.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68 h1:KZaTBSyshWX3MP5jukJcNSuXDQTO+rNpt0J564dX/eg=
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68/go.mod h1:tphK2c80bpPhMOI4v6bIc2xWywPfbqi1Z06+RcrMkDg=
github.com/google/go-cmp v0.7.0 h1:wk8382ETsv4JYUZwIsn6YpYiWiBsYLSJiTsyBybVuN8=
github.com/google/go-cmp v0.7.0/go.mod h1:pXiqmnSA92OHEEa9HXL2W4E7lf9JzCmGVUdgjX3N/iU=
github.com/klauspost/cpuid/v2 v2.2.10 h1:tBs3QSyvjDyFTq3uoc/9xFpCuOsJQFNPiAhYdw2skhE=
github.com/klauspost/cpuid/v2 v2.2.10/go.mod h1:hqwkgyIinND0mEev00jJYCxPNVRVXFQeu1XKlok6oO0=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b h1:IgfPOv9pzPZ1sbyRHOKu3UCvhaTS0IyrkTcs6JLPqhY=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b/go.mod h1:gV4G6M8xxLNqQSRHiFOgKHlY+5YJgYPM6QwFLWllC+8=
github.com/zeebo/assert v1.3.0 h1:g7C04CbJuIDKNPFHmsk4hwZDO5O+kntRxzaUoNXj+IQ=
github.com/zeebo/assert v1.3.0/go.mod h1:Pq9JiuJQpG8JLJdtkwrJESF0Foym2/D9XMU5ciN/wJ0=
github.com/zeebo/xxh3 v1.1.0 h1:s7DLGDK45Dyfg7++yxI0khrfwq9661w9EN78eP/UZVs=
github.com/zeebo/xxh3 v1.1.0/go.mod h1:IisAie1LELR4xhVinxWS5+zf1lA4p0MW4T+w+W07F5s=
golang.org/x/sync v0.21.0 h1:HLII4xRRTtCRkxYp4HNFF0Js/Og6q2i++KXbg0gHCwM=
golang.org/x/sync v0.21.0/go.mod h1:9xrNwdLfx4jkKbNva9FpL6vEN7evnE43NNNJQ2LF3+0=
golang.org/x/sys v0.46.0 h1:noSf2Fq6F8DBgS+LysIkx7rIExoNHJsxOAtPp4rthXw=
golang.org/x/sys v0.46.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/text v0.38.0 h1:sXmwo9DwP3OK9EZ7PqAdaooSGozfl/3a6/xJcbzPRhE=
golang.org/x/text v0.38.0/go.mod h1:YXZt3QhHUKYT53r2lLKFIVi6Ao1jdzrTR/KQ09qyxF4=
gotest.tools/v3 v3.5.2 h1:7koQfIKdy+I8UTetycgUqXWSDwpgv193Ka+qRsmBY8Q=
gotest.tools/v3 v3.5.2/go.mod h1:LtdLGcnqToBH83WByAAi/wiwSFCArdFIUV/xxN4pcjA=
```

### `native/tsgolint-effect-fork/shim/bundled/go.sum`

Mode `100644`, blob `186409ad18adcb693a3b265829fd80ac5b6ae976`, SHA256 `7558ae26ed71678831fa52eae9e9cf0a588e799a780a78f9f0e85b8939ffa324`, 1110 bytes.

Dependency role: Inspected checksum/module boundary and its relation to selected provider/compiler modules.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68 h1:KZaTBSyshWX3MP5jukJcNSuXDQTO+rNpt0J564dX/eg=
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68/go.mod h1:tphK2c80bpPhMOI4v6bIc2xWywPfbqi1Z06+RcrMkDg=
github.com/google/go-cmp v0.7.0 h1:wk8382ETsv4JYUZwIsn6YpYiWiBsYLSJiTsyBybVuN8=
github.com/google/go-cmp v0.7.0/go.mod h1:pXiqmnSA92OHEEa9HXL2W4E7lf9JzCmGVUdgjX3N/iU=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b h1:IgfPOv9pzPZ1sbyRHOKu3UCvhaTS0IyrkTcs6JLPqhY=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b/go.mod h1:gV4G6M8xxLNqQSRHiFOgKHlY+5YJgYPM6QwFLWllC+8=
golang.org/x/sync v0.21.0 h1:HLII4xRRTtCRkxYp4HNFF0Js/Og6q2i++KXbg0gHCwM=
golang.org/x/sync v0.21.0/go.mod h1:9xrNwdLfx4jkKbNva9FpL6vEN7evnE43NNNJQ2LF3+0=
golang.org/x/sys v0.46.0 h1:noSf2Fq6F8DBgS+LysIkx7rIExoNHJsxOAtPp4rthXw=
golang.org/x/sys v0.46.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
gotest.tools/v3 v3.5.2 h1:7koQfIKdy+I8UTetycgUqXWSDwpgv193Ka+qRsmBY8Q=
gotest.tools/v3 v3.5.2/go.mod h1:LtdLGcnqToBH83WByAAi/wiwSFCArdFIUV/xxN4pcjA=
```

### `native/tsgolint-effect-fork/shim/checker/extra-shim.json`

Mode `100644`, blob `2fb95a1aea40c41b1f647c9386668487946e7de2`, SHA256 `83cbd18609cde9669ad652fcb551abeb9f4df23e0d7651f4e62d2324f92d3c03`, 2405 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "ExtraFunctions": [
    "isNonDeferredTypeReference",
    "getMappedTypeModifiers"
  ],
  "ExtraMethods": {
    "Checker": [
      "getBaseConstraintOfType",
      "getAssignmentReducedType",
      "getUnionTypeEx",
      "getTypeWithDefault",
      "hasTypeFacts",
      "extractDefinitelyFalsyTypes",
      "removeDefinitelyFalsyTypes",
      "isSpreadableProperty",
      "getDeclaredTypeOfSymbol",
      "getBaseTypes",
      "getSignaturesOfType",
      "getApparentType",
      "getIndexTypeOfType",
      "getPropertyOfType",
      "getPropertiesOfType",
      "getSignaturesOfType",
      "getPropertyNameForKnownSymbolName",
      "getTypeFromTypeNode",
      "getAccessedPropertyName",
      "isArrayOrTupleType",
      "isArrayType",
      "getTypeArguments",
      "getContextualType",
      "getApparentTypeOfContextualType",
      "getAwaitedType",
      "getTypeOfSymbol",
      "getTypeOfPropertyOfType",
      "getTypeOfPropertyOrIndexSignatureOfType",
      "getIndexedAccessTypeOrUndefined",
      "getFlowTypeOfReference",
      "getReturnTypeOfSignature",
      "getContextualTypeForArgumentAtIndex",
      "getResolvedSignature",
      "getBaseTypeOfLiteralType",
      "getWidenedType",
      "isTypeAssignableTo",
      "isTypeIdenticalTo",
      "IsDeprecatedDeclaration",
      "isDeprecatedSymbol",
      "GetShorthandAssignmentValueSymbol",
      "getImmediateAliasedSymbol",
      "getDeclarationOfAliasSymbol",
      "getTypePredicateOfSignature",
      "GetNonNullableType",
      "IsNullableType",
      "getIndexInfosOfType",
      "isReadonlySymbol",
      "getContextFreeTypeOfExpression"
    ]
  },
  "ExtraFields": {
    "Type": [
      "alias",
      "flags",
      "symbol",
      "objectFlags"
    ],
    "TupleType": [
      "combinedFlags",
      "minLength",
      "readonly"
    ],
    "Signature": [
      "parameters",
      "declaration",
      "resolvedTypePredicate"
    ],
    "Checker": [
      "numberType",
      "stringType",
      "booleanType",
      "globalRegExpType"
    ],
    "InterfaceType": [
      "thisType"
    ],
    "TypePredicate": [
      "kind",
      "t",
      "parameterIndex"
    ],
    "IndexedAccessType": [
      "objectType",
      "indexType"
    ],
    "MappedType": [
      "typeParameter",
      "constraintType",
      "templateType"
    ],
    "ConditionalType": [
      "checkType",
      "extendsType"
    ]
  }
}
```

### `native/tsgolint-effect-fork/shim/checker/go.sum`

Mode `100644`, blob `5ebb0925e75797baa58545d5e6376f78503b639e`, SHA256 `5a670ce2903678d58388a2b580b5302ec44fde408fd863e65c2b643c451a79ea`, 1951 bytes.

Dependency role: Inspected checksum/module boundary and its relation to selected provider/compiler modules.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68 h1:KZaTBSyshWX3MP5jukJcNSuXDQTO+rNpt0J564dX/eg=
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68/go.mod h1:tphK2c80bpPhMOI4v6bIc2xWywPfbqi1Z06+RcrMkDg=
github.com/google/go-cmp v0.7.0 h1:wk8382ETsv4JYUZwIsn6YpYiWiBsYLSJiTsyBybVuN8=
github.com/google/go-cmp v0.7.0/go.mod h1:pXiqmnSA92OHEEa9HXL2W4E7lf9JzCmGVUdgjX3N/iU=
github.com/klauspost/cpuid/v2 v2.2.10 h1:tBs3QSyvjDyFTq3uoc/9xFpCuOsJQFNPiAhYdw2skhE=
github.com/klauspost/cpuid/v2 v2.2.10/go.mod h1:hqwkgyIinND0mEev00jJYCxPNVRVXFQeu1XKlok6oO0=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b h1:IgfPOv9pzPZ1sbyRHOKu3UCvhaTS0IyrkTcs6JLPqhY=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b/go.mod h1:gV4G6M8xxLNqQSRHiFOgKHlY+5YJgYPM6QwFLWllC+8=
github.com/peter-evans/patience v0.3.0 h1:rX0JdJeepqdQl1Sk9c9uvorjYYzL2TfgLX1adqYm9cA=
github.com/peter-evans/patience v0.3.0/go.mod h1:Kmxu5sY1NmBLFSStvXjX1wS9mIv7wMcP/ubucyMOAu0=
github.com/zeebo/assert v1.3.0 h1:g7C04CbJuIDKNPFHmsk4hwZDO5O+kntRxzaUoNXj+IQ=
github.com/zeebo/assert v1.3.0/go.mod h1:Pq9JiuJQpG8JLJdtkwrJESF0Foym2/D9XMU5ciN/wJ0=
github.com/zeebo/xxh3 v1.1.0 h1:s7DLGDK45Dyfg7++yxI0khrfwq9661w9EN78eP/UZVs=
github.com/zeebo/xxh3 v1.1.0/go.mod h1:IisAie1LELR4xhVinxWS5+zf1lA4p0MW4T+w+W07F5s=
golang.org/x/sync v0.21.0 h1:HLII4xRRTtCRkxYp4HNFF0Js/Og6q2i++KXbg0gHCwM=
golang.org/x/sync v0.21.0/go.mod h1:9xrNwdLfx4jkKbNva9FpL6vEN7evnE43NNNJQ2LF3+0=
golang.org/x/sys v0.46.0 h1:noSf2Fq6F8DBgS+LysIkx7rIExoNHJsxOAtPp4rthXw=
golang.org/x/sys v0.46.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/text v0.38.0 h1:sXmwo9DwP3OK9EZ7PqAdaooSGozfl/3a6/xJcbzPRhE=
golang.org/x/text v0.38.0/go.mod h1:YXZt3QhHUKYT53r2lLKFIVi6Ao1jdzrTR/KQ09qyxF4=
gotest.tools/v3 v3.5.2 h1:7koQfIKdy+I8UTetycgUqXWSDwpgv193Ka+qRsmBY8Q=
gotest.tools/v3 v3.5.2/go.mod h1:LtdLGcnqToBH83WByAAi/wiwSFCArdFIUV/xxN4pcjA=
```

### `native/tsgolint-effect-fork/shim/compiler/go.sum`

Mode `100644`, blob `5ebb0925e75797baa58545d5e6376f78503b639e`, SHA256 `5a670ce2903678d58388a2b580b5302ec44fde408fd863e65c2b643c451a79ea`, 1951 bytes.

Dependency role: Inspected checksum/module boundary and its relation to selected provider/compiler modules.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68 h1:KZaTBSyshWX3MP5jukJcNSuXDQTO+rNpt0J564dX/eg=
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68/go.mod h1:tphK2c80bpPhMOI4v6bIc2xWywPfbqi1Z06+RcrMkDg=
github.com/google/go-cmp v0.7.0 h1:wk8382ETsv4JYUZwIsn6YpYiWiBsYLSJiTsyBybVuN8=
github.com/google/go-cmp v0.7.0/go.mod h1:pXiqmnSA92OHEEa9HXL2W4E7lf9JzCmGVUdgjX3N/iU=
github.com/klauspost/cpuid/v2 v2.2.10 h1:tBs3QSyvjDyFTq3uoc/9xFpCuOsJQFNPiAhYdw2skhE=
github.com/klauspost/cpuid/v2 v2.2.10/go.mod h1:hqwkgyIinND0mEev00jJYCxPNVRVXFQeu1XKlok6oO0=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b h1:IgfPOv9pzPZ1sbyRHOKu3UCvhaTS0IyrkTcs6JLPqhY=
github.com/microsoft/typescript-go v0.0.0-20260708042240-2bd066d87f5b/go.mod h1:gV4G6M8xxLNqQSRHiFOgKHlY+5YJgYPM6QwFLWllC+8=
github.com/peter-evans/patience v0.3.0 h1:rX0JdJeepqdQl1Sk9c9uvorjYYzL2TfgLX1adqYm9cA=
github.com/peter-evans/patience v0.3.0/go.mod h1:Kmxu5sY1NmBLFSStvXjX1wS9mIv7wMcP/ubucyMOAu0=
github.com/zeebo/assert v1.3.0 h1:g7C04CbJuIDKNPFHmsk4hwZDO5O+kntRxzaUoNXj+IQ=
github.com/zeebo/assert v1.3.0/go.mod h1:Pq9JiuJQpG8JLJdtkwrJESF0Foym2/D9XMU5ciN/wJ0=
github.com/zeebo/xxh3 v1.1.0 h1:s7DLGDK45Dyfg7++yxI0khrfwq9661w9EN78eP/UZVs=
github.com/zeebo/xxh3 v1.1.0/go.mod h1:IisAie1LELR4xhVinxWS5+zf1lA4p0MW4T+w+W07F5s=
golang.org/x/sync v0.21.0 h1:HLII4xRRTtCRkxYp4HNFF0Js/Og6q2i++KXbg0gHCwM=
golang.org/x/sync v0.21.0/go.mod h1:9xrNwdLfx4jkKbNva9FpL6vEN7evnE43NNNJQ2LF3+0=
golang.org/x/sys v0.46.0 h1:noSf2Fq6F8DBgS+LysIkx7rIExoNHJsxOAtPp4rthXw=
golang.org/x/sys v0.46.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/text v0.38.0 h1:sXmwo9DwP3OK9EZ7PqAdaooSGozfl/3a6/xJcbzPRhE=
golang.org/x/text v0.38.0/go.mod h1:YXZt3QhHUKYT53r2lLKFIVi6Ao1jdzrTR/KQ09qyxF4=
gotest.tools/v3 v3.5.2 h1:7koQfIKdy+I8UTetycgUqXWSDwpgv193Ka+qRsmBY8Q=
gotest.tools/v3 v3.5.2/go.mod h1:LtdLGcnqToBH83WByAAi/wiwSFCArdFIUV/xxN4pcjA=
```
