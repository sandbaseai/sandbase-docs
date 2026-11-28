---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: 使用原生 Google Gemini GenerateContent 協定呼叫 SandBase。
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: 傳送原生 Gemini 請求並接收 Gemini 相容的回應。串流請使用 streamGenerateContent。
  groups:
    - title: 路徑參數
      fields:
        - name: model
          type: string
          required: true
          description: 不含前綴的 Google 模型名稱，例如 gemini-3.5-flash。SandBase 會將其解析為 google/{model}。
    - title: 請求本文
      fields:
        - name: contents
          type: array
          required: false
          description: 由 role 與 parts 組成的 Gemini 對話內容。
        - name: systemInstruction
          type: object
          required: false
          description: 以 Gemini Content 格式表示的文字系統指示。
        - name: generationConfig
          type: object
          required: false
          description: 取樣、輸出長度、結構化輸出與思考設定。
        - name: tools
          type: array
          required: false
          description: 函式宣告或支援的 Gemini 內建工具設定。
        - name: toolConfig
          type: object
          required: false
          description: Gemini 函式呼叫政策。
        - name: safetySettings
          type: array
          required: false
          description: Gemini 安全類別與門檻。
        - name: cachedContent
          type: string
          required: false
          description: 支援時直接傳遞的 Gemini 快取內容資源。
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

## 驗證 {#authentication}

Google 相容的請求可以將 SandBase API 金鑰放在 `x-goog-api-key`、`Authorization: Bearer …` 或 `key` 查詢參數中，優先順序依此排列。建議使用標頭：查詢字串中的憑證可能出現在代理伺服器日誌與瀏覽器歷史紀錄中。

## 串流 {#streaming}

將方法後綴改為 `:streamGenerateContent`。未加查詢參數時，SandBase 會以串流 JSON 陣列回傳 Google 相容的回應物件。加上 `?alt=sse` 可改用 Server-Sent Events：

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## 原生圖片生成 {#native-image-generation}

以下圖片模型具有專用的原生 GenerateContent 對應：

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs)：`gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs)：`gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs)：`gemini-nano-banana-2.1`

各模型頁面列有其 token 價格與每張圖片的費用。

對於這些對應，SandBase 會直接轉送請求與回應的酬載，不經由 Chat
Completions 轉換。如此可保留圖片部分、回應模態與供應商定義的欄位。請在 URL 中使用不含前綴的模型名稱；
例如 `google/gemini-3.1-flash-image` 在路徑中寫成 `gemini-3.1-flash-image`。
### 編輯圖片 {#edit-an-image}

將來源圖片以 `inlineData` 部分加在文字指示旁。請使用您所傳送位元組的 MIME 類型：

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

### 使用 Google Gen AI SDK {#use-the-google-gen-ai-sdk}

將官方 SDK 指向 SandBase，並使用您的 SandBase API 金鑰：

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

若要串流，請以相同的本文呼叫 `:streamGenerateContent?alt=sse`（SDK：`generate_content_stream`）。

### 處理回應 {#response-handling}
從回傳的 candidate 部分讀取生成的媒體。由於這些模型使用原生直通，供應商定義的
欄位大小寫與 MIME 中繼資料會原樣回傳。請解碼 base64 酬載並確認實際的媒體位元組，
再決定副檔名。

## 路由與轉換範圍 {#routing-and-translation-boundaries}

SandBase 只會選擇支援所請求之原生 Gemini 協定的供應商。若所選模型沒有
相容的原生對應，請求會失敗，而不會改用其他協定的供應商。

使用轉換式 GenerateContent 路徑的模型支援文字、函式呼叫與回應、內嵌 `image/*` 資料，
以及公開的 HTTP(S) 圖片參照。該轉換路徑會以 Google 格式的 `400 INVALID_ARGUMENT` 回應拒絕不支援的內嵌 MIME 類型、私有 Google Files 或
`gs://` 參照、多個 candidate，以及不支援的回應模態。
上方列出的圖片生成對應使用原始直通，不受這些僅限轉換路徑的限制；
請依所選供應商的回應驗證回傳的媒體欄位。
