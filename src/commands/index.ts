import * as vscode from "vscode";
import {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  EXTENSION_NAME,
} from "../config";
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
  cpConfig: CommitPromptConfig,
  cpCodeConfig: CommitPromptCodeConfig,
  git: GitAPI
): vscode.Disposable[] => {
  const disposables: vscode.Disposable[] = [];

  const commands: CommandReference[] = [
    {
      reference: "commit",
      command: commit(git, cpConfig, cpCodeConfig),
    },
    {
      reference: "add",
      command: add(git, cpCodeConfig),
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
