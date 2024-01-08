import * as cp from 'node:child_process'
import { getCwd } from './getCwd'

export function getRepoName() {
  const cwd = getCwd()

  if (!cwd) { return }

  const remoteUrl = cp.execSync('git remote get-url origin', { cwd }).toString()

  const regex = /https:\/\/[^/]+\/([^/]+\/[^/.]+)(?:\.git)?|git@[^:]+:([^/]+\/[^/.]+)(?:\.git)?/

  const match = remoteUrl.match(regex)

  if (match && match[1]) {
    return match[1] as `${string}/${string}`
  }
}
