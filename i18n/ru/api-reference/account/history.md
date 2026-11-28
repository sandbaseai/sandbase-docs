---
i18nSource: 06feb27e20f1b7f5
title: Список истории аккаунта
description: Список последних записей о выполнении для организации API-ключа.
aside: false
outline: false
apiReference:
  title: Список истории аккаунта
  operation: Account
  method: GET
  path: /v1/account/history
  description: Список последних записей о выполнении в рамках организации, сначала новые. Сообщения об ошибках очищаются, а сохранённые JSON-снимки опускаются, если их не удаётся декодировать.
  groups:
    - title: Параметры запроса
      fields:
        - name: model
          type: string
          required: false
          description: Точное логическое имя модели.
        - name: api_key_id
          type: string
          required: false
          description: Точный ID ресурса API Key.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Категория выполнения; multimodal включает image, video и audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Сгруппированный статус выполнения.
        - name: error_type
          type: string
          required: false
          description: Точный тип ошибки или unknown для записей без него.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Скользящий диапазон по времени создания; по умолчанию 7d.
        - name: page
          type: integer
          required: false
          description: Номер страницы, начиная с 1.
        - name: page_size
          type: integer
          required: false
          description: Элементов на странице, от 1 до 100; по умолчанию 20.
        - name: request_id
          type: string
          required: false
          description: Точный ID выполнения в рамках организации. Если указан, остальные фильтры игнорируются и запрашивается один результат.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Основа временных меток для явно заданного окна.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Фильтр по расчёту; positive и token требуют time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Начало окна (включительно), используется вместе с end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Конец окна (не включительно); окно не может превышать 32 дня.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Учитывать только положительные значения задержки.
        - name: min_latency_ms
          type: integer
          required: false
          description: Минимальная задержка в миллисекундах.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Только для проверки совместимости. Временные метки остаются в UTC; точный поиск по request_id игнорирует этот параметр.
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
