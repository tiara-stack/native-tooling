package effectlint

import (
	"testing"

	effectrule "github.com/effect-ts/tsgo/internal/rule"
	effectrules "github.com/effect-ts/tsgo/internal/rules"
)

func TestPublicRulesRemainAvailable(t *testing.T) {
	t.Parallel()

	if len(All) != 82 {
		t.Fatalf("expected the 82 established public rules, got %d", len(All))
	}
	seen := make(map[string]bool, len(All))
	for _, spec := range All {
		if seen[spec.HeadlessName] {
			t.Fatalf("duplicate public rule %q", spec.HeadlessName)
		}
		seen[spec.HeadlessName] = true
		if effectrule.ByName(effectrules.All, spec.EffectName) == nil {
			t.Fatalf("public rule %q is absent from the selected language service", spec.EffectName)
		}
		if spec.HeadlessName != snakeCase(spec.EffectName) {
			t.Fatalf("headless name %q does not match %q", spec.HeadlessName, spec.EffectName)
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
