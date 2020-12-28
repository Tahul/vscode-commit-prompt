import * as vscode from "vscode";
import { CzEmojiCodeConfig, CzEmojiConfig, CzEmojiType } from "../config";
import { defaultTypes } from "./defaultTypes";

export interface Question {
  name: string;
  type: "oneOf" | "input";
  placeHolder: string;
  picks?: CzEmojiType[];
  format?: string;
}

export const getQuestions = (
  czConfig: CzEmojiConfig,
  czCodeConfig: CzEmojiCodeConfig
): Question[] => {
  const questions: Question[] = !czConfig.questions
    ? [
        {
          name: "type",
          placeHolder: "Select the type of change you are committing (type)",
          type: "oneOf",
          picks: defaultTypes,
        },
        {
          name: "scope",
          placeHolder: "Specify a scope (scope)",
          type: "input",
          format: " ({value}) ",
        },
        {
          name: "subject",
          placeHolder: "Write a short description (subject)",
          type: "input",
        },
        {
          name: "body",
          placeHolder: "Maybe provide a longer description (body)",
          type: "input",
          format: "\n\n{value}", // Break 2 lines for body
        },
        {
          name: "issues",
          placeHolder: "List any issue closed (issues)",
          type: "input",
          format: "\n\nIssues: {value}", // Break 2 lines for issues
        },
      ]
    : czConfig.questions;

  return questions;
};

export default getQuestions;
