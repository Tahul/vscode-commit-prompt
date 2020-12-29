import { CommandCallback } from ".";
import askMultiple from "../helpers/askMultiple";
import { getCurrentChanges } from "../helpers/getCurrentChanges";
import { gitAdd } from "../helpers/gitAdd";
import { gitRemove } from "../helpers/gitRemove";
import { API as GitAPI, Change, Repository } from "../typings/git";

/**
 * Show a multi pick prompt with modified files.
 * Picked = added to next commit
 * Unpicked = not added to next commit
 *
 * @param git GitAPI
 */
export const add = (git: GitAPI): CommandCallback => {
  return async () => {
    let picks: Change[] = [];

    try {
      picks = await askMultiple(await getCurrentChanges(git));
    } catch (e) {
      console.log("Cancelling adding!");
      return false;
    }

    const repo: Repository = git.repositories[0];

    // Get added changes
    const { indexChanges } = repo.state;

    // Remove unpicked files
    for (const change of indexChanges) {
      if (
        !picks.find((pickedChange: Change): boolean => {
          return pickedChange.uri.fsPath === change.uri.fsPath;
        })
      ) {
        await gitRemove(git, repo, change);
      }
    }

    // Add picked ones
    for (const pick of picks) {
      await gitAdd(git, repo, pick);
    }

    return true;
  };
};

export default add;
