---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-zh
title: 参加 AI City Remix
description: 领取 AI City Remix 额度，选择城市和 Skill，用本地 Agent 创作视频并上传审核。
---

# 参加 AI City Remix {#enter-ai-city-remix}

在活动页面选择一个 Skill 和城市，然后将完整指令交给你的本地 Agent。创作完成后，Agent 会上传视频、封面和参赛信息并提交审核。


## 前提条件 {#prerequisites}

- 一个 SandBase 账户。
- 一个具备命令执行和文件访问能力的本地 Agent。
- 一个用于存放视频、封面和项目文件的工作文件夹。

首次进行本地设置时，请参阅[在本地使用 Skill](/guides/skills/local-use)。

## 1. 打开活动页面并领取额度 {#_1-open-the-event-and-claim-credits}

1. 打开 [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en)，阅读当前的[活动规则](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en)。
2. 点击“Claim $5 free & create”，并按提示登录。
3. 系统会领取活动额度并尝试自动兑换。请检查余额和兑换状态；如需重试，请使用兑换操作。
4. 领取后，点击“Create now”打开创作对话框。

领取日期、名额和参与资格以活动页面显示为准。模型调用按实际用量消耗额度；可在[账单](https://www.sandbase.ai/console/billing)中查看。

## 2. 配置模型 API 密钥 {#_2-configure-a-model-api-key}

如果你的账户没有可用的 API 密钥，流程中会弹出“Create an API key”对话框。

1. 查看显示的支出上限和有效期，然后点击“Create API key”。
2. 点击“Create with this key”。新密钥会包含在交给 Agent 的完整指令中。
3. 将完整指令发送给你信任的 Agent，并保存在私密的工作区中。

如果使用已有密钥，请通过本地 Agent 的安全设置或执行环境配置 `SANDBASE_API_KEY`。可在 [API Keys](https://www.sandbase.ai/console/keys) 中管理密钥。

## 3. 选择 Skill 和创意简介 {#_3-choose-a-skill-and-brief}

对话框打开时已预选了一个官方 Skill、城市、故事和创意方向。

- 展开“Official Skill”，阅读摘要和详情，并选择一种视觉风格。
- 展开“Creative brief”，搜索城市或在地图上选择地点。
- 随机切换建议，或直接编辑故事和创意方向。
- 确认地图位置、支持的语言和输出风格。

涉及历史、人物和事件时，请使用可核实的来源。语言和时长的支持情况请查看所选 Skill 的详情。

## 4. 复制指令并开始创作 {#_4-copy-the-instructions-and-create}

1. 在提示词区域点击“Copy all”。
2. 在本地 Agent 中打开项目文件夹，新建任务并粘贴完整指令。
3. 发送指令，按要求提供输入、配置依赖，然后开始创作。

指令中包含所选 Skill、创意简介、参赛元数据格式和上传授权。请完整交接，以便 Agent 能够创作并提交作品。

“Preparing”表示正在准备上传权限。点击“Retry”可重新准备，点击“Complete brief”可补充缺失的信息。

## 5. 跟踪创作进度 {#_5-follow-creation-progress}

根据 Skill、模型和视频时长的不同，创作可能需要几十分钟到数小时，并会消耗模型额度。请保持 Agent 运行，并防止电脑休眠。

在同一任务中补充预算和进度指令：

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

按照当前活动规则的要求，通过 SandBase 使用 MiniMax M3.1 Flash。时长、分辨率、字幕和文件大小请遵循活动页面和上传页面的要求。

## 6. 提交并查看审核状态 {#_6-submit-and-check-review-status}

Agent 会按照完整指令使用官方上传客户端，上传视频、封面和元数据，并提交审核。

打开 [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) 查看进度：

| 状态 | 下一步 |
|---|---|
| 草稿 | 完成影片、上传文件并提交审核。 |
| 待审核 | 关注审核状态。 |
| 已通过 | 打开公开的作品页面并分享。 |
| 需要修改 | 根据审核意见修改后重新提交。 |

如果已有成片，请在活动页面选择“Upload existing video”，填写信息，上传视频和封面，然后提交审核。

## 7. 继续上传 {#_7-resume-an-upload}

如果授权过期或上传中断，请使用原始文件继续：

1. 保留视频、封面、`entry.json` 和工作文件夹。
2. 在 My entries 中找到同一份草稿，点击“Resume upload”。
3. 将新的续传指令复制到原来的 Agent 任务中。
4. 让 Agent 上传并提交已有文件，然后在 My entries 中查看状态。

## 8. 分享作品 {#_8-share-your-entry}

在已通过的作品页面上，点击“Share on X”打开预填好内容的编辑器。其中包含作品链接、`#AICityRemix`、`@SandbaseAI` 以及官方活动帖子。

如需发布视频帖子，请先点击“Download video”，在 X 编辑器中添加该文件，检查文案后发布。

## 相关文档 {#related-documentation}

- [在本地使用 Skill](/guides/skills/local-use)
- [连接你的 Agent](/setup/)
- [配置 API 密钥](/getting-started/api-keys)
