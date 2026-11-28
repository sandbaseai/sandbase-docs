---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: 在 SandBase Session 中定義、測試並執行可重複使用、有版本控管的 Agent。
---

# Build Agent {#build-agent}

Build Agent 是您定義與測試 Agent，並決定其執行方式的地方。

Agent 是一份已儲存且有版本控管的設定：包含 Model、指示、執行環境設定檔、Skills，以及連接外部工具的 MCP 連線。儲存 Agent 並不會執行它。

## Agent 是什麼 {#what-an-agent-is}

| 問題 | 設定位置 |
|---|---|
| 它要做什麼？ | `instructions` |
| 由哪個模型執行工作？ | `model`，來自 [Models API](/api-reference/models/) 的模型 ID |
| 它知道如何做哪些事？ | [Skills](/agents/mcp-tools#skills)，有版本控管的指示套件 |
| 它可以呼叫哪些外部工具？ | [MCP 連線](/agents/mcp-tools#mcp-connections)，伺服器需要權杖時搭配[憑證](/agents/api-credentials) |
| 它如何執行？ | 在 [Session](/agents/sessions) 中執行 |

每次有效的變更都會建立一個新的不可變版本。您隨時可以列出版本並還原到較早的版本。

## Agent 如何執行 {#how-an-agent-runs}

Agent 在 [Session](/agents/sessions) 中執行。Session 是 `ses_` 資源，您可以向它傳送輸入並串流接收事件，無論是互動式對話、測試執行，或是來自應用程式的呼叫。每個 Session 都會凍結其啟動時的 Agent 版本，因此您可以繼續編輯 Agent，而不會影響已存在的 Session。

## Agent 生命週期：草稿 → 在 Session 中測試 → 從應用程式執行 → 檢視 Session {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. 草稿 {#_1-draft}

在 Console 的 **Build → Agents** 中建立 Agent，或使用 [`POST /v1/agents`](/agents/agent-api)。從最精簡且有用的工作流程開始，只有在指示需要時才加入 Skills 與 MCP 連線。

### 2. 在 Session 中測試 {#_2-test-in-a-session}

為 Agent 建立 Session，傳送具代表性的輸入，並查看輸出、工具活動與錯誤。除了正常流程，也要測試缺少輸入、工具無法使用、結果為空，以及輸出格式要求等情況。

### 3. 從應用程式執行 {#_3-run-from-your-app}

使用 [Sessions API](/api-reference/sessions/) 從您的應用程式為已測試的 Agent 建立 Session。

### 4. 檢視 Session {#_4-inspect-sessions}

使用 Sessions API 讀取每個 Session 的項目與回合，檢視完整的對話、工具活動與錯誤。

## 正式環境檢查清單 {#production-checklist}

- `model` 使用 Models API 中目前的模型 ID。
- 當行為不得在無預警情況下改變時，將 Skills 固定在特定版本。
- MCP 連線使用 `allowed_tools`，只公開 Agent 需要的工具。
- 權杖存為 [Secret](/agents/api-credentials)，絕不寫入指示、輸入或中繼資料。
- 建立 Session 時傳送 `Idempotency-Key`，重試時沿用同一個值。
- 啟動後檢查 Session 狀態與錯誤。

## 目錄 Agent {#catalog-agents}

公開的 [Agent 目錄](/api-reference/agents/catalog)列出 SandBase 發布的 Agent。您可以讀取目錄中的 Agent，但若要修改，必須先使用 `POST /v1/agents/catalog/{agent_id}/clone` 將它複製到您的組織。複製出的是一個由您擁有、可執行的新私有 Agent。

::: tip 使用 OpenAI SDK
Agents、Sessions 與 Skills 遵循 OpenAI Agents API，因此官方 OpenAI SDK 可搭配 `base_url="https://api.sandbase.ai/v1"` 使用。經過驗證的範例與差異請參閱 [OpenAI 相容性](/agents/openai-compatibility)。
:::

## 後續步驟 {#next-steps}

- [定義 Agent](/agents/agent-api)
- [OpenAI 相容性](/agents/openai-compatibility)
- [Skills 與 MCP 工具](/agents/mcp-tools)
- [Sessions](/agents/sessions)
