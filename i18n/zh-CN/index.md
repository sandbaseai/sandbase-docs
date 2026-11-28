---
i18nSource: c063864501452a7b
title: SandBase 文档
description: 直接使用模型和 API 进行构建，或定义在托管基础设施上运行的可复用 Agent。
---

# SandBase 文档 {#sandbase-docs}

直接使用模型和 API 进行构建，或定义在托管基础设施上运行的可复用 Agent。

SandBase 提供两种相辅相成的方式来构建 AI 应用。先从满足需求的最小范围开始；随着应用的发展，你可以将两者结合使用。

## 选择构建方式 {#choose-how-to-build}

| | 模型与 API | 托管 Agent |
|---|---|---|
| **是什么** | 直接访问语言、图像、视频、音频模型以及第三方 API | 由 SandBase 执行的可复用、带版本的 Agent 配置 |
| **适用场景** | 自定义应用循环和精细的请求控制 | 多步骤、异步或可重复的工作 |
| **你负责管理** | 提示词、编排、重试和应用状态 | Agent 定义、启用的能力、输入和交付方式 |
| **从这里开始** | [模型与 API](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip 一个 SandBase API 密钥
同一个 API 密钥可以调用模型、API 和 Agent。请将密钥保存在服务器端，切勿在浏览器代码中暴露。
:::

## 核心概念 {#core-concepts}

### 模型与 API {#models-and-apis}

语言、图像、视频和音频任务请使用模型。应用需要外部数据或执行外部操作时请使用 API。SandBase 网站上的目录展示了可用的能力、定价、输入 schema 和可运行的示例。

- [浏览模型](https://www.sandbase.ai/models)
- [浏览 API](https://www.sandbase.ai/apis)
- [发起第一次 API 调用](/getting-started/first-call)
- [打开 API 参考](/api-reference/)

### Agents {#agents}

Agent 是一个可复用、带版本的配置，包含模型、指令、Skill 和 MCP 连接。只需定义一次，即可在 Session 中运行。

- [了解 Agent](/agents/)
- [定义 Agent](/agents/agent-api)
- [添加 Skill 与 MCP 工具](/agents/mcp-tools)

### Sessions {#sessions}
Session 运行一个 Agent 版本。使用 `POST /v1/agents/sessions` 创建 Session，发送输入，流式获取事件，之后可读取完整对话。

- [Sessions 指南](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## 入门步骤 {#first-steps}

1. 创建组织和 [API 密钥](/getting-started/api-keys)。
2. 从[目录](https://www.sandbase.ai/models)中选择一个模型、API 或 Agent。
3. 直接发起请求，或定义并测试一个 Agent。
4. 在你的应用中通过 Session 运行测试过的 Agent。
5. 在 Console 中查看 Session、错误、延迟和费用。

## 运维指南 {#operational-guidance}

- [流式响应](/guides/streaming)
- [错误处理与重试](/guides/error-handling)
- [速率限制](/guides/rate-limiting)
- [计费与定价](/guides/billing)
- [工作区管理](/admin/)

## 后续步骤 {#next-steps}

- 使用本地 Skill 创作：[Skill 教程](/guides/skills/)

- 初次使用 SandBase：[快速入门](/getting-started/)
- 调用模型或 API：[模型目录](https://www.sandbase.ai/models)和 [API 目录](https://www.sandbase.ai/apis)
- 推理与 Agent API：[API 参考](/api-reference/)
- 构建可复用的工作：[Build Agent](/agents/)
- 连接 AI 工具：[设置](/setup/)
