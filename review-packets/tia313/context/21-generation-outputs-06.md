# Generated module family connections

O1 is the marker, O2 the provider API/module facade, O3 its canonical backport, and O4 an explicit compatibility bridge. G1 emits these from G2/G3/G4 policy and G5 pinned compiler/config state. Provider facades feed the compiler and tsgolint; canonical backports feed the Effect service. See consumer packets30-34. All215 output identities are enumerated, including unchanged outputs.

## Family `testutil/lsptestutil`

`_backport/testutil/lsptestutil/go.mod` O3; mode `100644`, blob `934b663a00597f175e351feafe0c03a4053b623c`, SHA256 `0f218b8d53b5537bd6c7ee8c2d009747c3cfe5ca09de5d79df1b4c21d8d4c042`.

Paired provider `native/effect-tsgo/shim/testutil/lsptestutil/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/testutil/lsptestutil

go 1.26

require github.com/microsoft/typescript-go/shim/testutil/lsptestutil v0.0.0
```

`_backport/testutil/lsptestutil/shim.go` O3; mode `100644`, blob `db9133e0941100fdb416b2103848936c3d231cbf`, SHA256 `6db4716e9822e650e501ac54b3120b3bf20939297ca6b2d4354daa7d3b379d42`.

Paired provider `native/effect-tsgo/shim/testutil/lsptestutil/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`testutil/lsptestutil/go.mod` O2; mode `100644`, blob `6c5ec9ed9db19a7d26fc8fb3ecfe6610c81288c0`, SHA256 `148fac6a00e40c8024eba3ffb51a0c18044e40abfbb308a26355631dc3a5a17e`.

```go
module github.com/microsoft/typescript-go/shim/testutil/lsptestutil

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`testutil/lsptestutil/shim.go` O2; mode `100644`, blob `472022c2e172b92485c4b1076e2844efdbe21c04`, SHA256 `5b36d2379d41349a963d2398e5fe9817fe95f7514121570486846f9e7a5d3c2f`.

Provider has 4 top-level declaration lines and 1 linkname declarations. Relevant package/import and API anchors:

```go
package lsptestutil
import "github.com/microsoft/typescript-go/internal/lsp"
import "github.com/microsoft/typescript-go/internal/testutil/lsptestutil"
import "testing"
import _ "unsafe"
type LSPClient = lsptestutil.LSPClient
func NewLSPClient(t *testing.T, serverOpts lsp.ServerOptions, onServerRequest lsptestutil.ServerRequestHandler) (*lsptestutil.LSPClient, func() error)
type ServerNotificationHandler = lsptestutil.ServerNotificationHandler
type ServerRequestHandler = lsptestutil.ServerRequestHandler
```

## Family `testutil/tsbaseline`

`_backport/testutil/tsbaseline/go.mod` O3; mode `100644`, blob `f48337594ef173f92e4c36e559ac2e29cf47812b`, SHA256 `a603d398179a68168f524eb8240943a3095668f4defd84757a9a8179f30ad789`.

Paired provider `native/effect-tsgo/shim/testutil/tsbaseline/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/testutil/tsbaseline

go 1.26

require github.com/microsoft/typescript-go/shim/testutil/tsbaseline v0.0.0
```

`_backport/testutil/tsbaseline/shim.go` O3; mode `100644`, blob `19111e3775571079bd03714133381e6f4499ec43`, SHA256 `400d3bb167da0b19c61958c75b0651f14c74e9df8da12117d98e2ff61555057d`.

Paired provider `native/effect-tsgo/shim/testutil/tsbaseline/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`testutil/tsbaseline/go.mod` O2; mode `100644`, blob `6ee005e1897041951338bf284ea86db65b93c5d2`, SHA256 `275c57e86f5909bfa60810b2f41ea9181c7dc1891642bed5abcf343e9410b219`.

```go
module github.com/microsoft/typescript-go/shim/testutil/tsbaseline

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`testutil/tsbaseline/shim.go` O2; mode `100644`, blob `341440bb7d812b4b4584a88f3c7e0077d26acdd1`, SHA256 `6cac4d134613e8c5f93dc093ef95d45f50d2a5a0c9cf0dad9ade2403cceef14a`.

Provider has 6 top-level declaration lines and 6 linkname declarations. Relevant package/import and API anchors:

```go
package tsbaseline
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/compiler"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/testutil/baseline"
import "github.com/microsoft/typescript-go/internal/testutil/harnessutil"
import _ "github.com/microsoft/typescript-go/internal/testutil/tsbaseline"
import "testing"
import _ "unsafe"
func DoErrorBaseline(t *testing.T, baselinePath string, inputFiles []*harnessutil.TestFile, errors []*ast.Diagnostic, pretty bool, opts baseline.Options)
func DoJSEmitBaseline(t *testing.T, baselinePath string, header string, options *core.CompilerOptions, result *harnessutil.CompilationResult, tsConfigFiles []*harnessutil.TestFile, toBeCompiled []*harnessutil.TestFile, otherFiles []*harnessutil.TestFile, harnessSettings *harnessutil.HarnessOptions, opts baseline.Options)
func DoModuleResolutionBaseline(t *testing.T, baselinePath string, trace string, opts baseline.Options)
func DoSourcemapBaseline(t *testing.T, baselinePath string, header string, options *core.CompilerOptions, result *harnessutil.CompilationResult, harnessSettings *harnessutil.HarnessOptions, opts baseline.Options)
func DoSourcemapRecordBaseline(t *testing.T, baselinePath string, header string, options *core.CompilerOptions, result *harnessutil.CompilationResult, harnessSettings *harnessutil.HarnessOptions, opts baseline.Options)
```

## Family `tracing`

`_backport/tracing/go.mod` O3; mode `100644`, blob `3e30b5e59464c04fb3b09b021ca5c61e7b4be099`, SHA256 `e915226fec0ee92cab57a7dfeb47829ae89326b121836128548551a1eea1d039`.

Paired provider `native/effect-tsgo/shim/tracing/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/tracing

go 1.26

require github.com/microsoft/typescript-go/shim/tracing v0.0.0
```

`_backport/tracing/shim.go` O3; mode `100644`, blob `cb9d6c52aad0d8b9d02beade909b0e08f54fc3f8`, SHA256 `e9753513d0334421a2956a27b55c579a9d0ba6575b5631522243cefd026a608a`.

Paired provider `native/effect-tsgo/shim/tracing/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`tracing/go.mod` O2; mode `100644`, blob `43220394538cc9237c6bb345b63e3ca94121bf63`, SHA256 `c226b69f7f82e2e0fca2a4b55a260d5a7ca73e36790901225f36f0863cb329e2`.

```go
module github.com/microsoft/typescript-go/shim/tracing

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`tracing/shim.go` O2; mode `100644`, blob `73de3829cada9b3ca4b0c100e5f9835a9f097487`, SHA256 `b51294263073fd4aeff4c080a1f903856a37d16b7f25e66cd28322bdfe9ecc01`.

Provider has 16 top-level declaration lines and 1 linkname declarations. Relevant package/import and API anchors:

```go
package tracing
import "github.com/microsoft/typescript-go/internal/tracing"
import "github.com/microsoft/typescript-go/internal/vfs"
import _ "unsafe"
type LineAndChar = tracing.LineAndChar
type Location = tracing.Location
type Phase = tracing.Phase
const PhaseBind = tracing.PhaseBind
const PhaseCheck = tracing.PhaseCheck
```

## Family `tsoptions`

`_backport/tsoptions/compatibility.go` O3; mode `100644`, blob `b9eca34eab2c63f39b8aa9e52bdee5cf66bd3aa3`, SHA256 `fdbc5c6a8a928d913c8ef592bdc550aeb8c5318843f0f593f8d950554db8e45c`.

Paired provider `native/effect-tsgo/shim/tsoptions/compatibility.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`_backport/tsoptions/foreach.go` O3; mode `100644`, blob `39f15e6af0a11e16c5d0b3281ae644e168ea6eae`, SHA256 `f3e2268809a04a37b294033d9c6ac3cdde8f8449f17deb91d39d79d80ef39030`.

Paired provider `native/effect-tsgo/shim/tsoptions/foreach.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`_backport/tsoptions/go.mod` O3; mode `100644`, blob `4950c022db90534bbf48e1fe2065af2c5db74776`, SHA256 `619620d7b761f8a4059d5715da01b1a0a02fa577566793939ba891143b585295`.

Paired provider `native/effect-tsgo/shim/tsoptions/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/tsoptions

go 1.26

require github.com/microsoft/typescript-go/shim/tsoptions v0.0.0
```

`_backport/tsoptions/shim.go` O3; mode `100644`, blob `e3beb3599d28764598f5fafc24a1421e804bd9f6`, SHA256 `15a762a52f5ed76c08d086d07c926dfd07020f4367f6c8e0fef4ba057abff295`.

Paired provider `native/effect-tsgo/shim/tsoptions/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`tsoptions/compatibility.go` O4; mode `100644`, blob `c575a7dee68f56f3c7087af561886da03de898be`, SHA256 `df288e1c80a1bb6c2cada888bf54dff39b92965001ae6600254ba6c81ee6a418`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/tsoptions/compatibility.go` is byte-identical and uses this provider interface.

```go
package tsoptions

import (
	"github.com/microsoft/typescript-go/internal/collections"
	"github.com/microsoft/typescript-go/internal/core"
	"github.com/microsoft/typescript-go/internal/tsoptions"
	"github.com/microsoft/typescript-go/internal/tspath"
)

func ParseJsonConfigFileContent(
	json any,
	host tsoptions.ParseConfigHost,
	basePath string,
	existingOptions *core.CompilerOptions,
	configFileName string,
	resolutionStack []tspath.Path,
	extraFileExtensions any,
	extendedConfigCache tsoptions.ExtendedConfigCache,
) *tsoptions.ParsedCommandLine {
	var extensions []tsoptions.FileExtensionInfo
	if extraFileExtensions != nil {
		extensions = extraFileExtensions.([]tsoptions.FileExtensionInfo)
	}
	return tsoptions.ParseJsonConfigFileContent(
		json,
		host,
		basePath,
		existingOptions,
		configFileName,
		resolutionStack,
		extensions,
		extendedConfigCache,
	)
}

func ParseJsonSourceFileConfigFileContent(
	sourceFile *tsoptions.TsConfigSourceFile,
	host tsoptions.ParseConfigHost,
	basePath string,
	existingOptions *core.CompilerOptions,
	existingOptionsRaw *collections.OrderedMap[string, any],
	configFileName string,
	resolutionStack []tspath.Path,
	extraFileExtensions any,
	extendedConfigCache tsoptions.ExtendedConfigCache,
) *tsoptions.ParsedCommandLine {
	var extensions []tsoptions.FileExtensionInfo
	if extraFileExtensions != nil {
		extensions = extraFileExtensions.([]tsoptions.FileExtensionInfo)
	}
	return tsoptions.ParseJsonSourceFileConfigFileContent(
		sourceFile,
		host,
		basePath,
		existingOptions,
		existingOptionsRaw,
		configFileName,
		resolutionStack,
		extensions,
		extendedConfigCache,
	)
}
```

`tsoptions/foreach.go` O4; mode `100644`, blob `41dec6802e831c0f1dc094db6b938fb8ce5e9dce`, SHA256 `fda72ce38e9f23781cd79e6bcb5428ca6d2433c1da777e734aaff7dc2185dc23`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/tsoptions/foreach.go` is byte-identical and uses this provider interface.

```go
package tsoptions

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/tsoptions"
)

// ForEachTsConfigPropArray forwards through a regular call because go:linkname
// does not support generic functions.
func ForEachTsConfigPropArray[T any](sourceFile *ast.SourceFile, propKey string, callback func(*ast.PropertyAssignment) *T) *T {
	return tsoptions.ForEachTsConfigPropArray(sourceFile, propKey, callback)
}
```

`tsoptions/go.mod` O2; mode `100644`, blob `fb3c5b43283eaead07ef4db2d72f1ff1b9e128b7`, SHA256 `351abf6a12463785f1cda0dddae0434e5b7d45249c1d27543ada9b819278d7e9`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/tsoptions/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/tsoptions

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`tsoptions/shim.go` O2; mode `100644`, blob `d821ff503ae50ff71b3e14c70f0c9d070af7700e`, SHA256 `c4d2e32f44f9293a1cc399c367a9356ae74a3931703966ba9feffbb28dc553b8`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/tsoptions/shim.go` is byte-identical and uses this provider interface.

Provider has 74 top-level declaration lines and 35 linkname declarations. Relevant package/import and API anchors:

```go
package tsoptions
import "github.com/microsoft/typescript-go/internal/ast"
import "github.com/microsoft/typescript-go/internal/collections"
import "github.com/microsoft/typescript-go/internal/core"
import "github.com/microsoft/typescript-go/internal/diagnostics"
import "github.com/microsoft/typescript-go/internal/tsoptions"
import "github.com/microsoft/typescript-go/internal/tspath"
import "reflect"
import _ "unsafe"
type AlternateModeDiagnostics = tsoptions.AlternateModeDiagnostics
var BuildNameMap = tsoptions.BuildNameMap
var BuildOpts = tsoptions.BuildOpts
var CommandLineCompilerOptionsMap = tsoptions.CommandLineCompilerOptionsMap
type CommandLineOption = tsoptions.CommandLineOption
func GetParsedCommandLineOfConfigFile(configFileName string, options *core.CompilerOptions, optionsRaw *collections.OrderedMap[string, any], sys tsoptions.ParseConfigHost, extendedConfigCache tsoptions.ExtendedConfigCache) (*tsoptions.ParsedCommandLine, []*ast.Diagnostic)
```

## Family `tspath`

`_backport/tspath/go.mod` O3; mode `100644`, blob `78c8dbb519da3a60286bd4220178811ba7f7dd83`, SHA256 `be9413365c0449ab21628702881e1390583810052257526145369c6100e22a8a`.

Paired provider `native/effect-tsgo/shim/tspath/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/tspath

go 1.26

require github.com/microsoft/typescript-go/shim/tspath v0.0.0
```

`_backport/tspath/shim.go` O3; mode `100644`, blob `ea2af2669fc7ecebd5a2239569a1d3f35b23819b`, SHA256 `051969696a76fcbcdbb51f95c48942fd7e0ed6ba7335d6baf0ee2f3986533ead`.

Paired provider `native/effect-tsgo/shim/tspath/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`tspath/go.mod` O2; mode `100644`, blob `b90fba71c619b7fb6fd34d54cf1c2a8b0f0e178c`, SHA256 `bd8c8643e714104768958251c416e74b8f0f4baaeb380f1bc75a5b06842edf7e`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/tspath/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/tspath

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`tspath/shim.go` O2; mode `100644`, blob `486e219d14b61da7b6c5228ed4c1d4717fe954fb`, SHA256 `4395adf44961bcf139581ef3277ba0a0b2ce9b8a6060a2cf5c00d2380e88ebc2`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/tspath/shim.go` is byte-identical and uses this provider interface.

Provider has 92 top-level declaration lines and 65 linkname declarations. Relevant package/import and API anchors:

```go
package tspath
import "github.com/microsoft/typescript-go/internal/tspath"
import _ "unsafe"
var AllSupportedExtensions = tspath.AllSupportedExtensions
var AllSupportedExtensionsWithJson = tspath.AllSupportedExtensionsWithJson
func ChangeAnyExtension(path string, ext string, extensions []string, ignoreCase bool) string
func ChangeExtension(path string, newExtension string) string
func ChangeFullExtension(path string, newExtension string) string
```

## Family `vfs`

`_backport/vfs/go.mod` O3; mode `100644`, blob `34f9034f5789e0a68286df434896868de8b4d454`, SHA256 `7fbaeb7c76b25311e730e13c11e02297fd0e77a5e3a2ddc7819b986749000629`.

Paired provider `native/effect-tsgo/shim/vfs/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/vfs

go 1.26

require github.com/microsoft/typescript-go/shim/vfs v0.0.0
```

`_backport/vfs/shim.go` O3; mode `100644`, blob `8691d857af36b4b5fc36db32a1484e2243902fa2`, SHA256 `9e8637bf0b6546999cd77baca69f80fce2e60bb0cdb7a98fb3b809666005c2db`.

Paired provider `native/effect-tsgo/shim/vfs/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`_backport/vfs/vfsmatch/shim.go` O3; mode `100644`, blob `4fae1eb644b853e99f22beffe591634c9a15e0a6`, SHA256 `c999abb941c81e6b0c7b4814f8b1e10c6a2da9631cce9fd70a79360675788559`.

Paired provider `native/effect-tsgo/shim/vfs/vfsmatch/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`vfs/go.mod` O2; mode `100644`, blob `349d3e5e1d15198c39d57cead60f91b53b74704f`, SHA256 `c6d6a3c0ee749af8f178149bb513157587858da2369425b2a4df46bbf6d184e4`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/vfs/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/vfs

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`vfs/shim.go` O2; mode `100644`, blob `4e6675481f9c98db4014a078c095a177a0b328ed`, SHA256 `fbe2b9046690073e26a31d68ffbb21953766b2bfa629899401f44fcc429b3c6a`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/vfs/shim.go` is byte-identical and uses this provider interface.

Provider has 12 top-level declaration lines and 0 linkname declarations. Relevant package/import and API anchors:

```go
package vfs
import "github.com/microsoft/typescript-go/internal/vfs"
type DirEntry = vfs.DirEntry
type Entries = vfs.Entries
var ErrClosed = vfs.ErrClosed
var ErrExist = vfs.ErrExist
var ErrInvalid = vfs.ErrInvalid
```

`vfs/vfsmatch/shim.go` O2; mode `100644`, blob `4f3091f4769054d370d49bd70f100d3169c6e2cd`, SHA256 `8ed1e6d95a77cca76d73a169a901019be7bfa02572b5b99d6e8a68d9f3bb6467`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/vfs/vfsmatch/shim.go` is byte-identical and uses this provider interface.

Provider has 9 top-level declaration lines and 3 linkname declarations. Relevant package/import and API anchors:

```go
package vfsmatch
import "github.com/microsoft/typescript-go/internal/vfs"
import "github.com/microsoft/typescript-go/internal/vfs/vfsmatch"
import _ "unsafe"
func IsImplicitGlob(lastPathComponent string) bool
func NewSpecMatcher(specs []string, basePath string, usage vfsmatch.Usage, useCaseSensitiveFileNames bool) *vfsmatch.SpecMatcher
func ReadDirectory(host vfs.FS, currentDir string, path string, extensions []string, excludes []string, includes []string, depth int) []string
type SpecMatcher = vfsmatch.SpecMatcher
const UnlimitedDepth = vfsmatch.UnlimitedDepth
```

## Family `vfs/cachedvfs`

`_backport/vfs/cachedvfs/go.mod` O3; mode `100644`, blob `fb9db901992fa08453c73968696413c133881344`, SHA256 `281295fdc8be4374043adca3b34f256e25d3d07b1d88e6eedd9ed5cd6abab207`.

Paired provider `native/effect-tsgo/shim/vfs/cachedvfs/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/vfs/cachedvfs

go 1.26

require github.com/microsoft/typescript-go/shim/vfs/cachedvfs v0.0.0
```

`_backport/vfs/cachedvfs/shim.go` O3; mode `100644`, blob `5a15c8ffa6418ac9eb07542ebf3d566e4b193522`, SHA256 `d0e464e97e3d476424a5ead7cca42308c4e4c75f7385dded09690486f18b2769`.

Paired provider `native/effect-tsgo/shim/vfs/cachedvfs/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`vfs/cachedvfs/go.mod` O2; mode `100644`, blob `6fad20bb26b1740dc1c75172830dd7f94038c3c8`, SHA256 `0a38e2c681d555c7760f80f3cea196399afdbf95c0041ea4ac6fd5e408d03686`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/vfs/cachedvfs/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/vfs/cachedvfs

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`vfs/cachedvfs/shim.go` O2; mode `100644`, blob `60a9cbde62a05d25ae6ad164e4b598a56d1b987f`, SHA256 `3f67d47cd70809e8e844ad0207d5b8ce59c1ad7a1327a46a780c9a267dd67df2`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/vfs/cachedvfs/shim.go` is byte-identical and uses this provider interface.

Provider has 2 top-level declaration lines and 1 linkname declarations. Relevant package/import and API anchors:

```go
package cachedvfs
import "github.com/microsoft/typescript-go/internal/vfs"
import "github.com/microsoft/typescript-go/internal/vfs/cachedvfs"
import _ "unsafe"
type FS = cachedvfs.FS
func From(fs vfs.FS) *cachedvfs.FS
```

## Family `vfs/iovfs`

`_backport/vfs/iovfs/go.mod` O3; mode `100644`, blob `988f7d88fd575c63e3b3493418b14997a24f0d3d`, SHA256 `917d451be8151f0614bfc2a131f3459227641e7562772596bd7c11387abac24e`.

Paired provider `native/effect-tsgo/shim/vfs/iovfs/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/vfs/iovfs

go 1.26

require github.com/microsoft/typescript-go/shim/vfs/iovfs v0.0.0
```

`_backport/vfs/iovfs/shim.go` O3; mode `100644`, blob `a9e8e21021784fb87214d2f9fc4772ea61b28350`, SHA256 `d0e6f12156955e1065bf8cbda44300a43c9522e5de18a3facc0ad33a45ef38b5`.

Paired provider `native/effect-tsgo/shim/vfs/iovfs/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`vfs/iovfs/go.mod` O2; mode `100644`, blob `b7773a5b7b57ba0cb7c06830b811a841095a51f6`, SHA256 `15f77386e99c3197b8c1d351f0afd9d394d6523b5f02385ee265fa0dfb672bf8`.

```go
module github.com/microsoft/typescript-go/shim/vfs/iovfs

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`vfs/iovfs/shim.go` O2; mode `100644`, blob `e80acec0be22d1841782bc347cd106699efe6cb4`, SHA256 `9c61c049420653246d2a6c2af9c0ef56a3ca5377153c692d1793a2e7d5865792`.

Provider has 4 top-level declaration lines and 1 linkname declarations. Relevant package/import and API anchors:

```go
package iovfs
import "github.com/microsoft/typescript-go/internal/vfs/iovfs"
import "io/fs"
import _ "unsafe"
func From(fsys fs.FS, useCaseSensitiveFileNames bool) iovfs.FsWithSys
type FsWithSys = iovfs.FsWithSys
type RealpathFS = iovfs.RealpathFS
type WritableFS = iovfs.WritableFS
```
