---
i18nSource: 071e97a48f9c4f4c
title: API 参考
description: 调用 SandBase 模型，管理 Agents、Sessions、Skills、MCP 连接、Secrets 和账户资源。
---

# API 参考 {#api-reference}

你可以使用 API 直接调用模型，也可以定义可复用的 Agents，在 Sessions 中运行它们，并将其连接到 Skills 和 MCP 工具。

::: tip 想调用模型推理？
推理接口约定（Chat Completions、Responses、Anthropic Messages、Gemini、Images 和 Seedance 视频）位于本参考的 **Model inference** 部分。每个模型特有的字段和价格请查看 [Models 目录](https://www.sandbase.ai/models)中对应的页面。
:::

## 选择起点 {#choose-a-starting-point}

| 目标 | 从这里开始 | 后续步骤 |
|---|---|---|
| 定义可复用的行为 | [Agents](/api-reference/agents/) | 创建 Agent 配置并进行版本管理 |
| 直接运行 Agent | [Sessions](/api-reference/sessions/) | 发送输入、流式接收事件并读取历史 |
| 复用指令包 | [Skills](/api-reference/skills/) | 上传带版本的 ZIP 包并将其挂载到 Agents |
| 调用外部工具 | [MCP 连接](/api-reference/mcp-connections/) | 为 Agents 注册远程 HTTPS MCP 服务器 |
| 为外部工具认证 | [Secrets](/agents/api-credentials#with-the-api) | 为 MCP 连接存储只写的 Bearer 令牌 |

## 资源生命周期 {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent**（`agt_`）是一份已保存、带版本的配置；创建 Agent 不会执行它。
- **Session**（`ses_`）运行某个 Agent 版本，并冻结其 Skills 和 MCP 连接。Session 路径位于 `/v1/agents/sessions` 下。
- **Skill**（`skl_`）是带版本的指令包。**MCP 连接**（`mcp_`）用于注册远程工具服务器，**Secret**（`sec_`）用于存储其 Bearer 令牌。

## Agents 平台资源约定 {#conventions-for-agents-platform-resources}

Agents、Sessions、Skills、MCP 连接和 Secrets 均通过 `https://api.sandbase.ai/v1` 提供，并遵循以下规则：

- 使用 `Authorization: Bearer` 或 `X-API-Key` 进行认证。参见[认证](/api-reference/authentication#agents-platform-resources)。
- 请求体为严格 JSON，最大 1 MiB；未知字段返回 400。
- 创建 MCP 连接或 Secrets 的写操作必须提供 `Idempotency-Key`，其他写操作可选提供。
- 乐观并发控制使用 `row_version`：发送你上次读取到的值，收到 409 时重新读取。
- Agents、Sessions、items、turns 和 Skills 使用游标分页（`limit`、`after`、`order`；响应包含 `has_more` 和 `last_id`）。Agent 版本、附件、MCP 连接和 Secrets 使用偏移分页（`limit`、`offset`；响应包含 `total`）。
- 错误使用 `{"error": {"type", "code", "param", "message"}}` 结构。参见 [Agents 平台错误](/api-reference/errors#agents-platform-errors)。

## 认证 {#authentication}

以 Bearer 令牌形式发送 SandBase API 密钥：

```http
Authorization: Bearer sk-YOUR_KEY
```

请将密钥视为不透明的机密信息，仅保存在服务端，切勿将其写入浏览器代码或日志。兼容性细节请参阅[认证](/api-reference/authentication)，公开错误结构请参阅[错误](/api-reference/errors)。

## 组织与用量 {#organization-and-usage}

平台资源归属于 API 密钥所关联的组织。使用 [Account API](/api-reference/account/) 查看支持的余额信息和近期执行历史。除非此处记录了相应的公开端点，组织管理和账单管理仍需在 Console 中完成。

## 参考格式 {#reference-formats}

- 从侧边栏浏览各项操作，查看示例和响应详情。
- 下载机器可读的 [OpenAPI 规范](/openapi.yaml)。
- 在 [Models 目录](https://www.sandbase.ai/models)中打开模型页面，或在 [APIs 目录](https://www.sandbase.ai/apis)中打开 API 页面，查看其确切的请求字段。

## 后续步骤 {#next-steps}

- 初次接触托管 Agents：[构建 Agent](/agents/)
- 直接调用模型：[Chat Completions](/api-reference/llm-gateway) 或 [Models 目录](https://www.sandbase.ai/models)
