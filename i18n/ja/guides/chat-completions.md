---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: SandBase で、OpenAI 互換の Chat Completions、ストリーミング、ツール、マルチモーダル入力、構造化出力を使います。
---

# Chat Completions {#chat-completions}

SandBase は、OpenAI 互換の Chat Completions エンドポイントを `POST /v1/chat/completions` で提供しています。既存の OpenAI SDK アプリケーションは、API キーとベース URL を変更するだけで SandBase を使えます。

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## メッセージとマルチモーダルコンテンツ {#messages-and-multimodal-content}

メッセージは、選択したプロバイダーがサポートするロール（一般的には `system`、`developer`、`user`、`assistant`、`tool`）を使って、会話の順序どおりに送信します。テキストは文字列で指定できます。画像認識に対応したモデルでは、`text` や `image_url` などのコンテンツパートも使えます。

## ストリーミング {#streaming}

Server-Sent Events を受け取るには `stream: true` を設定します。各 `data:` イベントを順番に読み取り、`choices[0].delta.content` を連結してください。ストリームは `data: [DONE]` で終了します。選択したプロバイダーがストリーミング時の使用量を提供する場合は、`stream_options: {"include_usage": true}` を追加します。提供しない場合、使用量は含まれないことがあります。

## ツール {#tools}

呼び出し可能な関数を `tools` で定義します。アシスタントが `tool_calls` を返したら、アプリケーションで各関数を実行し、対応する `tool_call_id` を含む `tool` メッセージを追加してから会話を続けます。

## 構造化出力 {#structured-output}

JSON オブジェクトまたは JSON Schema 形式のレスポンスを要求するには、`response_format` を使います。サポート状況はモデルによって異なるため、厳密なスキーマの適用に頼る前に、選択したモデルの機能を確認してください。

## プロバイダー固有のパラメーター {#provider-specific-parameters}

SandBase はルーティングに `model` と `stream` を使います。その他の OpenAI 互換のリクエストフィールドは、選択したプロバイダーが同じプロトコルを使う場合に保持されます。SandBase がプロトコル間で変換する場合は、ドキュメントに記載されたフィールドか `extra_body` を使ってください。サポート状況はプロバイダーによって異なります。

## エラーとリトライ {#errors-and-retries}

リトライ可能な `429` や一時的なサーバーレスポンスには、再生成しても問題がない場合に限り、上限付きのバックオフを使います。不正なリクエスト、認証エラー、ツールの副作用がすでに発生した可能性のあるリクエストは、自動的にリトライしないでください。[エラーとリトライ](/guides/error-handling)を参照してください。フィールドとレスポンスの完全なスキーマについては、[Chat Completions API](/api-reference/llm-gateway) を参照してください。
