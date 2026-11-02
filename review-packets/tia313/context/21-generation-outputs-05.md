# Generated module family connections

O1 is the marker, O2 the provider API/module facade, O3 its canonical backport, and O4 an explicit compatibility bridge. G1 emits these from G2/G3/G4 policy and G5 pinned compiler/config state. Provider facades feed the compiler and tsgolint; canonical backports feed the Effect service. See consumer packets30-34. All215 output identities are enumerated, including unchanged outputs.

## Family `project/logging`

`_backport/project/logging/go.mod` O3; mode `100644`, blob `015516b2575f9f314a1f8905be716a07250a70fc`, SHA256 `fac41dcdabb3a545f470631df0de272003129ba040c465a093aa5896bf3ee181`.

Paired provider `native/effect-tsgo/shim/project/logging/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/project/logging

go 1.26

require github.com/microsoft/typescript-go/shim/project/logging v0.0.0
```

`_backport/project/logging/shim.go` O3; mode `100644`, blob `ecb8f64a0ae5d6f0fea9c3695910a27bd5a75668`, SHA256 `07b387d48d55de416a73bffbb7da57a2b76f51f00f433907bf42e916362aad63`.

Paired provider `native/effect-tsgo/shim/project/logging/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`project/logging/go.mod` O2; mode `100644`, blob `65638bfdef165efeb0ce9f63837af403bba0e684`, SHA256 `82916a426789fa5997ac47110fbff4e65be6eaad19a6104b6c34cc0110af4f83`.

```go
module github.com/microsoft/typescript-go/shim/project/logging

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`project/logging/shim.go` O2; mode `100644`, blob `227b6fb67425fd9c7705ffac885a46bb4c9cab9d`, SHA256 `56d9650ebeb7be90e45b02640c233a04c784f579f99fef04aefd20359f1139da`.

Provider has 7 top-level declaration lines and 4 linkname declarations. Relevant package/import and API anchors:

```go
package logging
import "github.com/microsoft/typescript-go/internal/project/logging"
import "io"
import _ "unsafe"
type LogCollector = logging.LogCollector
type LogTree = logging.LogTree
type Logger = logging.Logger
func NewLogTree(name string) *logging.LogTree
func NewLogger(output io.Writer) logging.Logger
```

## Family `repo`

`_backport/repo/go.mod` O3; mode `100644`, blob `3e3f30072b2c5c4917a0ef0abaa604a448ac8a9e`, SHA256 `91925c2e4a085c4a568aea2175e40d7fdf2563aaca48c90d9b1c752dc62cb065`.

Paired provider `native/effect-tsgo/shim/repo/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/repo

go 1.26

require github.com/microsoft/typescript-go/shim/repo v0.0.0
```

`_backport/repo/shim.go` O3; mode `100644`, blob `05f7abbe05320742fed7992f82b1adb2dbb0d0a9`, SHA256 `c7c285b0d4439910d09365213a66745f946d0caaceb069a125fb26574cffb979`.

Paired provider `native/effect-tsgo/shim/repo/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`repo/go.mod` O2; mode `100644`, blob `415b97672fbe53f681f04721ad5ff48d6ee200bf`, SHA256 `7de45bccce9cf6660d981ebd11a1282347fdbcfcfcef209ed87a84d3c0749419`.

```go
module github.com/microsoft/typescript-go/shim/repo

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`repo/shim.go` O2; mode `100644`, blob `33f8f5a392a4093d2c1a240c3f62436cf8ff11eb`, SHA256 `5e887a9e6043244978390a78659bc1f8c6947d03738fd4eafcd8aedd6f77974c`.

Provider has 6 top-level declaration lines and 5 linkname declarations. Relevant package/import and API anchors:

```go
package repo
import "github.com/microsoft/typescript-go/internal/repo"
import _ "unsafe"
func RootPath() string
func SkipIfNoTypeScriptSubmodule(t repo.SkippableTest)
type SkippableTest = repo.SkippableTest
func TestDataPath() string
func TypeScriptSubmoduleExists() bool
```

## Family `scanner`

`_backport/scanner/go.mod` O3; mode `100644`, blob `765b0af91a4d900bc3ae02660a6303b6a49a7141`, SHA256 `54dd4dc57a64fb554fd9e9ca5e1689dd5232b9f320be174b281b372cdb8ce4d4`.

Paired provider `native/effect-tsgo/shim/scanner/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/scanner

go 1.26

require github.com/microsoft/typescript-go/shim/scanner v0.0.0
```

`_backport/scanner/shim.go` O3; mode `100644`, blob `0f172f9a2e64029e2ec573cabfbb4159e8b63165`, SHA256 `e614542229a0ce0c3a9ab2ed325e2f152d873ace3e5980b76c30e022d7f12e43`.

Paired provider `native/effect-tsgo/shim/scanner/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`scanner/go.mod` O2; mode `100644`, blob `62c1c1b9db6f0d52cf4c7abed0d801e1881bc44c`, SHA256 `4a16223af148dc77d333cce0a53d630f5991fbdbc35f1a9b7e283c25276c157b`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/scanner/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/scanner

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`scanner/shim.go` O2; mode `100644`, blob `06e2c5e1b334ce7003b04ba994aa08b353d9451c`, SHA256 `35fddc669646a4a688b713e4b3c75b6f7def8cf1e4151221c9a3ac10396c0e1b`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/scanner/shim.go` is byte-identical and uses this provider interface.

Provider has 50 top-level declaration lines and 37 linkname declarations. Relevant package/import and API anchors:

```go
package scanner
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/scanner"
import "iter"
import _ "unsafe"
func ComputeLineOfPosition(lineStarts []core.TextPos, pos int) int
func ComputePositionOfLineAndByteOffset(lineStarts []core.TextPos, line int, byteOffset int) int
func ComputePositionOfLineAndUTF16Character(lineStarts []core.TextPos, line int, character core.UTF16Offset, text string, allowEdits bool) int
func DeclarationNameToString(name *ast.Node) string
type ErrorCallback = scanner.ErrorCallback
```

## Family `sourcemap`

`_backport/sourcemap/go.mod` O3; mode `100644`, blob `93197bdf390bd0fb972d5e57bc1934a8737d188b`, SHA256 `48371bde8b489a9935155d779ae42ebed91d3520978c20af718a8a302346830e`.

Paired provider `native/effect-tsgo/shim/sourcemap/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/sourcemap

go 1.26

require github.com/microsoft/typescript-go/shim/sourcemap v0.0.0
```

`_backport/sourcemap/shim.go` O3; mode `100644`, blob `08f23f774cb90f82e2b869c0547f98f1ea6bffd6`, SHA256 `45f157e64a1c31b44a7b245ba98a69c3b9c6512b3b826d3690ec51e8eb2f806d`.

Paired provider `native/effect-tsgo/shim/sourcemap/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`sourcemap/go.mod` O2; mode `100644`, blob `a338278d3adf933fc8f2dfdd2e3577bed2233070`, SHA256 `a7940754ad2c303b537e42c6f443d5a29f5e40824cccc33b3b2f022064b0faa4`.

```go
module github.com/microsoft/typescript-go/shim/sourcemap

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`sourcemap/shim.go` O2; mode `100644`, blob `36dd1cc5c9875558638efa2fcdfc9fd8d7361fa3`, SHA256 `bf92c3fd2b15423efb0648792d1e9535c259a72e72a0fd7aef4b0b2461c24602`.

Provider has 22 top-level declaration lines and 5 linkname declarations. Relevant package/import and API anchors:

```go
package sourcemap
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/sourcemap"
import "github.com/microsoft/typescript-go/internal/tspath"
import _ "unsafe"
func CreateECMALineInfo(text string, lineStarts core.ECMALineStarts) *sourcemap.ECMALineInfo
func DecodeMappings(mappings string) *sourcemap.MappingsDecoder
type DocumentPosition = sourcemap.DocumentPosition
type DocumentPositionMapper = sourcemap.DocumentPositionMapper
type ECMALineInfo = sourcemap.ECMALineInfo
```

## Family `testrunner`

`_backport/testrunner/go.mod` O3; mode `100644`, blob `0b3110f1b03be6528b062722cdc634117de94298`, SHA256 `5465f3f67ec45094dba612bde3fd8bd7adc57ad45d4630fb679e7e49a7b16516`.

Paired provider `native/effect-tsgo/shim/testrunner/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/testrunner

go 1.26

require github.com/microsoft/typescript-go/shim/testrunner v0.0.0
```

`_backport/testrunner/shim.go` O3; mode `100644`, blob `5052ce3a9340d6a9004cdeca2b76d2a98e314fed`, SHA256 `02ebf63e39df4971346edf81a1462ca52995aada48e0263cba6a07e5294e5935`.

Paired provider `native/effect-tsgo/shim/testrunner/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`testrunner/go.mod` O2; mode `100644`, blob `b0d634094b2421835f5183d31e34a00a36395527`, SHA256 `ca048d7f64aa1ffd5dbc68a10e97f3a9b5db506f302dd7bb08b9b55a4d07590f`.

```go
module github.com/microsoft/typescript-go/shim/testrunner

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`testrunner/shim.go` O2; mode `100644`, blob `83f6e9445a7d81b2c659b1fd254d4894a503e815`, SHA256 `b0ca2182d01dd59eb82aca3f577ae690499c9cd42200bdc7586b02a678c3a78c`.

Provider has 7 top-level declaration lines and 1 linkname declarations. Relevant package/import and API anchors:

```go
package testrunner
import "github.com/microsoft/typescript-go/internal/testrunner"
import _ "unsafe"
type CompilerBaselineRunner = testrunner.CompilerBaselineRunner
type CompilerTestType = testrunner.CompilerTestType
func NewCompilerBaselineRunner(testType testrunner.CompilerTestType, isSubmodule bool) *testrunner.CompilerBaselineRunner
type ParseTestFilesOptions = testrunner.ParseTestFilesOptions
type Runner = testrunner.Runner
```

## Family `testutil`

`_backport/testutil/go.mod` O3; mode `100644`, blob `521e114c73d44d76c529613c9f5ae6db2e07470c`, SHA256 `8ad6ad64bc5140c628009064a0138a81164ef6e2f449d1e74a7a9845cf5a9d50`.

Paired provider `native/effect-tsgo/shim/testutil/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/testutil

go 1.26

require github.com/microsoft/typescript-go/shim/testutil v0.0.0
```

`_backport/testutil/shim.go` O3; mode `100644`, blob `5483eb4307fdab775f98803eba81cfed8e3d9321`, SHA256 `1f3c8f6c65ca9c69e6b5eb064ae36fb2ea428a7b76240a6729cf14e601b1bdcd`.

Paired provider `native/effect-tsgo/shim/testutil/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`testutil/go.mod` O2; mode `100644`, blob `12852cb010707d2fdce78b196573ed09ddf54aa2`, SHA256 `88ac98eace5dd5ceee5e99098be6b12f1ae411bc16366a2f6ca0a8b732fab3f4`.

```go
module github.com/microsoft/typescript-go/shim/testutil

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`testutil/shim.go` O2; mode `100644`, blob `640264e3407d1934b89083fd8840fcbf7dbdcb4c`, SHA256 `efbe85ef53f690b91ec1481dd19347d72427b7c498a055aa663ff7cde83c4f14`.

Provider has 3 top-level declaration lines and 3 linkname declarations. Relevant package/import and API anchors:

```go
package testutil
import _ "github.com/microsoft/typescript-go/internal/testutil"
import "testing"
import _ "unsafe"
func AssertPanics(tb testing.TB, fn func(), expected any, msgAndArgs ...any)
func RecoverAndFail(t *testing.T, msg string)
func TestProgramIsSingleThreaded() bool
```

## Family `testutil/baseline`

`_backport/testutil/baseline/go.mod` O3; mode `100644`, blob `d039fc1700b1bb5a40514f65a1716609f134b2fb`, SHA256 `b9a799c669f21acc3930f2fbd0bb9b0770aa47409fd78454b461ce7b7e85552b`.

Paired provider `native/effect-tsgo/shim/testutil/baseline/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/testutil/baseline

go 1.26

require github.com/microsoft/typescript-go/shim/testutil/baseline v0.0.0
```

`_backport/testutil/baseline/shim.go` O3; mode `100644`, blob `821e2da37af30c0997d244ea06faf3d56295e0bb`, SHA256 `f968e55ccf80ff1cfe0d151ee98989a2b99b3d2edad785bd4a559b5cf1d04f2a`.

Paired provider `native/effect-tsgo/shim/testutil/baseline/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`testutil/baseline/go.mod` O2; mode `100644`, blob `aef1d97bf439b5765c760668d6e039d5606a39c6`, SHA256 `ef3eff163310ca405f574ee5c5be4f897785ebbc26f41cabb0630f0b7bbee925`.

```go
module github.com/microsoft/typescript-go/shim/testutil/baseline

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`testutil/baseline/shim.go` O2; mode `100644`, blob `36e14d52d90d2a246634ebdd8e2c412e7fee5f95`, SHA256 `f930ad0a7886ad0eadd3af9989dd3697dcf9e51e0350a7ce041347898120fb1f`.

Provider has 6 top-level declaration lines and 4 linkname declarations. Relevant package/import and API anchors:

```go
package baseline
import "github.com/microsoft/typescript-go/internal/testutil/baseline"
import "testing"
import _ "unsafe"
func DiffText(oldName string, newName string, expected string, actual string) string
const NoContent = baseline.NoContent
type Options = baseline.Options
func Run(t *testing.T, fileName string, actual string, opts baseline.Options)
func RunAgainstSubmodule(t *testing.T, fileName string, actual string, opts baseline.Options)
```

## Family `testutil/harnessutil`

`_backport/testutil/harnessutil/go.mod` O3; mode `100644`, blob `11a694f4c81396ea70dab95d89ac5b736c45bf7a`, SHA256 `603612e47eb4029cc8516cbdd300433ba6b825b41f7fbca249263fe081d1406b`.

Paired provider `native/effect-tsgo/shim/testutil/harnessutil/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/testutil/harnessutil

go 1.26

require github.com/microsoft/typescript-go/shim/testutil/harnessutil v0.0.0
```

`_backport/testutil/harnessutil/shim.go` O3; mode `100644`, blob `c21b3e9c12340902167a5ea33abb8d185fcb82b9`, SHA256 `c7199d17cadddbbd752eb86095d41d9e494db20975c095a9cbadf369c39ef5f2`.

Paired provider `native/effect-tsgo/shim/testutil/harnessutil/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`testutil/harnessutil/go.mod` O2; mode `100644`, blob `9e864497c49886189d367b7d2c9bfe949a01fe39`, SHA256 `f38162bac968144d2eb976df3217ad7162f33ad00faa1d92ad44ae8d67dfed6b`.

```go
module github.com/microsoft/typescript-go/shim/testutil/harnessutil

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`testutil/harnessutil/shim.go` O2; mode `100644`, blob `affe5217ab591fc7627f457e53ad36fbf0ea3d2a`, SHA256 `1dc924e3644d02457f5a007f167e73d27493e66a6657ff6636f4936fe83bb100`.

Provider has 20 top-level declaration lines and 10 linkname declarations. Relevant package/import and API anchors:

```go
package harnessutil
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/testutil/harnessutil"
import "github.com/microsoft/typescript-go/internal/tsoptions"
import "github.com/microsoft/typescript-go/internal/tspath"
import "github.com/microsoft/typescript-go/internal/vfs"
import "regexp"
import "strings"
import "testing"
import _ "unsafe"
type CompilationOutput = harnessutil.CompilationOutput
type CompilationResult = harnessutil.CompilationResult
func CompileFiles(t *testing.T, inputFiles []*harnessutil.TestFile, otherFiles []*harnessutil.TestFile, testConfig harnessutil.TestConfiguration, tsconfig *tsoptions.ParsedCommandLine, currentDirectory string, symlinks map[string]string) *harnessutil.CompilationResult
func CompileFilesEx(t *testing.T, inputFiles []*harnessutil.TestFile, otherFiles []*harnessutil.TestFile, harnessOptions *harnessutil.HarnessOptions, compilerOptions *core.CompilerOptions, currentDirectory string, symlinks map[string]string, tsconfig *tsoptions.ParsedCommandLine) *harnessutil.CompilationResult
func EnumerateFiles(folder string, testRegex *regexp.Regexp, recursive bool) ([]string, error)
func GetSourceFileCacheKey(opts ast.SourceFileParseOptions, text string, scriptKind core.ScriptKind) harnessutil.SourceFileCacheKey
```
