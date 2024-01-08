import * as vscode from 'vscode'
import type { Question } from './defaultCommitQuestions'

/**
 * Ask a question using showInputBox and displays the current value inside the prompt.
 */
export async function ask(question: Question, currentValue?: string): Promise<vscode.QuickPickItem> {
  const options: vscode.InputBoxOptions = {
    title: question?.title,
    placeHolder: question?.placeHolder,
    ignoreFocusOut: true,
    prompt: currentValue,
  }

  const validators: ((value: string) => string | void)[] = []

  if (question.maxLength && question.maxLength !== undefined) {
    validators.push((input: string) => {
      if (question.maxLength && input.length > question.maxLength) {
        return `This input cannot be longer than ${question.maxLength}`
      }
    })
  }

  if (question?.required) {
    validators.push((input: string) => {
      if (!input) { return 'This input is required' }
    })
  }

  if (validators.length) {
    options.validateInput = (input: string) => {
      for (const validator of validators) {
        const error = validator(input)
        if (error) { return error }
      }
    }
  }

  let input = await vscode.window.showInputBox(options) || ''

  if (question.required && !input) {
    throw new Error('Required input skipped, commit cancelled.')
  }

  // Return formatted question result
  if (question?.format && input) {
    input = question.format.replace('{value}', input)
  }
  if (question?.suffix) {
    input = input + question.suffix
  }
  if (question?.prefix) {
    input = question.prefix + input
  }

  return {
    label: input,
  }
}

export default ask
