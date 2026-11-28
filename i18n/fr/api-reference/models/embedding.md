---
i18nSource: 6a0957a4943c8b1d
title: Embeddings
description: API d'embeddings vectoriels compatible OpenAI. L'entrée, les dimensions, l'encodage et les champs supplémentaires dépendent du modèle et du fournisseur sélectionnés.
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: API d'embeddings vectoriels compatible OpenAI. Les formes d'entrée, les dimensions, l'encodage et les champs supplémentaires dépendent du modèle et du fournisseur sélectionnés.
  groups:
    - title: Corps de la requête
      fields:
        - name: model
          type: string
          required: true
          description: ID du modèle d'embedding, par exemple alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Texte, IDs de tokens, ou lot de textes ou de tableaux d'IDs de tokens à vectoriser
        - name: dimensions
          type: integer
          required: false
          description: Dimension du vecteur de sortie lorsque le modèle sélectionné la prend en charge ; il n'existe pas de liste de dimensions universelle
        - name: encoding_format
          type: string
          required: false
          description: Format d'encodage des embeddings. La prise en charge par le fournisseur détermine si float ou base64 est disponible
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
