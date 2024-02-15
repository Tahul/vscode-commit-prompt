import * as vscode from 'vscode'
import ask from '../helpers/ask'
import askOneOf from '../helpers/askOneOf'
import getCommitQuestions from '../helpers/getCommitQuestions'
import gitCommit from '../helpers/gitCommit'
import gitPush from '../helpers/gitPush'
import type { CommitPromptExtensionContext } from '../extension'
import type { CommandCallback } from '.'
import gitAdd from '../helpers/gitAdd'
import gitRemove from '../helpers/gitRemove'
import { basename } from 'node:path'
import { getCurrentChanges } from '../helpers/getCurrentChanges'
import { Status } from '../typings/git'

export function fast(extensionContext: CommitPromptExtensionContext): CommandCallback {
  return async () => {
    const { cpCodeConfig, outputMessage, git } = extensionContext

    await vscode.commands.executeCommand('git.refresh')

    const questions = await getCommitQuestions(extensionContext)

    const changes = await getCurrentChanges(git)

    const addedChanges = changes.filter(
      id => [
        Status.INDEX_MODIFIED,
        Status.INDEX_DELETED,
        Status.INDEX_ADDED,
        Status.INDEX_COPIED,
        Status.INDEX_RENAMED,
      ].includes(id.change.status)
    )

    const restore = async () => {
      // Re-add previously indexed files
      for (const change of addedChanges) {
        await gitAdd(change.change)
      }
      // Await for sync after commit so the change list gets updated.
      await vscode.commands.executeCommand('git.refresh')
    }

    // Get current file and add it
    const currentFile = vscode.window?.activeTextEditor?.document

    // Check if current file has changes
    if (!currentFile || !changes.find(change => change.change.uri.fsPath === currentFile.uri.fsPath)) {
      outputMessage('The current active file does not have changes or is not known by Git.')
      return
    }

    // Reset added changes
    await gitRemove()

    // Add current file
    await gitAdd(currentFile.uri.path)

    let commitMessage: string = ``

    await vscode.commands.executeCommand('git.refresh')

    for (const question of questions) {
      try {
        let result: vscode.QuickPickItem | undefined

        if (
          question.name === 'body' ||
          question.type === 'issues'
        ) continue

        if (question.name === 'subject') {
          result = await ask(
            question,
            commitMessage,
            `Update ${basename(currentFile.uri.path)}`
          )
        }

        if (question.type === 'oneOf') {
          result = await askOneOf(question)
        }

        if (result) {
          commitMessage += result?.label
          continue
        }
      }
      catch (e: any) {
        outputMessage('Cancelling commit!', e)
        await restore()
        return
      }
    }

    try {
      await gitCommit(commitMessage)

      await restore()

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

export default fast
