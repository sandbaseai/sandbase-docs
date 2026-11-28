---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: 在 SandBase 中使用與 OpenAI 相容的 chat completions、串流、工具、多模態輸入與結構化輸出。
---

# Chat Completions {#chat-completions}

SandBase 在 `POST /v1/chat/completions` 提供與 OpenAI 相容的 Chat Completions 端點。現有的 OpenAI SDK 應用程式只要變更 API 金鑰與基礎 URL，即可使用 SandBase。

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## 訊息與多模態內容 {#messages-and-multimodal-content}

依對話順序傳送訊息，並使用所選供應商支援的角色，常見的有 `system`、`developer`、`user`、`assistant` 與 `tool`。文字可以是字串。支援視覺的模型也接受 `text` 與 `image_url` 等內容部分。

## 串流 {#streaming}

設定 `stream: true` 即可接收 Server-Sent Events。依序讀取每個 `data:` 事件，並串接 `choices[0].delta.content`。串流以 `data: [DONE]` 結束。若所選供應商會提供串流用量，請加上 `stream_options: {"include_usage": true}`；否則可能不會有用量資訊。

## 工具 {#tools}

在 `tools` 中定義可呼叫的函式。當助理回傳 `tool_calls` 時，請在您的應用程式中執行每個函式，再附加一則包含對應 `tool_call_id` 的 `tool` 訊息，然後繼續對話。

## 結構化輸出 {#structured-output}

使用 `response_format` 要求 JSON 物件或 JSON Schema 格式的回應。支援情況依模型而異，因此在依賴嚴格的結構描述驗證前，請先確認所選模型的功能。

## 供應商專屬參數 {#provider-specific-parameters}

SandBase 使用 `model` 與 `stream` 進行路由。當所選供應商使用相同協定時，其他 OpenAI 相容的請求欄位會被保留。當 SandBase 在不同協定間轉換時，請使用文件記載的欄位或 `extra_body`；支援情況依供應商而異。

## 錯誤與重試 {#errors-and-retries}

只有在重新生成是安全的情況下，才對可重試的 `429` 與暫時性伺服器回應使用有上限的退避重試。不要自動重試格式錯誤的請求、驗證失敗，或工具副作用可能已發生的請求。請參閱[錯誤與重試](/guides/error-handling)。完整的欄位與回應結構描述請參閱 [Chat Completions API](/api-reference/llm-gateway)。
