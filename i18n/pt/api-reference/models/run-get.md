---
i18nSource: 2ffb24dad49b9c79
title: Obter uma run assíncrona
description: Consulte uma run assíncrona de modelo ou de API da SandBase e obtenha seu resultado atual ou final.
aside: false
outline: false
apiReference:
  title: Obter uma run assíncrona
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Obtenha o estado atual ou final de uma run assíncrona criada por POST /v1/run.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: id
          type: string
          required: true
          description: Identificador opaco da run retornado por POST /v1/run. Use-o exatamente como retornado; nenhum prefixo é garantido.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Polling {#polling}

Consulte a cada 5–10 segundos para tarefas de mídia ou de API de longa duração. Pare quando `status` for `completed`, `failed` ou `timeout`. Uma resposta não terminal pode omitir `outputs`; trate o ID da run como opaco e não construa uma URL de status diferente.
