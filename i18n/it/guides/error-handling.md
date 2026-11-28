---
i18nSource: f63049c1cf01130e
title: Errori e retry
description: Classifica gli errori dell'API SandBase, decidi quando un retry è sicuro e conserva una diagnostica utile senza esporre secret.
---

# Errori e retry {#errors-and-retries}

Gestisci gli errori in base allo stato HTTP, alla famiglia di endpoint e alla semantica dell'operazione. SandBase espone diversi protocolli compatibili,
quindi non esiste un'unica struttura JSON di errore condivisa da tutti gli endpoint.

## Leggi la struttura di errore dell'endpoint {#read-the-endpoint-s-error-shape}

- Le operazioni compatibili con OpenAI restituiscono normalmente un oggetto `error` con un messaggio e un tipo.
- Anthropic Messages restituisce envelope di errore compatibili con Anthropic.
- Le operazioni principali della piattaforma possono restituire un body piatto `{ "error": "..." }` o un errore documentato specifico della risorsa.
- Le operazioni Google e native dei provider mantengono la struttura del protocollo compatibile, dove documentato.

Usa lo stato HTTP della risposta e il body documentato. Non dare per obbligatori campi facoltativi come `code`, `param` o
`request_id`, a meno che l'endpoint selezionato non li garantisca. Vedi il [riferimento agli errori dell'API](/api-reference/errors) per
gli esempi e la [specifica OpenAPI](/openapi.yaml) per le risposte specifiche di ogni operazione.

## Decidi cosa fare in base allo stato {#decide-what-to-do-by-status}

| Stato | Causa tipica | Azione consigliata |
|---|---|---|
| `400` / `422` | Body, parametro non valido o funzionalità del modello non supportata | Correggi la richiesta prima di ritentare. |
| `401` | Credenziale mancante, non valida, scaduta o revocata | Sostituisci la credenziale. |
| `402` | Lo stato di fatturazione non consente la richiesta | Risolvi il problema di saldo dell'account o del controllo della spesa. |
| `403` | Scope della credenziale o accesso alla risorsa insufficienti | Usa una chiave o una risorsa autorizzata. |
| `404` | Modello, task o risorsa della piattaforma non trovati | Verifica l'identificatore e l'organizzazione. |
| `409` | Conflitto di stato della risorsa o di operazioni concorrenti | Leggi lo stato attuale, poi decidi se ritentare. |
| `429` | SandBase o un provider upstream ha limitato la richiesta | Rispetta `Retry-After` se presente; altrimenti applica un backoff con jitter. |
| `500` / `502` / `503` / `504` | Errore interno, upstream o di disponibilità temporanea | Ritenta solo se ripetere l'operazione è sicuro. |

Questa tabella è una guida alla gestione, non una garanzia che ogni endpoint emetta ogni stato.

## Usa una policy di retry limitata {#use-a-bounded-retry-policy}

Per una richiesta che si può ripetere in sicurezza, usa un backoff esponenziale con jitter, limita il ritardo e imponi un budget complessivo di richieste.
Disabilita i retry dell'SDK se un livello applicativo esterno ritenta già, oppure tieni conto di entrambi i livelli quando imposti il budget.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Quando una risposta include `Retry-After`, leggilo e rispettalo invece di usare il ritardo di fallback. Mantieni la policy
configurabile; il numero di tentativi e la scadenza corretti dipendono dal budget di latenza e di costo del chiamante.

## Proteggiti dagli effetti collaterali duplicati {#protect-against-duplicate-side-effects}

Ripetere una richiesta di inferenza crea una nuova generazione e può comportare costi aggiuntivi. È accettabile solo quando
l'applicazione ha bisogno di una qualsiasi risposta valida e può tollerare la rigenerazione.

Sii più prudente con le operazioni che creano, aggiornano, eliminano, pubblicano, pianificano o avviano lavoro:

- usa il supporto all'idempotenza documentato quando un endpoint lo offre;
- altrimenti leggi lo stato attuale prima di ripetere una richiesta dall'esito incerto;
- non ripetere mai una chiamata a un tool solo perché lo stream del modello che la conteneva si è disconnesso;
- conserva un ID di operazione del client nel tuo sistema quando devi riconciliare i retry.

## Gestisci timeout e stream separatamente {#handle-timeouts-and-streams-separately}

Un timeout non dimostra che il server abbia smesso di elaborare la richiesta. Prima di ritentare un'operazione asincrona o che modifica lo stato,
interroga, quando possibile, lo stato documentato della risorsa o del task.

Per le risposte in streaming, distingui un errore HTTP prima dell'avvio dello stream da una disconnessione dopo un output parziale.
Solo il normale segnale di terminazione del protocollo dimostra che lo stream è completo. Vedi [Risposte in streaming](/guides/streaming).

## Registra diagnostica utile e sicura {#log-useful-safe-diagnostics}

Registra:

- endpoint e identificatore del modello;
- stato HTTP e tipo di errore compatibile, se presente;
- identificatore del provider o della richiesta, se restituito;
- numero di tentativi, tempo trascorso e se sono arrivati byte di risposta.

Non registrare API key, valori delle credenziali, prompt sensibili completi né risposte dei provider non oscurate. Mostra agli utenti un messaggio conciso
e utile, conservando per gli operatori una diagnostica sanificata.

## Indicazioni correlate {#related-guidance}

- [Riferimento agli errori dell'API](/api-reference/errors)
- [Rate limit](/guides/rate-limiting)
- [Risposte in streaming](/guides/streaming)
- [Autenticazione](/api-reference/authentication)
