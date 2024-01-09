import * as vscode from 'vscode'

export function paginateIssuesItems(
  issuesItems: vscode.QuickPickItem[],
  page: number,
  perPage: number = 25,
): vscode.QuickPickItem[] {
  return [
    ...(page > 1 ? [{ label: `Previous page`, detail: `Goes to page ${(page - 1 >= 1 ? page - 1 : 1).toString()}`, iconPath: new vscode.ThemeIcon('chevron-left') }] : []),
    ...issuesItems,
    ...(issuesItems.length >= (perPage || 25) ? [{ label: 'Next page', detail: `Goes to page ${(page + 1).toString()}`, iconPath: new vscode.ThemeIcon('chevron-right') }] : []),
  ]
}
