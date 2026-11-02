# Generator input group G2

These current bytes or named source slices feed the producer. Assess the generation relationship with output crosswalks and all five consumer packets.

### `native/effect-tsgo/_tools/gen_shims/config/checker/extra-shim.json`

Mode `100644`, blob `5aecc3d6abf4ec6301d5eea07943ba6b19001b50`, SHA256 `30d9dbd8f076189f9426a96560cf25d99d09e2740dc7ceae8c4f4437e2b37196`, 1436 bytes.

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

### `native/effect-tsgo/_tools/gen_shims/config/ls/change/extra-shim.json`

Mode `100644`, blob `ec88b9395a02beee2c7d59bbd6d647fd4d31b5a2`, SHA256 `a47b18838d3d9e5d1a5feab5d43e903938db6ef23b29e5afdc6ecc0a523aa61f`, 67 bytes.

```text
{
  "ExtraMethods": {
    "Tracker": ["getNonformattedText"]
  }
}
```

### `native/effect-tsgo/_tools/gen_shims/config/ls/extra-shim.json`

Mode `100644`, blob `1b3ed841fd756268dc92951534d43d45e2fbb87d`, SHA256 `2844c364b9d1d119652fc38390142836ba700b6d7cc102a66f92dc03cd6b2196`, 194 bytes.

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
