import * as cp from 'node:child_process'
import * as vscode from 'vscode'
import type { CommitPromptExtensionContext } from '../extension'
import type { CommandCallback } from '.'

/**
 * Shows a prompt to undo the last commit.
 */
export function undo(extensionContext: CommitPromptExtensionContext): CommandCallback {
  return async () => {
    const { cwd, outputMessage } = extensionContext

    if (!cwd) { return }

    const lastMessage = cp.execSync('git --no-pager log -1 --format=%B', { cwd }).toString().split('\n')?.[0]

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
          picked: false,
        },
      ] as vscode.QuickPickItem[],
      {
        title: lastMessage,
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: `Are you sure you want to undo this commit: "${lastMessage}"?`,
      },
    )

    if (result?.label === 'Yes, undo the last commit and keep the changes') {
      try {
        cp.execSync('git reset --soft HEAD^', { cwd })
      }
      catch (e) {
        outputMessage('Could not undo the last commit!')
      }
    }

    if (result?.label === 'Yes, undo the last commit and reset the changes') {
      try {
        cp.execSync('git reset --hard HEAD^', { cwd })
      }
      catch (e) {
        outputMessage('Could not undo the last commit!')
      }
    }
  }
}

export default undo
