import * as cp from 'node:child_process'
import * as fs from 'node:fs'
import type { Change } from '../typings/git'
import { getCwd } from './getCwd'

export async function gitAdd(change: Change | string): Promise<void> {
  const rootPath = getCwd()

  if (!rootPath) { return }

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git add ${typeof change === 'string' ? change : change.uri.path}`, { cwd })
}

export default gitAdd
