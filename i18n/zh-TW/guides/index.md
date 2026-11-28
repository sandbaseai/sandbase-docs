---
i18nSource: c922bd433deabf32
title: 指南
description: 使用 SandBase Models、APIs、Agents、Setup、帳務、串流與正式環境可靠性的實用指南。
---

# 指南 {#guides}

這些指南涵蓋在正式環境中使用 SandBase 的常見模式。

## 呼叫模型 {#call-models}
| 指南 | 說明 |
|-------|-------------|
| [Chat Completions](./chat-completions) | 透過 OpenAI 相容的聊天協定呼叫 SandBase |
| [OpenAI Responses](./openai-responses) | 透過 OpenAI 相容的 Responses 協定呼叫 GPT 模型 |
| [Anthropic Messages](./anthropic-messages) | 透過 Anthropic 相容的 messages 協定呼叫 SandBase |
| [Google Gemini](../api-reference/gemini-generate-content) | 透過 Google Gemini 相容的 GenerateContent 協定呼叫 SandBase |
| [圖片與影片](./image-video) | 透過共用的非同步 Run API 生成圖片與影片 |
| [串流](./streaming) | 將相容模型的輸出串流至您的應用程式 |
| [API 目錄](https://www.sandbase.ai/apis) | 瀏覽 API 功能及其標示供應商的端點 |

## 在正式環境中執行 {#run-in-production}
| 指南 | 說明 |
|-------|-------------|
| [錯誤與重試](./error-handling) | 分類失敗原因，並只在操作可安全重複時重試 |
| [速率限制](./rate-limiting) | 處理 429 回應並平滑突發請求 |
| [並行限制](./concurrency-limits) | 您的組織可同時執行多少個任務 |
| [價格與用量](./billing) | 了解點數、用量與費用控管 |

## 快速提示 {#quick-tips}

- 當使用者想在 Codex、Claude、Cursor 或 Kiro 中使用工具時，請使用 [Setup](/setup/)。
- 當您的應用程式需要單一功能時，請使用 [Models](https://www.sandbase.ai/models) 或 [APIs](https://www.sandbase.ai/apis)。
- 當工作包含多個步驟或需要重複使用時，請使用 [Build Agent](/agents/)。
- 使用 Console 中的 [Activities](https://www.sandbase.ai/console/activities) 一併檢視請求與用量。
