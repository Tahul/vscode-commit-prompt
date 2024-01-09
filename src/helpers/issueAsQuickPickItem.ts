export function detailsFromIssue(issue: any) {
  return [
        `Author: @${issue?.user?.login}`,
        (issue.assignees?.length && issue.assignees.length > 0) ? `Assignees: ${issue.assignees?.map((assignee: any) => `@${assignee.login}`).join(', ')}` : undefined,
      ].filter(Boolean).join(' | ')
}
