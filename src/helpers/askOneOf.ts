import * as vscode from "vscode";
import { CzEmojiType } from "../config";
import ask from "./ask";
import { Question } from "./getQuestions";

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

export const askOneOf = async (
  question: Question,
  currentValue?: string
): Promise<string> => {
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
    return "";
  }

  // Return formatted question result
  if (question.format) {
    return question.format.replace("{value}", pick.label);
  }

  return pick.label;
};

export default askOneOf;
