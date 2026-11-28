---
i18nSource: 0ca53876f04eb96d
title: 最初の API 呼び出し
description: SandBase API を初めて呼び出す手順を詳しく説明し、リクエストの構成、レスポンスの構造、ストリーミングを解説します。
---

# 最初の API 呼び出し {#first-api-call}

このガイドでは、SandBase API のリクエストとレスポンスの構成を詳しく説明します。最後まで読むと、リクエストボディの各フィールド、レスポンスの読み方、ストリーミングの使い方を理解できます。

## 始める前に {#before-you-start}

有効な SandBase の組織、[API キー](/getting-started/api-keys)、[Models カタログ](https://www.sandbase.ai/models)のモデル ID が必要です。サンプルコードにシークレットを書き込まずに済むよう、キーを環境変数にエクスポートします。

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

まずはストリーミングなしのリクエストから始めます。認証とレスポンスの処理が動作したら、ストリーミングと本番向けのリトライ処理を追加してください。

## リクエストの構成 {#request-anatomy}

この手順では、OpenAI 互換の Chat Completions ルートを使います。

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### 必須ヘッダー {#required-headers}

| ヘッダー | 値 | 説明 |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | SandBase API キー |
| `Content-Type` | `application/json` | リクエストボディの形式 |

### リクエストボディ {#request-body}

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

### ボディのパラメーター {#body-parameters}

| パラメーター | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `model` | string | はい | `GET /v1/models` が返す有効なモデル ID（例: `deepseek/deepseek-v4-flash`） |
| `messages` | array | はい | メッセージオブジェクトの配列で表した会話履歴 |
| `temperature` | number | いいえ | サンプリング温度（0～2）。サポート状況とデフォルト値はモデルによって異なります。 |
| `max_tokens` | integer | いいえ | レスポンスで生成するトークンの最大数 |
| `top_p` | number | いいえ | Nucleus サンプリングのパラメーター（0～1） |
| `stream` | boolean | いいえ | レスポンスをストリーミングするかどうか。デフォルト: `false` |
| `stop` | string または array | いいえ | 停止シーケンス。これらが出現すると生成が停止します |
| `frequency_penalty` | number | いいえ | サポートされている場合の、プロバイダー互換の繰り返しペナルティ |
| `presence_penalty` | number | いいえ | サポートされている場合の、プロバイダー互換の presence ペナルティ |

### メッセージのロール {#message-roles}

| ロール | 用途 |
|------|---------|
| `system` | アシスタントの振る舞いや個性を設定します |
| `user` | 人間からの入力 |
| `assistant` | 以前のアシスタントの応答（マルチターンの会話用） |
| `developer`, `tool` | 選択したモデルとルートがサポートしている場合に使える、追加の OpenAI 互換ロール |

## リクエストの完全な例 {#full-request-example}

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

## レスポンスの構造 {#response-structure}

### 一般的な非ストリーミングのレスポンス {#typical-non-streaming-response}

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

### レスポンスフィールドの説明 {#response-fields-explained}

| フィールド | 説明 |
|-------|-------------|
| `id` | この completion の一意な識別子 |
| `object` | OpenAI 互換のレスポンスオブジェクト。このルートでは通常 `"chat.completion"` |
| `created` | レスポンスが生成された時刻の Unix タイムスタンプ |
| `model` | レスポンスを生成したモデル |
| `choices` | completion の選択肢の配列（通常は 1 つ） |
| `choices[].index` | 配列内でのこの選択肢のインデックス |
| `choices[].message.role` | 生成されたメッセージのロール。通常は `"assistant"` |
| `choices[].message.content` | 生成されたテキスト |
| `choices[].finish_reason` | 生成が停止した理由（下記参照） |
| `usage.prompt_tokens` | 入力のトークン数 |
| `usage.completion_tokens` | 生成された出力のトークン数 |
| `usage.total_tokens` | prompt と completion のトークン数の合計 |

### 終了理由 {#finish-reasons}

終了理由はプロバイダーによって異なります。OpenAI 互換の一般的な値は次のとおりです。

| 値 | 一般的な意味 |
|-------|---------|
| `stop` | レスポンスが自然に終了したか、停止シーケンスに達した |
| `length` | `max_tokens` の上限に達し、レスポンスが途中で切れた |

未知の値はレスポンスを拒否せず、有効なプロバイダーの出力として扱ってください。

## ストリーミングレスポンス {#streaming-responses}

チャットボットが入力していくようなリアルタイムの出力には、ストリーミングを使います。レスポンスは Server-Sent Events（SSE）として届きます。

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

### ストリーミングの SSE 形式 {#streaming-sse-format}

互換性のあるストリームでは、一般的に次のような Server-Sent Events が送信されます。

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

ポイント:

- チャンクを順番に処理し、`delta.content` の断片を連結します
- メタデータのみのチャンク、空の delta、認識できないプロバイダー互換のフィールドを許容します
- ストリームが閉じるか、終了マーカーが届いたら停止します。Chat Completions では一般的に `data: [DONE]` が使われます
- すべてのモデルが、最初と最後のチャンクをまったく同じ形で送信するとは想定しないでください

## Anthropic SDK を使う {#using-the-anthropic-sdk}

SandBase は Anthropic 互換のエンドポイントも `POST /v1/messages` で提供しています。`base_url` を変更すれば Anthropic SDK を使えます。

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

### Anthropic のレスポンス構造 {#anthropic-response-structure}

Anthropic 互換のエンドポイントは Anthropic 形式のレスポンスを返します。一般的なテキストのレスポンスは次のようになります。

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

| フィールド | 説明 |
|-------|-------------|
| `id` | メッセージ ID（`msg_` プレフィックス付き） |
| `type` | メッセージオブジェクトのタイプ。通常は `"message"` |
| `role` | 生成されたメッセージのロール。通常は `"assistant"` |
| `content` | 型付きコンテンツブロックの配列。すべてのブロックがテキストだとは想定しないでください |
| `model` | レスポンスを生成したモデル |
| `stop_reason` | `"end_turn"`（自然な停止）、`"max_tokens"`（上限に到達）、または `"stop_sequence"` |
| `usage.input_tokens` | 入力のトークン数 |
| `usage.output_tokens` | 生成された出力のトークン数 |

### Anthropic のストリーミング {#anthropic-streaming}

Anthropic SDK でのストリーミングも同じように動作します。`stream=True` を渡すだけです。

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

## モデルの選び方 {#choosing-a-model}

モデルを選ぶときは、最新のモデルカードで提供状況、料金、コンテキスト長、対応する入力、機能を確認してください。これらの値は個別に変わるため、コピーしたモデル比較に頼らないでください。

- 最新の [Models カタログ](https://www.sandbase.ai/models)を参照します。
- モデル固有のリクエストフィールドは、カタログ内の各モデルのページで確認します。
- 連携でプログラムから最新のモデルメタデータが必要な場合は、`GET /v1/models` を呼び出します。

同じ互換インターフェースを共有するモデル間で切り替える場合、通常はまず `model` パラメーターを変更します。任意のフィールド、ツール、メディア入力、構造化出力の設定を引き継ぐ前に、選択したモデルの機能とスキーマを改めて確認してください。

## 次のステップ {#next-steps}

本番環境に移行する前に、リクエストのタイムアウトを設定し、一時的なエラーのみを上限付きの指数バックオフでリトライし、利用可能な場合はリクエスト ID をログに記録し、プロンプトや API キーをログに残さずに利用状況を監視してください。

- [**API リファレンス**](/api-reference/): 推論エンドポイントと Platform API の仕様
- [**ストリーミングガイド**](/guides/streaming): 高度なストリーミングのパターンとエラー処理
- [**Models**](https://www.sandbase.ai/models): モデルの検索、機能、最新の料金
- [**エラー**](/guides/error-handling): エラーとリトライの処理
