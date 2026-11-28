---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Registra e gestisci i webhook SandBase per gli eventi asincroni dei modelli.
---

# Webhooks {#webhooks}

SandBase supporta due modalità di callback in uscita:

- I **webhook registrati** hanno come ambito la tua organizzazione, si iscrivono agli eventi asincroni dei Model e includono una firma HMAC `X-Signature`.
- Le **callback dei modelli per singolo task** usano `webhook_url` su una singola richiesta asincrona di immagini, video o audio. Non richiedono registrazione e non includono `X-Signature`.

Entrambe le modalità usano una consegna at-least-once. Rendi gli handler idempotenti usando l'ID dell'evento.

## Registrare un webhook {#register-a-webhook}

L'API Events è la superficie pubblica basata su API key:

```text
POST https://api.sandbase.ai/events/webhooks
```

Puoi anche creare e gestire i webhook dalla [pagina Webhooks della Console](https://www.sandbase.ai/console/webhooks).

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| Campo | Tipo | Obbligatorio | Descrizione |
|---|---|---:|---|
| `name` | string | Sì | Un nome leggibile. |
| `url` | string | Sì | Un endpoint HTTP(S) valido. In produzione usa HTTPS. |
| `resourceType` | `model` | Sì | Seleziona gli eventi asincroni dei Model descritti sotto. `model` è l'unico valore supportato. |
| `events` | string[] | No | Vuoto o omesso significa tutti gli eventi attuali e futuri del tipo di risorsa selezionato. |
| `enabled` | boolean | No | Predefinito `true`. |
| `signatureSecret` | string | No | Ometti questo campo per lasciare che SandBase generi un secret ad alta entropia. I client esistenti possono continuare a fornire un proprio valore non vuoto. |

I tipi di risorsa `session`, `sandbox` e `template` sono dismessi: creare un webhook con uno di questi restituisce HTTP 400. Le registrazioni esistenti di questi tipi vengono elencate per consentirne la pulizia: un `PATCH` su di esse restituisce HTTP 400 a meno che la stessa richiesta non cambi `resourceType` in `model` (e la sottoscrizione risultante sia valida), quindi eliminale o convertile in `model`. Le sottoscrizioni `model` sono disponibili solo per gli eventi finali asincroni di immagini, video e audio elencati sotto. L'API rifiuta eventi di altri tipi di risorsa e nomi di eventi sconosciuti.

### Risposta di successo {#successful-response}

L'API Events restituisce direttamente il webhook registrato. Il `signatureSecret` definitivo è incluso solo in questa risposta di creazione. Conservalo subito in modo sicuro: le risposte di elenco e modifica non lo restituiscono mai e non può essere recuperato in seguito.

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

La [pagina Webhooks della Console](https://www.sandbase.ai/console/webhooks) mostra il secret generato una sola volta dopo la registrazione e ti chiede di salvarlo prima di chiudere la finestra di dialogo.

### Elencare, modificare ed eliminare {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Usa la stessa autenticazione con API key. Un `PATCH` può includere uno o più tra `name`, `url`, `resourceType`, `events` e `enabled`; i campi omessi restano invariati. La sottoscrizione risultante completa di `resourceType` ed `events` deve essere valida. Un array `events` vuoto significa comunque tutti gli eventi di quel tipo di risorsa.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` non può essere visualizzato né modificato tramite `PATCH`; una richiesta che lo contiene viene rifiutata. Se perdi il secret, elimina e ricrea il webhook. Puoi anche visualizzare, modificare, abilitare o disabilitare ed eliminare le registrazioni dalla [pagina Webhooks della Console](https://www.sandbase.ai/console/webhooks).

`GET` restituisce un array JSON di webhook (senza `signatureSecret`), `PATCH` restituisce il webhook aggiornato e `DELETE`
restituisce `204 No Content`.

### Autenticazione ed errori {#authentication-and-errors}

L'API Events accetta la API key come `Authorization: Bearer $SANDBASE_API_KEY` oppure `X-API-Key: $SANDBASE_API_KEY`. Se
li invii entrambi, viene usato l'header Bearer.

Gli errori usano un proprio body, con lo stato HTTP ripetuto in `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Gestisci i casi in base allo stato HTTP. `401` significa che la chiave è mancante, non valida o revocata; `400` significa che il body della richiesta o
la sottoscrizione non è valida; `404` (`webhook not found`) significa che il webhook non esiste nella tua organizzazione.

## Callback del modello per singolo task {#per-task-model-callback}

Per un singolo task asincrono di immagini, video o audio, aggiungi `webhook_url` a `POST /v1/run` invece di registrare un nuovo webhook:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

Il campo viene analizzato e validato solo quando il modello selezionato è di immagini, video o audio e la richiesta si risolve in un'esecuzione asincrona. In questo caso deve essere una stringa non vuota contenente un URL HTTPS pubblico valido e sicuro; in caso contrario la richiesta restituisce HTTP 400. Per richieste sincrone, in streaming, LLM o altre richieste non supportate, SandBase ignora `webhook_url` indipendentemente dal suo valore JSON: non pianifica alcuna callback, non memorizza alcun URL di callback e non inoltra il campo al provider del modello. Omettere il campo mantiene il flusso di polling esistente.

La destinazione deve essere un URL HTTPS pubblico. SandBase invia lo stesso envelope finale dei Model documentato sotto, con `Content-Type: application/json` e `X-Event-ID`, per completed, failed, timeout o cancelled. Può ritentare una consegna non riuscita, quindi deduplica per `id` o `X-Event-ID` e restituisci rapidamente un 2xx.

Una callback per singolo task non ha un secret SandBase condiviso e quindi **non** include `X-Signature`. Se il tuo endpoint richiede la verifica HMAC, ometti `webhook_url` e registra invece un Model Webhook dell'organizzazione. Puoi inserire nella query dell'URL HTTPS un token di capability opaco generato dal tuo sistema e validarlo nel tuo endpoint. Tratta quell'URL come dato sensibile.

Per ogni task asincrono di un modello, la scelta della destinazione è esclusiva. Se la richiesta include un `webhook_url` valido, SandBase invia l'evento finale di quella Prediction solo all'URL del task e salta tutti i Model Webhook registrati dall'organizzazione per quell'evento. Se la richiesta omette `webhook_url`, i Model Webhook registrati dall'organizzazione continuano a ricevere normalmente gli eventi corrispondenti. Una consegna per singolo task non riuscita viene ritentata sullo stesso URL del task e non ripiega mai su un webhook registrato. Questa priorità non crea, sostituisce, disabilita né modifica alcuna registrazione e non influisce sugli altri eventi dei Model.

## Tipi di evento {#event-types}

### Generazione dei modelli {#model-generation}

I webhook dei Model sono disponibili solo per la generazione asincrona di immagini, video e audio. Non vengono emessi per richieste sincrone di immagini/video/audio né per alcuna richiesta LLM sincrona: quei risultati vengono restituiti dalla risposta HTTP originale.

| Evento | Descrizione |
|---|---|
| `model.generation.completed` | Una generazione asincrona di immagini, video o audio è stata completata. |
| `model.generation.failed` | Una generazione asincrona di immagini, video o audio non è riuscita. |
| `model.generation.timeout` | Una generazione asincrona di immagini, video o audio è andata in timeout. |
| `model.generation.cancelled` | Una generazione asincrona di immagini, video o audio è stata annullata. |

## Payload di consegna {#delivery-payload}

SandBase invia `Content-Type: application/json` e il seguente envelope JSON. `data` dipende dall'evento e può acquisire nuovi campi nel tempo.

### Esempio di completamento di un Model {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

Gli eventi di errore e di timeout omettono gli output e contengono solo la categoria di errore sanificata.

| Campo | Descrizione |
|---|---|
| `id` | ID univoco dell'evento. Usalo, oppure `X-Event-ID`, come chiave di idempotenza. |
| `resourceType` | `model`. |
| `resourceID` | L'ID della Prediction interessata. |
| `type` | Tipo di evento dalla tabella precedente. |
| `data` | Dati specifici dell'evento. |
| `createdAt` | Data e ora di creazione dell'evento in RFC 3339 UTC. |

## Verificare la firma di un webhook registrato {#verify-a-registered-webhook-signature}

Ogni consegna di un webhook registrato include questi header:

| Header | Valore |
|---|---|
| `X-Event-ID` | L'`id` del payload. |
| `X-Signature` | HMAC-SHA256 esadecimale minuscolo del body grezzo della richiesta, con chiave `signatureSecret`. |

Verifica la firma sui byte grezzi della richiesta prima di analizzare il JSON. Le callback per singolo task con `webhook_url` non includono questo header e non possono usare questo flusso di verifica. Gli handler seguenti sono per i webhook registrati: prima verificano, poi analizzano, usano `id` come chiave di idempotenza e passano il lavoro a una funzione asincrona. Sostituisci la chiamata segnaposto alla coda con una tua coda o un tuo worker persistente.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

L'input dell'HMAC è esattamente il body grezzo. Non chiamare un parser JSON né serializzare di nuovo il payload prima di calcolarlo.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Comportamento della consegna {#delivery-behavior}

- Una risposta nell'intervallo `2xx` entro 10 secondi è considerata riuscita.
- Errori di rete, timeout e risposte non 2xx sono considerati fallimenti. Il dispatcher di eventi esistente può ritentare le consegne non riuscite; i ricevitori devono tollerare consegne duplicate.
- Restituisci una risposta 2xx dopo aver accettato l'evento in modo persistente, poi esegui il lavoro lento in modo asincrono. Gli esempi usano la deduplicazione in memoria solo per restare eseguibili; i ricevitori in produzione devono sostituirla con una chiave univoca nel database o una coda persistente. Non presumere una consegna exactly-once né un ordinamento degli eventi.
