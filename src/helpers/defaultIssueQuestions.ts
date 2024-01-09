import type {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  CommitPromptScopeType,
  CommitPromptType,
} from '../config'
import { defaultTypes } from './defaultTypes'

export interface Question {
  name: string
  type: 'oneOf' | 'input' | 'issues'
  placeHolder: string
  title?: string
  prompts?: CommitPromptType[]
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
export function defaultCommitQuestions(cpConfig: CommitPromptConfig, cpCodeConfig: CommitPromptCodeConfig): Question[] {
  const types: CommitPromptType[] = cpCodeConfig?.types || cpConfig?.types || defaultTypes(cpConfig, cpCodeConfig)

  const scopes: CommitPromptScopeType[] | undefined = cpCodeConfig?.scopes || cpConfig?.scopes

  const questions: Question[] = [
    {
      title: 'Create issue (type)',
      name: 'type',
      placeHolder: 'Select the type of issue you are creating (required)',
      type: 'oneOf',
      prompts: types,
    },
    {
      title: 'Create issue (scope)',
      name: 'scope',
      placeHolder: 'Specify a scope (optional)',
      type: scopes ? 'oneOf' : 'input',
      scopes: scopes || undefined,
      format: '({value})',
      suffix: ': ',
    },
    {
      title: 'Create issue (subject)',
      name: 'subject',
      placeHolder: 'Write a short description (required)',
      type: 'input',
      required: true,
    },
    {
      title: 'Create issue (body)',
      name: 'body',
      placeHolder: 'Add a longer description (optional)',
      type: 'input',
    },
  ]

  return questions
}

export default defaultCommitQuestions
