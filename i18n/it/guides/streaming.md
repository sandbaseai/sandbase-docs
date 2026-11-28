---
i18nSource: 335b45fb98c53890
title: Risposte in streaming
description: Ricevi in streaming l'output dei modelli SandBase con gli SDK compatibili con OpenAI o Anthropic e gestisci in sicurezza i risultati parziali.
---

# Risposte in streaming {#streaming-responses}

Lo streaming restituisce l'output del modello man mano che diventa disponibile. SandBase preserva il formato degli eventi dell'API compatibile che
chiami: OpenAI Chat Completions usa Server-Sent Events (SSE) con soli dati, mentre Anthropic Messages usa eventi SSE con nome.

Quando possibile, usa un SDK ufficiale compatibile. Gestisce il framing degli eventi, gli argomenti incrementali delle chiamate ai tool e la
terminazione del protocollo in modo più sicuro rispetto a suddividere da solo il testo grezzo della risposta.

## OpenAI Chat Completions {#openai-chat-completions}

Imposta `stream: true` su `POST /v1/chat/completions`.

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

I chunk compatibili con OpenAI inseriscono il testo incrementale in `choices[0].delta.content`. Gli argomenti delle chiamate ai tool, se supportati
dal modello selezionato, arrivano come frammenti di stringa in `delta.tool_calls`; concatena i frammenti per indice di choice e di tool call
prima di analizzare il JSON completo. Di norma lo stream termina con `data: [DONE]`.

Non dare per scontato che ogni provider restituisca l'utilizzo dei token in uno stream. Se il modello selezionato supporta
`stream_options.include_usage` di OpenAI, l'utilizzo può comparire verso la fine; altrimenti usa la risposta senza streaming o il
flusso di calcolo del costo del task applicabile.

## Anthropic Messages {#anthropic-messages}

Usa l'SDK Anthropic con `POST /v1/messages`. L'helper di streaming dell'SDK assembla gli eventi con nome e i blocchi di contenuto.

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

Gli stream Anthropic grezzi usano nomi di evento come `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` e `message_stop`. Il testo viaggia nei blocchi `text_delta`. L'input dei tool usa
blocchi JSON incrementali che vanno assemblati prima dell'analisi.

## Gestire interruzioni e annullamenti {#handle-interruption-and-cancellation}

Un errore HTTP restituito prima dell'inizio dello streaming usa il normale corpo di errore dell'endpoint. Dopo l'avvio della risposta,
un errore di rete può lasciare testo parziale senza un evento finale. Considera l'output completo solo dopo il normale
segnale di terminazione del protocollo.

- Tieni l'output parziale separato dallo stato confermato dell'applicazione.
- Limita i timeout di connessione e di inattività nel tuo client o proxy in base al carico di lavoro.
- Usa il meccanismo di annullamento dell'SDK o un `AbortController` in JavaScript quando l'utente interrompe la generazione.
- Non accodare automaticamente uno stream ripetuto all'output parziale; un retry è una nuova generazione.
- Evita il buffering degli SSE nei reverse proxy che controlli.

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

Quando leggi SSE grezzi, analizza frame di evento completi separati da righe vuote. I chunk di rete non corrispondono uno a uno
agli eventi SSE e un carattere UTF-8 può essere diviso tra più chunk. Usa un decoder di testo in streaming e conserva ogni frame incompleto
finché non arrivano altri byte.

## Approfondimenti {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Gestione degli errori](/guides/error-handling)
- [Limiti di frequenza](/guides/rate-limiting)
