---
i18nSource: 0ca53876f04eb96d
title: Pierwsze wywołanie API
description: "Szczegółowy przewodnik po pierwszym wywołaniu API SandBase: budowa żądania, struktura odpowiedzi i strumieniowanie."
---

# Pierwsze wywołanie API {#first-api-call}

Ten przewodnik szczegółowo omawia budowę żądania i odpowiedzi API SandBase. Po lekturze będziesz rozumieć każde pole w treści żądania, wiedzieć, jak odczytać odpowiedź i jak korzystać ze strumieniowania.

## Zanim zaczniesz {#before-you-start}

Potrzebujesz aktywnej organizacji SandBase, [klucza API](/getting-started/api-keys) i identyfikatora modelu z [katalogu modeli](https://www.sandbase.ai/models). Wyeksportuj klucz, aby przykłady nie umieszczały sekretów w kodzie źródłowym:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Zacznij od żądania bez strumieniowania. Gdy uwierzytelnianie i obsługa odpowiedzi zadziałają, dodaj strumieniowanie i produkcyjną obsługę ponowień.

## Budowa żądania {#request-anatomy}

Ten przykład korzysta z trasy Chat Completions zgodnej z OpenAI:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Wymagane nagłówki {#required-headers}

| Nagłówek | Wartość | Opis |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | Twój klucz API SandBase |
| `Content-Type` | `application/json` | Format treści żądania |

### Treść żądania {#request-body}

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

### Parametry treści {#body-parameters}

| Parametr | Typ | Wymagany | Opis |
|-----------|------|----------|-------------|
| `model` | string | Tak | Identyfikator włączonego modelu zwracany przez `GET /v1/models` (na przykład `deepseek/deepseek-v4-flash`) |
| `messages` | array | Tak | Historia rozmowy jako tablica obiektów wiadomości |
| `temperature` | number | Nie | Temperatura próbkowania (0–2). Obsługa i wartości domyślne mogą zależeć od modelu. |
| `max_tokens` | integer | Nie | Maksymalna liczba tokenów generowanych w odpowiedzi |
| `top_p` | number | Nie | Parametr próbkowania nucleus (0–1) |
| `stream` | boolean | Nie | Czy strumieniować odpowiedź. Domyślnie: `false` |
| `stop` | string lub array | Nie | Sekwencje zatrzymujące — generowanie kończy się po ich napotkaniu |
| `frequency_penalty` | number | Nie | Kara za powtórzenia zgodna z dostawcą, jeśli jest obsługiwana |
| `presence_penalty` | number | Nie | Kara za obecność zgodna z dostawcą, jeśli jest obsługiwana |

### Role wiadomości {#message-roles}

| Rola | Przeznaczenie |
|------|---------|
| `system` | Ustala zachowanie i osobowość asystenta |
| `user` | Wejście od człowieka |
| `assistant` | Wcześniejsze odpowiedzi asystenta (w rozmowach wieloturowych) |
| `developer`, `tool` | Dodatkowe role zgodne z OpenAI, jeśli obsługuje je wybrany model i trasa |

## Pełny przykład żądania {#full-request-example}

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

## Struktura odpowiedzi {#response-structure}

### Typowa odpowiedź bez strumieniowania {#typical-non-streaming-response}

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

### Objaśnienie pól odpowiedzi {#response-fields-explained}

| Pole | Opis |
|-------|-------------|
| `id` | Unikalny identyfikator tego uzupełnienia |
| `object` | Obiekt odpowiedzi zgodny z OpenAI, na tej trasie zwykle `"chat.completion"` |
| `created` | Znacznik czasu Unix wygenerowania odpowiedzi |
| `model` | Model, który wygenerował odpowiedź |
| `choices` | Tablica wariantów uzupełnienia (zwykle jeden) |
| `choices[].index` | Indeks tego wariantu w tablicy |
| `choices[].message.role` | Rola zwrócona dla wygenerowanej wiadomości, zwykle `"assistant"` |
| `choices[].message.content` | Wygenerowany tekst |
| `choices[].finish_reason` | Powód zakończenia generowania (zobacz niżej) |
| `usage.prompt_tokens` | Tokeny w Twoim wejściu |
| `usage.completion_tokens` | Tokeny w wygenerowanym wyjściu |
| `usage.total_tokens` | Suma tokenów promptu i uzupełnienia |

### Powody zakończenia {#finish-reasons}

Powody zakończenia zależą od dostawcy. Typowe wartości zgodne z OpenAI to:

| Wartość | Typowe znaczenie |
|-------|---------|
| `stop` | Naturalny koniec odpowiedzi lub napotkanie sekwencji zatrzymującej |
| `length` | Osiągnięto limit `max_tokens` — odpowiedź została obcięta |

Nieznane wartości traktuj jako prawidłowe wyjście dostawcy zamiast odrzucać odpowiedź.

## Odpowiedzi strumieniowane {#streaming-responses}

Aby otrzymywać wyjście w czasie rzeczywistym (jak pisanie chatbota), użyj strumieniowania. Odpowiedź przychodzi jako Server-Sent Events (SSE):

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

### Format strumienia SSE {#streaming-sse-format}

Zgodny strumień zwykle emituje Server-Sent Events podobne do poniższych:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Najważniejsze zasady:

- przetwarzaj fragmenty po kolei i doklejaj wszystkie fragmenty `delta.content`
- toleruj fragmenty zawierające tylko metadane, puste delty i nierozpoznane pola zgodne z dostawcą
- zakończ, gdy strumień się zamknie lub nadejdzie znacznik końca; Chat Completions zwykle używa `data: [DONE]`
- nie zakładaj, że każdy model emituje dokładnie taki sam kształt pierwszego lub ostatniego fragmentu

## Korzystanie z Anthropic SDK {#using-the-anthropic-sdk}

SandBase udostępnia też endpoint zgodny z Anthropic pod `POST /v1/messages`. Użyj Anthropic SDK, zmieniając `base_url`:

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

### Struktura odpowiedzi Anthropic {#anthropic-response-structure}

Endpoint zgodny z Anthropic zwraca odpowiedź w stylu Anthropic. Typowa odpowiedź tekstowa wygląda tak:

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

| Pole | Opis |
|-------|-------------|
| `id` | Identyfikator wiadomości (z prefiksem `msg_`) |
| `type` | Typ obiektu wiadomości, zwykle `"message"` |
| `role` | Rola wygenerowanej wiadomości, zwykle `"assistant"` |
| `content` | Tablica typowanych bloków treści; nie zakładaj, że każdy blok jest tekstem |
| `model` | Model, który wygenerował odpowiedź |
| `stop_reason` | `"end_turn"` (naturalne zakończenie), `"max_tokens"` (osiągnięto limit) lub `"stop_sequence"` |
| `usage.input_tokens` | Tokeny w Twoim wejściu |
| `usage.output_tokens` | Tokeny w wygenerowanym wyjściu |

### Strumieniowanie Anthropic {#anthropic-streaming}

Strumieniowanie z Anthropic SDK działa tak samo — wystarczy przekazać `stream=True`:

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

## Wybór modelu {#choosing-a-model}

Wybierając model, sprawdź jego aktualną kartę pod kątem dostępności, cen, długości kontekstu, obsługiwanych wejść i możliwości. Te wartości zmieniają się niezależnie, więc nie polegaj na skopiowanym porównaniu modeli.

- Przeglądaj aktualny [katalog modeli](https://www.sandbase.ai/models).
- Otwórz stronę modelu w katalogu, aby zobaczyć pola żądania specyficzne dla tego modelu.
- Odpytuj `GET /v1/models`, gdy integracja potrzebuje aktualnych metadanych modeli programowo.

W przypadku modeli o tym samym zgodnym interfejsie zmiana zwykle zaczyna się od parametru `model`. Przed przeniesieniem opcjonalnych pól, narzędzi, wejść multimedialnych lub ustawień ustrukturyzowanego wyjścia ponownie sprawdź możliwości i schemat wybranego modelu.

## Następne kroki {#next-steps}

Przed wdrożeniem produkcyjnym ustaw limity czasu żądań, ponawiaj tylko przejściowe błędy z ograniczonym wykładniczym wycofywaniem, loguj identyfikatory żądań, gdy są dostępne, i monitoruj użycie bez logowania promptów ani kluczy API.

- [**Dokumentacja API**](/api-reference/) — endpointy inferencji i kontrakty Platform API
- [**Przewodnik po strumieniowaniu**](/guides/streaming) — zaawansowane wzorce strumieniowania i obsługa błędów
- [**Modele**](https://www.sandbase.ai/models) — wyszukiwanie modeli, możliwości i aktualne ceny
- [**Błędy**](/guides/error-handling) — obsługa błędów i ponowień
