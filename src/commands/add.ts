import { Address } from "cluster";
import * as vscode from "vscode";
import { CommandCallback } from ".";
import askMultiple from "../helpers/askMultiple";
import { getCurrentChanges } from "../helpers/getCurrentChanges";
import { API as GitAPI, Change, Repository, Status } from "../typings/git";

export const add = (git: GitAPI): CommandCallback => {
  return async () => {
    const picks: Change[] = await askMultiple(await getCurrentChanges(git));

    for (const pick of picks) {
      const repo: Repository = git.repositories[0];
    }
  };
};

export default add;
