import * as vscode from 'vscode'
import ask from '../helpers/ask'
import askOneOf from '../helpers/askOneOf'
import getCommitQuestions from '../helpers/getCommitQuestions'
import gitCommit from '../helpers/gitCommit'
import gitPush from '../helpers/gitPush'
import type { CommitPromptExtensionContext } from '../extension'
import askMultiple from '../helpers/askMultiple'
import { getOrderedIssues } from '../helpers/getOrderedIssues'
import { paginateIssuesItems } from '../helpers/paginateIssuesItems'
import add from './add'
import type { CommandCallback } from '.'

export function commit(extensionContext: CommitPromptExtensionContext): CommandCallback {
  return async () => {
    const { cpCodeConfig, outputMessage } = extensionContext

    await vscode.commands.executeCommand('git.refresh')

    const questions = await getCommitQuestions(extensionContext)

    let addedChanges: vscode.QuickPickItem[] | undefined
    if (cpCodeConfig?.addBeforeCommit) {
      addedChanges = await add(extensionContext, false)()

      // Cancel prompts if escaped
      if (!addedChanges?.length) { return }
    }

    let commitMessage: string = ''

    for (const question of questions) {
      try {
        let result: vscode.QuickPickItem | undefined

        if (question.name === 'body' && cpCodeConfig.skipCommitBody) continue

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
          if (cpCodeConfig.skipCommitIssues) continue
          
          const askIssues = async (page: number = 1): Promise<any> => {
            let githubErrored = false

            try {
              const picks = await askMultiple(
                new Promise((resolve) =>
                  getOrderedIssues(extensionContext, page).then(
                    ({ ordered }) => {
                      if (ordered.length > 0) {
                        resolve(paginateIssuesItems(ordered, page, cpCodeConfig.githubPerPage))
                      }
                    }
                  )
                ),
                question,
              )

              if (picks.find(pick => pick.label === 'Next page')) {
                return await askIssues(page + 1)
              }
              if (picks.find(pick => pick.label === 'Previous page')) {
                return await askIssues(page - 1 >= 1 ? page - 1 : 1)
              }
              if (picks.length) {
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
              }

              return
            }
            catch (e) {
              githubErrored = true
            }

            if (githubErrored) {
              commitMessage += await ask({
                name: 'issues',
                title: question?.title || 'Issues closed by your commit',
                placeHolder: 'Select the issue(s) to close (optional, in this format: #123, #456)',
                type: 'input',
                format: '\n\nCloses {value}', // Break 2 lines for issues
              }).then(v => v?.label)
            }
          }

          await askIssues()
        }
      }
      catch (e: any) {
        console.log(e.message)
        if (e?.message === 'Required input escaped!') { return }
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
        }
        catch (e) {
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
