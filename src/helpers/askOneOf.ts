import * as vscode from "vscode"
import { CommitPromptType, CpScopeType } from "../config"
import ask from "./ask"
import { Question } from "./defaultCommitQuestions"

/**
 * Cast an Emoji Type from commit-prompt into a QuickPickItem from VSCode.
 *
 * @param prompts CommitPromptType[]
 */
const castPromptsToQuickPickItems = (
  prompts: CommitPromptType[]
): vscode.QuickPickItem[] => {
  return prompts.map(
    (prompt: CommitPromptType): vscode.QuickPickItem => {
      return {
        label: prompt.code,
        description: `${prompt?.emoji ? `${prompt.emoji} | ` : ``}${
          prompt.description
        } (${prompt.name})`,
      }
    }
  )
}

/**
 * Ask a selectable question using showQuickPick.
 *
 * @param question Question
 */
export const askOneOf = async (question: Question): Promise<vscode.QuickPickItem> => {
  let quickpickItems: vscode.QuickPickItem[] = []

  // No types nor scopes, return a plain input
  if (!question.prompts && !question.scopes) {
    return await ask(question)
  }

  // Add emoji types to quickpick
  if (question.prompts) {
    quickpickItems = castPromptsToQuickPickItems(question.prompts)
  }

  const pickOptions: vscode.QuickPickOptions = {
    title: question?.title,
    placeHolder: question?.placeHolder,
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
  }

  let result: vscode.QuickPickItem | undefined = await vscode.window.showQuickPick(quickpickItems, pickOptions)

  if (result === undefined) {
    throw new Error("Input escaped, commit cancelled.")
  }

  // Return formatted question result
  if (question?.format && result) {
    result.label = question.format.replace("{value}", result.label)
  }
  if (question?.suffix) {
    result.label = result + question.suffix
  }
  if (question?.prefix) {
    result.label = question.prefix + result
  }

  return result
}

export default askOneOf
