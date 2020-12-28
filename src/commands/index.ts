import * as vscode from "vscode";
import { EXTENSION_NAME } from "../config";

// Commands
import commit from "./commit";

export type CommandCallback = (...args: any[]) => any;

export interface CommandReference {
  reference: string;
  command: CommandCallback;
}

export const registerCommands = (context: vscode.ExtensionContext) => {
  const commands: CommandReference[] = [
    {
      reference: "commit",
      command: commit(context),
    },
  ];

  for (const command of commands) {
    const disposable = vscode.commands.registerCommand(
      `${EXTENSION_NAME}.${command.reference}`,
      () => {}
    );

    context.subscriptions.push(disposable);
  }
};

export default registerCommands;
