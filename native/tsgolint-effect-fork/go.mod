module github.com/effect-ts/tsgo/tsgolint

go 1.26

replace (
	github.com/microsoft/typescript-go/shim/ast => ./shim/ast
	github.com/microsoft/typescript-go/shim/bundled => ./shim/bundled
	github.com/microsoft/typescript-go/shim/checker => ./shim/checker
	github.com/microsoft/typescript-go/shim/compiler => ./shim/compiler
	github.com/microsoft/typescript-go/shim/core => ./shim/core
	github.com/microsoft/typescript-go/shim/jsnum => ./shim/jsnum
	github.com/microsoft/typescript-go/shim/lsp/lsproto => ./shim/lsp/lsproto
	github.com/microsoft/typescript-go/shim/parser => ./shim/parser
	github.com/microsoft/typescript-go/shim/project => ./shim/project
	github.com/microsoft/typescript-go/shim/scanner => ./shim/scanner
	github.com/microsoft/typescript-go/shim/tsoptions => ./shim/tsoptions
	github.com/microsoft/typescript-go/shim/tspath => ./shim/tspath
	github.com/microsoft/typescript-go/shim/vfs => ./shim/vfs
	github.com/microsoft/typescript-go/shim/vfs/cachedvfs => ./shim/vfs/cachedvfs
	github.com/microsoft/typescript-go/shim/vfs/osvfs => ./shim/vfs/osvfs
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
	golang.org/x/sys v0.46.0
	golang.org/x/tools v0.47.0
	gotest.tools/v3 v3.5.2
)

require (
	github.com/google/go-cmp v0.7.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/mackerelio/go-osstat v0.2.7 // indirect
	github.com/microsoft/typescript-go v0.0.0 // indirect
	github.com/zeebo/xxh3 v1.1.0 // indirect
	golang.org/x/mod v0.37.0 // indirect
	golang.org/x/sync v0.21.0 // indirect
)

require (
	github.com/dlclark/regexp2/v2 v2.2.2
	github.com/effect-ts/tsgo v0.0.0
	github.com/effect-ts/tsgo/etscore v0.0.0
	github.com/go-json-experiment/json v0.0.0-20260623181947-01eb4420fa68
	github.com/microsoft/typescript-go/shim/collections v0.0.0
	github.com/microsoft/typescript-go/shim/diagnostics v0.0.0
	github.com/microsoft/typescript-go/shim/packagejson v0.0.0
	github.com/microsoft/typescript-go/shim/vfs/vfsmatch v0.0.0
	golang.org/x/text v0.38.0
)

replace github.com/effect-ts/tsgo => ../effect-tsgo

replace github.com/microsoft/typescript-go => ../typescript-go

replace github.com/microsoft/typescript-go/shim/collections => ./shim/collections

replace github.com/microsoft/typescript-go/shim/diagnostics => ./shim/diagnostics

replace github.com/effect-ts/tsgo/etscore => ../effect-tsgo/etscore

replace github.com/microsoft/typescript-go/shim/packagejson => ./shim/packagejson

replace github.com/microsoft/typescript-go/shim/vfs/vfsmatch => ./shim/vfs/vfsmatch
