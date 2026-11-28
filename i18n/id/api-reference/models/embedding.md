---
i18nSource: 6a0957a4943c8b1d
title: Embeddings
description: API vector embeddings yang kompatibel dengan OpenAI. Input, dimensi, encoding, dan field tambahan tetap bergantung pada model dan penyedia yang dipilih.
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: API vector embeddings yang kompatibel dengan OpenAI. Bentuk input, dimensi, encoding, dan field tambahan tetap bergantung pada model dan penyedia yang dipilih.
  groups:
    - title: Body permintaan
      fields:
        - name: model
          type: string
          required: true
          description: ID model embedding, misalnya alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Teks, token ID, atau batch teks atau array token ID yang akan di-embed
        - name: dimensions
          type: integer
          required: false
          description: Dimensi vektor output jika didukung oleh model yang dipilih; tidak ada daftar dimensi universal
        - name: encoding_format
          type: string
          required: false
          description: Format encoding embedding. Dukungan penyedia menentukan apakah float atau base64 tersedia
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
