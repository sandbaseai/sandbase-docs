---
i18nSource: fc051d55a0cfa8bd
title: Limiti di concorrenza
description: Quante attività la tua organizzazione può eseguire contemporaneamente, come il limite cresce con il livello dell'account e come gestire 429 e 402 sugli invii video.
---

# Limiti di concorrenza {#concurrency-limits}

I limiti di concorrenza stabiliscono quante attività la tua organizzazione può avere in corso contemporaneamente. Ogni organizzazione ha un livello di account, e il livello determina il suo limite di concorrenza. Quando raggiungi il limite, i nuovi invii sugli endpoint controllati elencati sotto vengono rifiutati con `429` finché una delle tue attività in esecuzione non termina. Non vengono messi in coda.

Il limite si applica all'intera organizzazione, su tutte le chiavi API. Quali invii vengono controllati dipende dall'endpoint:

- `POST /v1/run` e le chiamate alla Platform API tramite `/v1/api/{vendor}/...` vengono controllati per ogni tipo di modello, incluse le operazioni di immagine, audio, LLM e API di dati.
- Gli altri endpoint, come Chat Completions, Responses, Messages, OpenAI Images e gli endpoint Gemini e Volcengine compatibili con il protocollo, controllano solo gli invii video.

## Come funziona {#how-it-works}

Quando invii un'attività controllata, SandBase conta le attività che la tua organizzazione ha attualmente in corso, cioè quelle nello stato `pending` o `running`. Se il conteggio ha già raggiunto il limite, l'invio viene rifiutato immediatamente con `429`. Non viene creata alcuna attività e non viene addebitato nulla.

Il conteggio include ogni richiesta in corso nella tua organizzazione, non solo i video. Una chat completion in streaming ancora aperta quando invii un'attività controllata occupa uno slot. Se la stessa organizzazione esegue chat in streaming lunghe e job video, tienine conto in fase di pianificazione della capacità.

Uno slot si libera non appena un'attività raggiunge uno stato finale (`completed`, `failed` o `timeout`). Non devi rilasciare nulla dal tuo lato. Poiché gli slot si liberano quando le attività terminano e non in base a un timer, questo `429` è diverso da un [limite di frequenza](/guides/rate-limiting) al minuto. Attendere un intervallo fisso non garantisce uno slot. Attendi invece che una delle tue attività termini.

## Limiti predefiniti {#default-limits}

Ogni nuova organizzazione parte dal livello **Bronze**, con un limite di 2 attività simultanee. Il tuo livello aumenta automaticamente in base all'importo di una singola ricarica andata a buon fine.

| Livello | Ricarica singola | Attività simultanee |
|-------|---------------|------------------|
| Bronze | Predefinito | 2 |
| Silver | $10 o più | 10 |
| Gold | $100 o più | 100 |
| Platinum | $500 o più | 500 |
| Diamond | Contatta il team commerciale | Illimitate |

- **Ricarica singola, non un totale cumulativo.** Due ricariche da $60 ti mantengono a Silver. Una ricarica da $100 ti porta a Gold.
- **Solo avanzamenti.** Una ricarica successiva più piccola non abbassa mai il tuo livello.
- **Solo ricariche a pagamento.** Crediti promozionali, crediti di registrazione e coupon non cambiano il tuo livello.
- **Effetto immediato.** Il nuovo limite si applica al tuo prossimo invio video non appena il pagamento va a buon fine.

## Aumentare il limite {#increasing-your-limit}

Il modo più diretto per aumentare il limite è una singola ricarica che raggiunga la soglia successiva della tabella precedente.

Per più di 500 attività simultanee, o per una linea di credito mensile, scrivi a [contact@sandbase.ai](mailto:contact@sandbase.ai) per il livello **Diamond**. Diamond non ha limiti di concorrenza. Viene configurato dal team SandBase e non cambia mai con le ricariche.

## Verifica del credito sugli invii video {#credit-check-on-video-submissions}

Oltre al controllo della concorrenza, SandBase stima il costo di ogni attività video prima di accettarla. Se la stima supera il credito disponibile (saldo più l'eventuale linea di credito), l'invio viene rifiutato con `402`. Non viene creata alcuna attività e non viene addebitato nulla.

- Ogni invio viene confrontato con il saldo corrente. Le attività ancora in esecuzione non sono ancora state addebitate, quindi lascia un margine quando invii più video contemporaneamente.
- Se il prezzo di un modello dipende da un output che esiste solo dopo l'esecuzione, il costo non può essere stimato in anticipo. L'invio viene accettato e addebitato normalmente al termine dell'attività.

## Gestire gli errori di concorrenza {#handling-concurrency-errors}

### 429: limite di concorrenza raggiunto {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

Non viene inviato alcun header `Retry-After`. Il limite è noto in anticipo, quindi l'approccio più affidabile è non superarlo mai. Limita lato client il numero di attività video in corso e invia la successiva solo dopo che una precedente è terminata:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Se ricevi comunque un `429`, ad esempio perché anche un altro servizio della stessa organizzazione sta inviando attività, attendi e ritenta. Usa un backoff esponenziale con jitter e rinuncia dopo un numero limitato di tentativi invece di ritentare in un ciclo serrato.

### 402: credito insufficiente per questo video {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Non ritentare. Ricarica, oppure scegli una durata più breve o una risoluzione più bassa che costi meno.

### API compatibili {#compatible-apis}

Gli endpoint compatibili con un protocollo restituiscono questi errori nel proprio formato nativo. Ad esempio, l'endpoint compatibile con Volcengine `/api/v3/contents/generations/tasks` restituisce `RateLimitExceeded` per `429` e `AccountOverdueError` per `402`.

## Argomenti correlati {#related}

- [Limiti di frequenza](/guides/rate-limiting): limiti di richieste al minuto
- [Prezzi](/guides/billing): crediti e ricariche
- [Errori](/api-reference/errors): tutti i codici di errore
