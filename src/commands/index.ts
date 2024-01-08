import * as vscode from 'vscode'
import {
  EXTENSION_NAME,
} from '../config'

// Commands
import type { CommitPromptExtensionContext } from '../extension'
import add from './add'
import commit from './commit'
import undo from './undo'
import assign from './assign'
import push from './push'
import open from './open'
import close from './close'
import unassign from './unassign'

export type CommandCallback = (...args: any[]) => any

export interface CommandReference {
  reference: string
  command: CommandCallback
}

export function generateCommands(extensionContext: CommitPromptExtensionContext): vscode.Disposable[] {
  const disposables: vscode.Disposable[] = []

  const commands: CommandReference[] = [
    {
      reference: 'commit',
      command: commit(extensionContext),
    },
    {
      reference: 'add',
      command: add(extensionContext),
    },
    {
      reference: 'undo',
      command: undo(extensionContext),
    },
    {
      reference: 'push',
      command: push(extensionContext),
    },
    {
      reference: 'assign',
      command: assign(extensionContext),
    },
    {
      reference: 'open',
      command: open(extensionContext),
    },
    {
      reference: 'close',
      command: close(extensionContext),
    },
    {
      reference: 'unassign',
      command: unassign(extensionContext),
    },
  ]

  for (const { reference, command } of commands) {
    disposables.push(
      vscode.commands.registerCommand(`${EXTENSION_NAME}.${reference}`, command),
    )
  }

  return disposables
}

export default generateCommands
