---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: Usa con SandBase chat completions compatibili con OpenAI, streaming, tool, input multimodale e output strutturato.
---

# Chat Completions {#chat-completions}

SandBase offre un endpoint Chat Completions compatibile con OpenAI in `POST /v1/chat/completions`. Le applicazioni esistenti basate sull'SDK OpenAI possono usare SandBase cambiando la API key e il base URL.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Messaggi e contenuti multimodali {#messages-and-multimodal-content}

Invia i messaggi nell'ordine della conversazione usando i ruoli supportati dal provider selezionato, di solito `system`, `developer`, `user`, `assistant` e `tool`. Il testo può essere una stringa. I modelli con supporto alla visione accettano anche parti di contenuto come `text` e `image_url`.

## Streaming {#streaming}

Imposta `stream: true` per ricevere Server-Sent Events. Leggi ogni evento `data:` in ordine e concatena `choices[0].delta.content`. Lo stream termina con `data: [DONE]`. Aggiungi `stream_options: {"include_usage": true}` quando il provider selezionato fornisce l'utilizzo durante lo streaming; altrimenti l'utilizzo potrebbe mancare.

## Tool {#tools}

Definisci le funzioni richiamabili in `tools`. Quando l'assistente restituisce `tool_calls`, esegui ogni funzione nella tua applicazione, poi aggiungi un messaggio `tool` con il `tool_call_id` corrispondente prima di continuare.

## Output strutturato {#structured-output}

Usa `response_format` per richiedere una risposta come oggetto JSON o secondo uno JSON Schema. Il supporto varia in base al modello, quindi controlla le funzionalità del modello selezionato prima di fare affidamento su un'applicazione rigorosa dello schema.

## Parametri specifici del provider {#provider-specific-parameters}

SandBase usa `model` e `stream` per il routing. Gli altri campi di richiesta compatibili con OpenAI vengono preservati quando il provider selezionato usa lo stesso protocollo. Quando SandBase traduce tra protocolli, usa i campi documentati o `extra_body`; il supporto varia in base al provider.

## Errori e retry {#errors-and-retries}

Usa un backoff limitato per i `429` ripetibili e per le risposte transitorie del server, solo quando rigenerare è sicuro. Non ripetere automaticamente richieste malformate, errori di autenticazione o richieste i cui effetti collaterali dei tool potrebbero essersi già verificati. Consulta [Errori e retry](/guides/error-handling). Per lo schema completo di campi e risposte, consulta [Chat Completions API](/api-reference/llm-gateway).
