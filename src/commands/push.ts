import * as cp from 'child_process'
    
import * as vscode from 'vscode'
import { CommitPromptExtensionContext } from '../extension'
import { CommandCallback } from '.'
import gitPush from '../helpers/gitPush'

/**
 * Shows a prompt to undo the last commit.
 *
 * @param git GitAPI
 */
export const push = (extensionContext: CommitPromptExtensionContext): CommandCallback => {
  return async () => {
    const { cwd } = extensionContext

    if (!cwd) { return }

    const commits: string[] = cp
      .execSync('git log origin/main..HEAD --oneline | cat', { cwd })
      .toString()
      .split('\n')
      .filter(Boolean)
    
    console.log({ commits })

    const items: vscode.QuickPickItem[] = commits.map(commit => {
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
          picked: false
        },
        {
          label: '',
          kind: vscode.QuickPickItemKind.Separator
        },
        ...items
      ] as vscode.QuickPickItem[],
      {
        title: 'Push 🚀',
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: `Push commits`,
      }
    )


    if (result && result.label === 'Push') { await gitPush() }
  }
}

export default push