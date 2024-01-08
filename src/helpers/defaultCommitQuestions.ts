import {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  CommitPromptType,
  CpScopeType
} from "../config"
import { defaultTypes } from "./defaultTypes"
import * as vscode from 'vscode'

export interface Question {
  name: string
  type: "oneOf" | "input" | "issues" | "multiple"
  placeHolder?: string
  title?: string
  prompts?: CommitPromptType[]
  items?: vscode.QuickPickItem[] | undefined
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
export const defaultCommitQuestions = (
  cpConfig: CommitPromptConfig,
  cpCodeConfig: CommitPromptCodeConfig,
  issuesItems: vscode.QuickPickItem[] | undefined = undefined
): Question[] => {
  const defaultCommitTypes: CommitPromptType[] = cpConfig?.types
    ? cpConfig?.types
    : defaultTypes(cpConfig, cpCodeConfig)

  const configScopes = cpConfig?.scopes

  const scopes: CpScopeType[] | undefined = configScopes
    ? configScopes
    : undefined

  const questions: Question[] = [
    {
      name: "type",
      placeHolder: "Select the type of change you are committing (type)",
      type: "oneOf",
      prompts: defaultCommitTypes,
    },
    {
      name: "scope",
      placeHolder: "Specify a scope (scope)",
      type: scopes ? "oneOf" : "input",
      scopes: scopes ? scopes : undefined,
      format: "({value})",
      suffix: ":"
    },
    {
      name: "subject",
      placeHolder: "Write a short description (subject)",
      type: "input",
      required: true
    },
    {
      name: "body",
      placeHolder: "Maybe provide a longer description (body)",
      type: "input",
      format: "\n\n{value}", // Break 2 lines for body
    },
    (
      issuesItems?.length ?
        {
          name: "issues",
          placeHolder: "List any issue closed (issues)",
          type: "multiple",
          items: issuesItems,
          format: "\n\nCloses {value}", // Break 2 lines for issues
        } :
        {
          name: "issues",
          placeHolder: "List any issue closed (#xx, #xy, #yz...)",
          type: "input",
          format: "\n\nCloses {value}", // Break 2 lines for issues
        }
    ),
  ]

  return questions
}

export default defaultCommitQuestions
