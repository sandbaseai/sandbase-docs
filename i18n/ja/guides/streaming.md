---
i18nSource: 335b45fb98c53890
title: ストリーミングレスポンス
description: OpenAI または Anthropic 互換の SDK で SandBase モデルの出力をストリーミングし、途中結果を安全に処理します。
---

# ストリーミングレスポンス {#streaming-responses}

ストリーミングでは、モデルの出力が生成され次第返されます。SandBase は、呼び出した互換 API のイベント形式を保持します。OpenAI Chat Completions は data のみの Server-Sent Events（SSE）を使い、Anthropic Messages は名前付きの SSE イベントを使います。

可能な限り、公式の互換 SDK を使ってください。SDK は、イベントの区切り、ツール呼び出しの引数の逐次受信、プロトコルの終了を、生のレスポンステキストを自分で分割するよりも安全に処理します。

## OpenAI Chat Completions {#openai-chat-completions}

`POST /v1/chat/completions` で `stream: true` を設定します。

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

OpenAI 互換のチャンクでは、逐次生成されたテキストが `choices[0].delta.content` に入ります。選択したモデルがツール呼び出しをサポートしている場合、その引数は `delta.tool_calls` に文字列の断片として届きます。選択肢とツール呼び出しのインデックスごとに断片を連結し、完成した JSON をパースしてください。ストリームは通常 `data: [DONE]` で終了します。

すべてのプロバイダーがストリームでトークン使用量を返すとは想定しないでください。選択したモデルが OpenAI の `stream_options.include_usage` をサポートしている場合は、終盤に使用量が含まれることがあります。そうでない場合は、非ストリーミングのレスポンスか、該当するタスクコストのフローを使ってください。

## Anthropic Messages {#anthropic-messages}

`POST /v1/messages` で Anthropic SDK を使います。SDK のストリームヘルパーが、名前付きイベントとコンテンツブロックを組み立てます。

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

生の Anthropic ストリームでは、`message_start`、`content_block_start`、`content_block_delta`、`content_block_stop`、`message_delta`、`message_stop` などのイベント名が使われます。テキストは `text_delta` ブロックで送られます。ツールの入力は逐次的な JSON ブロックで送られるため、組み立ててからパースする必要があります。

## 中断とキャンセルの処理 {#handle-interruption-and-cancellation}

ストリーミングの開始前に返される HTTP エラーは、エンドポイントの通常のエラーボディを使います。レスポンスの開始後にネットワーク障害が起きると、最終イベントのないまま途中のテキストだけが残ることがあります。出力が完了したとみなすのは、プロトコルの通常の終了シグナルを受け取った後だけにしてください。

- 途中の出力は、確定したアプリケーションの状態とは分けて保持します。
- 接続と無通信のタイムアウトは、ワークロードに応じて独自のクライアントやプロキシで上限を設定します。
- ユーザーが生成を停止した場合は、SDK のキャンセル機能か、JavaScript の `AbortController` を使います。
- リトライしたストリームを途中の出力に自動的に追加しないでください。リトライは新しい生成です。
- 管理しているリバースプロキシで SSE をバッファリングしないようにします。

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

生の SSE を読み取る場合は、空行で区切られた完全なイベントフレームをパースします。ネットワークのチャンクは SSE イベントと 1 対 1 に対応しておらず、UTF-8 の文字がチャンクをまたぐこともあります。ストリーミング対応のテキストデコーダーを使い、不完全なフレームは続きのバイトが届くまで保持してください。

## 関連ガイド {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [エラー処理](/guides/error-handling)
- [レート制限](/guides/rate-limiting)
