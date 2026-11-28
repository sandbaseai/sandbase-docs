---
i18nSource: 99170a141af66587
title: Sessions API
description: 執行已儲存的 Agent 版本、傳送輸入、串流事件，並讀取 Session 紀錄。
---

# Sessions API {#sessions-api}

Session 會在 SandBase 的託管雲端執行一個已儲存的 [Agent](/api-reference/agents/) 版本；無須選擇執行環境。Session ID 使用 `ses_` 前綴。Session 是 Agent 的子資源：所有路徑都以 `/v1/agents/sessions` 開頭。

標準操作遵循 OpenAI Agents 協定（`client.beta.agents.sessions`）；官方 SDK 能做與不能做的事請參閱 [OpenAI 相容性](/agents/openai-compatibility)。SandBase 擴充功能另外提供重新命名、封存狀態、取消、附件、工作區檔案中繼資料、不可變的產出物，以及可重新連線的產品串流。

::: info Session 的來源
您可以直接使用 `POST /v1/agents/sessions` 建立 Session。該 Session 會回報 `source: "direct"` 與 `source_id: null`。
:::

## 建議流程 {#recommended-flow}

1. 為已儲存的 Agent [建立 Session](./create)。Session 會凍結所選的 Agent 版本與 MCP 連線，並使用該 Agent 版本已固定的 Skill 版本。
2. 使用 `GET /v1/agents/sessions/{session_id}/events` [開啟事件串流](./stream)。此串流僅提供即時事件，因此請在傳送輸入前開啟。
3. 使用 `POST /v1/agents/sessions/{session_id}/events` 搭配 `agent.session.input.message` 事件 [傳送輸入](./send-events)。此呼叫會回傳 202。
4. 從串流讀取結果，或事後從 [items](./items) 與 [turns](./turns) 讀取。

## Session 操作 {#session-operations}

| 方法 | 路徑 | 用途 |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [建立 Session](./create) |
| `GET` | `/v1/agents/sessions` | [列出 Session](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [取得 Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [取代 metadata](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | 搭配 `row_version` [重新命名](./rename) |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [刪除](./delete)，會封存該 Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [傳送一個輸入或取消事件](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [串流即時事件](./stream)（SSE） |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [列出 items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [列出 turns](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [取得單一 turn](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [取消執行中的 turn](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [封存](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [取消封存](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | 串流中斷後 [重新連線](./reconnect) |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [先快照後即時的串流](./stream-snapshot)（SSE） |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [上傳附件](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [列出附件](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [下載附件](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [刪除附件](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [列出工作區檔案中繼資料](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [列出不可變的產出物](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [下載產出物](./download-artifact) |

## 狀態欄位 {#status-fields}

- `status` 是執行狀態：`idle`、`in_progress` 或 `failed`。尚不支援需要用戶端結果的 function 工具（`requires_action`）；讀取此類 Session 會回傳 `502 executor_contract_error`。
- `lifecycle_status` 為 `active` 或 `archived`。已封存的 Session 會拒絕輸入、metadata 更新與串流。`DELETE` 會封存；`unarchive` 會還原。
- `failure` 為 `null`，或是包含 `code`、`message`、`action`，有時還有 `retryable` 的物件。

| `failure.code` | 說明 | 建議的 `action` |
|---|---|---|
| `session_creation_rejected` | 執行層拒絕了該 Session | `create_new_session` |
| `model_authentication_failed` | 模型供應商拒絕了金鑰 | `create_session_with_updated_model_provider` |
| `model_rate_limited` | 模型供應商正在限制速率（可重試） | `retry_later` |
| `model_quota_exceeded` | 模型帳戶沒有可用配額 | `check_model_account` |
| `context_limit_exceeded` | 對話超出模型的上下文長度 | `create_new_session` |
| `environment_connection_timeout` | 環境未能及時連線（可重試） | `retry_later` |
| `runtime_unavailable` | 執行環境無法使用（可重試） | `retry_later` |
| `model_request_failed` | 模型請求未完成 | `inspect_history` |
| `model_configuration_rejected` | 模型或執行層拒絕了設定 | `create_session_with_updated_model_provider` |
| `execution_failed` | 沒有更具體公開原因的失敗 | `inspect_history` |

當 Session 無法即時讀取時，列表結果中也可能包含帶有 `session_not_ready`、`session_execution_unavailable`、`session_configuration_unavailable` 或 `session_snapshot_unavailable` 的佔位資料列。

## 模型憑證 {#model-credentials}

預設情況下，Session 會使用建立它的同一把 SandBase API 金鑰呼叫模型。傳送 `model_provider` 即可明確選擇：

- `{"type": "sandbase"}` 使用您呼叫時的金鑰。不允許 `base_url`。
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` 會呼叫您自己的 OpenAI 相容 HTTPS 端點。URL 不可包含憑證、查詢字串或片段，且 SandBase 絕不會退回使用您的 SandBase 金鑰。

`model_provider` 僅可寫入，永遠不會出現在回應中。

## 准入與錯誤 {#admission-and-errors}

建立 Session 與傳送輸入時會檢查執行准入：金鑰額度或組織餘額用盡時回傳 `402 spending_limit_exceeded`，組織無法執行 Agent 時回傳 `403 org_disabled`，檢查無法完成時回傳 `503 admission_unavailable`。讀取、取消與封存不受餘額限制。

傳送輸入也可能回傳 `409 session_input_pending`（先前的輸入仍在傳遞中；請稍候，不要以新的金鑰重新傳送）、`409 session_input_expired`（重新傳送前請先檢查紀錄）或 `409 session_environment_unavailable`（請稍候或建立新的 Session）。請參閱 [錯誤](/api-reference/errors#agents-platform-errors)。

## 分頁 {#pagination}

Session、items、turns 與產出物使用游標分頁（`limit` 1-100、`after`、`order`）。附件使用 offset 分頁（`limit` 1-100、`offset`）。

工作區檔案則改用 `page` / `next` 分頁。請參閱 [列出工作區檔案](./list-workspace-files)。
