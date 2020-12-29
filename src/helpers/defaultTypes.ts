import {
  CommitPromptCodeConfig,
  CommitPromptConfig,
  CommitPromptType,
} from "../config";

/**
 * Default types from commit-prompt.
 */
export const defaultTypes = (
  cpConfig: CommitPromptConfig,
  cpCodeConfig: CommitPromptCodeConfig
): CommitPromptType[] => {
  if (cpConfig.types) {
    return cpConfig.types;
  }

  const types: CommitPromptType[] =
    cpCodeConfig.preset === "cz-emoji"
      ? [
          {
            emoji: "🎨",
            code: ":art:",
            description: "Improving structure / format of the code.",
            name: "style",
          },
          {
            emoji: "⚡️",
            code: ":zap:",
            description: "Improving performance.",
            name: "perf",
          },
          {
            emoji: "🔥",
            code: ":fire:",
            description: "Removing code or files.",
            name: "prune",
          },
          {
            emoji: "🐛",
            code: ":bug:",
            description: "Fixing a bug.",
            name: "fix",
          },
          {
            emoji: "🚑",
            code: ":ambulance:",
            description: "Critical hotfix.",
            name: "quickfix",
          },
          {
            emoji: "✨",
            code: ":sparkles:",
            description: "Introducing new features.",
            name: "feature",
          },
          {
            emoji: "📝",
            code: ":pencil:",
            description: "Writing docs.",
            name: "docs",
          },
          {
            emoji: "🚀",
            code: ":rocket:",
            description: "Deploying stuff.",
            name: "deploy",
          },
          {
            emoji: "💄",
            code: ":lipstick:",
            description: "Updating the UI and style files.",
            name: "ui",
          },
          {
            emoji: "🎉",
            code: ":tada:",
            description: "Initial commit.",
            name: "init",
          },
          {
            emoji: "✅",
            code: ":white_check_mark:",
            description: "Adding tests.",
            name: "test",
          },
          {
            emoji: "🔒",
            code: ":lock:",
            description: "Fixing security issues.",
            name: "security",
          },
          {
            emoji: "🍎",
            code: ":apple:",
            description: "Fixing something on macOS.",
            name: "osx",
          },
          {
            emoji: "🐧",
            code: ":penguin:",
            description: "Fixing something on Linux.",
            name: "linux",
          },
          {
            emoji: "🏁",
            code: ":checkered_flag:",
            description: "Fixing something on Windows.",
            name: "windows",
          },
          {
            emoji: "🤖",
            code: ":robot:",
            description: "Fixing something on Android.",
            name: "android",
          },
          {
            emoji: "🍏",
            code: ":green_apple:",
            description: "Fixing something on iOS.",
            name: "ios",
          },
          {
            emoji: "🔖",
            code: ":bookmark:",
            description: "Releasing / Version tags.",
            name: "release",
          },
          {
            emoji: "🚨",
            code: ":rotating_light:",
            description: "Removing linter warnings.",
            name: "lint",
          },
          {
            emoji: "🚧",
            code: ":construction:",
            description: "Work in progress.",
            name: "wip",
          },
          {
            emoji: "💚",
            code: ":green_heart:",
            description: "Fixing CI Build.",
            name: "fix-ci",
          },
          {
            emoji: "⬇️",
            code: ":arrow_down:",
            description: "Downgrading dependencies.",
            name: "downgrade",
          },
          {
            emoji: "⬆️",
            code: ":arrow_up:",
            description: "Upgrading dependencies.",
            name: "upgrade",
          },
          {
            emoji: "📌",
            code: ":pushpin:",
            description: "Pinning dependencies to specific versions.",
            name: "pushpin",
          },
          {
            emoji: "👷",
            code: ":construction_worker:",
            description: "Adding CI build system.",
            name: "ci",
          },
          {
            emoji: "📈",
            code: ":chart_with_upwards_trend:",
            description: "Adding analytics or tracking code.",
            name: "analytics",
          },
          {
            emoji: "♻️",
            code: ":recycle:",
            description: "Refactoring code.",
            name: "refactoring",
          },
          {
            emoji: "🐳",
            code: ":whale:",
            description: "Work about Docker.",
            name: "docker",
          },
          {
            emoji: "➕",
            code: ":heavy_plus_sign:",
            description: "Adding a dependency.",
            name: "dep-add",
          },
          {
            emoji: "➖",
            code: ":heavy_minus_sign:",
            description: "Removing a dependency.",
            name: "dep-rm",
          },
          {
            emoji: "🔧",
            code: ":wrench:",
            description: "Changing configuration files.",
            name: "config",
          },
          {
            emoji: "🌐",
            code: ":globe_with_meridians:",
            description: "Internationalization and localization.",
            name: "i18n",
          },
          {
            emoji: "✏️",
            code: ":pencil2:",
            description: "Fixing typos.",
            name: "typo",
          },
          {
            emoji: "💩",
            code: ":poop:",
            description: "Writing bad code that needs to be improved.",
            name: "poo",
          },
          {
            emoji: "⏪",
            code: ":rewind:",
            description: "Reverting changes.",
            name: "revert",
          },
          {
            emoji: "🔀",
            code: ":twisted_rightwards_arrows:",
            description: "Merging branches.",
            name: "merge",
          },
          {
            emoji: "📦",
            code: ":package:",
            description: "Updating compiled files or packages.",
            name: "dep-up",
          },
          {
            emoji: "👽",
            code: ":alien:",
            description: "Updating code due to external API changes.",
            name: "compat",
          },
          {
            emoji: "🚚",
            code: ":truck:",
            description: "Moving or renaming files.",
            name: "mv",
          },
          {
            emoji: "📄",
            code: ":page_facing_up:",
            description: "Adding or updating license.",
            name: "license",
          },
          {
            emoji: "💥",
            code: ":boom:",
            description: "Introducing breaking changes.",
            name: "breaking",
          },
          {
            emoji: "🍱",
            code: ":bento:",
            description: "Adding or updating assets.",
            name: "assets",
          },
          {
            emoji: "👌",
            code: ":ok_hand:",
            description: "Updating code due to code review changes.",
            name: "review",
          },
          {
            emoji: "♿️",
            code: ":wheelchair:",
            description: "Improving accessibility.",
            name: "access",
          },
          {
            emoji: "💡",
            code: ":bulb:",
            description: "Documenting source code.",
            name: "docs-code",
          },
          {
            emoji: "🍻",
            code: ":beers:",
            description: "Writing code drunkenly.",
            name: "beer",
          },
          {
            emoji: "💬",
            code: ":speech_balloon:",
            description: "Updating text and literals.",
            name: "texts",
          },
          {
            emoji: "🗃",
            code: ":card_file_box:",
            description: "Performing database related changes.",
            name: "db",
          },
          {
            emoji: "🔊",
            code: ":loud_sound:",
            description: "Adding logs.",
            name: "log-add",
          },
          {
            emoji: "🔇",
            code: ":mute:",
            description: "Removing logs.",
            name: "log-rm",
          },
          {
            emoji: "👥",
            code: ":busts_in_silhouette:",
            description: "Adding contributor(s).",
            name: "contrib-add",
          },
          {
            emoji: "🚸",
            code: ":children_crossing:",
            description: "Improving user experience / usability.",
            name: "ux",
          },
          {
            emoji: "🏗",
            code: ":building_construction:",
            description: "Making architectural changes.",
            name: "arch",
          },
          {
            emoji: "📱",
            code: ":iphone:",
            description: "Working on responsive design.",
            name: "iphone",
          },
          {
            emoji: "🤡",
            code: ":clown_face:",
            description: "Mocking things.",
            name: "clown-face",
          },
          {
            emoji: "🥚",
            code: ":egg:",
            description: "Adding an easter egg.",
            name: "egg",
          },
          {
            emoji: "🙈",
            code: ":see_no_evil:",
            description: "Adding or updating a .gitignore file.",
            name: "see-no-evil",
          },
          {
            emoji: "📸",
            code: ":camera_flash:",
            description: "Adding or updating snapshots.",
            name: "camera-flash",
          },
          {
            emoji: "⚗",
            code: ":alembic:",
            description: "Experimenting new things.",
            name: "experiment",
          },
          {
            emoji: "🔍",
            code: ":mag:",
            description: "Improving SEO.",
            name: "seo",
          },
          {
            emoji: "☸️",
            code: ":wheel_of_dharma:",
            description: "Work about Kubernetes.",
            name: "k8s",
          },
          {
            emoji: "🏷️",
            code: ":label:",
            description: "Adding or updating types (Flow, TypeScript).",
            name: "types",
          },
          {
            emoji: "🌱",
            code: ":seedling:",
            description: "Adding or updating seed files.",
            name: "seed",
          },
          {
            emoji: "🚩",
            code: ":triangular_flag_on_post:",
            description: "Adding, updating, or removing feature flags.",
            name: "flags",
          },
          {
            emoji: "💫",
            code: ":dizzy:",
            description: "Adding or updating animations and transitions.",
            name: "animation",
          },
        ]
      : [
          {
            code: "<feat>",
            description: "A new feature",
            name: "feature",
          },

          {
            code: "<fix>",
            description: "A bug fix",
            name: "bug-fixes",
          },

          {
            code: "<docs>",
            description: "Documentation only changes",
            name: "documentation",
          },

          {
            code: "<style>",
            description: "Changes that do not afect the meaning of the code",
            name: "styles",
          },

          {
            code: "<refactor>",
            description:
              "A code change that neither fixes a bug nor adds a feature",
            name: "code-refactoring",
          },

          {
            code: "<perf>",
            description: "A code change that improves performance",
            name: "performance-improvements",
          },

          {
            code: "<test>",
            description: "Adding missing tests or correcting existing tests",
            name: "tests",
          },

          {
            code: "<build>",
            description:
              "Changes that affect the build system or external dependencies",
            name: "builds",
          },

          {
            code: "<ci>",
            description: "Changes to the CI configuration",
            name: "continuous-integrations",
          },

          {
            code: "<chore>",
            description: "Other changes that don't modify src or test files",
            name: "chores",
          },

          {
            code: "<revert>",
            description: "Reverts a previous commit",
            name: "reverts",
          },
        ];

  return types;
};
