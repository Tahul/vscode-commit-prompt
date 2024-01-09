import * as vscode from 'vscode'
import { CommitPromptExtensionContext } from "../extension"
import { detailsFromIssue } from './issueAsQuickPickItem'

export async function getOrderedIssues(
  extensionContext: CommitPromptExtensionContext,
  page: number | undefined = 1,
) {
  const { repo, octoKit, cpCodeConfig, user } = extensionContext

  let issuesItems: vscode.QuickPickItem[] | undefined

  if (user?.login && repo && octoKit) {
    const assignedIssues = await octoKit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        state: 'open',
        direction: 'desc',
        per_page: cpCodeConfig?.githubPerPage || 25,
        page,
        assignee: user.login,
      },
    ).then(result => result.data)

    const assignedIssuesNumbers = assignedIssues.map(assignedIssue => assignedIssue.number)

    const allIssues = await octoKit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        state: 'open',
        direction: 'desc',
        per_page: cpCodeConfig?.githubPerPage || 25,
        page,
      },
    ).then(result => result.data.filter(issue => !assignedIssuesNumbers.includes(issue.number)))

    issuesItems = [
      ...(
        assignedIssues.length > 0
          ? [
              {
                label: 'Assigned',
                kind: vscode.QuickPickItemKind.Separator,
              },
            ]
          : []
      ),
      ...assignedIssues.map(
        issue => ({
          label: issue.title,
          description: issue.number.toString(),
          detail: detailsFromIssue(issue),
        }),
      ),
      ...(
        allIssues?.length > 0
          ? [
              {
                label: 'All',
                kind: vscode.QuickPickItemKind.Separator,
              },
            ]
          : []
      ),
      ...allIssues.map(
        issue => ({
          label: issue.title,
          description: issue.number.toString(),
          detail: detailsFromIssue(issue),
        }),
      ),
    ]

    return {
      ordered: issuesItems,
      issues: allIssues,
      assignedIssues,
    }
  }

  return { ordered: [], issues: [], assignedIssues: [] }
}
