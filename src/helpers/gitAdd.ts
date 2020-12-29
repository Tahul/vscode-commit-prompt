import * as vscode from "vscode";
import { API as GitAPI, Change, Repository } from "../typings/git";
import * as cp from "child_process";
import * as fs from "fs";

export const gitAdd = async (
  git: GitAPI,
  repo: Repository,
  change: Change
): Promise<void> => {
  // @ts-ignore - get cwd
  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

  const cwd = fs.realpathSync(rootPath);

  cp.execSync(`git add ${change.uri.path}`, { cwd });
};

export default gitAdd;
