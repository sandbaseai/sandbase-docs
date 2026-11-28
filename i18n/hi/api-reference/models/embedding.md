---
i18nSource: 6a0957a4943c8b1d
title: एम्बेडिंग
description: OpenAI-compatible vector embeddings API। Input, dimensions, encoding और अतिरिक्त fields चुने गए model और provider पर निर्भर करते हैं।
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: OpenAI-compatible vector embeddings API। Input के रूप, dimensions, encoding और अतिरिक्त fields चुने गए model और provider पर निर्भर करते हैं।
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: Embedding model ID, उदाहरण के लिए alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: embed करने के लिए text, token IDs, या texts अथवा token-ID arrays का batch
        - name: dimensions
          type: integer
          required: false
          description: चुने गए model द्वारा समर्थित होने पर output vector dimension; कोई सार्वभौमिक dimension सूची नहीं है
        - name: encoding_format
          type: string
          required: false
          description: Embedding encoding format। float या base64 उपलब्ध है या नहीं, यह provider support तय करता है
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
