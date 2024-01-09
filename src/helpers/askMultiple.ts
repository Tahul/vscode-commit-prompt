import * as vscode from 'vscode'
import { getCwd } from './getCwd'
import type { Question } from './defaultCommitQuestions'

/**
 * Ask to pick between multiple file changes from Git current tree.
 * Picked = added to next commit
 * Unpicked = not in next commit
 */
export async function askMultiple(
  items: vscode.QuickPickItem[],
  question?: Question,
  onDidChangeSelection?: (
    value: readonly vscode.QuickPickItem[],
    quickpick: vscode.QuickPick<vscode.QuickPickItem>
  ) => void,
): Promise<vscode.QuickPickItem[]> {
  const cwd = getCwd()

  if (!cwd) { return [] }

  const quickpick = vscode.window.createQuickPick()

  quickpick.title = question?.title
  quickpick.placeholder = question?.placeHolder
  quickpick.items = items
  quickpick.canSelectMany = true
  quickpick.ignoreFocusOut = true
  quickpick.matchOnDescription = true
  quickpick.matchOnDetail = true
  quickpick.selectedItems = items.filter(item => item.picked)
  if (onDidChangeSelection) quickpick.onDidChangeSelection((values) => onDidChangeSelection(values, quickpick))

  quickpick.show()

  const picks = await new Promise<readonly vscode.QuickPickItem[] | undefined>((resolve, reject) => {
    quickpick.onDidAccept(() => {
      resolve(quickpick.selectedItems)
    })

    quickpick.onDidHide(() => {
      resolve(undefined)
    })
  })

  quickpick.dispose()

  if (!picks) { return [] }

  if (picks === undefined) {
    throw new Error('Input escaped, selection cancelled.')
  }

  return picks.map(pick => ({ ...pick }))
}

export default askMultiple
