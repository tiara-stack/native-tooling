# Generator input group G3

These current bytes or named source slices feed the producer. Assess the generation relationship with output crosswalks and all five consumer packets.

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/checker/compatibility.go`

Mode `100644`, blob `c9ba37f00645f1a18c1fca07f855fb22c442a547`, SHA256 `c3e043be60a50fd3229d4c7b3aa584365ea22cd2e2f9acdf13d4dbea7e1c9533`, 322 bytes.

```text
package checker

import "github.com/microsoft/typescript-go/internal/checker"

// GetNonDistributedTypeParameter is an identity operation for compiler
// versions that do not model distributed type parameters separately.
func GetNonDistributedTypeParameter(_ *checker.Checker, t *checker.Type) *checker.Type {
	return t
}
```

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/compiler/compatibility.go`

Mode `100644`, blob `9a52c562f1a2480aa472547cb82c6b524ca28b2a`, SHA256 `b158c6df670d51535c11ff4887ac9c2cb7c280d4b05ea586f046a2dac4bdda10`, 576 bytes.

```text
package compiler

import (
	"github.com/microsoft/typescript-go/internal/compiler"
	"github.com/microsoft/typescript-go/internal/diagnostics"
	"github.com/microsoft/typescript-go/internal/tsoptions"
	"github.com/microsoft/typescript-go/internal/vfs"
)

func NewCompilerHost(
	currentDirectory string,
	fs vfs.FS,
	defaultLibraryPath string,
	extendedConfigCache tsoptions.ExtendedConfigCache,
	trace func(msg *diagnostics.Message, args ...any),
) compiler.CompilerHost {
	return compiler.NewCompilerHost(currentDirectory, fs, defaultLibraryPath, extendedConfigCache, trace)
}
```

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/compiler/extra-shim.json`

Mode `100644`, blob `27b41f956264a9c981560db8bfd40f4e4ab56719`, SHA256 `bb4c96450330adb5b2ec1b27550ef813a4a6b5220a5c7753f88058b9f824ffb0`, 45 bytes.

```text
{
  "IgnoreFunctions": ["NewCompilerHost"]
}
```

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/ls/change/compatibility.go`

Mode `100644`, blob `e1edfa68519ffb3aec4f0eb6a679583cf6874913`, SHA256 `ab80bc1add1b115ab1054af7c1b4d710e2b791d9f9d2650bf71fae5b510367c6`, 1360 bytes.

```text
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

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/ls/lsconv/compatibility.go`

Mode `100644`, blob `cbef57af2941a3f62b87df18df395177e1859802`, SHA256 `444697c6dc600b37f892a6ee4186e67ee7d77b38df506cf816a9a4c248819793`, 354 bytes.

```text
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

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/project/compatibility.go`

Mode `100644`, blob `1240d44e146e1618eb4a0fd15ed39e26c34f310e`, SHA256 `4190f494b02a904322569fa92d796b4c1f19834e7b21e351eff18c392230abb1`, 628 bytes.

```text
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

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/tsoptions/compatibility.go`

Mode `100644`, blob `c575a7dee68f56f3c7087af561886da03de898be`, SHA256 `df288e1c80a1bb6c2cada888bf54dff39b92965001ae6600254ba6c81ee6a418`, 1638 bytes.

```text
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

### `native/effect-tsgo/_tools/gen_shims/providers/typescript-go/tsoptions/extra-shim.json`

Mode `100644`, blob `cb667a607b060fc386c3d833f4b0d5e4fc4909e4`, SHA256 `d28beee7c3bbc3fbed70d787b226bcc5d1e49dcbd1cfc2f1bb54f20f4758c18c`, 96 bytes.

```text
{
  "IgnoreFunctions": ["ParseJsonSourceFileConfigFileContent", "ParseJsonConfigFileContent"]
}
```
