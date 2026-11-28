---
i18nSource: 6a0957a4943c8b1d
title: Embedding
description: API di embedding vettoriali compatibile con OpenAI. Input, dimensioni, codifica e campi aggiuntivi dipendono dal modello e dal provider selezionati.
aside: false
outline: false
apiReference:
  title: Embedding
  operation: Models
  method: POST
  path: /v1/embeddings
  description: API di embedding vettoriali compatibile con OpenAI. Le forme di input, le dimensioni, la codifica e i campi aggiuntivi dipendono dal modello e dal provider selezionati.
  groups:
    - title: Corpo della richiesta
      fields:
        - name: model
          type: string
          required: true
          description: ID del modello di embedding, ad esempio alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Testo, ID di token oppure un batch di testi o array di ID di token da trasformare in embedding
        - name: dimensions
          type: integer
          required: false
          description: Dimensione del vettore di output, se supportata dal modello selezionato; non esiste un elenco di dimensioni universale
        - name: encoding_format
          type: string
          required: false
          description: Formato di codifica dell'embedding. Il supporto del provider determina se è disponibile float o base64
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
