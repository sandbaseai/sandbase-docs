---
i18nSource: 04f3657850b71e58
title: 建立 Anthropic 訊息
description: 使用 SandBase 模型建立與 Anthropic 相容的訊息。
aside: false
outline: false
apiReference:
  title: 建立 Anthropic 訊息
  operation: Inference
  method: POST
  path: /v1/messages
  description: 透過 SandBase 與 Anthropic 相容的 Messages 端點建立訊息。SandBase 會為所選的供應商對應模型，並保留相容的請求與回應欄位。
  signature: client.messages.create(params)
  groups:
    - title: 請求標頭
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API 金鑰。也接受 Authorization: Bearer；兩者同時存在時以 x-api-key 為優先。"
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: 轉送至上游的 Anthropic API 版本。省略時 SandBase 會使用 2023-06-01。
        - name: anthropic-beta
          type: string
          required: false
          description: 以逗號分隔的 beta 功能識別碼，視供應商相容性而定。
    - title: 請求本文
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: 與 Anthropic 相容的模型識別碼。
        - name: messages
          type: object[]
          required: true
          description: 包含文字或具型別內容區塊的使用者與助理訊息。
        - name: max_tokens
          type: integer
          required: true
          description: 輸出 token 的最大數量。
        - name: system
          type: string | object[]
          required: false
          description: 最上層的系統指示。
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 取樣溫度，範圍 0 到 1。
        - name: top_p
          type: number
          required: false
          description: 核取樣（nucleus sampling）門檻。
        - name: top_k
          type: integer
          required: false
          description: 將取樣限制在前 K 個 token。
        - name: stop_sequences
          type: string[]
          required: false
          description: 停止生成的自訂序列。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 回傳 Anthropic 格式的 Server-Sent Events。
        - name: metadata
          type: object
          required: false
          description: 請求中繼資料，包括選用的 user_id。
        - name: tools
          type: object[]
          required: false
          description: 模型可使用的工具定義。
        - name: tool_choice
          type: object
          required: false
          description: 控制工具選擇行為。
        - name: thinking
          type: object
          required: false
          description: 支援模型的延伸思考設定。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: 驗證
      description: "使用 x-api-key 或 Authorization: Bearer。兩者同時提供時以 x-api-key 為優先。"
    - title: 透明協定
      description: 除了模型對應與已設定的供應商相容性規則外，SandBase 會直接轉送相容的請求欄位、非串流回應與 SSE 事件，不進行協定轉換。
    - title: Beta 功能
      description: 若有 anthropic-beta 會一併轉送。候選供應商的相容性規則可能會移除不支援的 beta 欄位，或略過該候選供應商。
  errors:
    - status: "400"
      description: 請求本文無效或功能不支援。
    - status: "401"
      description: 缺少 API 金鑰或金鑰無效。
    - status: "402"
      description: 已達組織支出上限。
    - status: "403"
      description: API 金鑰支出上限或組織權限檢查失敗。
    - status: "404"
      description: 找不到模型或模型無法使用。
    - status: "413"
      description: 供應商以請求過大為由拒絕。
    - status: "429"
      description: 超出供應商速率限制。
    - status: "500"
      description: 預測生命週期或供應商錯誤。
    - status: "502"
      description: 上游串流在產生可用內容前結束。
    - status: "503"
      description: 路由失敗，或所有候選供應商皆無法使用。
---

<ApiReferencePage />
