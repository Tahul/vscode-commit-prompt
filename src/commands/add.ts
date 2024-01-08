import * as vscode from 'vscode'
import type { CommitPromptExtensionContext } from '../extension'
import askMultiple from '../helpers/askMultiple'
import type { IndexChange, IndexChangeType } from '../helpers/getCurrentChanges'
import { getCurrentChanges } from '../helpers/getCurrentChanges'
import { gitAdd } from '../helpers/gitAdd'
import { gitRemove } from '../helpers/gitRemove'
import type { Change, Repository } from '../typings/git'
import { Status } from '../typings/git'
import type { CommandCallback } from './'

function getFileTypeName(type: IndexChangeType) {
  const typesMap = {
    index: 'Staged Changes',
    working: 'Changes',
    merge: 'Merge',
    untracked: 'Untracked Changes',
  }

  return typesMap[type]
}

/**
 * Cast Change[] into a vscode.QuickPickItem[].
 */
function castIndexChangesToQuickPickItems(changes: IndexChange[], cwd: string): vscode.QuickPickItem[] {
  const rawChanges: vscode.QuickPickItem[] = [
    {
      label: 'Add all',
      description: 'git add .',
      detail: cwd,
      iconPath: vscode.ThemeIcon.Folder,
      picked: true,
    },
  ]

  return [
    ...rawChanges,
    ...changes.map(
      (file: IndexChange): vscode.QuickPickItem => {
        return {
          label: file.change.uri.path.split('/').pop() || file.change.uri.path,
          description: getFileTypeName(file.type),
          detail: file.change.uri.path,
          iconPath: vscode.ThemeIcon.File,
          picked: [
            Status.INDEX_MODIFIED,
            Status.INDEX_DELETED,
            Status.INDEX_ADDED,
            Status.INDEX_COPIED,
            Status.INDEX_RENAMED,
            Status.ADDED_BY_US,
            Status.ADDED_BY_THEM,
            Status.BOTH_ADDED,
          ].includes(file.change.status),
        }
      },
    ),
  ]
}

/**
 * Show a multi pick prompt with modified files.
 * Picked = added to next commit
 * Unpicked = not added to next commit
 */
export function add(extensionContext: CommitPromptExtensionContext): CommandCallback {
  return async () => {
    const { git, outputMessage, cwd } = extensionContext

    if (!cwd) { return false }

    const repo: Repository = git.repositories[0]

    let addedChanges: Change[] | 'all' = []

    try {
      const changes = await getCurrentChanges(git)

      if (!changes.length) {
        outputMessage('No current changes!')
        return false
      }

      const picks = await askMultiple(castIndexChangesToQuickPickItems(changes, cwd))

      if (picks?.[0]?.description === 'git add .') {
        addedChanges = 'all'
      }
      else {
        for (const pick of picks) {
          const changeFromPick = changes.find((file: IndexChange): boolean => {
            return pick.detail === file.change.uri.path
          })

          if (changeFromPick) {
            addedChanges.push(changeFromPick.change)
          }
        }
      }

      // Skip following code if `all` is picked
      if (addedChanges === 'all') {
        await gitAdd('.')
        return true
      }
    }
    catch (e) {
      outputMessage('Cancelling commit prompt.')
      return false
    }

    // Get added changes
    const { indexChanges } = repo.state

    // Remove unpicked files
    for (const change of indexChanges) {
      if (
        !addedChanges.find((pickedChange: Change): boolean => {
          return pickedChange.uri.fsPath === change.uri.fsPath
        })
      ) {
        await gitRemove(git, repo, change)
      }
    }

    // Add picked ones
    for (const pick of addedChanges) {
      await gitAdd(pick)
    }

    return addedChanges.length > 0
  }
}

export default add
