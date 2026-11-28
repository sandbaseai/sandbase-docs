---
i18nSource: 335b45fb98c53890
title: Streaming-Antworten
description: Streame die Ausgabe von SandBase-Modellen mit den OpenAI- oder Anthropic-kompatiblen SDKs und behandle Teilergebnisse sicher.
---

# Streaming-Antworten {#streaming-responses}

Beim Streaming wird die Modellausgabe zurückgegeben, sobald sie verfügbar ist. SandBase behält das Event-Format der kompatiblen API bei, die du
aufrufst: OpenAI Chat Completions verwendet reine `data`-Server-Sent-Events (SSE), Anthropic Messages verwendet benannte SSE-Events.

Verwende nach Möglichkeit ein offizielles kompatibles SDK. Es behandelt Event-Framing, inkrementelle Tool-Call-Argumente und das Protokollende
zuverlässiger, als wenn du den rohen Antworttext selbst aufteilst.

## OpenAI Chat Completions {#openai-chat-completions}

Setze `stream: true` bei `POST /v1/chat/completions`.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

OpenAI-kompatible Chunks legen inkrementellen Text in `choices[0].delta.content` ab. Tool-Call-Argumente kommen, sofern vom
ausgewählten Modell unterstützt, als String-Fragmente in `delta.tool_calls`; verkette die Fragmente pro Choice und Tool-Call-Index,
bevor du das vollständige JSON parst. Der Stream endet normalerweise mit `data: [DONE]`.

Geh nicht davon aus, dass jeder Provider die Token-Nutzung im Stream zurückgibt. Wenn dein ausgewähltes Modell OpenAIs
`stream_options.include_usage` unterstützt, kann die Nutzung gegen Ende erscheinen; andernfalls verwende die Antwort ohne Streaming oder den
passenden Ablauf für Task-Kosten.

## Anthropic Messages {#anthropic-messages}

Verwende das Anthropic SDK mit `POST /v1/messages`. Der Stream-Helper des SDK setzt benannte Events und Content-Blöcke zusammen.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Rohe Anthropic-Streams verwenden Event-Namen wie `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` und `message_stop`. Text wird in `text_delta`-Blöcken übertragen. Tool-Eingaben verwenden
inkrementelle JSON-Blöcke und müssen vor dem Parsen zusammengesetzt werden.

## Unterbrechung und Abbruch behandeln {#handle-interruption-and-cancellation}

Ein HTTP-Fehler, der vor Beginn des Streamings zurückgegeben wird, verwendet den normalen Fehler-Body des Endpunkts. Nachdem die Antwort begonnen hat,
kann ein Netzwerkfehler Teiltext ohne abschließendes Event hinterlassen. Betrachte die Ausgabe erst nach dem normalen Endsignal des Protokolls
als vollständig.

- Halte Teilausgaben getrennt vom festgeschriebenen Zustand deiner Anwendung.
- Begrenze Verbindungs- und Inaktivitäts-Timeouts in deinem eigenen Client oder Proxy passend zur Workload.
- Verwende den Abbruchmechanismus des SDK oder in JavaScript einen `AbortController`, wenn der Benutzer die Generierung stoppt.
- Hänge einen wiederholten Stream nicht automatisch an eine Teilausgabe an; ein Retry ist eine neue Generierung.
- Vermeide das Puffern von SSE in Reverse Proxies, die du kontrollierst.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

Wenn du rohes SSE liest, parse vollständige Event-Frames, die durch Leerzeilen getrennt sind. Netzwerk-Chunks entsprechen nicht eins zu eins
SSE-Events, und ein UTF-8-Zeichen kann sich über mehrere Chunks erstrecken. Verwende einen Streaming-Text-Decoder und behalte unvollständige Frames,
bis weitere Bytes ankommen.

## Weiterführende Hinweise {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Fehlerbehandlung](/guides/error-handling)
- [Rate Limits](/guides/rate-limiting)
