---
i18nSource: 06feb27e20f1b7f5
title: Listar historial de la cuenta
description: Lista los registros de ejecución recientes de la organización de la API key.
aside: false
outline: false
apiReference:
  title: Listar historial de la cuenta
  operation: Account
  method: GET
  path: /v1/account/history
  description: Lista los registros de ejecución recientes con ámbito de organización, del más reciente al más antiguo. Los mensajes de error se sanean y las instantáneas JSON almacenadas se omiten cuando no se pueden decodificar.
  groups:
    - title: Parámetros de consulta
      fields:
        - name: model
          type: string
          required: false
          description: Nombre lógico exacto del modelo.
        - name: api_key_id
          type: string
          required: false
          description: ID exacto del recurso de API Key.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Categoría de ejecución; multimodal incluye image, video y audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Estado de ejecución agrupado.
        - name: error_type
          type: string
          required: false
          description: Tipo de error exacto, o unknown para los registros que no tienen uno.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Rango móvil sobre la fecha de creación; por defecto, 7d.
        - name: page
          type: integer
          required: false
          description: Número de página, empezando por 1.
        - name: page_size
          type: integer
          required: false
          description: Elementos por página, de 1 a 100; por defecto, 20.
        - name: request_id
          type: string
          required: false
          description: ID exacto de la ejecución con ámbito de organización. Si se indica, se ignoran los demás filtros y se solicita un único resultado.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Base de marca de tiempo para una ventana explícita.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Filtro de liquidación; positive y token requieren time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Inicio inclusivo de la ventana, junto con end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Fin exclusivo de la ventana; la ventana no puede superar 32 días.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Limita las muestras de latencia a valores positivos.
        - name: min_latency_ms
          type: integer
          required: false
          description: Latencia mínima en milisegundos.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Solo validación de compatibilidad. Las marcas de tiempo siguen en UTC; la búsqueda exacta por request_id ignora este parámetro.
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
