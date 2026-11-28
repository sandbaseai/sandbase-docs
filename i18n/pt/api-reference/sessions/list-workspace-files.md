---
i18nSource: 06a65ded83bf9438
title: Listar arquivos do workspace
description: Liste os arquivos atuais do workspace de uma Session, com caminho, tamanho e paginação. Este endpoint somente leitura retorna metadados de arquivos.
aside: false
outline: false
apiReference:
  title: Listar arquivos do workspace
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Lista os caminhos e tamanhos atuais dos arquivos em um diretório do workspace de uma Session. É uma listagem apenas de metadados, não o histórico de anexos nem o conteúdo de artifacts. Parâmetros de query desconhecidos ou repetidos retornam 400.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: session_id
          type: string
          required: true
          description: ID da Session (prefixo ses_).
    - title: Parâmetros de query
      fields:
        - name: path
          type: string
          required: false
          description: Diretório absoluto /workspace ou um diretório normalizado abaixo dele. Máximo de 4096 bytes; sem travessia de diretórios, barras invertidas ou barra final.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Tamanho da página, de 1 a 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Ordem de classificação por caminho: asc ou desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Valor next opaco da resposta anterior. Omita na primeira página; não envie uma string vazia. Mantenha path, order e limit inalterados.
    - title: Campos da resposta
      fields:
        - name: object
          type: string
          required: true
          description: Sempre page.
        - name: data
          type: array
          required: true
          description: Arquivos do diretório atual, cada um com path e size_bytes. Esta não é uma listagem recursiva.
        - name: next
          type: string | null
          required: true
          description: Passe este valor como page para continuar; null no final.
        - name: has_more
          type: boolean
          required: true
          description: Indica se há outra página disponível.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

As leituras do workspace podem retornar `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` ou `workspace_unavailable`. Se o cursor for inválido, recomece pela primeira página. Use [Artifacts](./list-artifacts) para encontrar saídas geradas que podem ser baixadas.
