---
i18nSource: 071e97a48f9c4f4c
title: API 參考
description: 呼叫 SandBase 模型，並管理 Agents、Sessions、Skills、MCP 連線、Secrets 與帳戶資源。
---

# API 參考 {#api-reference}

您可以使用 API 直接呼叫模型，或定義可重複使用的 Agent、在 Session 中執行，並將其連接到 Skills 與 MCP 工具。

::: tip 在找模型推論嗎？
推論規範（Chat Completions、Responses、Anthropic Messages、Gemini、Images 與 Seedance 影片）位於本參考文件的 **Model inference** 章節。各模型專屬的欄位與定價，請參閱 [Models 目錄](https://www.sandbase.ai/models)中該模型的頁面。
:::

## 選擇起點 {#choose-a-starting-point}

| 目標 | 從這裡開始 | 接下來會發生什麼 |
|---|---|---|
| 定義可重複使用的行為 | [Agents](/api-reference/agents/) | 建立 Agent 設定並進行版本控制 |
| 直接執行 Agent | [Sessions](/api-reference/sessions/) | 傳送輸入、串流事件並讀取歷史記錄 |
| 重複使用指示套件 | [Skills](/api-reference/skills/) | 上傳具版本的 ZIP 套件並附加到 Agent |
| 呼叫外部工具 | [MCP 連線](/api-reference/mcp-connections/) | 為 Agent 註冊遠端 HTTPS MCP 伺服器 |
| 驗證外部工具 | [Secrets](/agents/api-credentials#with-the-api) | 為 MCP 連線儲存唯寫的 Bearer 權杖 |

## 資源生命週期 {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent**（`agt_`）是已儲存且具版本控制的設定；建立 Agent 並不會執行它。
- **Session**（`ses_`）會執行某個 Agent 版本，並凍結其 Skills 與 MCP 連線。Session 路徑位於 `/v1/agents/sessions` 之下。
- **Skill**（`skl_`）是具版本的指示套件。**MCP 連線**（`mcp_`）用於註冊遠端工具伺服器，**Secret**（`sec_`）則儲存其 Bearer 權杖。

## Agents 平台資源的慣例 {#conventions-for-agents-platform-resources}

Agents、Sessions、Skills、MCP 連線與 Secrets 皆由 `https://api.sandbase.ai/v1` 提供，並遵循以下規則：

- 使用 `Authorization: Bearer` 或 `X-API-Key` 進行驗證。請參閱[驗證](/api-reference/authentication#agents-platform-resources)。
- 請求本文為嚴格 JSON，上限 1 MiB；未知欄位會傳回 400。
- 建立 MCP 連線或 Secret 的寫入操作需要 `Idempotency-Key`。其他寫入操作可選擇傳送。
- 樂觀並行控制使用 `row_version`：傳送您最後讀取到的值，遇到 409 時請重新讀取。
- Agents、Sessions、項目、回合與 Skills 使用游標分頁（`limit`、`after`、`order`；回應包含 `has_more` 與 `last_id`）。Agent 版本、附件、MCP 連線與 Secrets 使用位移分頁（`limit`、`offset`；回應包含 `total`）。
- 錯誤使用 `{"error": {"type", "code", "param", "message"}}`。請參閱 [Agents 平台錯誤](/api-reference/errors#agents-platform-errors)。

## 驗證 {#authentication}

以 Bearer 權杖傳送 SandBase API 金鑰：

```http
Authorization: Bearer sk-YOUR_KEY
```

請將金鑰視為不透明的機密，僅保存在伺服器端，切勿放入瀏覽器程式碼或日誌中。相容性細節請參閱[驗證](/api-reference/authentication)，公開錯誤封裝格式請參閱[錯誤](/api-reference/errors)。

## 組織與用量 {#organization-and-usage}

平台資源屬於與 API 金鑰關聯的組織。使用 [Account API](/api-reference/account/) 查看支援的餘額與近期執行歷史檢視。除非此處記載了公開端點，否則組織管理與帳單管理仍需透過 Console 操作。

## 參考格式 {#reference-formats}

- 從側邊欄瀏覽各項操作，查看範例與回應細節。
- 下載機器可讀的 [OpenAPI 規格](/openapi.yaml)。
- 在 [Models 目錄](https://www.sandbase.ai/models)中開啟模型頁面，或在 [APIs 目錄](https://www.sandbase.ai/apis)中開啟 API 頁面，即可查看確切的請求欄位。

## 後續步驟 {#next-steps}

- 初次使用代管 Agent：[建構 Agent](/agents/)
- 直接呼叫模型：[Chat Completions](/api-reference/llm-gateway) 或 [Models 目錄](https://www.sandbase.ai/models)
