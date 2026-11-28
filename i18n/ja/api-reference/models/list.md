---
i18nSource: 0413109dd629d7d7
title: モデルの一覧表示
description: 有効な論理モデルを OpenAI 互換のモデル一覧形式で一覧表示します。
aside: false
outline: false
apiReference:
  title: モデルの一覧表示
  operation: Models
  method: GET
  path: /v1/models
  description: 有効な論理モデルを OpenAI 互換のモデル一覧形式で一覧表示します。
  groups:
    - title: クエリパラメーター
      fields:
        - name: q
          type: string
          required: false
          description: モデル名、表示名、ベンダー、説明を対象としたあいまい検索。
        - name: vendor
          type: string
          required: false
          description: "ベンダーで絞り込みます（例: OpenAI、Anthropic）。"
        - name: type
          type: string
          required: false
          description: モデルタイプで絞り込みます。デフォルトは llm です。
        - name: order
          type: string
          required: false
          description: "並び順: sort_order、most-popular、newest、または name。"
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/models" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "id": "openai/gpt-4o",
            "object": "model",
            "created": 1783353600,
            "owned_by": "openai"
          }
        ]
      }
---

<ApiReferencePage />
