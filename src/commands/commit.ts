import * as vscode from "vscode";
import ask from "../helpers/ask";
import askOneOf from "../helpers/askOneOf";
import getQuestions from "../helpers/getQuestions";
import gitCommit from "../helpers/gitCommit";
import add from "./add";
import { CzEmojiCodeConfig, CzEmojiConfig } from "../config";
import { API as GitAPI } from "../typings/git";
import { CommandCallback } from ".";

export const commit = (
  git: GitAPI,
  czConfig: CzEmojiConfig,
  czCodeConfig: CzEmojiCodeConfig
): CommandCallback => {
  const questions = getQuestions(czConfig);

  return async () => {
    if (czCodeConfig.addBeforeCommit) {
      const addResult: boolean = await add(git)();

      // Cancel prompts if escaped
      if (addResult === false) return;
    }

    let commitMessage: string = "";

    for (const question of questions) {
      try {
        if (question.type === "oneOf") {
          commitMessage += await askOneOf(question);
        }

        if (question.type === "input") {
          commitMessage += await ask(question, commitMessage);
        }
      } catch (e) {
        console.log("Cancelling commit!");
        return;
      }
    }

    console.log("Commiting:\n");
    console.log(commitMessage);

    await gitCommit(commitMessage);
  };
};

export default commit;
