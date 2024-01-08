import * as cp from "child_process"
import * as fs from "fs"
import { API as GitAPI, Change, Repository } from "../typings/git"
import { getCwd } from "./getCwd"

export const gitRemove = async (
  git: GitAPI,
  repo: Repository,
  change: Change
): Promise<void> => {
  const rootPath = getCwd()

  if (!rootPath) { return }

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git reset ${change.uri.path}`, { cwd })
}

export default gitRemove
