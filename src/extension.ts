import * as vscode from "vscode"
import * as cp from 'child_process'
import generateCommands from "./commands"
import {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  getCpConfig,
  getVsCodeConfig
} from "./config"
import getGit from "./helpers/getGit"
import { API as GitAPI } from "./typings/git"
import { Octokit } from "octokit"
import { getCwd } from "./helpers/getCwd"
import { getRepoName } from "./helpers/getRepoName"

export interface CommitPromptExtensionContext {
  cwd?: string
  git: GitAPI
  cpConfig: CommitPromptConfig
  cpCodeConfig: CommitPromptCodeConfig
  octoKit?: Octokit
  user?: {
    login?: string;
    id?: number;
  }
  repo?: `${string}/${string}`
  outputMessage: (msg: string) => Promise<void>
}

export const activate = (context: vscode.ExtensionContext) => {
  const extensionContext: CommitPromptExtensionContext = {
    get cwd() {
      return getCwd()
    },
    cpConfig: getCpConfig(),
    cpCodeConfig: getVsCodeConfig(),
    git: getGit() as GitAPI,
    repo: getRepoName(),
    octoKit: undefined,
    user: undefined,
    get outputMessage() {
      return async (message: string) => {
        if (!extensionContext.cpCodeConfig.showOutputChannel || extensionContext.cpCodeConfig.showOutputChannel === 'none') {
          return
        }

        if (extensionContext.cpCodeConfig.showOutputChannel === 'popup') {
          await vscode.window.showInformationMessage(message)
          return
        }

        if (extensionContext.cpCodeConfig.showOutputChannel === 'status') {
          vscode.window.setStatusBarMessage(message, 3000)
          return
        }
      }
    }
  }

  const updateConfig = async () => {
    const previousConfig = { ...extensionContext?.cpCodeConfig }

    extensionContext.cpCodeConfig = getVsCodeConfig()
    extensionContext.cpConfig = getCpConfig()
    extensionContext.repo = getRepoName()

    if (previousConfig?.githubToken && extensionContext?.cpCodeConfig?.githubToken !== previousConfig?.githubToken) {
      await initOctokit()
    }
  }

  const initOctokit = async () => {
    if (!extensionContext?.cwd || !extensionContext?.cpCodeConfig?.githubToken) { return }
    const octoKit = extensionContext.octoKit = new Octokit({
      auth: extensionContext?.cpCodeConfig?.githubToken
    })
    extensionContext.user = await octoKit.request('GET /user').then(response => response?.data)
  }

  if (!extensionContext.git) {
    vscode.window.showErrorMessage(
      "Cannot find git extension for commit-prompt!"
    )
  }

  if (extensionContext.cpCodeConfig.githubToken) {
    initOctokit()
  }

  const commands = generateCommands(extensionContext)

  // Register all commands
  for (const command of commands) {
    context.subscriptions.push(command)
  }

  // Register a configuration change listener
  const configListener = vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (
      event.affectsConfiguration('commit-prompt.preset') ||
      event.affectsConfiguration('commit-prompt.subjectLength') ||
      event.affectsConfiguration('commit-prompt.showOutputChannel') ||
      event.affectsConfiguration('commit-prompt.addBeforeCommit') ||
      event.affectsConfiguration('commit-prompt.pushAfterCommit') ||
      event.affectsConfiguration('commit-prompt.githubToken')
    ) {
      await updateConfig()
    }
  });

  context.subscriptions.push(configListener);
}

export const deactivate = () => { }
