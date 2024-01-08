import { CommitPromptExtensionContext } from "../extension"
import defaultCommitQuestions, { Question } from "./defaultCommitQuestions"
import * as vscode from 'vscode'

/**
 * Check if workspace config specifies a set of questions, otherwise use the default ones.
 *
 * @param cpConfig CommitPromptConfig
 */
export const getCommitQuestions = async (
  extensionContext: CommitPromptExtensionContext,
): Promise<Question[]> => {
  const { cpCodeConfig, cpConfig, user, repo, octoKit } = extensionContext

  let issuesItems: vscode.QuickPickItem[] | undefined = undefined

  if (user?.login && repo && octoKit) {
    const assignedIssues = await octoKit.request(
      `GET /repos/{owner}/{repo}/issues`,
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        state: 'open',
        direction: 'desc',
        per_page: cpCodeConfig?.githubPerPage || 25,
        assignees: [user.login]
      }
    ).then(
      result => result.data.map(
        issue => ({
          label: issue.title,
          description: issue.number.toString(),
          detail: issue.assignees?.map(assignee => '@' + assignee.login).join(', '),
        })
      )
    )

    const assignedIssuesNumbers = assignedIssues.map(assignedIssue => Number(assignedIssue.description))

    const allIssues = await octoKit.request(
      `GET /repos/{owner}/{repo}/issues`,
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        state: 'open',
        direction: 'desc',
        per_page: cpCodeConfig?.githubPerPage || 25,
        page: 1
      }
    )
      .then(result =>
        result.data
          .filter(issue => !assignedIssuesNumbers.includes(issue.number))
          .map(
            issue => ({
              label: issue.title,
              description: issue.number.toString(),
              detail: issue.assignees?.map(assignee => '@' + assignee.login).join(', '),
            })
          )
      )

    issuesItems = [
      ...(
        assignedIssues.length > 0 ? [
          {
            label: 'Assigned',
            kind: vscode.QuickPickItemKind.Separator
          }
        ] : []
      ),
      ...assignedIssues,
      ...(
        allIssues?.length > 0 ? [
          {
            label: 'All',
            kind: vscode.QuickPickItemKind.Separator
          }
        ] : []
      ),
      ...allIssues,
    ]

    console.log(issuesItems)
  }

  const questions: Question[] = !cpConfig.commitQuestions
    ? defaultCommitQuestions(cpConfig, cpCodeConfig, issuesItems)
    : cpConfig.commitQuestions

  // Set subject maxLength from config
  if (cpCodeConfig.subjectLength) {
    const subjectIndex = questions.findIndex(
      (question: Question) => question.name === "subject"
    )

    if (subjectIndex > -1) {
      questions[subjectIndex].maxLength = cpCodeConfig.subjectLength
    }
  }

  return questions
}

export default getCommitQuestions
