---
i18nSource: ac4e3b9b9eef4c7d
title: API 錯誤
description: 依 HTTP 狀態、端點類別、文件記載的回應格式與重試安全性，處理 SandBase API 錯誤。
---

# API 錯誤 {#api-errors}

SandBase 使用標準 HTTP 狀態碼，但並未提供單一通用的錯誤本文。請先依 HTTP 狀態分支處理，再依您所呼叫端點記載的回應結構描述進行剖析。請勿要求每個錯誤都包含 `code`、`param`、`message` 或 `request_id`。

## 回應格式 {#response-shapes}

核心中介軟體與部分 `/v1/*` 端點會傳回扁平的錯誤：

```json
{"error":"organization rate limit exceeded"}
```

Agents 平台資源（`/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、`/v1/skills*`）會傳回帶有穩定 `code` 的 OpenAI 風格物件。請參閱 [Agents 平台錯誤](#agents-platform-errors)：

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Webhook Events API（`/events/webhooks*`）會傳回 `{"code":<http status>,"message":"..."}`。請參閱 [Webhooks](/api-reference/webhooks#authentication-and-errors)。

OpenAI 相容端點保留 OpenAI 相容的封裝格式。`POST /v1/messages` 保留 Anthropic 相容的封裝格式：

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

公開操作的確切狀態碼與結構描述，請參閱 [OpenAPI 規格](/openapi.yaml)。

## HTTP 狀態處理 {#http-status-handling}

| 狀態 | 常見意義 | 用戶端處理方式 |
|---|---|---|
| `400` | 輸入無效或參數不受支援 | 依端點與所選模型的結構描述修正請求。 |
| `401` | 憑證遺失、無效、已撤銷或已過期 | 更換或輪替憑證；請勿原封不動地重試。 |
| `402` | 請求無法支付，或已達支出上限 | 先處理餘額或金鑰上限問題再重試。 |
| `403` | 憑證缺少權限，或相容性端點將支出失敗對應為 403 | 檢查端點專屬的封裝格式，並使用已授權的金鑰。 |
| `404` | 呼叫端無法使用該模型或資源 | 確認目前的模型 ID 或資源 ID。 |
| `409` | 資源狀態衝突 | 先讀取最新狀態，再判斷重試是否安全。 |
| `422` | 資源輸入在語意上無效 | 修正文件中記載的欄位值。 |
| `429` | 組織請求上限或影片並行上限 | 若操作可安全重複執行，請以有上限的退避與隨機抖動重試。 |
| `500`、`502`、`503`、`504` | SandBase 或上游失敗 | 僅在操作可安全重複執行時重試。 |

並非每個端點都會記載此表中的所有狀態。以操作的 OpenAPI 回應對應為準。

## 驗證錯誤 {#authentication-errors}

文件記載的驗證訊息包括：

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

在範圍之外使用具範圍限制的金鑰時，會傳回 `403` 與巢狀本文：`{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`。Agents 平台資源會以其自身的封裝格式傳回相同的 `code`。

標準端點請使用 `Authorization: Bearer $SANDBASE_API_KEY`。`POST /v1/messages` 也接受 `x-api-key`；協定相容的 Google 端點會各自記載其支援的金鑰標頭。

已撤銷的金鑰無法重新啟用。請建立替代金鑰、更新使用該金鑰的應用程式、驗證正常運作，然後移除所有對舊金鑰的參照。

## 速率限制 {#rate-limits}

`organization rate limit exceeded`（`429`）表示您的組織已達到所分配的每分鐘請求數上限，此上限由組織內所有 API 金鑰共用。協定相容端點會以其自身的封裝格式傳回此錯誤。由於上限是依組織分配，SandBase 不會公布單一通用的數值上限。

若回應包含 `Retry-After`，請遵守該值。否則請使用帶有隨機抖動且有上限的指數退避。平滑請求的做法請參閱[速率限制](/guides/rate-limiting)。

任務提交另有兩項檢查。`organization concurrency limit exceeded`（`429`）表示您的組織進行中的任務數已達帳戶等級允許的上限；當有執行中的任務完成後即會解除。此限制適用於 `POST /v1/run` 與 `/v1/api/*` 上的所有模型類型，以及其他端點上的影片提交。`insufficient credit for estimated video cost`（`402`）表示預估費用超過您的餘額加上信用額度；請先儲值再重試。請參閱[並行上限](/guides/concurrency-limits)。

## 重試安全性 {#retry-safety}

請依下列順序判斷：

1. 確認該操作是否已產生外部可見的效果。
2. 請勿原封不動地重試 `400`、`401`、`402`、`403`、`404` 或 `422` 請求。
3. 遇到 `409` 時，請先讀取目前的資源狀態再重試。
4. `429` 與暫時性的 `5xx` 回應只應重試少量且有上限的次數。
5. 在重複建立、觸發、上傳或外部動作請求之前，請確認該操作具冪等性，或您的應用程式能夠調和重複項目。

合適的延遲為：

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Agents 平台錯誤 {#agents-platform-errors}

Agents、Sessions、Skills、MCP 連線與 Secrets 會傳回同一種封裝格式。大多數代碼的 `message` 是固定且安全的句子；`invalid_request` 可能附帶簡短說明，例如哪種輸入格式或選項不受支援。請依 `code` 分支處理，而不是依 `message`。

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

401 的 `type` 為 `authentication_error`，5xx 為 `server_error`，其他情況為 `invalid_request_error`。

| HTTP | `code` | 意義 | 處理方式 |
|---|---|---|---|
| 400 | `invalid_request` | 欄位格式錯誤或未知、驗證失敗，或選項不受支援 | 修正請求；請勿原封不動地重試 |
| 400 | `skill_not_found` | 參照的 Skill 或版本無法使用 | 修正 Agent 的 `skills` |
| 401 | `unauthorized` | API 金鑰標頭遺失、無效或互相衝突 | 檢查 `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | 已用盡金鑰支出上限或組織餘額 | 加值點數或提高上限 |
| 403 | `insufficient_scope` | 金鑰具範圍限制，無法使用 Agents 資源 | 使用在 Console 建立的標準金鑰 |
| 403 | `org_disabled` | 該組織不允許執行 Agent | 聯絡支援團隊 |
| 404 | `not_found` | 該資源不存在於您的組織中 | 檢查 ID |
| 409 | `conflict` | `row_version` 已過期、目前狀態不允許此變更，或以不同本文重複使用 `Idempotency-Key` | 重新讀取資源後再決定 |
| 409 | `session_input_pending` | 先前的輸入仍在傳送中 | 請等待；不要以新的金鑰重新傳送 |
| 409 | `session_input_expired` | 輸入受理已逾時 | 再次傳送前先檢查歷史記錄 |
| 409 | `session_environment_unavailable` | 執行環境無法使用 | 稍候或建立新的 Session |
| 413 | `request_too_large` | 請求本文或由其凍結的 Session 設定超過大小上限 | 傳送較小的本文；請勿原封不動地重試 |
| 429 | `quota_exceeded` | 已超過 Agents 配額 | 稍後再試 |
| 502 | `executor_rejected`、`executor_contract_error` | 執行層拒絕了請求或回應不符預期 | 檢查 Agent 設定後再重試 |
| 503 | `executor_unavailable`、`storage_unavailable`、`skill_unavailable`、`tenant_unavailable`、`tenant_provisioning_failed`、`authorization_unavailable`、`admission_unavailable`、`internal_error` | 某項相依服務暫時無法使用 | 以退避方式並使用相同的 `Idempotency-Key` 重試 |

也可能出現 `skill_runtime_incompatible`；它會以 503 傳回，訊息為 `internal error`。

## 串流失敗 {#streaming-failures}

串流開始後，錯誤可能以該協定的串流格式送達，而不是以新的 HTTP 回應傳回。請將該串流視為不完整，保留應用程式所需的部分輸出，並僅在重新產生請求是安全的情況下重試。請勿假設每個供應商都會發出相同的終止事件或結束原因。

## 營運除錯 {#operational-debugging}

請記錄端點、HTTP 狀態、所選的模型或資源 ID、時間戳記，以及伺服器傳回的任何安全請求識別碼。切勿在日誌中記錄授權標頭、API 金鑰、憑證值或敏感的提示內容。

使用 [Developer → Activities](https://www.sandbase.ai/console/activities) 檢查組織的請求歷史。回報持續性的失敗時，請附上已去除敏感資訊的請求中繼資料，以及最小的可重現請求。

## 另請參閱 {#see-also}

- [驗證](/api-reference/authentication)
- [錯誤與重試](/guides/error-handling)
- [速率限制](/guides/rate-limiting)
- [AI 可讀的錯誤指南](/for-agents/errors)
