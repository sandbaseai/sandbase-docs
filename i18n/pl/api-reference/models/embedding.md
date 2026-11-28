---
i18nSource: 6a0957a4943c8b1d
title: Embeddingi
description: API wektorowych embeddingów zgodne z OpenAI. Wejście, wymiary, kodowanie i dodatkowe pola zależą od wybranego modelu i dostawcy.
aside: false
outline: false
apiReference:
  title: Embeddingi
  operation: Models
  method: POST
  path: /v1/embeddings
  description: API wektorowych embeddingów zgodne z OpenAI. Formy wejścia, wymiary, kodowanie i dodatkowe pola zależą od wybranego modelu i dostawcy.
  groups:
    - title: Treść żądania
      fields:
        - name: model
          type: string
          required: true
          description: Identyfikator modelu embeddingów, na przykład alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Tekst, identyfikatory tokenów lub partia tekstów albo tablic identyfikatorów tokenów do osadzenia
        - name: dimensions
          type: integer
          required: false
          description: Wymiar wektora wyjściowego, jeśli wybrany model go obsługuje; nie ma uniwersalnej listy wymiarów
        - name: encoding_format
          type: string
          required: false
          description: Format kodowania embeddingu. Od obsługi dostawcy zależy, czy dostępny jest float, czy base64
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
