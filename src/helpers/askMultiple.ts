import * as vscode from 'vscode'
import { getCwd } from './getCwd'
import type { Question } from './defaultCommitQuestions'

/**
 * Ask to pick between multiple file changes from Git current tree.
 * Picked = added to next commit
 * Unpicked = not in next commit
 */
export async function askMultiple(items: vscode.QuickPickItem[], question?: Question): Promise<vscode.QuickPickItem[]> {
  const cwd = getCwd()

  if (!cwd) { return [] }

  const pickOptions: vscode.QuickPickOptions = {
    title: question?.title,
    placeHolder: question?.placeHolder,
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
    canPickMany: true,
  }

  const picks = await vscode.window.showQuickPick(
    items,
    pickOptions,
  ) as vscode.QuickPickItem[] | undefined

  if (!picks) { return [] }

  if (picks === undefined) {
    throw new Error('Input escaped, selection cancelled.')
  }

  return picks
}

export default askMultiple
