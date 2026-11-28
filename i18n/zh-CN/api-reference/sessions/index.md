---
i18nSource: 99170a141af66587
title: Sessions API
description: 运行已保存的 Agent 版本、发送输入、订阅事件流并读取 Session 历史。
---

# Sessions API {#sessions-api}

Session 在 SandBase 托管云中运行一个已保存的 [Agent](/api-reference/agents/) 版本，无需选择执行环境。Session ID 使用 `ses_` 前缀。Session 是 Agent 的子资源：所有路径都以 `/v1/agents/sessions` 开头。

标准操作遵循 OpenAI Agents 协议（`client.beta.agents.sessions`）；官方 SDK 能做和不能做的事情请参阅 [OpenAI 兼容性](/agents/openai-compatibility)。SandBase 扩展提供了重命名、归档状态、取消、附件、工作区文件元数据、不可变产物以及可重连的产品事件流。

::: info Session 的来源
你可以直接使用 `POST /v1/agents/sessions` 创建 Session。该 Session 报告 `source: "direct"` 和 `source_id: null`。
:::

## 推荐流程 {#recommended-flow}

1. 为已保存的 Agent [创建 Session](./create)。Session 会冻结所选的 Agent 版本和 MCP 连接，并使用该 Agent 版本已固定的 Skill 版本。
2. 使用 `GET /v1/agents/sessions/{session_id}/events` [打开事件流](./stream)。该流只推送实时事件，因此请在发送输入之前打开它。
3. 使用 `POST /v1/agents/sessions/{session_id}/events` 和 `agent.session.input.message` 事件[发送输入](./send-events)。该调用返回 202。
4. 从事件流读取结果，或事后从 [items](./items) 和 [turns](./turns) 读取。

## Session 操作 {#session-operations}

| 方法 | 路径 | 用途 |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [创建 Session](./create) |
| `GET` | `/v1/agents/sessions` | [列出 Session](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [获取 Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [替换 metadata](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | 使用 `row_version` [重命名](./rename) |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [删除](./delete)，即归档该 Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [发送一个输入或取消事件](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [实时事件流](./stream)（SSE） |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [列出 items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [列出 turns](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [获取单个 turn](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [取消正在运行的 turn](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [归档](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [取消归档](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | 流断开后[重连](./reconnect) |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [先快照后实时的事件流](./stream-snapshot)（SSE） |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [上传附件](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [列出附件](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [下载附件](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [删除附件](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [列出工作区文件元数据](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [列出不可变产物](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [下载产物](./download-artifact) |

## 状态字段 {#status-fields}

- `status` 是执行状态：`idle`、`in_progress` 或 `failed`。暂不支持需要客户端返回结果的 function 工具（`requires_action`）；读取此类 Session 会返回 `502 executor_contract_error`。
- `lifecycle_status` 为 `active` 或 `archived`。已归档的 Session 拒绝输入、metadata 更新和事件流。`DELETE` 会归档；`unarchive` 会恢复。
- `failure` 为 `null`，或包含 `code`、`message`、`action`（有时还有 `retryable`）的对象。

| `failure.code` | 含义 | 建议的 `action` |
|---|---|---|
| `session_creation_rejected` | 执行层拒绝了该 Session | `create_new_session` |
| `model_authentication_failed` | 模型服务商拒绝了密钥 | `create_session_with_updated_model_provider` |
| `model_rate_limited` | 模型服务商正在限流（可重试） | `retry_later` |
| `model_quota_exceeded` | 模型账户没有配额 | `check_model_account` |
| `context_limit_exceeded` | 对话超出模型上下文长度 | `create_new_session` |
| `environment_connection_timeout` | 环境未能及时连接（可重试） | `retry_later` |
| `runtime_unavailable` | 执行环境不可用（可重试） | `retry_later` |
| `model_request_failed` | 模型请求未完成 | `inspect_history` |
| `model_configuration_rejected` | 模型或执行层拒绝了该配置 | `create_session_with_updated_model_provider` |
| `execution_failed` | 没有更具体公开原因的失败 | `inspect_history` |

当某个 Session 无法实时读取时，列表结果中也可能包含带有 `session_not_ready`、`session_execution_unavailable`、`session_configuration_unavailable` 或 `session_snapshot_unavailable` 的占位行。

## 模型凭据 {#model-credentials}

默认情况下，Session 使用创建它的同一个 SandBase API 密钥调用模型。如需明确选择，请发送 `model_provider`：

- `{"type": "sandbase"}` 使用你调用时的密钥。不允许设置 `base_url`。
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` 调用你自己的 OpenAI 兼容 HTTPS 端点。URL 不能包含凭据、查询参数或片段，且 SandBase 永远不会回退到你的 SandBase 密钥。

`model_provider` 为只写字段，永远不会出现在响应中。

## 准入与错误 {#admission-and-errors}

创建 Session 和发送输入时会检查执行准入：密钥限额或组织余额耗尽时返回 `402 spending_limit_exceeded`，组织无法运行 Agent 时返回 `403 org_disabled`，检查无法完成时返回 `503 admission_unavailable`。读取、取消和归档不受余额限制。

发送输入还可能返回 `409 session_input_pending`（之前的输入仍在投递中；请等待，不要用新的键重新发送）、`409 session_input_expired`（再次发送前请检查历史记录）或 `409 session_environment_unavailable`（请等待或创建新的 Session）。参阅[错误](/api-reference/errors#agents-platform-errors)。

## 分页 {#pagination}

Session、items、turns 和产物使用游标分页（`limit` 1-100、`after`、`order`）。附件使用 offset 分页（`limit` 1-100、`offset`）。

工作区文件则使用 `page` / `next` 分页。参阅[列出工作区文件](./list-workspace-files)。
