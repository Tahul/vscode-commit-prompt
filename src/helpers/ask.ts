import * as vscode from "vscode";
import { Question } from "./getQuestions";

export const ask = async (
  question: Question,
  currentValue?: string
): Promise<string> => {
  const options: vscode.InputBoxOptions = {
    placeHolder: question.placeHolder,
    ignoreFocusOut: true,
    prompt: currentValue,
  };

  const input = await vscode.window.showInputBox(options);

  if (input === undefined || input === "") {
    return "";
  }

  // Return formatted question result
  if (question.format) {
    return question.format.replace("{value}", input);
  }

  return input;
};

export default ask;
