---
i18nSource: 6a0957a4943c8b1d
title: Embeddings
description: 與 OpenAI 相容的向量嵌入 API。輸入、維度、編碼與額外欄位仍取決於所選的模型與供應商。
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: 與 OpenAI 相容的向量嵌入 API。輸入形式、維度、編碼與其他欄位仍取決於所選的模型與供應商。
  groups:
    - title: 請求本文
      fields:
        - name: model
          type: string
          required: true
          description: 嵌入模型 ID，例如 alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: 要嵌入的文字、token ID，或一批文字或 token ID 陣列
        - name: dimensions
          type: integer
          required: false
          description: 所選模型支援時的輸出向量維度；沒有通用的維度清單
        - name: encoding_format
          type: string
          required: false
          description: 嵌入編碼格式。是否可使用 float 或 base64 取決於供應商支援
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
