package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	// Import Effect hooks to register via init()
	_ "github.com/effect-ts/tsgo/etscheckerhooks" // checker diagnostics hooks
	"github.com/effect-ts/tsgo/etsdiagnostics"
	_ "github.com/effect-ts/tsgo/etsexecutehooks" // exit-code filtering hooks
	_ "github.com/effect-ts/tsgo/etslshooks"      // LS codefix hooks

	"github.com/microsoft/typescript-go/internal/core"
	"github.com/microsoft/typescript-go/internal/execute"
)

func main() {
	os.Exit(runMain())
}

func runMain() int {
	core.ApplyDebugStackLimit()
	args := os.Args[1:]
	if len(args) > 0 {
		switch args[0] {
		case "--lsp":
			return runLSP(args[1:])
		case "--api":
			return runAPI(args[1:])
		case "--effect-cli-diagnostics":
			return etsdiagnostics.Run(context.Background(), args[1:], os.Stdout, os.Stderr)
		}
	}
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	result := execute.CommandLine(ctx, newSystem(), args, nil)
	return int(result.Status)
}
