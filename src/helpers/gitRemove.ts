import * as cp from 'node:child_process'
import * as fs from 'node:fs'
import type { Change, API as GitAPI, Repository } from '../typings/git'
import { getCwd } from './getCwd'

export async function gitRemove(change?: Change | string): Promise<void> {
  const rootPath = getCwd()

  if (!rootPath) { return }

  const cwd = fs.realpathSync(rootPath)

  if (change) { cp.execSync(`git reset ${typeof change === 'string' ? change : change.uri.path}`, { cwd }) }
  else { cp.execSync(`git reset`, { cwd }) }
}

export default gitRemove
