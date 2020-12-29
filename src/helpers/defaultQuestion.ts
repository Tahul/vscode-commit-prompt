import { config } from "process";
import { CzEmojiConfig, CzEmojiType, CzScopeType } from "../config";
import { defaultTypes } from "./defaultTypes";

export interface Question {
  name: string;
  type: "oneOf" | "input";
  placeHolder: string;
  emojiTypes?: CzEmojiType[];
  scopes?: CzScopeType[];
  format?: string;
}

/**
 * Default questions from cz-emoji
 */
export const defaultQuestions = (czConfig: CzEmojiConfig): Question[] => {
  const configTypes = czConfig?.types;
  const types: CzEmojiType[] = configTypes
    ? configTypes
    : defaultTypes(czConfig);

  const configScopes = czConfig?.scopes;
  const scopes: CzScopeType[] | undefined = configScopes
    ? configScopes
    : undefined;

  const questions: Question[] = [
    {
      name: "type",
      placeHolder: "Select the type of change you are committing (type)",
      type: "oneOf",
      emojiTypes: types,
    },
    {
      name: "scope",
      placeHolder: "Specify a scope (scope)",
      type: scopes ? "oneOf" : "input",
      scopes: scopes ? scopes : undefined,
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

  return questions;
};

export default defaultQuestions;
