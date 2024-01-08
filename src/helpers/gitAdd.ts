import * as cp from "child_process"
import * as fs from "fs"
import { Change } from "../typings/git"
import { getCwd } from "./getCwd"

export const gitAdd = async (
  change: Change | string
): Promise<void> => {
  const rootPath = getCwd()

  if (!rootPath) { return }

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git add ${typeof change === 'string' ? change : change.uri.path}`, { cwd })
}

export default gitAdd
