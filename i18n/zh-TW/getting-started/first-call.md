---
i18nSource: 0ca53876f04eb96d
title: 第一次 API 呼叫
description: 詳細說明如何進行第一次 SandBase API 呼叫，並了解請求結構、回應結構與串流。
---

# 第一次 API 呼叫 {#first-api-call}

本指南詳細說明 SandBase API 請求與回應的結構。讀完後，您將了解請求本文中的每個欄位、如何解讀回應，以及如何使用串流。

## 開始之前 {#before-you-start}

您需要一個有效的 SandBase 組織、一把 [API 金鑰](/getting-started/api-keys)，以及來自[模型目錄](https://www.sandbase.ai/models)的模型 ID。請先匯出金鑰，避免範例將機密資訊寫進原始碼：

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

先從非串流請求開始。確認驗證與回應處理都正常後，再加入串流與正式環境的重試機制。

## 請求結構 {#request-anatomy}

本範例使用與 OpenAI 相容的 Chat Completions 路由：

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### 必要標頭 {#required-headers}

| 標頭 | 值 | 說明 |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | 您的 SandBase API 金鑰 |
| `Content-Type` | `application/json` | 請求本文格式 |

### 請求本文 {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### 本文參數 {#body-parameters}

| 參數 | 型別 | 必填 | 說明 |
|-----------|------|----------|-------------|
| `model` | string | 是 | `GET /v1/models` 回傳的已啟用模型 ID（例如 `deepseek/deepseek-v4-flash`） |
| `messages` | array | 是 | 以訊息物件陣列表示的對話歷史 |
| `temperature` | number | 否 | 取樣溫度（0–2）。支援情況與預設值依模型而異。 |
| `max_tokens` | integer | 否 | 回應中可生成的最大 token 數 |
| `top_p` | number | 否 | 核取樣參數（0–1） |
| `stream` | boolean | 否 | 是否以串流方式回傳回應。預設值：`false` |
| `stop` | string or array | 否 | 停止序列：遇到這些序列時停止生成 |
| `frequency_penalty` | number | 否 | 供應商支援時使用的相容重複懲罰 |
| `presence_penalty` | number | 否 | 供應商支援時使用的相容存在懲罰 |

### 訊息角色 {#message-roles}

| 角色 | 用途 |
|------|---------|
| `system` | 設定助理的行為與個性 |
| `user` | 使用者的輸入 |
| `assistant` | 先前的助理回應（用於多輪對話） |
| `developer`、`tool` | 所選模型與路由支援時可用的其他 OpenAI 相容角色 |

## 完整請求範例 {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## 回應結構 {#response-structure}

### 典型的非串流回應 {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### 回應欄位說明 {#response-fields-explained}

| 欄位 | 說明 |
|-------|-------------|
| `id` | 此次 completion 的唯一識別碼 |
| `object` | OpenAI 相容的回應物件，在此路由上通常為 `"chat.completion"` |
| `created` | 產生回應時的 Unix 時間戳記 |
| `model` | 產生回應的模型 |
| `choices` | completion 選項陣列（通常只有一個） |
| `choices[].index` | 此選項在陣列中的索引 |
| `choices[].message.role` | 生成訊息的角色，通常為 `"assistant"` |
| `choices[].message.content` | 生成的文字 |
| `choices[].finish_reason` | 停止生成的原因（見下文） |
| `usage.prompt_tokens` | 輸入的 token 數 |
| `usage.completion_tokens` | 生成輸出的 token 數 |
| `usage.total_tokens` | prompt 與 completion token 的總和 |

### 結束原因 {#finish-reasons}

結束原因依供應商而定。常見的 OpenAI 相容值包括：

| 值 | 一般意義 |
|-------|---------|
| `stop` | 回應自然結束或遇到停止序列 |
| `length` | 達到 `max_tokens` 上限，回應遭截斷 |

遇到未知值時，請視為有效的供應商輸出，不要拒絕該回應。

## 串流回應 {#streaming-responses}

若需要即時輸出（例如聊天機器人逐字顯示），請使用串流。回應會以 Server-Sent Events（SSE）傳回：

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### 串流 SSE 格式 {#streaming-sse-format}

相容的串流通常會發出類似以下的 Server-Sent Events：

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

重點：

- 依序處理區塊，並附加所有 `delta.content` 片段
- 容許只含中繼資料的區塊、空的 delta，以及您不認得的供應商相容欄位
- 在串流關閉或收到終止標記時停止；Chat Completions 通常使用 `data: [DONE]`
- 不要假設每個模型發出的第一個或最後一個區塊格式完全相同

## 使用 Anthropic SDK {#using-the-anthropic-sdk}

SandBase 也在 `POST /v1/messages` 提供與 Anthropic 相容的端點。只要變更 `base_url` 即可使用 Anthropic SDK：

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Anthropic 回應結構 {#anthropic-response-structure}

與 Anthropic 相容的端點會回傳 Anthropic 格式的回應。典型的文字回應如下：

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| 欄位 | 說明 |
|-------|-------------|
| `id` | 訊息 ID（以 `msg_` 為前綴） |
| `type` | 訊息物件類型，通常為 `"message"` |
| `role` | 生成訊息的角色，通常為 `"assistant"` |
| `content` | 具型別的內容區塊陣列；不要假設每個區塊都是文字 |
| `model` | 產生回應的模型 |
| `stop_reason` | `"end_turn"`（自然停止）、`"max_tokens"`（達到上限）或 `"stop_sequence"` |
| `usage.input_tokens` | 輸入的 token 數 |
| `usage.output_tokens` | 生成輸出的 token 數 |

### Anthropic 串流 {#anthropic-streaming}

使用 Anthropic SDK 串流的方式相同，只要傳入 `stream=True`：

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## 選擇模型 {#choosing-a-model}

選擇模型時，請查看其即時模型卡，確認可用性、定價、上下文長度、支援的輸入與功能。這些值會各自變動，因此不要依賴複製下來的模型比較資料。

- 瀏覽目前的[模型目錄](https://www.sandbase.ai/models)。
- 在目錄中開啟模型頁面，查看該模型專屬的請求欄位。
- 整合需要以程式取得目前的模型中繼資料時，請查詢 `GET /v1/models`。

對於共用相同相容介面的模型，切換時通常只需修改 `model` 參數。沿用選用欄位、工具、媒體輸入或結構化輸出設定前，請重新確認所選模型的功能與結構描述。

## 後續步驟 {#next-steps}

上線前，請設定請求逾時，只對暫時性失敗以有上限的指數退避進行重試，在可取得時記錄請求 ID，並在不記錄提示詞或 API 金鑰的前提下監控用量。

- [**API 參考**](/api-reference/)：推論端點與 Platform API 合約
- [**串流指南**](/guides/streaming)：進階串流模式與錯誤處理
- [**模型**](https://www.sandbase.ai/models)：模型探索、功能與目前定價
- [**錯誤**](/guides/error-handling)：處理失敗與重試
