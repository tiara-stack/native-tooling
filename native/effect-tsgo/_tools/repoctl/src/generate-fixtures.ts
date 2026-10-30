import * as NodeServices from "@effect/platform-node/NodeServices"
import * as Effect from "effect/Effect"
import { fileURLToPath } from "node:url"
import { ensureEffectFixtures } from "./fixtures.ts"

const repositoryRoot = fileURLToPath(new URL("../../..", import.meta.url))
await Effect.runPromise(ensureEffectFixtures(repositoryRoot).pipe(Effect.provide(NodeServices.layer)))
