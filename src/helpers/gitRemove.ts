import * as vscode from "vscode";
import { API as GitAPI, Change, Repository } from "../typings/git";
import * as cp from "child_process";
import * as fs from "fs";

export const gitRemove = async (
  git: GitAPI,
  repo: Repository,
  change: Change
): Promise<void> => {
  // @ts-ignore - get cwd
  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

  const cwd = fs.realpathSync(rootPath);

  cp.execSync(`git reset ${change.uri.path}`, { cwd });
};

export default gitRemove;
