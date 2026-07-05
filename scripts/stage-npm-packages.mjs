import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const tag = process.env.NPM_TAG ?? "latest"
const dryRun = process.env.NPM_STAGE_DRY_RUN === "true"

const packageDirs = [
  "packages/effect-vitest",
  "packages/oxlint-effect",
  "packages/tsgo-effect",
  "packages/tsgolint-effect",
  "packages/vite-plus",
]

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (process.env.GITHUB_ACTIONS) {
  console.log(
    `GitHub OIDC env: url=${process.env.ACTIONS_ID_TOKEN_REQUEST_URL ? "set" : "unset"} token=${
      process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN ? "set" : "unset"
    }`,
  )
}

const packageExists = (name, version) => {
  const result = spawnSync("npm", ["view", `${name}@${version}`, "version", "--json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  })

  return result.status === 0
}

for (const dir of packageDirs) {
  const packageDir = resolve(dir)
  const packageJson = JSON.parse(readFileSync(resolve(packageDir, "package.json"), "utf8"))

  if (packageJson.private) {
    continue
  }

  const { name, version } = packageJson
  if (typeof name !== "string" || typeof version !== "string") {
    continue
  }

  if (packageExists(name, version)) {
    console.log(`Skipping ${name}@${version}; version already exists on npm.`)
    continue
  }

  const args = [
    "stage",
    "publish",
    ".",
    "--access",
    "public",
    "--provenance",
    "--loglevel",
    "verbose",
    "--tag",
    tag,
  ]

  if (dryRun) {
    args.push("--dry-run")
  }

  console.log(`Staging ${name}@${version}${dryRun ? " (dry run)" : ""}.`)
  run("npm", args, { cwd: packageDir })
}
