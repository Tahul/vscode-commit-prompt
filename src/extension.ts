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

  // Log config during dev phase
  console.log("commitizen config: " + JSON.stringify(czConfig));
  console.log("vscode config: " + JSON.stringify(czCodeConfig));

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
