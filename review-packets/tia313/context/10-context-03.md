# Current imported boundary context

Review only how these interfaces support the Tiara custom changes. No stock import delta is being submitted.

### `native/effect-tsgo/_packages/tsgo-linux-x64/package.json`

Mode `100644`, blob `e2a6a60c905a91288fb56af9dde80b7ad3a6cd96`, SHA256 `e1c30518328a9ba978460ccaa196e886f25d551a5191f810c9407c1c55bb0ccf`, 789 bytes.

Dependency role: Read package metadata: name=@effect/tsgo-linux-x64, version=0.46.1, os=['linux'], cpu=['x64'], package file set=['artifacts/', 'lib/tsc', 'README.md', 'lib/upstream.json']; checked platform target and tsc binary artifact naming against wrapper/package resolver.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "@effect/tsgo-linux-x64",
  "version": "0.46.1",
  "description": "Effect Language Service for TypeScript-Go — Effect-specific diagnostics and hover features.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Effect-TS/tsgo.git",
    "directory": "_packages/tsgo-linux-x64"
  },
  "bugs": "https://github.com/Effect-TS/tsgo/issues",
  "homepage": "https://github.com/Effect-TS/tsgo#readme",
  "publishConfig": {
    "access": "public",
    "provenance": true,
    "executableFiles": [
      "./lib/tsc",
      "./lib/tsc-next",
      "./lib/tsgolint"
    ]
  },
  "preferUnplugged": true,
  "files": [
    "artifacts/",
    "lib/tsc",
    "README.md",
    "lib/upstream.json"
  ],
  "os": [
    "linux"
  ],
  "cpu": [
    "x64"
  ]
}
```

### `native/effect-tsgo/_packages/tsgo-win32-arm64/package.json`

Mode `100644`, blob `8bbd02bafb014f5a3aae0f1a12c780f7a669d3d0`, SHA256 `dde2b590f8fcd98d6166667ddfde7b272bdfc57fe848f9544227af27602cb8b3`, 811 bytes.

Dependency role: Read package metadata: name=@effect/tsgo-win32-arm64, version=0.46.1, os=['win32'], cpu=['arm64'], package file set=['artifacts/', 'lib/tsc.exe', 'README.md', 'lib/upstream.json']; checked platform target and tsc binary artifact naming against wrapper/package resolver.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "@effect/tsgo-win32-arm64",
  "version": "0.46.1",
  "description": "Effect Language Service for TypeScript-Go — Effect-specific diagnostics and hover features.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Effect-TS/tsgo.git",
    "directory": "_packages/tsgo-win32-arm64"
  },
  "bugs": "https://github.com/Effect-TS/tsgo/issues",
  "homepage": "https://github.com/Effect-TS/tsgo#readme",
  "publishConfig": {
    "access": "public",
    "provenance": true,
    "executableFiles": [
      "./lib/tsc.exe",
      "./lib/tsc-next.exe",
      "./lib/tsgolint.exe"
    ]
  },
  "preferUnplugged": true,
  "files": [
    "artifacts/",
    "lib/tsc.exe",
    "README.md",
    "lib/upstream.json"
  ],
  "os": [
    "win32"
  ],
  "cpu": [
    "arm64"
  ]
}
```

### `native/effect-tsgo/_packages/tsgo-win32-x64/package.json`

Mode `100644`, blob `4783dac4a16357c3248bb7a1e56282970c4f3172`, SHA256 `fdb8e70c179d26f74729c1c305d38c0218de09798cbe19c80a7f91c10d8b5672`, 805 bytes.

Dependency role: Read package metadata: name=@effect/tsgo-win32-x64, version=0.46.1, os=['win32'], cpu=['x64'], package file set=['artifacts/', 'lib/tsc.exe', 'README.md', 'lib/upstream.json']; checked platform target and tsc binary artifact naming against wrapper/package resolver.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "name": "@effect/tsgo-win32-x64",
  "version": "0.46.1",
  "description": "Effect Language Service for TypeScript-Go — Effect-specific diagnostics and hover features.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Effect-TS/tsgo.git",
    "directory": "_packages/tsgo-win32-x64"
  },
  "bugs": "https://github.com/Effect-TS/tsgo/issues",
  "homepage": "https://github.com/Effect-TS/tsgo#readme",
  "publishConfig": {
    "access": "public",
    "provenance": true,
    "executableFiles": [
      "./lib/tsc.exe",
      "./lib/tsc-next.exe",
      "./lib/tsgolint.exe"
    ]
  },
  "preferUnplugged": true,
  "files": [
    "artifacts/",
    "lib/tsc.exe",
    "README.md",
    "lib/upstream.json"
  ],
  "os": [
    "win32"
  ],
  "cpu": [
    "x64"
  ]
}
```

### `native/effect-tsgo/_packages/tsgo/.gitignore`

Mode `100644`, blob `5baa34a7c44a941ab31607b43fe945a81f1dc17c`, SHA256 `a00dbbb90c3c64040c8989ebaf8041c5aeda7b07b9acdddecd09fae704d1d6e1`, 77 bytes.

Dependency role: Read ignore patterns for generated/platform artifacts and local build outputs; checked against package contents/build generation boundary.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
dist/
node_modules/
README.md
oxlint-schema.json
oxlint-presets/
schema.json
```

### `native/effect-tsgo/_packages/tsgo/tsconfig.src.json`

Mode `100644`, blob `252bb3634799ca7f29a6bcbee9f3fae1586eab71`, SHA256 `f7b87c7a9a04e8c7207104ddbd814a7a2eb107a93b50d6bbec00eba548bf3cbd`, 458 bytes.

Dependency role: Inspected boundary content and its package/workflow consumer in source projection; unchanged context only, no upstream diff review performed.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "erasableSyntaxOnly": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "composite": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "dist/types",
    "types": ["node"]
  },
  "include": ["src", "src/metadata.json", "package.json", "upstream.json"]
}
```

### `native/effect-tsgo/_packages/tsgo/tsdown.config.ts`

Mode `100644`, blob `0011161ecfb732bc7eb1967aae62e4b9b895bde0`, SHA256 `a1c14cc53fa84672a94d0dee9aea39f78ea1bf9f0818d672ad6e327233ad5fa8`, 3071 bytes.

Dependency role: Read full package build config: CLI entry, CJS/node22 target, output path, and generated schema/preset copying behavior.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
import * as NodeFileSystem from "@effect/platform-node/NodeFileSystem"
import * as NodePath from "@effect/platform-node/NodePath"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import * as Layer from "effect/Layer"
import * as Path from "effect/Path"
import { defineConfig } from "tsdown"

const copyPackageFiles = () => {
  const program = Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const readme = yield* fs.readFileString("../../README.md")
    yield* fs.writeFileString(path.join("README.md"), readme)

    const schemaJson = yield* fs.readFileString("../../schema.json")
    yield* fs.writeFileString(path.join("schema.json"), schemaJson)

    const oxlintSchemaJson = yield* fs.readFileString("../../oxlint-schema.json")
    yield* fs.writeFileString(path.join("oxlint-schema.json"), oxlintSchemaJson)

    const presetDirectory = path.join("oxlint-presets")
    yield* fs.remove(presetDirectory, { recursive: true, force: true })
    yield* fs.makeDirectory(presetDirectory)

    const presetSources: Array<string> = []
    const presetSourceDirectory = path.join("../../oxlint-presets")
    const presetFiles = (yield* fs.readDirectory(presetSourceDirectory))
      .filter((name) => name.endsWith(".json"))
      .sort()
    const exportNames: Array<string> = []
    for (const presetFile of presetFiles) {
      const fileName = presetFile.slice(0, -".json".length)
      const exportName = fileName.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
      const source = yield* fs.readFileString(path.join(presetSourceDirectory, presetFile))
      yield* fs.writeFileString(path.join(presetDirectory, presetFile), source)
      presetSources.push(`export const ${exportName} = ${source.trim()}\n`)
      exportNames.push(exportName)
    }

    const generatedHeader = "// Code generated by the @effect/tsgo package build. DO NOT EDIT.\n\n"
    yield* fs.writeFileString(
      path.join(presetDirectory, "index.js"),
      `${generatedHeader}${presetSources.join("\n")}\nexport const presets = {\n${
        exportNames.map((name) => `  ${name},`).join("\n")
      }\n}\n`
    )
    yield* fs.writeFileString(
      path.join(presetDirectory, "index.d.ts"),
      `${generatedHeader}import type { OxlintConfig } from "oxlint"\n\n${
        exportNames.map((name) => `export declare const ${name}: OxlintConfig`).join("\n")
      }\n\nexport declare const presets: Readonly<{\n${
        exportNames.map((name) => `  ${name}: OxlintConfig`).join("\n")
      }\n}>\n`
    )
  }).pipe(Effect.provide(Layer.merge(NodeFileSystem.layer, NodePath.layerPosix)))

  return Effect.runPromise(program)
}

export default defineConfig({
  entry: {
    "effect-tsgo": "./src/cli/index.ts",
  },
  inlineOnly: false,
  outDir: "./dist",
  format: ["cjs"],
  platform: "node",
  target: "node22",
  dts: false,
  clean: true,
  outExtensions: () => ({
    js: ".cjs",
  }),
  banner: {
    js: "#!/usr/bin/env node",
  },
  onSuccess: copyPackageFiles,
})
```

### `native/effect-tsgo/_tools/gen_shims/config/checker/extra-shim.json`

Mode `100644`, blob `5aecc3d6abf4ec6301d5eea07943ba6b19001b50`, SHA256 `30d9dbd8f076189f9426a96560cf25d99d09e2740dc7ceae8c4f4437e2b37196`, 1436 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "ExtraFunctions": ["forEachYieldExpression", "getMappedTypeModifiers"],
  "ExtraMethods": {
    "Checker": ["isTypeAssignableTo", "isArrayType", "isReadonlyArrayType", "getIndexInfosOfType", "getTypeArguments", "getLiteralTypeFromProperty", "getSymbolIfSameReference", "getSymbolOfDeclaration", "isReferenceToType", "newFunctionType", "newCallSignature", "isSymbolAssigned", "isPastLastAssignment", "evaluateEntity", "isConstantVariable", "isBlockScopedNameDeclaredBeforeUse", "checkExpressionWithContextualType", "isNoInferType", "isReadonlySymbol", "getTypeParameterModifiers", "getTypeParameterFromMappedType", "getConstraintTypeFromMappedType", "getNameTypeFromMappedType", "getTemplateTypeFromMappedType"]
  },
  "ExtraFields": {
    "Checker": [
      "getGlobalPromiseTypeChecked",
      "emptyGenericType",
      "symbolReferenceLinks",
      "aliasSymbolLinks",
      "moduleSymbolLinks",
      "typeAliasLinks",
      "declaredTypeLinks",
      "typeNodeLinks"
    ],
    "IndexInfo": ["keyType", "valueType"],
    "SymbolReferenceLinks": ["referenceKinds"],
    "ValueSymbolLinks": ["resolvedType", "writeType"],
    "AliasSymbolLinks": ["immediateTarget", "aliasTarget", "referenced"],
    "ModuleSymbolLinks": ["resolvedExports", "exportsChecked"],
    "TypeAliasLinks": ["declaredType"],
    "DeclaredTypeLinks": ["declaredType"],
    "SymbolNodeLinks": ["resolvedSymbol"],
    "TypeNodeLinks": ["resolvedType"]
  }
}
```

### `native/effect-tsgo/_tools/gen_shims/config/fourslash/extra-shim.json`

Mode `100644`, blob `f0b252522c282aa2d9d2cc8481454fb4b804bade`, SHA256 `273b6340c3785f3356d31ed41f25ca37b227e100de7d3223e2510195899d7fb3`, 117 bytes.

Dependency role: Inspected full shim overlay structure and entries; checked package/key validity and merge/deduplication interactions with Effect and tsgolint overlays.

Current boundary content is included for its interface/dependency role, without an upstream before/after diff.

```text
{
  "CompactFields": {
    "FourslashTest": ["client"]
  },
  "ExtraFields": {
    "FourslashTest": ["client"]
  }
}
```
