---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: ネイティブの Google プロトコルで、モデルの Interaction を作成、ストリーミング、ポーリングします。
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: ネイティブの Google Interaction を作成します。HTTP 200 の場合でも status を確認してください。in_progress のレスポンスはポーリングが必要です。
  groups:
    - title: リクエストボディ
      fields:
        - name: model
          type: string
          required: true
          description: SandBase の論理モデル名。
        - name: input
          type: string | object | array
          required: true
          description: ネイティブの Google Interaction の入力。
        - name: stream
          type: boolean
          required: false
          description: モデルが対応している場合、Google Interactions の SSE イベントを返します。
        - name: background
          type: boolean
          required: false
          description: 永続的に送信し、すぐにポーリングできる Interaction を返します。stream とは併用できません。
        - name: previous_interaction_id
          type: string
          required: false
          description: プロバイダーのアフィニティを維持したまま、上流の Interaction から続行します。
        - name: store
          type: boolean
          required: false
          description: 上流のストレージ設定をそのまま転送します。
        - name: system_instruction
          type: string
          required: false
          description: ネイティブのシステム指示。
        - name: tools
          type: array
          required: false
          description: ネイティブの Google ツール定義。
        - name: generation_config
          type: object
          required: false
          description: ネイティブの生成設定。
        - name: response_format
          type: object | array
          required: false
          description: 要求するレスポンス形式。
        - name: response_modalities
          type: array
          required: false
          description: 要求する出力モダリティ。
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## 認証 {#authentication}

`x-goog-api-key`、`Authorization: Bearer …`、`key` クエリパラメーターを、この優先順位で使います。クエリ文字列の認証情報はログに記録される可能性があるため、ヘッダーを使うことをおすすめします。

## サポートされているモデル {#supported-models}

Interactions エンドポイントは、カタログ名が `google/` で始まるすべてのモデルに使える汎用ルートではありません。モデルには Interactions 互換のプロバイダーマッピングが必要です。SandBase が現在ドキュメント化している互換モデルは次のとおりです。

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

その他の Google モデルは別のエンドポイントを使います。たとえば、Nano Banana Pro と Nano Banana 2 は `/v1beta/interactions` ではなく [`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content) を使います。サポートされていないモデルは、別の Google プロトコルにルーティングされずに失敗します。

## 成功とポーリング {#success-and-polling}

送信に成功すると HTTP `200` を返します。これにはバックグラウンド処理や、待機時間の上限に達した同期リクエストも含まれます。必ず `status` を確認してください。

- `completed`、`failed`、`cancelled`、`incomplete` は終了状態です。
- `in_progress` は実行中です。`GET /v1beta/interactions/{id}` をポーリングしてください。レスポンスの `Location` ヘッダーにこのパスが含まれる場合もあります。
- `requires_action` はプロトコル上のステータスですが、SandBase は現在、これを進めるために必要なツール確認エンドポイントを公開していません。

ポーリング用の ID は、`POST` が返す上流の Interaction の `id` であり、SandBase の予測 ID ではありません。Interaction を作成したのと同じ SandBase API キーで取得する必要があります。

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

終了していない状態の GET レスポンスには、途中の出力や使用量は含まれません。終了状態のレスポンスにはインラインの画像、音声、動画のデータが含まれることがあり、数メガバイトになる場合があります。必要なメディアはすぐにダウンロードして保存してください。上流の保持期間が過ぎると、SandBase が返せるのは構造とメタデータのみを含む不完全な終了時のフォールバックだけで、元のメディアのバイト列は返せません。

## ストリーミング {#streaming}

リクエストボディで `stream: true` を設定します。レスポンスは `text/event-stream` です。このプロトコルでは `?alt=sse` は使いません。イベントと差分のタイプは固定されておらず、許可リストなしで転送されるため、クライアントは未知の値を許容する必要があります。ストリーミングのヘッダーが書き込まれた後のエラーは、別の HTTP ステータスではなく `error` イベントとして届きます。

ストリーミングの可否はモデルによって異なります。プロトコルがサポートしていても、上流のプロバイダーが `stream: true` を拒否することがあります。

## 現在の制限 {#current-limits}

SandBase が現在公開しているのは作成と取得のみです。

- Agent Interactions は拒否されます。`model` を使ってください。
- `background: true` と `stream: true` は併用できません。
- Interaction の一覧表示、削除、キャンセルは公開されていません。
- URI での配信や、GET によるストリームの再接続は公開されていません。
- `previous_interaction_id` には、有効なプロバイダーアフィニティのマッピングと上流のサポートが必要です。アフィニティが利用できない場合、SandBase は黙ってプロバイダーを切り替えずに失敗します。

エラーには Google のエンベロープ `{ "error": { "code", "message", "status" } }` が使われます。HTTP ステータスは安定したものとして扱ってください。`message` に含まれるサニタイズ済みの上流テキストは変わる可能性があります。
