---
i18nSource: 6a0957a4943c8b1d
title: Embedding'ler
description: OpenAI uyumlu vektör embedding API'si. Girdi, boyutlar, kodlama ve ek alanlar seçilen modele ve sağlayıcıya bağlıdır.
aside: false
outline: false
apiReference:
  title: Embedding'ler
  operation: Models
  method: POST
  path: /v1/embeddings
  description: OpenAI uyumlu vektör embedding API'si. Girdi biçimleri, boyutlar, kodlama ve ek alanlar seçilen modele ve sağlayıcıya bağlıdır.
  groups:
    - title: İstek gövdesi
      fields:
        - name: model
          type: string
          required: true
          description: Embedding model kimliği, örneğin alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Embedding'i oluşturulacak metin, token kimlikleri veya bir metin ya da token kimliği dizisi grubu
        - name: dimensions
          type: integer
          required: false
          description: Seçilen model destekliyorsa çıktı vektörü boyutu; evrensel bir boyut listesi yoktur
        - name: encoding_format
          type: string
          required: false
          description: Embedding kodlama biçimi. float veya base64 kullanılabilirliği sağlayıcı desteğine bağlıdır
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
