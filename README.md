# ⛏ vscode-commit-prompt

![VS Marketplace Badge](https://vsmarketplacebadge.apphb.com/version-short/yaelguilloux.vscode-commit-prompt.svg)

Commit **faster** and **cleaner** with keybound formatted **commit prompt** for VS Code.

- ⌨ Add & commit multiple files without using your mouse once.
- 💄 Improve your git history with two strong default presets.
- ⚙ Specify your own questions, types, scopes from a simple config file.
- ✅ Based on the well known [commitizen](https://github.com/commitizen/cz-cli) and [Conventional Commits](https://www.conventionalcommits.org/).

## 🎮 Demo

This [demo](https://github.com/Tahul/vscode-commit-prompt/blob/main/docs/demo.gif?raw=true) shows a simple commit, with the default setup you will get after installing the extension, with the `conventional-commits` preset.

You can also find a demo of the `cz-emoji` preset [here](https://github.com/Tahul/vscode-commit-prompt/blob/main/docs/demo_emoji.gif?raw=true).

![conventional-commits](https://github.com/Tahul/vscode-commit-prompt/blob/main/docs/demo.gif?raw=true)

## ⌨️ Keybindings

The default keybinding for `Commit` command is `Cmd+Y`.

The default keybinding is the following:

```json
{
  "command": "vscode-commit-prompt.commit",
  "key": "ctrl+y",
  "mac": "cmd+y",
  "when": "editorTextFocus"
}
```

You can edit it from your own vscode keybindings settings using the key `vscode-commit-prompt.commit`.

You can also add a key for the `Add` command only using `vscode-commit-prompt.add`.

## ⚙️ Config

There is two way to handle the configuration of this extension.

The first is to use the configuration parameters from VSCode, you will find all the available settings under `commit-prompt` keys.

The second is to use config files from the current repository you are working with.

The per repository config can be specified from 3 places:

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

> I recommend you to use the package.json config key.

### VSCode settings

VSCode settings exposes three parameters:

#### Add Before Commit `commit-prompt.addBeforeCommit`

Whether or not you want the extension to show the `add` each team you hit the `commit` command.

Default: `true`

#### Subject Length `commit-prompt.subjectLength`

The max allowed length for the commit subject.

Default: `75`

#### Show Output Channel `commit-prompt.showOutputChannel`

Show the output channel when you commit.

This allows three values: `onError`, `off`, `always`.

Default: `onError`

### Per repository config

Per repository config exposes three parameters: `scopes`, `types` and `questions`.

#### _scopes_ (optional)

Scopes is a text input by default, allowing you to define a custom scope on each commit.

If you want to lock scopes, and specify a list, you can by using the `scope` attribute from config.

Specify a list of scope, and you will be prompted to chose between them on each commit.

```typescript
const scopes: CpScopeType;

export interface CpScopeType {
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

Default can be found in [defaultTypes.ts](https://github.com/Tahul/vscode-commit-prompt/blob/main/src/helpers/defaultTypes.ts), copy/pasting them can be a great starting point for your own config.

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

This means you easily build your own scenario from the config file.

Note that using this key will result in both types and scopes keys to be useless, as you will have to specify these keys directly from your questions payloads.

```typescript
const questions: Question[];

export interface Question {
  name: string;
  type: "oneOf" | "input";
  placeHolder: string;
  emojiTypes?: CommitPromptType[];
  scopes?: CpScopeType[];
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
          "emojiTypes": [
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

## 👨‍💻 Credits

This VSCode app has been written by [Yaël GUILLOUX](https://twitter.com/yaeeelglx).

This has been heavily inspired by [cz-emoji](https://github.com/ngryman/cz-emoji) by [ngryman](https://github.com/ngryman).

If you have any question concerning this app, don't hesitate to reach me, on [Twitter](https://twitter.com/yaeeelglx) or by [email](mailto:yael.guilloux@gmail.com).
