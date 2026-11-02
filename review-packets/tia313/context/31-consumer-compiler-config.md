# Compiler plugin parser, generic JSON and incremental state

Independently assess this consumer against the producer/input/output packets. Preserve diagnostic IDs/counts/ranges and framed protocol behavior.

### `native/typescript-go/internal/core/compileroptions.go`

Mode `100644`, blob `2053e6bde8410df3c87d1b3bed9b01d21442744e`, SHA256 `44f931dfc954b17a2a693ef2ab0bc5116d98745dab403dd9699b5a2c7f765f1d`, 27885 bytes.

Current source lines 152-174, excerpt SHA256 `0f0bf6d8233895c9455eb4898e77e003e5c0d930ad817ba3f11d65622a5ce81e`.

```text
	Watch               Tristate `json:"watch,omitzero"`
	ShowConfig          Tristate `json:"showConfig,omitzero"`
	Build               Tristate `json:"build,omitzero"`
	Help                Tristate `json:"help,omitzero"`
	All                 Tristate `json:"all,omitzero"`

	PprofDir       string   `json:"pprofDir,omitzero"`
	SingleThreaded Tristate `json:"singleThreaded,omitzero"`
	Quiet          Tristate `json:"quiet,omitzero"`
	Checkers       *int     `json:"checkers,omitzero"`

	// Effect holds the parsed @effect/language-service plugin configuration.
	// This field is populated from the plugins array in tsconfig.json during config parsing.
	// Incremental build info persists it separately from user compiler options.
	Effect *etscore.EffectPluginOptions `json:"-"`
}

// noCopy may be embedded into structs which must not be copied
// after the first use.
//
// See https://golang.org/issues/8005#issuecomment-190753527
// for details.
type noCopy struct{}
```

### `native/typescript-go/internal/tsoptions/parsinghelpers.go`

Mode `100644`, blob `199d0a286cdcde5eb2610bee028725b61a6e02d1`, SHA256 `62a58a5b15496b50e6a81720fc4a5ae8ee375c97b851f588814c615c246d46bb`, 22186 bytes.

Canonical source lines 468-495, excerpt SHA256 `1ed9fee44c782be0146eb8f99d9bab5928cec4e467912fa950c27f53b9eb51a6`.

The rendered block retains the previously reviewed selection of canonical source lines 468-495, with the final blank-line LF omitted. Its decoded identity is 805 bytes, SHA256 `945640c8599944eeea274b0d3972fe533f15e65173a7253a85390d90d63d1386`. The canonical source identity above and this rendered-block identity are separate; decoding preserves the rendered bytes exactly.

```text
	case "noDtsResolution":
		allOptions.NoDtsResolution = ParseTristate(value)
	case "pathsBasePath":
		allOptions.PathsBasePath = ParseString(value)
	case "outDir":
		allOptions.OutDir = ParseString(value)
	case "newLine":
		allOptions.NewLine = floatOrInt32ToFlag[core.NewLineKind](value)
	case "watch":
		allOptions.Watch = ParseTristate(value)
	case "pprofDir":
		allOptions.PprofDir = ParseString(value)
	case "singleThreaded":
		allOptions.SingleThreaded = ParseTristate(value)
	case "quiet":
		allOptions.Quiet = ParseTristate(value)
	case "checkers":
		allOptions.Checkers = parseNumber(value)
	case "plugins":
		// Parse @effect/language-service plugin configuration
		allOptions.Effect = etscore.ParseFromPlugins(value)
	default:
		// different than any key above
		return false
	}
	return true
}
```

### `native/typescript-go/internal/execute/incremental/buildInfo.go`

Mode `100644`, blob `0445636053155766214fdb9715fc20e6cb698474`, SHA256 `d9ed5c18288a8b278aa85290ad75e0b07fd97e747c623e5ef65c518d033c531e`, 21782 bytes.

Canonical source lines 463-487, excerpt SHA256 `674f59f1a540f3cc7307622da7aa7e8ab3aceb96b10edf269e28244b1355af12`.

The rendered block retains the previously reviewed selection of canonical source lines 463-487, with the final blank-line LF omitted. Its decoded identity is 1885 bytes, SHA256 `48641290e098d55d94a7ac4356f73d33e00391d580c8627bd9e36cbf71fe29f8`. The canonical source identity above and this rendered-block identity are separate; decoding preserves the rendered bytes exactly.

```text
type BuildInfo struct {
	Version string `json:"version,omitzero"`

	// Common between incremental and tsc -b buildinfo for non incremental programs
	Errors              bool             `json:"errors,omitzero"`
	CheckPending        bool             `json:"checkPending,omitzero"`
	Root                []*BuildInfoRoot `json:"root,omitzero"`
	PackageJsons        []string         `json:"packageJsons,omitzero"`
	MissingPackageJsons []string         `json:"missingPackageJsons,omitzero"`

	// IncrementalProgram info
	FileNames                  []string                             `json:"fileNames,omitzero"`
	FileInfos                  []*BuildInfoFileInfo                 `json:"fileInfos,omitzero"`
	FileIdsList                [][]BuildInfoFileId                  `json:"fileIdsList,omitzero"`
	Options                    *collections.OrderedMap[string, any] `json:"options,omitzero"`
	Effect                     *etscore.EffectPluginOptions         `json:"effect,omitzero"`
	ReferencedMap              []*BuildInfoReferenceMapEntry        `json:"referencedMap,omitzero"`
	SemanticDiagnosticsPerFile []*BuildInfoSemanticDiagnostic       `json:"semanticDiagnosticsPerFile,omitzero"`
	EmitDiagnosticsPerFile     []*BuildInfoDiagnosticsOfFile        `json:"emitDiagnosticsPerFile,omitzero"`
	ChangeFileSet              []BuildInfoFileId                    `json:"changeFileSet,omitzero"`
	AffectedFilesPendingEmit   []*BuildInfoFilePendingEmit          `json:"affectedFilesPendingEmit,omitzero"`
	LatestChangedDtsFile       string                               `json:"latestChangedDtsFile,omitzero"` // Because this is only output file in the program, we dont need fileId to deduplicate name
	EmitSignatures             []*BuildInfoEmitSignature            `json:"emitSignatures,omitzero"`
	ResolvedRoot               []*BuildInfoResolvedRoot             `json:"resolvedRoot,omitzero"`
```

Current source lines 506-536, excerpt SHA256 `de52da83659f842fd9b887495529e7c6e0b3ab49c1bd75fc07e68d439361642e`.

```text
		return ""
	}
	return b.FileNames[fileId-1]
}

func (b *BuildInfo) fileInfo(fileId BuildInfoFileId) *BuildInfoFileInfo {
	if fileId < 1 || int(fileId) > len(b.FileInfos) {
		return nil
	}
	return b.FileInfos[fileId-1]
}

func (b *BuildInfo) GetCompilerOptions(buildInfoDirectory string) *core.CompilerOptions {
	options := &core.CompilerOptions{}
	for option, value := range b.Options.Entries() {
		if buildInfoDirectory != "" {
			result, ok := tsoptions.ConvertOptionToAbsolutePath(option, value, tsoptions.CommandLineCompilerOptionsMap, buildInfoDirectory)
			if ok {
				tsoptions.ParseCompilerOptions(option, result, options)
				continue
			}
		}
		tsoptions.ParseCompilerOptions(option, value, options)

	}
	options.Effect = b.Effect
	return options
}

func (b *BuildInfo) IsEmitPending(resolved *tsoptions.ParsedCommandLine, buildInfoDirectory string) bool {
	// Some of the emit files like source map or dts etc are not yet done
```

### `native/typescript-go/internal/tsoptions/decls_test.go`

Mode `100644`, blob `7dc432b4e36879b5084861b8edc6510b583ffbbb`, SHA256 `c036a7a770f5596e293d6556933a706ae1681079771bd8c5149cef5a46c31fcf`, 2078 bytes.

Current source lines 1-80, excerpt SHA256 `adcf2f3afda43ce40dd6da331a98c84186b5507ebf4ef1ea10ff09f3a38ee6d2`.

```text
package tsoptions_test

import (
	"reflect"
	"strings"
	"testing"

	"github.com/microsoft/typescript-go/internal/core"
	"github.com/microsoft/typescript-go/internal/tsoptions"
)

func TestCompilerOptionsDeclaration(t *testing.T) {
	t.Parallel()

	decls := make(map[string]*tsoptions.CommandLineOption)

	for _, decl := range tsoptions.OptionsDeclarations {
		decls[strings.ToLower(decl.Name)] = decl
	}

	internalOptions := []string{
		"allowNonTsExtensions",
		"build",
		"configFilePath",
		"noDtsResolution",
		"noEmitForJsFiles",
		"pathsBasePath",
		"suppressOutputPathCheck",
		"build",
	}

	internalOptionsMap := make(map[string]string)
	for _, opt := range internalOptions {
		internalOptionsMap[strings.ToLower(opt)] = opt
	}

	compilerOptionsType := reflect.TypeFor[core.CompilerOptions]()
	for field := range compilerOptionsType.Fields() {
		if !field.IsExported() {
			continue
		}
		if field.Name == "Effect" {
			// The plugins declaration supplies derived state, not an Effect flag.
			if field.Tag.Get("json") != "-" || decls["effect"] != nil {
				t.Fatal("derived Effect state must not be exposed as a compiler option")
			}
			continue
		}

		lowerName := strings.ToLower(field.Name)

		decl := decls[lowerName]
		if decl == nil {
			if name, ok := internalOptionsMap[lowerName]; ok {
				checkCompilerOptionJsonTagName(t, field, name)
				continue
			}
			t.Errorf("CompilerOptions.%s has no options declaration", field.Name)
			continue
		}
		delete(decls, lowerName)

		checkCompilerOptionJsonTagName(t, field, decl.Name)
	}

	skippedOptions := []string{
		"plugins",
	}

	for _, opt := range skippedOptions {
		delete(decls, strings.ToLower(opt))
	}

	for _, decl := range decls {
		t.Errorf("Option declaration %s is not present in CompilerOptions", decl.Name)
	}
}

func checkCompilerOptionJsonTagName(t *testing.T, field reflect.StructField, name string) {
	t.Helper()
```

### `native/effect-tsgo/internal/effectconfigcheck/compiler_options_test.go`

Mode `100644`, blob `6fa7d7fe107fa7eaf71edd18d8c5b1cac29b3ed6`, SHA256 `64d82f3e21ad0705ed2a848abe18f78d8db544902e3dcd3a4d510a876f45dc5e`, 2463 bytes.

Current source lines 1-66, excerpt SHA256 `64d82f3e21ad0705ed2a848abe18f78d8db544902e3dcd3a4d510a876f45dc5e`.

```text
package effectconfigcheck_test

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/effect-ts/tsgo/etscore"
	"github.com/microsoft/TypeScript/tsc/shim/execute/tsc"
)

func TestEffectStateRemainsInternalAcrossConfigInheritance(t *testing.T) {
	t.Parallel()
	host := newHost(map[string]string{
		"/base.json":     config(`"includeSuggestionsInTsc":false,"diagnosticSeverity":{"floatingEffect":"warning"}`, ""),
		"/middle.json":   `{"extends":"./base.json"}`,
		"/tsconfig.json": `{"extends":"./middle.json","compilerOptions":{"strict":true}}`,
	})
	parsed := parse(t, host, "/tsconfig.json", &tsc.ExtendedConfigCache{})
	if len(parsed.Errors) != 0 {
		t.Fatalf("unexpected config diagnostics: %v", parsed.Errors)
	}
	options := parsed.CompilerOptions()
	if !options.Strict.IsTrue() || options.Effect == nil {
		t.Fatal("compiler options or inherited Effect state were lost")
	}
	if options.Effect.IncludeSuggestionsInTsc || options.Effect.DiagnosticSeverity["floatingEffect"] != etscore.SeverityWarning {
		t.Fatalf("inherited plugin settings changed: %+v", options.Effect)
	}
	encoded, err := json.Marshal(options)
	if err != nil {
		t.Fatal(err)
	}
	var publicOptions map[string]any
	if err := json.Unmarshal(encoded, &publicOptions); err != nil {
		t.Fatal(err)
	}
	if _, exists := publicOptions["Effect"]; exists {
		t.Fatalf("derived Effect state leaked into compiler option JSON: %s", encoded)
	}
	if _, exists := publicOptions["effect"]; exists {
		t.Fatalf("derived Effect state became a direct compiler option: %s", encoded)
	}
	if publicOptions["strict"] != true {
		t.Fatalf("ordinary compiler options were lost: %s", encoded)
	}
}

func TestEffectStateIsNotADirectCompilerOption(t *testing.T) {
	t.Parallel()
	for _, name := range []string{"Effect", "effect"} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			host := newHost(map[string]string{
				"/tsconfig.json": `{"files":["/main.ts"],"compilerOptions":{"` + name + `":{"diagnostics":false},"strict":true}}`,
			})
			parsed := parse(t, host, "/tsconfig.json", nil)
			if parsed.CompilerOptions().Effect != nil || !parsed.CompilerOptions().Strict.IsTrue() {
				t.Fatal("direct option input changed derived state or ordinary compiler options")
			}
			if len(parsed.Errors) != 1 || parsed.Errors[0].Code() != 5023 || !strings.Contains(parsed.Errors[0].String(), name) {
				t.Fatalf("expected the unknown compiler option diagnostic for %s: %v", name, parsed.Errors)
			}
		})
	}
}
```
