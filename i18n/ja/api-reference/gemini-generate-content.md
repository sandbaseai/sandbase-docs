---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: ネイティブの Google Gemini GenerateContent プロトコルで SandBase を呼び出します。
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: ネイティブの Gemini リクエストを送信し、Gemini 互換のレスポンスを受け取ります。ストリーミングには streamGenerateContent を使います。
  groups:
    - title: パスパラメーター
      fields:
        - name: model
          type: string
          required: true
          description: "プレフィックスなしの Google モデル名（例: gemini-3.5-flash）。SandBase は google/{model} として解決します。"
    - title: リクエストボディ
      fields:
        - name: contents
          type: array
          required: false
          description: role と parts で構成される Gemini の会話コンテンツ。
        - name: systemInstruction
          type: object
          required: false
          description: Gemini の Content 形式のテキストのシステム指示。
        - name: generationConfig
          type: object
          required: false
          description: サンプリング、出力長、構造化出力、思考の設定。
        - name: tools
          type: array
          required: false
          description: 関数宣言、またはサポートされている Gemini 組み込みツールの設定。
        - name: toolConfig
          type: object
          required: false
          description: Gemini の関数呼び出しポリシー。
        - name: safetySettings
          type: array
          required: false
          description: Gemini の安全性カテゴリとしきい値。
        - name: cachedContent
          type: string
          required: false
          description: サポートされている場合にそのまま渡される Gemini のキャッシュ済みコンテンツリソース。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## 認証 {#authentication}

Google 互換のリクエストでは、SandBase API キーを `x-goog-api-key`、`Authorization: Bearer …`、`key` クエリパラメーターのいずれかで渡せます。優先順位はこの順です。クエリ文字列の認証情報はプロキシのログやブラウザーの履歴に残る可能性があるため、ヘッダーを使うことをおすすめします。

## ストリーミング {#streaming}

メソッドのサフィックスを `:streamGenerateContent` に置き換えます。クエリパラメーターを指定しない場合、SandBase は Google 互換のレスポンスオブジェクトを、ストリーミングされる JSON 配列として返します。Server-Sent Events を使うには `?alt=sse` を追加します。

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## ネイティブの画像生成 {#native-image-generation}

次の画像モデルには、専用のネイティブ GenerateContent マッピングがあります。

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

各モデルのページに、トークン料金と画像 1 枚あたりのコストが記載されています。

これらのマッピングでは、SandBase はリクエストとレスポンスのペイロードを Chat Completions を介して変換せずに転送します。そのため、画像パート、レスポンスのモダリティ、プロバイダー定義のフィールドが保持されます。URL にはプレフィックスなしのモデル名を使います。たとえば、`google/gemini-3.1-flash-image` はパスでは `gemini-3.1-flash-image` になります。
### 画像を編集する {#edit-an-image}

元の画像を、テキストの指示の隣に `inlineData` パートとして追加します。送信するバイト列の MIME タイプを使ってください。

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Google Gen AI SDK を使う {#use-the-google-gen-ai-sdk}

公式 SDK の接続先を SandBase に設定し、SandBase API キーを使います。

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

ストリーミングでは、同じボディで `:streamGenerateContent?alt=sse`（SDK では `generate_content_stream`）を呼び出します。

### レスポンスの処理 {#response-handling}
生成されたメディアは、返された candidate の parts から読み取ります。これらのモデルはネイティブのパススルーを使うため、プロバイダー定義のフィールドの大文字・小文字や MIME メタデータは受信したまま返されます。ファイル拡張子を決める前に、base64 ペイロードをデコードし、実際のメディアのバイト列を確認してください。

## ルーティングと変換の境界 {#routing-and-translation-boundaries}

SandBase は、要求されたネイティブ Gemini プロトコルをサポートするプロバイダーだけを選択します。選択したモデルに互換性のあるネイティブマッピングがない場合、別のプロトコルのプロバイダーにフォールバックせず、リクエストは失敗します。

変換された GenerateContent パスを使うモデルは、テキスト、関数呼び出しとそのレスポンス、インラインの `image/*` データ、公開 HTTP(S) の画像参照をサポートします。この変換パスでは、サポートされていないインライン MIME タイプ、プライベートな Google Files や `gs://` の参照、複数の candidate、サポートされていないレスポンスのモダリティを、Google 形式の `400 INVALID_ARGUMENT` レスポンスで拒否します。上記の画像生成マッピングは生のパススルーを使うため、これらの変換専用の制限は適用されません。返されたメディアのフィールドは、選択したプロバイダーのレスポンスに従って検証してください。
