import * as cp from 'node:child_process'
import * as fs from 'node:fs'
import type { Change, API as GitAPI, Repository } from '../typings/git'
import { getCwd } from './getCwd'

export async function gitRemove(git: GitAPI, repo: Repository, change: Change): Promise<void> {
  const rootPath = getCwd()

  if (!rootPath) { return }

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git reset ${change.uri.path}`, { cwd })
}

export default gitRemove
