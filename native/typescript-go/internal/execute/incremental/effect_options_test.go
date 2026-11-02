package incremental

import (
	"testing"

	"github.com/effect-ts/tsgo/etscore"
	"github.com/microsoft/typescript-go/internal/collections"
	"github.com/microsoft/typescript-go/internal/core"
	"github.com/microsoft/typescript-go/internal/json"
	"gotest.tools/v3/assert"
)

func TestEffectOptionsSurviveBuildInfoRoundTrip(t *testing.T) {
	t.Parallel()
	options := &collections.OrderedMap[string, any]{}
	options.Set("strict", true)
	info := &BuildInfo{
		Options: options,
		Effect: &etscore.EffectPluginOptions{
			Diagnostics: true,
			DiagnosticSeverity: map[string]etscore.Severity{
				"floatingEffect": etscore.SeverityWarning,
			},
		},
	}
	encoded, err := json.Marshal(info)
	assert.NilError(t, err)
	var restored BuildInfo
	assert.NilError(t, json.Unmarshal(encoded, &restored))
	compilerOptions := restored.GetCompilerOptions("")
	assert.Equal(t, compilerOptions.Strict, core.TSTrue)
	assert.DeepEqual(t, compilerOptions.Effect, info.Effect)
}
