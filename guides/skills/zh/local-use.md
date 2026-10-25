---
agentDoc: local-use-agent-zh
title: 在本地使用 Skill
description: 在 SandBase Lab 选择 Skill，下载完整文件包，连接模型服务，并在本地 Agent 中制作和保存作品。
lang: zh-CN
---

# 在本地使用 Skill

本教程介绍如何下载 SandBase Skill，并在本地 Agent 中完成一次创作。Skill 包含任务说明、脚本和示例，Agent 根据其中的 `SKILL.md` 执行流程。


## 1. 选择 Skill

1. 打开 [SandBase Lab](https://www.sandbase.ai/lab/)。
2. 浏览视频、动效、地图等示例，进入适合自己创作目标的 Skill 详情页。
3. 查看示例成品、输入要求、输出格式及支持的语言。
4. 点击页面上的 Skill 下载入口，保存 ZIP 文件。

例如，制作城市历史地图视频时，可以查看 [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time) 的示例和说明。

## 2. 准备本地工作文件夹

1. 在电脑上创建一个项目文件夹，例如 `my-city-film`。
2. 将 Skill ZIP 解压到该文件夹，保留包内的说明、脚本和素材。
3. 在本地 Agent 中打开这个文件夹，允许它访问本项目的文件并执行所需命令。
4. 按 Skill 详情页的安装说明完成安装，或直接让 Agent 读取解压后的 `SKILL.md`。

项目文件可以按以下方式整理：

```text
my-city-film/
  skill/          # 解压后的完整 Skill 文件夹
  inputs/         # 图片、文字等输入素材
  outputs/        # 成品与预览
```

具体文件名称和输出位置以 Skill 的说明为准。

## 3. 连接 SandBase

打开 [Console Setup](https://www.sandbase.ai/console/setup)，选择正在使用的 Agent，按照页面给出的步骤完成连接和浏览器授权。完成后按提示重新打开 Agent 会话。

完整连接流程见 [Setup](/setup/)。

如果所选 Skill 的脚本要求 `SANDBASE_API_KEY`：

1. 打开 [API Keys](https://www.sandbase.ai/console/keys)，创建或选择本次使用的 Key。
2. 在本地 Agent 的安全配置或脚本运行环境中配置该 Key。
3. 让 Agent 检查运行环境是否已配置，并继续执行 Skill。

API Key 保存在本地安全配置中；作品、代码和公开截图中只保留创作信息。模型调用费用与余额可在[账单页面](https://www.sandbase.ai/console/billing)查看。

## 4. 提交创作需求

在 Agent 对话中说明所选 Skill、主题、输出要求和预算。下面的示例可按项目修改后使用：

```text
请读取当前项目中 skill 文件夹里的 SKILL.md，按它的流程完成创作。

主题：上海的城市发展故事。
输出：可播放的视频成品、封面和使用说明。
语言与时长：按该 Skill 的支持范围制作，开始前列出具体安排。
模型：通过 SandBase 调用适合本任务的模型。
预算：本次模型调用上限为【填写金额】美元，超过前请先向我确认。

请先检查输入和依赖，再开始执行。将预览和最终文件保存在 outputs 文件夹，
完成后给出文件路径、制作摘要和实际使用的模型。
```

Agent 会读取说明、检查依赖、处理输入素材并执行生成或渲染。需要补充素材时，在同一项目中提供文件并继续任务。

## 5. 查看进度与成品

制作耗时取决于 Skill、模型、素材和作品长度，视频任务可能需要数十分钟至数小时。制作期间保持 Agent 运行，并让电脑保持唤醒。

可以在同一对话中查看进度：

```text
请汇报当前步骤、已经保存的文件和下一步安排，然后继续当前任务。
```

完成后打开 Agent 给出的文件路径，预览画面、声音、字幕和内容，并保存最终文件。

## 6. 修改作品

在原任务中描述需要修改的片段或效果，继续使用已有素材和工作文件。例如：

```text
保留现有结构和其他镜头，将开头缩短，并修正 00:18 的字幕。
请复用已生成的素材，将修改后的成品另存为新版本。
```

遇到执行中断时，保留项目文件夹，让 Agent 从当前步骤继续。

## 下一步

- [AI City Remix 参赛教程](/guides/skills/zh/ai-city-remix)
- [连接 Agent](/setup/)
- [API Key 配置](/getting-started/api-keys)
