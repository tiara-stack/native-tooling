package effectlint

import (
	"context"
	"fmt"
	"unicode"

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
	specs := make([]RuleSpec, 0, len(effectrules.All))
	for _, effectRule := range effectrules.All {
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

		diagnostics, err := effectrunner.Run(ctx, program, c, file, effectConfig, []string{effectName})
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
		if unicode.IsUpper(current) {
			if i > 0 {
				previous := runes[i-1]
				var next rune
				if i+1 < len(runes) {
					next = runes[i+1]
				}
				if unicode.IsLower(previous) || unicode.IsDigit(previous) || (unicode.IsUpper(previous) && next != 0 && unicode.IsLower(next)) {
					result = append(result, '_')
				}
			}
			current = unicode.ToLower(current)
		}
		result = append(result, current)
	}
	return string(result)
}
