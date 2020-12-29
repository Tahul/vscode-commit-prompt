# 💄 vscode-cz-emoji

Commit faster and cleaner with [cz-emoji](https://github.com/ngryman/cz-emoji) support for VS Code.

- ⌨ Commit multiple files without using your mouse once.
- 💄 Improve your git history with a strong default preset.
- ⚙ Specify your own questions, types, scopes from a simple config file.
- ✅ Based on the well known [commitizen](https://github.com/commitizen/cz-cli) and [Conventional Commits](https://www.conventionalcommits.org/).

## 🎮 Demo

This demo shows a simple commit, with the default setup you will get after installing the extension.

![Demo]()

## ⚙️ Config

The config can be specified from 3 places:

- `.czrc` file placed at root.
- `.cz.json` file placed at root.
- "config" key in `package.json`.

The format must be the following:

```json
{
  "config": {
    "cz-emoji": {}
  }
}
```

### Config keys

#### _scopes_ (optional)

Scopes is a text input by default, allowing you to define a custom scope on each commit.

If you want to lock scopes, and specify a list, you can by using the `scope` attribute from config.

Specify a list of scope, and you will be prompted to chose between them on each commit.

```typescript
const scopes: CzScopeType;

export interface CzScopeType {
  name: string;
  description: string;
}
```

```json
{
  "config": {
    "cz-emoji": {
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

Default can be found in [defaultTypes.ts](https://github.com/Tahul/vscode-cz-emoji/blob/main/src/helpers/defaultTypes.ts), copy/pasting them can be a great starting point for your own config.

```typescript
const types: CzEmojiType[];

interface CzEmojiType {
  emoji: string;
  code: string;
  description: string;
  name: string;
}
```

```json
{
  "config": {
    "cz-emoji": {
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
  emojiTypes?: CzEmojiType[];
  scopes?: CzScopeType[];
  format?: string;
}
```

```json
{
  "config": {
    "cz-emoji": {
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
