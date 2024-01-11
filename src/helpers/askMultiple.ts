import * as vscode from 'vscode'
import { getCwd } from './getCwd'
import type { Question } from './defaultCommitQuestions'

function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * Ask to pick between multiple file changes from Git current tree.
 * Picked = added to next commit
 * Unpicked = not in next commit
 */
export async function askMultiple(
  items: vscode.QuickPickItem[] | Promise<vscode.QuickPickItem[]>,
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
  
  quickpick.canSelectMany = true
  quickpick.ignoreFocusOut = true
  quickpick.matchOnDescription = true
  quickpick.matchOnDetail = true
  if (onDidChangeSelection) { quickpick.onDidChangeSelection(values => onDidChangeSelection(values, quickpick)) }

  quickpick.show()
  
  if (!isPromise(items)) {
    quickpick.items = items as vscode.QuickPickItem[]
    quickpick.selectedItems = quickpick.items.filter(item => item.picked)
  } else {
    (items as Promise<vscode.QuickPickItem[]>).then(items => {
      quickpick.items = items
      quickpick.selectedItems = quickpick.items.filter(item => item.picked)
    })
  }

  const picks = await new Promise<readonly vscode.QuickPickItem[] | undefined>((resolve) => {
    quickpick.onDidAccept(() => {
      resolve(quickpick.selectedItems)
    })

    quickpick.onDidHide(() => {
      resolve(undefined)
    })
  })

  quickpick.dispose()

  if (!picks?.length && question?.required) { throw new Error('Required input escaped!') }

  if (!picks?.length) { return [] }

  return picks.map(pick => ({ ...pick }))
}

export default askMultiple
