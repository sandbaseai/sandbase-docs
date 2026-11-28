---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: SandBase-Webhooks für asynchrone Modell-Events registrieren und verwalten.
---

# Webhooks {#webhooks}

SandBase unterstützt zwei Modi für ausgehende Callbacks:

- **Registrierte Webhooks** gelten für deine Organisation, abonnieren asynchrone Modell-Events und enthalten eine HMAC-`X-Signature`.
- **Modell-Callbacks pro Aufgabe** verwenden `webhook_url` bei einer einzelnen asynchronen Bild-, Video- oder Audioanfrage. Sie erfordern keine Registrierung und enthalten keine `X-Signature`.

Beide Modi verwenden At-least-once-Zustellung. Mach deine Handler mithilfe der Event-ID idempotent.

## Einen Webhook registrieren {#register-a-webhook}

Die Events API ist die öffentliche Schnittstelle für API-Schlüssel:

```text
POST https://api.sandbase.ai/events/webhooks
```

Du kannst Webhooks auch auf der [Webhooks-Seite der Console](https://www.sandbase.ai/console/webhooks) erstellen und verwalten.

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

| Feld | Typ | Erforderlich | Beschreibung |
|---|---|---:|---|
| `name` | string | Ja | Ein lesbarer Name. |
| `url` | string | Ja | Ein gültiger HTTP(S)-Endpunkt. Verwende in Produktion HTTPS. |
| `resourceType` | `model` | Ja | Wählt die unten aufgeführten asynchronen Modell-Events aus. `model` ist der einzige unterstützte Wert. |
| `events` | string[] | Nein | Leer oder weggelassen bedeutet alle aktuellen und künftigen Events des gewählten Ressourcentyps. |
| `enabled` | boolean | Nein | Standard ist `true`. |
| `signatureSecret` | string | Nein | Lass dieses Feld weg, damit SandBase ein Secret mit hoher Entropie erzeugt. Bestehende Clients können weiterhin einen eigenen, nicht leeren Wert angeben. |

Die Ressourcentypen `session`, `sandbox` und `template` sind ausgemustert: Das Erstellen eines Webhooks mit einem davon liefert HTTP 400. Bestehende Registrierungen dieser Typen werden zum Aufräumen aufgelistet: Ein `PATCH` darauf liefert HTTP 400, sofern dieselbe Anfrage `resourceType` nicht auf `model` ändert (und das resultierende Abonnement gültig ist). Lösche sie also oder stelle sie auf `model` um. `model`-Abonnements sind nur für die unten aufgeführten finalen Events asynchroner Bild-, Video- und Audioaufgaben verfügbar. Die API lehnt Events anderer Ressourcentypen und unbekannte Event-Namen ab.

### Erfolgreiche Antwort {#successful-response}

Die Events API gibt den registrierten Webhook direkt zurück. Das endgültige `signatureSecret` ist nur in dieser Antwort auf das Erstellen enthalten. Speichere es jetzt sicher: Listen- und Bearbeitungsantworten geben es nie zurück, und es lässt sich später nicht wiederherstellen.

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

Die [Webhooks-Seite der Console](https://www.sandbase.ai/console/webhooks) zeigt das erzeugte Secret nach der Registrierung einmal an und verlangt, dass du es speicherst, bevor du den Dialog schließt.

### Auflisten, bearbeiten und löschen {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Verwende dieselbe Authentifizierung per API-Schlüssel. Ein `PATCH` kann eines oder mehrere der Felder `name`, `url`, `resourceType`, `events` und `enabled` enthalten; weggelassene Felder bleiben unverändert. Das vollständige resultierende Abonnement aus `resourceType` und `events` muss gültig sein. Ein leeres `events`-Array bedeutet weiterhin alle Events dieses Ressourcentyps.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` lässt sich über `PATCH` weder anzeigen noch ändern; eine Anfrage, die es enthält, wird abgelehnt. Geht das Secret verloren, lösche den Webhook und lege ihn neu an. Du kannst Registrierungen auch auf der [Webhooks-Seite der Console](https://www.sandbase.ai/console/webhooks) ansehen, bearbeiten, aktivieren oder deaktivieren und löschen.

`GET` liefert ein JSON-Array von Webhooks (ohne `signatureSecret`), `PATCH` liefert den aktualisierten Webhook und `DELETE`
liefert `204 No Content`.

### Authentifizierung und Fehler {#authentication-and-errors}

Die Events API akzeptiert den API-Schlüssel als `Authorization: Bearer $SANDBASE_API_KEY` oder `X-API-Key: $SANDBASE_API_KEY`. Werden
beide gesendet, wird der Bearer-Header verwendet.

Fehler haben einen eigenen Body, in dem der HTTP-Status in `code` wiederholt wird:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Verzweige anhand des HTTP-Status. `401` bedeutet, dass der Schlüssel fehlt, ungültig oder widerrufen ist; `400` bedeutet, dass der Request-Body oder
das Abonnement ungültig ist; `404` (`webhook not found`) bedeutet, dass der Webhook in deiner Organisation nicht existiert.

## Modell-Callback pro Aufgabe {#per-task-model-callback}

Für eine einzelne asynchrone Bild-, Video- oder Audioaufgabe fügst du `webhook_url` zu `POST /v1/run` hinzu, statt einen neuen Webhook zu registrieren:

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

Das Feld wird nur geparst und validiert, wenn das gewählte Modell ein Bild-, Video- oder Audiomodell ist und die Anfrage asynchron ausgeführt wird. In diesem Fall muss es ein nicht leerer String mit einer gültigen, sicheren öffentlichen HTTPS-URL sein; andernfalls liefert die Anfrage HTTP 400. Bei synchronen, Streaming-, LLM- oder anderen nicht unterstützten Anfragen ignoriert SandBase `webhook_url` unabhängig vom JSON-Wert: Es plant keinen Callback, speichert keine Callback-URL und leitet das Feld nicht an den Modellanbieter weiter. Lässt du das Feld weg, bleibt der bestehende Polling-Ablauf erhalten.

Das Ziel muss eine öffentliche HTTPS-URL sein. SandBase sendet für completed, failed, timeout oder cancelled denselben unten dokumentierten finalen Modell-Envelope mit `Content-Type: application/json` und `X-Event-ID`. Eine fehlgeschlagene Zustellung kann wiederholt werden, dedupliziere also anhand von `id` oder `X-Event-ID` und antworte schnell mit 2xx.

Ein Callback pro Aufgabe hat kein gemeinsames SandBase-Secret und enthält daher **keine** `X-Signature`. Wenn dein Endpunkt eine HMAC-Verifizierung erfordert, lass `webhook_url` weg und registriere stattdessen einen Modell-Webhook für die Organisation. Du kannst ein opakes, von deinem eigenen System erzeugtes Capability-Token in die Query der HTTPS-URL setzen und es an deinem Endpunkt validieren. Behandle diese URL als sensibel.

Für jede asynchrone Modellaufgabe ist die Zielauswahl exklusiv. Enthält die Anfrage eine gültige `webhook_url`, sendet SandBase das finale Event dieser Prediction nur an die URL der Aufgabe und überspringt für dieses Event alle registrierten Modell-Webhooks der Organisation. Lässt die Anfrage `webhook_url` weg, erhalten registrierte Modell-Webhooks der Organisation passende Events wie gewohnt. Schlägt eine Zustellung pro Aufgabe fehl, wird dieselbe Aufgaben-URL erneut versucht, ohne je auf einen registrierten Webhook auszuweichen. Diese Priorität erstellt, ersetzt, deaktiviert oder ändert keine Registrierung und wirkt sich nicht auf andere Modell-Events aus.

## Event-Typen {#event-types}

### Modellgenerierung {#model-generation}

Modell-Webhooks gibt es nur für asynchrone Bild-, Video- und Audiogenerierung. Für synchrone Bild-/Video-/Audioanfragen oder synchrone LLM-Anfragen werden sie nicht ausgelöst: Deren Ergebnisse kommen in der ursprünglichen HTTP-Antwort zurück.

| Event | Beschreibung |
|---|---|
| `model.generation.completed` | Eine asynchrone Bild-, Video- oder Audiogenerierung wurde abgeschlossen. |
| `model.generation.failed` | Eine asynchrone Bild-, Video- oder Audiogenerierung ist fehlgeschlagen. |
| `model.generation.timeout` | Bei einer asynchronen Bild-, Video- oder Audiogenerierung ist das Zeitlimit abgelaufen. |
| `model.generation.cancelled` | Eine asynchrone Bild-, Video- oder Audiogenerierung wurde abgebrochen. |

## Zustellungs-Payload {#delivery-payload}

SandBase sendet `Content-Type: application/json` und den folgenden JSON-Envelope. `data` ist eventspezifisch und kann im Lauf der Zeit weitere Felder erhalten.

### Beispiel für einen abgeschlossenen Modell-Run {#model-completion-example}

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

Fehler- und Timeout-Events enthalten keine Ausgaben, sondern nur die bereinigte Fehlerkategorie.

| Feld | Beschreibung |
|---|---|
| `id` | Eindeutige Event-ID. Verwende sie oder `X-Event-ID` als Idempotenzschlüssel. |
| `resourceType` | `model`. |
| `resourceID` | Die betroffene Prediction-ID. |
| `type` | Event-Typ aus der Tabelle oben. |
| `data` | Eventspezifische Daten. |
| `createdAt` | Erstellungszeit des Events in RFC 3339 UTC. |

## Signatur eines registrierten Webhooks prüfen {#verify-a-registered-webhook-signature}

Jede Zustellung eines registrierten Webhooks enthält diese Header:

| Header | Wert |
|---|---|
| `X-Event-ID` | Die `id` der Payload. |
| `X-Signature` | Hexadezimaler HMAC-SHA256 in Kleinbuchstaben über den rohen Request-Body, mit `signatureSecret` als Schlüssel. |

Prüfe die Signatur anhand der rohen Request-Bytes, bevor du JSON parst. Callbacks pro Aufgabe über `webhook_url` enthalten diesen Header nicht und können diesen Prüfablauf nicht nutzen. Die folgenden Handler sind für registrierte Webhooks gedacht: Sie prüfen zuerst, parsen danach, verwenden `id` als Idempotenzschlüssel und übergeben die Arbeit an eine asynchrone Funktion. Ersetze den Platzhalter-Queue-Aufruf durch deine eigene dauerhafte Queue oder deinen eigenen Worker.

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

Die HMAC-Eingabe ist exakt der rohe Body. Rufe keinen JSON-Parser auf und serialisiere die Payload nicht neu, bevor du ihn berechnest.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Zustellverhalten {#delivery-behavior}

- Eine Antwort im Bereich `2xx` innerhalb von 10 Sekunden gilt als erfolgreich.
- Netzwerkfehler, Timeouts und Antworten außerhalb von 2xx gelten als Fehlschläge. Der bestehende Event-Dispatcher kann fehlgeschlagene Zustellungen wiederholen; Empfänger müssen doppelte Zustellungen verkraften.
- Antworte mit 2xx, nachdem du das Event dauerhaft angenommen hast, und erledige langsame Arbeit danach asynchron. Die Beispiele verwenden Deduplizierung im Arbeitsspeicher nur, damit sie lauffähig bleiben; Empfänger in Produktion müssen sie durch einen eindeutigen Datenbankschlüssel oder eine dauerhafte Queue ersetzen. Gehe weder von Exactly-once-Zustellung noch von einer festen Event-Reihenfolge aus.
