# Generated module family connections

O1 is the marker, O2 the provider API/module facade, O3 its canonical backport, and O4 an explicit compatibility bridge. G1 emits these from G2/G3/G4 policy and G5 pinned compiler/config state. Provider facades feed the compiler and tsgolint; canonical backports feed the Effect service. See consumer packets30-34. All215 output identities are enumerated, including unchanged outputs.

## Family `locale`

`_backport/locale/go.mod` O3; mode `100644`, blob `66a7445104b928b52e932db8c797e0cbb5c79189`, SHA256 `c101c7ad4c196e72f0c56b5c395d6b69cda0c28f092962488f3bef74ce926e5e`.

Paired provider `native/effect-tsgo/shim/locale/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/locale

go 1.26

require github.com/microsoft/typescript-go/shim/locale v0.0.0
```

`_backport/locale/shim.go` O3; mode `100644`, blob `1e6d529462a8c8767d4e6ac27e1c6d12e2d730cf`, SHA256 `d34bf726ff27ed3141b30da7642aa0f91af19e9a8cc00244316ecbae39690bfd`.

Paired provider `native/effect-tsgo/shim/locale/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`locale/go.mod` O2; mode `100644`, blob `3b6f744977b8e1969b3d0b42249ef446d7f9e80d`, SHA256 `1fd6760535780c15a7d62bfc71e44c0017db538526a4c10cdd006728fad2d4f9`.

```go
module github.com/microsoft/typescript-go/shim/locale

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`locale/shim.go` O2; mode `100644`, blob `c76a34c3880082f5cd0abeebed560b6388419ad3`, SHA256 `25628440a08b66d62fef430596fc128352e2e4850fec3ee6bc31fd2043789725`.

Provider has 5 top-level declaration lines and 3 linkname declarations. Relevant package/import and API anchors:

```go
package locale
import "context"
import "github.com/microsoft/typescript-go/internal/locale"
import _ "unsafe"
var Default = locale.Default
func FromContext(ctx context.Context) locale.Locale
type Locale = locale.Locale
func Parse(localeStr string) (locale locale.Locale, ok bool)
func WithLocale(ctx context.Context, locale locale.Locale) context.Context
```

## Family `ls`

`_backport/ls/go.mod` O3; mode `100644`, blob `aa0b301c2514368228a19391c2886cde164d41b0`, SHA256 `0238c588435be369821a89c220e6ade202385b5ffcb44364395c13aeb0d749ae`.

Paired provider `native/effect-tsgo/shim/ls/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/ls

go 1.26

require github.com/microsoft/typescript-go/shim/ls v0.0.0
```

`_backport/ls/shim.go` O3; mode `100644`, blob `5f0b9168775fab046450d7c6d5a76615e679ca5a`, SHA256 `43bc6ef4e65acbc82929d33f7b89f3cd39681981a6071980d72b7acf3263cb71`.

Paired provider `native/effect-tsgo/shim/ls/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`ls/go.mod` O2; mode `100644`, blob `a76a0866756feb3f6e5d3107c021aae7c70ba7e1`, SHA256 `07320fda50029e41a0564131690bcc472494c6b2d2aeff513e25f59494e7314e`.

```go
module github.com/microsoft/typescript-go/shim/ls

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`ls/shim.go` O2; mode `100644`, blob `e0031e684e4adf356cfb3da4603ffe20f0057bd6`, SHA256 `f780fb077567ef113d52ea9d4a0cc4086671ebbb78fcfc9bbafd845a44046bdb`.

Provider has 110 top-level declaration lines and 19 linkname declarations. Relevant package/import and API anchors:

```go
package ls
import "context"
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/checker"
import "github.com/microsoft/typescript-go/internal/compiler"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/ls"
import "github.com/microsoft/typescript-go/internal/ls/lsconv"
import "github.com/microsoft/typescript-go/internal/ls/lsutil"
import "github.com/microsoft/typescript-go/internal/lsp/lsproto"
import "github.com/microsoft/typescript-go/internal/sourcemap"
import "github.com/microsoft/typescript-go/internal/tspath"
import "unsafe"
var AfterCompletionCallback = ls.AfterCompletionCallback
var AfterDocumentSymbolsCallback = ls.AfterDocumentSymbolsCallback
var AfterInlayHintsCallback = ls.AfterInlayHintsCallback
var AfterQuickInfoCallback = ls.AfterQuickInfoCallback
type CallHierarchyDeclaration = ls.CallHierarchyDeclaration
```

## Family `ls/autoimport`

`_backport/ls/autoimport/go.mod` O3; mode `100644`, blob `fef44af3b5130db52a26bce0b864e87981704c38`, SHA256 `f0410640e0d89138948255cad3a8713db21ce8d79f77fea4f15f6adf1cad16ca`.

Paired provider `native/effect-tsgo/shim/ls/autoimport/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/ls/autoimport

go 1.26

require github.com/microsoft/typescript-go/shim/ls/autoimport v0.0.0
```

`_backport/ls/autoimport/shim.go` O3; mode `100644`, blob `39157dccc1091c81a123493583a075f1e989142c`, SHA256 `d878fd03bdc7b3962d387cd2c89af3fb7276bed811525999898ee176a77ebe12`.

Paired provider `native/effect-tsgo/shim/ls/autoimport/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`ls/autoimport/go.mod` O2; mode `100644`, blob `63e2e100e1af2ee72b4c8509165732f9d4d49c65`, SHA256 `88129b4dc7620200bf00fc9412f40af45e91bdcf3e53b09aed9be0bf6be977cb`.

```go
module github.com/microsoft/typescript-go/shim/ls/autoimport

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`ls/autoimport/shim.go` O2; mode `100644`, blob `696e4d5c51d10f333fa745cc531e3cfa3df72394`, SHA256 `8bf6eb795223149088e98ac2154a217447fd87b312ebf0a1eea94417acd9a0d0`.

Provider has 40 top-level declaration lines and 8 linkname declarations. Relevant package/import and API anchors:

```go
package autoimport
import "context"
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/checker"
import "github.com/microsoft/typescript-go/internal/compiler"
import "github.com/microsoft/typescript-go/internal/ls/autoimport"
import "github.com/microsoft/typescript-go/internal/ls/lsconv"
import "github.com/microsoft/typescript-go/internal/ls/lsutil"
import "github.com/microsoft/typescript-go/internal/modulespecifiers"
import "github.com/microsoft/typescript-go/internal/tspath"
import _ "unsafe"
type BucketState = autoimport.BucketState
type BucketStats = autoimport.BucketStats
type CacheStats = autoimport.CacheStats
type Export = autoimport.Export
type ExportID = autoimport.ExportID
```

## Family `ls/change`

`_backport/ls/change/compatibility.go` O3; mode `100644`, blob `027e5683d040c00fb41c90193388e6a1392a2dfb`, SHA256 `5ba1036860be1cc507766a0452f9e9c2736f1050318d3a8f3cfdadfbee492f14`.

Paired provider `native/effect-tsgo/shim/ls/change/compatibility.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`_backport/ls/change/go.mod` O3; mode `100644`, blob `06bae3f475b97f8dc619955180dfb67718c535a3`, SHA256 `7a924facd96fcc051de43d44a5147a914b404b51ec07f9b756753644dcc17f36`.

Paired provider `native/effect-tsgo/shim/ls/change/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/ls/change

go 1.26

require github.com/microsoft/typescript-go/shim/ls/change v0.0.0
```

`_backport/ls/change/shim.go` O3; mode `100644`, blob `3d8df8480efd0bdf0914eb3d110ee8b8c03d5adf`, SHA256 `14f3ac07ec33569ebb5d45864d2220e5d9a0f3acd5c1eb1a3f2b459352cbf2dc`.

Paired provider `native/effect-tsgo/shim/ls/change/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`ls/change/compatibility.go` O4; mode `100644`, blob `e1edfa68519ffb3aec4f0eb6a679583cf6874913`, SHA256 `ab80bc1add1b115ab1054af7c1b4d710e2b791d9f9d2650bf71fae5b510367c6`.

```go
package change

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/ls/change"
	"github.com/microsoft/typescript-go/internal/lsp/lsproto"
)

func GetChanges(tracker *change.Tracker) map[string][]*lsproto.TextEdit {
	return tracker.GetChanges()
}

func NewModuleDeclaration(
	tracker *change.Tracker,
	modifiers *ast.ModifierList,
	keyword ast.Kind,
	name *ast.ModuleName,
	body *ast.ModuleBody,
) *ast.Node {
	return tracker.NewModuleDeclaration(modifiers, keyword, name, body)
}

func ReplaceAdjustedRangeWithText(
	tracker *change.Tracker,
	sourceFile *ast.SourceFile,
	startNode *ast.Node,
	endNode *ast.Node,
	leadingOption change.LeadingTriviaOption,
	trailingOption change.TrailingTriviaOption,
	text string,
) {
	rng := tracker.GetAdjustedRange(sourceFile, startNode, endNode, leadingOption, trailingOption)
	tracker.ReplaceRangeWithText(sourceFile, rng, text)
}

func InsertTextAtAdjustedRangeStart(
	tracker *change.Tracker,
	sourceFile *ast.SourceFile,
	startNode *ast.Node,
	endNode *ast.Node,
	leadingOption change.LeadingTriviaOption,
	trailingOption change.TrailingTriviaOption,
	text string,
) {
	rng := tracker.GetAdjustedRange(sourceFile, startNode, endNode, leadingOption, trailingOption)
	tracker.ReplaceRangeWithText(sourceFile, lsproto.Range{Start: rng.Start, End: rng.Start}, text)
}
```

`ls/change/go.mod` O2; mode `100644`, blob `58f12fcb0a141d915e1cd5916692b303de49add5`, SHA256 `49be70debaca04a0b96a36bb0e98a93a9fa6299137aa131bb0bbb6b2c754de43`.

```go
module github.com/microsoft/typescript-go/shim/ls/change

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`ls/change/shim.go` O2; mode `100644`, blob `d772ff60df8b2e631f4c25d0a5529da6c5d1981f`, SHA256 `528773afedcf0dc78c31446c88d905f9552a5de869989f8c02f9974941dfad1e`.

Provider has 15 top-level declaration lines and 2 linkname declarations. Relevant package/import and API anchors:

```go
package change
import "context"
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/ls/change"
import "github.com/microsoft/typescript-go/internal/ls/lsconv"
import "github.com/microsoft/typescript-go/internal/ls/lsutil"
import _ "unsafe"
type LeadingTriviaOption = change.LeadingTriviaOption
const LeadingTriviaOptionExclude = change.LeadingTriviaOptionExclude
const LeadingTriviaOptionIncludeAll = change.LeadingTriviaOptionIncludeAll
const LeadingTriviaOptionJSDoc = change.LeadingTriviaOptionJSDoc
const LeadingTriviaOptionNone = change.LeadingTriviaOptionNone
```

## Family `ls/lsconv`

`_backport/ls/lsconv/compatibility.go` O3; mode `100644`, blob `4f3208b9c49eca187bb070b4d59fb81d17a93a4f`, SHA256 `c3ec08390e794d8973033b33b0c90383f9484450b7975860efd86ac894dd5de0`.

Paired provider `native/effect-tsgo/shim/ls/lsconv/compatibility.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`_backport/ls/lsconv/go.mod` O3; mode `100644`, blob `6d59c7bc73edb3fc3950241f4b926ed504957d6e`, SHA256 `61fb5c18be339a919c7e8f9522172b626d6b222ea0af33df3b9c208ce68afbd8`.

Paired provider `native/effect-tsgo/shim/ls/lsconv/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/ls/lsconv

go 1.26

require github.com/microsoft/typescript-go/shim/ls/lsconv v0.0.0
```

`_backport/ls/lsconv/shim.go` O3; mode `100644`, blob `7f195b2534182193e7e14ad1183c4b50efc017b5`, SHA256 `895a71e12011bf103097f48b25a9bf494cb4de2cb9b8be2e604539a29541158c`.

Paired provider `native/effect-tsgo/shim/ls/lsconv/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`ls/lsconv/compatibility.go` O4; mode `100644`, blob `cbef57af2941a3f62b87df18df395177e1859802`, SHA256 `444697c6dc600b37f892a6ee4186e67ee7d77b38df506cf816a9a4c248819793`.

```go
package lsconv

import (
	"github.com/microsoft/typescript-go/internal/core"
	"github.com/microsoft/typescript-go/internal/ls/lsconv"
	"github.com/microsoft/typescript-go/internal/lsp/lsproto"
)

func FromLSPRangeToOriginal(c *lsconv.Converters, script lsconv.Script, textRange lsproto.Range) core.TextRange {
	return c.FromLSPRange(script, textRange)
}
```

`ls/lsconv/go.mod` O2; mode `100644`, blob `d1250178b0bf20783d8d857cf4651b54470d8ed1`, SHA256 `3c680dfb594716bb0bf522cb9d1c9419eb949bbfa4517f6c7ecb2d35e37680e3`.

```go
module github.com/microsoft/typescript-go/shim/ls/lsconv

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`ls/lsconv/shim.go` O2; mode `100644`, blob `a74ae9a60389861d4e375a75a90f8b9fb453cb7f`, SHA256 `09756d40d90b401a59b22ccf3baca09977c30613b8f9d99bb080cf3adf62dc83`.

Provider has 10 top-level declaration lines and 6 linkname declarations. Relevant package/import and API anchors:

```go
package lsconv
import "context"
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/ls/lsconv"
import "github.com/microsoft/typescript-go/internal/lsp/lsproto"
import _ "unsafe"
func ComputeLSPLineStarts(text string) *lsconv.LSPLineMap
type Converters = lsconv.Converters
func DiagnosticToLSPPull(ctx context.Context, converters *lsconv.Converters, diagnostic *ast.Diagnostic, reportStyleChecksAsWarnings bool) *lsproto.Diagnostic
func DiagnosticToLSPPush(ctx context.Context, converters *lsconv.Converters, diagnostic *ast.Diagnostic) *lsproto.Diagnostic
func FileNameToDocumentURI(fileName string) lsproto.DocumentUri
```

## Family `ls/lsutil`

`_backport/ls/lsutil/go.mod` O3; mode `100644`, blob `b4d0493de6b516831cbae8369a27593f19c9d963`, SHA256 `bdcea3bc5e3dc57d6b3114f9b471ed2ee5f669b969d3cbc506f8dda3accf157b`.

Paired provider `native/effect-tsgo/shim/ls/lsutil/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/ls/lsutil

go 1.26

require github.com/microsoft/typescript-go/shim/ls/lsutil v0.0.0
```

`_backport/ls/lsutil/shim.go` O3; mode `100644`, blob `534fef856aca20c765002ddfa038100a98683c31`, SHA256 `554c0100fbcc5813bfedb8d3e5f2bda09d9bc706e9f6488e38c799cb71428e98`.

Paired provider `native/effect-tsgo/shim/ls/lsutil/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`ls/lsutil/go.mod` O2; mode `100644`, blob `d6a12e0fa40b560466d1e4cd98269c7830e27c2f`, SHA256 `ffaeeeeb962b4a0466520c8f7b81500498203a20689166cb7c1f4b9418646146`.

```go
module github.com/microsoft/typescript-go/shim/ls/lsutil

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`ls/lsutil/shim.go` O2; mode `100644`, blob `efc066432caeea8afcfbaf52386af3ef6665e167`, SHA256 `d0514885593788eca95ba388e2a9321b5b2da97332a35101a14ba08c853e648b`.

Provider has 149 top-level declaration lines and 40 linkname declarations. Relevant package/import and API anchors:

```go
package lsutil
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/checker"
import "github.com/microsoft/typescript-go/internal/compiler"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/ls/lsutil"
import "github.com/microsoft/typescript-go/internal/lsp/lsproto"
import _ "unsafe"
func AssertHasRealPosition(node *ast.Node)
type CodeLensUserPreferences = lsutil.CodeLensUserPreferences
func CompareImportsOrRequireStatements(s1 *ast.Statement, s2 *ast.Statement, comparer func(a string, b string) int) int
func CompareModuleSpecifiers(m1 *ast.Expression, m2 *ast.Expression, comparer func(a string, b string) int) int
func DetectModuleSpecifierCaseBySort(importDeclsByGroup [][]*ast.Statement, comparersToTest []func(a string, b string) int) (comparer func(a string, b string) int, isSorted bool)
```

## Family `lsp`

`_backport/lsp/go.mod` O3; mode `100644`, blob `95c66c8846a13f3ae3c0439519e1f205df56c2ae`, SHA256 `0a050edd0743cccbb35160ff675e616786add5981a368b2ae45081c424b087b6`.

Paired provider `native/effect-tsgo/shim/lsp/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/lsp

go 1.26

require github.com/microsoft/typescript-go/shim/lsp v0.0.0
```

`_backport/lsp/shim.go` O3; mode `100644`, blob `3cb9efcdf15874024ab966e56f8a99df96ef8c66`, SHA256 `e7b69c427f953f04570bb9a26931642fb362e2149b7f4e43e64804d311fe88e1`.

Paired provider `native/effect-tsgo/shim/lsp/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`lsp/go.mod` O2; mode `100644`, blob `e9a3f219cbc5780303b3911e3a5e02aed87fb904`, SHA256 `b20a54647c63ac79929bfcebadaa0fdf5c01e26f2e3164c3acfba6165e228213`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/lsp/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/lsp

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`lsp/shim.go` O2; mode `100644`, blob `39de7971d1530a9fd6219e73dabf42351926082d`, SHA256 `b64ff69b78c7b4626a36d17286fac5e96d5a4a313ccb5da21d13ebbb38469904`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/lsp/shim.go` is byte-identical and uses this provider interface.

Provider has 7 top-level declaration lines and 3 linkname declarations. Relevant package/import and API anchors:

```go
package lsp
import "github.com/microsoft/typescript-go/internal/lsp"
import "io"
import _ "unsafe"
func NewServer(opts *lsp.ServerOptions) *lsp.Server
type Reader = lsp.Reader
type Server = lsp.Server
type ServerOptions = lsp.ServerOptions
func ToReader(r io.Reader) lsp.Reader
```

## Family `lsp/lsproto`

`_backport/lsp/lsproto/go.mod` O3; mode `100644`, blob `696df1290fabcf8eed6aac21c27595c6bf74dc30`, SHA256 `82f4af94980121ec95d67c3258d832cefd0b5809e8cf6254e0f768672ae4f024`.

Paired provider `native/effect-tsgo/shim/lsp/lsproto/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/lsp/lsproto

go 1.26

require github.com/microsoft/typescript-go/shim/lsp/lsproto v0.0.0
```

`_backport/lsp/lsproto/shim.go` O3; mode `100644`, blob `ddf0f79a965d6b4a90cdd56e88e889cf10c95411`, SHA256 `ce04e11f3ca1fa46b13826eda4d8b45a6fe1ce67e7b0dfc69d8155d82540384a`.

Paired provider `native/effect-tsgo/shim/lsp/lsproto/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`lsp/lsproto/go.mod` O2; mode `100644`, blob `efa075e6d4d89df3226e8036495c2cdaf696964a`, SHA256 `0505bf7d1934d03ed5df1afdcc87940f069f555e930241096927c7ec2781676c`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/lsp/lsproto/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/lsp/lsproto

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`lsp/lsproto/shim.go` O2; mode `100644`, blob `e2ef322a9cfdbc232ea4cbe91d790fbc43a3071b`, SHA256 `f4735374faea6a222d24e3e1bf81b486e1967a3ed72089bde9c082a2fb2b705c`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/lsp/lsproto/shim.go` is byte-identical and uses this provider interface.

Provider has 1252 top-level declaration lines and 8 linkname declarations. Relevant package/import and API anchors:

```go
package lsproto
import "context"
import "github.com/microsoft/typescript-go/internal/jsonrpc"
import "github.com/microsoft/typescript-go/internal/lsp/lsproto"
import "io"
import _ "unsafe"
type AddAsTypeOnly = lsproto.AddAsTypeOnly
const AddAsTypeOnlyAllowed = lsproto.AddAsTypeOnlyAllowed
const AddAsTypeOnlyNotAllowed = lsproto.AddAsTypeOnlyNotAllowed
const AddAsTypeOnlyRequired = lsproto.AddAsTypeOnlyRequired
type AnnotatedTextEdit = lsproto.AnnotatedTextEdit
```
