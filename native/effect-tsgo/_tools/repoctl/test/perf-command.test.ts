import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import type { PerfOptions } from "../src/perf.ts"

test("performance comparison parses the actual repository command", async(t) => {
  const originalArgv = process.argv
  const programs: Array<Effect.Effect<unknown, unknown>> = []
  const requests: Array<PerfOptions> = []
  const probes: Array<{ command: string; args: ReadonlyArray<string> }> = []
  const manifestText = readFileSync(new URL("../../../_packages/tsgo/upstream.json", import.meta.url), "utf8")
  const manifest = JSON.parse(manifestText) as { tags: { typescript: { latest: string; next: string } } }
  const stoppedAtBenchmark = new Error("Stopped at the benchmark process boundary")
  const stopProcess = (command: string, _cwd: string, args: ReadonlyArray<string>) =>
    Effect.suspend(() => {
      probes.push({ command, args })
      return Effect.fail(stoppedAtBenchmark)
    })

  t.mock.module("@effect/platform-node/NodeRuntime", {
    namedExports: { runMain: (program: Effect.Effect<unknown, unknown>) => programs.push(program) }
  })
  const processModule = await import("../src/process.ts")
  t.mock.module(new URL("../src/process.ts", import.meta.url), {
    namedExports: {
      ...processModule,
      runCommand: stopProcess,
      runCommandCapture: stopProcess,
      runCommandCaptureSplit: stopProcess,
      runCommandString: stopProcess
    }
  })
  const perfModule = await import("../src/perf.ts")
  const fileSystem = FileSystem.makeNoop({
    exists: () => Effect.succeed(true),
    makeDirectory: () => Effect.void,
    readFileString: () => Effect.succeed(manifestText)
  })
  t.mock.module(new URL("../src/perf.ts", import.meta.url), {
    namedExports: {
      ...perfModule,
      comparePerformance: (repositoryRoot: string, options: PerfOptions) => Effect.suspend(() => {
        requests.push(options)
        // Keep the real version validation and selection, but make filesystem
        // writes inert and stop before any compiler, network or Git process.
        return perfModule.comparePerformance(repositoryRoot, options).pipe(
          Effect.provideService(FileSystem.FileSystem, fileSystem)
        )
      })
    }
  })

  try {
    await import("../src/main.ts")
    assert.equal(programs.length, 1)

    const version = manifest.tags.typescript.latest
    for (const { name, flags, latest, selected } of [
      { name: "default next selection", flags: [], latest: false, selected: manifest.tags.typescript.next },
      { name: "explicit version without latest", flags: ["--version", version], latest: false, selected: version },
      { name: "explicit latest selection", flags: ["--latest"], latest: true, selected: manifest.tags.typescript.latest },
      { name: "explicit negative latest", flags: ["--no-latest"], latest: false, selected: manifest.tags.typescript.next },
      { name: "explicit version and negative latest", flags: ["--version", version, "--no-latest"], latest: false, selected: version }
    ]) {
      await t.test(name, async() => {
        requests.length = 0
        probes.length = 0
        process.argv = [process.execPath, "repoctl", "perf", "compare", "example-project", ...flags]
        await assert.rejects(Effect.runPromise(programs[0]), /Stopped at the benchmark process boundary/)
        assert.equal(requests.length, 1)
        assert.equal(requests[0].latest, latest)
        assert.equal(requests[0].target, "example-project")
        assert.equal(requests[0].version, flags.includes("--version") ? version : undefined)
        assert.ok(probes.some(({ command, args }) => command === "pnpm" &&
          args.join(" ") === `--silent --package typescript@${selected} dlx tsc --version`))
      })
    }

    await t.test("latest and explicit version retain the consumer rejection", async() => {
      requests.length = 0
      probes.length = 0
      process.argv = [process.execPath, "repoctl", "perf", "compare", "example-project", "--latest", "--version", version]
      await assert.rejects(Effect.runPromise(programs[0]), /--latest and --version cannot be used together/)
      assert.equal(requests.length, 1)
      assert.equal(probes.length, 0)
    })
  } finally {
    process.argv = originalArgv
  }
})
