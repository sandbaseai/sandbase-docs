---
i18nSource: ac4e3b9b9eef4c7d
title: Errori dell'API
description: Gestisci gli errori dell'API SandBase in base allo stato HTTP, alla famiglia di endpoint, alla forma di risposta documentata e alla sicurezza dei retry.
---

# Errori dell'API {#api-errors}

SandBase usa i codici di stato HTTP standard, ma non espone un unico body di errore universale. Ramifica prima in base allo stato HTTP, poi analizza lo schema di risposta documentato per l'endpoint che hai chiamato. Non presumere che ogni errore contenga `code`, `param`, `message` o `request_id`.

## Forme della risposta {#response-shapes}

Il middleware principale e diversi endpoint `/v1/*` restituiscono un errore piatto:

```json
{"error":"organization rate limit exceeded"}
```

Le risorse della piattaforma Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) restituiscono un oggetto in stile OpenAI con un `code` stabile. Vedi [Errori della piattaforma Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

La Events API dei webhook (`/events/webhooks*`) restituisce `{"code":<http status>,"message":"..."}`. Vedi [Webhook](/api-reference/webhooks#authentication-and-errors).

Gli endpoint compatibili con OpenAI mantengono un envelope compatibile con OpenAI. `POST /v1/messages` mantiene un envelope compatibile con Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Usa la [specifica OpenAPI](/openapi.yaml) per i codici di stato e gli schemi esatti di un'operazione pubblica.

## Gestione degli stati HTTP {#http-status-handling}

| Stato | Significato tipico | Azione del client |
|---|---|---|
| `400` | Input non valido o parametro non supportato | Correggi la richiesta in base allo schema dell'endpoint e del modello selezionato. |
| `401` | Credenziale mancante, non valida, revocata o scaduta | Sostituisci o ruota la credenziale; non ritentare senza modifiche. |
| `402` | La richiesta non può essere coperta o è stato raggiunto un limite di spesa | Risolvi il problema di saldo o del limite della chiave prima di ritentare. |
| `403` | La credenziale non ha i permessi, oppure un endpoint di compatibilità mappa un errore di spesa su 403 | Esamina l'envelope specifico dell'endpoint e usa una chiave autorizzata. |
| `404` | Il modello o la risorsa non è disponibile per il chiamante | Verifica l'ID corrente del modello o della risorsa. |
| `409` | Conflitto sullo stato della risorsa | Leggi lo stato più recente prima di decidere se un retry è sicuro. |
| `422` | Input della risorsa semanticamente non valido | Correggi i valori dei campi documentati. |
| `429` | Limite di richieste dell'organizzazione o limite di concorrenza video | Ritenta con backoff limitato e jitter quando l'operazione può essere ripetuta in sicurezza. |
| `500`, `502`, `503`, `504` | Errore di SandBase o upstream | Ritenta solo quando l'operazione può essere ripetuta in sicurezza. |

Non tutti gli endpoint documentano ogni stato di questa tabella. La mappa delle risposte OpenAPI dell'operazione è la fonte autorevole.

## Errori di autenticazione {#authentication-errors}

I messaggi di autenticazione documentati includono:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Una chiave con scope usata al di fuori del suo scope restituisce invece `403` con un body annidato: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Le risorse della piattaforma Agents restituiscono lo stesso `code` nel proprio envelope.

Usa `Authorization: Bearer $SANDBASE_API_KEY` per gli endpoint standard. `POST /v1/messages` accetta anche `x-api-key`; gli endpoint compatibili con il protocollo Google documentano i propri header di chiave supportati.

Una chiave revocata non può essere riattivata. Creane una sostitutiva, aggiorna l'applicazione che la usa, verificala e poi rimuovi tutti i riferimenti rimasti alla vecchia chiave.

## Limiti di frequenza {#rate-limits}

`organization rate limit exceeded` (`429`) significa che la tua organizzazione ha raggiunto il limite di richieste al minuto assegnato, condiviso da tutte le sue chiavi API. Gli endpoint compatibili con un protocollo lo restituiscono nel proprio envelope. SandBase non pubblica un unico limite numerico universale perché il limite viene assegnato per organizzazione.

Se una risposta include `Retry-After`, rispettalo. Altrimenti usa un backoff esponenziale limitato con jitter. Vedi [Limiti di frequenza](/guides/rate-limiting) per i pattern di distribuzione delle richieste.

L'invio delle attività prevede due controlli aggiuntivi. `organization concurrency limit exceeded` (`429`) significa che la tua organizzazione ha già in corso tante attività quante ne consente il suo livello di account; il blocco si risolve quando un'attività in esecuzione termina. Si applica a tutti i tipi di modello su `POST /v1/run` e `/v1/api/*`, e agli invii video sugli altri endpoint. `insufficient credit for estimated video cost` (`402`) significa che il costo stimato supera il tuo saldo più la linea di credito; ricarica prima di ritentare. Vedi [Limiti di concorrenza](/guides/concurrency-limits).

## Sicurezza dei retry {#retry-safety}

Segui questo ordine di decisione:

1. Stabilisci se l'operazione ha già prodotto un effetto visibile all'esterno.
2. Non ritentare senza modifiche una richiesta `400`, `401`, `402`, `403`, `404` o `422`.
3. Per un `409`, leggi lo stato corrente della risorsa prima di ritentare.
4. Ritenta le risposte `429` e `5xx` transitorie solo un numero ridotto e limitato di volte.
5. Prima di ripetere una richiesta di creazione, attivazione, upload o azione esterna, verifica che l'operazione sia idempotente o che la tua applicazione possa riconciliare i duplicati.

Un ritardo adeguato è:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Errori della piattaforma Agents {#agents-platform-errors}

Agents, Sessions, Skills, connessioni MCP e Secrets restituiscono un unico envelope. Per la maggior parte dei codici, `message` è una frase fissa e sicura; `invalid_request` può contenere una breve spiegazione, ad esempio quale forma di input od opzione non è supportata. Ramifica in base a `code`, non a `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` è `authentication_error` per 401, `server_error` per 5xx e `invalid_request_error` negli altri casi.

| HTTP | `code` | Significato | Cosa fare |
|---|---|---|---|
| 400 | `invalid_request` | Campi malformati o sconosciuti, validazione non superata o opzione non supportata | Correggi la richiesta; non ritentare senza modifiche |
| 400 | `skill_not_found` | Una Skill o versione referenziata non è disponibile | Correggi le `skills` dell'Agent |
| 401 | `unauthorized` | Header della chiave API mancanti, non validi o in conflitto | Controlla `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Limite di spesa della chiave o saldo dell'organizzazione esaurito | Aggiungi crediti o aumenta il limite |
| 403 | `insufficient_scope` | La chiave ha uno scope e non può usare le risorse Agents | Usa una chiave standard creata dalla Console |
| 403 | `org_disabled` | L'organizzazione non è autorizzata a eseguire Agent | Contatta il supporto |
| 404 | `not_found` | La risorsa non esiste nella tua organizzazione | Controlla l'ID |
| 409 | `conflict` | `row_version` obsoleto, uno stato che non consente la modifica o un `Idempotency-Key` riutilizzato con un body diverso | Rileggi la risorsa, poi decidi |
| 409 | `session_input_pending` | Un input precedente è ancora in fase di consegna | Attendi; non reinviare con una nuova chiave |
| 409 | `session_input_expired` | L'accettazione dell'input è scaduta | Esamina la cronologia prima di inviare di nuovo |
| 409 | `session_environment_unavailable` | L'ambiente di esecuzione non è disponibile | Attendi o crea una nuova Session |
| 413 | `request_too_large` | Il body della richiesta, o la configurazione della Session congelata a partire da esso, supera il limite di dimensione | Invia un body più piccolo; non ritentare senza modifiche |
| 429 | `quota_exceeded` | Quota Agents superata | Ritenta più tardi |
| 502 | `executor_rejected`, `executor_contract_error` | Il livello di esecuzione ha rifiutato la richiesta o ha risposto in modo imprevisto | Controlla la configurazione dell'Agent, poi ritenta |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Una dipendenza è temporaneamente non disponibile | Ritenta con backoff e lo stesso `Idempotency-Key` |

Può comparire anche `skill_runtime_incompatible`; viene restituito come 503 con il messaggio `internal error`.

## Errori durante lo streaming {#streaming-failures}

Dopo l'avvio di uno stream, un errore può arrivare nel formato di stream di quel protocollo invece che come nuova risposta HTTP. Considera lo stream incompleto, conserva l'eventuale output parziale che serve alla tua applicazione e ritenta solo quando rigenerare la richiesta è sicuro. Non presumere che ogni provider emetta lo stesso evento terminale o lo stesso motivo di completamento.

## Debug operativo {#operational-debugging}

Registra l'endpoint, lo stato HTTP, l'ID del modello o della risorsa selezionata, il timestamp e qualsiasi identificatore di richiesta sicuro restituito dal server. Non registrare mai nei log header di autorizzazione, chiavi API, valori delle credenziali o contenuti sensibili dei prompt.

Usa [Developer → Activities](https://www.sandbase.ai/console/activities) per esaminare la cronologia delle richieste dell'organizzazione. Quando segnali un errore persistente, includi i metadati della richiesta ripuliti e la richiesta riproducibile più piccola possibile.

## Vedi anche {#see-also}

- [Autenticazione](/api-reference/authentication)
- [Errori e retry](/guides/error-handling)
- [Limiti di frequenza](/guides/rate-limiting)
- [Guida agli errori leggibile dall'AI](/for-agents/errors)
