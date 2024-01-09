import type * as vscode from 'vscode'
import type {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  CommitPromptType,
  CommitPromptScopeType,
} from '../config'
import { defaultTypes } from './defaultTypes'

export interface Question {
  name: string
  type: 'oneOf' | 'input' | 'issues' | 'multiple'
  placeHolder?: string
  title?: string
  prompts?: CommitPromptType[]
  items?: vscode.QuickPickItem[] | undefined
  scopes?: CommitPromptScopeType[]
  format?: string
  maxLength?: number
  required?: boolean
  prefix?: string
  suffix?: string
}

/**
 * Default questions from commit-prompt
 */
export function defaultCommitQuestions(
  cpConfig: CommitPromptConfig,
  cpCodeConfig: CommitPromptCodeConfig,
): Question[] {
  const defaultCommitTypes: CommitPromptType[] = cpCodeConfig?.types || cpConfig?.types || defaultTypes(cpConfig, cpCodeConfig)

  const scopes: CommitPromptScopeType[] | undefined = [...(cpCodeConfig?.scopes || cpConfig?.scopes || [])]

  const questions: Question[] = [
    {
      name: 'type',
      title: 'Type of your commit',
      placeHolder: 'Select the type of change you are committing (required)',
      type: 'oneOf',
      prompts: defaultCommitTypes,
    },
    {
      name: 'scope',
      title: 'Scope of your commit',
      placeHolder: 'Specify a scope (optional)',
      type: scopes?.length ? 'oneOf' : 'input',
      scopes: scopes || undefined,
      format: '({value})',
      suffix: ':',
    },
    {
      name: 'subject',
      title: 'Subject of your commit',
      placeHolder: 'Write a short description (required)',
      type: 'input',
      required: true,
      format: ' {value}'
    },
    {
      name: 'body',
      title: 'Body of your commit',
      placeHolder: 'Add a longer description (optional)',
      type: 'input',
      format: '\n\n{value}', // Break 2 lines for body
    },
    {
      name: 'issues',
      title: 'Issues closed by your commit',
      placeHolder: 'Select the issue(s) to close (optional)',
      type: 'issues',
      format: '\n\nCloses {value}', // Break 2 lines for issues
    },
  ]

  return questions
}

export default defaultCommitQuestions
