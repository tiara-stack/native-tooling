# Effect module and language-service consumers

Independently assess this consumer against the producer/input/output packets. Preserve diagnostic IDs/counts/ranges and framed protocol behavior.

### `native/effect-tsgo/go.mod`

Mode `100644`, blob `ffe3927f7d3e2a2d9c3710064e0abff803fb00df`, SHA256 `03888d98312e09576148427f736d36ec10dc19a4133f13127fbd07051c92cd67`, 14050 bytes.

Current source lines 1-45, excerpt SHA256 `55084e26934e46081c0f646919bf8788ffb65fa5e789ca1c23b3f9bb6194f691`.

```text
module github.com/effect-ts/tsgo

go 1.26

require (
	github.com/effect-ts/tsgo/etscore v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/ast v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/astnav v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/bundled v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/checker v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/collections v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/compiler v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/core v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/diagnostics v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/evaluator v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/execute/tsc v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/fourslash v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/jsnum v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/locale v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/ls v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/ls/autoimport v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/ls/change v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/ls/lsconv v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/ls/lsutil v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/lsp/lsproto v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/modulespecifiers v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/packagejson v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/parser v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/project v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/project/logging v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/scanner v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/testutil/baseline v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/testutil/harnessutil v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/tsoptions v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/tspath v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/vfs v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/vfs/osvfs v0.0.0
	github.com/microsoft/TypeScript/tsc/shim/vfs/vfstest v0.0.0
)

require (
	github.com/Microsoft/go-winio v0.6.2 // indirect
	github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68 // indirect
	github.com/google/go-cmp v0.7.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
```

### `native/effect-tsgo/go.work`

Mode `100644`, blob `49ad6359eede1675fe94b7e022c6d3c842e5abc8`, SHA256 `60beb9fadd7e681af28f7db8531b98d01d2ced7e6cf939fed78a3bd8c9ed099d`, 11448 bytes.

Current source lines 1-110, excerpt SHA256 `176f12187b4207dfd9dcb53aec605bc67715a22f58d650046fbb5d3d0eb84eee`.

```text
go 1.27

use (
	.
	../tsgolint-effect-fork
	./../typescript-go
	./etscore
	./shim/_backport/api
	./shim/_backport/ast
	./shim/_backport/astnav
	./shim/_backport/bundled
	./shim/_backport/checker
	./shim/_backport/collections
	./shim/_backport/compiler
	./shim/_backport/core
	./shim/_backport/diagnostics
	./shim/_backport/evaluator
	./shim/_backport/execute/tsc
	./shim/_backport/format
	./shim/_backport/fourslash
	./shim/_backport/jsnum
	./shim/_backport/jsonrpc
	./shim/_backport/locale
	./shim/_backport/ls
	./shim/_backport/ls/autoimport
	./shim/_backport/ls/change
	./shim/_backport/ls/lsconv
	./shim/_backport/ls/lsutil
	./shim/_backport/lsp
	./shim/_backport/lsp/lsproto
	./shim/_backport/module
	./shim/_backport/modulespecifiers
	./shim/_backport/nodebuilder
	./shim/_backport/packagejson
	./shim/_backport/parser
	./shim/_backport/printer
	./shim/_backport/project
	./shim/_backport/project/dirty
	./shim/_backport/project/logging
	./shim/_backport/repo
	./shim/_backport/scanner
	./shim/_backport/sourcemap
	./shim/_backport/testrunner
	./shim/_backport/testutil
	./shim/_backport/testutil/baseline
	./shim/_backport/testutil/harnessutil
	./shim/_backport/testutil/lsptestutil
	./shim/_backport/testutil/tsbaseline
	./shim/_backport/tracing
	./shim/_backport/tsoptions
	./shim/_backport/tspath
	./shim/_backport/vfs
	./shim/_backport/vfs/cachedvfs
	./shim/_backport/vfs/iovfs
	./shim/_backport/vfs/osvfs
	./shim/_backport/vfs/vfstest
	./shim/api
	./shim/ast
	./shim/astnav
	./shim/bundled
	./shim/checker
	./shim/collections
	./shim/compiler
	./shim/core
	./shim/diagnostics
	./shim/evaluator
	./shim/execute/tsc
	./shim/format
	./shim/fourslash
	./shim/jsnum
	./shim/jsonrpc
	./shim/locale
	./shim/ls
	./shim/ls/autoimport
	./shim/ls/change
	./shim/ls/lsconv
	./shim/ls/lsutil
	./shim/lsp
	./shim/lsp/lsproto
	./shim/module
	./shim/modulespecifiers
	./shim/nodebuilder
	./shim/packagejson
	./shim/parser
	./shim/printer
	./shim/project
	./shim/project/dirty
	./shim/project/logging
	./shim/repo
	./shim/scanner
	./shim/sourcemap
	./shim/testrunner
	./shim/testutil
	./shim/testutil/baseline
	./shim/testutil/harnessutil
	./shim/testutil/lsptestutil
	./shim/testutil/tsbaseline
	./shim/tracing
	./shim/tsoptions
	./shim/tspath
	./shim/vfs
	./shim/vfs/cachedvfs
	./shim/vfs/iovfs
	./shim/vfs/osvfs
	./shim/vfs/vfstest
)

replace github.com/microsoft/TypeScript/tsc v0.0.0 => ./typescript/tsc

replace github.com/microsoft/typescript-go v0.0.0 => ./../typescript-go
```

### `native/effect-tsgo/internal/rulerunner/diagnostics.go`

Mode `100644`, blob `461887a91d6b439e86d872b4b3d37038156b9b0e`, SHA256 `17781548b08354f7c8bd39a6969382894a61466ada30dad99228e283c8de77d0`, 8164 bytes.

Current source lines 1-115, excerpt SHA256 `5bad83f4814255eef5a37d0d983a1037ec8823e712e567f292a6708c6c65be3f`.

```text
package rulerunner

import (
	"context"
	"fmt"
	"slices"

	"github.com/effect-ts/tsgo/etscore"
	"github.com/effect-ts/tsgo/internal/directives"
	"github.com/effect-ts/tsgo/internal/pluginoptions"
	"github.com/effect-ts/tsgo/internal/rule"
	"github.com/effect-ts/tsgo/internal/rules"
	"github.com/effect-ts/tsgo/internal/typeparser"
	"github.com/microsoft/TypeScript/tsc/shim/ast"
	"github.com/microsoft/TypeScript/tsc/shim/checker"
	"github.com/microsoft/TypeScript/tsc/shim/core"
	tsdiag "github.com/microsoft/TypeScript/tsc/shim/diagnostics"
	"github.com/microsoft/TypeScript/tsc/shim/scanner"
)

// RuleDiagnostic pairs a diagnostic with its rule for directive processing.
type RuleDiagnostic struct {
	RuleName   string
	Rule       *rule.Rule
	Diagnostic *ast.Diagnostic
}

// MinVisibleSeverity returns the least visible severity that can surface in
// the current execution mode: in CLI (tsc) mode without includeSuggestionsInTsc
// only warnings and errors are printed, so SeverityWarning; everywhere else
// (LSP, tests) every severity surfaces, so SeverityMessage.
func MinVisibleSeverity(effectConfig *etscore.EffectPluginOptions) etscore.Severity {
	if etscore.IsCommandLineMode() && !effectConfig.GetIncludeSuggestionsInTsc() {
		return etscore.SeverityWarning
	}
	return etscore.SeverityMessage
}

// Run executes Effect diagnostics for a source file and returns diagnostics without emitting them.
// minSeverity is the least visible severity the caller can surface (see
// MinVisibleSeverity); rules whose configured severity is below it are skipped
// pre-execution unless a directive in the file references them.
func Run(ctx context.Context, program checker.Program, c *checker.Checker, sf *ast.SourceFile, effectConfig *etscore.EffectPluginOptions, ruleNames []string, minSeverity etscore.Severity) ([]*ast.Diagnostic, error) {
	if sf.IsDeclarationFile || program.IsSourceFileFromExternalLibrary(sf) {
		return nil, nil
	}

	if effectConfig == nil {
		return nil, nil
	}

	effectiveConfig := pluginoptions.ResolveEffectPluginOptionsForSourceFile(
		effectConfig,
		sf.FileName(),
		program.Options().ConfigFilePath,
		program.UseCaseSensitiveFileNames(),
	)

	resolvedSeverity := pluginoptions.ResolveDiagnosticSeverityForFile(
		effectConfig,
		sf.FileName(),
		program.Options().ConfigFilePath,
		program.UseCaseSensitiveFileNames(),
	)

	if !etscore.DiagnosticsEnabled(effectConfig) || resolvedSeverity == nil {
		return nil, nil
	}

	selectedRules, err := selectRules(ruleNames)
	if err != nil {
		return nil, err
	}
	if len(selectedRules) == 0 {
		return nil, nil
	}

	tp := typeparser.NewTypeParser(program, c)
	sourceText := sf.Text()
	effectDirectives := directives.CollectEffectDirectives(sourceText)
	directiveSet := directives.BuildDirectiveSet(effectDirectives)

	if directiveSet.IsSkipFile("*") {
		return nil, nil
	}

	allDiagnostics := collectDiagnostics(ctx, program, c, tp, sf, effectConfig, effectiveConfig, resolvedSeverity, directiveSet, selectedRules, minSeverity)
	finalDiagnostics := transformDiagnostics(allDiagnostics, sf, directiveSet, resolvedSeverity, minSeverity)
	finalDiagnostics = append(finalDiagnostics, unusedDirectiveDiagnostics(sf, effectDirectives, directiveSet, resolvedSeverity)...)

	return finalDiagnostics, nil
}

func selectRules(ruleNames []string) ([]*rule.Rule, error) {
	if ruleNames != nil && len(ruleNames) == 0 {
		return nil, nil
	}

	if ruleNames == nil {
		selected := make([]*rule.Rule, 0, len(rules.All))
		for i := range rules.All {
			selected = append(selected, &rules.All[i])
		}
		return selected, nil
	}

	selected := make([]*rule.Rule, 0, len(ruleNames))
	for _, name := range ruleNames {
		idx := slices.IndexFunc(rules.All, func(r rule.Rule) bool { return r.Name == name })
		if idx == -1 {
			return nil, fmt.Errorf("unknown Effect diagnostic rule %q", name)
		}
		selected = append(selected, &rules.All[idx])
	}
	return selected, nil
```

### `native/effect-tsgo/etsdiagnostics/diagnostics.go`

Mode `100644`, blob `47b56254f901ce12be9e969dfd606a7b6ab7104a`, SHA256 `217c0e3294d245b14bdbcd8a294a18d5849695fc796308f4037a821256926b36`, 14649 bytes.

Current source lines 180-207, excerpt SHA256 `ee1d461bc37b437349aebc55d1db7e78d2c0213686234a4ddffef68672d40f17`.

```text
			return nil, nil, summary{}, err
		}

		session.WithSnapshotLoadingProjectTree(ctx, nil, func(snapshot *project.Snapshot) {
			for _, configuredProject := range snapshot.ProjectCollection.ConfiguredProjects() {
				if configuredProject.CommandLine == nil {
					continue
				}
				for _, fileName := range configuredProject.CommandLine.FileNames() {
					addTarget(fileName)
				}
			}
		})
	}

	if req.File != "" {
		fileName := tspath.GetNormalizedAbsolutePath(req.File, req.CWD)
		request := project.NewOpenFileSnapshotRequest(fileName, req.CWD, fs.UseCaseSensitiveFileNames())
		if err := updateSession(ctx, session, request); err != nil {
			return nil, nil, summary{}, err
		}
		addTarget(fileName)
	}

	resultSummary := summary{TotalFiles: len(targets)}
	if len(targets) == 0 {
		return nil, nil, resultSummary, fmt.Errorf("%s", noFilesMessage)
	}
```

Current source lines 253-280, excerpt SHA256 `9444b38f325b9a18850c4a377f39313bc9a442bcc3f874d541df02113f023424`.

```text
				record, cached := versionCache[configuredProject]
				if !cached {
					c, done := program.GetTypeChecker(ctx)
					tp := typeparser.NewTypeParser(program, c)
					record = versionRecord{
						detected:  tp.DetectEffectVersion().String(),
						supported: tp.SupportedEffectVersion().String(),
					}
					done()
					versionCache[configuredProject] = record
				}
				files = append(files, fileEffectVersion{
					File:            fileName,
					DetectedEffect:  record.detected,
					SupportedEffect: record.supported,
				})
			}

			for _, diagnostic := range program.GetSemanticDiagnostics(ctx, sourceFile) {
				if !rule.IsEffectCode(diagnostic.Code()) {
					continue
				}
				formatted := formatDiagnostic(diagnostic)
				if severityFilter != nil {
					if _, included := severityFilter[formatted.Severity]; !included {
						continue
					}
				}
```

### `native/effect-tsgo/etscheckerhooks/init.go`

Mode `100644`, blob `d3572ac1588e5538d1299ed2dead211fea8ca0c6`, SHA256 `fac210848f43fa08fe96b38d5b933cb730929827f4bc1268d2fc7300e561cc3b`, 1759 bytes.

Current source lines 1-45, excerpt SHA256 `fac210848f43fa08fe96b38d5b933cb730929827f4bc1268d2fc7300e561cc3b`.

```text
// Package etscheckerhooks provides Effect diagnostics integration with TypeScript-Go.
// This package registers hooks into the checker to run Effect-specific diagnostics
// after each source file is type checked.
package etscheckerhooks

import (
	"context"

	"github.com/effect-ts/tsgo/etscore"
	"github.com/effect-ts/tsgo/internal/effectconfigcheck"
	"github.com/effect-ts/tsgo/internal/effectconfigraw"
	"github.com/effect-ts/tsgo/internal/rulerunner"
	"github.com/microsoft/TypeScript/tsc/shim/ast"
	"github.com/microsoft/TypeScript/tsc/shim/checker"
	"github.com/microsoft/TypeScript/tsc/shim/core"
)

// init registers the Effect diagnostics callbacks with TypeScript-Go.
func init() {
	// Set the version suffix so that core.Version() includes the Effect version
	core.SetVersionSuffix("+effect-tsgo." + etscore.EffectVersion)
	effectconfigraw.Register()
	effectconfigcheck.Register()
	// Register the after check source file callback
	checker.RegisterAfterCheckSourceFileCallback(afterCheckSourceFile)
}

// getEffectConfig retrieves the Effect plugin configuration from the program's compiler options.
// Returns nil if no Effect config is present.
func getEffectConfig(p checker.Program) *etscore.EffectPluginOptions {
	return p.Options().Effect
}

// afterCheckSourceFile is called after type checking each source file.
// It runs Effect diagnostics if the plugin is enabled.
func afterCheckSourceFile(ctx context.Context, program checker.Program, c *checker.Checker, sf *ast.SourceFile) {
	effectConfig := getEffectConfig(program)
	diagnostics, err := rulerunner.Run(ctx, program, c, sf, effectConfig, nil, rulerunner.MinVisibleSeverity(effectConfig))
	if err != nil {
		return
	}
	for _, diag := range diagnostics {
		c.AddDiagnostic(diag)
	}
}
```
