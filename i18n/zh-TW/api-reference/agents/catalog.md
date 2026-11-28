---
i18nSource: 1b5099685e9df6ce
title: Agent 目錄
description: 瀏覽公開 Agent，並將其複製到您的組織。
---

# Agent 目錄 {#agent-catalog}

目錄列出 SandBase 發布供重複使用的 Agent。目錄項目為唯讀。複製其中一個，即可在您的組織中取得可編輯、執行與部署的私有 Agent。

| 方法 | 路徑 | 用途 |
|---|---|---|
| `GET` | `/v1/agents/catalog` | 列出公開 Agent |
| `GET` | `/v1/agents/catalog/{agent_id}` | 取得單一公開 Agent，可選擇以 `?version=` 指定版本 |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | 將其複製到您的組織 |

## 列出目錄中的 Agent {#list-catalog-agents}

使用 `limit`（1-100）、`after` 與 `order` 進行游標分頁。

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

每個項目包含 `id`、`object: "agent"`、`visibility: "public"`、`version`、`name`、`description`、`model`、`created_at` 與 `updated_at`。

## 取得目錄中的 Agent {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` 為選用，且必須是正整數。詳細資料回應會額外包含唯讀的 `configuration` 物件（名稱、描述、模型、指示、執行環境設定檔、中繼資料、工具、文字、推理與 Skills）。

## 複製目錄中的 Agent {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

請求本文接受選用的 `version`（正整數，預設為目前的公開版本）與 `name`（最多 128 個字元）。回應為 `201 Created`，內含完整的 [Agent 物件](./create)，並在您的組織中具有新的 `agt_` ID。`Idempotency-Key` 為選用；請傳送固定的金鑰，以免重試時建立第二份副本。

複製完成後，請[建立 Session](/api-reference/sessions/create) 進行測試。
