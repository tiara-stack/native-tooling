package effectlint

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strings"
	"testing"

	"github.com/effect-ts/tsgo/tsgolint/internal/rule"
	"github.com/effect-ts/tsgo/tsgolint/internal/utils"
	"github.com/microsoft/typescript-go/shim/bundled"
	"github.com/microsoft/typescript-go/shim/tspath"
	"github.com/microsoft/typescript-go/shim/vfs/cachedvfs"
	"github.com/microsoft/typescript-go/shim/vfs/osvfs"
)

type effectMetadata struct {
	Rules []effectMetadataRule `json:"rules"`
}

type effectMetadataRule struct {
	Name    string                    `json:"name"`
	Preview effectMetadataRulePreview `json:"preview"`
}

type effectMetadataRulePreview struct {
	SourceText  string                            `json:"sourceText"`
	Diagnostics []effectMetadataPreviewDiagnostic `json:"diagnostics"`
}

type effectMetadataPreviewDiagnostic struct {
	Text string `json:"text"`
}

type effectRuleFixture struct {
	headlessName     string
	effectName       string
	valid            string
	invalid          string
	invalidFiles     map[string]string
	effectVersion    string
	skipInvalid      string
	expectedCount    int
	expectedContains string
}

var requestedEffectRuleFixtures = []struct {
	headlessName string
	effectName   string
}{
	{"missing_effect_context", "missingEffectContext"},
	{"missing_layer_context", "missingLayerContext"},
	{"floating_effect", "floatingEffect"},
	{"missing_effect_error", "missingEffectError"},
	{"missing_effect_service_dependency", "missingEffectServiceDependency"},
	{"any_unknown_in_error_context", "anyUnknownInErrorContext"},
	{"scope_in_layer_effect", "scopeInLayerEffect"},
	{"strict_effect_provide", "strictEffectProvide"},
	{"leaking_requirements", "leakingRequirements"},
	{"catch_to_ignore", "catchToIgnore"},
	{"run_effect_inside_effect", "runEffectInsideEffect"},
	{"effect_gen_uses_adapter", "effectGenUsesAdapter"},
	{"effect_succeed_with_void", "effectSucceedWithVoid"},
	{"effect_map_void", "effectMapVoid"},
	{"deterministic_keys", "deterministicKeys"},
	{"instance_of_schema", "instanceOfSchema"},
	{"prefer_schema_over_json", "preferSchemaOverJson"},
	{"duplicate_package", "duplicatePackage"},
	{"layer_merge_all_with_dependencies", "layerMergeAllWithDependencies"},
	{"unnecessary_arrow_block", "unnecessaryArrowBlock"},
	{"process_env", "processEnv"},
	{"multiple_catch_tag", "multipleCatchTag"},
	{"overridden_schema_constructor", "overriddenSchemaConstructor"},
	{"new_schema_class", "newSchemaClass"},
	{"try_catch_in_effect_gen", "tryCatchInEffectGen"},
	{"missing_return_yield_star", "missingReturnYieldStar"},
	{"missing_star_in_yield_effect_gen", "missingStarInYieldEffectGen"},
}

func TestRequestedEffectRuleFixtures(t *testing.T) {
	fixtures := loadRequestedEffectRuleFixtures(t)

	for _, fixture := range fixtures {
		t.Run(fixture.headlessName+"/valid", func(t *testing.T) {
			t.Parallel()

			diagnostics := runEffectRuleFixture(t, effectRuleFixture{
				headlessName: fixture.headlessName,
				effectName:   fixture.effectName,
				valid:        fixture.valid,
			}, fixture.valid)
			if len(diagnostics) != 0 {
				t.Fatalf("expected valid fixture to produce no diagnostics, got %d: %v", len(diagnostics), diagnosticDescriptions(diagnostics))
			}
		})

		t.Run(fixture.headlessName+"/invalid", func(t *testing.T) {
			t.Parallel()
			if fixture.skipInvalid != "" {
				t.Skip(fixture.skipInvalid)
			}

			diagnostics := runEffectRuleFixture(t, fixture, fixture.invalid)
			if len(diagnostics) != fixture.expectedCount {
				t.Fatalf("expected invalid fixture to produce %d diagnostic(s), got %d: %v", fixture.expectedCount, len(diagnostics), diagnosticDescriptions(diagnostics))
			}
			for _, diagnostic := range diagnostics {
				if diagnostic.RuleName != fixture.headlessName {
					t.Fatalf("expected rule %q, got %q", fixture.headlessName, diagnostic.RuleName)
				}
				if diagnostic.Message.Id != fixture.effectName {
					t.Fatalf("expected message id %q, got %q", fixture.effectName, diagnostic.Message.Id)
				}
			}
			if fixture.expectedContains != "" && !slices.ContainsFunc(diagnostics, func(d rule.RuleDiagnostic) bool {
				return strings.Contains(d.Message.Description, fixture.expectedContains)
			}) {
				t.Fatalf("expected at least one diagnostic to contain %q, got %v", fixture.expectedContains, diagnosticDescriptions(diagnostics))
			}
		})
	}
}

func loadRequestedEffectRuleFixtures(t *testing.T) []effectRuleFixture {
	t.Helper()

	metadataByName := loadEffectMetadata(t)
	fixtures := make([]effectRuleFixture, 0, len(requestedEffectRuleFixtures))
	for _, requested := range requestedEffectRuleFixtures {
		valid := "export const clean = 1\n"
		invalidFiles := map[string]string(nil)

		if requested.effectName == "processEnv" {
			valid = "export const clean = globalThis.process?.version\n"
		}

		if requested.effectName == "duplicatePackage" {
			fixtures = append(fixtures, duplicatePackageFixture(requested.headlessName, requested.effectName))
			continue
		}

		metadataRule, ok := metadataByName[requested.effectName]
		if !ok {
			t.Fatalf("missing metadata fixture for %s", requested.effectName)
		}
		if len(metadataRule.Preview.Diagnostics) == 0 {
			t.Fatalf("metadata fixture for %s has no invalid diagnostics", requested.effectName)
		}
		invalid := metadataRule.Preview.SourceText
		if requiresEffectV3Detection(requested.effectName) {
			invalidFiles = map[string]string{}
		}

		fixtures = append(fixtures, effectRuleFixture{
			headlessName:     requested.headlessName,
			effectName:       requested.effectName,
			valid:            valid,
			invalid:          invalid,
			invalidFiles:     invalidFiles,
			effectVersion:    requiredEffectVersion(requested.effectName),
			skipInvalid:      invalidSkipReason(requested.effectName),
			expectedCount:    len(metadataRule.Preview.Diagnostics),
			expectedContains: "effect(" + requested.effectName + ")",
		})
	}
	return fixtures
}

func requiredEffectVersion(effectName string) string {
	switch effectName {
	case "missingEffectServiceDependency", "scopeInLayerEffect":
		return "3.0.0-fixture"
	default:
		return ""
	}
}

func requiresEffectV3Detection(effectName string) bool {
	return requiredEffectVersion(effectName) != ""
}

func invalidSkipReason(effectName string) string {
	if !requiresEffectV3Detection(effectName) {
		return ""
	}
	return "invalid fixture is v3-only and requires Effect v3 service/layer type declarations; this workspace resolves Effect v4"
}

func duplicatePackageFixture(headlessName string, effectName string) effectRuleFixture {
	return effectRuleFixture{
		headlessName: headlessName,
		effectName:   effectName,
		valid: `import * as Effect from "effect/Effect"

export const clean = Effect.succeed(true)
`,
		invalid: `import * as Effect from "effect/Effect"
import "effect-copy"

export const preview = Effect.succeed(true)
`,
		invalidFiles: map[string]string{
			"node_modules/effect-copy/package.json": `{
  "name": "effect",
  "version": "0.0.0-fixture",
  "types": "index.d.ts"
}
`,
			"node_modules/effect-copy/index.d.ts": `export declare const duplicatePackageFixture: unique symbol
`,
		},
		expectedCount:    1,
		expectedContains: "effect(duplicatePackage)",
	}
}

func runEffectRuleFixture(t *testing.T, fixture effectRuleFixture, source string) []rule.RuleDiagnostic {
	t.Helper()

	rootDir := repositoryPackageRoot(t)
	filePath := tspath.ResolvePath(rootDir, "src/__effectlint_fixture.ts")
	tsconfigPath := tspath.ResolvePath(rootDir, "tsconfig.effectlint-fixture.json")

	virtualFiles := map[string]string{
		filePath: source,
		tsconfigPath: `{
  "files": ["src/__effectlint_fixture.ts"],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "verbatimModuleSyntax": true,
    "allowJs": true,
    "noEmit": true,
    "plugins": [
      {
        "name": "@effect/language-service",
        "diagnostics": true,
        "includeSuggestionsInTsc": true,
        "diagnosticSeverity": {
          "` + fixture.effectName + `": "error"
        }
      }
    ]
  }
}
`,
	}
	for relativePath, contents := range fixture.invalidFiles {
		virtualFiles[tspath.ResolvePath(rootDir, relativePath)] = contents
	}
	if fixture.effectVersion != "" {
		addEffectPackageVersionOverride(t, rootDir, virtualFiles, fixture.effectVersion)
	}

	fs := utils.NewOverlayVFS(cachedvfs.From(bundled.WrapFS(osvfs.FS())), virtualFiles)
	host := utils.CreateCompilerHost(rootDir, fs)
	program, internalDiagnostics, err := utils.CreateProgram(true, fs, rootDir, "tsconfig.effectlint-fixture.json", host, true)
	if err != nil {
		t.Fatalf("create program: %v", err)
	}
	if program == nil {
		t.Fatalf("create program returned nil: %+v", internalDiagnostics)
	}

	sourceFile := program.GetSourceFile(filePath)
	if sourceFile == nil {
		t.Fatalf("missing source file %s", filePath)
	}

	checker, done := program.GetTypeChecker(context.Background())
	defer done()

	var diagnostics []rule.RuleDiagnostic
	if err := RunSelected(context.Background(), program, checker, sourceFile, []string{fixture.headlessName}, func(diagnostic rule.RuleDiagnostic) {
		diagnostics = append(diagnostics, diagnostic)
	}); err != nil {
		t.Fatalf("run selected Effect rule %s: %v", fixture.headlessName, err)
	}
	return diagnostics
}

func addEffectPackageVersionOverride(t *testing.T, rootDir string, virtualFiles map[string]string, version string) {
	t.Helper()

	packageJsonPath := filepath.Join(rootDir, "node_modules", "effect", "package.json")
	contents, err := os.ReadFile(packageJsonPath)
	if err != nil {
		t.Fatalf("read effect package.json: %v", err)
	}

	var packageJson map[string]any
	if err := json.Unmarshal(contents, &packageJson); err != nil {
		t.Fatalf("parse effect package.json: %v", err)
	}
	packageJson["version"] = version
	updated, err := json.Marshal(packageJson)
	if err != nil {
		t.Fatalf("marshal effect package.json: %v", err)
	}

	virtualFiles[tspath.ResolvePath(rootDir, "node_modules/effect/package.json")] = string(updated)
	if realPath, err := filepath.EvalSymlinks(packageJsonPath); err == nil {
		virtualFiles[tspath.NormalizePath(realPath)] = string(updated)
	}
}

func loadEffectMetadata(t *testing.T) map[string]effectMetadataRule {
	t.Helper()

	metadataPath := filepath.Join(tsgolintForkRoot(t), "..", "effect-tsgo", "_packages", "tsgo", "src", "metadata.json")
	contents, err := os.ReadFile(metadataPath)
	if err != nil {
		t.Fatalf("read Effect metadata: %v", err)
	}

	var metadata effectMetadata
	if err := json.Unmarshal(contents, &metadata); err != nil {
		t.Fatalf("parse Effect metadata: %v", err)
	}

	result := make(map[string]effectMetadataRule, len(metadata.Rules))
	for _, rule := range metadata.Rules {
		result[rule.Name] = rule
	}
	return result
}

func repositoryPackageRoot(t *testing.T) string {
	t.Helper()

	return filepath.Clean(filepath.Join(tsgolintForkRoot(t), "..", "..", "packages", "typhoon-core"))
}

func tsgolintForkRoot(t *testing.T) string {
	t.Helper()

	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("could not locate test file")
	}
	return filepath.Clean(filepath.Join(filepath.Dir(filename), "..", ".."))
}

func diagnosticDescriptions(diagnostics []rule.RuleDiagnostic) []string {
	result := make([]string, len(diagnostics))
	for i, diagnostic := range diagnostics {
		result[i] = diagnostic.Message.Description
	}
	return result
}
