---
i18nSource: 3ccdc1071b9be798
title: Models API
description: 探索 SandBase 模型的中繼資料、定價、支援狀態與功能。
---

# Models API {#models-api}

在選擇推論端點之前，請使用 Models API 探索模型。列表操作與 OpenAI 相容，會傳回精簡的識別記錄。若要取得 SandBase 的功能、結構描述與定價中繼資料，請擷取單一模型。

| 操作 | 端點 | 文件 |
|---|---|---|
| 列出模型 | `GET /v1/models` | [列出模型](./list) |
| 取得單一模型 | `GET /v1/models/{id_or_name}` | [取得模型](./get) |
| 依路徑呼叫 API 功能 | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API 直通](./api-passthrough) |
| 執行模型或 API 功能 | `POST /v1/run` | [執行功能](./run) |
| 取得非同步結果 | `GET /v1/run/{id}` | [取得執行結果](./run-get) |
| 接收非同步回呼 | `POST /v1/run` 上的 `webhook_url` | [Webhook 回呼](./run#webhook-callbacks) |
| 瀏覽支援的模型 | — | [Models 目錄](https://www.sandbase.ai/models) |

若要執行模型，請從 [Models 目錄](https://www.sandbase.ai/models)開啟其參考頁面；每個頁面都會列出確切的識別碼、請求欄位與定價。本頁說明模型探索、統一的功能執行器、API 直通、Asset 以及任務費用查詢。

`GET /v1/models` 支援 `q`、`vendor`、`type` 與 `order`，且不分頁。省略 `type` 時預設為 `llm`，而明確傳入空值 `type=` 則會列出所有公開的模型類型。`vendor` 篩選為完全比對且區分大小寫；`q` 為不區分大小寫的子字串搜尋。每個列表項目包含 `id`、`object`、`created` 與 `owned_by`，其中 `id` 是請求中使用的邏輯模型名稱。

模型名稱可能包含 `/`。呼叫詳細資料端點時，請將這些斜線當作路徑分隔符號傳入，例如 `/v1/models/openai/gpt-5.6-luna`；伺服器路由會將剩餘的路徑視為單一邏輯識別碼。請從 `GET /v1/models` 取得目前的 ID，而不要從舊版指南複製識別碼。

若推論 API 傳回非同步的 `202` 回應，請使用傳回的不透明 ID 輪詢 `GET /v1/run/{id}`。請勿推測 ID 前綴，也不要依相容性標頭自行組出其他輪詢路徑。
