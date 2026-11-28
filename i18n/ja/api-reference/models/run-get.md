---
i18nSource: 2ffb24dad49b9c79
title: 非同期 Run の取得
description: SandBase の非同期モデルまたは API の Run をポーリングし、現在の結果または最終結果を取得します。
aside: false
outline: false
apiReference:
  title: 非同期 Run の取得
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: POST /v1/run で作成した非同期 Run の現在の状態または終了状態を取得します。
  groups:
    - title: パスパラメーター
      fields:
        - name: id
          type: string
          required: true
          description: POST /v1/run が返す不透明な Run 識別子。返された値をそのまま使用してください。プレフィックスは保証されません。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## ポーリング {#polling}

時間のかかるメディアや API のタスクは、5〜10 秒ごとにポーリングしてください。`status` が `completed`、`failed`、または `timeout` になったら終了します。終了状態でないレスポンスでは `outputs` が省略される場合があります。Run ID は不透明な値として扱い、別のステータス URL を組み立てないでください。
