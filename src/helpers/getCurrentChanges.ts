import { API as GitAPI, Change, Repository } from "../typings/git";

export const getCurrentChanges = async (git: GitAPI): Promise<Change[]> => {
  const repo: Repository = git.repositories[0];

  const changes = [
    ...repo.state.indexChanges,
    ...repo.state.workingTreeChanges,
  ];

  return changes;
};
