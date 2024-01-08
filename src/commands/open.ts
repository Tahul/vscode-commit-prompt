import * as vscode from 'vscode'
import ask from '../helpers/ask'
import askOneOf from '../helpers/askOneOf'
import type { CommitPromptExtensionContext } from '../extension'
import getIssueQuestions from '../helpers/getIssueQuestions'
import { openInBrowser } from '../helpers/openInBrowser'
import type { CommandCallback } from '.'

export function open(extensionContext: CommitPromptExtensionContext, page: number | undefined = 1): CommandCallback {
  return async () => {
    const { octoKit, user, cwd, repo, cpCodeConfig, outputMessage } = extensionContext

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
        page,
      },
    )

    const issuesAsQuickPickItem: vscode.QuickPickItem[] = issues.data.map((issue) => {
      return {
        label: issue.title,
        description: issue.number.toString(),
        detail: issue.assignees?.map(assignee => `@${assignee.login}`).join(', '),
      }
    })

    const pick = await vscode.window.showQuickPick(
      [
        {
          label: 'New issue',
          icon: vscode.ThemeIcon.File,
        } as vscode.QuickPickItem,
        {
          label: '',
          kind: vscode.QuickPickItemKind.Separator,
        } as vscode.QuickPickItem,
        ...(page > 1 ? [{ label: 'Previous page', iconPath: vscode.ThemeIcon.Folder }] : []),
        ...issuesAsQuickPickItem,
        ...(issuesAsQuickPickItem.length === 100 ? [{ label: 'Next page', iconPath: vscode.ThemeIcon.Folder }] : []),
      ],
      {
        title: 'Open issue',
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'Open issues',
      },
    )

    if (pick?.label === 'Next page') {
      return open(extensionContext, page + 1)
    }

    if (pick?.label === 'Previous page') {
      return open(extensionContext, page - 1 >= 1 ? page - 1 : 1)
    }

    if (pick && pick?.description) {
      const issue = issues.data.find(d => d.number === Number(pick.description))
      if (issue) { await openInBrowser(issue.html_url) }
    }

    if (pick?.label === 'New issue') {
      const questions = getIssueQuestions(extensionContext)

      let title: string | undefined = ''
      let body: string | undefined = ''

      for (const question of questions) {
        try {
          if (question.name === 'body') {
            const pick = await ask(question)
            body += pick?.label
            continue
          }

          if (question.type === 'oneOf') {
            const pick = await askOneOf(question)
            title += pick?.label
          }

          if (question.type === 'input') {
            const pick = await ask(question)
            title += pick?.label
          }
        }
        catch (e) {
          outputMessage('Cancelling issue creation!')
          return
        }
      }

      try {
        await octoKit?.request('POST /repos/{owner}/{repo}/issues', {
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          title,
          body,
          assignees: user?.login && cpCodeConfig.autoAssignOpenedIssues ? [user.login] : [],
        })

        outputMessage(`Successfully created issue: ${title}`)
      }
      catch (e: any) {
        outputMessage(`Could not create issue: ${title}`)
      }
    }
  }
}

export default open
