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
