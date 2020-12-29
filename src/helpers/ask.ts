import * as vscode from "vscode";
import { Question } from "./defaultQuestion";

/**
 * Ask a question using showInputBox and displays the current value inside the prompt.
 * @param question
 * @param currentValue
 */
export const ask = async (
  question: Question,
  currentValue?: string
): Promise<string> => {
  const options: vscode.InputBoxOptions = {
    placeHolder: question.placeHolder,
    ignoreFocusOut: true,
    prompt: currentValue,
  };

  if (question.maxLength && question.maxLength !== undefined) {
    options.validateInput = (input: string) => {
      if (question.maxLength && input.length > question.maxLength) {
        return `This input cannot be longer than ${question.maxLength}`;
      }

      return null;
    };
  }

  const input = await vscode.window.showInputBox(options);

  if (input === undefined) {
    throw new Error("Input escaped, commit cancelled.");
  }

  if (input === "") {
    return "";
  }

  // Return formatted question result
  if (question.format) {
    return question.format.replace("{value}", input);
  }

  return input;
};

export default ask;
