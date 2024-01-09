import * as cp from 'node:child_process'

import * as vscode from 'vscode'
import type { CommitPromptExtensionContext } from '../extension'
import gitPush from '../helpers/gitPush'
import type { CommandCallback } from '.'

/**
 * Shows a prompt to undo the last commit.
 */
export function push(extensionContext: CommitPromptExtensionContext): CommandCallback {
  return async () => {
    const { cwd, outputMessage } = extensionContext

    if (!cwd) { return }

    const commits: string[] = cp
      .execSync('git log origin/main..HEAD --oneline | cat', { cwd })
      .toString()
      .split('\n')
      .filter(Boolean)

    const items: vscode.QuickPickItem[] = commits.map((commit) => {
      return {
        label: commit,
        picked: true,
        alwaysShow: true,
        iconPath: vscode.ThemeIcon.File,
      }
    })

    const result = await vscode.window.showQuickPick(
      [
        {
          label: 'Push',
          detail: 'git push',
          picked: true,
        },
        {
          label: 'Cancel',
          detail: 'Close the prompt',
          picked: false,
        },
        {
          label: '',
          kind: vscode.QuickPickItemKind.Separator,
        },
        ...items,
      ] as vscode.QuickPickItem[],
      {
        title: 'Push 🚀',
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'Push commits',
      },
    )

    if (result && result.label === 'Push') {
      try {
        await gitPush()
      }
      catch (e) {
        outputMessage('Could not git push.', e)
      }
    }
  }
}

export default push
