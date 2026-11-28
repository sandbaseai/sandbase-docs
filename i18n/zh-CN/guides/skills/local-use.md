---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-zh
title: 在本地使用 Skill
description: 选择一个 SandBase Lab Skill，下载其安装包，配置模型访问权限，并借助本地 Agent 创建和保存项目。
---

# 在本地使用 Skill {#use-a-skill-locally}

下载一个 SandBase Skill，并借助你电脑上的 Agent 完成项目。Skill 包含指令、脚本和示例。Agent 会按照其 `SKILL.md` 中描述的工作流执行。


## 1. 选择 Skill {#_1-choose-a-skill}

1. 打开 [SandBase Lab](https://www.sandbase.ai/lab/)。
2. 浏览视频、动画、地图等示例，打开与你的项目匹配的 Skill。
3. 查看示例、所需输入、输出格式和支持的语言。
4. 使用 Skill 的下载操作保存 ZIP 包。

如果要制作城市历史地图影片，可以从 [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time) 的示例和说明开始。

## 2. 准备本地工作文件夹 {#_2-prepare-a-local-working-folder}

1. 创建一个项目文件夹，例如 `my-city-film`。
2. 将完整的 Skill ZIP 解压到其中，保留指令、脚本和素材。
3. 在本地 Agent 中打开该项目，并授予其访问项目文件以及运行工作流所需命令的权限。
4. 按照 Skill 页面上的安装说明操作，或直接让 Agent 读取解压后的 `SKILL.md`。

项目可以采用以下结构：

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

请使用 Skill 要求的具体文件名和输出位置。

## 3. 连接 SandBase {#_3-connect-sandbase}

将 `set up https://www.sandbase.ai/SKILL.md` 粘贴到你的 Agent 中，并在它打开的浏览器页面中批准登录；或者在终端中运行 `npx -y @sandbaseai/cli@latest connect`。之后请开启一个新的 Agent 会话，以便加载 SandBase 工具。Console 中的 [Build → AI tools](https://www.sandbase.ai/console/setup) 也提供相同的选项。

完整的连接流程请参见[连接 AI 工具](/setup/)。

如果 Skill 的脚本需要 `SANDBASE_API_KEY`：

1. 打开 [API Keys](https://www.sandbase.ai/console/keys)，为该项目创建或选择一个密钥。
2. 通过本地 Agent 的安全设置或脚本执行环境进行配置。
3. 让 Agent 检查访问是否已配置好，然后继续 Skill 工作流。

请将密钥保存在安全的本地配置中。交付物、源文件和公开截图中只应包含项目信息。在 [Billing](https://www.sandbase.ai/console/billing) 中查看模型用量和余额。

## 4. 提供任务简介 {#_4-provide-a-brief}

告诉 Agent 要使用哪个 Skill、要创建什么、输出要求以及你的预算。请根据你的项目调整以下示例：

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

Agent 会读取指令、检查依赖、处理输入，并生成或渲染项目。将 Agent 要求的任何素材添加到同一项目中，然后继续任务。

## 5. 跟踪进度并检查结果 {#_5-follow-progress-and-review-the-result}

耗时取决于 Skill、模型、素材和输出长度。视频项目可能需要几十分钟到几个小时。请保持 Agent 运行，并确保电脑不进入休眠。

在同一对话中询问进度：

```text
Report the current step, files already saved, and the next step, then continue the task.
```

打开交付的文件路径，检查画面、音频、字幕和内容，然后保存最终文件。

## 6. 修改项目 {#_6-revise-the-project}

在原任务中提出具体修改要求，并复用现有素材：

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

如果执行被中断，请保留工作文件夹，并让 Agent 从当前步骤继续。

## 后续步骤 {#next-steps}

- [参加 AI City Remix](/guides/skills/ai-city-remix)
- [连接你的 Agent](/setup/)
- [配置 API 密钥](/getting-started/api-keys)
