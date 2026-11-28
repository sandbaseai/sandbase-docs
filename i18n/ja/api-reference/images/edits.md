---
i18nSource: a4db28360a2974cd
title: 画像の編集
description: 同期型の OpenAI Images 互換 API でアップロードした画像を編集します。
aside: false
outline: false
apiReference:
  title: 画像の編集
  operation: Images
  method: POST
  path: /v1/images/edits
  description: SandBase の同期型 OpenAI Images 互換 multipart エンドポイントで、アップロードした 1 枚以上の画像を編集します。
  signature: client.images.edit(params)
  groups:
    - title: リクエストボディ
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2、gpt-image-2.5-flare、gpt-image-2.5-sunburst のいずれか。
        - name: prompt
          type: string
          required: true
          description: 要求する編集内容のテキスト説明。
        - name: image
          type: file | file[]
          required: true
          description: 1 つ以上のソース画像ファイル。複数の画像を送る場合は multipart フィールドを繰り返します。
        - name: mask
          type: file
          required: false
          description: インペインティング用の任意のマスク画像。
        - name: n
          type: integer
          required: false
          description: 返す編集画像の数（対応している場合）。
        - name: size
          type: string
          required: false
          description: モデルが対応する出力サイズ。
        - name: quality
          type: string
          required: false
          description: モデルが対応する出力品質。
        - name: background
          type: string
          required: false
          description: 出力の背景設定。
        - name: input_fidelity
          type: string
          required: false
          description: 対応モデルがソース画像の細部をどの程度保持するか。
        - name: output_format
          type: string
          required: false
          description: 出力形式（png、webp、jpeg など）。
        - name: output_compression
          type: integer
          required: false
          description: 出力の圧縮レベル（0〜100）。
        - name: user
          type: string
          required: false
          description: プロバイダー互換のエンドユーザー識別子。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: multipart アップロード
      description: model、prompt、image を multipart/form-data として送信します。image フィールドを繰り返すと、複数のソースファイルがそのまま送信されます。
    - title: 同期のみ
      description: stream=true、mode=stream、mode=async は拒否されます。
  errors:
    - status: "400"
      description: multipart ボディ、モデル、ストリーミングモード、またはプロバイダーリクエストが無効です。
    - status: "401"
      description: API キーがないか無効です。
    - status: "402"
      description: 組織または API キーの利用上限に達しました。
    - status: "403"
      description: API キーのスコープでこのエンドポイントが許可されていません。
    - status: "404"
      description: ルーティング先の画像編集モデルを利用できません。
    - status: "429"
      description: レート制限を超えました。
    - status: "500"
      description: リクエストの保存またはレスポンスの処理に失敗しました。
    - status: "502"
      description: プロバイダーが無効なネイティブレスポンスを返しました。
    - status: "503"
      description: 成功したプロバイダールートがありません。
---

<ApiReferencePage />

## 対応モデル {#supported-models}
以下の OpenAI 画像モデルは、このエンドポイントと [`/v1/images/generations`](/api-reference/images/generations) でネイティブの Images API を使用します。`model` には公開モデル名を指定してください。

| `model` | 用途 |
| --- | --- |
| `gpt-image-2.5-flare` | 日常的なクリエイティブ作業向けの、高速かつ高品質な生成と編集 |
| `gpt-image-2.5-sunburst` | 視覚的な忠実度と精度が最も重要な作業 |
| `gpt-image-2` | 前世代の GPT Image |

リクエストは同期的に処理され、画像データを `data` 内に `b64_json` または URL として返します。このエンドポイントは汎用の非同期 `/v1/run` モデルエンドポイントとは別のものです。各モデルの仕様と料金は、[モデルカタログ](https://www.sandbase.ai/models/image-video)の各モデルページに記載されています。

`model`、`prompt`、および 1 つ以上の `image` ファイルを指定します。複数のソース画像を合成または編集するには、`image` フィールドを繰り返します。

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
