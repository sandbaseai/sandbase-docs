---
i18nSource: 39ce638efc41350d
title: 生成圖片
description: 使用同步的 OpenAI Images 相容 API 生成圖片。
aside: false
outline: false
apiReference:
  title: 生成圖片
  operation: Images
  method: POST
  path: /v1/images/generations
  description: 透過 SandBase 同步的 OpenAI Images 相容端點生成圖片。此端點與一般的 /v1/run 模型 API 不同。
  signature: client.images.generate(params)
  groups:
    - title: 請求本文
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2、gpt-image-2.5-flare 或 gpt-image-2.5-sunburst 擇一。
        - name: prompt
          type: string
          required: true
          description: 要生成之圖片的文字描述。
        - name: n
          type: integer
          required: false
          description: 要生成的圖片數量（若支援）。
        - name: size
          type: string
          required: false
          description: 模型支援的輸出尺寸。
        - name: quality
          type: string
          required: false
          description: 輸出品質，例如 low、medium、high 或 auto。
        - name: background
          type: string
          required: false
          description: 背景設定，例如 transparent、opaque 或 auto。
        - name: output_format
          type: string
          required: false
          description: 輸出編碼，例如 png、webp 或 jpeg。
        - name: output_compression
          type: integer
          required: false
          description: 輸出壓縮等級，範圍 0 到 100。
        - name: moderation
          type: string
          required: false
          description: 供應商相容的內容審核設定。
        - name: user
          type: string
          required: false
          description: 供應商相容的終端使用者識別碼。
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
    - title: 僅限同步
      description: stream=true、mode=stream 與 mode=async 會被拒絕。請直接使用回傳的 data 陣列。
    - title: 相容欄位
      description: 額外的 JSON 欄位會原封不動轉送，但支援程度仍取決於模型與供應商。
  errors:
    - status: "400"
      description: JSON 無效、模型不受支援、使用串流模式，或供應商請求有誤。
    - status: "401"
      description: API 金鑰缺漏或無效。
    - status: "402"
      description: 已達組織或 API Key 的支出上限。
    - status: "403"
      description: API 金鑰的權限範圍不允許存取此端點。
    - status: "404"
      description: 路由到的圖片模型無法使用。
    - status: "429"
      description: 超過速率限制。
    - status: "500"
      description: 請求儲存或回應處理失敗。
    - status: "502"
      description: 供應商回傳了無效的原生回應。
    - status: "503"
      description: 沒有任何供應商路由成功。
---

<ApiReferencePage />

## 支援的模型 {#supported-models}
這些 OpenAI 圖片模型在此端點上使用原生 Images API。請在 `model` 中傳送公開的模型名稱：

| `model` | 適用情境 |
| --- | --- |
| `gpt-image-2.5-flare` | 快速、高品質的生成與編輯，適合日常創意工作 |
| `gpt-image-2.5-sunburst` | 最重視視覺還原度與精確度的工作 |
| `gpt-image-2` | 上一代 GPT Image |

請求為同步處理，並在 `data` 中以 `b64_json` 或 URL 形式回傳圖片資料。此端點與一般的非同步 `/v1/run` 模型端點是分開的；[模型目錄](https://www.sandbase.ai/models/image-video)中各模型的頁面會說明該規格及其價格。

若要編輯圖片，請使用相同的模型名稱，將 `multipart/form-data` 傳送至 [`POST /v1/images/edits`](/api-reference/images/edits)。
