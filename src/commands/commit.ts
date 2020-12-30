import * as vscode from "vscode";
import ask from "../helpers/ask";
import askOneOf from "../helpers/askOneOf";
import getQuestions from "../helpers/getQuestions";
import gitCommit from "../helpers/gitCommit";
import add from "./add";
import { CommitPromptCodeConfig, CommitPromptConfig } from "../config";
import { API as GitAPI } from "../typings/git";
import { CommandCallback } from ".";

export const commit = (
  git: GitAPI,
  cpConfig: CommitPromptConfig,
  cpCodeConfig: CommitPromptCodeConfig
): CommandCallback => {
  const questions = getQuestions(cpConfig, cpCodeConfig);

  return async () => {
    if (cpCodeConfig.addBeforeCommit) {
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
        if (["onError", "always"].includes(cpCodeConfig.showOutputChannel)) {
          console.log("Cancelling commit!");
        }

        return;
      }
    }

    if (cpCodeConfig.showOutputChannel === "always") {
      console.log("Commiting:\n");
      console.log(commitMessage);
    }

    await gitCommit(commitMessage);

    // Await for sync after commit so the change list gets updated.
    await vscode.commands.executeCommand("git.sync");
  };
};

export default commit;
