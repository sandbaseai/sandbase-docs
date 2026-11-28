---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Invoque capacidades de API habilitadas no catálogo pelos caminhos qualificados pelo fornecedor.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Resolva uma capacidade habilitada do catálogo chamada vendor/upstream_path e execute um objeto JSON pelo pipeline unificado da SandBase. GET também é suportado para capacidades que o utilizam.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: vendor
          type: string
          required: true
          description: Primeiro segmento do nome da capacidade.
        - name: upstream_path
          type: string
          required: true
          description: Caminho restante
          including literal slash-separated segments when present.: null
    - title: Corpo da requisição
      fields:
        - name: model
          type: string
          required: false
          description: Omita para usar a identidade vendor/path derivada da URL. Se informado
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Campos definidos pelo schema ativo da capacidade selecionada.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

A URL resolve um modelo habilitado chamado `vendor/upstream_path`. Use o nome exato qualificado pelo fornecedor retornado pela [API de Models](./). Nomes de capacidades aninhados permanecem como segmentos literais do caminho, e não como barras codificadas em percentual.

POST aceita apenas um objeto JSON. Um corpo POST vazio é permitido e se comporta como um objeto contendo o modelo derivado da URL. GET usa um corpo vazio. Os campos da resposta e o comportamento síncrono ou assíncrono dependem da capacidade selecionada; consulte resultados assíncronos por meio de `GET /v1/run/{id}`.
