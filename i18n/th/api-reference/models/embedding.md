---
i18nSource: 6a0957a4943c8b1d
title: Embeddings
description: API vector embedding ที่เข้ากันได้กับ OpenAI อินพุต จำนวนมิติ การเข้ารหัส และฟิลด์เพิ่มเติม ขึ้นอยู่กับโมเดลและผู้ให้บริการที่เลือก
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: API vector embedding ที่เข้ากันได้กับ OpenAI รูปแบบอินพุต จำนวนมิติ การเข้ารหัส และฟิลด์เพิ่มเติม ขึ้นอยู่กับโมเดลและผู้ให้บริการที่เลือก
  groups:
    - title: เนื้อหาคำขอ
      fields:
        - name: model
          type: string
          required: true
          description: ID ของโมเดล embedding เช่น alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: ข้อความ, token ID หรือชุดข้อความหรืออาร์เรย์ token ID ที่จะสร้าง embedding
        - name: dimensions
          type: integer
          required: false
          description: จำนวนมิติของเวกเตอร์เอาต์พุตเมื่อโมเดลที่เลือกรองรับ ไม่มีรายการจำนวนมิติที่ใช้ได้กับทุกโมเดล
        - name: encoding_format
          type: string
          required: false
          description: รูปแบบการเข้ารหัสของ embedding การรองรับของผู้ให้บริการเป็นตัวกำหนดว่าใช้ float หรือ base64 ได้หรือไม่
  examples:
    - label: HTTP
      language: http
      code: |-
        POST https://api.sandbase.ai/v1/embeddings
        Authorization: Bearer sk-your-api-key
        Content-Type: application/json

        {"model":"alibaba/text-embedding-v4","input":"SandBase provides a unified API for AI models, agents, and developer tools.","dimensions":1024,"encoding_format":"float"}
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(
            api_key="sk-YOUR_KEY",
            base_url="https://api.sandbase.ai/v1",
        )

        response = client.embeddings.create(
            model="alibaba/text-embedding-v4",
            input="SandBase provides a unified API for AI models, agents, and developer tools.",
            dimensions=1024,
            encoding_format="float",
        )

        embedding = response.data[0].embedding
        print(f"Dimensions: {len(embedding)}")
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from 'openai';

        const client = new OpenAI({
          apiKey: 'sk-YOUR_KEY',
          baseURL: 'https://api.sandbase.ai/v1',
        });

        const response = await client.embeddings.create({
          model: 'alibaba/text-embedding-v4',
          input: 'SandBase provides a unified API for AI models, agents, and developer tools.',
          dimensions: 1024,
          encoding_format: 'float',
        });

        console.log(response.data[0].embedding.length);
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "embedding",
            "index": 0,
            "embedding": [0.0123, -0.0045, 0.0312]
          }
        ],
        "model": "alibaba/text-embedding-v4",
        "usage": {
          "prompt_tokens": 16,
          "total_tokens": 16
        }
      }
---

<ApiReferencePage />
