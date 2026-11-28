---
i18nSource: b5cf676d897d17a3
title: 建立 Response
description: 建立 OpenAI 相容的模型回應，包括串流與啟用工具的請求。
aside: false
outline: false
apiReference:
  title: 建立 Response
  operation: Inference
  method: POST
  path: /v1/responses
  description: 建立 OpenAI 相容的模型回應。SandBase 會在模型對應後保留請求欄位，再將回應清理為公開的 OpenAI 欄位。
  signature: client.responses.create(params)
  groups:
    - title: 請求本文
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: 來自 Models API 的模型識別碼。
        - name: input
          type: string | object[]
          required: false
          description: 文字、訊息項目，或所選模型與供應商支援的其他輸入。
        - name: instructions
          type: string
          required: false
          description: 此回應的系統或開發者指示。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 傳回 OpenAI 相容的 Server-Sent Events。
        - name: background
          type: boolean
          required: false
          description: 在所選供應商支援時，要求於背景執行。
        - name: include
          type: string[]
          required: false
          description: 在支援時要額外包含的公開回應資料。
        - name: max_output_tokens
          type: integer
          required: false
          description: 產生的 token 上限。
        - name: max_tool_calls
          type: integer
          required: false
          description: 在支援時的內建工具呼叫次數上限。
        - name: metadata
          type: object
          required: false
          description: 轉送給供應商的請求中繼資料。
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: 允許支援的模型平行呼叫工具。
        - name: previous_response_id
          type: string
          required: false
          description: 在所選路由支援時，要接續的先前回應。
        - name: reasoning
          type: object
          required: false
          description: 支援模型的推理設定。
        - name: store
          type: boolean
          required: false
          description: 在支援時，要求供應商端儲存回應。
        - name: text
          type: object
          required: false
          description: 文字輸出與結構化格式設定。
        - name: tool_choice
          type: string | object
          required: false
          description: 控制工具選擇。
        - name: tools
          type: object[]
          required: false
          description: 可供模型使用的工具。
        - name: truncation
          type: string
          required: false
          description: 輸入截斷行為。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: 請求相容性
      description: SandBase 會將 model 改寫為選定的上游模型，並保留其他請求欄位。各供應商的支援程度仍有差異。
    - title: 清理後的回應
      description: 僅傳回公開的 OpenAI 回應欄位與 token 用量。供應商的計費、帳戶、路由資訊以及未知的頂層擴充欄位都會被移除；輸出項目的內容則會保留。
    - title: 串流
      description: 公開的 response.* 與 error SSE 事件會經過清理後轉送。未知的私有事件會被捨棄；格式錯誤的資料會關閉串流，而不是轉送不安全的內容。
  errors:
    - status: "400"
      description: 無效的 JSON、缺少 model，或無效的供應商請求。
    - status: "401"
      description: API 金鑰遺失或無效。
    - status: "402"
      description: 已達組織或 API 金鑰的支出上限。
    - status: "403"
      description: API 金鑰範圍不足或遭上游拒絕權限。
    - status: "413"
      description: 上游供應商以請求過大為由拒絕。
    - status: "500"
      description: 預測生命週期或組織查詢失敗。
    - status: "502"
      description: 無法安全地剖析並清理上游回應。
    - status: "503"
      description: 路由失敗，或所有候選供應商皆已用盡。
---

<ApiReferencePage />
