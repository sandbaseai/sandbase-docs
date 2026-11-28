---
i18nSource: a4db28360a2974cd
title: 編輯圖片
description: 使用同步的 OpenAI Images 相容 API 編輯上傳的圖片。
aside: false
outline: false
apiReference:
  title: 編輯圖片
  operation: Images
  method: POST
  path: /v1/images/edits
  description: 透過 SandBase 同步的 OpenAI Images 相容 multipart 端點，編輯一張或多張上傳的圖片。
  signature: client.images.edit(params)
  groups:
    - title: 請求主體
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2、gpt-image-2.5-flare 或 gpt-image-2.5-sunburst 其中之一。
        - name: prompt
          type: string
          required: true
          description: 所需編輯內容的文字描述。
        - name: image
          type: file | file[]
          required: true
          description: 一個或多個來源圖片檔案。若有多張圖片，請重複此 multipart 欄位。
        - name: mask
          type: file
          required: false
          description: 用於局部重繪（inpainting）的選用遮罩圖片。
        - name: n
          type: integer
          required: false
          description: 支援時要回傳的編輯後圖片數量。
        - name: size
          type: string
          required: false
          description: 模型支援的輸出尺寸。
        - name: quality
          type: string
          required: false
          description: 模型支援的輸出品質。
        - name: background
          type: string
          required: false
          description: 輸出背景設定。
        - name: input_fidelity
          type: string
          required: false
          description: 支援的模型應保留來源圖片細節的程度。
        - name: output_format
          type: string
          required: false
          description: 輸出編碼，例如 png、webp 或 jpeg。
        - name: output_compression
          type: integer
          required: false
          description: 輸出壓縮等級，範圍 0 到 100。
        - name: user
          type: string
          required: false
          description: 與供應商相容的終端使用者識別碼。
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
    - title: Multipart 上傳
      description: 以 multipart/form-data 傳送 model、prompt 與 image。重複 image 欄位即可保留多個來源檔案。
    - title: 僅限同步
      description: stream=true、mode=stream 與 mode=async 會被拒絕。
  errors:
    - status: "400"
      description: multipart 主體無效、不支援的模型、串流模式或供應商請求。
    - status: "401"
      description: API 金鑰遺失或無效。
    - status: "402"
      description: 已達組織或 API Key 的支出上限。
    - status: "403"
      description: API 金鑰的範圍未授權此端點。
    - status: "404"
      description: 路由到的圖片編輯模型無法使用。
    - status: "429"
      description: 超過速率限制。
    - status: "500"
      description: 請求保存或回應處理失敗。
    - status: "502"
      description: 供應商回傳了無效的原生回應。
    - status: "503"
      description: 沒有任何供應商路由成功。
---

<ApiReferencePage />

## 支援的模型 {#supported-models}
以下 OpenAI 圖片模型在此端點與 [`/v1/images/generations`](/api-reference/images/generations) 上使用原生 Images API。請在 `model` 中傳送公開的模型名稱：

| `model` | 適用情境 |
| --- | --- |
| `gpt-image-2.5-flare` | 快速、高品質的生成與編輯，適合日常創作 |
| `gpt-image-2.5-sunburst` | 最重視視覺還原度與精確度的工作 |
| `gpt-image-2` | 上一代 GPT Image |

請求為同步處理，並在 `data` 中以 `b64_json` 或 URL 形式回傳圖片資料。此端點與一般的非同步 `/v1/run` 模型端點是分開的；各模型在 [模型目錄](https://www.sandbase.ai/models/image-video) 中的頁面會說明該合約及其價格。

請提供 `model`、`prompt` 以及至少一個 `image` 檔案。重複 `image` 欄位即可合成或編輯多張來源圖片：

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
