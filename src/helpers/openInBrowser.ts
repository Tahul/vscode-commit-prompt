import * as vscode from 'vscode'

export function openInBrowser(url: string) {
  return vscode.env.openExternal(vscode.Uri.parse(url))
}
