# Generator input group G4

These current bytes or named source slices feed the producer. Assess the generation relationship with output crosswalks and all five consumer packets.

### `native/tsgolint-effect-fork/shim/ast/extra-shim.json`

Mode `100644`, blob `64401032151e3973292c3513c3b85859575a258c`, SHA256 `1223f6cb16b05f7151a9898835932c0149401202804fb5bf968cc716ffc15b94`, 205 bytes.

```text
{
  "ExtraMethods": {
    "Node": [
      "Type"
    ],
    "Diagnostic": [
      "File",
      "Loc",
      "Code",
      "Category",
      "MessageKey",
      "MessageArgs",
      "Localize"
    ]
  }
}
```

### `native/tsgolint-effect-fork/shim/checker/extra-shim.json`

Mode `100644`, blob `2fb95a1aea40c41b1f647c9386668487946e7de2`, SHA256 `83cbd18609cde9669ad652fcb551abeb9f4df23e0d7651f4e62d2324f92d3c03`, 2405 bytes.

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

### `native/tsgolint-effect-fork/shim/compiler/extra-shim.json`

Mode `100644`, blob `b020b06461b8e7ec6495eea2f0570621f21d6282`, SHA256 `eab044fc4ce423a1e2d5498c323bc7dd8ef22fd64ecec0bb416fd444dbc08ec4`, 147 bytes.

```text
{
  "ExtraMethods": {
    "Program": [
      "ForEachCheckerParallel",
      "GetSemanticDiagnostics",
      "GetSyntacticDiagnostics"
    ]
  }
}
```

### `native/tsgolint-effect-fork/shim/project/extra-shim.json`

Mode `100644`, blob `548a677171198f63e13eedf5957fb2f257ae3431`, SHA256 `35c973db3a6c200e6b40dc89d3774871646b35a494f07da660d543e53f10568d`, 170 bytes.

```text
{
  "ExtraMethods": {
    "ConfigFileRegistryBuilder": [
      "ComputeConfigFileName",
      "FindOrAcquireConfigForFile",
      "GetAncestorConfigFileName"
    ]
  }
}
```

### `native/tsgolint-effect-fork/shim/tsoptions/extra-shim.json`

Mode `100644`, blob `4d7294b6404f2dc1b784633b0fc0fe2f5c5ff258`, SHA256 `28c0612033aec3a8f1f6c84d74b000aaf8d29407f06318c2e862c1b9566fceb0`, 138 bytes.

```text
{
  "IgnoreFunctions": [
    "GetSupportedExtensions",
    "ParseJsonConfigFileContent",
    "ParseJsonSourceFileConfigFileContent"
  ]
}
```

### `native/tsgolint-effect-fork/shim/vfs/extra-shim.json`

Mode `100644`, blob `805d3ae7b767f262a0e9d8db1ef1a00ddd6322b3`, SHA256 `902a20030dcb6e95ee91dc05d3c1c553e806afd814bcef4545af06f91b9df861`, 136 bytes.

```text
{
  "IgnoreFunctions": [
    "GetPatternFromSpec",
    "GetRegularExpressionForWildcard",
    "GetRegularExpressionsForWildcards"
  ]
}
```
