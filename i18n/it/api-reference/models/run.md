---
i18nSource: efa205ed7505643c
title: Esegui un modello o una funzionalità API
description: Invia un modello o una funzionalità API di SandBase tramite l'endpoint di esecuzione unificato.
aside: false
outline: false
apiReference:
  title: Esegui un modello o una funzionalità API
  operation: Models
  method: POST
  path: /v1/run
  description: Esegue un modello o una funzionalità API di SandBase abilitata. I campi della richiesta dipendono dalla funzionalità; consulta la pagina di riferimento del modello o dell'API sul sito SandBase per lo schema della funzionalità selezionata.
  groups:
    - title: Body della richiesta
      fields:
        - name: model
          type: string
          required: true
          description: Identificatore del modello logico o della funzionalità API abilitata.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Indicazione della modalità di esecuzione. `auto` usa il valore predefinito configurato per la funzionalità selezionata; gli altri valori richiedono il supporto della funzionalità.
        - name: stream
          type: boolean
          required: false
          description: "Richiede l'output in streaming quando la funzionalità selezionata lo supporta. Equivale a `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Callback HTTPS facoltativo per le attività asincrone di immagine supportate
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Esecuzione e risultati {#execution-and-results}

Le funzionalità sincrone restituiscono una risposta completa nella richiesta originale. Le funzionalità asincrone restituiscono `202 Accepted` con un `id` opaco; esegui il polling di [Ottieni un'esecuzione asincrona](./run-get) finché lo stato non è terminale.

I campi di richiesta e le forme di output specifici di ciascuna funzionalità sono definiti nella pagina del modello o dell'operazione API selezionata. Invia questi campi al primo livello del body JSON, senza racchiuderli in un oggetto `input`. Non dare per scontato che ogni funzionalità accetti gli stessi parametri.

## Callback webhook {#webhook-callbacks}

Imposta `webhook_url` solo per le attività asincrone di immagine, video o audio supportate. SandBase invia l'evento finale dell'esecuzione all'endpoint HTTPS dopo il completamento o l'errore; il callback è un'indicazione di consegna e non sostituisce `GET /v1/run/{id}`. Continua sempre a eseguire il polling dell'endpoint dell'esecuzione per lo stato autorevole e ritenta in modo sicuro quando un callback è in ritardo o duplicato. Le risposte sincrone dei modelli e gli endpoint nativi del provider non usano questo campo di callback.
