---
i18nSource: c063864501452a7b
title: SandBase 文件
description: 直接使用 Models 與 APIs 進行開發，或定義可重複使用、在託管基礎架構上執行的 Agent。
---

# SandBase 文件 {#sandbase-docs}

直接使用 Models 與 APIs 進行開發，或定義可重複使用、在託管基礎架構上執行的 Agent。

SandBase 提供兩種互補的方式來建構 AI 應用程式。請從最符合需求的最小範圍開始；隨著應用程式成長，您可以將兩者結合使用。

## 選擇建構方式 {#choose-how-to-build}

| | Models 與 APIs | 託管 Agent |
|---|---|---|
| **是什麼** | 直接存取語言、圖片、影片、音訊與第三方 API | 由 SandBase 執行、可重複使用且具版本控管的 Agent 設定 |
| **適用情境** | 自訂應用程式迴圈與精細的請求控制 | 多步驟、非同步或需重複執行的工作 |
| **您需要管理** | 提示詞、協調流程、重試與應用程式狀態 | Agent 定義、啟用的功能、輸入與交付行為 |
| **從這裡開始** | [Models 與 APIs](https://www.sandbase.ai/models) | [建構 Agent](/agents/) |

::: tip 一個 SandBase API 金鑰
同一個 API 金鑰即可呼叫 Models、APIs 與 Agents。請將金鑰保存在伺服器端，切勿在瀏覽器程式碼中公開。
:::

## 核心概念 {#core-concepts}

### Models 與 APIs {#models-and-apis}

語言、圖片、影片與音訊工作負載請使用 Models。當應用程式需要外部資料或操作時，請使用 APIs。SandBase 網站上的目錄會列出可用功能、價格、輸入 schema 與可執行的範例。

- [瀏覽 Models](https://www.sandbase.ai/models)
- [瀏覽 APIs](https://www.sandbase.ai/apis)
- [發出您的第一個 API 呼叫](/getting-started/first-call)
- [開啟 API 參考文件](/api-reference/)

### Agents {#agents}

Agent 是可重複使用且具版本控管的設定，包含模型、指示、Skills 與 MCP 連線。只需定義一次，即可在 Session 中執行。

- [了解 Agents](/agents/)
- [定義 Agent](/agents/agent-api)
- [新增 Skills 與 MCP 工具](/agents/mcp-tools)

### Sessions {#sessions}
Session 會執行一個 Agent 版本。使用 `POST /v1/agents/sessions` 建立 Session、傳送輸入、串流事件，之後再讀取完整的對話內容。

- [Sessions 指南](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## 第一步 {#first-steps}

1. 建立組織與 [API 金鑰](/getting-started/api-keys)。
2. 從[目錄](https://www.sandbase.ai/models)中選擇模型、API 或 Agent。
3. 直接發出請求，或定義並測試 Agent。
4. 從您的應用程式在 Session 中執行測試過的 Agent。
5. 在 Console 中檢視 Session、錯誤、延遲與費用。

## 營運指引 {#operational-guidance}

- [串流回應](/guides/streaming)
- [錯誤處理與重試](/guides/error-handling)
- [速率限制](/guides/rate-limiting)
- [帳務與價格](/guides/billing)
- [工作區管理](/admin/)

## 後續步驟 {#next-steps}

- 使用本機 Skills 進行創作：[Skill 教學](/guides/skills/)

- 初次使用 SandBase：[入門指南](/getting-started/)
- 呼叫模型或 API：[Models 目錄](https://www.sandbase.ai/models)與 [APIs 目錄](https://www.sandbase.ai/apis)
- 推論與 Agent API：[API 參考文件](/api-reference/)
- 建構可重複使用的工作：[建構 Agent](/agents/)
- 連接 AI 工具：[Setup](/setup/)
