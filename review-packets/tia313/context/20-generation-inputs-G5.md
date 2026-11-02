# Generator input group G5

These current bytes or named source slices feed the producer. Assess the generation relationship with output crosswalks and all five consumer packets.

### `native/patches/typescript-go/001-config-contract.patch`

Mode `100644`, blob `ebe478f05741610098973611a2bb3ff624229317`, SHA256 `474b819fe81da9ddfe5e4a8f24845219d21ddc364fa8e502eca0b0d8987c080b`, 4201 bytes.

Source block 1 representation: `literal-and-json-source-lines-v1`; original language `text`. Decode lines prefixed `@@json-source-line: ` as JSON strings, including their exact line endings. Keep all other lines literal, concatenate in order and review the recovered source.

```text
diff --git a/internal/core/compileroptions.go b/internal/core/compileroptions.go
index 69ca300aea..2053e6bde8 100644
--- a/internal/core/compileroptions.go
+++ b/internal/core/compileroptions.go
@@ -162,7 +162,8 @@ type CompilerOptions struct {
@@json-source-line: " \n"
@@json-source-line: " \t// Effect holds the parsed @effect/language-service plugin configuration.\n"
@@json-source-line: " \t// This field is populated from the plugins array in tsconfig.json during config parsing.\n"
-	Effect *etscore.EffectPluginOptions
+	// Incremental build info persists it separately from user compiler options.
+	Effect *etscore.EffectPluginOptions `json:"-"`
 }
@@json-source-line: " \n"
 // noCopy may be embedded into structs which must not be copied
diff --git a/internal/execute/incremental/effect_options_test.go b/internal/execute/incremental/effect_options_test.go
new file mode 100644
index 0000000000..0af4535aac
--- /dev/null
+++ b/internal/execute/incremental/effect_options_test.go
@@ -0,0 +1,33 @@
+package incremental
+
+import (
+	"testing"
+
+	"github.com/effect-ts/tsgo/etscore"
+	"github.com/microsoft/typescript-go/internal/collections"
+	"github.com/microsoft/typescript-go/internal/core"
+	"github.com/microsoft/typescript-go/internal/json"
+	"gotest.tools/v3/assert"
+)
+
+func TestEffectOptionsSurviveBuildInfoRoundTrip(t *testing.T) {
+	t.Parallel()
+	options := &collections.OrderedMap[string, any]{}
+	options.Set("strict", true)
+	info := &BuildInfo{
+		Options: options,
+		Effect: &etscore.EffectPluginOptions{
+			Diagnostics: true,
+			DiagnosticSeverity: map[string]etscore.Severity{
+				"floatingEffect": etscore.SeverityWarning,
+			},
+		},
+	}
+	encoded, err := json.Marshal(info)
+	assert.NilError(t, err)
+	var restored BuildInfo
+	assert.NilError(t, json.Unmarshal(encoded, &restored))
+	compilerOptions := restored.GetCompilerOptions("")
+	assert.Equal(t, compilerOptions.Strict, core.TSTrue)
+	assert.DeepEqual(t, compilerOptions.Effect, info.Effect)
+}
diff --git a/internal/tsoptions/decls_test.go b/internal/tsoptions/decls_test.go
index be00b470b2..7dc432b4e3 100644
--- a/internal/tsoptions/decls_test.go
+++ b/internal/tsoptions/decls_test.go
@@ -39,6 +39,13 @@ func TestCompilerOptionsDeclaration(t *testing.T) {
@@json-source-line: " \t\tif !field.IsExported() {\n"
@@json-source-line: " \t\t\tcontinue\n"
@@json-source-line: " \t\t}\n"
+		if field.Name == "Effect" {
+			// The plugins declaration supplies derived state, not an Effect flag.
+			if field.Tag.Get("json") != "-" || decls["effect"] != nil {
+				t.Fatal("derived Effect state must not be exposed as a compiler option")
+			}
+			continue
+		}
@@json-source-line: " \n"
@@json-source-line: " \t\tlowerName := strings.ToLower(field.Name)\n"
@@json-source-line: " \n"
diff --git a/internal/tsoptions/parsinghelpers_test.go b/internal/tsoptions/parsinghelpers_test.go
index 555a53c745..1863a74493 100644
--- a/internal/tsoptions/parsinghelpers_test.go
+++ b/internal/tsoptions/parsinghelpers_test.go
@@ -15,6 +15,18 @@ func TestParseCompilerOptionNoMissingFields(t *testing.T) {
@@json-source-line: " \t\tif !field.IsExported() {\n"
@@json-source-line: " \t\t\tcontinue\n"
@@json-source-line: " \t\t}\n"
+		if field.Name == "Effect" {
+			// Plugin state is derived from plugins, not a directly parsed option.
+			if field.Tag.Get("json") != "-" {
+				t.Fatal("derived Effect state must not be serialized as a compiler option")
+			}
+			for _, name := range []string{"Effect", "effect"} {
+				if parseCompilerOptions(name, nil, &core.CompilerOptions{}) {
+					t.Fatalf("derived Effect state must not be parsed from %q", name)
+				}
+			}
+			continue
+		}
@@json-source-line: " \n"
@@json-source-line: " \t\tkeyName := field.Name\n"
@@json-source-line: " \t\t// use the JSON key from the tag, if present\n"
diff --git a/internal/tsoptions/tsconfigparsing.go b/internal/tsoptions/tsconfigparsing.go
index 0bba6462d1..3a612d16f6 100644
--- a/internal/tsoptions/tsconfigparsing.go
+++ b/internal/tsoptions/tsconfigparsing.go
@@ -198,16 +198,6 @@ func parseOwnConfigOfJsonSourceFile(
@@json-source-line: " \tvar rootCompilerOptions []*ast.PropertyName\n"
@@json-source-line: " \tvar errors []*ast.Diagnostic\n"
@@json-source-line: " \n"
-	// If there are parsing errors, return only the first one
-	if len(sourceFile.Diagnostics()) > 0 {
-		return &parsedTsconfig{
-			raw:                &collections.OrderedMap[string, any]{},
-			options:            compilerOptions,
-			typeAcquisition:    typeAcquisition,
-			extendedConfigPath: extendedConfigPath,
-		}, []*ast.Diagnostic{sourceFile.Diagnostics()[0]}
-	}
-
@@json-source-line: " \tonPropertySet := func(\n"
@@json-source-line: " \t\tkeyText string,\n"
@@json-source-line: " \t\tvalue any,\n"
```

### `native/sources.json`

Mode `100644`, blob `198ebe11cf27bb34e46adf042c0ceb277538c991`, SHA256 `65955a791859af5cbd467c021e6bcf71e8c7175d5d61d83a12d99f57f17f395f`, 569 bytes.

```text
{
  "effectTsgo": {
    "version": "0.46.1",
    "repository": "https://github.com/Effect-TS/tsgo",
    "commit": "f1a7cad0292d9d315e7f87694f127f605711d55e"
  },
  "typescriptGo": {
    "version": "7.0.2",
    "repository": "https://github.com/microsoft/typescript-go",
    "commit": "2bd066d87f5bafd315be9f40889d0a60b9e58e0b",
    "typeScriptFixtures": "4d4f005c8541e0255a9d8791205fdce326e462bc"
  },
  "tsgolint": {
    "version": "7.0.2003",
    "repository": "https://github.com/oxc-project/tsgolint",
    "commit": "eb9339115edde6811ca94c3433adf69ea9852880"
  }
}
```

### `native/typescript-go/go.mod`

Mode `100644`, blob `7b558347ea8feae47da8dc8e5aa1391ea1f56edc`, SHA256 `99609eb25dc74df0206ecab2f65191e2fa5bdf01f740534f5348cdea755fd29f`, 15009 bytes.

```text
module github.com/microsoft/typescript-go

go 1.26

require (
	github.com/Microsoft/go-winio v0.6.2
	github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68
	github.com/google/go-cmp v0.7.0
	github.com/mackerelio/go-osstat v0.2.7
	github.com/peter-evans/patience v0.3.0
	github.com/zeebo/xxh3 v1.1.0
	golang.org/x/sync v0.21.0
	golang.org/x/sys v0.46.0
	golang.org/x/term v0.44.0
	golang.org/x/text v0.38.0
	gotest.tools/v3 v3.5.2
)

require (
	github.com/microsoft/TypeScript/tsc/shim/ast v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/astnav v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/bundled v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/checker v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/collections v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/compiler v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/core v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/diagnostics v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/evaluator v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/execute/tsc v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/jsnum v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/ls v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/ls/autoimport v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/ls/change v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/ls/lsconv v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/ls/lsutil v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/lsp/lsproto v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/modulespecifiers v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/packagejson v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/project v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/scanner v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/tsoptions v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/tspath v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/vfs v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/vfs/osvfs v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/ast v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/astnav v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/bundled v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/checker v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/collections v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/compiler v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/core v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/diagnostics v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/evaluator v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/execute/tsc v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/jsnum v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/jsonrpc v0.0.0-00010101000000-000000000000 // indirect
	github.com/microsoft/typescript-go/shim/locale v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/ls v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/ls/autoimport v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/ls/change v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/ls/lsconv v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/ls/lsutil v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/lsp/lsproto v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/module v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/modulespecifiers v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/nodebuilder v0.0.0-00010101000000-000000000000 // indirect
	github.com/microsoft/typescript-go/shim/packagejson v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/printer v0.0.0-00010101000000-000000000000 // indirect
	github.com/microsoft/typescript-go/shim/project v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/project/dirty v0.0.0-00010101000000-000000000000 // indirect
	github.com/microsoft/typescript-go/shim/project/logging v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/scanner v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/sourcemap v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/tracing v0.0.0-00010101000000-000000000000 // indirect
	github.com/microsoft/typescript-go/shim/tsoptions v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/tspath v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/vfs v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/vfs/osvfs v0.0.0 // indirect
)

require (
	github.com/effect-ts/tsgo v0.0.0
	github.com/effect-ts/tsgo/etscore v0.0.0
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/matryer/moq v0.7.1 // indirect
	golang.org/x/mod v0.37.0 // indirect
	golang.org/x/tools v0.47.0 // indirect
)

tool (
	github.com/matryer/moq
	golang.org/x/tools/cmd/stringer
)

ignore (
	./_extension
	./_packages
	./_submodules
	./built
	./coverage
	node_modules
)

replace github.com/microsoft/TypeScript/tsc/shim/api => ./../effect-tsgo/shim/_backport/api

replace github.com/microsoft/TypeScript/tsc/shim/ast => ./../effect-tsgo/shim/_backport/ast

replace github.com/microsoft/TypeScript/tsc/shim/astnav => ./../effect-tsgo/shim/_backport/astnav

replace github.com/microsoft/TypeScript/tsc/shim/bundled => ./../effect-tsgo/shim/_backport/bundled

replace github.com/microsoft/TypeScript/tsc/shim/checker => ./../effect-tsgo/shim/_backport/checker

replace github.com/microsoft/TypeScript/tsc/shim/collections => ./../effect-tsgo/shim/_backport/collections

replace github.com/microsoft/TypeScript/tsc/shim/compiler => ./../effect-tsgo/shim/_backport/compiler

replace github.com/microsoft/TypeScript/tsc/shim/core => ./../effect-tsgo/shim/_backport/core

replace github.com/microsoft/TypeScript/tsc/shim/diagnostics => ./../effect-tsgo/shim/_backport/diagnostics

replace github.com/microsoft/TypeScript/tsc/shim/evaluator => ./../effect-tsgo/shim/_backport/evaluator

replace github.com/microsoft/TypeScript/tsc/shim/execute/tsc => ./../effect-tsgo/shim/_backport/execute/tsc

replace github.com/microsoft/TypeScript/tsc/shim/format => ./../effect-tsgo/shim/_backport/format

replace github.com/microsoft/TypeScript/tsc/shim/fourslash => ./../effect-tsgo/shim/_backport/fourslash

replace github.com/microsoft/TypeScript/tsc/shim/jsnum => ./../effect-tsgo/shim/_backport/jsnum

replace github.com/microsoft/TypeScript/tsc/shim/jsonrpc => ./../effect-tsgo/shim/_backport/jsonrpc

replace github.com/microsoft/TypeScript/tsc/shim/locale => ./../effect-tsgo/shim/_backport/locale

replace github.com/microsoft/TypeScript/tsc/shim/ls/autoimport => ./../effect-tsgo/shim/_backport/ls/autoimport

replace github.com/microsoft/TypeScript/tsc/shim/ls/change => ./../effect-tsgo/shim/_backport/ls/change

replace github.com/microsoft/TypeScript/tsc/shim/ls => ./../effect-tsgo/shim/_backport/ls

replace github.com/microsoft/TypeScript/tsc/shim/ls/lsconv => ./../effect-tsgo/shim/_backport/ls/lsconv

replace github.com/microsoft/TypeScript/tsc/shim/ls/lsutil => ./../effect-tsgo/shim/_backport/ls/lsutil

replace github.com/microsoft/TypeScript/tsc/shim/lsp => ./../effect-tsgo/shim/_backport/lsp

replace github.com/microsoft/TypeScript/tsc/shim/lsp/lsproto => ./../effect-tsgo/shim/_backport/lsp/lsproto

replace github.com/microsoft/TypeScript/tsc/shim/module => ./../effect-tsgo/shim/_backport/module

replace github.com/microsoft/TypeScript/tsc/shim/modulespecifiers => ./../effect-tsgo/shim/_backport/modulespecifiers

replace github.com/microsoft/TypeScript/tsc/shim/nodebuilder => ./../effect-tsgo/shim/_backport/nodebuilder

replace github.com/microsoft/TypeScript/tsc/shim/packagejson => ./../effect-tsgo/shim/_backport/packagejson

replace github.com/microsoft/TypeScript/tsc/shim/parser => ./../effect-tsgo/shim/_backport/parser

replace github.com/microsoft/TypeScript/tsc/shim/printer => ./../effect-tsgo/shim/_backport/printer

replace github.com/microsoft/TypeScript/tsc/shim/project/dirty => ./../effect-tsgo/shim/_backport/project/dirty

replace github.com/microsoft/TypeScript/tsc/shim/project => ./../effect-tsgo/shim/_backport/project

replace github.com/microsoft/TypeScript/tsc/shim/project/logging => ./../effect-tsgo/shim/_backport/project/logging

replace github.com/microsoft/TypeScript/tsc/shim/repo => ./../effect-tsgo/shim/_backport/repo

replace github.com/microsoft/TypeScript/tsc/shim/scanner => ./../effect-tsgo/shim/_backport/scanner

replace github.com/microsoft/TypeScript/tsc/shim/sourcemap => ./../effect-tsgo/shim/_backport/sourcemap

replace github.com/microsoft/TypeScript/tsc/shim/testrunner => ./../effect-tsgo/shim/_backport/testrunner

replace github.com/microsoft/TypeScript/tsc/shim/testutil/baseline => ./../effect-tsgo/shim/_backport/testutil/baseline

replace github.com/microsoft/TypeScript/tsc/shim/testutil => ./../effect-tsgo/shim/_backport/testutil

replace github.com/microsoft/TypeScript/tsc/shim/testutil/harnessutil => ./../effect-tsgo/shim/_backport/testutil/harnessutil

replace github.com/microsoft/TypeScript/tsc/shim/testutil/lsptestutil => ./../effect-tsgo/shim/_backport/testutil/lsptestutil

replace github.com/microsoft/TypeScript/tsc/shim/testutil/tsbaseline => ./../effect-tsgo/shim/_backport/testutil/tsbaseline

replace github.com/microsoft/TypeScript/tsc/shim/tracing => ./../effect-tsgo/shim/_backport/tracing

replace github.com/microsoft/TypeScript/tsc/shim/tsoptions => ./../effect-tsgo/shim/_backport/tsoptions

replace github.com/microsoft/TypeScript/tsc/shim/tspath => ./../effect-tsgo/shim/_backport/tspath

replace github.com/microsoft/TypeScript/tsc/shim/vfs/cachedvfs => ./../effect-tsgo/shim/_backport/vfs/cachedvfs

replace github.com/microsoft/TypeScript/tsc/shim/vfs => ./../effect-tsgo/shim/_backport/vfs

replace github.com/microsoft/TypeScript/tsc/shim/vfs/iovfs => ./../effect-tsgo/shim/_backport/vfs/iovfs

replace github.com/microsoft/TypeScript/tsc/shim/vfs/osvfs => ./../effect-tsgo/shim/_backport/vfs/osvfs

replace github.com/microsoft/TypeScript/tsc/shim/vfs/vfstest => ./../effect-tsgo/shim/_backport/vfs/vfstest

replace github.com/microsoft/typescript-go/shim/api => ./../effect-tsgo/shim/api

replace github.com/microsoft/typescript-go/shim/ast => ./../effect-tsgo/shim/ast

replace github.com/microsoft/typescript-go/shim/astnav => ./../effect-tsgo/shim/astnav

replace github.com/microsoft/typescript-go/shim/bundled => ./../effect-tsgo/shim/bundled

replace github.com/microsoft/typescript-go/shim/checker => ./../effect-tsgo/shim/checker

replace github.com/microsoft/typescript-go/shim/collections => ./../effect-tsgo/shim/collections

replace github.com/microsoft/typescript-go/shim/compiler => ./../effect-tsgo/shim/compiler

replace github.com/microsoft/typescript-go/shim/core => ./../effect-tsgo/shim/core

replace github.com/microsoft/typescript-go/shim/diagnostics => ./../effect-tsgo/shim/diagnostics

replace github.com/microsoft/typescript-go/shim/evaluator => ./../effect-tsgo/shim/evaluator

replace github.com/microsoft/typescript-go/shim/execute/tsc => ./../effect-tsgo/shim/execute/tsc

replace github.com/microsoft/typescript-go/shim/format => ./../effect-tsgo/shim/format

replace github.com/microsoft/typescript-go/shim/fourslash => ./../effect-tsgo/shim/fourslash

replace github.com/microsoft/typescript-go/shim/jsnum => ./../effect-tsgo/shim/jsnum

replace github.com/microsoft/typescript-go/shim/jsonrpc => ./../effect-tsgo/shim/jsonrpc

replace github.com/microsoft/typescript-go/shim/locale => ./../effect-tsgo/shim/locale

replace github.com/microsoft/typescript-go/shim/ls/autoimport => ./../effect-tsgo/shim/ls/autoimport

replace github.com/microsoft/typescript-go/shim/ls/change => ./../effect-tsgo/shim/ls/change

replace github.com/microsoft/typescript-go/shim/ls => ./../effect-tsgo/shim/ls

replace github.com/microsoft/typescript-go/shim/ls/lsconv => ./../effect-tsgo/shim/ls/lsconv

replace github.com/microsoft/typescript-go/shim/ls/lsutil => ./../effect-tsgo/shim/ls/lsutil

replace github.com/microsoft/typescript-go/shim/lsp => ./../effect-tsgo/shim/lsp

replace github.com/microsoft/typescript-go/shim/lsp/lsproto => ./../effect-tsgo/shim/lsp/lsproto

replace github.com/microsoft/typescript-go/shim/module => ./../effect-tsgo/shim/module

replace github.com/microsoft/typescript-go/shim/modulespecifiers => ./../effect-tsgo/shim/modulespecifiers

replace github.com/microsoft/typescript-go/shim/nodebuilder => ./../effect-tsgo/shim/nodebuilder

replace github.com/microsoft/typescript-go/shim/packagejson => ./../effect-tsgo/shim/packagejson

replace github.com/microsoft/typescript-go/shim/parser => ./../effect-tsgo/shim/parser

replace github.com/microsoft/typescript-go/shim/printer => ./../effect-tsgo/shim/printer

replace github.com/microsoft/typescript-go/shim/project/dirty => ./../effect-tsgo/shim/project/dirty

replace github.com/microsoft/typescript-go/shim/project => ./../effect-tsgo/shim/project

replace github.com/microsoft/typescript-go/shim/project/logging => ./../effect-tsgo/shim/project/logging

replace github.com/microsoft/typescript-go/shim/repo => ./../effect-tsgo/shim/repo

replace github.com/microsoft/typescript-go/shim/scanner => ./../effect-tsgo/shim/scanner

replace github.com/microsoft/typescript-go/shim/sourcemap => ./../effect-tsgo/shim/sourcemap

replace github.com/microsoft/typescript-go/shim/testrunner => ./../effect-tsgo/shim/testrunner

replace github.com/microsoft/typescript-go/shim/testutil/baseline => ./../effect-tsgo/shim/testutil/baseline

replace github.com/microsoft/typescript-go/shim/testutil => ./../effect-tsgo/shim/testutil

replace github.com/microsoft/typescript-go/shim/testutil/harnessutil => ./../effect-tsgo/shim/testutil/harnessutil

replace github.com/microsoft/typescript-go/shim/testutil/lsptestutil => ./../effect-tsgo/shim/testutil/lsptestutil

replace github.com/microsoft/typescript-go/shim/testutil/tsbaseline => ./../effect-tsgo/shim/testutil/tsbaseline

replace github.com/microsoft/typescript-go/shim/tracing => ./../effect-tsgo/shim/tracing

replace github.com/microsoft/typescript-go/shim/tsoptions => ./../effect-tsgo/shim/tsoptions

replace github.com/microsoft/typescript-go/shim/tspath => ./../effect-tsgo/shim/tspath

replace github.com/microsoft/typescript-go/shim/vfs/cachedvfs => ./../effect-tsgo/shim/vfs/cachedvfs

replace github.com/microsoft/typescript-go/shim/vfs => ./../effect-tsgo/shim/vfs

replace github.com/microsoft/typescript-go/shim/vfs/iovfs => ./../effect-tsgo/shim/vfs/iovfs

replace github.com/microsoft/typescript-go/shim/vfs/osvfs => ./../effect-tsgo/shim/vfs/osvfs

replace github.com/microsoft/typescript-go/shim/vfs/vfstest => ./../effect-tsgo/shim/vfs/vfstest

replace github.com/effect-ts/tsgo => ./../effect-tsgo

replace github.com/effect-ts/tsgo/etscore => ./../effect-tsgo/etscore
```

### `native/typescript-go/go.sum`

Mode `100644`, blob `7c8a1974076241193c4724077abac9f0b71288f5`, SHA256 `f56e1eb56cc1f61c3801f862a4afa26f4b43295436eb405228bedb0f7e707468`, 2871 bytes.

```text
github.com/Microsoft/go-winio v0.6.2 h1:F2VQgta7ecxGYO8k3ZZz3RS8fVIXVxONVUPlNERoyfY=
github.com/Microsoft/go-winio v0.6.2/go.mod h1:yd8OoFMLzJbo9gZq8j5qaps8bJ9aShtEA8Ipt1oGCvU=
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68 h1:KZaTBSyshWX3MP5jukJcNSuXDQTO+rNpt0J564dX/eg=
github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68/go.mod h1:tphK2c80bpPhMOI4v6bIc2xWywPfbqi1Z06+RcrMkDg=
github.com/google/go-cmp v0.7.0 h1:wk8382ETsv4JYUZwIsn6YpYiWiBsYLSJiTsyBybVuN8=
github.com/google/go-cmp v0.7.0/go.mod h1:pXiqmnSA92OHEEa9HXL2W4E7lf9JzCmGVUdgjX3N/iU=
github.com/klauspost/cpuid/v2 v2.2.10 h1:tBs3QSyvjDyFTq3uoc/9xFpCuOsJQFNPiAhYdw2skhE=
github.com/klauspost/cpuid/v2 v2.2.10/go.mod h1:hqwkgyIinND0mEev00jJYCxPNVRVXFQeu1XKlok6oO0=
github.com/mackerelio/go-osstat v0.2.7 h1:TCavZi10wF49bT6iQZ9eT2keGZQpC69MTDfdJej5e94=
github.com/mackerelio/go-osstat v0.2.7/go.mod h1:dwpYh5pIPmvk+IEwBKNIWRFMB92mrC08CmXOhDC7nQk=
github.com/matryer/moq v0.7.1 h1:/QaXqMAdOrLqlshW2z7SMS21jDi7aVrbW0wJrR+hhJk=
github.com/matryer/moq v0.7.1/go.mod h1:IabIiFkaKCyHxej25INgFR+fnOxSZFMv2LYrU+ioyDs=
github.com/peter-evans/patience v0.3.0 h1:rX0JdJeepqdQl1Sk9c9uvorjYYzL2TfgLX1adqYm9cA=
github.com/peter-evans/patience v0.3.0/go.mod h1:Kmxu5sY1NmBLFSStvXjX1wS9mIv7wMcP/ubucyMOAu0=
github.com/pmezard/go-difflib v1.0.0 h1:4DBwDE0NGyQoBHbLQYPwSUPoCMWR5BEzIk/f1lZbAQM=
github.com/pmezard/go-difflib v1.0.0/go.mod h1:iKH77koFhYxTK1pcRnkKkqfTogsbg7gZNVY4sRDYZ/4=
github.com/zeebo/assert v1.3.0 h1:g7C04CbJuIDKNPFHmsk4hwZDO5O+kntRxzaUoNXj+IQ=
github.com/zeebo/assert v1.3.0/go.mod h1:Pq9JiuJQpG8JLJdtkwrJESF0Foym2/D9XMU5ciN/wJ0=
github.com/zeebo/xxh3 v1.1.0 h1:s7DLGDK45Dyfg7++yxI0khrfwq9661w9EN78eP/UZVs=
github.com/zeebo/xxh3 v1.1.0/go.mod h1:IisAie1LELR4xhVinxWS5+zf1lA4p0MW4T+w+W07F5s=
golang.org/x/mod v0.37.0 h1:vF1DjpVEshcIqoEaauuHebaLk1O1forxjxBaVn884JQ=
golang.org/x/mod v0.37.0/go.mod h1:m8S8VeM9r4dzDwjrKO0a1sZP3YjeMamRRlD+fmR2Q/0=
golang.org/x/sync v0.21.0 h1:HLII4xRRTtCRkxYp4HNFF0Js/Og6q2i++KXbg0gHCwM=
golang.org/x/sync v0.21.0/go.mod h1:9xrNwdLfx4jkKbNva9FpL6vEN7evnE43NNNJQ2LF3+0=
golang.org/x/sys v0.46.0 h1:noSf2Fq6F8DBgS+LysIkx7rIExoNHJsxOAtPp4rthXw=
golang.org/x/sys v0.46.0/go.mod h1:4GL1E5IUh+htKOUEOaiffhrAeqysfVGipDYzABqnCmw=
golang.org/x/term v0.44.0 h1:0rLvDRCtNj0gZkyIXhCyOb2OAzEhLVqc4B+hrsBhrmc=
golang.org/x/term v0.44.0/go.mod h1:7ze4MdzUzLXpSAoFP1H0bOI9aXDqveSvatT5vKcFh2Y=
golang.org/x/text v0.38.0 h1:sXmwo9DwP3OK9EZ7PqAdaooSGozfl/3a6/xJcbzPRhE=
golang.org/x/text v0.38.0/go.mod h1:YXZt3QhHUKYT53r2lLKFIVi6Ao1jdzrTR/KQ09qyxF4=
golang.org/x/tools v0.47.0 h1:7Kn5x/d1svx/PzryTsqeoZN4TZwqeH5pGWjefhLi/1Q=
golang.org/x/tools v0.47.0/go.mod h1:dFHnyTvFWY212G+h7ZY4Vsp/K3U4/7W9TyVaAul8uCA=
gotest.tools/v3 v3.5.2 h1:7koQfIKdy+I8UTetycgUqXWSDwpgv193Ka+qRsmBY8Q=
gotest.tools/v3 v3.5.2/go.mod h1:LtdLGcnqToBH83WByAAi/wiwSFCArdFIUV/xxN4pcjA=
```

### `native/typescript-go/internal/core/compileroptions.go`

Mode `100644`, blob `2053e6bde8410df3c87d1b3bed9b01d21442744e`, SHA256 `44f931dfc954b17a2a693ef2ab0bc5116d98745dab403dd9699b5a2c7f765f1d`, 27885 bytes.

Current source lines 161-171, excerpt SHA256 `380ae6829e9b3f839869a6c13e71f002c448215b6099cbc348f4711cb0c66449`.

```text
	Checkers       *int     `json:"checkers,omitzero"`

	// Effect holds the parsed @effect/language-service plugin configuration.
	// This field is populated from the plugins array in tsconfig.json during config parsing.
	// Incremental build info persists it separately from user compiler options.
	Effect *etscore.EffectPluginOptions `json:"-"`
}

// noCopy may be embedded into structs which must not be copied
// after the first use.
//
```

### `native/typescript-go/internal/tsoptions/tsconfigparsing.go`

Mode `100644`, blob `3a612d16f69c0488711dab9c412be65fffdfadef`, SHA256 `331894b8f85ed8b9251bb7f7367f8ec0db1ba7d1f536b36aa6c49ea43015d809`, 74611 bytes.

Current source lines 182-198, excerpt SHA256 `9ae7be359449a0d5e53f388f48b04ae7e132cd7a0f1e361ef608e9d641038d4a`.

```text
	// watchOptions *core.WatchOptions
	typeAcquisition *core.TypeAcquisition
	// Note that the case of the config path has not yet been normalized, as no files have been imported into the project yet
	extendedConfigPath any
}

func parseOwnConfigOfJsonSourceFile(
	sourceFile *ast.SourceFile,
	host ParseConfigHost,
	basePath string,
	configFileName string,
) (*parsedTsconfig, []*ast.Diagnostic) {
	compilerOptions := getDefaultCompilerOptions(configFileName)
	typeAcquisition := getDefaultTypeAcquisition(configFileName)
	// var watchOptions *compiler.WatchOptions
	var extendedConfigPath any
	var rootCompilerOptions []*ast.PropertyName
```
