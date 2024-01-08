import * as vscode from 'vscode'
import type { API as GitAPI, GitExtension } from '../typings/git.d'

/**
 * Return the editor Git instance.
 */
export function getGit(): GitAPI | undefined {
  const gitExtension = vscode.extensions.getExtension<GitExtension>(
    'vscode.git',
  )?.exports

  if (!gitExtension) {
    return undefined
  }

  const api: GitAPI = gitExtension.getAPI(1)

  return api
}

export default getGit
