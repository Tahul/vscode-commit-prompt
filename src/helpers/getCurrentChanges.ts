import { API as GitAPI, Change, Repository } from '../typings/git'
import * as cp from "child_process"
import { Status } from '../typings/git'
import * as fs from "fs"
import * as vscode from 'vscode'
import { join } from 'path'
import { getCwd } from './getCwd'

export type IndexChangeType = 'index' | 'working' | 'merge' | 'untracked'

export interface IndexChange {
  type: IndexChangeType
  change: Change
}

/**
 * Return the current branch changes.
 *
 * @param git GitAPI
 */
export const getCurrentChanges = async (
  git: GitAPI
): Promise<IndexChange[]> => {
  const rootPath = getCwd()

  if (!rootPath) { return [] }

  const cwd = fs.realpathSync(rootPath)

  const repo: Repository = git.repositories[0]

  const indexChanges: Change[] = repo.state.indexChanges

  const workingTreeChanges: Change[] = repo.state.workingTreeChanges

  const mergeChanges: Change[] = repo.state.mergeChanges

  const untrackedChanges: Change[] = cp.execSync('git ls-files --others --exclude-standard', { cwd })
    .toString()
    .split('\n')
    .filter(Boolean)
    .map((path) => {
      const uri = vscode.Uri.from({ scheme: 'file', path: join(cwd, path) })
      return {
        status: Status.UNTRACKED,
        originalUri: uri,
        uri,
        renameUri: uri
      }
    })

  const changes: IndexChange[] = [
    ...indexChanges.map<IndexChange>((change: any) => {
      return {
        change,
        type: 'index',
      }
    }),
    ...workingTreeChanges.map<IndexChange>((change: any) => {
      return {
        change,
        type: 'working',
      }
    }),
    ...mergeChanges.map<IndexChange>((change: any) => {
      return {
        change,
        type: 'merge',
      }
    }),
    ...untrackedChanges.map<IndexChange>((change: any) => {
      return {
        change,
        type: 'untracked'
      }
    }),
  ]

  return changes
}
