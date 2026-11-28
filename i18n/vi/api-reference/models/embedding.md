---
i18nSource: 6a0957a4943c8b1d
title: Embeddings
description: API vector embedding tương thích OpenAI. Input, số chiều, encoding và các trường bổ sung phụ thuộc vào model và nhà cung cấp được chọn.
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: API vector embedding tương thích OpenAI. Dạng input, số chiều, encoding và các trường bổ sung phụ thuộc vào model và nhà cung cấp được chọn.
  groups:
    - title: Body của request
      fields:
        - name: model
          type: string
          required: true
          description: ID của model embedding, ví dụ alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Văn bản, token ID, hoặc một lô văn bản hay mảng token ID cần embedding
        - name: dimensions
          type: integer
          required: false
          description: Số chiều của vector output khi model được chọn hỗ trợ; không có danh sách số chiều chung cho mọi model
        - name: encoding_format
          type: string
          required: false
          description: Định dạng encoding của embedding. Khả năng hỗ trợ của nhà cung cấp quyết định float hay base64 có dùng được hay không
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
