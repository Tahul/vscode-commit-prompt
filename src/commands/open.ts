import * as vscode from 'vscode'
import ask from '../helpers/ask'
import askOneOf from '../helpers/askOneOf'
import type { CommitPromptExtensionContext } from '../extension'
import getIssueQuestions from '../helpers/getIssueQuestions'
import { openInBrowser } from '../helpers/openInBrowser'
import type { CommandCallback } from '.'
import { getOrderedIssues } from '../helpers/getOrderedIssues'
import { paginateIssuesItems } from '../helpers/paginateIssuesItems'

export function open(
  extensionContext: CommitPromptExtensionContext,
  page: number | undefined = 1
): CommandCallback {
  return async () => {
    const { octoKit, user, cwd, repo, cpCodeConfig, outputMessage } = extensionContext

    if (!octoKit || !user?.login || !repo) {
      outputMessage('You do not seem properly logged into GitHub, try setting your `commit-prompt.githubToken` first.')
      return
    }

    if (!cwd) { return }

    const { ordered: issuesItems, issues } = await getOrderedIssues(extensionContext, page)

    const pick = await vscode.window.showQuickPick(
      [
        {
          label: 'New issue',
          iconPath: new vscode.ThemeIcon('new-file'),
          detail: `Opens a new issue in ${repo}`
        } as vscode.QuickPickItem,
        {
          label: '',
          kind: vscode.QuickPickItemKind.Separator,
        } as vscode.QuickPickItem,
        ...paginateIssuesItems(
          issuesItems,
          page
        ),
      ] as vscode.QuickPickItem[],
      {
        title: `Open issue${page > 1 ? ` (Page ${page})` : ''}`,
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'Open issues',
      },
    )

    if (pick?.label === 'Next page') {
      return await open(extensionContext, page + 1)()
    }

    if (pick?.label === 'Previous page') {
      return await open(extensionContext, page - 1 >= 1 ? page - 1 : 1)()
    }

    if (pick && pick?.description) {
      const issue = issues.find(d => d.number === Number(pick.description))
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
