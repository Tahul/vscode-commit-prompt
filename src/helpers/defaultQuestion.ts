import { CzEmojiType } from "../config";
import { defaultTypes } from "./defaultTypes";

export interface Question {
  name: string;
  type: "oneOf" | "input";
  placeHolder: string;
  picks?: CzEmojiType[];
  format?: string;
}

/**
 * Default questions from cz-emoji
 */
export const defaultQuestions: Question[] = [
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
];

export default defaultQuestions;
