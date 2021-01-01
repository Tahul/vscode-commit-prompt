import * as vscode from "vscode";
import { Change, Status } from "../typings/git";
import { IndexChange } from "./getCurrentChanges";

/**
 * Cast Change[] from vscode-git into a QuickPickItem[] from VSCode.
 *
 * @param changes Change[]
 * @param cwd string
 */
const castIndexChangesToQuickPickItems = (
  changes: IndexChange[],
  cwd: string
): vscode.QuickPickItem[] => {
  return changes.map(
    (file: IndexChange): vscode.QuickPickItem => {
      return {
        label: file.change.uri.path.replace(cwd, ""),
        description: file.type === "index" ? "Staged changes" : "Working tree",
        picked: [
          Status.INDEX_MODIFIED,
          Status.INDEX_ADDED,
          Status.ADDED_BY_US,
          Status.ADDED_BY_THEM,
          Status.BOTH_ADDED,
        ].includes(file.change.status),
      };
    }
  );
};

/**
 * Ask to pick between multiple file changes from Git current tree.
 * Picked = added to next commit
 * Unpicked = not in next commit
 *
 * @param changes
 */
export const askMultiple = async (
  changes: IndexChange[]
): Promise<Change[]> => {
  // @ts-ignore - get cwd
  const cwd: string = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const addedChanges: Change[] = [];
  const pickOptions: vscode.QuickPickOptions = {
    placeHolder: "Add files",
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
    canPickMany: true,
  };

  // @ts-ignore - ~_~
  const picks: vscode.QuickPickItem[] = await vscode.window.showQuickPick(
    castIndexChangesToQuickPickItems(changes, cwd),
    pickOptions
  );

  if (picks === undefined) {
    throw new Error("Input escaped, commit cancelled.");
  }

  for (const pick of picks) {
    const changeFromPick = changes.find((file: IndexChange): boolean => {
      const uri = file.change.uri.path.replace(cwd, "");
      return pick.label === uri;
    });

    if (changeFromPick) {
      addedChanges.push(changeFromPick.change);
    }
  }

  return addedChanges as Change[];
};

export default askMultiple;
