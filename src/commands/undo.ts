import * as cp from "child_process"
import { CommandCallback } from '.'
import { CommitPromptExtensionContext } from '../extension'
import * as vscode from 'vscode'

/**
 * Shows a prompt to undo the last commit.
 *
 * @param git GitAPI
 */
export const undo = (extensionContext: CommitPromptExtensionContext): CommandCallback => {
  return async () => {
    const { cwd } = extensionContext 

    if (!cwd) { return }

    const lastMessage = cp.execSync(`git --no-pager log -1 --format=%B`, { cwd }).toString().split('\n')?.[0]

    if (!lastMessage) {
      return
    }

    const result = await vscode.window.showQuickPick(
      [
        {
          label: 'Yes, undo the last commit and keep the changes',
          detail: 'git reset --soft HEAD^',
          picked: true,
        },
        {
          label: 'Yes, undo the last commit and reset the changes',
          detail: 'git reset --hard HEAD^',
          picked: false,
        },
        {
          label: 'No, do not undo the last commit',
          detail: 'Close this prompt',
          picked: false
        }
      ] as vscode.QuickPickItem[],
      {
        title: lastMessage,
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: `Are you sure you want to undo this commit: "${lastMessage}"?`,
      }
    )

    if (result?.label === 'Yes, undo the last commit and keep the changes') {
      try {
        cp.execSync('git reset --soft HEAD^', { cwd })
      } catch (e) {
        console.log('Could not undo the last commit!')
      }
    }

    if (result?.label === 'Yes, undo the last commit and reset the changes') {
      try {
        cp.execSync('git reset --hard HEAD^', { cwd })
      } catch (e) {
        console.log('Could not undo the last commit!')
      }
    }
  }
}

export default undo
