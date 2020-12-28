import * as vscode from "vscode";
import { Change, Status } from "../typings/git";
import ask from "./ask";
import { Question } from "./getQuestions";

const castChangesToQuickPickItems = (
  changes: Change[],
  cwd: string
): vscode.QuickPickItem[] => {
  return changes.map(
    (change: Change): vscode.QuickPickItem => {
      return {
        label: change.uri.path.replace(cwd, ""),
        picked: [
          Status.INDEX_MODIFIED,
          Status.ADDED_BY_US,
          Status.ADDED_BY_THEM,
          Status.BOTH_ADDED,
        ].includes(change.status),
      };
    }
  );
};

export const askMultiple = async (changes: Change[]): Promise<Change[]> => {
  // @ts-ignore
  const cwd: string = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const addedChanges: Change[] = [];
  const pickOptions: vscode.QuickPickOptions = {
    placeHolder: "Add files",
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
    canPickMany: true,
  };

  // @ts-ignore
  const picks: vscode.QuickPickItem[] = await vscode.window.showQuickPick(
    castChangesToQuickPickItems(changes, cwd),
    pickOptions
  );

  if (!picks) {
    return [];
  }

  for (const pick of picks) {
    const changeFromPick = changes.find((change: Change): boolean => {
      const uri = change.uri.path.replace(cwd, "");
      return pick.label === uri;
    });

    if (changeFromPick) {
      addedChanges.push(changeFromPick);
    }
  }

  return addedChanges as Change[];
};

export default askMultiple;
