import * as vscode from "vscode";
import { CzEmojiCodeConfig, CzEmojiConfig, EXTENSION_NAME } from "../config";
import { API as GitAPI } from "../typings/git";
import add from "./add";

// Commands
import commit from "./commit";

export type CommandCallback = (...args: any[]) => any;

export interface CommandReference {
  reference: string;
  command: CommandCallback;
}

export const generateCommands = (
  context: vscode.ExtensionContext,
  czConfig: CzEmojiConfig,
  czCodeConfig: CzEmojiCodeConfig,
  git: GitAPI
): vscode.Disposable[] => {
  const disposables: vscode.Disposable[] = [];

  const commands: CommandReference[] = [
    {
      reference: "commit",
      command: commit(git, context, czConfig, czCodeConfig),
    },
    {
      reference: "add",
      command: add(git),
    },
  ];

  for (const { reference, command } of commands) {
    disposables.push(
      vscode.commands.registerCommand(`${EXTENSION_NAME}.${reference}`, command)
    );
  }

  return disposables;
};

export default generateCommands;
