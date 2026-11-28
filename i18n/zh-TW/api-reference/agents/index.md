---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: 建立、版本控制、封存與複製已儲存的 Agent 設定。
---

# Agents API {#agents-api}

Agent 是已儲存且具版本控制的設定，包含模型、指示、執行環境設定檔、Skills、MCP 連線與輸出設定。建立或更新 Agent 並不會執行它。請在 [Session](/api-reference/sessions/) 中執行。

Agents API 遵循 OpenAI Agents 協定（OpenAI Python SDK 中的 `client.beta.agents`）。`OpenAI-Beta` 標頭為選用；若有傳送，其值必須是 `agents=v1`。SandBase 另外提供版本、比較並設定（compare-and-set）更新、封存與還原，以及公開目錄。

## Agent 操作 {#agent-operations}

| 方法 | 路徑 | 用途 |
|---|---|---|
| `POST` | `/v1/agents` | [建立 Agent](./create)，版本為 1 |
| `GET` | `/v1/agents` | [列出 Agent](./list) |
| `GET` | `/v1/agents/{agent_id}` | [取得 Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [更新 Agent](./update)（SDK 風格的部分更新） |
| `PATCH` | `/v1/agents/{agent_id}` | 依 `row_version` [以比較並設定方式取代](./replace) |
| `DELETE` | `/v1/agents/{agent_id}` | [刪除](./delete)，即封存該 Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [封存 Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [取消封存 Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | 將[較早的版本還原](./restore)為新版本 |
| `GET` | `/v1/agents/{agent_id}/versions` | [列出版本](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [取得單一版本](./get-version) |
| `GET` | `/v1/agents/catalog` | [瀏覽公開目錄](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | 將[目錄中的 Agent 複製](./catalog#clone-a-catalog-agent)到您的組織 |

Agent ID 使用 `agt_` 前綴。請求本文為嚴格 JSON，上限 1 MiB；未知欄位會傳回 400。

## 版本與更新 {#versions-and-updates}

- 每次有效寫入（create、update、replace、restore）都會產生一個不可變的版本。`version` 是目前的版本號碼。
- `POST /v1/agents/{agent_id}` 是 OpenAI SDK 的更新方式。它不需要 `row_version`，因此以最後寫入者為準。
- `PATCH /v1/agents/{agent_id}` 需要您最後讀取到的 `row_version`，若其他人已先變更該 Agent，則會傳回 409。請在可能並行執行的編輯器與自動化流程中使用此方式。
- 每個 Session 都會凍結其啟動時的 Agent 版本、Skill 版本與 MCP 連線設定。

## 就緒狀態 {#readiness}

新寫入的版本在準備執行期間會回報 `projection_status`。Session 需要處於啟用狀態且 `projection_status` 為 `ready` 的 Agent，否則會傳回 409。已封存的 Agent 在新執行時同樣會傳回 409。

## 目前限制 {#current-limits}

- `tools` 接受 `function` 工具以及至多一個 `web_search` 工具。執行時目前要求 `web_search.mode` 為 `disabled`。
- Function 工具可以儲存，但要求用戶端傳回工具結果（`requires_action`）的 Run 目前尚不支援，會顯示為 `502 executor_contract_error`。
- `multi_agent` 必須省略或為 `null`。

## 分頁 {#pagination}

`GET /v1/agents` 與目錄使用游標分頁：`limit`（1-100，預設 20）、`after` 與 `order`（`asc` 或 `desc`，預設 `desc`）。回應包含 `object: "list"`、`data`、`has_more`、`first_id` 與 `last_id`；將 `last_id` 作為 `after` 傳入即可取得下一頁。

`GET /v1/agents/{agent_id}/versions` 使用位移分頁：`limit` 與 `offset`，回應中包含 `data`、`total`、`limit` 與 `offset`。

## 錯誤 {#errors}

錯誤使用 Agents 封裝格式 `{"error":{"type","code","param":null,"message"}}`。錯誤代碼清單請參閱[錯誤](/api-reference/errors#agents-platform-errors)。
