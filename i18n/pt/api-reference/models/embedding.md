---
i18nSource: 6a0957a4943c8b1d
title: Embeddings
description: API de embeddings vetoriais compatível com a OpenAI. Entrada, dimensões, codificação e campos extras dependem do modelo e do provedor selecionados.
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: API de embeddings vetoriais compatível com a OpenAI. Formatos de entrada, dimensões, codificação e campos adicionais dependem do modelo e do provedor selecionados.
  groups:
    - title: Corpo da requisição
      fields:
        - name: model
          type: string
          required: true
          description: ID do modelo de embedding, por exemplo alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Texto, IDs de token ou um lote de textos ou arrays de IDs de token para gerar embeddings
        - name: dimensions
          type: integer
          required: false
          description: Dimensão do vetor de saída, quando suportada pelo modelo selecionado; não existe uma lista universal de dimensões
        - name: encoding_format
          type: string
          required: false
          description: Formato de codificação do embedding. O suporte do provedor determina se float ou base64 está disponível
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
