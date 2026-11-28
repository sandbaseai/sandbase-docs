---
i18nSource: c922bd433deabf32
title: 指南
description: 使用 SandBase 模型、API、Agent、设置、计费、流式输出及保障生产可靠性的实用指南。
---

# 指南 {#guides}

这些指南介绍在生产环境中使用 SandBase 的常见模式。

## 调用模型 {#call-models}
| 指南 | 说明 |
|-------|-------------|
| [Chat Completions](./chat-completions) | 通过兼容 OpenAI 的对话协议调用 SandBase |
| [OpenAI Responses](./openai-responses) | 通过兼容 OpenAI 的 Responses 协议调用 GPT 模型 |
| [Anthropic Messages](./anthropic-messages) | 通过兼容 Anthropic 的 Messages 协议调用 SandBase |
| [Google Gemini](../api-reference/gemini-generate-content) | 通过兼容 Google Gemini 的 GenerateContent 协议调用 SandBase |
| [图像与视频](./image-video) | 通过共享的异步 Run API 生成图像和视频 |
| [流式输出](./streaming) | 将兼容模型的输出以流式方式传给你的应用 |
| [API 目录](https://www.sandbase.ai/apis) | 浏览 API 能力及其带供应商前缀的端点 |

## 在生产环境中运行 {#run-in-production}
| 指南 | 说明 |
|-------|-------------|
| [错误与重试](./error-handling) | 对失败进行分类，仅在操作可安全重复时重试 |
| [速率限制](./rate-limiting) | 处理 429 响应并平滑突发请求 |
| [并发限制](./concurrency-limits) | 你的组织可以同时运行多少个任务 |
| [定价与用量](./billing) | 了解额度、用量和成本控制 |

## 快速提示 {#quick-tips}

- 当用户想在 Codex、Claude、Cursor 或 Kiro 中使用工具时，请参阅[设置](/setup/)。
- 当你的应用只需要某一项能力时，请使用 [Models](https://www.sandbase.ai/models) 或 [APIs](https://www.sandbase.ai/apis)。
- 当工作包含多个步骤或需要复用时，请使用 [Build Agent](/agents/)。
- 在 Console 中使用 [Activities](https://www.sandbase.ai/console/activities) 同时查看请求和用量。
