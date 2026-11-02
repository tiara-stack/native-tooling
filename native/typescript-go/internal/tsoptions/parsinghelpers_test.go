package tsoptions

import (
	"reflect"
	"strings"
	"testing"

	"github.com/microsoft/typescript-go/internal/core"
)

func TestParseCompilerOptionNoMissingFields(t *testing.T) {
	t.Parallel()
	var missingKeys []string
	for _, field := range reflect.VisibleFields(reflect.TypeFor[core.CompilerOptions]()) {
		if !field.IsExported() {
			continue
		}
		if field.Name == "Effect" {
			// Plugin state is derived from plugins, not a directly parsed option.
			if field.Tag.Get("json") != "-" {
				t.Fatal("derived Effect state must not be serialized as a compiler option")
			}
			for _, name := range []string{"Effect", "effect"} {
				if parseCompilerOptions(name, nil, &core.CompilerOptions{}) {
					t.Fatalf("derived Effect state must not be parsed from %q", name)
				}
			}
			continue
		}

		keyName := field.Name
		// use the JSON key from the tag, if present
		// e.g. `json:"dog[,anythingelse]"` --> dog
		if jsonTag, ok := field.Tag.Lookup("json"); ok {
			keyName = strings.SplitN(jsonTag, ",", 2)[0]
		}
		val := reflect.Zero(field.Type).Interface()
		co := core.CompilerOptions{}
		found := parseCompilerOptions(keyName, val, &co)
		if !found {
			missingKeys = append(missingKeys, keyName)
		}
	}
	if len(missingKeys) > 0 {
		t.Errorf("The following keys are missing entries in the ParseCompilerOptions"+
			" switch statement:\n%v", missingKeys)
	}
}
