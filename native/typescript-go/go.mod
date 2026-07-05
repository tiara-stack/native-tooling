module github.com/microsoft/typescript-go

go 1.26

require (
	github.com/Microsoft/go-winio v0.6.2
	github.com/effect-ts/tsgo/etscore v0.0.0
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
	github.com/effect-ts/tsgo v0.0.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/matryer/moq v0.7.1 // indirect
	github.com/microsoft/typescript-go/shim/collections v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/testutil/baseline v0.0.0-00010101000000-000000000000 // indirect
	golang.org/x/mod v0.37.0 // indirect
	golang.org/x/tools v0.47.0 // indirect
)

tool (
	github.com/matryer/moq
	golang.org/x/tools/cmd/stringer
)

replace github.com/effect-ts/tsgo => ../effect-tsgo

replace github.com/effect-ts/tsgo/etscore => ../effect-tsgo/etscore

replace (
	github.com/microsoft/typescript-go/shim/api => ../effect-tsgo/shim/api
	github.com/microsoft/typescript-go/shim/ast => ../effect-tsgo/shim/ast
	github.com/microsoft/typescript-go/shim/astnav => ../effect-tsgo/shim/astnav
	github.com/microsoft/typescript-go/shim/bundled => ../effect-tsgo/shim/bundled
	github.com/microsoft/typescript-go/shim/checker => ../effect-tsgo/shim/checker
	github.com/microsoft/typescript-go/shim/collections => ../effect-tsgo/shim/collections
	github.com/microsoft/typescript-go/shim/compiler => ../effect-tsgo/shim/compiler
	github.com/microsoft/typescript-go/shim/core => ../effect-tsgo/shim/core
	github.com/microsoft/typescript-go/shim/diagnostics => ../effect-tsgo/shim/diagnostics
	github.com/microsoft/typescript-go/shim/execute/tsc => ../effect-tsgo/shim/execute/tsc
	github.com/microsoft/typescript-go/shim/format => ../effect-tsgo/shim/format
	github.com/microsoft/typescript-go/shim/fourslash => ../effect-tsgo/shim/fourslash
	github.com/microsoft/typescript-go/shim/ls => ../effect-tsgo/shim/ls
	github.com/microsoft/typescript-go/shim/ls/autoimport => ../effect-tsgo/shim/ls/autoimport
	github.com/microsoft/typescript-go/shim/ls/change => ../effect-tsgo/shim/ls/change
	github.com/microsoft/typescript-go/shim/ls/lsconv => ../effect-tsgo/shim/ls/lsconv
	github.com/microsoft/typescript-go/shim/ls/lsutil => ../effect-tsgo/shim/ls/lsutil
	github.com/microsoft/typescript-go/shim/lsp => ../effect-tsgo/shim/lsp
	github.com/microsoft/typescript-go/shim/lsp/lsproto => ../effect-tsgo/shim/lsp/lsproto
	github.com/microsoft/typescript-go/shim/module => ../effect-tsgo/shim/module
	github.com/microsoft/typescript-go/shim/modulespecifiers => ../effect-tsgo/shim/modulespecifiers
	github.com/microsoft/typescript-go/shim/packagejson => ../effect-tsgo/shim/packagejson
	github.com/microsoft/typescript-go/shim/parser => ../effect-tsgo/shim/parser
	github.com/microsoft/typescript-go/shim/project => ../effect-tsgo/shim/project
	github.com/microsoft/typescript-go/shim/project/logging => ../effect-tsgo/shim/project/logging
	github.com/microsoft/typescript-go/shim/repo => ../effect-tsgo/shim/repo
	github.com/microsoft/typescript-go/shim/scanner => ../effect-tsgo/shim/scanner
	github.com/microsoft/typescript-go/shim/sourcemap => ../effect-tsgo/shim/sourcemap
	github.com/microsoft/typescript-go/shim/testrunner => ../effect-tsgo/shim/testrunner
	github.com/microsoft/typescript-go/shim/testutil => ../effect-tsgo/shim/testutil
	github.com/microsoft/typescript-go/shim/testutil/baseline => ../effect-tsgo/shim/testutil/baseline
	github.com/microsoft/typescript-go/shim/testutil/harnessutil => ../effect-tsgo/shim/testutil/harnessutil
	github.com/microsoft/typescript-go/shim/testutil/tsbaseline => ../effect-tsgo/shim/testutil/tsbaseline
	github.com/microsoft/typescript-go/shim/tsoptions => ../effect-tsgo/shim/tsoptions
	github.com/microsoft/typescript-go/shim/tspath => ../effect-tsgo/shim/tspath
	github.com/microsoft/typescript-go/shim/vfs => ../effect-tsgo/shim/vfs
	github.com/microsoft/typescript-go/shim/vfs/cachedvfs => ../effect-tsgo/shim/vfs/cachedvfs
	github.com/microsoft/typescript-go/shim/vfs/iovfs => ../effect-tsgo/shim/vfs/iovfs
	github.com/microsoft/typescript-go/shim/vfs/osvfs => ../effect-tsgo/shim/vfs/osvfs
	github.com/microsoft/typescript-go/shim/vfs/vfsmatch => ../effect-tsgo/shim/vfs/vfsmatch
	github.com/microsoft/typescript-go/shim/vfs/vfstest => ../effect-tsgo/shim/vfs/vfstest
)

ignore (
	./_extension
	./_packages
	./_submodules
	./built
	./coverage
	node_modules
)
