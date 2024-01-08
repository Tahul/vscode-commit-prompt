import * as vscode from 'vscode'
import { CommitPromptExtensionContext } from '../extension'
import { CommandCallback } from '.'

/**
 * Shows a prompt to undo the last commit.
 *
 * @param git GitAPI
 */
export const assign = (extensionContext: CommitPromptExtensionContext): CommandCallback => {
  return async () => {
    const { octoKit, user, cwd, repo, outputMessage, cpCodeConfig } = extensionContext

    if (!cwd || !octoKit || !user?.login || !repo) { return }

    const issues = await octoKit.request(
      `GET /repos/{owner}/{repo}/issues`,
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        state: 'open',
        direction: 'desc',
        per_page: cpCodeConfig?.githubPerPage || 25,
      }
    )

    if (!issues.data.length) {
      outputMessage(`There is no opened issues in that repository.`)
      return
    }

    const issuesAsQuickPickItem: vscode.QuickPickItem[] = issues.data.map(issue => {
      return {
        label: issue.title,
        description: issue.number.toString(),
        detail: issue.assignees?.map(assignee => '@' + assignee.login).join(', '),
        picked: !!issue.assignees?.find(assignee => assignee.login === user.login),
      }
    })

    const picks = await vscode.window.showQuickPick(
      issuesAsQuickPickItem,
      {
        title: 'Assign myself to issues',
        canPickMany: true,
        ignoreFocusOut: true,
        placeHolder: `Assign yourself to issues`,
      }
    )

    if (!picks || !picks.length) { return }

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
            assignees: [user.login]
          }
        )

        successFullyAssigned.push(pick.description)
      } catch (e) {
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
