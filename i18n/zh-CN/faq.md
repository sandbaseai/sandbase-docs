---
i18nSource: a86346e2696c732c
title: 常见问题
description: 关于连接 AI 工具、SandBase 目录、模型、API、Agent、Session 和计费的常见问题。
---

# 常见问题 {#frequently-asked-questions}

## SandBase 是什么？ {#what-is-sandbase}

SandBase 帮助 Agent 连接真实世界。

你可以使用现成的模型和 API，在 AI tools 中完成连接后从你的 AI 工具里使用它们，或者构建可复用的 Agent 并在 Session 中运行。

## SandBase 适合谁？ {#who-is-sandbase-for}

SandBase 主要面向三类用户：

- **AI 工具用户**：希望在 Codex、Claude、Cursor 或 Kiro 中获得实用能力
- **开发者**：希望直接调用模型和 API
- **FDE 和团队**：为客户或内部工作流构建可复用的 Agent

## 在哪里浏览能力？ {#where-do-i-browse-capabilities}
SandBase 网站列出了能力目录：

- [模型](https://www.sandbase.ai/models)和[图像与视频模型](https://www.sandbase.ai/models/image-video)
- [API](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
根据能力类型的不同，你可以查看、测试、安装、调用或克隆。

## AI tools 是什么？ {#what-is-ai-tools}

Console 中的 **Build → AI tools** 可将 SandBase 连接到你已在使用的 AI 工具，例如 Claude Code、Codex、Cursor 或 Kiro。将 `set up https://www.sandbase.ai/SKILL.md` 粘贴到你的 agent 中，或运行 `npx -y @sandbaseai/cli@latest connect`。连接后的工具可以搜索并运行 SandBase 目录中的模型和 API，费用计入你的工作区。参阅[连接 AI 工具](/setup/)。

## Build Agent 是什么？ {#what-is-build-agent}

Build Agent 是定义和测试 Agent 的地方。

Agent 将指令、模型、Skills 和 MCP 工具组合成一个可复用、带版本的工作流。

## Agent 和 API 有区别吗？ {#is-an-agent-different-from-an-api}
有。Agent 是一份你可以编辑和测试的带版本配置，通过创建 Session 来运行。你可以继续编辑 Agent，同时让应用通过 [Sessions API](/api-reference/sessions/) 创建 Session。

## Session 是什么？ {#what-are-sessions}
Session 是 Agent 的一次执行，包括其对话、工具活动和输出。

## 如何让 Agent 访问外部 API？ {#how-do-i-give-an-agent-access-to-external-apis}

将外部系统作为 MCP 服务器接入，并将其添加到 Agent 的 MCP 连接中。如果服务器需要 Bearer 令牌，请使用 [Secrets API](/agents/api-credentials#with-the-api) 将其存储为绑定到该服务器 URL 的只写 Secret。令牌只会发送到该服务器，永远不会出现在提示词或 Agent 运行时中。参阅 [MCP 工具的凭据](/agents/api-credentials)。

## 模型在哪里？ {#where-do-models-live}

模型是重要的构建模块，因此有单独的[目录](https://www.sandbase.ai/models)。

你可以直接调用模型、在已连接的 AI 工具中使用，或在 Agent 中使用。

## 我需要写代码吗？ {#do-i-need-to-write-code}

不一定。

如果你想在 AI 工具中使用这些能力而不写代码，请[连接你的 AI 工具](/setup/)。

如果你想在应用中调用 SandBase，请使用 API 参考。

如果你需要可复用的多步骤工作，请使用 Build Agent。

## 如何获取 API 密钥？ {#how-do-i-get-an-api-key}

打开 Console，进入 **Developer → API Keys**，然后选择 **New key**。

按以下方式使用密钥：

```http
Authorization: Bearer sk-YOUR_KEY
```

## 如何计费？ {#how-does-billing-work}

SandBase 采用积分和按用量计费。

模型、API、Agent 和运行时工作的费用可能各不相同。请在 Console 中查看当前用量和价格。

## 后续步骤 {#next-steps}

- [快速入门](/getting-started/)
- [模型与 API 目录](https://www.sandbase.ai/models)
- [连接 AI 工具](/setup/)
- [Build Agent](/agents/)
- [API 参考](/api-reference/)
