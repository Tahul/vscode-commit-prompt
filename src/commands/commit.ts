import * as vscode from "vscode";
import { CommandCallback } from ".";
import { CzConfig } from "../config";

export const commit = (
  context: vscode.ExtensionContext,
  czConfig: CzConfig
): CommandCallback => {
  return () => {
    vscode.window.showInformationMessage(JSON.stringify(czConfig));
  };
};

export default commit;
