---
i18nSource: efa205ed7505643c
title: モデルまたは API の機能を実行する
description: 統合実行エンドポイントから SandBase のモデルまたは API の機能を送信します。
aside: false
outline: false
apiReference:
  title: モデルまたは API の機能を実行する
  operation: Models
  method: POST
  path: /v1/run
  description: 有効な SandBase のモデルまたは API の機能を実行します。リクエストフィールドは機能ごとに異なります。選択した機能のスキーマは、SandBase ウェブサイトのモデルまたは API のリファレンスページを参照してください。
  groups:
    - title: リクエストボディ
      fields:
        - name: model
          type: string
          required: true
          description: 有効な論理モデルまたは API の機能の識別子。
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: 実行モードのヒント。`auto` は選択した機能に設定されたデフォルトを使用します。その他の値は機能側のサポートが必要です。
        - name: stream
          type: boolean
          required: false
          description: "選択した機能がサポートしている場合に、ストリーミング出力を要求します。`mode: stream` と同等です。"
        - name: webhook_url
          type: string
          required: false
          description: サポートされている非同期の画像用の任意の HTTPS コールバック
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## 実行と結果 {#execution-and-results}

同期型の機能は、元のリクエストで完了したレスポンスを返します。非同期型の機能は不透明な `id` とともに `202 Accepted` を返します。ステータスが終了状態になるまで [非同期実行の取得](./run-get) をポーリングしてください。

機能固有のリクエストフィールドと出力形式は、選択したモデルまたは API 操作のページで定義されています。これらのフィールドは JSON ボディのトップレベルに送信し、`input` オブジェクトで囲まないでください。すべての機能が同じパラメーターを受け付けるとは限りません。

## Webhook コールバック {#webhook-callbacks}

`webhook_url` は、サポートされている非同期の画像、動画、音声タスクでのみ設定してください。SandBase は、完了または失敗の後に最終的な実行イベントを HTTPS エンドポイントに送信します。コールバックは配信の通知であり、`GET /v1/run/{id}` の代わりにはなりません。正式なステータスを得るために実行エンドポイントのポーリングを続け、コールバックが遅延または重複した場合でも安全に再試行してください。同期型のモデルレスポンスとプロバイダーネイティブのエンドポイントは、このコールバックフィールドを使用しません。
