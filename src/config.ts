import * as vscode from "vscode";
import { loader } from "commitizen/dist/configLoader";

export const EXTENSION_NAME = "vscode-cz-emoji";

export type QuestionType = "scope" | "body" | "issues" | "type" | "subject";

export interface CzEmojiType {
  emoji: string;
  code: string;
  description: string;
  name: string;
}

export interface CzConfig {
  config?: {
    "cz-emoji"?: {
      scopes?: string[];
      types?: CzEmojiType[];
      symbol?: boolean;
      skipQuestions?: string[];
      questions?: {
        [key in QuestionType]: string;
      };
      subjectMaxLength?: number;
    };
  };
}

export const getCzConfig = (): CzConfig => {
  if (
    !vscode.workspace ||
    !vscode.workspace.workspaceFolders ||
    !vscode.workspace.workspaceFolders[0]
  ) {
    return {};
  }

  const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

  // Configuration sources in priority order.
  const configs = [".czrc", ".cz.json", "package.json"];

  // Return the original commitizen config loader
  return loader(configs, null, projectRoot) as CzConfig;
};
