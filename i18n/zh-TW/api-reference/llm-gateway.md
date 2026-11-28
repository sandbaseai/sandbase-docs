---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: 使用 SandBase 語言與視覺模型建立 OpenAI 相容的 chat completion。
aside: false
outline: false
apiReference:
  title: 建立 Chat Completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: 使用任何支援的 SandBase 聊天模型建立 OpenAI 相容的 chat completion。所選路由支援時，會保留供應商相容欄位。
  signature: client.chat.completions.create(params)
  groups:
    - title: 請求本文
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: 來自 Models API 的模型識別碼。
        - name: messages
          type: object[]
          required: true
          description: 對話訊息，使用所選供應商支援的角色，常見為 system、developer、user、assistant 或 tool。
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 取樣溫度，範圍 0 到 2。
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Nucleus 取樣門檻。
        - name: max_tokens
          type: integer
          required: false
          description: 輸出 token 數上限。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 以 Server-Sent Events 逐步回傳。
        - name: stop
          type: string | string[]
          required: false
          description: 停止生成的一個或多個序列。
        - name: tools
          type: object[]
          required: false
          description: 模型可使用的函式定義。
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: 控制是否選用工具以及選用哪一個工具。
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: 允許支援的模型在單一回合中發出多個工具呼叫。
        - name: user
          type: string
          required: false
          description: 供應商相容的終端使用者識別碼。
        - name: response_format
          type: object
          required: false
          description: JSON 物件或 JSON Schema 輸出設定。
        - name: reasoning_effort
          type: string
          required: false
          description: 供應商相容的推理強度設定。
        - name: reasoning
          type: object
          required: false
          description: 推理設定，例如 effort 或 max_tokens。
        - name: thinking
          type: object
          required: false
          description: 思考設定，例如 type 或 budget_tokens。
        - name: extra_body
          type: object
          required: false
          description: 需要協定轉換的路由所使用的供應商專屬參數。
        - name: n
          type: integer
          required: false
          default: "1"
          description: 要生成的 completion 選項數量。
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Presence penalty，範圍 -2 到 2。
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Frequency penalty，範圍 -2 到 2。
        - name: stream_options
          type: object
          required: false
          description: 串流選項，例如 include_usage。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: 串流與工具
      description: "將 stream 設為 true 以使用 SSE；串流會以 data: [DONE] 結束。加入 stream_options.include_usage 可取得最後的用量區塊。工具呼叫與多模態內容遵循 OpenAI 相容的 schema。"
    - title: 供應商相容性
      description: 在相同協定的路由上，SandBase 會保留額外的相容欄位。跨協定與供應商專屬欄位的支援程度不一；適用時請使用 extra_body。
  errors:
    - status: "400"
      description: 請求本文無效或參數不受支援。
    - status: "401"
      description: API 金鑰缺漏或無效。
    - status: "402"
      description: 已達組織支出上限。
    - status: "404"
      description: 找不到模型或模型無法使用。
    - status: "429"
      description: 超過速率限制。
    - status: "500"
      description: 請求儲存或組織查詢失敗。
    - status: "502"
      description: 所選供應商回傳了無效的回應。
    - status: "503"
      description: 沒有任何供應商路由成功。
---

<ApiReferencePage />
