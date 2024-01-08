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
export function defaultCommitQuestions(cpConfig: CommitPromptConfig, cpCodeConfig: CommitPromptCodeConfig, issuesItems: vscode.QuickPickItem[] | undefined = undefined): Question[] {
  const defaultCommitTypes: CommitPromptType[] = cpCodeConfig?.types || cpConfig?.types || defaultTypes(cpConfig, cpCodeConfig)

  const configScopes = cpCodeConfig?.scopes || cpConfig?.scopes

  const scopes: CommitPromptScopeType[] | undefined = configScopes || undefined

  const questions: Question[] = [
    {
      name: 'type',
      placeHolder: 'Select the type of change you are committing (type)',
      type: 'oneOf',
      prompts: defaultCommitTypes,
    },
    {
      name: 'scope',
      placeHolder: 'Specify a scope (scope)',
      type: scopes ? 'oneOf' : 'input',
      scopes: scopes || undefined,
      format: '({value})',
      suffix: ':',
    },
    {
      name: 'subject',
      placeHolder: 'Write a short description (subject)',
      type: 'input',
      required: true,
    },
    {
      name: 'body',
      placeHolder: 'Maybe provide a longer description (body)',
      type: 'input',
      format: '\n\n{value}', // Break 2 lines for body
    },
    (
      issuesItems?.length
        ? {
            name: 'issues',
            placeHolder: 'List any issue closed (issues)',
            type: 'multiple',
            items: issuesItems,
            format: '\n\nCloses {value}', // Break 2 lines for issues
          }
        : {
            name: 'issues',
            placeHolder: 'List any issue closed (#xx, #xy, #yz...)',
            type: 'input',
            format: '\n\nCloses {value}', // Break 2 lines for issues
          }
    ),
  ]

  return questions
}

export default defaultCommitQuestions
