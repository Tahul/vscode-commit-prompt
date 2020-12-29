import * as vscode from "vscode";
import generateCommands from "./commands";
import {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  getCpConfig,
  getVsCodeConfig,
} from "./config";
import getGit from "./helpers/getGit";
import { API as GitAPI } from "./typings/git";

export const activate = (context: vscode.ExtensionContext) => {
  // Get commitizen config
  const cpConfig: CommitPromptConfig = getCpConfig();

  // Get extension config
  const cpCodeConfig: CommitPromptCodeConfig = getVsCodeConfig();

  // Get editor Git instance
  const git: GitAPI | undefined = getGit();

  if (!git) {
    vscode.window.showErrorMessage(
      "Cannot find git extension for commit-prompt!"
    );

    return false;
  }

  // Register all commands
  for (const command of generateCommands(
    context,
    cpConfig,
    cpCodeConfig,
    git
  )) {
    context.subscriptions.push(command);
  }
};

export const deactivate = () => {};
