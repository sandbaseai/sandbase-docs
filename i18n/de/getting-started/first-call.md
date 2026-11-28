---
i18nSource: 0ca53876f04eb96d
title: Erster API-Aufruf
description: "Ausführliche Anleitung für deinen ersten SandBase-API-Aufruf: Aufbau der Anfrage, Struktur der Antwort und Streaming."
---

# Erster API-Aufruf {#first-api-call}

Dieser Leitfaden erklärt im Detail, wie eine Anfrage an die SandBase-API und ihre Antwort aufgebaut sind. Am Ende kennst du jedes Feld im Request-Body, weißt, wie du die Antwort liest, und kannst Streaming verwenden.

## Bevor du beginnst {#before-you-start}

Du brauchst eine aktive SandBase-Organisation, einen [API-Key](/getting-started/api-keys) und eine Modell-ID aus dem [Modellkatalog](https://www.sandbase.ai/models). Exportiere den Key, damit die Beispiele keine Secrets im Quellcode enthalten:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Beginne mit einer Anfrage ohne Streaming. Sobald Authentifizierung und Verarbeitung der Antwort funktionieren, ergänze Streaming und Retry-Verhalten für die Produktion.

## Aufbau der Anfrage {#request-anatomy}

Diese Anleitung verwendet die OpenAI-kompatible Route für Chat Completions:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Erforderliche Header {#required-headers}

| Header | Wert | Beschreibung |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | Dein SandBase-API-Key |
| `Content-Type` | `application/json` | Format des Request-Bodys |

### Request-Body {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Body-Parameter {#body-parameters}

| Parameter | Typ | Pflicht | Beschreibung |
|-----------|------|----------|-------------|
| `model` | string | Ja | Eine aktivierte Modell-ID, die `GET /v1/models` zurückgibt (zum Beispiel `deepseek/deepseek-v4-flash`) |
| `messages` | array | Ja | Gesprächsverlauf als Array von Message-Objekten |
| `temperature` | number | Nein | Sampling-Temperatur (0–2). Unterstützung und Standardwerte können je nach Modell variieren. |
| `max_tokens` | integer | Nein | Maximale Anzahl an Tokens, die in der Antwort generiert werden |
| `top_p` | number | Nein | Parameter für Nucleus Sampling (0–1) |
| `stream` | boolean | Nein | Ob die Antwort gestreamt wird. Standard: `false` |
| `stop` | string oder array | Nein | Stoppsequenzen: Die Generierung endet, sobald sie auftreten |
| `frequency_penalty` | number | Nein | Providerkompatible Wiederholungsstrafe, sofern unterstützt |
| `presence_penalty` | number | Nein | Providerkompatible Presence Penalty, sofern unterstützt |

### Message-Rollen {#message-roles}

| Rolle | Zweck |
|------|---------|
| `system` | Legt Verhalten und Persönlichkeit des Assistenten fest |
| `user` | Die Eingabe des Menschen |
| `assistant` | Vorherige Antworten des Assistenten (für mehrstufige Unterhaltungen) |
| `developer`, `tool` | Weitere OpenAI-kompatible Rollen, sofern vom ausgewählten Modell und der Route unterstützt |

## Vollständiges Anfragebeispiel {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Aufbau der Antwort {#response-structure}

### Typische Antwort ohne Streaming {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Antwortfelder erklärt {#response-fields-explained}

| Feld | Beschreibung |
|-------|-------------|
| `id` | Eindeutige Kennung dieser Completion |
| `object` | OpenAI-kompatibles Response-Objekt, auf dieser Route normalerweise `"chat.completion"` |
| `created` | Unix-Zeitstempel der Generierung der Antwort |
| `model` | Das Modell, das die Antwort generiert hat |
| `choices` | Array von Completion-Choices (typischerweise eine) |
| `choices[].index` | Index dieser Choice im Array |
| `choices[].message.role` | Rolle der generierten Message, normalerweise `"assistant"` |
| `choices[].message.content` | Der generierte Text |
| `choices[].finish_reason` | Warum die Generierung beendet wurde (siehe unten) |
| `usage.prompt_tokens` | Tokens in deiner Eingabe |
| `usage.completion_tokens` | Tokens in der generierten Ausgabe |
| `usage.total_tokens` | Summe aus Prompt- und Completion-Tokens |

### Finish Reasons {#finish-reasons}

Finish Reasons hängen vom Provider ab. Häufige OpenAI-kompatible Werte sind:

| Wert | Typische Bedeutung |
|-------|---------|
| `stop` | Natürliches Ende der Antwort oder Stoppsequenz erreicht |
| `length` | Limit `max_tokens` erreicht, die Antwort wurde abgeschnitten |

Behandle unbekannte Werte als gültige Provider-Ausgabe, statt die Antwort abzulehnen.

## Streaming-Antworten {#streaming-responses}

Für Ausgabe in Echtzeit (etwa wie ein tippender Chatbot) verwendest du Streaming. Die Antwort kommt als Server-Sent Events (SSE):

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### SSE-Format beim Streaming {#streaming-sse-format}

Ein kompatibler Stream sendet typischerweise Server-Sent Events wie diese:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Wichtige Punkte:

- Verarbeite Chunks in der richtigen Reihenfolge und hänge alle `delta.content`-Fragmente an.
- Toleriere Chunks, die nur Metadaten enthalten, leere Deltas und providerkompatible Felder, die du nicht kennst.
- Höre auf, wenn der Stream geschlossen wird oder seine Endmarkierung ankommt; Chat Completions verwendet meist `data: [DONE]`.
- Geh nicht davon aus, dass jedes Modell erste und letzte Chunks in exakt derselben Form sendet.

## Anthropic SDK verwenden {#using-the-anthropic-sdk}

SandBase stellt außerdem einen Anthropic-kompatiblen Endpunkt unter `POST /v1/messages` bereit. Verwende das Anthropic SDK, indem du `base_url` änderst:

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Aufbau der Anthropic-Antwort {#anthropic-response-structure}

Der Anthropic-kompatible Endpunkt gibt eine Antwort im Anthropic-Stil zurück. Eine typische Textantwort sieht so aus:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Feld | Beschreibung |
|-------|-------------|
| `id` | Message-ID (mit Präfix `msg_`) |
| `type` | Typ des Message-Objekts, normalerweise `"message"` |
| `role` | Rolle der generierten Message, normalerweise `"assistant"` |
| `content` | Array typisierter Content-Blöcke; geh nicht davon aus, dass jeder Block Text ist |
| `model` | Das Modell, das die Antwort generiert hat |
| `stop_reason` | `"end_turn"` (natürliches Ende), `"max_tokens"` (Limit erreicht) oder `"stop_sequence"` |
| `usage.input_tokens` | Tokens in deiner Eingabe |
| `usage.output_tokens` | Tokens in der generierten Ausgabe |

### Streaming mit Anthropic {#anthropic-streaming}

Streaming mit dem Anthropic SDK funktioniert genauso. Übergib einfach `stream=True`:

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Modell auswählen {#choosing-a-model}

Prüfe bei der Auswahl eines Modells seine aktuelle Modellkarte auf Verfügbarkeit, Preise, Kontextlänge, unterstützte Eingaben und Fähigkeiten. Diese Werte ändern sich unabhängig voneinander, verlass dich also nicht auf einen kopierten Modellvergleich.

- Durchsuche den aktuellen [Modellkatalog](https://www.sandbase.ai/models).
- Öffne die Seite eines Modells im Katalog, um seine modellspezifischen Request-Felder zu sehen.
- Frage `GET /v1/models` ab, wenn eine Integration aktuelle Modell-Metadaten programmatisch benötigt.

Bei Modellen mit derselben kompatiblen Schnittstelle beginnt ein Wechsel meist mit dem Parameter `model`. Prüfe Fähigkeiten und Schema des ausgewählten Modells erneut, bevor du optionale Felder, Tools, Medieneingaben oder Einstellungen für strukturierte Ausgabe übernimmst.

## Nächste Schritte {#next-steps}

Lege vor dem Produktionseinsatz Request-Timeouts fest, wiederhole nur vorübergehende Fehler mit begrenztem exponentiellem Backoff, logge Request-IDs, sofern verfügbar, und überwache die Nutzung, ohne Prompts oder API-Keys zu loggen.

- [**API-Referenz**](/api-reference/): Inferenz-Endpunkte und Verträge der Platform API
- [**Streaming-Leitfaden**](/guides/streaming): Fortgeschrittene Streaming-Muster und Fehlerbehandlung
- [**Modelle**](https://www.sandbase.ai/models): Modelle finden, Fähigkeiten und aktuelle Preise
- [**Fehler**](/guides/error-handling): Fehler und Retries behandeln
