---
i18nSource: ac4e3b9b9eef4c7d
title: API 错误
description: 根据 HTTP 状态码、端点类别、文档中的响应结构和重试安全性处理 SandBase API 错误。
---

# API 错误 {#api-errors}

SandBase 使用标准 HTTP 状态码，但并不提供统一的错误响应体。请先根据 HTTP 状态码分支处理，再按所调用端点文档中的响应结构进行解析。不要假定每个错误都包含 `code`、`param`、`message` 或 `request_id`。

## 响应结构 {#response-shapes}

核心中间件和部分 `/v1/*` 端点返回扁平结构的错误：

```json
{"error":"organization rate limit exceeded"}
```

Agents 平台资源（`/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、`/v1/skills*`）返回 OpenAI 风格的对象，并带有稳定的 `code`。参见 [Agents 平台错误](#agents-platform-errors)：

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Webhook Events API（`/events/webhooks*`）返回 `{"code":<http status>,"message":"..."}`。参见 [Webhooks](/api-reference/webhooks#authentication-and-errors)。

OpenAI 兼容端点保留 OpenAI 兼容的错误结构。`POST /v1/messages` 保留 Anthropic 兼容的错误结构：

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

公开操作的确切状态码和结构请参阅 [OpenAPI 规范](/openapi.yaml)。

## HTTP 状态码处理 {#http-status-handling}

| 状态码 | 常见含义 | 客户端处理方式 |
|---|---|---|
| `400` | 输入无效或参数不受支持 | 根据端点和所选模型的结构修正请求。 |
| `401` | 凭据缺失、无效、已吊销或已过期 | 更换或轮换凭据；不要原样重试。 |
| `402` | 请求无法扣费，或已达到消费上限 | 解决余额或密钥上限问题后再重试。 |
| `403` | 凭据缺少权限，或兼容端点将扣费失败映射为 403 | 检查该端点特有的错误结构，并使用有权限的密钥。 |
| `404` | 调用方无法使用该模型或资源 | 核实当前的模型 ID 或资源 ID。 |
| `409` | 资源状态冲突 | 先读取最新状态，再判断重试是否安全。 |
| `422` | 资源输入在语义上无效 | 按文档修正字段值。 |
| `429` | 组织请求限制或视频并发限制 | 如果操作可以安全重复，使用有上限的退避和随机抖动重试。 |
| `500`、`502`、`503`、`504` | SandBase 或上游故障 | 仅在操作可以安全重复时重试。 |

并非每个端点都会在文档中列出此表中的所有状态码。以该操作的 OpenAPI 响应映射为准。

## 认证错误 {#authentication-errors}

文档中列出的认证错误消息包括：

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

在权限范围之外使用受限密钥时，会返回 `403` 及嵌套结构的响应体：`{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`。Agents 平台资源会在其自身的错误结构中返回相同的 `code`。

标准端点请使用 `Authorization: Bearer $SANDBASE_API_KEY`。`POST /v1/messages` 也接受 `x-api-key`；与 Google 协议兼容的端点会在各自文档中说明支持的密钥请求头。

已吊销的密钥无法重新启用。请创建替代密钥，更新使用该密钥的应用并验证，然后移除对旧密钥的所有剩余引用。

## 速率限制 {#rate-limits}

`organization rate limit exceeded`（`429`）表示你的组织已达到为其分配的每分钟请求数上限，该上限由组织内所有 API 密钥共享。协议兼容端点会在其自身的错误结构中返回此错误。由于限制按组织分配，SandBase 不公布统一的数值上限。

如果响应包含 `Retry-After`，请遵循该值。否则，请使用带随机抖动、有上限的指数退避。平滑请求的方法请参阅[速率限制](/guides/rate-limiting)。

任务提交还有两项额外检查。`organization concurrency limit exceeded`（`429`）表示你的组织进行中的任务数已达到账户等级允许的上限；有任务运行结束后即可恢复。该限制适用于 `POST /v1/run` 和 `/v1/api/*` 上的所有模型类型，以及其他端点上的视频提交。`insufficient credit for estimated video cost`（`402`）表示预估费用超过了你的余额加信用额度；请充值后再重试。参见[并发限制](/guides/concurrency-limits)。

## 重试安全 {#retry-safety}

按以下顺序决策：

1. 判断该操作是否已经产生了外部可见的影响。
2. 不要原样重试返回 `400`、`401`、`402`、`403`、`404` 或 `422` 的请求。
3. 对于 `409`，先读取资源的当前状态再重试。
4. 对 `429` 和临时性的 `5xx` 响应，只进行少量、有上限的重试。
5. 在重复发送创建、触发、上传或外部操作请求之前，确认该操作是幂等的，或者你的应用能够处理重复结果。

合适的延迟计算方式如下：

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Agents 平台错误 {#agents-platform-errors}

Agents、Sessions、Skills、MCP 连接和 Secrets 返回统一的错误结构。对于大多数错误码，`message` 是一条固定且安全的语句；`invalid_request` 可能附带简短说明，例如哪种输入结构或选项不受支持。请根据 `code` 而非 `message` 进行分支处理。

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

401 时 `type` 为 `authentication_error`，5xx 时为 `server_error`，其他情况为 `invalid_request_error`。

| HTTP | `code` | 含义 | 处理方式 |
|---|---|---|---|
| 400 | `invalid_request` | 字段格式错误或未知、校验失败，或选项不受支持 | 修正请求；不要原样重试 |
| 400 | `skill_not_found` | 引用的 Skill 或版本不可用 | 修正 Agent 的 `skills` |
| 401 | `unauthorized` | API 密钥请求头缺失、无效或相互冲突 | 检查 `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | 密钥消费上限或组织余额已用尽 | 充值或提高上限 |
| 403 | `insufficient_scope` | 该密钥为受限密钥，无法使用 Agents 资源 | 使用在 Console 中创建的标准密钥 |
| 403 | `org_disabled` | 该组织不允许运行 Agents | 联系支持团队 |
| 404 | `not_found` | 该资源在你的组织中不存在 | 检查 ID |
| 409 | `conflict` | `row_version` 已过期、当前状态不允许此变更，或同一 `Idempotency-Key` 被用于不同的请求体 | 重新读取资源后再决定 |
| 409 | `session_input_pending` | 之前的输入仍在投递中 | 等待；不要使用新键重新发送 |
| 409 | `session_input_expired` | 输入受理已过期 | 先检查历史记录再重新发送 |
| 409 | `session_environment_unavailable` | 执行环境不可用 | 等待或创建新的 Session |
| 413 | `request_too_large` | 请求体或由其冻结的 Session 配置超出大小限制 | 发送更小的请求体；不要原样重试 |
| 429 | `quota_exceeded` | 超出 Agents 配额 | 稍后重试 |
| 502 | `executor_rejected`、`executor_contract_error` | 执行层拒绝了请求或返回了意外响应 | 检查 Agent 配置后重试 |
| 503 | `executor_unavailable`、`storage_unavailable`、`skill_unavailable`、`tenant_unavailable`、`tenant_provisioning_failed`、`authorization_unavailable`、`admission_unavailable`、`internal_error` | 某个依赖暂时不可用 | 使用退避策略并携带相同的 `Idempotency-Key` 重试 |

也可能出现 `skill_runtime_incompatible`；它以 503 返回，消息为 `internal error`。

## 流式传输失败 {#streaming-failures}

流开始之后，错误可能以该协议的流格式到达，而不是作为新的 HTTP 响应返回。请将该流视为不完整，保留应用所需的部分输出，并且仅在重新生成请求是安全的情况下重试。不要假定所有服务商都会发出相同的终止事件或结束原因。

## 运维调试 {#operational-debugging}

记录端点、HTTP 状态码、所选模型或资源 ID、时间戳，以及服务器返回的任何可安全记录的请求标识。切勿记录授权请求头、API 密钥、凭据值或敏感的提示词内容。

使用 [Developer → Activities](https://www.sandbase.ai/console/activities) 查看组织的请求历史。报告持续性故障时，请附上已脱敏的请求元数据和最小可复现请求。

## 另请参阅 {#see-also}

- [认证](/api-reference/authentication)
- [错误与重试](/guides/error-handling)
- [速率限制](/guides/rate-limiting)
- [面向 AI 的错误指南](/for-agents/errors)
