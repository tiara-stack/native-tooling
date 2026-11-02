# Generated module family connections

O1 is the marker, O2 the provider API/module facade, O3 its canonical backport, and O4 an explicit compatibility bridge. G1 emits these from G2/G3/G4 policy and G5 pinned compiler/config state. Provider facades feed the compiler and tsgolint; canonical backports feed the Effect service. See consumer packets30-34. All215 output identities are enumerated, including unchanged outputs.

## Family `module`

`_backport/module/go.mod` O3; mode `100644`, blob `2bd482a1a2681b93a907a029e8c6f1479fadcc95`, SHA256 `421767ad290778b06cdfd2c85554982e042669a863915dfad75df49ac0e79b49`.

Paired provider `native/effect-tsgo/shim/module/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/module

go 1.26

require github.com/microsoft/typescript-go/shim/module v0.0.0
```

`_backport/module/shim.go` O3; mode `100644`, blob `012b90d1c8e4e76edef4d42db721cf899fb99cca`, SHA256 `5479fc72439f4287de1e846958a29483d140bb9e242c6de5b1633866d5e61d04`.

Paired provider `native/effect-tsgo/shim/module/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`module/go.mod` O2; mode `100644`, blob `2fa484125e4217d35d616504288ba63978df6bb7`, SHA256 `9591b9c6d7cbcf0ac4eab900629a6e5e26856595857879ac5e34021db4cc31c1`.

```go
module github.com/microsoft/typescript-go/shim/module

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`module/shim.go` O2; mode `100644`, blob `f3e4c8137201468cb7a2ac26ae3a56749edc4e9d`, SHA256 `683d62162323a4e899feb3ea442aac0f1abd0bf31d2ff037a1aa7ea90bbe9fc4`.

Provider has 46 top-level declaration lines and 18 linkname declarations. Relevant package/import and API anchors:

```go
package module
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/collections"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/diagnostics"
import "github.com/microsoft/typescript-go/internal/module"
import _ "unsafe"
func ComparePatternKeys(a string, b string) int
type DiagAndArgs = module.DiagAndArgs
type Ending = module.Ending
const EndingChangeable = module.EndingChangeable
const EndingExtensionChangeable = module.EndingExtensionChangeable
func GetCompilerOptionsWithRedirect(compilerOptions *core.CompilerOptions, redirectedReference module.ResolvedProjectReference) *core.CompilerOptions
```

## Family `modulespecifiers`

`_backport/modulespecifiers/go.mod` O3; mode `100644`, blob `6d32707000dae64cb8790e9a6e151d13a4ff9190`, SHA256 `684c82207b98d95193624bd06c97bb85a739deb70d6ada603bbfba732f514ddc`.

Paired provider `native/effect-tsgo/shim/modulespecifiers/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/modulespecifiers

go 1.26

require github.com/microsoft/typescript-go/shim/modulespecifiers v0.0.0
```

`_backport/modulespecifiers/shim.go` O3; mode `100644`, blob `f6aa388937d56fac1d55b8d656b5d3d12e219122`, SHA256 `413c792810acaf72f8b340ad5c1de0339fe6cfd8de0712be27aa858695edd0b3`.

Paired provider `native/effect-tsgo/shim/modulespecifiers/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`modulespecifiers/go.mod` O2; mode `100644`, blob `3005e609c614e7edcf8359fd6423cde29a7b918a`, SHA256 `5c751d8a76e5b6c280f114a0a82e3514db6b502c421a6baf1087abab6d861ca8`.

```go
module github.com/microsoft/typescript-go/shim/modulespecifiers

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`modulespecifiers/shim.go` O2; mode `100644`, blob `20cab0fe6fe8ca519996d4716558ec2024effd56`, SHA256 `636a563eea369a9bf5d6dea1b26602dca77ffd06babeb2d337da114e84ced13e`.

Provider has 59 top-level declaration lines and 17 linkname declarations. Relevant package/import and API anchors:

```go
package modulespecifiers
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/module"
import "github.com/microsoft/typescript-go/internal/modulespecifiers"
import _ "unsafe"
type CheckerShape = modulespecifiers.CheckerShape
func ContainsNodeModules(s string) bool
func CountPathComponents(path string) int
func GetAllowedEndingsInPreferredOrder(prefs modulespecifiers.UserPreferences, host modulespecifiers.ModuleSpecifierGenerationHost, compilerOptions *core.CompilerOptions, importingSourceFile modulespecifiers.SourceFileForSpecifierGeneration, oldImportSpecifier string, syntaxImpliedNodeFormat core.ResolutionMode) []modulespecifiers.ModuleSpecifierEnding
func GetEachFileNameOfModule(importingFileName string, importedFileName string, host modulespecifiers.ModuleSpecifierGenerationHost, preferSymlinks bool) []modulespecifiers.ModulePath
```

## Family `nodebuilder`

`_backport/nodebuilder/go.mod` O3; mode `100644`, blob `8d95fbd86c094286059d37fbe17b9f2387824cec`, SHA256 `067ebcfb7694564da74330cb09132c4aaaf7f33691dfc628b2e329701dde163d`.

Paired provider `native/effect-tsgo/shim/nodebuilder/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/nodebuilder

go 1.26

require github.com/microsoft/typescript-go/shim/nodebuilder v0.0.0
```

`_backport/nodebuilder/shim.go` O3; mode `100644`, blob `4c233ba711f94ffb83e68130144253d261e21379`, SHA256 `31bc62911fcccfdc87220f95e624442f7425df43327a7d7d0aef29986e85e6b4`.

Paired provider `native/effect-tsgo/shim/nodebuilder/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`nodebuilder/go.mod` O2; mode `100644`, blob `50fd790a45b39d263a5db986f2b5c889564b858f`, SHA256 `d47cafc5837a9eb3734569fffaf05b489a6e609ec1c86d9d60244f1c01dfece6`.

```go
module github.com/microsoft/typescript-go/shim/nodebuilder

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`nodebuilder/shim.go` O2; mode `100644`, blob `fc4c1e6a9430da6a3bb5a5e1d14dc8f63de517c2`, SHA256 `d2412e0c5b2636a79554c8351976b648efd514c48193cc8251a70a236d717e71`.

Provider has 41 top-level declaration lines and 0 linkname declarations. Relevant package/import and API anchors:

```go
package nodebuilder
import "github.com/microsoft/typescript-go/internal/nodebuilder"
type Flags = nodebuilder.Flags
const FlagsAllowAnonymousIdentifier = nodebuilder.FlagsAllowAnonymousIdentifier
const FlagsAllowEmptyIndexInfoType = nodebuilder.FlagsAllowEmptyIndexInfoType
const FlagsAllowEmptyTuple = nodebuilder.FlagsAllowEmptyTuple
const FlagsAllowEmptyUnionOrIntersection = nodebuilder.FlagsAllowEmptyUnionOrIntersection
```

## Family `packagejson`

`_backport/packagejson/go.mod` O3; mode `100644`, blob `a2a368986914f6ebe1c15f67c27aaf22d87ff2dd`, SHA256 `9f5b14ebd6730f7b0ae482828004a76485ce966f5907ad100b63cc3d74ea94b5`.

Paired provider `native/effect-tsgo/shim/packagejson/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/packagejson

go 1.26

require github.com/microsoft/typescript-go/shim/packagejson v0.0.0
```

`_backport/packagejson/shim.go` O3; mode `100644`, blob `a474c7b3fe814338e4a7b88a5c86051ecaea2306`, SHA256 `08d05be954da54e854561510ab8379d2eee9404ffad20c9471c2da8741b21245`.

Paired provider `native/effect-tsgo/shim/packagejson/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`packagejson/go.mod` O2; mode `100644`, blob `d84fe7c7c0cfc62c54022589b184815f6246790c`, SHA256 `bba7937d02cada35c98d40e4a2b711640589dc5ca36ea798a82837bab3686041`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/packagejson/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/packagejson

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`packagejson/shim.go` O2; mode `100644`, blob `cd8a55592d6f37d3cc51cda7c87e820152d1703a`, SHA256 `bf7d22ef9ddd16dee6d56f60ec6fb1a87dd0a0779012595a46a7f2e016bb0ef6`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/packagejson/shim.go` is byte-identical and uses this provider interface.

Provider has 22 top-level declaration lines and 2 linkname declarations. Relevant package/import and API anchors:

```go
package packagejson
import "github.com/microsoft/typescript-go/internal/packagejson"
import _ "unsafe"
type DependencyFields = packagejson.DependencyFields
type Expected[T any] = packagejson.Expected[T]
type ExportsOrImports = packagejson.ExportsOrImports
type Fields = packagejson.Fields
type HeaderFields = packagejson.HeaderFields
```

## Family `parser`

`_backport/parser/go.mod` O3; mode `100644`, blob `4f8ac5f515f7e836b9da200ab66489f5ff09aab2`, SHA256 `c6c029429b4e0db15b234181e6fc1a7d78366a839904791dd34cdc1128946145`.

Paired provider `native/effect-tsgo/shim/parser/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/parser

go 1.26

require github.com/microsoft/typescript-go/shim/parser v0.0.0
```

`_backport/parser/shim.go` O3; mode `100644`, blob `8e7561ead9d79cf21ed311ed1be3ea54837adf90`, SHA256 `dd9715e6d9769954acf7668bc8ea2f1e4f20f34b95cae76b36d3bd89c5dba5c9`.

Paired provider `native/effect-tsgo/shim/parser/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`parser/go.mod` O2; mode `100644`, blob `20e030fb8766f67caba4e2fa8592549dc7646b44`, SHA256 `387879630b20d83fb5eb97bdaa27ee445123d64b194c2400ae242e9cb3ba2eb6`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/parser/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/parser

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`parser/shim.go` O2; mode `100644`, blob `7573cbd3f4a5922ff6e7e2b3f1e3f3f95eecde34`, SHA256 `421c0ff4f187a052565a5d7c0f8d013ad960945d164679c052ad1fa3da02c40f`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/parser/shim.go` is byte-identical and uses this provider interface.

Provider has 42 top-level declaration lines and 3 linkname declarations. Relevant package/import and API anchors:

```go
package parser
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/parser"
import _ "unsafe"
func GetJSDocCommentRanges(f *ast.NodeFactory, commentRanges []ast.CommentRange, node *ast.Node, text string) []ast.CommentRange
type JSDocInfo = parser.JSDocInfo
const PCArgumentExpressions = parser.PCArgumentExpressions
const PCArrayBindingElements = parser.PCArrayBindingElements
const PCArrayLiteralMembers = parser.PCArrayLiteralMembers
```

## Family `printer`

`_backport/printer/go.mod` O3; mode `100644`, blob `a34b1a789f306dae1e53e1eab48f385dd8b8681b`, SHA256 `30b974bfaacff774e943ec97827b3dfb6ed10d09aaf85c859cbca08bcd103359`.

Paired provider `native/effect-tsgo/shim/printer/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/printer

go 1.26

require github.com/microsoft/typescript-go/shim/printer v0.0.0
```

`_backport/printer/shim.go` O3; mode `100644`, blob `14b3a9110ac478253f626309fa924fc5b67ad9e0`, SHA256 `f5e3da84d237b3f8b68c603b90de7e1861c1f18c20be46b279197a80f550e0af`.

Paired provider `native/effect-tsgo/shim/printer/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`printer/go.mod` O2; mode `100644`, blob `76ecec401e3200d677138df31d6887fdf0d6c04a`, SHA256 `faeccc5ba2cacf842f12e15e76dbaec73e2bed509a3fb6f8704e1be48352728f`.

```go
module github.com/microsoft/typescript-go/shim/printer

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`printer/shim.go` O2; mode `100644`, blob `7c7c41047895117a3b62fa29adca724f4780b808`, SHA256 `6ea11e51f72158d05ad5baec73a9ac1f2d04b99b3a6d84f53829b0f13fdb8254`.

Provider has 188 top-level declaration lines and 17 linkname declarations. Relevant package/import and API anchors:

```go
package printer
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/printer"
import _ "unsafe"
var AdvancedAsyncSuperHelper = printer.AdvancedAsyncSuperHelper
type AssignedNameOptions = printer.AssignedNameOptions
var AsyncSuperHelper = printer.AsyncSuperHelper
type AutoGenerateId = printer.AutoGenerateId
type AutoGenerateInfo = printer.AutoGenerateInfo
```

## Family `project`

`_backport/project/compatibility.go` O3; mode `100644`, blob `40d44636e4cc6fbcb3b59d09c6d3720ebfbde10b`, SHA256 `2c8e7fd7433f9d83755fd569b494e49763edc764ffdcdf56e7d208bf9add9c98`.

Paired provider `native/effect-tsgo/shim/project/compatibility.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`_backport/project/go.mod` O3; mode `100644`, blob `1cf0e758cbb623f74a3d46f1a0fa6a9c7fc839f5`, SHA256 `d26a24ae7e96b2256f3142c4f5cc11d09d8c7d7cae968685390b1b587831e87a`.

Paired provider `native/effect-tsgo/shim/project/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/project

go 1.26

require github.com/microsoft/typescript-go/shim/project v0.0.0
```

`_backport/project/shim.go` O3; mode `100644`, blob `0e807d5e840cb18c6b27eb500ae99ba76c2a0fa3`, SHA256 `f8f644da7b5515f8ca121c58c2f8d6e164f62991453a37cadde897e09418ded2`.

Paired provider `native/effect-tsgo/shim/project/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`project/compatibility.go` O4; mode `100644`, blob `1240d44e146e1618eb4a0fd15ed39e26c34f310e`, SHA256 `4190f494b02a904322569fa92d796b4c1f19834e7b21e351eff18c392230abb1`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/project/compatibility.go` is byte-identical and uses this provider interface.

```go
package project

import (
	"github.com/microsoft/typescript-go/internal/collections"
	"github.com/microsoft/typescript-go/internal/ls/lsconv"
	"github.com/microsoft/typescript-go/internal/lsp/lsproto"
	"github.com/microsoft/typescript-go/internal/project"
)

func NewOpenFileSnapshotRequest(fileName string, _ string, _ bool) *project.APISnapshotRequest {
	openFiles := &collections.Set[lsproto.DocumentUri]{}
	openFiles.Add(lsconv.FileNameToDocumentURI(fileName))
	return &project.APISnapshotRequest{OpenFiles: openFiles}
}

func DerefSnapshot(snapshot *project.Snapshot, session *project.Session) {
	snapshot.Deref(session)
}
```

`project/go.mod` O2; mode `100644`, blob `d88bd3902c4aebe2bbf12755a3933e4f9664926b`, SHA256 `d40aa14b8f2897aa8bb9157ba6fa8e694727f952a05aa44df7cae818a850f826`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/project/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/project

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`project/shim.go` O2; mode `100644`, blob `04e40aab768a9909c550c7500fc7a9bceb4bab00`, SHA256 `2f7b759034176fde6187835d747f748523fe1afc4e98ac4000273428977da89a`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/project/shim.go` is byte-identical and uses this provider interface.

Provider has 91 top-level declaration lines and 14 linkname declarations. Relevant package/import and API anchors:

```go
package project
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/ls/autoimport"
import "github.com/microsoft/typescript-go/internal/ls/lsutil"
import "github.com/microsoft/typescript-go/internal/lsp/lsproto"
import "github.com/microsoft/typescript-go/internal/project"
import "github.com/microsoft/typescript-go/internal/project/dirty"
import "github.com/microsoft/typescript-go/internal/project/logging"
import "github.com/microsoft/typescript-go/internal/tsoptions"
import "github.com/microsoft/typescript-go/internal/tspath"
import "github.com/microsoft/typescript-go/internal/vfs"
import "github.com/zeebo/xxh3"
import _ "unsafe"
type APISnapshotRequest = project.APISnapshotRequest
type APIState = project.APIState
type ATAStateChange = project.ATAStateChange
type CheckerPoolOptions = project.CheckerPoolOptions
type Client = project.Client
```

## Family `project/dirty`

`_backport/project/dirty/go.mod` O3; mode `100644`, blob `d5c680feb94fed9e183e8be2285bdde8dd407345`, SHA256 `ba1ecc15277d34120ed157adfb18adfb9bc20934883a31b2a194e52f21359d4d`.

Paired provider `native/effect-tsgo/shim/project/dirty/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/project/dirty

go 1.26

require github.com/microsoft/typescript-go/shim/project/dirty v0.0.0
```

`_backport/project/dirty/shim.go` O3; mode `100644`, blob `fe818928022207c699d96a24b0d5740feea63545`, SHA256 `4e07a3be2a818f35664e2c1465ef23557cc0b4abb31e2b786939163093263d01`.

Paired provider `native/effect-tsgo/shim/project/dirty/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`project/dirty/go.mod` O2; mode `100644`, blob `cd07e40c8239695b85f0d84c018d1e44824f9253`, SHA256 `6cc7c4bfaee997815d7f7434bd99ca01ad74352e88d1dbb453c89dc3bedfab1b`.

```go
module github.com/microsoft/typescript-go/shim/project/dirty

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`project/dirty/shim.go` O2; mode `100644`, blob `88da01920410705a36aebe445b50850aefc29cb5`, SHA256 `f1a203bfae54bcaca1863f6bc743e4d274ee0bcb4c23e41ac4da0df5606b7c95`.

Provider has 10 top-level declaration lines and 0 linkname declarations. Relevant package/import and API anchors:

```go
package dirty
import "github.com/microsoft/typescript-go/internal/project/dirty"
type Box[T dirty.Cloneable[T]] = dirty.Box[T]
type Cloneable[T any] = dirty.Cloneable[T]
type CloneableMap[K comparable, V any] = dirty.CloneableMap[K,V]
type FinalizationHooks[K comparable, V any] = dirty.FinalizationHooks[K,V]
type Map[K comparable, V dirty.Cloneable[V]] = dirty.Map[K,V]
```
