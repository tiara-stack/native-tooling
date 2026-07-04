package effectlint

import (
	"testing"

	effectrules "github.com/effect-ts/tsgo/internal/rules"
)

func TestRulesMirrorEffectRegistry(t *testing.T) {
	t.Parallel()

	if len(All) != len(effectrules.All) {
		t.Fatalf("expected %d Effect rules, got %d", len(effectrules.All), len(All))
	}

	for i, effectRule := range effectrules.All {
		spec := All[i]
		if spec.EffectName != effectRule.Name {
			t.Fatalf("rule %d effect name mismatch: got %q, want %q", i, spec.EffectName, effectRule.Name)
		}
		if spec.HeadlessName != snakeCase(effectRule.Name) {
			t.Fatalf("rule %d headless name mismatch: got %q, want %q", i, spec.HeadlessName, snakeCase(effectRule.Name))
		}
	}
}

func TestSnakeCasePreservesInitialisms(t *testing.T) {
	t.Parallel()

	tests := map[string]string{
		"floatingEffect":                "floating_effect",
		"cryptoRandomUUID":              "crypto_random_uuid",
		"lazyPromiseInEffectSync":       "lazy_promise_in_effect_sync",
		"missingStarInYieldEffectGen":   "missing_star_in_yield_effect_gen",
		"anyUnknownInErrorContext":      "any_unknown_in_error_context",
		"layerMergeAllWithDependencies": "layer_merge_all_with_dependencies",
	}

	for input, expected := range tests {
		if actual := snakeCase(input); actual != expected {
			t.Fatalf("snakeCase(%q) = %q, want %q", input, actual, expected)
		}
	}
}
