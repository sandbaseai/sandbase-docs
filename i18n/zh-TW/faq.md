---
i18nSource: a86346e2696c732c
title: 常見問題
description: 關於連結 AI 工具、SandBase 目錄、模型、API、Agent、Session 與計費的常見問題。
---

# 常見問題 {#frequently-asked-questions}

## 什麼是 SandBase？ {#what-is-sandbase}

SandBase 協助 Agent 與真實世界連結。

您可以直接使用現成的模型與 API；在 AI 工具中完成連結後，從您的 AI 工具中使用它們；或是建立可重複使用的 Agent，並在 Session 中執行。

## SandBase 適合哪些人？ {#who-is-sandbase-for}

SandBase 主要服務三類使用者：

- **AI 工具使用者**：想在 Codex、Claude、Cursor 或 Kiro 中使用實用能力
- **開發者**：想直接呼叫模型與 API
- **FDE 與團隊**：為客戶或內部工作流程建立可重複使用的 Agent

## 要在哪裡瀏覽各項能力？ {#where-do-i-browse-capabilities}
SandBase 網站列出了能力目錄：

- [模型](https://www.sandbase.ai/models) 與 [圖片和影片模型](https://www.sandbase.ai/models/image-video)
- [API](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
依能力類型不同，您可以檢視、測試、安裝、呼叫或複製它們。

## 什麼是 AI tools？ {#what-is-ai-tools}

Console 中的 **Build → AI tools** 會將 SandBase 連結到您已在使用的 AI 工具，例如 Claude Code、Codex、Cursor 或 Kiro。將 `set up https://www.sandbase.ai/SKILL.md` 貼到您的 agent 中，或執行 `npx -y @sandbaseai/cli@latest connect`。連結後的工具即可搜尋並執行 SandBase 目錄中的模型與 API，費用計入您的工作區。請參閱 [連結 AI 工具](/setup/)。

## 什麼是 Build Agent？ {#what-is-build-agent}

Build Agent 是您定義與測試 Agent 的地方。

Agent 將指示、模型、Skills 與 MCP 工具結合成一個可重複使用、具版本控管的工作流程。

## Agent 與 API 不同嗎？ {#is-an-agent-different-from-an-api}
是的。Agent 是您可以編輯與測試的版本化設定，並透過建立 Session 來執行。您在持續編輯 Agent 的同時，應用程式可以使用 [Sessions API](/api-reference/sessions/) 建立 Session。

## 什麼是 Session？ {#what-are-sessions}
Session 是一次 Agent 執行，包含其對話、工具活動與輸出。

## 如何讓 Agent 存取外部 API？ {#how-do-i-give-an-agent-access-to-external-apis}

將外部系統以 MCP 伺服器的形式連結，並加入 Agent 的 MCP 連線中。若伺服器需要 Bearer 權杖，請使用 [Secrets API](/agents/api-credentials#with-the-api) 將它儲存為綁定該伺服器 URL 的僅寫入 Secret。權杖只會傳送到該伺服器，永遠不會出現在提示詞或 Agent 執行環境中。請參閱 [MCP 工具的憑證](/agents/api-credentials)。

## 模型放在哪裡？ {#where-do-models-live}

模型是重要的建構元件，因此有自己的 [目錄](https://www.sandbase.ai/models)。

您可以直接呼叫模型、從已連結的 AI 工具中使用，或在 Agent 內使用。

## 我需要撰寫程式碼嗎？ {#do-i-need-to-write-code}

不一定。

若想在 AI 工具中使用各項能力而不撰寫程式碼，請 [連結您的 AI 工具](/setup/)。

若想從您的應用程式呼叫 SandBase，請使用 API 參考。

若需要可重複使用的多步驟工作，請使用 Build Agent。

## 如何取得 API 金鑰？ {#how-do-i-get-an-api-key}

開啟 Console，前往 **Developer → API Keys**，然後選擇 **New key**。

金鑰的使用方式如下：

```http
Authorization: Bearer sk-YOUR_KEY
```

## 如何計費？ {#how-does-billing-work}

SandBase 採用點數與依用量計費。

模型、API、Agent 與執行環境的工作可能各有不同的費用。請在 Console 查看目前的用量與價格。

## 後續步驟 {#next-steps}

- [快速入門](/getting-started/)
- [模型與 API 目錄](https://www.sandbase.ai/models)
- [連結 AI 工具](/setup/)
- [Build Agent](/agents/)
- [API 參考](/api-reference/)
