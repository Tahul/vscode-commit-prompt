import * as vscode from 'vscode'
import loader from './helpers/configLoader/loader'
import type { Question } from './helpers/defaultCommitQuestions'
import { getCwd } from './helpers/getCwd'

export const EXTENSION_NAME = 'vscode-commit-prompt'

export type MessageType =
  | 'type'
  | 'scope'
  | 'subject'
  | 'body'
  | 'breaking'
  | 'footer'

export interface CommitPromptScopeType {
  label: string
  description: string
}

export interface CommitPromptType {
  emoji?: string
  code: string
  description: string
  name: string
}

export interface CommitPromptConfig {
  types?: CommitPromptType[]
  commitQuestions?: Question[]
  issueQuestions?: Question[]
  scopes?: CommitPromptScopeType[]
}

export interface CpConfig {
  config?: {
    'commit-prompt'?: CommitPromptConfig
  }
}

export interface CommitPromptCodeConfig extends CommitPromptConfig {
  subjectLength: number
  showOutputChannel: 'status' | 'popup' | 'none'
  addAllByDefault: boolean
  addBeforeCommit: boolean
  skipCommitBody: boolean
  skipCommitIssues: boolean
  pushAfterCommit: boolean
  preset: 'conventional-commits' | 'cz-emoji'
  githubToken?: string
  githubPerPage?: number
  autoAssignOpenedIssues?: boolean
}

export function getCpConfig(): CommitPromptConfig {
  const projectRoot = getCwd()

  if (!projectRoot) {
    return {}
  }

  // Configuration sources in priority order.
  const configs = ['.cprc', '.cp.json', 'package.json']

  // Return the original commitizen config loader
  const cpConfig = loader(configs, null, projectRoot) as CpConfig

  if (cpConfig?.config?.['commit-prompt']) {
    return cpConfig.config['commit-prompt']
  }

  return {}
}

export function getVsCodeConfig(): CommitPromptCodeConfig {
  const vscodeConfig = vscode.workspace
    .getConfiguration()
    .get<CommitPromptCodeConfig>('commit-prompt')

  const config = {
    ...vscodeConfig,
  }

  if (config?.issueQuestions && !config.issueQuestions.length) {
    delete config.issueQuestions
  }

  if (config?.commitQuestions && !config.commitQuestions.length) {
    delete config.commitQuestions
  }

  if (config?.types && !config.types.length) {
    delete config.types
  }

  if (config?.scopes && !config.scopes.length) {
    delete config.scopes
  }

  return config as CommitPromptCodeConfig
}
