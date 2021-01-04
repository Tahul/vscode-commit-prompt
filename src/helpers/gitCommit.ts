import * as cp from "child_process"
import * as fs from "fs"
import * as vscode from "vscode"

export const gitCommit = async (message: string): Promise<void> => {
  // @ts-ignore - get cwd
  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath

  const cwd = fs.realpathSync(rootPath)

  cp.execSync(`git commit -m "${message}"`, { cwd })
}

export default gitCommit
