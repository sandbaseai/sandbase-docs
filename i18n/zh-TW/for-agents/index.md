---
i18nSource: 0314b37a870481ae
title: AI 可讀文件
description: AI agent 探索與使用 SandBase API 所需的一切 — 單頁摘要。
---

# AI 友善的 API 概覽 {#ai-friendly-api-overview}

::: info Session 合約
Session（`ses_*`）會執行一個已儲存的 Agent 版本；請直接使用 `POST /v1/agents/sessions` 建立。執行環境實例屬於內部資源，永遠不會被回傳。
:::

> 一份同時適合人類與 AI agent 的精簡參考。針對 LLM 讀取最佳化的純文字版本，請參閱 [`llms.txt`](https://www.sandbase.ai/docs/llms.txt)。

## 什麼是 SandBase？ {#what-is-sandbase}

SandBase 是一個 AI agent 基礎架構平台。一把 API 金鑰即可存取已啟用的各類模型與 API，涵蓋語言、圖片、影片、音訊、搜尋與資料，另外還有 Agent 工作流程。請查詢目前的目錄，不要依賴固定的數量。

## API 基礎 URL {#api-base-url}

```
https://api.sandbase.ai/v1
```

## 驗證 {#authentication}

所有請求都需要 Bearer 權杖：

```
Authorization: Bearer sk-YOUR_KEY
```

請在 [Developer → API Keys](https://www.sandbase.ai/console/keys) 取得您的金鑰。

## 快速範例 {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## 核心 API {#core-apis}

| 方法 | 路由 | 說明 |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI 相容的聊天；可選能力取決於所選模型 |
| `POST` | `/v1/messages` | Anthropic 相容的 messages API |
| `POST` | `/v1/run` | 使用模型專屬的 schema 提交模型生成 |
| `GET` | `/v1/run/{id}` | 輪詢非同步生成狀態並取得結果 |
| `GET` | `/v1/models` | 列出已啟用的邏輯模型；預設為 LLM 類型 |
| `GET` | `/v1/models/{id_or_name}` | 取得模型詳細資料、schema、能力與價格 |
| `GET` | `/v1/tasks/{task_id}/cost` | 取得任務費用與用量 |

## 其他 API 群組 {#additional-api-groups}

除了核心生成 API 之外，SandBase 也提供 agent 生命週期管理的 API。常見工作流程請參閱 [AI API 指南](./full)，完整合約請參閱 [OpenAPI 規格](https://www.sandbase.ai/docs/openapi.yaml)。

| 群組 | 主要路由 | 用途 |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`、`GET /v1/agents`、`POST /v1/agents/{agent_id}` | 建立已儲存的 Agent 定義並進行版本控管 |
| **Sessions** | `POST /v1/agents/sessions`、`POST /v1/agents/sessions/{session_id}/events`、`GET /v1/agents/sessions/{session_id}/events` | 執行 Agent、傳送輸入並串流即時事件 |
| **Skills** | `POST /v1/skills`、`GET /v1/skills` | 供 Agent 掛載、具版本控管的指示套件 |
| **MCP 連線與 Secrets** | `POST /v1/mcp-connections`、`POST /v1/secrets` | 遠端 HTTPS MCP 工具及其僅寫入的 Bearer 權杖 |

Agents 平台資源接受 `Authorization: Bearer` 或 `X-API-Key`，失敗時回傳 `{"error":{"type","code","param","message"}}`。

## 計價模式 {#pricing-model}

依用量付費。價格依模型而定，且可能獨立於本頁變動：

- **模型價格**：從所選模型的 `model_card` 讀取目前的公式與單位
- **Token 價格**：若該模型有宣告，可能包含輸入、輸出、快取或推理等部分
- **媒體與其他操作**：可能以每次請求、時長、解析度或其他模型專屬單位計價
- **資料 API**（搜尋、社群、爬取、電商、金融）：每個組織每個 UTC 日有 100 次免費呼叫，由符合資格的資料 API 共用；超過後依呼叫次數計費，不會被封鎖。在 MCP 中，符合資格的工具會在 `sandbase_inspect` 中顯示 `pricing.free_quota`，而 `sandbase_account` 會回傳 `free_api_quota`（`daily_limit`、`used_today`、`remaining`、`resets_at`）。請參閱 [每日免費 API 呼叫](/guides/billing#daily-free-api-calls)。

請先以 `GET /v1/models` 查詢目前的模型 ID，再於傳送請求前檢視 `GET /v1/models/{id_or_name}`。不要假設各供應商之間的價格或快取折扣相同。

當操作回傳任務 ID 時，請檢視其記錄的費用：

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## 速率限制 {#rate-limits}

目前沒有公開的通用數值預設。請求可能受到指派給您組織的選用每分鐘請求數限制，
此限制由組織內所有 API 金鑰共用。`429` 回應不含配額或 `Retry-After` 標頭；請使用有上限且
加入抖動（jitter）的指數退避。請參閱 [錯誤指南](./errors)。

---

## 延伸閱讀 {#further-reading}

- [AI API 指南](./full) — 核心工作流程、請求／回應格式與 curl 範例
- [模型與價格](./models) — 即時模型查詢、價格與能力指引
- [錯誤指南](./errors) — 已記載的回應格式、HTTP 處理與重試安全性
- [OpenAPI 規格](https://www.sandbase.ai/docs/openapi.yaml) — 機器可讀的 OpenAPI 3.1

## 純文字版本（供 AI agent 使用） {#plain-text-versions-for-ai-agents}

| 檔案 | URL | 內容 |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | 精簡摘要（約 60 行） |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | 擴充版的 AI 導向 API 指南 |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | 機器可讀的 OpenAPI 3.1 規格 |
