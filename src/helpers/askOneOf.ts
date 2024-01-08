import * as vscode from 'vscode'
import type { CommitPromptType, CommitPromptScopeType } from '../config'
import ask from './ask'
import type { Question } from './defaultCommitQuestions'

/**
 * Cast an prompt from commit-prompt into a QuickPickItem from VSCode.
 */
function castPromptsToQuickPickItems(prompts: CommitPromptType[]): vscode.QuickPickItem[] {
  return prompts.map(
    (prompt: CommitPromptType): vscode.QuickPickItem => {
      return {
        label: prompt.code,
        description: `${prompt?.emoji ? `${prompt.emoji} | ` : ''}${
          prompt.description
        } (${prompt.name})`,
      }
    },
  )
}

/**
 * Ask a selectable question using showQuickPick.
 */
export async function askOneOf(question: Question): Promise<vscode.QuickPickItem> {
  let quickpickItems: vscode.QuickPickItem[] = []

  // No types nor scopes, return a plain input
  if (!question.prompts && !question.scopes) {
    return await ask(question)
  }

  // Add prompts types to quickpick
  if (question.prompts) {
    quickpickItems = castPromptsToQuickPickItems(question.prompts)
  }

  // Add scopes to quickpick
  if (question.scopes) {
    quickpickItems = question.scopes
  }

  const pickOptions: vscode.QuickPickOptions = {
    title: question?.title,
    placeHolder: question?.placeHolder,
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
  }

  const result: vscode.QuickPickItem | undefined = await vscode.window.showQuickPick(quickpickItems, pickOptions)

  if (result === undefined) {
    throw new Error('Input escaped, commit cancelled.')
  }

  // Return formatted question result
  if (question?.format && result) {
    result.label = question.format.replace('{value}', result.label)
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
