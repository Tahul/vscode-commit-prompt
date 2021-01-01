import { API as GitAPI, Change, Repository } from "../typings/git";

export interface IndexChange {
  type: "index" | "working";
  change: Change;
}

/**
 * Return the current branch changes.
 *
 * @param git GitAPI
 */
export const getCurrentChanges = async (
  git: GitAPI
): Promise<IndexChange[]> => {
  const repo: Repository = git.repositories[0];

  const indexChanges: Change[] = repo.state.indexChanges;

  const workingTreeChanges: Change[] = repo.state.workingTreeChanges;

  const changes: IndexChange[] = [
    ...indexChanges.map<IndexChange>((change: any) => {
      return {
        change,
        type: "index",
      };
    }),
    ...workingTreeChanges.map<IndexChange>((change: any) => {
      return {
        change,
        type: "working",
      };
    }),
  ];

  return changes;
};
