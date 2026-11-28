---
i18nSource: 06feb27e20f1b7f5
title: Listar histórico da conta
description: Lista os registros de execução recentes da organização da API key.
aside: false
outline: false
apiReference:
  title: Listar histórico da conta
  operation: Account
  method: GET
  path: /v1/account/history
  description: Lista os registros de execução recentes da organização, do mais novo para o mais antigo. As mensagens de erro são sanitizadas, e os snapshots JSON armazenados são omitidos quando não podem ser decodificados.
  groups:
    - title: Parâmetros de query
      fields:
        - name: model
          type: string
          required: false
          description: Nome lógico exato do modelo.
        - name: api_key_id
          type: string
          required: false
          description: ID exato do recurso de API Key.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Categoria de execução; multimodal inclui imagem, vídeo e áudio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Status de execução agrupado.
        - name: error_type
          type: string
          required: false
          description: Tipo de erro exato, ou unknown para registros sem tipo.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Intervalo móvel de created-at; o padrão é 7d.
        - name: page
          type: integer
          required: false
          description: Número da página, começando em 1.
        - name: page_size
          type: integer
          required: false
          description: Itens por página, de 1 a 100; o padrão é 20.
        - name: request_id
          type: string
          required: false
          description: ID exato de execução da organização. Quando definido, os outros filtros são ignorados e um único resultado é solicitado.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Base de timestamp para uma janela explícita.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Filtro de liquidação; positive e token exigem time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Início inclusivo da janela, usado junto com end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Fim exclusivo da janela; a janela não pode passar de 32 dias.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Restringe as amostras de latência a valores positivos.
        - name: min_latency_ms
          type: integer
          required: false
          description: Latência mínima em milissegundos.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Apenas validação de compatibilidade. Os timestamps permanecem em UTC; a busca exata por request_id ignora este parâmetro.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
