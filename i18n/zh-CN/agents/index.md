---
i18nSource: 7b24f4b0b5cd2c33
title: 构建 Agent
description: 在 SandBase Session 中定义、测试和运行可复用、带版本的 Agent。
---

# 构建 Agent {#build-agent}

在构建 Agent 中，你可以定义和测试 Agent，然后决定它的运行方式。

Agent 是一份已保存、带版本的配置：包括模型、指令、运行时配置、Skills，以及连接外部工具的 MCP 连接。保存 Agent 并不会运行它。

## 什么是 Agent {#what-an-agent-is}

| 问题 | 所在位置 |
|---|---|
| 它要做什么？ | `instructions` |
| 由哪个模型完成工作？ | `model`，即 [Models API](/api-reference/models/) 中的模型 ID |
| 它掌握哪些能力？ | [Skills](/agents/mcp-tools#skills)，带版本的指令包 |
| 它可以调用哪些外部工具？ | [MCP 连接](/agents/mcp-tools#mcp-connections)，服务器需要 token 时配合[凭据](/agents/api-credentials)使用 |
| 它如何运行？ | 在 [Session](/agents/sessions) 中运行 |

每次有效修改都会创建一个新的不可变版本。你可以随时列出版本并恢复到之前的版本。

## Agent 如何运行 {#how-an-agent-runs}

Agent 在 [Session](/agents/sessions) 中运行。Session 是一个 `ses_` 资源，你可以向它发送输入并从中流式接收事件，适用于交互式对话、测试运行或应用调用。每个 Session 会冻结其启动时的 Agent 版本，因此你可以继续编辑 Agent，而不会影响已有的 Session。

## Agent 生命周期：起草 → 在 Session 中测试 → 从应用中运行 → 检查 Session {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. 起草 {#_1-draft}

在 Console 的 **Build → Agents** 下创建 Agent，或使用 [`POST /v1/agents`](/agents/agent-api)。从最小可用的工作流开始，仅在指令确实需要时才添加 Skills 和 MCP 连接。

### 2. 在 Session 中测试 {#_2-test-in-a-session}

为 Agent 创建一个 Session，发送有代表性的输入，并查看输出、工具活动和错误。除了正常流程，还要测试缺少输入、工具不可用、结果为空以及输出格式要求等情况。

### 3. 从应用中运行 {#_3-run-from-your-app}

在应用中通过 [Sessions API](/api-reference/sessions/) 为测试过的 Agent 创建 Session。

### 4. 检查 Session {#_4-inspect-sessions}

使用 Sessions API 读取每个 Session 的条目和轮次，查看完整的对话、工具活动和错误。

## 生产检查清单 {#production-checklist}

- `model` 使用 Models API 中当前可用的模型 ID。
- 当行为不能悄然改变时，将 Skills 固定到某个版本。
- MCP 连接通过 `allowed_tools` 仅暴露 Agent 所需的工具。
- token 存储为 [Secret](/agents/api-credentials)，绝不写入指令、输入或元数据。
- 创建 Session 时发送 `Idempotency-Key`，重试时复用该值。
- 启动后检查 Session 状态和错误。

## 目录 Agent {#catalog-agents}

公开的 [Agent 目录](/api-reference/agents/catalog)列出了 SandBase 发布的 Agent。你可以读取目录中的 Agent，但如需修改，须先通过 `POST /v1/agents/catalog/{agent_id}/clone` 将其克隆到你的组织中。克隆得到的是一个归你所有、可以运行的新私有 Agent。

::: tip 使用 OpenAI SDK
Agents、Sessions 和 Skills 遵循 OpenAI Agents API，因此官方 OpenAI SDK 可配合 `base_url="https://api.sandbase.ai/v1"` 使用。经过验证的示例和差异说明请参阅 [OpenAI 兼容性](/agents/openai-compatibility)。
:::

## 后续步骤 {#next-steps}

- [定义 Agent](/agents/agent-api)
- [OpenAI 兼容性](/agents/openai-compatibility)
- [Skills 与 MCP 工具](/agents/mcp-tools)
- [Session](/agents/sessions)
