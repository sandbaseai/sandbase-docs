---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: SandBase के language और vision models के साथ OpenAI-compatible chat completions बनाएँ।
aside: false
outline: false
apiReference:
  title: Chat Completion बनाएँ
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: किसी भी समर्थित SandBase chat model के साथ OpenAI-compatible chat completion बनाएँ। चुने गए route द्वारा समर्थित होने पर provider-compatible fields बनाए रखे जाते हैं।
  signature: client.chat.completions.create(params)
  groups:
    - title: Request body
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API से model identifier।
        - name: messages
          type: object[]
          required: true
          description: चुने गए provider द्वारा समर्थित roles वाले conversation messages, आमतौर पर system, developer, user, assistant, या tool।
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 0 से 2 तक sampling temperature।
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Nucleus sampling threshold।
        - name: max_tokens
          type: integer
          required: false
          description: Output tokens की अधिकतम संख्या।
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: क्रमिक Server-Sent Events लौटाएँ।
        - name: stop
          type: string | string[]
          required: false
          description: वह sequence या sequences जिन पर generation रुकता है।
        - name: tools
          type: object[]
          required: false
          description: Model के लिए उपलब्ध function definitions।
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: नियंत्रित करता है कि tool चुना जाए या नहीं, और कौन-सा।
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: समर्थित models को एक turn में कई tool calls भेजने दें।
        - name: user
          type: string
          required: false
          description: Provider-compatible end-user identifier।
        - name: response_format
          type: object
          required: false
          description: JSON object या JSON Schema output configuration।
        - name: reasoning_effort
          type: string
          required: false
          description: Provider-compatible reasoning effort setting।
        - name: reasoning
          type: object
          required: false
          description: Reasoning configuration, जैसे effort या max_tokens।
        - name: thinking
          type: object
          required: false
          description: Thinking configuration, जैसे type या budget_tokens।
        - name: extra_body
          type: object
          required: false
          description: Protocol translation की ज़रूरत वाले routes के लिए provider-specific parameters।
        - name: n
          type: integer
          required: false
          default: "1"
          description: Generate किए जाने वाले completion choices की संख्या।
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: -2 से 2 तक presence penalty।
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: -2 से 2 तक frequency penalty।
        - name: stream_options
          type: object
          required: false
          description: Streaming options, जैसे include_usage।
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
    - title: Streaming और tools
      description: "SSE के लिए stream को true पर सेट करें; stream data: [DONE] पर समाप्त होता है। अंतिम usage chunk के लिए stream_options.include_usage जोड़ें। Tool calls और multimodal content OpenAI-compatible schema का पालन करते हैं।"
    - title: Provider compatibility
      description: SandBase समान-protocol routes पर अतिरिक्त compatible fields बनाए रखता है। Cross-protocol और provider-specific fields का समर्थन अलग-अलग होता है; जहाँ लागू हो, extra_body का उपयोग करें।
  errors:
    - status: "400"
      description: अमान्य request body या असमर्थित parameter।
    - status: "401"
      description: API key नहीं है या अमान्य है।
    - status: "402"
      description: Organization की spending limit पूरी हो गई।
    - status: "404"
      description: Model नहीं मिला या उपलब्ध नहीं है।
    - status: "429"
      description: Rate limit पार हो गई।
    - status: "500"
      description: Request persistence या organization lookup विफल हुआ।
    - status: "502"
      description: चुने गए provider ने अमान्य response लौटाया।
    - status: "503"
      description: कोई भी provider route सफल नहीं हुआ।
---

<ApiReferencePage />
