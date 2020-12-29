import * as vscode from "vscode";
import loader from "./helpers/configLoader/loader";
import { Question } from "./helpers/defaultQuestion";

export const EXTENSION_NAME = "vscode-commit-prompt";

export type MessageType =
  | "type"
  | "scope"
  | "subject"
  | "body"
  | "breaking"
  | "footer";

export interface CpScopeType {
  name: string;
  description: string;
}

export interface CommitPromptType {
  emoji: string;
  code: string;
  description: string;
  name: string;
}

export interface CommitPromptConfig {
  types?: CommitPromptType[];
  questions?: Question[];
  scopes?: CpScopeType[];
}

export interface CpConfig {
  config?: {
    "commit-prompt"?: CommitPromptConfig;
  };
}

export interface CommitPromptCodeConfig {
  subjectLength: number;
  showOutputChannel: "off" | "always" | "onError";
  addBeforeCommit: boolean;
}

export const getCpConfig = (): CommitPromptConfig => {
  if (
    !vscode.workspace ||
    !vscode.workspace.workspaceFolders ||
    !vscode.workspace.workspaceFolders[0]
  ) {
    return {};
  }

  const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

  // Configuration sources in priority order.
  const configs = [".cprc", ".cp.json", "package.json"];

  // Return the original commitizen config loader
  const cpConfig = loader(configs, null, projectRoot) as CpConfig;

  if (cpConfig?.config?.["commit-prompt"]) {
    return cpConfig.config["commit-prompt"];
  }

  return {};
};

export const getVsCodeConfig = (): CommitPromptCodeConfig => {
  const config = vscode.workspace
    .getConfiguration()
    .get<CommitPromptCodeConfig>("commit-prompt");
  return config!;
};
