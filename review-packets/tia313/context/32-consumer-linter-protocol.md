# Generic TypeScript and retained82 Effect bridge

Independently assess this consumer against the producer/input/output packets. Preserve diagnostic IDs/counts/ranges and framed protocol behavior.

### `native/tsgolint-effect-fork/go.mod`

Mode `100644`, blob `ca4cb84c353506bff62d2f7a2dc757e6cf3d5e78`, SHA256 `7118d114c28809f5d9ebd3b9e409953e41dd3f89f649f060c6c8923b245e3162`, 12799 bytes.

Current source lines 1-60, excerpt SHA256 `4c2d34bcabac013c79b2a46bba3ec1c0ac4da0bc42184f342d746d6431f0ef1e`.

```text
module github.com/effect-ts/tsgo/tsgolint

go 1.26.0

replace (
	github.com/microsoft/typescript-go/shim/ast => ./../effect-tsgo/shim/ast
	github.com/microsoft/typescript-go/shim/bundled => ./../effect-tsgo/shim/bundled
	github.com/microsoft/typescript-go/shim/checker => ./../effect-tsgo/shim/checker
	github.com/microsoft/typescript-go/shim/compiler => ./../effect-tsgo/shim/compiler
	github.com/microsoft/typescript-go/shim/core => ./../effect-tsgo/shim/core
	github.com/microsoft/typescript-go/shim/jsnum => ./../effect-tsgo/shim/jsnum
	github.com/microsoft/typescript-go/shim/lsp/lsproto => ./../effect-tsgo/shim/lsp/lsproto
	github.com/microsoft/typescript-go/shim/parser => ./../effect-tsgo/shim/parser
	github.com/microsoft/typescript-go/shim/project => ./../effect-tsgo/shim/project
	github.com/microsoft/typescript-go/shim/scanner => ./../effect-tsgo/shim/scanner
	github.com/microsoft/typescript-go/shim/tsoptions => ./../effect-tsgo/shim/tsoptions
	github.com/microsoft/typescript-go/shim/tspath => ./../effect-tsgo/shim/tspath
	github.com/microsoft/typescript-go/shim/vfs => ./../effect-tsgo/shim/vfs
	github.com/microsoft/typescript-go/shim/vfs/cachedvfs => ./../effect-tsgo/shim/vfs/cachedvfs
	github.com/microsoft/typescript-go/shim/vfs/osvfs => ./../effect-tsgo/shim/vfs/osvfs
)

require (
	github.com/microsoft/typescript-go/shim/ast v0.0.0
	github.com/microsoft/typescript-go/shim/bundled v0.0.0
	github.com/microsoft/typescript-go/shim/checker v0.0.0
	github.com/microsoft/typescript-go/shim/compiler v0.0.0
	github.com/microsoft/typescript-go/shim/core v0.0.0
	github.com/microsoft/typescript-go/shim/jsnum v0.0.0
	github.com/microsoft/typescript-go/shim/parser v0.0.0
	github.com/microsoft/typescript-go/shim/project v0.0.0
	github.com/microsoft/typescript-go/shim/scanner v0.0.0
	github.com/microsoft/typescript-go/shim/tsoptions v0.0.0
	github.com/microsoft/typescript-go/shim/tspath v0.0.0
	github.com/microsoft/typescript-go/shim/vfs v0.0.0
	github.com/microsoft/typescript-go/shim/vfs/cachedvfs v0.0.0
	github.com/microsoft/typescript-go/shim/vfs/osvfs v0.0.0
	golang.org/x/sys v0.48.0
	golang.org/x/tools v0.50.0
	gotest.tools/v3 v3.5.2
)

require (
	github.com/google/go-cmp v0.7.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/mackerelio/go-osstat v0.2.7 // indirect
	github.com/microsoft/TypeScript/tsc/shim/ast v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/checker v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/collections v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/core v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/diagnostics v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/evaluator v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/jsnum v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/packagejson v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/scanner v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/tsoptions v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/tspath v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/vfs v0.0.0 // indirect
	github.com/microsoft/typescript-go v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/collections v0.0.0 // indirect
```

### `native/tsgolint-effect-fork/internal/effectlint/effectlint.go`

Mode `100644`, blob `cbc2261dc0b0764e9eb2964070910df12ce91a42`, SHA256 `0fddf5a57e689cd6c92448c1e89892a42509a1fb89fecc83733f8cfd8cedf02c`, 3708 bytes.

Current source lines 1-124, excerpt SHA256 `81d74d0acf9f001e25de07e145483dcf2b61c9c743b3f1a82efe4f6b2ff56875`.

```text
package effectlint

import (
	"context"
	"fmt"
	"unicode"

	"github.com/effect-ts/tsgo/etscore"
	effectrule "github.com/effect-ts/tsgo/internal/rule"
	effectrunner "github.com/effect-ts/tsgo/internal/rulerunner"
	effectrules "github.com/effect-ts/tsgo/internal/rules"
	"github.com/effect-ts/tsgo/tsgolint/internal/rule"
	"github.com/effect-ts/tsgo/tsgolint/internal/utils"
	"github.com/microsoft/typescript-go/shim/ast"
	"github.com/microsoft/typescript-go/shim/checker"
	"github.com/microsoft/typescript-go/shim/compiler"
)

type RuleSpec struct {
	HeadlessName string
	EffectName   string
}

var All = func() []RuleSpec {
	specs := make([]RuleSpec, 0, len(publicEffectRuleNames))
	for _, effectName := range publicEffectRuleNames {
		effectRule := effectrule.ByName(effectrules.All, effectName)
		if effectRule == nil {
			panic("missing public Effect rule: " + effectName)
		}
		specs = append(specs, RuleSpec{
			HeadlessName: snakeCase(effectRule.Name),
			EffectName:   effectRule.Name,
		})
	}
	return specs
}()

var effectNameByHeadlessName = func() map[string]string {
	result := make(map[string]string, len(All))
	for _, spec := range All {
		result[spec.HeadlessName] = spec.EffectName
	}
	return result
}()

// Rules returns marker rules for the Effect diagnostics. The linter handles
// these specially after normal tsgolint AST traversal so Effect rules can run
// with the checker/program/source file tuple required by Effect-tsgo.
func Rules() []rule.Rule {
	rules := make([]rule.Rule, len(All))
	for i, spec := range All {
		name := spec.HeadlessName
		rules[i] = rule.Rule{
			Name: name,
			Run: func(ctx rule.RuleContext, options any) rule.RuleListeners {
				return rule.RuleListeners{}
			},
		}
	}
	return rules
}

func SelectedRuleNames(ruleNames []string) []string {
	selected := make([]string, 0, len(ruleNames))
	for _, name := range ruleNames {
		if _, ok := effectNameByHeadlessName[name]; ok {
			selected = append(selected, name)
		}
	}
	return selected
}

// RunSelected executes selected Effect diagnostics for one source file and
// emits results through tsgolint's existing rule diagnostic path.
func RunSelected(
	ctx context.Context,
	program *compiler.Program,
	c *checker.Checker,
	file *ast.SourceFile,
	ruleNames []string,
	onDiagnostic func(rule.RuleDiagnostic),
) error {
	effectConfig := program.Options().Effect
	if effectConfig == nil {
		return nil
	}

	for _, headlessName := range ruleNames {
		effectName, ok := effectNameByHeadlessName[headlessName]
		if !ok {
			continue
		}

		diagnostics, err := effectrunner.Run(ctx, program, c, file, effectConfig, []string{effectName}, etscore.SeverityMessage)
		if err != nil {
			return fmt.Errorf("run Effect diagnostic %s for %s: %w", effectName, file.FileName(), err)
		}

		for _, d := range diagnostics {
			sourceFile := file
			if d.File() != nil {
				sourceFile = d.File()
			}

			onDiagnostic(rule.RuleDiagnostic{
				Range:    d.Loc(),
				RuleName: headlessName,
				Message: rule.RuleMessage{
					Id:          effectName,
					Description: utils.GetDiagnosticMessage(d),
				},
				SourceFile: sourceFile,
			})
		}
	}

	return nil
}

func snakeCase(value string) string {
	runes := []rune(value)
	result := make([]rune, 0, len(runes)+4)
	for i, current := range runes {
```

### `native/tsgolint-effect-fork/internal/effectlint/public_rules.go`

Mode `100644`, blob `7cefd4fc792e2d5f29294ee5961fad5149bb5f32`, SHA256 `3a6b1f8c8be2c64e6c354cdbfcc8aa9bdd8679f587c36e4bb16d520525e991fe`, 2199 bytes.

Current source lines 1-89, excerpt SHA256 `3a6b1f8c8be2c64e6c354cdbfcc8aa9bdd8679f587c36e4bb16d520525e991fe`.

```text
package effectlint

// Public bridge identities are maintained separately from the language-service
// registry. A compiler update must not implicitly expose new rules before
// their metadata and marker changes land.
var publicEffectRuleNames = []string{
	"floatingEffect",
	"missingEffectError",
	"missingEffectContext",
	"missingReturnYieldStar",
	"missingStarInYieldEffectGen",
	"catchUnfailableEffect",
	"catchAllToMapError",
	"catchToOrElseSucceed",
	"catchToIgnore",
	"multipleCatchTag",
	"effectFnIife",
	"tryCatchInEffectGen",
	"unnecessaryPipe",
	"returnEffectInGen",
	"unnecessaryPipeChain",
	"effectSucceedWithVoid",
	"unnecessaryEffectGen",
	"effectMapVoid",
	"unnecessaryFailYieldableError",
	"effectInVoidSuccess",
	"effectInFailure",
	"unknownInEffectCatch",
	"globalErrorInEffectCatch",
	"globalErrorInEffectFailure",
	"cryptoRandomUUID",
	"cryptoRandomUUIDInEffect",
	"globalFetch",
	"globalFetchInEffect",
	"processEnv",
	"processEnvInEffect",
	"globalConsole",
	"globalConsoleInEffect",
	"globalDate",
	"globalDateInEffect",
	"globalRandom",
	"globalRandomInEffect",
	"globalTimers",
	"globalTimersInEffect",
	"runEffectInsideEffect",
	"preferSchemaOverJson",
	"effectGenUsesAdapter",
	"effectFnImplicitAny",
	"strictBooleanExpressions",
	"anyUnknownInErrorContext",
	"asyncFunction",
	"scopeInLayerEffect",
	"strictEffectProvide",
	"unsafeEffectTypeAssertion",
	"multipleEffectProvide",
	"missingLayerContext",
	"layerMergeAllWithDependencies",
	"schemaStructWithTag",
	"schemaSyncInEffect",
	"schemaNumber",
	"schemaUnionOfLiterals",
	"newSchemaClass",
	"missingEffectServiceDependency",
	"leakingRequirements",
	"lazyEffect",
	"lazyPromiseInEffectSync",
	"nestedEffectGenYield",
	"redundantMapError",
	"redundantOrDie",
	"unnecessaryArrowBlock",
	"unnecessaryTypeofType",
	"instanceOfSchema",
	"genericEffectServices",
	"overriddenSchemaConstructor",
	"redundantSchemaTagIdentifier",
	"classSelfMismatch",
	"effectFnOpportunity",
	"nonObjectEffectServiceType",
	"deterministicKeys",
	"missedPipeableOpportunity",
	"duplicatePackage",
	"effectDoNotation",
	"effectMapFlatten",
	"extendsNativeError",
	"nodeBuiltinImport",
	"newPromise",
	"outdatedApi",
	"serviceNotAsClass",
}
```

### `native/tsgolint-effect-fork/internal/linter/linter.go`

Mode `100644`, blob `9f5c156fcad035873f6636a4f13afc488d30fce9`, SHA256 `6b6930509dad80d5301e99c490beb977e2285707758b324cb8b23255cc35067d`, 19348 bytes.

Current source lines 87-116, excerpt SHA256 `7575ee3ce138f52266318ba8df1bf5e2c8ebb4c0ce0ddb07ee3433f87d8dbc63`.

```text
func RunLinter(options RunLinterOptions) error {
	logLevel := options.LogLevel
	currentDirectory := options.CurrentDirectory
	workload := options.Workload
	workers := options.Workers
	fs := options.FS
	getRulesForFile := options.GetRulesForFile
	onRuleDiagnostic := options.OnRuleDiagnostic
	onInternalDiagnostic := options.OnInternalDiagnostic
	fixState := options.Fixes
	typeErrors := options.TypeErrors
	suppressProgramDiagnostics := options.SuppressProgramDiagnostics
	timingStore := options.TimingStore

	idx := 0
	for configFileName, filePaths := range workload.Programs {
		if logLevel == utils.LogLevelDebug {
			log.Printf("[%d/%d] Running linter on program: %s", idx+1, len(workload.Programs), configFileName)
		}

		currentDirectory := tspath.GetDirectoryPath(configFileName)
		host := utils.NewCachedFSCompilerHost(currentDirectory, fs, bundled.LibPath(), nil, nil)

		program, diagnostics, err := utils.CreateProgram(false, fs, currentDirectory, configFileName, host, suppressProgramDiagnostics)

		if err != nil {
			return err
		}

		if program == nil {
```

Current source lines 445-525, excerpt SHA256 `c7ff60cd046e72cc35446534def8e28a1933411575ad741fecd71d42ea1aaca3`.

```text
func RunLinterOnProgram(options RunLinterOnProgramOptions) error {
	logLevel := options.LogLevel
	program := options.Program
	files := options.Files
	workers := options.Workers
	getRulesForFile := options.GetRulesForFile
	onDiagnostic := options.OnDiagnostic
	onInternalDiagnostic := options.OnInternalDiagnostic
	fixState := options.Fixes
	typeErrors := options.TypeErrors
	timingStore := options.TimingStore

	scheduling := checkerSchedulingFromEnvironment()
	reportTypeScriptDiagnostics(program, files, typeErrors, onInternalDiagnostic)
	scheduler := newCheckerScheduler(scheduling, program, files, workers)

	wg := core.NewWorkGroup(scheduler.workers == 1)
	for i := range scheduler.workers {
		wg.Queue(func() {
			initial, hasWork := scheduler.initialWorkload(i)
			if !hasWork {
				return
			}
			ctxBuilder := &ruleContextBuilder{
				fixState:     fixState,
				onDiagnostic: onDiagnostic,
			}

			// These closures remain valid for the length of linting, as we mutate the fields
			// of `ctxBuilder`, but `ctxBuilder` itself will not change.
			ctx := newRuleContext(ctxBuilder)

			if timingStore == nil {
				// Listeners are tagged with the rule that is associated with, so that when a diagnostic
				// is emitted we know what rule it is coming from.
				type taggedListener struct {
					ruleName string
					fn       func(node *ast.Node)
				}
				registeredListeners := make(map[ast.Kind][]taggedListener, 20)

				for w, ok := initial, true; ok; w, ok = w.nextWorkload() {
					ctxBuilder.program = w.program
					ctxBuilder.checker = w.checker
					ctx.Program = w.program
					ctx.TypeChecker = w.checker

					for file := w.nextFile(); file != nil; file = w.nextFile() {
						if logLevel == utils.LogLevelDebug {
							log.Print(file.FileName())
						}
						ctxBuilder.file = file
						ctx.SourceFile = file

						rules := getRulesForFile(file)
						for _, r := range rules {
							ctxBuilder.ruleName = r.Name
							for kind, listener := range r.Run(ctx) {
								listeners, ok := registeredListeners[kind]
								if !ok {
									listeners = make([]taggedListener, 0, len(rules))
								}
								registeredListeners[kind] = append(listeners, taggedListener{ruleName: r.Name, fn: listener})
							}
						}

						runListeners := func(kind ast.Kind, node *ast.Node) {
							if listeners, ok := registeredListeners[kind]; ok {
								for _, listener := range listeners {
									ctxBuilder.ruleName = listener.ruleName
									listener.fn(node)
								}
							}
						}

						visitLintNodes(file, runListeners)
						if err := effectlint.RunSelected(context.Background(), w.program, w.checker, file, selectedEffectRuleNames(rules), onDiagnostic); err != nil {
							return
						}
						// Instead of clearing the map, we clear the slices in-place to avoid re-allocating memory for the listeners on each file.
						for k := range registeredListeners {
```

Current source lines 570-612, excerpt SHA256 `1c0229f98880426e75acaf32d7ff24710677ae51e1a473cd82b2dc9a0cfd6085`.

```text
								listeners = make([]timedTaggedListener, 0, len(rules))
							}
							registeredListeners[kind] = append(listeners, timedTaggedListener{ruleName: r.Name, ruleIdx: ruleIdx, fn: listener})
						}
					}

					runListeners := func(kind ast.Kind, node *ast.Node) {
						if listeners, ok := registeredListeners[kind]; ok {
							for _, listener := range listeners {
								ctxBuilder.ruleName = listener.ruleName
								start := time.Now()
								listener.fn(node)
								recordTiming(&timingStats[listener.ruleIdx], time.Since(start))
							}
						}
					}

					visitLintNodes(file, runListeners)
					if err := effectlint.RunSelected(context.Background(), w.program, w.checker, file, selectedEffectRuleNames(rules), onDiagnostic); err != nil {
						return
					}
					for idx, stat := range timingStats {
						if stat.Calls == 0 {
							continue
						}
						merged := localTimings[rules[idx].Name]
						merged.add(stat)
						localTimings[rules[idx].Name] = merged
					}
					// Instead of clearing the map, we clear the slices in-place to avoid re-allocating memory for the listeners on each file.
					for k := range registeredListeners {
						registeredListeners[k] = registeredListeners[k][:0]
					}
				}
			}

			timingStore.merge(localTimings)
		})
	}
	wg.RunAndWait()

	return nil
}
```
