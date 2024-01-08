import * as cp from "child_process"
import * as fs from "fs"
import { getCwd } from "./getCwd"

export const gitPush = async (): Promise<void> => {
  const rootPath = getCwd()

  if (!rootPath) { return }

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git push`, { cwd })
}

export default gitPush
