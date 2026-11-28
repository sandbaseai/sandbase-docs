---
i18nSource: b5cf676d897d17a3
title: Response बनाएं
description: OpenAI-compatible model response बनाएं, जिसमें streaming और tool वाले requests भी शामिल हैं।
aside: false
outline: false
apiReference:
  title: Response बनाएं
  operation: Inference
  method: POST
  path: /v1/responses
  description: OpenAI-compatible model response बनाएं। SandBase model mapping के बाद request fields बनाए रखता है, फिर responses को public OpenAI fields तक sanitize करता है।
  signature: client.responses.create(params)
  groups:
    - title: Request body
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API से model identifier।
        - name: input
          type: string | object[]
          required: false
          description: Text, message items, या चुने गए model और provider द्वारा सपोर्टेड दूसरा input।
        - name: instructions
          type: string
          required: false
          description: Response के लिए system या developer instruction।
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: OpenAI-compatible Server-Sent Events लौटाएं।
        - name: background
          type: boolean
          required: false
          description: चुना गया provider सपोर्ट करे तो background execution मांगें।
        - name: include
          type: string[]
          required: false
          description: सपोर्ट होने पर शामिल किया जाने वाला अतिरिक्त public response data।
        - name: max_output_tokens
          type: integer
          required: false
          description: अधिकतम generated tokens।
        - name: max_tool_calls
          type: integer
          required: false
          description: सपोर्ट होने पर अधिकतम built-in tool calls।
        - name: metadata
          type: object
          required: false
          description: Provider को भेजा जाने वाला request metadata।
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: सपोर्टेड models को tools parallel में invoke करने दें।
        - name: previous_response_id
          type: string
          required: false
          description: चुना गया route सपोर्ट करे तो आगे जारी रखने के लिए पिछला response।
        - name: reasoning
          type: object
          required: false
          description: सपोर्टेड models के लिए reasoning configuration।
        - name: store
          type: boolean
          required: false
          description: सपोर्ट होने पर provider-side response storage मांगें।
        - name: text
          type: object
          required: false
          description: Text output और structured-format configuration।
        - name: tool_choice
          type: string | object
          required: false
          description: Tool चयन को नियंत्रित करता है।
        - name: tools
          type: object[]
          required: false
          description: Model के लिए उपलब्ध tools।
        - name: truncation
          type: string
          required: false
          description: Input truncation का व्यवहार।
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
    - title: Request compatibility
      description: SandBase model को चुने गए upstream model में बदल देता है और बाकी request fields बनाए रखता है। Provider का support फिर भी अलग-अलग होता है।
    - title: Sanitized responses
      description: सिर्फ़ public OpenAI response fields और token usage लौटाए जाते हैं। Provider billing, account, routing और अनजान top-level extensions हटा दिए जाते हैं; output item content बना रहता है।
    - title: Streaming
      description: Public response.* और error SSE events sanitize करके आगे भेजे जाते हैं। अनजान private events हटा दिए जाते हैं; गलत data मिलने पर असुरक्षित content भेजने के बजाय stream बंद कर दिया जाता है।
  errors:
    - status: "400"
      description: गलत JSON, model मौजूद नहीं, या गलत provider request।
    - status: "401"
      description: API key मौजूद नहीं या गलत है।
    - status: "402"
      description: Organization या API Key की खर्च सीमा पूरी हो गई।
    - status: "403"
      description: API key scope या upstream permission ने अस्वीकार किया।
    - status: "413"
      description: Upstream provider ने request को बहुत बड़ा मानकर अस्वीकार किया।
    - status: "500"
      description: Prediction lifecycle या organization lookup विफल हुआ।
    - status: "502"
      description: Upstream response को सुरक्षित रूप से parse और sanitize नहीं किया जा सका।
    - status: "503"
      description: Routing विफल हुई या सभी provider candidates खत्म हो गए।
---

<ApiReferencePage />
