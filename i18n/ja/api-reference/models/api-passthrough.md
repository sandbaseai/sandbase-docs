---
i18nSource: fb62188053fb216d
title: API パススルー
description: 有効なカタログ API 機能を、ベンダー修飾パスで呼び出します。
aside: false
outline: false
apiReference:
  title: API パススルー
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: vendor/upstream_path という名前の有効なカタログ機能を解決し、SandBase の統合パイプラインで JSON オブジェクトを実行します。GET を使用する機能では GET もサポートされます。
  groups:
    - title: パスパラメーター
      fields:
        - name: vendor
          type: string
          required: true
          description: 機能名の最初のセグメント。
        - name: upstream_path
          type: string
          required: true
          description: 残りのパス
          including literal slash-separated segments when present.: null
    - title: リクエストボディ
      fields:
        - name: model
          type: string
          required: false
          description: 省略すると URL から導出した vendor/path の識別子を使用します。指定する場合
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: 選択した機能のライブスキーマで定義されたフィールド。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

URL は `vendor/upstream_path` という名前の有効なモデルに解決されます。[Models API](./) が返すベンダー修飾名をそのまま使用してください。ネストされた機能名は、パーセントエンコードされたスラッシュではなく、そのままのパスセグメントとして扱われます。

POST は JSON オブジェクトのみを受け付けます。空の POST ボディも許可され、URL から導出したモデルを含むオブジェクトと同じように動作します。GET は空のボディを使用します。レスポンスのフィールドや同期・非同期の動作は、選択した機能によって異なります。非同期の結果は `GET /v1/run/{id}` でポーリングしてください。
