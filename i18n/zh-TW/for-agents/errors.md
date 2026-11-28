---
i18nSource: 95410ff7ea741f64
title: AI 可讀的錯誤指南
description: 依端點系列、HTTP 狀態、重試安全性與文件記載的回應格式處理 SandBase API 錯誤。
---

# AI 用戶端的錯誤處理 {#error-handling-for-ai-clients}

SandBase 沒有提供單一的通用錯誤 schema。請先依 HTTP 狀態分支處理，再解析該端點系列文件所記載的回應格式。不要假設每個回應都包含 `code`、`param`、`request_id` 或特定的訊息字串。

## 公開的回應格式 {#public-response-shapes}

核心 `/v1/*` 中介軟體以及部分模型或資源端點會回傳扁平的錯誤：

```json
{"error":"organization rate limit exceeded"}
```

Agents 平台資源（`/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、`/v1/skills*`）會回傳帶有穩定 `code` 的 OpenAI 風格物件。請參閱 [Agents 平台錯誤](#agents-platform-errors)：

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

OpenAI 相容閘道會保留 OpenAI 相容的封裝格式。`POST /v1/messages` 則保留 Anthropic 相容的封裝格式：

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP 狀態處理 {#http-status-handling}

| 狀態 | 意義 | 用戶端動作 |
|---|---|---|
| `400` | 輸入無效或參數不受支援 | 依所選端點與模型 schema 修正請求。 |
| `401` | 憑證缺漏、無效、已撤銷或已過期 | 更換或輪替憑證；不要在未變更的情況下重試。 |
| `402` | 請求無法支付費用，或已達支出上限 | 先解決帳務或金鑰上限問題再重試。 |
| `403` | 憑證缺少權限，或相容介面將支出失敗對應為 403 | 檢查文件記載的封裝格式，並使用具授權的金鑰。 |
| `404` | 找不到模型或資源 | 確認目前的模型名稱或資源 ID。 |
| `409` | 資源狀態衝突 | 先讀取最新的資源狀態，再判斷重試是否安全。 |
| `429` | 組織請求上限或影片並行上限 | 使用有上限的指數退避與抖動重試。 |
| `500`、`502`、`503`、`504` | SandBase 或上游的暫時性失敗 | 僅在操作可安全重複時重試。 |

## 驗證與速率限制訊息 {#authentication-and-rate-limit-messages}

文件記載的驗證訊息包括：

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

在權限範圍外使用受限範圍的金鑰，會改為回傳帶有巢狀本文的 `403`：`{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`。Agents 平台資源會在其自身的封裝格式中回傳相同的 `code`。

文件記載的速率限制訊息為 `organization rate limit exceeded`（組織被指定的每分鐘請求數上限，由其所有 API 金鑰共用）。`429` 回應目前不包含 `Retry-After` 或 `X-RateLimit-*` 標頭，也沒有公布通用的 RPM 或並行數預設值。

## 模型與資源查詢 {#model-and-resource-lookup}

使用 `GET /v1/models` 找出已啟用的模型 ID，並在執行前使用 `GET /v1/models/{id_or_name}` 檢視模型。請將資源 ID 視為不透明值，並透過相關的 list 或 get 操作驗證。不要根據 ID 前綴自行組出不同的輪詢 URL。

## 重試演算法 {#retry-algorithm}

使用帶有抖動的有上限指數退避：

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

套用以下規則：

- 在用戶端計算的延遲後重試 `429`；
- 暫時性的 `5xx` 回應只重試少量且有上限的次數；
- 不要重試未變更的 `400`、`401`、`402`、`403` 或 `404` 請求；
- 在重複任何建立、觸發或外部動作請求之前，先確認其冪等性；
- 串流失敗時保留部分輸出，並判斷繼續或重新開始是否安全；
- 將最終的 HTTP 狀態與經過清理的端點專屬錯誤回報給呼叫端。

## Agents 平台錯誤 {#agents-platform-errors}

Agents、Sessions、Skills、MCP 連線與 Secret 會回傳同一種封裝格式。對大多數代碼而言，`message` 是固定且安全的句子；`invalid_request` 可能附帶簡短說明，例如哪種輸入格式或選項不受支援。請依 `code` 分支處理，而不是依 `message`。

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

401 的 `type` 為 `authentication_error`，5xx 為 `server_error`，其餘為 `invalid_request_error`。

| HTTP | `code` | 意義 | 處理方式 |
|---|---|---|---|
| 400 | `invalid_request` | 欄位格式錯誤或未知、驗證失敗，或選項不受支援 | 修正請求；不要在未變更的情況下重試 |
| 400 | `skill_not_found` | 參照的 Skill 或版本無法使用 | 修正 Agent 的 `skills` |
| 401 | `unauthorized` | API 金鑰標頭缺漏、無效或互相衝突 | 檢查 `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | 金鑰支出上限或組織餘額已用盡 | 加值點數或提高上限 |
| 403 | `insufficient_scope` | 金鑰受限於特定範圍，無法使用 Agents 資源 | 使用在 Console 建立的標準金鑰 |
| 403 | `org_disabled` | 組織不允許執行 Agent | 聯絡支援團隊 |
| 404 | `not_found` | 資源不存在於您的組織中 | 檢查 ID |
| 409 | `conflict` | `row_version` 過期、目前狀態不允許此變更，或以不同本文重複使用 `Idempotency-Key` | 重新讀取資源後再決定 |
| 409 | `session_input_pending` | 先前的輸入仍在傳遞中 | 請等待；不要使用新的金鑰重新傳送 |
| 409 | `session_input_expired` | 輸入受理已過期 | 再次傳送前先檢查歷史記錄 |
| 409 | `session_environment_unavailable` | 執行環境無法使用 | 稍候或建立新的 Session |
| 413 | `request_too_large` | 請求本文或由其凍結的 Session 設定超過大小上限 | 傳送較小的本文；不要在未變更的情況下重試 |
| 429 | `quota_exceeded` | 超過 Agents 配額 | 稍後重試 |
| 502 | `executor_rejected`、`executor_contract_error` | 執行層拒絕了請求或回應不符預期 | 檢查 Agent 設定後再重試 |
| 503 | `executor_unavailable`、`storage_unavailable`、`skill_unavailable`、`tenant_unavailable`、`tenant_provisioning_failed`、`authorization_unavailable`、`admission_unavailable`、`internal_error` | 某個相依服務暫時無法使用 | 使用退避並以相同的 `Idempotency-Key` 重試 |

也可能出現 `skill_runtime_incompatible`；它會以 503 回傳，訊息為 `internal error`。

## 串流失敗 {#streaming-failures}

串流回應開始後，失敗可能會以該協定的串流格式傳回，而不是以新的 HTTP 狀態傳回。請將串流視為不完整並關閉它，保留應用程式需要的部分內容，且僅在請求可安全重複時重試。

## 另請參閱 {#see-also}

- [錯誤代碼](/api-reference/errors) — 公開的回應格式與常見 HTTP 狀態
- [速率限制](/guides/rate-limiting) — 429 處理與請求平滑化
- [錯誤與重試](/guides/error-handling) — 實作模式
- [驗證](/api-reference/authentication) — 支援的憑證與金鑰生命週期
