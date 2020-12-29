import * as vscode from "vscode";
import { loader } from "commitizen/dist/configLoader";
import { Question } from "./helpers/defaultQuestion";

export const EXTENSION_NAME = "vscode-cz-emoji";

export type MessageType =
  | "type"
  | "scope"
  | "subject"
  | "body"
  | "breaking"
  | "footer";

export interface CzScopeType {
  name: string;
  description: string;
}

export interface CzEmojiType {
  emoji: string;
  code: string;
  description: string;
  name: string;
}

export interface CzEmojiConfig {
  types?: CzEmojiType[];
  questions?: Question[];
  scopes?: CzScopeType[];
}

export interface CzConfig {
  config?: {
    "cz-emoji"?: CzEmojiConfig;
  };
}

export interface CzEmojiCodeConfig {
  subjectLength: number;
  showOutputChannel: "off" | "always" | "onError";
  addBeforeCommit: boolean;
}

export const getCzConfig = (): CzEmojiConfig => {
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
  const czConfig = loader(configs, null, projectRoot) as CzConfig;

  if (czConfig?.config?.["cz-emoji"]) {
    return czConfig.config["cz-emoji"];
  }

  return {};
};

export const getVsCodeConfig = (): CzEmojiCodeConfig => {
  const config = vscode.workspace
    .getConfiguration()
    .get<CzEmojiCodeConfig>("cz-emoji");
  return config!;
};
