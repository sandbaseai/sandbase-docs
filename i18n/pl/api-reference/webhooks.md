---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Rejestruj webhooki SandBase dla asynchronicznych zdarzeń modeli i zarządzaj nimi.
---

# Webhooks {#webhooks}

SandBase obsługuje dwa tryby wychodzących wywołań zwrotnych:

- **Zarejestrowane webhooki** należą do Twojej organizacji, subskrybują asynchroniczne zdarzenia Model i zawierają podpis HMAC `X-Signature`.
- **Wywołania zwrotne modelu dla pojedynczego zadania** używają `webhook_url` w jednym asynchronicznym żądaniu obrazu, wideo lub audio. Nie wymagają rejestracji i nie zawierają `X-Signature`.

Oba tryby stosują dostarczanie co najmniej raz (at-least-once). Zadbaj o idempotentność handlerów, korzystając z identyfikatora zdarzenia.

## Rejestrowanie webhooka {#register-a-webhook}

Events API to publiczny interfejs dostępny przez klucz API:

```text
POST https://api.sandbase.ai/events/webhooks
```

Webhookami możesz też tworzyć i zarządzać na [stronie Webhooks w Console](https://www.sandbase.ai/console/webhooks).

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

| Pole | Typ | Wymagane | Opis |
|---|---|---:|---|
| `name` | string | Tak | Nazwa czytelna dla człowieka. |
| `url` | string | Tak | Prawidłowy endpoint HTTP(S). W środowisku produkcyjnym używaj HTTPS. |
| `resourceType` | `model` | Tak | Wybiera opisane poniżej asynchroniczne zdarzenia Model. `model` to jedyna obsługiwana wartość. |
| `events` | string[] | Nie | Pusta tablica lub pominięcie oznacza wszystkie obecne i przyszłe zdarzenia wybranego typu zasobu. |
| `enabled` | boolean | Nie | Domyślnie `true`. |
| `signatureSecret` | string | Nie | Pomiń to pole, aby SandBase wygenerował sekret o wysokiej entropii. Istniejący klienci mogą nadal podawać własną niepustą wartość. |

Typy zasobów `session`, `sandbox` i `template` zostały wycofane: utworzenie webhooka z którymkolwiek z nich zwraca HTTP 400. Istniejące rejestracje tych typów są wyświetlane, aby można je było uprzątnąć: `PATCH` na nich zwraca HTTP 400, chyba że to samo żądanie zmienia `resourceType` na `model` (a wynikowa subskrypcja jest prawidłowa), więc usuń je lub przekształć na `model`. Subskrypcje `model` są dostępne tylko dla wymienionych poniżej końcowych zdarzeń asynchronicznego generowania obrazów, wideo i audio. API odrzuca zdarzenia innych typów zasobów oraz nieznane nazwy zdarzeń.

### Pomyślna odpowiedź {#successful-response}

Events API zwraca bezpośrednio zarejestrowany webhook. Ostateczny `signatureSecret` jest zawarty tylko w tej odpowiedzi na utworzenie. Zapisz go od razu w bezpiecznym miejscu: odpowiedzi na wyświetlenie listy i edycję nigdy go nie zwracają i nie da się go później odzyskać.

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

[Strona Webhooks w Console](https://www.sandbase.ai/console/webhooks) pokazuje wygenerowany sekret jeden raz po rejestracji i wymaga zapisania go przed zamknięciem okna dialogowego.

### Wyświetlanie, edycja i usuwanie {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Użyj tego samego uwierzytelniania kluczem API. `PATCH` może zawierać jedno lub więcej pól spośród `name`, `url`, `resourceType`, `events` i `enabled`; pominięte pola pozostają bez zmian. Pełna wynikowa subskrypcja `resourceType` i `events` musi być prawidłowa. Pusta tablica `events` nadal oznacza wszystkie zdarzenia danego typu zasobu.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` nie można wyświetlić ani zmienić przez `PATCH`; żądanie, które go zawiera, jest odrzucane. Jeśli sekret zostanie utracony, usuń webhook i utwórz go ponownie. Rejestracje możesz też wyświetlać, edytować, włączać lub wyłączać i usuwać na [stronie Webhooks w Console](https://www.sandbase.ai/console/webhooks).

`GET` zwraca tablicę JSON webhooków (bez `signatureSecret`), `PATCH` zwraca zaktualizowany webhook, a `DELETE`
zwraca `204 No Content`.

### Uwierzytelnianie i błędy {#authentication-and-errors}

Events API akceptuje klucz API jako `Authorization: Bearer $SANDBASE_API_KEY` lub `X-API-Key: $SANDBASE_API_KEY`. Gdy
wysłano oba, używany jest nagłówek Bearer.

Błędy mają własny format treści, a status HTTP jest powtórzony w `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Rozgałęziaj logikę według statusu HTTP. `401` oznacza, że klucza brakuje, jest nieprawidłowy lub unieważniony; `400` oznacza nieprawidłową treść żądania
lub subskrypcję; `404` (`webhook not found`) oznacza, że webhook nie istnieje w Twojej organizacji.

## Wywołanie zwrotne modelu dla pojedynczego zadania {#per-task-model-callback}

W przypadku jednego asynchronicznego zadania obrazu, wideo lub audio dodaj `webhook_url` do `POST /v1/run` zamiast rejestrować nowy webhook:

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

Pole jest parsowane i walidowane tylko wtedy, gdy wybrany model dotyczy obrazu, wideo lub audio, a żądanie jest wykonywane asynchronicznie. W takim przypadku musi to być niepusty ciąg znaków zawierający prawidłowy, bezpieczny publiczny URL HTTPS; w przeciwnym razie żądanie zwraca HTTP 400. W przypadku żądań synchronicznych, strumieniowych, LLM lub innych nieobsługiwanych SandBase ignoruje `webhook_url` niezależnie od jego wartości JSON: nie planuje wywołania zwrotnego, nie zapisuje URL wywołania zwrotnego i nie przekazuje pola dostawcy modelu. Pominięcie pola zachowuje dotychczasowy przepływ z odpytywaniem.

Cel musi być publicznym URL HTTPS. SandBase wysyła tę samą kopertę końcowego zdarzenia Model opisaną poniżej, z `Content-Type: application/json` i `X-Event-ID`, dla stanów completed, failed, timeout lub cancelled. Nieudane dostarczenie może zostać ponowione, więc deduplikuj według `id` lub `X-Event-ID` i szybko zwracaj 2xx.

Wywołanie zwrotne dla pojedynczego zadania nie ma współdzielonego sekretu SandBase i dlatego **nie** zawiera `X-Signature`. Jeśli Twój endpoint wymaga weryfikacji HMAC, pomiń `webhook_url` i zamiast tego zarejestruj Model Webhook organizacji. Możesz umieścić w zapytaniu URL HTTPS nieprzezroczysty token dostępu wygenerowany przez własny system i weryfikować go na swoim endpoincie. Traktuj taki URL jako poufny.

Dla każdego asynchronicznego zadania modelu wybór celu jest wyłączny. Jeśli żądanie zawiera prawidłowy `webhook_url`, SandBase wysyła końcowe zdarzenie tej Prediction tylko na URL zadania i pomija dla tego zdarzenia wszystkie zarejestrowane Model Webhooks organizacji. Jeśli żądanie pomija `webhook_url`, zarejestrowane Model Webhooks organizacji nadal normalnie otrzymują pasujące zdarzenia. Nieudane dostarczenie dla pojedynczego zadania jest ponawiane na ten sam URL zadania i nigdy nie przełącza się na zarejestrowany webhook. Ten priorytet nie tworzy, nie zastępuje, nie wyłącza ani nie modyfikuje żadnej rejestracji i nie wpływa na inne zdarzenia Model.

## Typy zdarzeń {#event-types}

### Generowanie modelu {#model-generation}

Webhooki Model są dostępne tylko dla asynchronicznego generowania obrazów, wideo i audio. Nie są emitowane dla synchronicznych żądań obrazów/wideo/audio ani dla żadnych synchronicznych żądań LLM: te wyniki są zwracane w pierwotnej odpowiedzi HTTP.

| Zdarzenie | Opis |
|---|---|
| `model.generation.completed` | Asynchroniczne generowanie obrazu, wideo lub audio zostało ukończone. |
| `model.generation.failed` | Asynchroniczne generowanie obrazu, wideo lub audio zakończyło się błędem. |
| `model.generation.timeout` | Upłynął limit czasu asynchronicznego generowania obrazu, wideo lub audio. |
| `model.generation.cancelled` | Asynchroniczne generowanie obrazu, wideo lub audio zostało anulowane. |

## Ładunek dostarczenia {#delivery-payload}

SandBase wysyła `Content-Type: application/json` i następującą kopertę JSON. `data` zależy od zdarzenia i z czasem może zyskiwać nowe pola.

### Przykład ukończenia generowania modelu {#model-completion-example}

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

Zdarzenia błędu i przekroczenia czasu nie zawierają wyników, a jedynie oczyszczoną kategorię błędu.

| Pole | Opis |
|---|---|
| `id` | Unikalny identyfikator zdarzenia. Używaj go lub `X-Event-ID` jako klucza idempotencji. |
| `resourceType` | `model`. |
| `resourceID` | Identyfikator Prediction, której dotyczy zdarzenie. |
| `type` | Typ zdarzenia z powyższej tabeli. |
| `data` | Dane specyficzne dla zdarzenia. |
| `createdAt` | Czas utworzenia zdarzenia w formacie RFC 3339 UTC. |

## Weryfikacja podpisu zarejestrowanego webhooka {#verify-a-registered-webhook-signature}

Każde dostarczenie zarejestrowanego webhooka zawiera następujące nagłówki:

| Nagłówek | Wartość |
|---|---|
| `X-Event-ID` | `id` z ładunku. |
| `X-Signature` | HMAC-SHA256 surowej treści żądania w zapisie szesnastkowym małymi literami, z kluczem `signatureSecret`. |

Weryfikuj podpis na podstawie surowych bajtów żądania, zanim sparsujesz JSON. Wywołania zwrotne `webhook_url` dla pojedynczego zadania nie zawierają tego nagłówka i nie mogą korzystać z tej weryfikacji. Poniższe handlery są przeznaczone dla zarejestrowanych webhooków: najpierw weryfikują, potem parsują, używają `id` jako klucza idempotencji i przekazują pracę do funkcji asynchronicznej. Zastąp przykładowe wywołanie kolejki własną trwałą kolejką lub workerem.

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

Wejściem HMAC jest dokładna surowa treść. Przed jego obliczeniem nie wywołuj parsera JSON ani nie serializuj ładunku ponownie.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Zachowanie dostarczania {#delivery-behavior}

- Odpowiedź z zakresu `2xx` w ciągu 10 sekund oznacza powodzenie.
- Błędy sieci, przekroczenia czasu i odpowiedzi spoza 2xx są niepowodzeniami. Istniejący dyspozytor zdarzeń może ponawiać nieudane dostarczenia; odbiorcy muszą tolerować duplikaty.
- Zwróć odpowiedź 2xx po trwałym przyjęciu, a wolniejszą pracę wykonaj asynchronicznie. Przykłady używają deduplikacji w pamięci tylko po to, aby dało się je uruchomić; odbiorcy produkcyjni muszą zastąpić ją unikalnym kluczem w bazie danych lub trwałą kolejką. Nie zakładaj dostarczania dokładnie raz ani zachowania kolejności zdarzeń.
