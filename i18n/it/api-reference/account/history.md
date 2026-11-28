---
i18nSource: 06feb27e20f1b7f5
title: Elenca cronologia account
description: Elenca le esecuzioni recenti dell'organizzazione della chiave API.
aside: false
outline: false
apiReference:
  title: Elenca cronologia account
  operation: Account
  method: GET
  path: /v1/account/history
  description: Elenca le esecuzioni recenti nell'ambito dell'organizzazione, dalla più recente. I messaggi di errore vengono ripuliti e gli snapshot JSON salvati vengono omessi quando non è possibile decodificarli.
  groups:
    - title: Parametri di query
      fields:
        - name: model
          type: string
          required: false
          description: Nome logico esatto del modello.
        - name: api_key_id
          type: string
          required: false
          description: ID esatto della risorsa API Key.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Categoria di esecuzione; multimodal include immagini, video e audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Stato di esecuzione raggruppato.
        - name: error_type
          type: string
          required: false
          description: Tipo di errore esatto, oppure unknown per i record che non ne hanno.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Intervallo mobile su created-at; il valore predefinito è 7d.
        - name: page
          type: integer
          required: false
          description: Numero di pagina, a partire da 1.
        - name: page_size
          type: integer
          required: false
          description: Elementi per pagina da 1 a 100; il valore predefinito è 20.
        - name: request_id
          type: string
          required: false
          description: ID esatto dell'esecuzione nell'ambito dell'organizzazione. Se impostato, gli altri filtri vengono ignorati e viene richiesto un solo risultato.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Riferimento temporale per una finestra esplicita.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Filtro di addebito; positive e token richiedono time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Inizio della finestra (incluso), da usare con end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Fine della finestra (esclusa); la finestra non può superare 32 giorni.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Limita i campioni di latenza ai valori positivi.
        - name: min_latency_ms
          type: integer
          required: false
          description: Latenza minima in millisecondi.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Solo validazione di compatibilità. I timestamp restano in UTC; la ricerca esatta per request_id ignora questo parametro.
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
