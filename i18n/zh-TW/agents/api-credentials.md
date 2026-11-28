---
i18nSource: dab112fdbbc56799
title: MCP 工具的憑證
description: 將唯寫的 Bearer 權杖存為 Secret，讓 Agent 能呼叫需要驗證的 MCP 伺服器。
---

# MCP 工具的憑證 {#credentials-for-mcp-tools}

當 MCP 伺服器需要驗證時，請將其 Bearer 權杖存為 **Secret**，再將 Secret 附加到 [MCP 連線](/agents/mcp-tools#mcp-connections)。執行環境只會將權杖傳送給該伺服器。

## Secret 的運作方式 {#how-secrets-work}

- `kind` 一律為 `mcp_bearer`：用於單一 MCP 伺服器的 Bearer 權杖。
- 每個 Secret 都綁定一個確切的 `server_url`。只有 `server_url` 相符的連線才能使用它。若要用於其他 URL，請另建一個 Secret。
- 權杖為唯寫。API 會回傳 Secret 的名稱、URL、狀態與 `row_version`，但絕不回傳權杖。
- Secret 不是環境變數。它們不會注入 Agent 執行環境，Agent 也無法讀取。

舊版 SandBase 會儲存工作區或 Agent 範圍的憑證，並以 `GITHUB_TOKEN` 等環境變數注入。此模式已停用，其紀錄也不會遷移。請將仍需要的值重新建立為 MCP 連線上的 Secret。

## 使用 API {#with-the-api}
使用 API 建立、輪替及撤銷 Secret。本指南即為 API 合約；從 Agent 編輯器開啟的 Console「Credentials」頁面並非 Secret 行為的參考依據。請從受信任的後端呼叫這些端點，切勿從瀏覽器程式碼呼叫：它們需要 SandBase API 金鑰與明文權杖。

| 方法 | 路徑 | 用途 |
|---|---|---|
| `POST` | `/v1/secrets` | [建立 Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [列出 Secret](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [取得 Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [輪替權杖](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [撤銷 Secret](#revoke-a-secret) |

每個寫入操作都需要 `Idempotency-Key`（1–128 位元組，前後不可有空白）。Secret 物件包含 `id`（`sec_` 前綴）、`name`、`kind`、`server_url`、`status`、`row_version`、`created_at` 與 `updated_at`。權杖儲存中時 `status` 為 `pending`，可使用時為 `active`，撤銷後為 `disabled`。`created_at` 與 `updated_at` 為 RFC 3339 時間戳記字串。

### 建立 Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` 必須為 `mcp_bearer`。
- `server_url` 必須為 HTTPS，且不可包含使用者資訊、查詢字串或片段。此 Secret 只適用於這個確切的 URL。
- `name` 與 `token` 為必填且不可空白。`name` 最多 128 位元組，`token` 最多 16384 位元組，`server_url` 最多 2048 位元組。

回應為 `201 Created`，不含權杖。[建立 MCP 連線](/api-reference/mcp-connections/#create-a-connection)時，請將 `sec_` ID 作為 `secret_id` 使用。

### 列出 Secret {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

採用位移分頁，包含 `data`、`total`、`limit` 與 `offset`。`limit` 預設為 20，上限為 200；缺少、無效或非正數的值會使用 20。`offset` 預設為 0；無效或非正數的值會使用 0。依回傳的 `limit` 遞增，直到 `offset + data.length >= total`。已停用的 Secret 仍會保留在清單中。

### 取得 Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### 輪替 Secret {#rotate-a-secret}

將 `SECRET_ROW_VERSION` 設為「取得 Secret」回傳的最新 `row_version`。

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

輪替會替換權杖，並保留相同的 Secret 與 `server_url`。`token` 與正整數 `row_version` 為必填，Secret 必須為 `active`，且 `row_version` 必須與最新值相符。回傳 `201 Created`。新的 Session 會使用新權杖；已啟動的 Session 則繼續使用其凍結的憑證。

### 撤銷 Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

回傳 `204 No Content`，並將 `status` 設為 `disabled`。使用此 Secret 的連線將無法用於新的 Session，也無法再接收既有 Session 的後續輸入。撤銷無法復原：請建立新的 Secret 並替換連線。

### 錯誤與重試 {#errors-and-retries}

錯誤使用 [Agents 錯誤封裝格式](/api-reference/errors#agents-platform-errors)。欄位無效或寫入時缺少冪等金鑰會回傳 `400 invalid_request`；Secret 不存在或無法存取會回傳 `404 not_found`。`row_version` 過期、生命週期狀態不相容，或以不同輸入重複使用建立用的金鑰，會回傳 `409 conflict`。重試前請重新讀取 Secret，並為每次新的寫入使用新的金鑰。

## 安全性 {#security}

- 從受信任的後端建立與輪替 Secret，切勿從瀏覽器程式碼操作。
- 從您自己的密鑰儲存區或環境讀取權杖（如上方的 `$GITHUB_MCP_TOKEN`），而不是直接貼到指令碼中。
- 不要將權杖放入指示、Session 輸入、中繼資料或 Skill 套件中。
- 權杖一旦可能外洩，請立即撤銷 Secret，再建立新的 Secret 並替換連線。

## 後續步驟 {#next-steps}

- [Skills 與 MCP 工具](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
