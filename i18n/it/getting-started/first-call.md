---
i18nSource: 0ca53876f04eb96d
title: Prima chiamata API
description: "Guida dettagliata alla tua prima chiamata API SandBase: struttura della richiesta, struttura della risposta e streaming."
---

# Prima chiamata API {#first-api-call}

Questa guida illustra nel dettaglio la struttura di una richiesta e di una risposta dell'API SandBase. Alla fine conoscerai ogni campo del corpo della richiesta, saprai leggere la risposta e usare lo streaming.

## Prima di iniziare {#before-you-start}

Ti servono un'organizzazione SandBase attiva, una [API key](/getting-started/api-keys) e un ID modello dal [catalogo dei modelli](https://www.sandbase.ai/models). Esporta la chiave, così gli esempi non inseriscono segreti nel codice sorgente:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Inizia con una richiesta senza streaming. Quando autenticazione e gestione della risposta funzionano, aggiungi lo streaming e la logica di retry per la produzione.

## Struttura della richiesta {#request-anatomy}

Questa guida usa il percorso Chat Completions compatibile con OpenAI:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Header obbligatori {#required-headers}

| Header | Valore | Descrizione |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | La tua API key SandBase |
| `Content-Type` | `application/json` | Formato del corpo della richiesta |

### Corpo della richiesta {#request-body}

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

### Parametri del corpo {#body-parameters}

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|----------|-------------|
| `model` | string | Sì | Un ID modello abilitato restituito da `GET /v1/models` (ad esempio `deepseek/deepseek-v4-flash`) |
| `messages` | array | Sì | Cronologia della conversazione come array di oggetti messaggio |
| `temperature` | number | No | Temperatura di campionamento (0–2). Supporto e valori predefiniti possono variare in base al modello. |
| `max_tokens` | integer | No | Numero massimo di token da generare nella risposta |
| `top_p` | number | No | Parametro di nucleus sampling (0–1) |
| `stream` | boolean | No | Indica se ricevere la risposta in streaming. Predefinito: `false` |
| `stop` | string o array | No | Sequenze di stop: la generazione si interrompe quando vengono incontrate |
| `frequency_penalty` | number | No | Penalità di ripetizione compatibile con il provider, se supportata |
| `presence_penalty` | number | No | Penalità di presenza compatibile con il provider, se supportata |

### Ruoli dei messaggi {#message-roles}

| Ruolo | Scopo |
|------|---------|
| `system` | Definisce il comportamento e la personalità dell'assistente |
| `user` | L'input della persona |
| `assistant` | Risposte precedenti dell'assistente (per conversazioni a più turni) |
| `developer`, `tool` | Ruoli aggiuntivi compatibili con OpenAI, se supportati dal modello e dal percorso selezionati |

## Esempio di richiesta completa {#full-request-example}

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

## Struttura della risposta {#response-structure}

### Risposta tipica senza streaming {#typical-non-streaming-response}

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

### Campi della risposta {#response-fields-explained}

| Campo | Descrizione |
|-------|-------------|
| `id` | Identificatore univoco di questa completion |
| `object` | Oggetto di risposta compatibile con OpenAI, di norma `"chat.completion"` su questo percorso |
| `created` | Timestamp Unix del momento in cui è stata generata la risposta |
| `model` | Il modello che ha generato la risposta |
| `choices` | Array delle scelte di completion (di solito una) |
| `choices[].index` | Indice di questa scelta nell'array |
| `choices[].message.role` | Ruolo restituito per il messaggio generato, di norma `"assistant"` |
| `choices[].message.content` | Il testo generato |
| `choices[].finish_reason` | Perché la generazione si è interrotta (vedi sotto) |
| `usage.prompt_tokens` | Token del tuo input |
| `usage.completion_tokens` | Token dell'output generato |
| `usage.total_tokens` | Somma dei token di prompt e completion |

### Motivi di interruzione {#finish-reasons}

I motivi di interruzione dipendono dal provider. I valori comuni compatibili con OpenAI includono:

| Valore | Significato tipico |
|-------|---------|
| `stop` | Fine naturale della risposta o raggiungimento di una sequenza di stop |
| `length` | Raggiunto il limite `max_tokens`: la risposta è stata troncata |

Considera i valori sconosciuti come output valido del provider invece di rifiutare la risposta.

## Risposte in streaming {#streaming-responses}

Per un output in tempo reale (come un chatbot che scrive), usa lo streaming. La risposta arriva come Server-Sent Events (SSE):

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

### Formato SSE dello streaming {#streaming-sse-format}

Uno stream compatibile emette di solito Server-Sent Events come questi:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Punti chiave:

- consuma i chunk in ordine e accoda eventuali frammenti `delta.content`
- tollera chunk con soli metadati, delta vuoti e campi compatibili con il provider che non riconosci
- fermati quando lo stream si chiude o arriva il suo marcatore finale; Chat Completions usa di solito `data: [DONE]`
- non dare per scontato che ogni modello emetta il primo o l'ultimo chunk con la stessa identica forma

## Usare l'SDK Anthropic {#using-the-anthropic-sdk}

SandBase espone anche un endpoint compatibile con Anthropic in `POST /v1/messages`. Usa l'SDK Anthropic cambiando `base_url`:

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

### Struttura della risposta Anthropic {#anthropic-response-structure}

L'endpoint compatibile con Anthropic restituisce una risposta in stile Anthropic. Una tipica risposta testuale ha questo aspetto:

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

| Campo | Descrizione |
|-------|-------------|
| `id` | ID del messaggio (con prefisso `msg_`) |
| `type` | Tipo di oggetto messaggio, di norma `"message"` |
| `role` | Ruolo del messaggio generato, di norma `"assistant"` |
| `content` | Array di blocchi di contenuto tipizzati; non dare per scontato che ogni blocco sia testo |
| `model` | Il modello che ha generato la risposta |
| `stop_reason` | `"end_turn"` (interruzione naturale), `"max_tokens"` (limite raggiunto) o `"stop_sequence"` |
| `usage.input_tokens` | Token del tuo input |
| `usage.output_tokens` | Token dell'output generato |

### Streaming con Anthropic {#anthropic-streaming}

Lo streaming con l'SDK Anthropic funziona allo stesso modo: basta passare `stream=True`:

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

## Scegliere un modello {#choosing-a-model}

Quando scegli un modello, controlla la sua scheda aggiornata per disponibilità, prezzi, lunghezza del contesto, input supportati e funzionalità. Questi valori cambiano in modo indipendente, quindi non affidarti a un confronto tra modelli copiato altrove.

- Sfoglia il [catalogo dei modelli](https://www.sandbase.ai/models) aggiornato.
- Apri la pagina di un modello nel catalogo per vedere i campi di richiesta specifici del modello.
- Interroga `GET /v1/models` quando un'integrazione ha bisogno dei metadati aggiornati dei modelli in modo programmatico.

Per i modelli che condividono la stessa interfaccia compatibile, il cambio di modello di solito parte dal parametro `model`. Ricontrolla le funzionalità e lo schema del modello selezionato prima di riportare campi facoltativi, tool, input multimediali o impostazioni di output strutturato.

## Passaggi successivi {#next-steps}

Prima di andare in produzione, imposta i timeout delle richieste, ripeti solo gli errori transitori con un backoff esponenziale limitato, registra gli ID delle richieste quando disponibili e monitora l'utilizzo senza registrare nei log prompt o API key.

- [**Riferimento API**](/api-reference/): endpoint di inferenza e contratti della Platform API
- [**Guida allo streaming**](/guides/streaming): pattern di streaming avanzati e gestione degli errori
- [**Modelli**](https://www.sandbase.ai/models): scoperta dei modelli, funzionalità e prezzi aggiornati
- [**Errori**](/guides/error-handling): gestire errori e retry
