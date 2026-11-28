---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Crea, ricevi in streaming e interroga le Interaction dei modelli tramite il protocollo nativo Google.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Crea una Interaction Google nativa. Controlla status anche con HTTP 200; una risposta in_progress va interrogata con polling.
  groups:
    - title: Corpo della richiesta
      fields:
        - name: model
          type: string
          required: true
          description: Nome logico del modello SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Input nativo della Interaction Google.
        - name: stream
          type: boolean
          required: false
          description: Restituisce eventi SSE di Google Interactions, se supportati dal modello.
        - name: background
          type: boolean
          required: false
          description: Invia in modo persistente e restituisce una Interaction interrogabile subito. Non può essere combinato con stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Prosegue da una Interaction upstream mantenendo l'affinità con il provider.
        - name: store
          type: boolean
          required: false
          description: Inoltra invariata la preferenza di archiviazione upstream.
        - name: system_instruction
          type: string
          required: false
          description: Istruzione di sistema nativa.
        - name: tools
          type: array
          required: false
          description: Definizioni native dei tool Google.
        - name: generation_config
          type: object
          required: false
          description: Configurazione di generazione nativa.
        - name: response_format
          type: object | array
          required: false
          description: Formato di risposta richiesto.
        - name: response_modalities
          type: array
          required: false
          description: Modalità di output richieste.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Autenticazione {#authentication}

Usa `x-goog-api-key`, `Authorization: Bearer …` o il parametro di query `key`, in quest'ordine di priorità. Preferisci un header, perché le credenziali nella query string possono finire nei log.

## Modelli supportati {#supported-models}

L'endpoint Interactions non è un percorso generico per ogni modello il cui nome di catalogo inizia con `google/`. Il modello
deve avere una mappatura del provider compatibile con Interactions. Al momento SandBase documenta questi modelli compatibili:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Gli altri modelli Google usano altri endpoint. Ad esempio, Nano Banana Pro e Nano Banana 2 usano
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), non `/v1beta/interactions`. Un modello non supportato fallisce invece di essere instradato
tramite un altro protocollo Google.

## Esito e polling {#success-and-polling}

Gli invii riusciti restituiscono HTTP `200`, anche per il lavoro in background e per le richieste sincrone la cui attesa massima scade. Controlla sempre `status`:

- `completed`, `failed`, `cancelled` e `incomplete` sono stati terminali.
- `in_progress` indica che è ancora in esecuzione. Interroga `GET /v1beta/interactions/{id}`; la risposta può includere quel percorso anche nell'header `Location`.
- `requires_action` è uno stato del protocollo, ma al momento SandBase non espone l'endpoint di conferma dei tool necessario per farlo avanzare.

L'ID di polling è l'`id` dell'Interaction upstream restituito da `POST`, non un ID di previsione SandBase. L'Interaction deve essere recuperata con la stessa API key SandBase che l'ha creata.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Le risposte GET non terminali omettono l'output parziale e l'utilizzo. Le risposte terminali possono includere dati inline di immagini, audio o video e pesare diversi megabyte. Scarica e salva subito i media che ti servono: dopo la scadenza della conservazione upstream, SandBase può restituire solo un fallback terminale con perdita di dati, che contiene struttura e metadati ma non i byte originali dei media.

## Streaming {#streaming}

Imposta `stream: true` nel corpo della richiesta. La risposta è `text/event-stream`; `?alt=sse` non si usa con questo protocollo. I tipi di evento e di delta sono aperti e vengono inoltrati senza una allowlist fissa, quindi i client devono tollerare valori sconosciuti. Una volta scritti gli header dello streaming, gli errori arrivano come evento `error` invece che con uno stato HTTP diverso.

Lo streaming dipende dal modello. Un provider upstream può rifiutare `stream: true` anche se il protocollo lo supporta.

## Limiti attuali {#current-limits}

Al momento SandBase espone solo create e get:

- Le Interaction di tipo Agent vengono rifiutate; usa `model`.
- `background: true` e `stream: true` non possono essere combinati.
- List, delete e cancel delle Interaction non sono esposti.
- La consegna tramite URI e la riconnessione dello stream tramite GET non sono esposte.
- `previous_interaction_id` richiede una mappatura di affinità con il provider attiva e il supporto upstream. Se l'affinità non è disponibile, SandBase fallisce invece di cambiare provider in modo silenzioso.

Gli errori usano l'envelope Google `{ "error": { "code", "message", "status" } }`. Considera stabile lo stato HTTP; il testo upstream ripulito in `message` può cambiare.
