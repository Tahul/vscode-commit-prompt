import * as vscode from 'vscode'
import ask from '../helpers/ask'
import askOneOf from '../helpers/askOneOf'
import getCommitQuestions from '../helpers/getCommitQuestions'
import gitCommit from '../helpers/gitCommit'
import gitPush from '../helpers/gitPush'
import type { CommitPromptExtensionContext } from '../extension'
import askMultiple from '../helpers/askMultiple'
import add from './add'
import type { CommandCallback } from '.'
import { getOrderedIssues } from '../helpers/getOrderedIssues'
import { paginateIssuesItems } from '../helpers/paginateIssuesItems'

export function commit(extensionContext: CommitPromptExtensionContext): CommandCallback {
  return async () => {
    const { cpCodeConfig, outputMessage } = extensionContext

    const questions = await getCommitQuestions(extensionContext)

    if (cpCodeConfig?.addBeforeCommit) {
      const addResult: boolean = await add(extensionContext)()

      // Cancel prompts if escaped
      if (addResult === false) { return }
    }

    let commitMessage: string = ''

    for (const question of questions) {
      try {
        let result: vscode.QuickPickItem | undefined

        if (question.type === 'oneOf') {
          result = await askOneOf(question)
        }

        if (question.type === 'input') {
          result = await ask(question, commitMessage)
        }

        if (result) {
          commitMessage += result?.label
          continue
        }

        if (question.name === 'issues' && question.type === 'issues') {
          const askIssues = async (page: number = 1): Promise<any> => {
            let githubErrored = false

            try {
              const { ordered: issuesItems } = await getOrderedIssues(extensionContext, page)

              if (issuesItems.length === 0) throw new Error('No GitHub issues found!')

              const picks = await askMultiple(
                paginateIssuesItems(issuesItems, page, cpCodeConfig.githubPerPage),
                question
              )

              if (picks.find(pick => pick.label === 'Next page')) {
                return await askIssues(page + 1)
              }
              if (picks.find(pick => pick.label === 'Previous page')) {
                return await askIssues(page - 1 >= 1 ? page - 1 : 1)
              }

              let resolvedResult: string = question?.format || ''
              
              if (question?.format) {
                resolvedResult = resolvedResult.replace('{value}', picks.filter(pick => !!pick?.description).map(pick => `#${pick.description}`).join(', '))
              }
              if (question?.suffix) {
                resolvedResult = resolvedResult + question?.suffix
              }
              if (question?.prefix) {
                resolvedResult = question?.prefix + resolvedResult
              }
              
              commitMessage += resolvedResult
              
              return
            } catch (e) {
              githubErrored = true
            }

            if (githubErrored) {
              commitMessage += await ask({
                name: 'issues',
                placeHolder: 'Write any issue closed (#xx, #xy, #yz...)',
                type: 'input',
                format: '\n\nCloses {value}', // Break 2 lines for issues
              }).then(v => v?.label)
            }
          }

          await askIssues()
        }
      }
      catch (e) {
        outputMessage('Cancelling commit!', e)
        return
      }
    }

    try {
      await gitCommit(commitMessage)

      // Await for sync after commit so the change list gets updated.
      await vscode.commands.executeCommand('git.refresh')

      if (cpCodeConfig?.pushAfterCommit) {
        try {
          await gitPush()
        } catch (e) {
          outputMessage('Could not push after commit!', e)
          return
        }
      }

      outputMessage(`Successfully commited: ${commitMessage}`)
    }
    catch (e) {
      outputMessage(`Could not commit: ${commitMessage}`, e)
    }
  }
}

export default commit
