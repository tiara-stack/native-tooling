import { addPath, info } from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
import { join } from "node:path";
import type { Inputs } from "./types.js";
import { DISPLAY_NAME, PACKAGE_NAME } from "./types.js";

export async function installVitePlus(inputs: Inputs): Promise<void> {
  const { version } = inputs;
  const packageSpec = `${PACKAGE_NAME}@${version}`;

  info(`Installing ${packageSpec}...`);
  await exec("npm", ["install", "--global", packageSpec]);

  await ensureGlobalNpmBinInPath();
  info(`Installed ${DISPLAY_NAME} from ${packageSpec}`);
}

async function ensureGlobalNpmBinInPath(): Promise<void> {
  const prefix = (
    await getExecOutput("npm", ["prefix", "--global"], { silent: true })
  ).stdout.trim();
  const binDir = process.platform === "win32" ? prefix : join(prefix, "bin");
  if (!process.env.PATH?.split(process.platform === "win32" ? ";" : ":").includes(binDir)) {
    addPath(binDir);
  }
}
