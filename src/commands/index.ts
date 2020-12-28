import * as vscode from "vscode";
import { CzConfig, EXTENSION_NAME } from "../config";

// Commands
import commit from "./commit";

export type CommandCallback = (...args: any[]) => any;

export interface CommandReference {
  reference: string;
  command: CommandCallback;
}

export const generateCommands = (
  context: vscode.ExtensionContext,
  czConfig: CzConfig
): vscode.Disposable[] => {
  const disposables: vscode.Disposable[] = [];

  const commands: CommandReference[] = [
    {
      reference: "commit",
      command: commit(context, czConfig),
    },
  ];

  for (const { reference, command } of commands) {
    disposables.push(
      vscode.commands.registerCommand(
        `${EXTENSION_NAME}.${reference}`,
        command,
        () => {
          console.log(`${command} registered for ${EXTENSION_NAME}`);
        }
      )
    );
  }

  return disposables;
};

export default generateCommands;
