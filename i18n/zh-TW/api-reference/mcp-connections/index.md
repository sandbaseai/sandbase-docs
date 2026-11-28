---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: 註冊可供 Agent 呼叫的遠端 HTTPS MCP 伺服器。
---

# MCP Connections API {#mcp-connections-api}

MCP 連線用於註冊一個可透過 HTTPS 存取的遠端 MCP 伺服器。Agent 會在 `mcp_connections` 中參照連線；每個 Session 啟動時都會凍結當下的連線設定。連線 ID 使用 `mcp_` 前綴。若要以 Bearer token 向伺服器驗證，請先為相同的 URL 建立一個 [Secret](/agents/api-credentials#with-the-api)。

| 方法 | 路徑 | 用途 |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [建立連線](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [列出連線](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [取得連線](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [取代連線](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [啟用連線](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [停用連線](#disable-a-connection) |

每個寫入操作都需要 `Idempotency-Key`（1 到 128 位元組，前後不可有空白）。連線物件包含 `id`、`name`、`server_url`、`secret_id`（有設定時）、`status`（`active` 或 `disabled`）、`row_version`、`created_at` 與 `updated_at`。

## 建立連線 {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` 為必填且不可空白，最多 128 位元組。
- `server_url` 必須是 HTTPS，且不可包含使用者資訊、查詢字串或片段（最多 2048 位元組）。
- `secret_id` 為選填。匿名伺服器請省略此欄位。設定時，該 Secret 必須為 `active`，且其 `server_url` 必須與此 `server_url` 完全相同，否則請求會失敗（Secret 未啟用時回傳 409，URL 不符時回傳 400）。

回傳 `201 Created`。

## 列出連線 {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

使用 offset 分頁，回傳 `data`、`total`、`limit` 與 `offset`。`limit` 預設為 20，上限為 200；缺漏、無效或非正數的值會使用 20。`offset` 預設為 0；無效或非正數的值會使用 0。依回傳的 `limit` 往後翻頁，直到 `offset + data.length >= total`。已停用的資源仍會出現在清單中。

## 取得連線 {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## 取代連線 {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` 會一併取代 `name`、`server_url` 與 `secret_id`；省略 `secret_id` 會讓連線變成匿名。`row_version` 為必填，且必須與 Get Connection 回傳的目前值相符。回傳 `200 OK` 與更新後的連線。已停用的連線在取代後仍維持停用，直到您將其啟用。

## 啟用連線 {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` 為必填，且必須是與目前資源相符的正整數。回傳 `200 OK` 與該連線。啟用後連線 ID 維持不變。啟用不會還原已撤銷的 Secret；請先以新的有效 Secret 取代該連線。

## 停用連線 {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

回傳 `204 No Content`，並將 `status` 設為 `disabled`。新的 Session 將無法使用此連線，而已凍結此連線的既有 Session 會拒絕後續輸入。已在執行中的工具呼叫不會被中斷。

## 變更與執行中的 Session {#changes-and-running-sessions}

Session 會在啟動時凍結連線設定。當您取代連線或輪替其 Secret 後，新的 Session 會使用新的設定，既有的 Session 則保留其快照。停用連線或撤銷其 Secret 會同時阻擋新的 Session，以及對既有 Session 的後續輸入。

## 錯誤與重試 {#errors-and-retries}

錯誤會使用 [Agents 錯誤封裝格式](/api-reference/errors#agents-platform-errors)。欄位無效或寫入時缺少冪等金鑰會回傳 `400 invalid_request`；未知或無法存取的資源會回傳 `404 not_found`。`row_version` 過期、生命週期狀態不相容，或以不同輸入重複使用建立／更新的金鑰，會回傳 `409 conflict`。發出新的更新前請重新讀取資源，並為每個新的寫入操作使用新的金鑰。

`created_at` 與 `updated_at` 為 RFC 3339 時間戳記字串。
