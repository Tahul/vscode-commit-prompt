import * as vscode from "vscode";
import { CommandCallback } from ".";
import { CzEmojiCodeConfig, CzEmojiConfig } from "../config";
import ask from "../helpers/ask";
import askOneOf from "../helpers/askOneOf";
import { getQuestions } from "../helpers/getQuestions";
import { API as GitAPI } from "../typings/git";
import add from "./add";

export const commit = (
  git: GitAPI,
  context: vscode.ExtensionContext,
  czConfig: CzEmojiConfig,
  czCodeConfig: CzEmojiCodeConfig
): CommandCallback => {
  const questions = getQuestions(czConfig, czCodeConfig);

  return async () => {
    let commitMessage: string = "";

    for (const question of questions) {
      if (question.type === "oneOf") {
        commitMessage += await askOneOf(question, commitMessage);
      }

      if (question.type === "input") {
        commitMessage += await ask(question, commitMessage);
      }
    }

    console.log(commitMessage);
  };
};

export default commit;
