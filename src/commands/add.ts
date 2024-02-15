import { join } from 'node:path'
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
function castIndexChangesToQuickPickItems(
  changes: IndexChange[],
  cwd: string,
  addAllByDefault: boolean = false,
): vscode.QuickPickItem[] {
  const added = []

  const fileChanges = [
    ...changes.map(
      (file: IndexChange): vscode.QuickPickItem => {
        const picked = addAllByDefault || [
          Status.INDEX_MODIFIED,
          Status.INDEX_DELETED,
          Status.INDEX_ADDED,
          Status.INDEX_COPIED,
          Status.INDEX_RENAMED,
        ].includes(file.change.status)

        if (picked) { added.push(file) }

        return {
          label: file.change.uri.path.split('/').pop() || file.change.uri.path,
          description: getFileTypeName(file.type),
          detail: file.change.uri.path.replace(cwd, ''),
          iconPath: vscode.ThemeIcon.File,
          picked,
        }
      },
    ),
  ]

  return [
    {
      label: 'Add all',
      description: 'git add .',
      detail: cwd,
      iconPath: vscode.ThemeIcon.Folder,
      picked: addAllByDefault || added.length === fileChanges.length,
    },
    {
      kind: vscode.QuickPickItemKind.Separator,
      label: 'Changes',
    },
    ...fileChanges,
  ]
}

/**
 * Show a multi pick prompt with modified files.
 * Picked = added to next commit
 * Unpicked = not added to next commit
 */
export function add(
  extensionContext: CommitPromptExtensionContext,
  sync: boolean = true
): CommandCallback {
  return async () => {
    const { git, outputMessage, cwd, cpCodeConfig } = extensionContext

    if (!cwd) { return }

    // Sync git
    if (sync) await vscode.commands.executeCommand('git.refresh')

    const repo: Repository = git.repositories[0]

    const addedChanges: Change[] | 'all' = []

    try {
      const changes = await getCurrentChanges(git)

      if (!changes.length) {
        outputMessage('No current changes!')
        return
      }

      const changesItems = castIndexChangesToQuickPickItems(changes, cwd, cpCodeConfig.addAllByDefault)

      const picks = await askMultiple(
        changesItems,
        {
          name: 'files',
          title: 'Add files to your commit',
          placeHolder: 'Add files to your next commit by picking them.',
          type: 'multiple',
        },
        (items, quickpick) => {
          const rootChangeItem = changesItems.find(item => item.label === 'Add all')!
          const addedChangeItem = items.find(item => item.label === 'Add all')

          if (
            !rootChangeItem.picked
            && addedChangeItem
          ) {
            rootChangeItem.picked = true
            quickpick.selectedItems = quickpick.items
            return
          }

          if (
            addedChangeItem
            && (quickpick.selectedItems.length - 1) < changes.length
          ) {
            rootChangeItem.picked = false
            quickpick.selectedItems = quickpick.selectedItems.filter(item => item.label !== 'Add all')
            return
          }

          if (
            quickpick.selectedItems.find(item => item.label !== 'Add all')
            && rootChangeItem.picked
            && !addedChangeItem
          ) {
            rootChangeItem.picked = false
            quickpick.selectedItems = []
            return
          }

          if (
            !rootChangeItem.picked
            && quickpick.selectedItems.length === changes.length
          ) {
            rootChangeItem.picked = true
            quickpick.selectedItems = [
              rootChangeItem as vscode.QuickPickItem,
              ...quickpick.selectedItems,
            ]
          }
        },
      )

      if (picks.find(pick => pick.description === 'git add .')) {
        try {
          await gitAdd('.')
          outputMessage(`Added all (${changes.length}) changes.`)
        }
        catch (e) {
          outputMessage('Could not git add all files.', e)
          return
        }
        return ['all']
      }
      else {
        for (const pick of picks) {
          const changeFromPick = changes.find((file: IndexChange): boolean => {
            return join(cwd, pick?.detail || '') === file.change.uri.path
          })

          if (changeFromPick) {
            addedChanges.push(changeFromPick.change)
          }
        }
      }
    }
    catch (e) {
      outputMessage('Cancelling commit prompt.')
      return
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
        try {
          await gitRemove(change)
        }
        catch (e) {
          outputMessage(`Could git remove ${change.uri.fsPath}`, e)
        }
      }
    }

    // Add picked ones
    for (const pick of addedChanges) {
      try {
        await gitAdd(pick)
      }
      catch (e) {
        outputMessage(`Could not git add file ${pick.uri.fsPath}`, e)
      }
    }

    return addedChanges
  }
}

export default add
