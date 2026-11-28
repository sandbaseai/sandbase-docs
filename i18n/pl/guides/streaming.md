---
i18nSource: 335b45fb98c53890
title: Odpowiedzi strumieniowane
description: Strumieniuj wyjście modeli SandBase za pomocą SDK zgodnych z OpenAI lub Anthropic i bezpiecznie obsługuj częściowe wyniki.
---

# Odpowiedzi strumieniowane {#streaming-responses}

Strumieniowanie zwraca wyjście modelu w miarę jego powstawania. SandBase zachowuje format zdarzeń wywoływanego zgodnego API:
OpenAI Chat Completions używa Server-Sent Events (SSE) zawierających tylko dane, a Anthropic Messages używa nazwanych zdarzeń SSE.

Jeśli to możliwe, używaj oficjalnego zgodnego SDK. Obsługuje ramkowanie zdarzeń, przyrostowe argumenty wywołań narzędzi i zakończenie
protokołu bezpieczniej niż samodzielne dzielenie surowego tekstu odpowiedzi.

## OpenAI Chat Completions {#openai-chat-completions}

Ustaw `stream: true` w `POST /v1/chat/completions`.

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

Fragmenty zgodne z OpenAI umieszczają przyrostowy tekst w `choices[0].delta.content`. Argumenty wywołań narzędzi, jeśli obsługuje je
wybrany model, przychodzą jako fragmenty ciągów w `delta.tool_calls`; połącz fragmenty według indeksu wariantu i wywołania narzędzia
przed parsowaniem kompletnego JSON. Strumień zwykle kończy się `data: [DONE]`.

Nie zakładaj, że każdy dostawca zwraca użycie tokenów w strumieniu. Jeśli wybrany model obsługuje
`stream_options.include_usage` z OpenAI, użycie może pojawić się pod koniec; w przeciwnym razie użyj odpowiedzi bez strumieniowania lub
odpowiedniego przepływu kosztu zadania.

## Anthropic Messages {#anthropic-messages}

Użyj Anthropic SDK z `POST /v1/messages`. Pomocnik strumienia w SDK składa nazwane zdarzenia i bloki treści.

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

Surowe strumienie Anthropic używają nazw zdarzeń, takich jak `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` i `message_stop`. Tekst jest przenoszony w blokach `text_delta`. Wejście narzędzi używa
przyrostowych bloków JSON, które trzeba złożyć przed parsowaniem.

## Obsługa przerwań i anulowania {#handle-interruption-and-cancellation}

Błąd HTTP zwrócony przed rozpoczęciem strumieniowania używa zwykłej treści błędu endpointu. Po rozpoczęciu odpowiedzi
awaria sieci może pozostawić częściowy tekst bez zdarzenia końcowego. Traktuj wyjście jako kompletne dopiero po
normalnym sygnale zakończenia protokołu.

- Przechowuj częściowe wyjście oddzielnie od zatwierdzonego stanu aplikacji.
- Ogranicz limity czasu połączenia i bezczynności we własnym kliencie lub proxy odpowiednio do obciążenia.
- Gdy użytkownik zatrzyma generowanie, użyj mechanizmu anulowania w SDK lub `AbortController` w JavaScript.
- Nie doklejaj automatycznie ponowionego strumienia do częściowego wyjścia; ponowienie to nowe generowanie.
- Unikaj buforowania SSE w kontrolowanych przez siebie reverse proxy.

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

Odczytując surowe SSE, parsuj kompletne ramki zdarzeń oddzielone pustymi liniami. Fragmenty sieciowe nie odpowiadają jeden do jednego
zdarzeniom SSE, a znak UTF-8 może rozciągać się na kilka fragmentów. Użyj strumieniowego dekodera tekstu i zachowuj niekompletną ramkę,
dopóki nie nadejdą kolejne bajty.

## Powiązane materiały {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Obsługa błędów](/guides/error-handling)
- [Limity zapytań](/guides/rate-limiting)
