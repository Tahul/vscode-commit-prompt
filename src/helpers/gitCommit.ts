import * as cp from "child_process"
import * as fs from "fs"
import { getCwd } from "./getCwd"

export const gitCommit = async (message: string): Promise<void> => {
  const rootPath = getCwd()

  if (!rootPath) {return}

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git commit -m "${message}"`, { cwd })
}

export default gitCommit
