---
agentDoc: local-use-agent-en
title: Use a Skill Locally
description: Choose a SandBase Lab Skill, download its package, configure model access, and create and save a project with a local agent.
---

# Use a Skill locally

Download a SandBase Skill and complete a project with an agent on your computer. A Skill contains instructions, scripts, and examples. The agent follows the workflow described in its `SKILL.md`.


## 1. Choose a Skill

1. Open [SandBase Lab](https://www.sandbase.ai/lab/).
2. Browse examples such as videos, animations, and maps. Open a Skill that matches your project.
3. Review the example, required inputs, output format, and supported languages.
4. Use the Skill download action to save the ZIP package.

For a city-history map film, start with the examples and instructions for [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Prepare a local working folder

1. Create a project folder, such as `my-city-film`.
2. Extract the complete Skill ZIP into it, keeping the instructions, scripts, and assets.
3. Open the project in your local agent and grant access to its files and the commands required by the workflow.
4. Follow the Skill page's installation instructions, or ask the agent to read the extracted `SKILL.md` directly.

A project can use this structure:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Use the specific filenames and output locations required by the Skill.

## 3. Connect SandBase

Paste `set up https://www.sandbase.ai/SKILL.md` into your agent and approve the browser sign-in it opens, or run `npx -y @sandbaseai/cli@latest connect` in a terminal. Start a new agent session afterwards so the SandBase tools load. The same options are on [Build → AI tools](https://www.sandbase.ai/console/setup) in the Console.

See [Connect AI tools](/setup/) for the full connection workflow.

If the Skill's scripts require `SANDBASE_API_KEY`:

1. Open [API Keys](https://www.sandbase.ai/console/keys) and create or select a key for the project.
2. Configure it through your local agent's secure settings or the script execution environment.
3. Ask the agent to check that access is configured and continue the Skill workflow.

Keep the key in secure local configuration. Include only project information in deliverables, source files, and public screenshots. View model usage and your balance in [Billing](https://www.sandbase.ai/console/billing).

## 4. Provide a brief

Tell the agent which Skill to use, what to create, the output requirements, and your budget. Adapt this example to your project:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

The agent reads the instructions, checks dependencies, processes inputs, and generates or renders the project. Add any requested assets to the same project and continue the task.

## 5. Follow progress and review the result

Duration depends on the Skill, models, assets, and output length. Video projects may take tens of minutes to several hours. Keep the agent running and the computer awake.

Ask for progress in the same conversation:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Open the delivered file paths, review visuals, audio, captions, and content, and save the final files.

## 6. Revise the project

Request specific changes in the original task and reuse the existing assets:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

If execution is interrupted, keep the working folder and ask the agent to continue from the current step.

## Next steps

- [Enter AI City Remix](/guides/skills/ai-city-remix)
- [Connect your agent](/setup/)
- [Configure API keys](/getting-started/api-keys)
