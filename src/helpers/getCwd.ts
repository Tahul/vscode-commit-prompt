import * as vscode from "vscode"

export function getCwd() {
  // Get the currently active text editor
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    // Get the file URI of the currently open file
    const fileUri = editor.document.uri;

    // Find the workspace folder containing the file
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);

    if (workspaceFolder) {
      return workspaceFolder.uri.fsPath;
    }
  }

  // If no workspace folder was found for the currently open file,
  // fall back to the first workspace root if available
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.fsPath;
  }

  // If no workspace folders are available, return undefined
  return undefined;
}
