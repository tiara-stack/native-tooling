import * as NodeServices from "@effect/platform-node/NodeServices"
import * as Effect from "effect/Effect"
import * as Command from "effect/cli/Command"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ensureIntegrationSelected, integrationFlags } from "../src/cli/integrationFlags.js"
import type { PatchOptions } from "../src/patcher/index.js"

const fullPatchCommand = vi.hoisted((): {
  readonly programs: Array<Effect.Effect<unknown, unknown>>
  readonly requests: Array<PatchOptions>
} => ({ programs: [], requests: [] }))

vi.mock("@effect/platform-node/NodeRuntime", () => ({
  runMain: () => (program: Effect.Effect<unknown, unknown>) => {
    fullPatchCommand.programs.push(program)
  }
}))

vi.mock("../src/patcher/index.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("../src/patcher/index.js")>()
  const RuntimeEffect = await import("effect/Effect")
  return {
    ...original,
    patch: (options: PatchOptions) => RuntimeEffect.sync(() => {
      fullPatchCommand.requests.push(options)
      // Stop at the patch boundary; this test exercises the actual
      // root command and parser without patching any installed binaries.
      return { changed: [], skipped: [] }
    })
  }
})

const parseIntegrationFlags = async (args: ReadonlyArray<string>) => {
  let result: { readonly typescript: boolean; readonly oxlint: boolean } | undefined
  const command = Command.make("patch", integrationFlags).pipe(
    Command.withHandler((flags) => Effect.sync(() => result = flags))
  )
  await Effect.runPromise(
    Command.runWith(command, { version: "test" })(args).pipe(Effect.provide(NodeServices.layer))
  )
  return result
}

describe("integration flags", () => {
  it("patches only TypeScript by default", async () => {
    await expect(parseIntegrationFlags([])).resolves.toEqual({ typescript: true, oxlint: false })
  })

  it("adds Oxlint without disabling TypeScript", async () => {
    await expect(parseIntegrationFlags(["--oxlint"]))
      .resolves.toEqual({ typescript: true, oxlint: true })
  })

  it("supports selecting only Oxlint", async () => {
    await expect(parseIntegrationFlags(["--no-typescript", "--oxlint"]))
      .resolves.toEqual({ typescript: false, oxlint: true })
  })

  it("rejects disabling every integration", async () => {
    await expect(Effect.runPromise(ensureIntegrationSelected(false, false)))
      .rejects.toThrow("Select at least one integration")
  })
})

describe("full patch command", () => {
  const originalArgv = process.argv

  afterEach(() => {
    process.argv = originalArgv
    fullPatchCommand.programs.length = 0
    fullPatchCommand.requests.length = 0
    vi.resetModules()
  })

  it.each([
    ["omitted compatibility flag", ["patch"], undefined],
    ["integration flags only", ["patch", "--typescript", "--no-oxlint"], undefined],
    ["package selection only", ["patch", "--typescript-package", "@effect/tsgo"], "@effect/tsgo"],
    ["explicit positive compatibility flag", ["patch", "--force"], undefined],
    ["explicit negative compatibility flag", ["patch", "--no-force"], undefined]
  ])("reaches the patch handler with %s", async (_name, args, preferredTypescriptPackage) => {
    process.argv = [process.execPath, "effect-tsgo", ...args]
    vi.resetModules()
    await import("../src/cli/index.js")

    expect(fullPatchCommand.programs).toHaveLength(1)
    await Effect.runPromiseExit(fullPatchCommand.programs[0])
    expect(fullPatchCommand.requests).toEqual([{
      cwd: process.cwd(),
      components: new Set(["typescript"]),
      preferredTypescriptPackage,
      skipMissing: false
    }])
  })
})
