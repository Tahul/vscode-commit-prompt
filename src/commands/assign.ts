import * as vscode from 'vscode'
import type { CommitPromptExtensionContext } from '../extension'
import type { CommandCallback } from '.'
import { detailsFromIssue } from '../helpers/issueAsQuickPickItem'

/**
 * Shows a prompt to undo the last commit.
 */
export function assign(
  extensionContext: CommitPromptExtensionContext,
  page: number | undefined = 1
): CommandCallback {
  return async () => {
    const { octoKit, user, cwd, repo, outputMessage, cpCodeConfig } = extensionContext

    if (!octoKit || !user?.login || !repo) {
      outputMessage('You do not seem properly logged into GitHub, try setting your `commit-prompt.gitHubToken` first.')
      return
    }

    if (!cwd) { return }

    const issues = await octoKit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        state: 'open',
        direction: 'desc',
        per_page: cpCodeConfig?.githubPerPage || 25,
        page
      },
    )

    if (!issues.data.length) {
      outputMessage('There is no opened issues in that repository.')
      return
    }

    const issuesAsQuickPickItem: vscode.QuickPickItem[] = issues.data.map((issue) => {
      return {
        label: issue.title,
        description: issue.number.toString(),
        detail: detailsFromIssue(issue),
        picked: !!issue.assignees?.find(assignee => assignee.login === user.login),
      }
    })

    const picks = await vscode.window.showQuickPick(
      [
        ...(page > 1 ? [{ label: `Previous page`, description: (page - 1 >= 1 ? page - 1 : 1).toString(), iconPath: vscode.ThemeIcon.Folder }] : []),
        ...issuesAsQuickPickItem,
        ...(issuesAsQuickPickItem.length === cpCodeConfig.githubPerPage ? [{ label: 'Next page', description: (page + 1).toString(), iconPath: vscode.ThemeIcon.Folder }] : []),
      ],
      {
        title: `Assign myself to issues${page > 1 ? ` (Page ${page})` : ''}`,
        canPickMany: true,
        ignoreFocusOut: true,
        placeHolder: 'Assign yourself to issues',
      },
    )

    if (!picks || !picks.length) { return }

    if (picks.find(pick => pick.label === 'Next page')) {
      return await assign(extensionContext, page + 1)()
    }

    if (picks.find(pick => pick.label === 'Previous page')) {
      return await assign(extensionContext, page - 1 >= 1 ? page - 1 : 1)()
    }

    const successFullyAssigned: string[] = []
    const errorWhileAssigned: string[] = []

    for (const pick of picks) {
      if (!pick.description) { continue }

      try {
        await octoKit.request(
          'POST /repos/{owner}/{repo}/issues/{issue_number}/assignees',
          {
            issue_number: Number(pick.description),
            owner: repo.split('/')[0],
            repo: repo.split('/')[1],
            assignees: [user.login],
          },
        )

        successFullyAssigned.push(pick.description)
      }
      catch (e) {
        errorWhileAssigned.push(pick.description)
      }
    }

    if (successFullyAssigned.length) {
      outputMessage(`Successfully assigned you to issues: ${successFullyAssigned.join(', ')}`)
    }

    if (errorWhileAssigned.length) {
      outputMessage(`There was an error while assigning you issues: ${errorWhileAssigned.join(', ')}`)
    }
  }
}

export default assign
