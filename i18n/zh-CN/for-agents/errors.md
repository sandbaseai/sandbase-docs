---
i18nSource: 95410ff7ea741f64
title: AI 可读的错误指南
description: 按端点系列、HTTP 状态码、重试安全性和文档中的响应结构处理 SandBase API 错误。
---

# 面向 AI 客户端的错误处理 {#error-handling-for-ai-clients}

SandBase 没有统一的错误 schema。请先根据 HTTP 状态码分支处理，再按照该端点系列文档中
说明的响应结构进行解析。不要假定每个响应都包含 `code`、`param`、`request_id` 或某个
特定的消息字符串。

## 公开的响应结构 {#public-response-shapes}

核心 `/v1/*` 中间件以及部分模型或资源端点返回扁平结构的错误：

```json
{"error":"organization rate limit exceeded"}
```

Agents 平台资源（`/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、
`/v1/skills*`）返回带有稳定 `code` 的 OpenAI 风格对象。参见 [Agents 平台错误](#agents-platform-errors)：

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

兼容 OpenAI 的网关保留兼容 OpenAI 的错误结构。`POST /v1/messages` 保留
兼容 Anthropic 的错误结构：

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP 状态码处理 {#http-status-handling}

| 状态码 | 含义 | 客户端操作 |
|---|---|---|
| `400` | 输入无效或参数不受支持 | 按所选端点和模型的 schema 修正请求。 |
| `401` | 凭据缺失、无效、已吊销或已过期 | 替换或轮换凭据；不要原样重试。 |
| `402` | 请求无法扣费，或已达到支出上限 | 先解决账单或密钥限额问题再重试。 |
| `403` | 凭据缺少权限，或兼容层将扣费失败映射为 403 | 检查文档中说明的错误结构，并使用有权限的密钥。 |
| `404` | 模型或资源不存在 | 核实当前的模型名称或资源 ID。 |
| `409` | 资源状态冲突 | 先读取资源的最新状态，再判断重试是否安全。 |
| `429` | 组织请求限制或视频并发限制 | 使用有上限的指数退避加随机抖动进行重试。 |
| `500`、`502`、`503`、`504` | SandBase 或上游的临时故障 | 仅在操作可安全重复时重试。 |

## 身份验证与速率限制消息 {#authentication-and-rate-limit-messages}

文档中列出的身份验证消息包括：

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

在权限范围之外使用受限密钥时，会返回 `403` 及嵌套结构的响应体：`{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`。Agents 平台资源会在其自身的错误结构中返回相同的 `code`。

文档中列出的速率限制消息为 `organization rate limit exceeded`（即组织被分配的每分钟请求数上限，
由该组织的所有 API 密钥共享）。`429` 响应目前不包含 `Retry-After` 或
`X-RateLimit-*` 响应头，也没有公开的通用 RPM 或并发默认值。

## 模型与资源查询 {#model-and-resource-lookup}

使用 `GET /v1/models` 获取已启用的模型 ID，并在执行前使用 `GET /v1/models/{id_or_name}` 查看模型详情。
请将资源 ID 视为不透明值，并通过相应的列表或获取操作进行核实。不要根据 ID 前缀
自行构造其他轮询 URL。

## 重试算法 {#retry-algorithm}

使用有上限的指数退避加随机抖动：

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

遵循以下规则：

- 对 `429`，在客户端计算的延迟后重试；
- 对临时性 `5xx` 响应，只重试少量且有上限的次数；
- 不要原样重试返回 `400`、`401`、`402`、`403` 或 `404` 的请求；
- 在重复任何创建、触发或外部操作请求之前，先检查幂等性；
- 流式传输失败时保留部分输出，并判断继续还是重新开始是安全的；
- 将最终的 HTTP 状态码和经过脱敏的端点特定错误返回给调用方。

## Agents 平台错误 {#agents-platform-errors}

Agent、Session、Skill、MCP 连接和 Secrets 返回同一种错误结构。对于大多数错误代码，`message` 是固定且安全的句子；`invalid_request` 可能附带简短说明，例如哪种输入结构或选项不受支持。请根据 `code` 而不是 `message` 进行分支处理。

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

401 时 `type` 为 `authentication_error`，5xx 时为 `server_error`，其他情况为 `invalid_request_error`。

| HTTP | `code` | 含义 | 处理方式 |
|---|---|---|---|
| 400 | `invalid_request` | 字段格式错误或未知、校验失败，或选项不受支持 | 修正请求；不要原样重试 |
| 400 | `skill_not_found` | 引用的 Skill 或版本不可用 | 修正 Agent 的 `skills` |
| 401 | `unauthorized` | API 密钥请求头缺失、无效或相互冲突 | 检查 `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | 已达到密钥支出上限或组织余额已用尽 | 充值或提高限额 |
| 403 | `insufficient_scope` | 该密钥受权限范围限制，无法使用 Agents 资源 | 使用在 Console 中创建的标准密钥 |
| 403 | `org_disabled` | 该组织不允许运行 Agent | 联系支持团队 |
| 404 | `not_found` | 该资源在你的组织中不存在 | 检查 ID |
| 409 | `conflict` | `row_version` 已过期、当前状态不允许该变更，或以不同请求体复用了 `Idempotency-Key` | 重新读取资源后再做决定 |
| 409 | `session_input_pending` | 之前的输入仍在投递中 | 等待；不要用新的键重新发送 |
| 409 | `session_input_expired` | 输入接收已过期 | 再次发送前先查看历史记录 |
| 409 | `session_environment_unavailable` | 执行环境不可用 | 等待或创建新的 Session |
| 413 | `request_too_large` | 请求体或由其冻结的 Session 配置超出大小限制 | 发送更小的请求体；不要原样重试 |
| 429 | `quota_exceeded` | 超出 Agents 配额 | 稍后重试 |
| 502 | `executor_rejected`、`executor_contract_error` | 执行层拒绝了请求或返回了意外响应 | 检查 Agent 配置后重试 |
| 503 | `executor_unavailable`、`storage_unavailable`、`skill_unavailable`、`tenant_unavailable`、`tenant_provisioning_failed`、`authorization_unavailable`、`admission_unavailable`、`internal_error` | 某个依赖暂时不可用 | 使用退避策略并携带相同的 `Idempotency-Key` 重试 |

也可能出现 `skill_runtime_incompatible`；它以 503 返回，消息为 `internal error`。

## 流式传输失败 {#streaming-failures}

流式响应开始后，失败信息可能以协议的流格式到达，而不是以新的
HTTP 状态码返回。请将该流视为不完整并关闭它，保留应用所需的部分内容，并且
仅在请求可安全重复时重试。

## 另请参阅 {#see-also}

- [错误代码](/api-reference/errors)：公开的响应格式和常见 HTTP 状态码
- [速率限制](/guides/rate-limiting)：429 处理与请求平滑
- [错误与重试](/guides/error-handling)：实现模式
- [身份验证](/api-reference/authentication)：支持的凭据与密钥生命周期
