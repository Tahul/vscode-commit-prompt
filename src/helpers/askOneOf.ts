import * as vscode from "vscode";
import ask from "./ask";
import { CommitPromptType, CpScopeType } from "../config";
import { Question } from "./defaultQuestion";

/**
 * Cast an Emoji Type from commit-prompt into a QuickPickItem from VSCode.
 *
 * @param emojiTypes CommitPromptType[]
 */
const castTypesToQuickPickItems = (
  emojiTypes: CommitPromptType[]
): vscode.QuickPickItem[] => {
  return emojiTypes.map(
    (emojiType: CommitPromptType): vscode.QuickPickItem => {
      return {
        label: emojiType.code,
        description: `${emojiType?.emoji ? `${emojiType.emoji} | ` : ``}${
          emojiType.description
        } (${emojiType.name})`,
      };
    }
  );
};

/**
 * Cast a Scope Type from commit-prompt into a QuickPickItem from VSCode.
 *
 * @param scopes
 */
const castScopesToQuickPickItems = (
  scopes: CpScopeType[]
): vscode.QuickPickItem[] => {
  return scopes.map(
    (scope: CpScopeType): vscode.QuickPickItem => {
      return {
        label: scope.name,
        description: scope.description,
      };
    }
  );
};

/**
 * Ask a selectable question using showQuickPick.
 *
 * @param question Question
 */
export const askOneOf = async (question: Question): Promise<string> => {
  let quickpickItems: vscode.QuickPickItem[] = [];

  // No types nor scopes, return a plain input
  if (!question.emojiTypes && !question.scopes) {
    return await ask(question);
  }

  // Add emoji types to quickpick
  if (question.emojiTypes) {
    quickpickItems = castTypesToQuickPickItems(question.emojiTypes);
  }

  // Add scopes to quickpick
  if (question.scopes) {
    quickpickItems = [
      ...quickpickItems,
      ...castScopesToQuickPickItems(question.scopes),
    ];
  }

  const pickOptions: vscode.QuickPickOptions = {
    placeHolder: question.placeHolder,
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
  };

  const pick = await vscode.window.showQuickPick(quickpickItems, pickOptions);

  if (pick === undefined) {
    throw new Error("Input escaped, commit cancelled.");
  }

  // Return formatted question result
  if (question.format) {
    return question.format.replace("{value}", pick.label);
  }

  return pick.label;
};

export default askOneOf;
