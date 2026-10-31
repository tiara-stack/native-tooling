module github.com/effect-ts/tsgo/tsgolint

go 1.26.0

replace (
	github.com/microsoft/typescript-go/shim/ast => ./../effect-tsgo/shim/ast
	github.com/microsoft/typescript-go/shim/bundled => ./../effect-tsgo/shim/bundled
	github.com/microsoft/typescript-go/shim/checker => ./../effect-tsgo/shim/checker
	github.com/microsoft/typescript-go/shim/compiler => ./../effect-tsgo/shim/compiler
	github.com/microsoft/typescript-go/shim/core => ./../effect-tsgo/shim/core
	github.com/microsoft/typescript-go/shim/jsnum => ./../effect-tsgo/shim/jsnum
	github.com/microsoft/typescript-go/shim/lsp/lsproto => ./../effect-tsgo/shim/lsp/lsproto
	github.com/microsoft/typescript-go/shim/parser => ./../effect-tsgo/shim/parser
	github.com/microsoft/typescript-go/shim/project => ./../effect-tsgo/shim/project
	github.com/microsoft/typescript-go/shim/scanner => ./../effect-tsgo/shim/scanner
	github.com/microsoft/typescript-go/shim/tsoptions => ./../effect-tsgo/shim/tsoptions
	github.com/microsoft/typescript-go/shim/tspath => ./../effect-tsgo/shim/tspath
	github.com/microsoft/typescript-go/shim/vfs => ./../effect-tsgo/shim/vfs
	github.com/microsoft/typescript-go/shim/vfs/cachedvfs => ./../effect-tsgo/shim/vfs/cachedvfs
	github.com/microsoft/typescript-go/shim/vfs/osvfs => ./../effect-tsgo/shim/vfs/osvfs
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
	golang.org/x/sys v0.48.0
	golang.org/x/tools v0.50.0
	gotest.tools/v3 v3.5.2
)

require (
	github.com/google/go-cmp v0.7.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/mackerelio/go-osstat v0.2.7 // indirect
	github.com/microsoft/TypeScript/tsc/shim/ast v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/checker v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/collections v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/core v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/diagnostics v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/evaluator v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/jsnum v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/packagejson v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/scanner v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/tsoptions v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/tspath v0.0.0 // indirect
	github.com/microsoft/TypeScript/tsc/shim/vfs v0.0.0 // indirect
	github.com/microsoft/typescript-go v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/collections v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/diagnostics v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/evaluator v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/locale v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/nodebuilder v0.0.0-00010101000000-000000000000 // indirect
	github.com/microsoft/typescript-go/shim/packagejson v0.0.0 // indirect
	github.com/microsoft/typescript-go/shim/printer v0.0.0-00010101000000-000000000000 // indirect
	github.com/microsoft/typescript-go/shim/tracing v0.0.0-00010101000000-000000000000 // indirect
	github.com/zeebo/xxh3 v1.1.0 // indirect
	golang.org/x/mod v0.41.0 // indirect
	golang.org/x/sync v0.23.0 // indirect
)

require (
	github.com/dlclark/regexp2/v2 v2.8.0
	github.com/effect-ts/tsgo v0.0.0
	github.com/effect-ts/tsgo/etscore v0.0.0
	github.com/go-json-experiment/json v0.0.0-20260820222146-c27c302e5fc3
	golang.org/x/text v0.42.0
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

replace github.com/microsoft/typescript-go/shim/astnav => ./../effect-tsgo/shim/astnav

replace github.com/microsoft/typescript-go/shim/collections => ./../effect-tsgo/shim/collections

replace github.com/microsoft/typescript-go/shim/diagnostics => ./../effect-tsgo/shim/diagnostics

replace github.com/microsoft/typescript-go/shim/evaluator => ./../effect-tsgo/shim/evaluator

replace github.com/microsoft/typescript-go/shim/execute/tsc => ./../effect-tsgo/shim/execute/tsc

replace github.com/microsoft/typescript-go/shim/format => ./../effect-tsgo/shim/format

replace github.com/microsoft/typescript-go/shim/fourslash => ./../effect-tsgo/shim/fourslash

replace github.com/microsoft/typescript-go/shim/jsonrpc => ./../effect-tsgo/shim/jsonrpc

replace github.com/microsoft/typescript-go/shim/locale => ./../effect-tsgo/shim/locale

replace github.com/microsoft/typescript-go/shim/ls/autoimport => ./../effect-tsgo/shim/ls/autoimport

replace github.com/microsoft/typescript-go/shim/ls/change => ./../effect-tsgo/shim/ls/change

replace github.com/microsoft/typescript-go/shim/ls => ./../effect-tsgo/shim/ls

replace github.com/microsoft/typescript-go/shim/ls/lsconv => ./../effect-tsgo/shim/ls/lsconv

replace github.com/microsoft/typescript-go/shim/ls/lsutil => ./../effect-tsgo/shim/ls/lsutil

replace github.com/microsoft/typescript-go/shim/lsp => ./../effect-tsgo/shim/lsp

replace github.com/microsoft/typescript-go/shim/module => ./../effect-tsgo/shim/module

replace github.com/microsoft/typescript-go/shim/modulespecifiers => ./../effect-tsgo/shim/modulespecifiers

replace github.com/microsoft/typescript-go/shim/nodebuilder => ./../effect-tsgo/shim/nodebuilder

replace github.com/microsoft/typescript-go/shim/packagejson => ./../effect-tsgo/shim/packagejson

replace github.com/microsoft/typescript-go/shim/printer => ./../effect-tsgo/shim/printer

replace github.com/microsoft/typescript-go/shim/project/dirty => ./../effect-tsgo/shim/project/dirty

replace github.com/microsoft/typescript-go/shim/project/logging => ./../effect-tsgo/shim/project/logging

replace github.com/microsoft/typescript-go/shim/repo => ./../effect-tsgo/shim/repo

replace github.com/microsoft/typescript-go/shim/sourcemap => ./../effect-tsgo/shim/sourcemap

replace github.com/microsoft/typescript-go/shim/testrunner => ./../effect-tsgo/shim/testrunner

replace github.com/microsoft/typescript-go/shim/testutil/baseline => ./../effect-tsgo/shim/testutil/baseline

replace github.com/microsoft/typescript-go/shim/testutil => ./../effect-tsgo/shim/testutil

replace github.com/microsoft/typescript-go/shim/testutil/harnessutil => ./../effect-tsgo/shim/testutil/harnessutil

replace github.com/microsoft/typescript-go/shim/testutil/lsptestutil => ./../effect-tsgo/shim/testutil/lsptestutil

replace github.com/microsoft/typescript-go/shim/testutil/tsbaseline => ./../effect-tsgo/shim/testutil/tsbaseline

replace github.com/microsoft/typescript-go/shim/tracing => ./../effect-tsgo/shim/tracing

replace github.com/microsoft/typescript-go/shim/vfs/iovfs => ./../effect-tsgo/shim/vfs/iovfs

replace github.com/microsoft/typescript-go/shim/vfs/vfstest => ./../effect-tsgo/shim/vfs/vfstest

replace github.com/microsoft/typescript-go => ./../typescript-go

replace github.com/effect-ts/tsgo => ./../effect-tsgo

replace github.com/effect-ts/tsgo/etscore => ./../effect-tsgo/etscore
