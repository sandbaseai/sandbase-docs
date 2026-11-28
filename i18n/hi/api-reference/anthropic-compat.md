---
i18nSource: 04f3657850b71e58
title: Anthropic Message बनाएँ
description: SandBase model के साथ Anthropic-compatible message बनाएँ।
aside: false
outline: false
apiReference:
  title: Anthropic Message बनाएँ
  operation: Inference
  method: POST
  path: /v1/messages
  description: SandBase के Anthropic-compatible Messages endpoint के ज़रिए message बनाएँ। SandBase चुने गए provider के लिए model को map करता है और compatible request व response fields को बनाए रखता है।
  signature: client.messages.create(params)
  groups:
    - title: Request headers
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API key। Authorization: Bearer भी स्वीकार है; दोनों मौजूद होने पर x-api-key को प्राथमिकता मिलती है।"
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: upstream को भेजा जाने वाला Anthropic API version। न भेजने पर SandBase 2023-06-01 इस्तेमाल करता है।
        - name: anthropic-beta
          type: string
          required: false
          description: comma से अलग किए गए beta feature identifiers, provider compatibility के अधीन।
    - title: Request body
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Anthropic-compatible model identifier।
        - name: messages
          type: object[]
          required: true
          description: text या typed content blocks वाले user और assistant messages।
        - name: max_tokens
          type: integer
          required: true
          description: output tokens की अधिकतम संख्या।
        - name: system
          type: string | object[]
          required: false
          description: Top-level system instruction।
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 0 से 1 तक sampling temperature।
        - name: top_p
          type: number
          required: false
          description: Nucleus sampling threshold।
        - name: top_k
          type: integer
          required: false
          description: sampling को top K tokens तक सीमित करें।
        - name: stop_sequences
          type: string[]
          required: false
          description: generation रोकने वाले custom sequences।
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Anthropic-style Server-Sent Events लौटाएँ।
        - name: metadata
          type: object
          required: false
          description: Request metadata, जिसमें वैकल्पिक user_id शामिल है।
        - name: tools
          type: object[]
          required: false
          description: model के लिए उपलब्ध tool definitions।
        - name: tool_choice
          type: object
          required: false
          description: tool चुनने के व्यवहार को नियंत्रित करता है।
        - name: thinking
          type: object
          required: false
          description: समर्थित models के लिए extended thinking configuration।
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
    - title: Authentication
      description: "x-api-key या Authorization: Bearer इस्तेमाल करें। दोनों दिए जाने पर x-api-key को प्राथमिकता मिलती है।"
    - title: Transparent protocol
      description: model mapping और configured provider compatibility rules को छोड़कर, SandBase compatible request fields, non-stream responses और SSE events को बिना protocol translation के आगे भेजता है।
    - title: Beta features
      description: anthropic-beta मौजूद होने पर आगे भेजा जाता है। किसी candidate के compatibility rules असमर्थित beta fields हटा सकते हैं या उस candidate को छोड़ सकते हैं।
  errors:
    - status: "400"
      description: अमान्य request body या असमर्थित feature।
    - status: "401"
      description: API key मौजूद नहीं है या अमान्य है।
    - status: "402"
      description: संगठन की खर्च सीमा पूरी हो गई।
    - status: "403"
      description: API Key की खर्च सीमा या संगठन permission विफलता।
    - status: "404"
      description: Model नहीं मिला या उपलब्ध नहीं है।
    - status: "413"
      description: provider ने request को बहुत बड़ा मानकर अस्वीकार कर दिया।
    - status: "429"
      description: Provider की rate limit पार हो गई।
    - status: "500"
      description: Prediction lifecycle या provider error।
    - status: "502"
      description: उपयोगी content मिलने से पहले upstream stream समाप्त हो गया।
    - status: "503"
      description: Routing विफल हुई या सभी provider candidates अनुपलब्ध थे।
---

<ApiReferencePage />
