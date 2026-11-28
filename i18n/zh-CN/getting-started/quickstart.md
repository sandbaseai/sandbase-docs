---
i18nSource: 8cb9626a2127cb8d
title: 快速入门
description: 选择 SandBase 的使用方式：在平台上、通过 API，或配合你的 Agent。查找 Skills 和 Tools，按步骤操作，并从 SDK 或 CLI 仓库开始。
pageClass: quickstart-page
---

# 快速入门 {#quick-start}

## 选择 SandBase 的使用方式 {#connect}

以下是**三种可任选其一的入门方式**，而不是必须依次完成的三个步骤。三种方式使用同一个 SandBase 账户和工作区。

<QuickstartPaths />

只需要一个现成的任务工具？[浏览 Tools](#use-tools) 或[选择 Skill](#use-skills)。登录前即可浏览公开目录和文档。

### 从开源仓库开始 {#start-from-the-open-source-repositories}

- **[SandBase — SDK 与示例](https://github.com/sandbaseai/sandbase)**：Python、TypeScript 和 Go 客户端、API 示例以及托管 Agent 工作流。构建自己的应用时使用。
- **[SandBase CLI 与 MCP](https://github.com/sandbaseai/cli)**：安装并连接你的 AI 工具，或在终端中发现和运行能力。配合你现有的 Agent 使用。

## 开始之前：登录 {#create-account}

使用 Playground、运行托管 Skill 或创建 API 密钥前，请先登录。无需账户即可使用的免费工具可以直接使用。**已经登录？跳过此步**，并确认账户菜单中显示的是你打算使用的工作区。

SandBase 使用 GitHub 或 Google 登录，没有单独的邮箱加密码注册方式。

1. 打开[创建账户 / 登录](https://www.sandbase.ai/login){target="_blank"}。
2. 完成安全验证，然后选择 **Sign in with GitHub** 或 **Sign in with Google**。
3. 在服务商窗口中批准访问。
4. 返回你之前所在的页面，或打开 [Console](https://www.sandbase.ai/console){target="_blank"}。

首次登录会创建你的账户和一个**个人工作区**。试用 SandBase 之前无需创建组织。

如果出现欢迎赠金，你无需添加付款方式即可开始。Console Dashboard 上的 **Balance** 卡片和 [Billing](https://www.sandbase.ai/console/billing){target="_blank"} 会显示当前余额。

## 在平台上使用 {#use-on-website}

如果你想先在浏览器中试用模型、API 或 Agent，请选择此方式，无需安装客户端，也无需写代码。

1. 登录后打开目录：
   - [语言模型](https://www.sandbase.ai/models){target="_blank"}
   - [图像与视频模型](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [API](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. 打开模型或 API 的详情页，如有 **Playground** 则选择它。
3. 输入所需内容，例如提示词、图像、搜索词或 URL。运行前请查看显示的价格。
4. 运行请求，查看返回的文本、数据、图像、视频或任务状态。

使用网站 Playground 无需单独创建 API 密钥。如果某项能力没有提供 Playground，请使用其 **API** 标签页，并按照下面的 API 方式操作。

## 通过 API 使用 {#call-api}

如果你要在应用中接入某一项能力，请选择此方式。

1. 复用目标工作区的有效密钥，或在 [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} 中点击 **New key** 创建 [API 密钥](/getting-started/api-keys)。请立即复制，密钥只显示一次。
2. 筛选目录并打开详情页：
   - [语言模型](https://www.sandbase.ai/models){target="_blank"}：按服务商、能力、上下文和价格筛选
   - [图像与视频模型](https://www.sandbase.ai/models/image-video){target="_blank"}：筛选文生图、图生图、文生视频、图生视频等多模态模型
   - [API](https://www.sandbase.ai/apis){target="_blank"}：按平台和数据源筛选 API 资源
3. 打开 **API** 标签页，复制示例请求，并填写该端点的必填字段。
4. 将 SandBase 密钥存储在服务端环境变量中，然后运行请求。不要将其放在浏览器代码或公开仓库中。
5. 检查响应。对于异步任务，请按照该端点的状态轮询示例操作，直到任务完成。

以下是适用于 **Bash / zsh**（macOS、Linux 或带 WSL 的 Windows）的语言模型调用示例。请在本地替换占位密钥。其他环境请使用下方仓库中的 Python、TypeScript 或 Go 示例；shell 命令与 PowerShell 不能互换。

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

从代码开始：[GitHub 上的 SandBase SDK 与示例](https://github.com/sandbaseai/sandbase)。

了解更多：[第一次 API 调用](/getting-started/first-call)。

## 配合你的 Agent 使用 {#use-in-ai-tool}

如果你使用 Claude Code、Codex、Cursor、Kiro 或其他受支持的客户端，并希望在其中使用 SandBase 的模型和 API，请选择此方式。

**自动本地配置的前提：** 你的客户端必须能执行命令，且所在机器需要安装 Node.js 20+ 和 npm。如果你使用的是仅支持聊天的客户端，请改为按照其[客户端专属连接说明](/setup/)操作。

1. 在 Console 中打开 [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"}。
2. 将下面这行粘贴到 AI 助手的聊天框中，然后告诉它你想构建什么。这是一条聊天指令，不是 shell 命令：

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. 批准 agent 打开的浏览器登录。无需粘贴 API 密钥。
4. 开启新会话或重启应用，以加载 SandBase 工具。
5. 让 agent 发现并查看相关工具，然后在你的授权和预算范围内发起一次有限的请求。如果是开发场景，让它将响应集成到你的项目中，并提供运行命令和实际测试结果。仅完成发现并不能证明业务 API 调用可用。

更喜欢终端？运行 `npx -y @sandbaseai/cli@latest connect`。它会配置检测到的受支持客户端；如只想配置一个，请使用 `npx -y @sandbaseai/cli@latest connect --client codex`（将 `codex` 替换为你使用的受支持客户端）。之后请重启该客户端。付费运行前请检查所选工作区。

例如，你可以这样提问：

> 找一个 SandBase API，用于搜索关于 AI agent 的公开 X 帖子。先查看它的必填输入和价格，运行前告诉我单次请求的费用。在结果中保留原始来源链接。

源码和安装说明：[GitHub 上的 SandBase CLI 与 MCP](https://github.com/sandbaseai/cli)。

了解更多：[连接 AI 工具](/setup/)。

### 让你的 AI 助手帮你构建 {#start-with-your-agent}

[setup Skill](https://www.sandbase.ai/SKILL.md) 会根据你的当前情况引导 agent：尚无账户、已有 API 密钥、已连接工具、已有项目或要开发新功能。它会检查端点的输入和价格，帮助实现集成，并区分“完成配置”“已验证调用”和“功能可用”。告诉它你的目标和任何消费上限；不要将密钥粘贴到聊天中。

已经有密钥或项目？直接说明即可，无需从头开始。例如：“我有一个 SandBase 密钥。为这个项目添加 Similarweb 流量查询；先查看该 API，并告诉我实测的费用。”无法执行命令或加载工具的助手需要使用[客户端专属配置方式](/setup/)。

[把 Markdown 版快速入门交给你的 agent](https://www.sandbase.ai/quickstart.md)，或按以下步骤操作。安装 setup Skill 本身不会创建托管 Agent。

### 可选：在 SandBase 上运行托管 Agent {#build-agent}

如果工作包含多个步骤或需要复用，请选择此方式。

1. 打开 [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"}，选择 **Create**。
2. 填写 **Overview** 和 **Instructions**。
3. 选择一个 **Model**。
4. 在 **Capabilities** 下添加 Skills 和 MCP 工具，然后设置 **Runtime**。
5. 选择 **Create & Chat**，在 Session 中进行测试。
6. 在 Agent 的 **API** 标签页中，从你的应用调用已测试的版本。

了解更多：[Build Agent](/agents/)。如需使用官方 OpenAI SDK 通过代码完成同样的操作，请参阅 [OpenAI 兼容性](/agents/openai-compatibility)。

## Skills、Tools 及其他构建方式 {#skills-and-tools}

选择与你的任务匹配的资源。使用 API 无需安装 Skill 或创建托管 Agent。

- **[Tools](https://www.sandbase.ai/tools)：** 在现成界面中完成特定任务，例如格式化文本或查询公开数据。
- **[Skills](https://www.sandbase.ai/skills)：** 为 agent 提供包含指令、脚本和示例的可复用工作流。
- **模型与 API：** 通过 Playground、你的代码或已连接的 agent 调用能力。浏览[语言模型](https://www.sandbase.ai/models)、[图像与视频](https://www.sandbase.ai/models/image-video)或[数据 API](https://www.sandbase.ai/apis)。
- **[托管 Agent](/agents/)：** 在 SandBase 上配置并运行可复用的 agent。
- **[Sandboxes](/sandbox/)：** 为代码提供一个隔离环境，用于执行和处理文件。

### 使用 Tool {#use-tools}

1. 打开 [Tools](https://www.sandbase.ai/tools)，选择你要完成的任务。
2. 阅读该工具的输入要求以及价格或配额标签。免费实用工具无需账户即可使用；数据工具需要登录 SandBase 才能运行，模型测试可能需要你自己的密钥。
3. 输入所需的文本、URL、文件或其他内容，然后使用该工具的运行操作。
4. 查看输出，并在提供时使用复制或下载操作。对于数据工具，如果想自动化同样的任务，请使用其关联的 API 和请求示例。

**每日免费配额由整个工作区共享**，而不是每个工具单独享有。运行前请检查是否符合条件以及显示的价格；免费实用工具并不意味着模型或 API 调用也免费。

### 使用 Skill {#use-skills}

1. 打开 [Skills](https://www.sandbase.ai/skills)，选择一个工作流，并阅读其示例、必需输入和依赖。
2. 从该 Skill 详情页提供的选项中选择一种：
   - **在线运行：** 在提供托管示例时，登录并运行。跟踪其进度，打开生成的输出或文件。请查看显示的额度；可用性和限制因 Skill 而异。
   - **安装 / 下载：** 在提供下载时，登录并下载包。将完整的包解压到一个工作文件夹，然后按照其安装说明操作，或让本地 agent 读取其 `SKILL.md`。
3. 本地使用时，请提供你的任务、输入、期望输出和消费上限。按照 [Agent 方式](#use-in-ai-tool)连接 SandBase；如果 Skill 的脚本需要密钥，请在执行环境中配置，而不是粘贴到聊天中。
4. 检查实际结果。下载 Skill 或连接 agent 并不代表工作流已成功运行。

SandBase **setup Skill** 用于连接你的客户端；目录中的 Skills 描述各自的工作流。安装前请检查每个 Skill 的依赖和支持的客户端。本地工作流使用的模型和 API 调用可能会产生用量费用。

完整流程（包括输入文件夹和保存交付物）请参阅[在本地使用 Skill](/guides/skills/local-use)。

## 可选：共享团队工作区 {#create-organization}

API 密钥、用量和账单都归属于组织。如果你是独自评估，请继续使用个人工作区。如果多人需要共享密钥和费用，请创建团队。

| 工作区 | 适用场景 |
|---|---|
| **个人** | 首次登录时自动创建。每个用户一个。 |
| **团队** | 共享成员、密钥和余额。适用于公司或项目。 |

### 创建团队 {#create-team}

1. 打开[创建团队](https://www.sandbase.ai/console/members?create=1){target="_blank"}，或在 Console 右上角的账户菜单中选择 **Create Team**。
2. 输入 **Team name**，然后选择 **Create team**。
3. 确认账户菜单中当前活动的工作区已变为该团队。
4. 在 **Developer → Team** 中选择 **Add member**，输入已有 SandBase 账户的 **Account email**，并选择 **Workspace role**（Member 或 Admin）。

受邀者必须已有 SandBase 账户。如果没有，请将[本页面](/getting-started/quickstart)发给对方，让其先登录，然后再添加。

如果你属于多个组织，请在账户菜单中切换。密钥和账单跟随**当前活动**的组织。角色说明请参阅[组织](/admin/organizations)。

## 确认可以正常使用 {#confirm-it-works}

满足以下所有条件即表示已准备就绪：

- Console 账户菜单显示的是你打算使用的组织。
- 你已完成一种方式：API 调用、网站上运行、连接 AI 工具或 Agent。
- 有一次请求成功。

如果请求失败，请检查当前活动的组织、密钥以及[错误](/guides/error-handling)。工作区余额用尽时，请在 [Billing](https://www.sandbase.ai/console/billing){target="_blank"} 中充值。

### 如果遇到问题 {#if-you-get-stuck}

| 你看到的情况 | 需要检查的内容 |
| --- | --- |
| 需要登录 | 登录后返回原页面，并检查当前活动的工作区。 |
| 密钥无效或访问被拒绝 | 确认密钥属于目标工作区，且有权访问该端点。充值并不能解决权限问题。 |
| 余额不足或配额耗尽 | 阅读响应：如果是余额问题，请检查 Billing；如果是配额限制，请查看显示的重置时间。 |
| Agent 中没有工具 | 开启新的客户端会话，然后按照[连接 AI 工具](/setup/)中的诊断步骤操作。 |
| 任务仍在运行 | 跟踪返回的任务状态或页面上的进度指示。避免重复提交同一个付费请求。 |

## 账单与用量 {#billing-and-usage}

登录后，查看当前活动组织的支出：

<QuickstartResources group="ops" />

## 下一步 {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — 在浏览器中完成任务
- [Skills](https://www.sandbase.ai/skills) — 查找可复用的 agent 工作流
- [API 密钥](/getting-started/api-keys) — 创建和轮换组织密钥
- [模型与 API 目录](https://www.sandbase.ai/models) — 在网站上试用模型、API 和 Agent
- [连接 AI 工具](/setup/) — 让你的 AI 工具使用 SandBase 目录
- [Build Agent](/agents/) — 创建可复用的 Agent
- [API 参考](/api-reference/) — 通过代码集成
