import * as vscode from "vscode";
import generateCommands from "./commands";
import {
  CzEmojiCodeConfig,
  CzEmojiConfig,
  getCzConfig,
  getVsCodeConfig,
} from "./config";
import getGit from "./helpers/getGit";
import { API as GitAPI } from "./typings/git";

export const activate = (context: vscode.ExtensionContext) => {
  // Get commitizen config
  const czConfig: CzEmojiConfig = getCzConfig();

  // Get extension config
  const czCodeConfig: CzEmojiCodeConfig = getVsCodeConfig();

  // Get editor Git instance
  const git: GitAPI | undefined = getGit();

  if (!git) {
    vscode.window.showErrorMessage("Cannot find git extension for cz-emoji!");

    return false;
  }

  // Register all commands
  for (const command of generateCommands(
    context,
    czConfig,
    czCodeConfig,
    git
  )) {
    context.subscriptions.push(command);
  }
};

export const deactivate = () => {};
