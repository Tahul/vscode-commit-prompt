import * as cp from 'node:child_process'
import * as fs from 'node:fs'
import { getCwd } from './getCwd'

export async function gitCommit(message: string): Promise<void> {
  const rootPath = getCwd()

  if (!rootPath) { return }

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git commit -m "${message}"`, { cwd })
}

export default gitCommit
