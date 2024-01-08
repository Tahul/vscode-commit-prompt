import * as vscode from 'vscode'
import type { CommitPromptExtensionContext } from '../extension'
import type { Question } from './defaultCommitQuestions'
import defaultCommitQuestions from './defaultCommitQuestions'
import { detailsFromIssue } from './issueAsQuickPickItem'

/**
 * Check if workspace config specifies a set of questions, otherwise use the default ones.
 */
export async function getCommitQuestions(extensionContext: CommitPromptExtensionContext): Promise<Question[]> {
  const { cpCodeConfig, cpConfig, user, repo, octoKit } = extensionContext

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
        assignees: [user.login],
      },
    ).then(
      result => result.data.map(
        issue => ({
          label: issue.title,
          description: issue.number.toString(),
          detail: detailsFromIssue(issue),
        }),
      ),
    )

    const assignedIssuesNumbers = assignedIssues.map(assignedIssue => Number(assignedIssue.description))

    const allIssues = await octoKit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        state: 'open',
        direction: 'desc',
        per_page: cpCodeConfig?.githubPerPage || 25,
        page: 1,
      },
    )
      .then(result =>
        result.data
          .filter(issue => !assignedIssuesNumbers.includes(issue.number))
          .map(
            issue => ({
              label: issue.title,
              description: issue.number.toString(),
              detail: detailsFromIssue(issue),
            }),
          ),
      )

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
      ...assignedIssues,
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
      ...allIssues,
    ]
  }

  const questions: Question[] = cpConfig?.commitQuestions || cpCodeConfig?.commitQuestions || defaultCommitQuestions(cpConfig, cpCodeConfig, issuesItems)

  // Set subject maxLength from config
  if (cpCodeConfig.subjectLength) {
    const subjectIndex = questions.findIndex(
      (question: Question) => question.name === 'subject',
    )

    if (subjectIndex > -1) {
      questions[subjectIndex].maxLength = cpCodeConfig.subjectLength
    }
  }

  return questions
}

export default getCommitQuestions
