---
i18nSource: 88501841ea0abd9d
title: 統合画像 Run API
description: SandBase の統合モデル API で、画像の生成と編集の機能を実行します。
aside: false
outline: false
apiReference:
  title: 画像生成
  operation: Models
  method: POST
  path: /v1/run
  description: FLUX、Stable Diffusion、DALL-E などの AI モデルで画像を生成します。
  groups:
    - title: リクエストボディ
      fields:
        - name: model
          type: string
          required: true
          description: 現在のモデル識別子（例：bfl/flux-1/schnell）。
        - name: prompt
          type: string
          required: true
          description: 画像のテキスト説明
        - name: aspect_ratio
          type: string
          required: false
          description: 出力のアスペクト比。Flux 1 Schnell のデフォルトは 16:9 です。
        - name: guidance_scale
          type: number
          required: false
          description: プロンプトのガイダンス強度（1〜20）。
        - name: output_format
          type: jpeg | png
          required: false
          description: 出力画像の形式。Flux 1 Schnell のデフォルトは jpeg です。
        - name: mode
          type: string
          required: false
          description: 選択したモデルが非同期実行に対応している場合にのみ async を指定します
        - name: webhook_url
          type: string
          required: false
          description: この非同期タスク専用の公開 HTTPS コールバック URL
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"bfl/flux-1/schnell","prompt":"A futuristic city at sunset","aspect_ratio":"1:1"}'
    - label: Python
      language: python
      code: |-
        response = client.post("/v1/run", json={
            "model": "bfl/flux-1/schnell",
            "prompt": "A futuristic city at sunset, cyberpunk style",
            "aspect_ratio": "1:1"
        })
        print(response.json()["outputs"][0]["url"])
  response:
    status: 200 OK
    code: |-
      {
        "id": "run_01...",
        "status": "completed",
        "outputs": [{ "url": "https://media.sandbase.ai/images/output.png" }]
      }
---

<ApiReferencePage />
