import type {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  CommitPromptType,
  CpScopeType,
} from '../config'
import { defaultTypes } from './defaultTypes'

export interface Question {
  name: string
  type: 'oneOf' | 'input' | 'issues'
  placeHolder: string
  title?: string
  prompts?: CommitPromptType[]
  scopes?: CpScopeType[]
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
  const configTypes = cpConfig?.types

  const types: CommitPromptType[] = configTypes || defaultTypes(cpConfig, cpCodeConfig)

  const configScopes = cpConfig?.scopes

  const scopes: CpScopeType[] | undefined = configScopes || undefined

  const questions: Question[] = [
    {
      title: 'Create issue (type)',
      name: 'type',
      placeHolder: 'Select the type of issue you are creating (type)',
      type: 'oneOf',
      prompts: types,
    },
    {
      title: 'Create issue (scope)',
      name: 'scope',
      placeHolder: 'Specify a scope (scope)',
      type: scopes ? 'oneOf' : 'input',
      scopes: scopes || undefined,
      format: '({value})',
      suffix: ': ',
    },
    {
      title: 'Create issue (subject)',
      name: 'subject',
      placeHolder: 'Write a short description (subject)',
      type: 'input',
      required: true,
    },
    {
      title: 'Create issue (body)',
      name: 'body',
      placeHolder: 'Maybe provide a longer description (body)',
      type: 'input',
    },
  ]

  return questions
}

export default defaultCommitQuestions
