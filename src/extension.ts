import * as vscode from "vscode";
import registerCommands from "./commands";

export function activate(context: vscode.ExtensionContext) {
  // Register all commands
  registerCommands(context);
}

export function deactivate() {}
