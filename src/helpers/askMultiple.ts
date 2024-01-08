import * as vscode from 'vscode'
import { Change, Status } from '../typings/git'
import { IndexChange, IndexChangeType } from './getCurrentChanges'
import { getCwd } from './getCwd'
import { Question } from './defaultCommitQuestions'

/**
 * Ask to pick between multiple file changes from Git current tree.
 * Picked = added to next commit
 * Unpicked = not in next commit
 *
 * @param changes
 */
export const askMultiple = async (
  items: vscode.QuickPickItem[],
  question?: Question,
): Promise<vscode.QuickPickItem[]> => {
  const cwd = getCwd()

  if (!cwd) { return [] }

  const pickOptions: vscode.QuickPickOptions = {
    title: question?.title,
    placeHolder: question?.placeHolder,
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
    canPickMany: true,
    onDidSelectItem: (item: vscode.QuickPickItem) => {
      //
    },
  }

  const picks = await vscode.window.showQuickPick(
    items,
    pickOptions
  ) as vscode.QuickPickItem[] | undefined

  if (!picks) {return []}


  if (picks === undefined) {
    throw new Error('Input escaped, selection cancelled.')
  }

  return picks
}

export default askMultiple
