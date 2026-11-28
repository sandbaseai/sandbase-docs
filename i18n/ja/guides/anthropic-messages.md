---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: SandBase で、Anthropic 互換のメッセージ、コンテンツブロック、ツール、thinking、ストリーミングを使用します。
---

# Anthropic Messages {#anthropic-messages}

SandBase は、`POST /v1/messages` で Anthropic 互換のエンドポイントを提供しています。Anthropic SDK を使用するアプリケーションは、API キーとベース URL を変更するだけで接続できます。

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## 認証とバージョンヘッダー {#authentication-and-version-headers}

`x-api-key` または `Authorization: Bearer …` を使用します。両方を指定した場合は `x-api-key` が優先されます。任意の `anthropic-version` ヘッダーは上流に転送され、省略した場合のデフォルトは `2023-06-01` です。任意の `anthropic-beta` の値も、プロバイダーの互換性に応じて転送されます。

## メッセージとコンテンツブロック {#messages-and-content-blocks}

メッセージには `user` と `assistant` のロールを使用します。システム指示はトップレベルの `system` フィールドに指定します。コンテンツにはプレーンテキスト、または `text`、`image`、`tool_use`、`tool_result` などの型付きブロックの配列を指定できます。

## ツールと拡張思考 {#tools-and-extended-thinking}

ツールの定義は `tools` に追加し、選択は `tool_choice` で制御します。選択したモデルがサポートしている場合は、`thinking` で拡張推論を設定できます。会話を続けるときは、返された thinking ブロックを保持してください。

## ストリーミング {#streaming}

`stream: true` を設定すると、`message_start`、コンテンツブロックのイベント、`message_delta`、`message_stop` などの Anthropic 形式の SSE イベントを受信できます。SandBase は keepalive と、プロバイダーが定義する beta イベントも転送します。将来の互換性のため、利用側は不明なイベントタイプを無視し、プロトコルレベルの `error` イベントを処理してください。

## 互換性 {#compatibility}

SandBase は公開モデル名を選択されたプロバイダーにマッピングします。その他の互換リクエストフィールドとレスポンスのバイト列は、プロバイダーにサポート外のフィールドを削除するか候補を拒否する明示的な互換性ルールがない限り、そのまま維持されます。プロバイダー固有の beta 機能は、すべてのモデルで利用できるとは限りません。リクエストとレスポンスの完全なスキーマについては、[Anthropic Message の作成](/api-reference/anthropic-compat) を参照してください。
