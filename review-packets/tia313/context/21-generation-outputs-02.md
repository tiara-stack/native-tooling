# Generated module family connections

O1 is the marker, O2 the provider API/module facade, O3 its canonical backport, and O4 an explicit compatibility bridge. G1 emits these from G2/G3/G4 policy and G5 pinned compiler/config state. Provider facades feed the compiler and tsgolint; canonical backports feed the Effect service. See consumer packets30-34. All215 output identities are enumerated, including unchanged outputs.

## Family `core`

`_backport/core/go.mod` O3; mode `100644`, blob `1a862486ba4dff5db9a7b99a03f3369d0a44f6fe`, SHA256 `ee71bf422a46b3c681866b2fea91341314ea57afcdff847d137c6eb01e50b04e`.

Paired provider `native/effect-tsgo/shim/core/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/core

go 1.26

require github.com/microsoft/typescript-go/shim/core v0.0.0
```

`_backport/core/shim.go` O3; mode `100644`, blob `2013514ff4a937260e3ffe3b461dc9e0003dbffb`, SHA256 `ee48af37f6e88a1a26c3ec9469b749712b846ecf77ff0a9a8545fb0284576d85`.

Paired provider `native/effect-tsgo/shim/core/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`core/go.mod` O2; mode `100644`, blob `4df14b8fad380179851de2c42b2e11ec49f4b7ef`, SHA256 `c95a1927d2131fca22cd86720d99d301cbfc3a7f9ce64659cca5f1fa4910b680`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/core/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/core

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`core/shim.go` O2; mode `100644`, blob `c76aaa9da75924c496c7447f1284d4a97a917e90`, SHA256 `f876927a22c5965e2d3c5c016ec6df256398d8983312519fbe8b40dd524bf5e5`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/core/shim.go` is byte-identical and uses this provider interface.

Provider has 159 top-level declaration lines and 31 linkname declarations. Relevant package/import and API anchors:

```go
package core
import "context"
import "github.com/microsoft/typescript-go/internal/core"
import "iter"
import _ "unsafe"
func ApplyBulkEdits(text string, edits []core.TextChange) string
func ApplyDebugStackLimit()
type Arena[T any] = core.Arena[T]
func BoolToTristate(b bool) core.Tristate
type BreadthFirstSearchLevel[K comparable, N any] = core.BreadthFirstSearchLevel[K,N]
```

## Family `diagnostics`

`_backport/diagnostics/go.mod` O3; mode `100644`, blob `0e7a83e24cd8c58ab9fd3f1d10cabdc5e6dae802`, SHA256 `d1f178753d61a2bfefd72ca5496dd4a170e6a0d92d450bc4212ff455b39d39d1`.

Paired provider `native/effect-tsgo/shim/diagnostics/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/diagnostics

go 1.26

require github.com/microsoft/typescript-go/shim/diagnostics v0.0.0
```

`_backport/diagnostics/shim.go` O3; mode `100644`, blob `0f471f8595c336ff9c2214d64ffc22063593a5c9`, SHA256 `bb896dd445c973862ea6632f21431c13e0aef6bb0bca91e68d524baa13ba0601`.

Paired provider `native/effect-tsgo/shim/diagnostics/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`diagnostics/go.mod` O2; mode `100644`, blob `1d0667b0f4eeb44418ae3ccc0747ccba832ab958`, SHA256 `6cf73bce60af8e6ca6ee64dc03c630ff6dfc01f2cdf6d841d8febd46eda95ec2`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/diagnostics/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/diagnostics

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`diagnostics/shim.go` O2; mode `100644`, blob `f5012b37b7add4cfdfccab5257b35f5a08efcb5a`, SHA256 `5abaff94c17f4b26d17efb808b3bc5d17584f63ac424f3217a559e7dd61b7562`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/diagnostics/shim.go` is byte-identical and uses this provider interface.

Provider has 2298 top-level declaration lines and 4 linkname declarations. Relevant package/import and API anchors:

```go
package diagnostics
import "github.com/microsoft/typescript-go/internal/diagnostics"
import "github.com/microsoft/typescript-go/internal/locale"
import _ "unsafe"
var ALL_COMPILER_OPTIONS = diagnostics.ALL_COMPILER_OPTIONS
var A_0_modifier_cannot_be_used_with_an_import_declaration = diagnostics.A_0_modifier_cannot_be_used_with_an_import_declaration
var A_0_parameter_must_be_the_first_parameter = diagnostics.A_0_parameter_must_be_the_first_parameter
var A_JSDoc_template_tag_may_not_follow_a_typedef_callback_or_overload_tag = diagnostics.A_JSDoc_template_tag_may_not_follow_a_typedef_callback_or_overload_tag
var A_JSDoc_type_tag_on_a_function_must_have_a_signature_with_the_correct_number_of_arguments = diagnostics.A_JSDoc_type_tag_on_a_function_must_have_a_signature_with_the_correct_number_of_arguments
```

## Family `evaluator`

`_backport/evaluator/go.mod` O3; mode `100644`, blob `3e48e135a5ddc4a6f4561da29eefdc39c8d96b35`, SHA256 `b373a32049347ea6b32059f04b0b75fd329bda38d4b415c25a1e029b444e068a`.

Paired provider `native/effect-tsgo/shim/evaluator/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/evaluator

go 1.26

require github.com/microsoft/typescript-go/shim/evaluator v0.0.0
```

`_backport/evaluator/shim.go` O3; mode `100644`, blob `fd120518e6df29f04bc03dd579a9d088170ce564`, SHA256 `faf3c4744c0b9a2338a26c503ccc24e820b591b1ebb05fb513920a397626608c`.

Paired provider `native/effect-tsgo/shim/evaluator/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`evaluator/go.mod` O2; mode `100644`, blob `4c2cc81804ca7b49c04d35cd110b1bd4d61c08c3`, SHA256 `99dd5ccc2e83384224701ead59bc9da925215b450bbf01c2aab2419602b8f132`.

```go
module github.com/microsoft/typescript-go/shim/evaluator

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`evaluator/shim.go` O2; mode `100644`, blob `ab890f9f0bd8d162b697bea6d3eaa580dd84ec59`, SHA256 `9e323a560e37e332cf9b975a1ac0798cbd0853d38f827409aeabd4cbc64a59d9`.

Provider has 6 top-level declaration lines and 4 linkname declarations. Relevant package/import and API anchors:

```go
package evaluator
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/evaluator"
import _ "unsafe"
func AnyToString(v any) string
type Evaluator = evaluator.Evaluator
func IsTruthy(v any) bool
func NewEvaluator(evaluateEntity evaluator.Evaluator, outerExpressionsToSkip ast.OuterExpressionKinds) evaluator.Evaluator
func NewResult(value any, isSyntacticallyString bool, resolvedOtherFiles bool, hasExternalReferences bool) evaluator.Result
```

## Family `execute/tsc`

`_backport/execute/tsc/go.mod` O3; mode `100644`, blob `94dcc3f40555358cf81c57258b7b96f1c4b7d4e9`, SHA256 `0ca6391439cc5b7fbc58371d2d5038e4b6ab9ae683f01f356a7805be74c3df75`.

Paired provider `native/effect-tsgo/shim/execute/tsc/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/execute/tsc

go 1.26

require github.com/microsoft/typescript-go/shim/execute/tsc v0.0.0
```

`_backport/execute/tsc/shim.go` O3; mode `100644`, blob `d1fbf25d410b42f2c887f2faf1452194d5046625`, SHA256 `1a1daf1a634e02ce4c0259883e85d2f992dd6d233061ad0899d3ccd607dc6198`.

Paired provider `native/effect-tsgo/shim/execute/tsc/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`execute/tsc/go.mod` O2; mode `100644`, blob `74d59937f639484134330c555c5f718d3c674a14`, SHA256 `008583280ef3c2ea099bfa1da23bec550722a4faa525a10720d02bcfc2719f74`.

```go
module github.com/microsoft/typescript-go/shim/execute/tsc

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`execute/tsc/shim.go` O2; mode `100644`, blob `7c665f410e9dd0eff34dec2567e1766418b58b2c`, SHA256 `19573d1a25b8011ef139412ef8058c5383a3e1837bfcaefe4710a2b9f44c3ca8`.

Provider has 33 top-level declaration lines and 14 linkname declarations. Relevant package/import and API anchors:

```go
package tsc
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/collections"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/diagnostics"
import "github.com/microsoft/typescript-go/internal/execute/tsc"
import "github.com/microsoft/typescript-go/internal/locale"
import "github.com/microsoft/typescript-go/internal/tsoptions"
import "io"
import _ "unsafe"
type CommandLineResult = tsc.CommandLineResult
type CommandLineTesting = tsc.CommandLineTesting
type CompileAndEmitResult = tsc.CompileAndEmitResult
type CompileTimes = tsc.CompileTimes
func CreateBuilderStatusReporter(sys tsc.System, w io.Writer, locale locale.Locale, options *core.CompilerOptions, testing tsc.CommandLineTesting) tsc.DiagnosticReporter
```

## Family `format`

`_backport/format/go.mod` O3; mode `100644`, blob `76ab97760e45aff9484c44ca9b655095dbdab61d`, SHA256 `c11086819b24d759eb35ad93f7730b28013d7d08d59be5f6bfba751a1b1cb7ec`.

Paired provider `native/effect-tsgo/shim/format/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/format

go 1.26

require github.com/microsoft/typescript-go/shim/format v0.0.0
```

`_backport/format/shim.go` O3; mode `100644`, blob `442a59164173e901fd009448b7caeb5eaadd1fbe`, SHA256 `ad6efc1557ff24ac581f67556a8b30beac31caa04f2083d4838d419456a12902`.

Paired provider `native/effect-tsgo/shim/format/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`format/go.mod` O2; mode `100644`, blob `0c3ad170d1003c8678d536673d68e1981b830acb`, SHA256 `17ebc957e2c2d78f661be3d720b5ee58ba4b08052494f9cd0d69bb881436eb20`.

```go
module github.com/microsoft/typescript-go/shim/format

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`format/shim.go` O2; mode `100644`, blob `572b10c954409469088c8c5143ede46b352cfebb`, SHA256 `5deb9b2cfc953a03a922d46f2c2482fbd5777c0d94767cfd6559bc590a5f5bce`.

Provider has 40 top-level declaration lines and 20 linkname declarations. Relevant package/import and API anchors:

```go
package format
import "context"
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/format"
import "github.com/microsoft/typescript-go/internal/ls/lsutil"
import _ "unsafe"
func FindFirstNonWhitespaceColumn(startPos int, endPos int, sourceFile *ast.SourceFile, options lsutil.FormatCodeSettings) int
func FormatDocument(ctx context.Context, sourceFile *ast.SourceFile) []core.TextChange
func FormatNodeGivenIndentation(ctx context.Context, node *ast.Node, file *ast.SourceFile, languageVariant core.LanguageVariant, initialIndentation int, delta int) []core.TextChange
func FormatOnClosingCurly(ctx context.Context, sourceFile *ast.SourceFile, position int) []core.TextChange
func FormatOnEnter(ctx context.Context, sourceFile *ast.SourceFile, position int) []core.TextChange
```

## Family `fourslash`

`_backport/fourslash/go.mod` O3; mode `100644`, blob `5acb0aafe0bdae3383c367593fb03af312ed9971`, SHA256 `445e8c0c48b0663d80719f03aafd3aa00ebcf36d00bed1a0a83d6eb3ddcbe049`.

Paired provider `native/effect-tsgo/shim/fourslash/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/fourslash

go 1.26

require github.com/microsoft/typescript-go/shim/fourslash v0.0.0
```

`_backport/fourslash/shim.go` O3; mode `100644`, blob `c46fd937fc92f6c529084275befb9666fcbc23d0`, SHA256 `4a1f10ded807520c518c6a7cdeb43b90187f554f923452fbd46ff584e9dc4a28`.

Paired provider `native/effect-tsgo/shim/fourslash/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`fourslash/go.mod` O2; mode `100644`, blob `9a7a0b0be5828529ede6456cf2602074fe5fdb11`, SHA256 `7cb4e9f5c1654c1b016c86952ff9ed788463267c78b555f1912212f542111e16`.

```go
module github.com/microsoft/typescript-go/shim/fourslash

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`fourslash/shim.go` O2; mode `100644`, blob `ad4d6c3556d82b90f5117782305a1426aa3e2f0e`, SHA256 `eff15473f374b227a2cf2d77b1d1c2b9baac2202c1815b08fe597b51825850a5`.

Provider has 39 top-level declaration lines and 5 linkname declarations. Relevant package/import and API anchors:

```go
package fourslash
import "github.com/microsoft/typescript-go/internal/fourslash"
import "github.com/microsoft/typescript-go/internal/lsp/lsproto"
import "github.com/microsoft/typescript-go/internal/testutil/lsptestutil"
import "testing"
import "unsafe"
var AnyTextEdits = fourslash.AnyTextEdits
type AppliedQuickFixResult = fourslash.AppliedQuickFixResult
type AppliedRefactorResult = fourslash.AppliedRefactorResult
type ApplyCodeActionFromCompletionOptions = fourslash.ApplyCodeActionFromCompletionOptions
type CompletionsExpectedCodeAction = fourslash.CompletionsExpectedCodeAction
```

## Family `jsnum`

`_backport/jsnum/go.mod` O3; mode `100644`, blob `82c344b6eb586c698cf8a0f2a7c3db26c9f9b790`, SHA256 `b29494aa35a3fa6c5c21449581c47e204bd76aa3e9d8989da179caa5d86a7940`.

Paired provider `native/effect-tsgo/shim/jsnum/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/jsnum

go 1.26

require github.com/microsoft/typescript-go/shim/jsnum v0.0.0
```

`_backport/jsnum/shim.go` O3; mode `100644`, blob `1b9232c4d67a7bec35a5333a39abf62c110a8a63`, SHA256 `e2cec6669066dbbce9c16141c72c2dfed48f462b7128a124c0125a4f2480b6e1`.

Paired provider `native/effect-tsgo/shim/jsnum/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`jsnum/go.mod` O2; mode `100644`, blob `63d75f02f255b641174da995ea91101d3a9edb68`, SHA256 `05cd231b7299e64df80c8ca844818d1495bfbe01a11e633cc4c8b6c6de2eff01`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/jsnum/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/jsnum

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`jsnum/shim.go` O2; mode `100644`, blob `2cf1a26a589af4ce6d38c0ae6ca9a1bb3c16e469`, SHA256 `f9eded99cb73390bb86f2637b15a46413627653d63d35a89b76f8647a97419f2`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/jsnum/shim.go` is byte-identical and uses this provider interface.

Provider has 10 top-level declaration lines and 6 linkname declarations. Relevant package/import and API anchors:

```go
package jsnum
import "github.com/microsoft/typescript-go/internal/jsnum"
import _ "unsafe"
func FromString(s string) jsnum.Number
func Inf(sign int) jsnum.Number
const MaxSafeInteger = jsnum.MaxSafeInteger
const MinSafeInteger = jsnum.MinSafeInteger
func NaN() jsnum.Number
```

## Family `jsonrpc`

`_backport/jsonrpc/go.mod` O3; mode `100644`, blob `e23aaa5bb1e2afe0a1e40c565e9f6d12c1e9bb56`, SHA256 `782e8d55529fa2a3ec8a1a64f550f758bbfefd5ee0947fd09b3f32bfafb0dd4c`.

Paired provider `native/effect-tsgo/shim/jsonrpc/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/jsonrpc

go 1.26

require github.com/microsoft/typescript-go/shim/jsonrpc v0.0.0
```

`_backport/jsonrpc/shim.go` O3; mode `100644`, blob `1f74a1e2fa8229ca376bb0fe63a4d593b9158b40`, SHA256 `c0985323076cfb2040011776a6781907f206a5cac3e2a336d35d70cb895fdc92`.

Paired provider `native/effect-tsgo/shim/jsonrpc/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`jsonrpc/go.mod` O2; mode `100644`, blob `37a97dc2ac9a2f23a7f66f4244f8cbff4873ede4`, SHA256 `2f8654214c036a214e30055f99e76b16f67ad76c34471c47374ca2864b55dfc2`.

```go
module github.com/microsoft/typescript-go/shim/jsonrpc

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`jsonrpc/shim.go` O2; mode `100644`, blob `84d7aaf65c1622824ed7623b5f68581116c40c5b`, SHA256 `fae8812a4fd59b832634cac89f544eae6b04a57969f96392d018aeb69be0b4e5`.

Provider has 27 top-level declaration lines and 5 linkname declarations. Relevant package/import and API anchors:

```go
package jsonrpc
import "github.com/microsoft/typescript-go/internal/jsonrpc"
import "io"
import _ "unsafe"
const CodeInternalError = jsonrpc.CodeInternalError
const CodeInvalidParams = jsonrpc.CodeInvalidParams
const CodeInvalidRequest = jsonrpc.CodeInvalidRequest
const CodeMethodNotFound = jsonrpc.CodeMethodNotFound
const CodeParseError = jsonrpc.CodeParseError
```
