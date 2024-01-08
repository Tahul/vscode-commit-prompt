
    
import * as vscode from 'vscode'
import { CommitPromptExtensionContext } from '../extension'
import { CommandCallback } from '.'

/**
 * Shows a prompt to undo the last commit.
 *
 * @param git GitAPI
 */
export const unassign = (extensionContext: CommitPromptExtensionContext): CommandCallback => {
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
        assignees: [user.login]
      }
    )

    if (!issues.data.length) {
      outputMessage(`You are not assigned to any issues in that repository.`)
      return
    }

    const issuesAsQuickPickItem: vscode.QuickPickItem[] = issues.data.map(issue => {
      return {
        label: issue.title,
        description: issue.number.toString(),
        detail: issue.assignees?.map(assignee => '@' + assignee.login).join(', '),
      }
    })

    const picks = await vscode.window.showQuickPick(
      issuesAsQuickPickItem,
      {
        title: 'Unassign myself from issues',
        canPickMany: true,
        ignoreFocusOut: true,
        placeHolder: `Assign yourself to issues`,
      }
    )

    if (!picks || !picks.length) { return }

    const successFullyUnassigned: string[] = []
    const errorWhileUnassigned: string[] = []

    for (const pick of picks) {
      if (!pick.description) { continue }

      try {
        await octoKit.request(
          'DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees',
          {
            issue_number: Number(pick.description),
            owner: repo.split('/')[0],
            repo: repo.split('/')[1],
            assignees: [user.login]
          }
        )

        successFullyUnassigned.push(pick.description)
      } catch (e) {
        errorWhileUnassigned.push(pick.description)
      }
    }

    if (successFullyUnassigned.length) {
      outputMessage(`Successfully unassigned you from issues: ${successFullyUnassigned.join(', ')}`)
    }

    if (errorWhileUnassigned.length) {
      outputMessage(`There was an error while unassigning you issues: ${errorWhileUnassigned.join(', ')}`)
    }
  }
}

export default unassign
