---
i18nSource: 0314b37a870481ae
title: AI 可读文档
description: AI agent 发现和使用 SandBase API 所需的全部信息，一页概览。
---

# 面向 AI 的 API 概览 {#ai-friendly-api-overview}

::: info Session 约定
Session（`ses_*`）运行一个已保存的 Agent 版本；可直接使用 `POST /v1/agents/sessions` 创建。运行时实例属于内部实现，永远不会返回。
:::

> 一份同时面向人类和 AI agent 的简明参考。如需为 LLM 读取优化的纯文本版本，请参阅 [`llms.txt`](https://www.sandbase.ai/docs/llms.txt)。

## SandBase 是什么？ {#what-is-sandbase}

SandBase 是一个 AI agent 基础设施平台。一个 API 密钥即可访问已启用的语言、图像、视频、音频、搜索和数据类模型与 API，以及 Agent 工作流。请通过发现接口获取当前目录，不要依赖固定数量。

## API Base URL {#api-base-url}

```
https://api.sandbase.ai/v1
```

## 认证 {#authentication}

所有请求都需要 Bearer 令牌：

```
Authorization: Bearer sk-YOUR_KEY
```

在 [Developer → API Keys](https://www.sandbase.ai/console/keys) 获取密钥。

## 快速示例 {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## 核心 API {#core-apis}

| 方法 | 路由 | 说明 |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | 兼容 OpenAI 的对话接口；可选能力取决于所选模型 |
| `POST` | `/v1/messages` | 兼容 Anthropic 的 messages API |
| `POST` | `/v1/run` | 使用模型专属 schema 提交模型生成任务 |
| `GET` | `/v1/run/{id}` | 轮询异步生成状态并获取结果 |
| `GET` | `/v1/models` | 列出已启用的逻辑模型；默认为 LLM 类型 |
| `GET` | `/v1/models/{id_or_name}` | 获取模型详情、schema、能力和价格 |
| `GET` | `/v1/tasks/{task_id}/cost` | 获取任务费用和用量 |

## 其他 API 分组 {#additional-api-groups}

除核心生成 API 外，SandBase 还提供用于 agent 生命周期管理的 API。常见工作流请参阅 [AI API 指南](./full)，完整约定请参阅 [OpenAPI 规范](https://www.sandbase.ai/docs/openapi.yaml)。

| 分组 | 主要路由 | 用途 |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | 创建已保存的 Agent 定义并管理版本 |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | 运行 Agent、发送输入并订阅实时事件流 |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | 供 Agent 挂载的带版本指令包 |
| **MCP 连接与 Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | 远程 HTTPS MCP 工具及其只写 Bearer 令牌 |

Agents 平台资源接受 `Authorization: Bearer` 或 `X-API-Key`，失败时返回 `{"error":{"type","code","param","message"}}`。

## 计价模式 {#pricing-model}

按用量付费。价格因模型而异，且可能独立于本页发生变化：

- **模型价格**：从 `model_card` 读取所选模型当前的计价公式和单位
- **Token 价格**：模型声明时，可能包含输入、输出、缓存或推理等部分
- **媒体及其他操作**：可能按请求、时长、分辨率或其他模型专属单位计费
- **数据 API**（搜索、社交、抓取、电商、金融）：每个组织每个 UTC 日有 100 次免费调用，由符合条件的数据 API 共享；超出后按次计费，不会被拦截。在 MCP 中，符合条件的工具会在 `sandbase_inspect` 中显示 `pricing.free_quota`，`sandbase_account` 会返回 `free_api_quota`（`daily_limit`、`used_today`、`remaining`、`resets_at`）。参阅[每日免费 API 调用](/guides/billing#daily-free-api-calls)。

先使用 `GET /v1/models` 获取当前模型 ID，再在发送请求前查看 `GET /v1/models/{id_or_name}`。不要假设价格或缓存折扣在不同服务商之间通用。

当操作返回任务 ID 时，可查看其记录的费用：

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## 速率限制 {#rate-limits}

没有公开的统一默认数值。请求受分配给你组织的可选每分钟请求数限制约束，
该限制由组织下所有 API 密钥共享。`429` 响应不包含配额或 `Retry-After` 请求头；请使用带抖动的
有上限指数退避。参阅[错误指南](./errors)。

---

## 延伸阅读 {#further-reading}

- [AI API 指南](./full) — 核心工作流、请求/响应结构和 curl 示例
- [模型与价格](./models) — 实时模型发现、价格和能力说明
- [错误指南](./errors) — 已记录的响应结构、HTTP 处理和重试安全性
- [OpenAPI 规范](https://www.sandbase.ai/docs/openapi.yaml) — 机器可读的 OpenAPI 3.1

## 纯文本版本（供 AI agent 使用） {#plain-text-versions-for-ai-agents}

| 文件 | URL | 内容 |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | 精简摘要（约 60 行） |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | 扩展版面向 AI 的 API 指南 |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | 机器可读的 OpenAPI 3.1 规范 |
