import * as vscode from "vscode"
import { CommandCallback } from "."
import ask from "../helpers/ask"
import askOneOf from "../helpers/askOneOf"
import getCommitQuestions from "../helpers/getCommitQuestions"
import gitCommit from "../helpers/gitCommit"
import gitPush from '../helpers/gitPush'
import add from "./add"
import { CommitPromptExtensionContext } from "../extension"
import askMultiple from "../helpers/askMultiple"

export const commit = (extensionContext: CommitPromptExtensionContext): CommandCallback => {
  return async () => {
    const { cpCodeConfig, outputMessage } = extensionContext

    const questions = await getCommitQuestions(extensionContext)
    
    if (cpCodeConfig?.addBeforeCommit) {
      const addResult: boolean = await add(extensionContext)()

      // Cancel prompts if escaped
      if (addResult === false) { return }
    }

    let commitMessage: string = ""

    for (const question of questions) {
      try {
        let result: vscode.QuickPickItem | undefined

        if (question.type === "oneOf") {
          result = await askOneOf(question)
        }

        if (question.type === "input") {
          result = await ask(question, commitMessage)
        }

        if (result) {
          commitMessage += result?.label
          continue
        }

        if (question.name === 'issues' && question.type === 'multiple' && question.items) {
          const picks = await askMultiple(question.items, question)
          let resolvedResult: string = question?.format || ''
          if (question?.format) {
            resolvedResult = resolvedResult.replace("{value}", picks.filter(pick => !!pick?.description).map(pick => `#${pick.description}`).join(', '))
          }
          if (question?.suffix) {
            resolvedResult = resolvedResult + question?.suffix
          }
          if (question?.prefix) {
            resolvedResult = question?.prefix + resolvedResult
          }
          commitMessage += resolvedResult
        }
      } catch (e) {
        outputMessage("Cancelling commit!")

        return
      }
    }

    try {
      await gitCommit(commitMessage)
  
      // Await for sync after commit so the change list gets updated.
      await vscode.commands.executeCommand("git.refresh")
  
      if (cpCodeConfig?.pushAfterCommit) {
        await gitPush()
      }

      outputMessage('Successfully commited: ' + commitMessage)
    } catch (e) {
      outputMessage('Could not commit: ' + commitMessage)
    }
  }
}

export default commit
