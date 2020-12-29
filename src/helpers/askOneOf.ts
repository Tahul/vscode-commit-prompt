import * as vscode from "vscode";
import ask from "./ask";
import { CzEmojiType } from "../config";
import { Question } from "./defaultQuestion";

/**
 * Cast an Emoji Type from cz-emoji into a QuickPickItem from VSCode.
 *
 * @param emojiTypes CzEmojiType[]
 */
const castTypesToQuickPickItems = (
  emojiTypes: CzEmojiType[]
): vscode.QuickPickItem[] => {
  return emojiTypes.map(
    (emojiType: CzEmojiType): vscode.QuickPickItem => {
      return {
        label: emojiType.code,
        description: `${emojiType.emoji} | ${emojiType.description} (${emojiType.name})`,
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
  if (!question.picks) {
    return await ask(question);
  }

  const pickOptions: vscode.QuickPickOptions = {
    placeHolder: question.placeHolder,
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
  };

  const pick = await vscode.window.showQuickPick(
    castTypesToQuickPickItems(question.picks),
    pickOptions
  );

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
