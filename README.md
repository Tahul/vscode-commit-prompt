# ⛏ vscode-commit-prompt

![VS Marketplace Badge](./docs/vscode-commit-prompt.png)

Commit and manage issues **faster** and **cleaner** with keyboard **prompts** for VS Code.

- 🕹️ Add & commit multiple files without using your mouse once.
- 💄 Improve your git history with two strong default presets.
- 👥 Specify your own questions, types, and scopes and share them with your team.
- ✅ Minimalist approach to GitHub issues management from VS Code quick prompts.

## ⌨️ Actions

### Committing

![Demo](./docs/commit.gif)

All actions that relate to committing code (add, push, commit, undo) revolve around `Cmd+Y` by default.

- `cmd+y` => commit
- `shift+cmd+y` => push
- `alt+cmd+y` => undo
- `shift+alt+cmd+y` => add

#### Commit

Opens the `Commit` prompt.

Prompts for `Add` beforehand if you enabled [`addBeforeCommit`](#-vscode-settings).

Prompt for resolvable closable GitHub issues if you enabled [`githubToken`](#-vscode-settings).

Push after your commit if you enabled [`pushAfterCommit`](#-vscode-settings).

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.commit",
    "key": "ctrl+y",
    "mac": "cmd+y"
  }
  ```

#### Add

Opens the `Add` prompt.

Show changes from the current working tree and allow you to add them individually.

Allows to add `all` (`git add ${workspaceRoot}`) with the first prompt item.

Will `rm` unchecked files from the staged files.

Will be prompted in `Commit` flow with [`addBeforeCommit`](#-vscode-settings), you usually won't need this keybinding.

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.add",
    "key": "shift+alt+ctrl+y",
    "mac": "shift+alt+cmd+y"
  }
  ```

#### Push

Opens the `Push` prompt.

Shows the list of commits that will be pushed.

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.push",
    "key": "shift+ctrl+y",
    "mac": "shift+cmd+y"
  }
  ```

#### Undo

Open the `Undo` prompt.

Allows to undo the last commit and keep the changes (`git reset --soft HEAD^`).

Allows to discard the changes (`git reset --hard HEAD^`).

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.undo",
    "key": "alt+ctrl+y",
    "mac": "alt+cmd+y" // Alt is Option on Mac 😉
  }
  ```

### Issues

![Demo](./docs/issue.gif)

All actions that relate to GitHub issues revolve around `Cmd+U` by default.

Any action related to GitHub issues will need you to provide `githubToken`.

If you do not provide it or the extension fails to gather your issues, it will silently fail, and let you keep using the commit features.

- `cmd+u` => open
- `shift+cmd+u` => close
- `alt+cmd+u` => assign
- `shift+alt+cmd+u` => unassign

#### Open

Open issues on GitHub.

Allows to create a new minimal issue with a similar shape as a commit.

Lists open issues on GitHub and orders between assigned and unassigned issues.

You can toggle if new issues get auto-assigned to you using [`autoAssignOpenedIssues`](#-vscode-settings).

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.open",
    "key": "ctrl+u",
    "mac": "cmd+u"
  }
  ```

#### Close

Close open issues from GitHub.

Lists open issues on GitHub and orders between assigned and unassigned issues.

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.close",
    "key": "shift+ctrl+u",
    "mac": "shimft+cmd+u"
  }
  ```

#### Assign

Self-assign open issues from GitHub.

Lists open issues that are not assigned to you.

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.assign",
    "key": "alt+ctrl+u",
    "mac": "alt+cmd+u"
  }
  ```

#### Unassign

Self-unassign open issues from GitHub.

Lists open issues that are assigned to you.

- Default:
  ```json
  {
    "command": "vscode-commit-prompt.unassign",
    "key": "shift+alt+ctrl+u",
    "mac": "shift+alt+cmd+u"
  }
  ```

## ⚙️ Config

There are two ways to handle the configuration of this extension.

The first is to use the configuration parameters from VSCode, you will find all the available settings under `commit-prompt` keys.

The second is to use config files from the current repository you are working with.

The per-repository config can be specified from 3 places:

- `.cprc` file placed at root.
- `.cp.json` file placed at root.
- "config" key in `package.json`.

The format must be the following:

```json
{
  "config": {
    "commit-prompt": {}
  }
}
```

> If you are willing to share settings like `scopes` with your team, I recommend you use the package.json config key or `.vscode/settings.json`.

### 👤 VSCode settings

```json
{
  "configuration": {
    "properties": {
      "commit-prompt.addAllByDefault": {
        "default": false,
        "description": "Ticks by default `Add all` when opening a new `git add` prompt.",
        "type": "boolean"
      },
      "commit-prompt.addBeforeCommit": {
        "default": true,
        "description": "Always show git add prompt before writing your commit.",
        "type": "boolean"
      },
      "commit-prompt.autoAssignOpenedIssues": {
        "default": true,
        "description": "Automatically assign yourself to any opened issues.",
        "type": "boolean"
      },
      "commit-prompt.commitQuestions": {
        "default": [],
        "description": "Overwrites commits questions from other configuration sources and presets.",
        "type": "array"
      },
      "commit-prompt.githubPerPage": {
        "default": 25,
        "description": "The amount of issues to fetch per page. The smaller the faster your prompts will feel.",
        "type": "number"
      },
      "commit-prompt.githubToken": {
        "description": "Needed to query the GitHub API to manage issues.",
        "type": "string"
      },
      "commit-prompt.issuesQuestions": {
        "default": [],
        "description": "Overwrites issues questions from other configuration sources and presets.",
        "type": "array"
      },
      "commit-prompt.preset": {
        "default": "conventional-commits",
        "description": "Select between the two default presets if you don't override from repository config.",
        "enum": ["conventional-commits", "cz-emoji"],
        "type": "string"
      },
      "commit-prompt.pushAfterCommit": {
        "default": false,
        "description": "Always push after a commit.",
        "type": "boolean"
      },
      "commit-prompt.scopes": {
        "default": [],
        "description": "Overwrites scopes from other configuration sources and presets.",
        "type": "array"
      },
      "commit-prompt.showOutputChannel": {
        "default": "status",
        "description": "The extension preferred output channel after commit.",
        "enum": ["status", "popup", "none"],
        "type": "string"
      },
      "commit-prompt.skipCommitBody": {
        "default": false,
        "description": "Skips the long description step of the default commit prompt.",
        "type": "boolean"
      },
      "commit-prompt.skipCommitIssues": {
        "default": false,
        "description": "Skips the issues step of the default commit prompt.",
        "type": "boolean"
      },
      "commit-prompt.subjectLength": {
        "default": 75,
        "description": "Override the allowed commit message subject length.",
        "type": "number"
      },
      "commit-prompt.types": {
        "default": [],
        "description": "Overwrites types from other configuration sources and presets.",
        "type": "array"
      }
    }
  }
}
```

### 👥 Per repository config

Per repository config exposes three parameters: `scopes`, `types`, and `questions`.

#### _scopes_ (optional)

Scopes is a text input by default, allowing you to define a custom scope on each commit.

If you want to lock scopes and specify a list, you can by using the `scopes` attribute from config.

Specify a list of scopes, and you will be prompted to choose between them on each commit.

```typescript
const scopes: CommitPromptScopeType;

export interface CommitPromptScopeType {
  name: string;
  description: string;
}
```

```json
{
  "config": {
    "commit-prompt": {
      "scopes": [
        {
          "name": "the-next-big-feature",
          "description": "Use this scope when working on our next big feature"
        }
      ]
    }
  }
}
```

#### _types_ (optional)

If you specify this key in config, the default types will be overwritten by yours completely.

Default can be found in [defaultTypes.ts](https://github.com/Tahul/vscode-commit-prompt/blob/main/src/helpers/defaultTypes.ts), copy/pasting them can be a great starting point for your config.

```typescript
const types: CommitPromptType[];

interface CommitPromptType {
  emoji?: string; // The emoji displayed (optional)
  code: string; // The value added to the commit message (gitmojis works)
  description: string; // The description displayed in the prompt
  name: string; // An id
}
```

```json
{
  "config": {
    "commit-prompt": {
      "types": [
        {
          "emoji": "💄",
          "code": ":lipstick:",
          "description": "Updating the UI.",
          "name": "ui"
        }
      ]
    }
  }
}
```

#### _questions_ (optional)

Specifying `questions` key will result in overwriting the complete default scenario.

This means you can easily build your own scenario from the config file.

Note that using this key will result in both types and scopes keys being useless, as you will have to specify these keys directly from your question's payloads.

```typescript
const questions: Question[];

export interface Question {
  name: string;
  type: "oneOf" | "input";
  placeHolder: string;
  prompts?: CommitPromptType[];
  scopes?: CommitPromptScopeType[];
  format?: string;
}
```

```json
{
  "config": {
    "commit-prompt": {
      "questions": [
        {
          "name": "type",
          "placeHolder": "Select the type of change you are committing (type)",
          "type": "oneOf",
          "prompts": [
            {
              "emoji": "💄",
              "code": ":lipstick:",
              "description": "Updating the UI.",
              "name": "ui"
            }
          ],
          "format": "({value})"
        }
      ]
    }
  }
}
```

You can take a look at the [default commit questions](./src/helpers/defaultCommitQuestions.ts) for further customization.

## ⁉️ Why?

[I](https://github.com/Tahul) would like to improve my *commit* / *issues* flow that currently is the source of friction to my code sessions.

Switching between my _issues tracker_, my _code editor_ and the _Git CLI_ is the flow that takes most of my time outside of coding.

Also, I'm used to sending giant commits and that causes me pain every time I review my git history.

This aims to be a minimal, fast, and efficient way to improve my workflow and reduce friction. Maybe it could be yours too?

## ⛏️ Contribute

If you want to contribute to the repository, you can clone the repo and run the app in extension mode by doing:

```
git clone https://github.com/Tahul/vscode-commit-prompt.git && \
cd vscode-commit-promp && \
pnpm install && \
pnpm run dev
```

Once you have run `pnpm run dev`, you can the open the [`Run and Debug`](https://code.visualstudio.com/docs/editor/debugging#:~:text=To%20bring%20up%20the%20Run,debugging%20commands%20and%20configuration%20settings.) tab of VSCode and launch `Run Extension`.

That will open a new VSCode Extension Host tab with the fully working extension, attached to the debugging terminal.

## 👨‍💻 Credits

This VSCode app has been written by [Yaël GUILLOUX](https://twitter.com/yaeeelglx).

This has been heavily inspired by [cz-emoji](https://github.com/ngryman/cz-emoji) by [ngryman](https://github.com/ngryman).

If you have any questions concerning this app, don't hesitate to reach me, on [Twitter](https://twitter.com/yaeeelglx) or by [email](mailto:yael.guilloux@gmail.com).
