---
i18nSource: 270917aea416aa76
title: Listar artefatos da Session
description: Liste os artefatos de saída capturados de uma Session com paginação por cursor, IDs opacos, tamanhos de arquivo e links de download.
aside: false
outline: false
apiReference:
  title: Listar artefatos da Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Lista as saídas geradas imutáveis desta Session. Os IDs de artefato são handles opacos com escopo de Session; passe o ID retornado sem alterações para o endpoint de download. Parâmetros de consulta desconhecidos ou repetidos retornam 400.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: session_id
          type: string
          required: true
          description: ID da Session (prefixo ses_).
    - title: Parâmetros de consulta
      fields:
        - name: limit
          type: integer
          required: false
          description: Tamanho da página, de 1 a 100; valores inválidos retornam 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc ou desc.
          default: desc
        - name: after
          type: string
          required: false
          description: ID do artefato retornado como last_id na página anterior. Mantenha a mesma ordem ao continuar.
    - title: Objeto Artifact
      fields:
        - name: object
          type: string
          required: true
          description: Sempre agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Handle opaco art_. Não o construa nem o decodifique.
        - name: session_id
          type: string
          required: true
          description: ID da Session proprietária.
        - name: path
          type: string
          required: true
          description: Caminho da saída gerada em /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Tamanho do artefato em bytes.
        - name: created_at
          type: integer
          required: true
          description: Data de criação em segundos Unix.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

O handle do exemplo é ilustrativo. Use o `id` retornado pela sua própria requisição em [Baixar artefato](./download-artifact). Quando `has_more` for true, envie `after=last_id` para obter a próxima página. `first_id` e `last_id` são null para uma lista vazia. Não há um endpoint GET separado para metadados de artefatos.

