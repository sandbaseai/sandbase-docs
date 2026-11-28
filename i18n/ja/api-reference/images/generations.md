---
i18nSource: 39ce638efc41350d
title: 画像の生成
description: 同期型の OpenAI Images 互換 API で画像を生成します。
aside: false
outline: false
apiReference:
  title: 画像の生成
  operation: Images
  method: POST
  path: /v1/images/generations
  description: SandBase の同期型 OpenAI Images 互換エンドポイントで画像を生成します。このエンドポイントは汎用の /v1/run モデル API とは別のものです。
  signature: client.images.generate(params)
  groups:
    - title: リクエストボディ
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2、gpt-image-2.5-flare、gpt-image-2.5-sunburst のいずれか。
        - name: prompt
          type: string
          required: true
          description: 生成する画像のテキスト説明。
        - name: n
          type: integer
          required: false
          description: 生成する画像の枚数（対応している場合）。
        - name: size
          type: string
          required: false
          description: モデルが対応する出力サイズ。
        - name: quality
          type: string
          required: false
          description: 出力品質（low、medium、high、auto など）。
        - name: background
          type: string
          required: false
          description: 背景の設定（transparent、opaque、auto など）。
        - name: output_format
          type: string
          required: false
          description: 出力エンコーディング（png、webp、jpeg など）。
        - name: output_compression
          type: integer
          required: false
          description: 出力の圧縮レベル（0〜100）。
        - name: moderation
          type: string
          required: false
          description: プロバイダー互換のモデレーション設定。
        - name: user
          type: string
          required: false
          description: プロバイダー互換のエンドユーザー識別子。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: 同期のみ
      description: stream=true、mode=stream、mode=async は拒否されます。返された data 配列をそのまま使用してください。
    - title: 互換フィールド
      description: 追加の JSON フィールドはそのまま転送されますが、対応状況はモデルとプロバイダーによって異なります。
  errors:
    - status: "400"
      description: 無効な JSON、未対応のモデル、ストリーミングモード、またはプロバイダーへのリクエスト。
    - status: "401"
      description: API キーがないか無効です。
    - status: "402"
      description: 組織または API Key の利用上限に達しました。
    - status: "403"
      description: API キーのスコープでこのエンドポイントは許可されていません。
    - status: "404"
      description: ルーティング先の画像モデルが利用できません。
    - status: "429"
      description: レート制限を超えました。
    - status: "500"
      description: リクエストの永続化またはレスポンスの処理に失敗しました。
    - status: "502"
      description: プロバイダーが無効なネイティブレスポンスを返しました。
    - status: "503"
      description: 成功したプロバイダールートがありません。
---

<ApiReferencePage />

## 対応モデル {#supported-models}
以下の OpenAI 画像モデルは、このエンドポイントでネイティブの Images API を使用します。`model` には公開モデル名を指定してください。

| `model` | 適した用途 |
| --- | --- |
| `gpt-image-2.5-flare` | 日常的なクリエイティブ作業向けの、高速かつ高品質な生成と編集 |
| `gpt-image-2.5-sunburst` | 視覚的な忠実度と精度が最も重要な作業 |
| `gpt-image-2` | 前世代の GPT Image |

リクエストは同期型で、画像データは `data` 内に `b64_json` または URL として返されます。このエンドポイントは汎用の非同期 `/v1/run` モデルエンドポイントとは別のものです。そちらの仕様と料金は、[モデルカタログ](https://www.sandbase.ai/models/image-video) の各モデルのページに記載されています。

画像を編集するには、同じモデル名で [`POST /v1/images/edits`](/api-reference/images/edits) に `multipart/form-data` を送信します。
