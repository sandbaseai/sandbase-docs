---
i18nSource: d326fdb78ea64bdf
title: Limiti di frequenza
description: Gestisci in sicurezza i limiti di frequenza dell'API di SandBase con retry limitati, jitter, code e richieste che tengono conto dell'idempotenza.
---

# Limiti di frequenza {#rate-limits}

SandBase può assegnare alla tua organizzazione un limite di richieste al minuto. È condiviso da tutte le chiavi API dell'organizzazione
e calcolato su una finestra mobile di un minuto. Anche i provider di modelli a monte possono restituire le proprie risposte
`429 Too Many Requests`. Non inserire una quota fissa nel codice a meno che SandBase non ne abbia assegnata una al tuo carico di lavoro.

## Il limite della tua organizzazione {#your-organization-s-limit}
SandBase non pubblica un numero fisso di richieste al minuto, perché il limite viene assegnato per organizzazione. Ogni
chiave API dell'organizzazione conta per lo stesso limite, quindi creare altre chiavi non lo aumenta. Al momento il limite non è
mostrato né nell'API pubblica né nella Console.

Se il tuo carico di lavoro ha bisogno di un limite garantito o più alto, contatta il supporto di SandBase indicando organizzazione, applicazione,
frequenza stabile prevista e frequenza di picco prevista. Non progettare un client di produzione attorno a un valore numerico predefinito non documentato.

## Gestire una risposta 429 {#handle-a-429-response}

Le risposte di limite di frequenza generate dalla piattaforma su `/v1/*` usano un corpo di errore piatto:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Il limite dell'organizzazione si applica a `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload` e agli endpoint Gemini `generateContent`, `streamGenerateContent` e `POST /v1beta/interactions`. Gli endpoint di polling come
`GET /v1/run/{id}` non vengono conteggiati. Gli endpoint compatibili con altri protocolli restituiscono lo stesso `429` nel proprio envelope di errore,
ad esempio nel formato di errore di Anthropic o Google. Una risposta originata dal provider può usare il formato di errore dell'endpoint compatibile
e può includere gli header di limite di frequenza del provider.

Gli header `Retry-After` e quelli della quota residua non sono garantiti. Se `Retry-After` è presente, rispettalo. Altrimenti usa
un backoff esponenziale con jitter e un numero massimo di tentativi.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

L'SDK di OpenAI supporta anche retry integrati tramite `max_retries`. Scegli consapevolmente tra i retry dell'SDK e un ciclo di retry
nell'applicazione, così i retry non si moltiplicano tra i livelli.

## Riprovare solo le operazioni sicure {#retry-only-safe-operations}

Una richiesta di inferenza ripetuta può creare una seconda generazione e comportare costi aggiuntivi. Riprovala solo quando la tua
applicazione accetta una nuova generazione. Non riprovare automaticamente una richiesta che modifica lo stato, a meno che l'operazione non documenti
l'idempotenza o la tua applicazione non possa dimostrare che il primo tentativo non è riuscito.

Per le richieste in streaming, di solito un `429` arriva prima dell'inizio dello stream. Una volta arrivati dei byte, considera una disconnessione
come una generazione interrotta invece di presumere un errore di limite di frequenza. Conserva o scarta l'output parziale in base ai
requisiti del tuo prodotto; ricominciare crea una nuova generazione.

## Controllare il throughput {#control-throughput}

- Limita la concorrenza invece di rilasciare tutto insieme un batch illimitato.
- Metti in coda il lavoro a picchi e regolarizza la frequenza di invio.
- Evita richieste duplicate e metti in cache i risultati riutilizzabili quando i requisiti di privacy e aggiornamento lo consentono.
- Usa chiavi separate per titolarità, controlli di spesa e revoca, non per aggirare i limiti della piattaforma.
- Registra endpoint, modello, stato HTTP e corpo dell'errore ripulito per la risoluzione dei problemi.
- Contatta il supporto di SandBase quando un carico di lavoro ha bisogno di un limite di capacità assegnato o più alto.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

La concorrenza non equivale alle richieste al minuto. Regola entrambe in base alla latenza osservata e alla capacità assegnata alla
tua applicazione.

::: info Chiamate API gratuite giornaliere
Le 100 chiamate gratuite alle API di dati per giorno UTC dell'organizzazione sono una quota di fatturazione, non un limite di frequenza. Le chiamate oltre la quota
vengono addebitate per chiamata invece di essere rifiutate. Vedi [Chiamate API gratuite giornaliere](/guides/billing#daily-free-api-calls).
:::

::: tip Task video
Gli invii di video sono limitati anche dal numero di task che la tua organizzazione può eseguire contemporaneamente, in base al livello dell'account.
Quel `429` riporta `organization concurrency limit exceeded` e si risolve quando un task in esecuzione termina, non dopo un intervallo di tempo. Vedi
[Limiti di concorrenza](/guides/concurrency-limits).
:::

## Indicazioni correlate {#related-guidance}

- [Gestione degli errori](/guides/error-handling)
- [Streaming](/guides/streaming)
- [Riferimento agli errori API](/api-reference/errors)
- [Chiavi API](/getting-started/api-keys)
