import * as vscode from "vscode";
import generateCommands from "./commands";
import { CzConfig, getCzConfig } from "./config";

export const activate = (context: vscode.ExtensionContext) => {
  // Get commitizen config
  const czConfig: CzConfig = getCzConfig();

  // Log config during dev phase
  console.log(JSON.stringify(czConfig));

  // Register all commands
  generateCommands(context, czConfig).forEach((command: vscode.Disposable) =>
    context.subscriptions.push(command)
  );
};

export const deactivate = () => {};
