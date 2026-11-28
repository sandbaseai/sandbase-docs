---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: 透過 SandBase 使用 Anthropic 相容的訊息、內容區塊、工具、思考與串流功能。
---

# Anthropic Messages {#anthropic-messages}

SandBase 在 `POST /v1/messages` 提供 Anthropic 相容的端點。使用 Anthropic SDK 的應用程式只需變更 API 金鑰與 base URL 即可連線。

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## 驗證與版本標頭 {#authentication-and-version-headers}

使用 `x-api-key` 或 `Authorization: Bearer …`。兩者同時提供時，以 `x-api-key` 為優先。選用的 `anthropic-version` 標頭會轉送至上游，省略時預設為 `2023-06-01`。選用的 `anthropic-beta` 值也會一併轉送，但取決於供應商的相容性。

## 訊息與內容區塊 {#messages-and-content-blocks}

訊息使用 `user` 與 `assistant` 角色。請將系統指示放在頂層的 `system` 欄位。內容可以是純文字，或是由具型別的區塊組成的陣列，例如 `text`、`image`、`tool_use` 與 `tool_result`。

## 工具與延伸思考 {#tools-and-extended-thinking}

在 `tools` 中加入工具定義，並透過 `tool_choice` 控制工具選擇。若所選模型支援，可使用 `thinking` 設定延伸推理；接續對話時，請保留傳回的 thinking 區塊。

## 串流 {#streaming}

設定 `stream: true` 即可接收 Anthropic 風格的 SSE 事件，包括 `message_start`、內容區塊事件、`message_delta` 與 `message_stop`。SandBase 也會轉送 keepalive 與供應商定義的 beta 事件。為了向前相容，用戶端應忽略未知的事件類型，並處理協定層級的 `error` 事件。

## 相容性 {#compatibility}

SandBase 會將公開的模型名稱對應到所選的供應商。除非該供應商有明確的相容性規則會移除不支援的欄位或拒絕該候選供應商，否則其他相容的請求欄位與回應位元組都會保留。供應商專屬的 beta 功能不一定在每個模型上都可用。完整的請求與回應結構描述，請參閱[建立 Anthropic Message](/api-reference/anthropic-compat)。
