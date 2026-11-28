---
i18nSource: 95410ff7ea741f64
title: Guida agli errori leggibile dall'AI
description: Gestisci gli errori dell'API di SandBase per famiglia di endpoint, stato HTTP, sicurezza dei retry e forma documentata della risposta.
---

# Gestione degli errori per client AI {#error-handling-for-ai-clients}

SandBase non espone un unico schema di errore universale. Valuta prima lo stato HTTP, poi analizza la forma della risposta
documentata per la famiglia di endpoint. Non dare per scontato che ogni risposta contenga `code`, `param`, `request_id` o un
messaggio specifico.

## Forme pubbliche delle risposte {#public-response-shapes}

Il middleware principale di `/v1/*` e diversi endpoint di modelli o risorse restituiscono un errore piatto:

```json
{"error":"organization rate limit exceeded"}
```

Le risorse della piattaforma Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) restituiscono un oggetto in stile OpenAI con un `code` stabile. Vedi [Errori della piattaforma Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

I gateway compatibili con OpenAI mantengono un envelope compatibile con OpenAI. `POST /v1/messages` mantiene
l'envelope compatibile con Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Gestione degli stati HTTP {#http-status-handling}

| Stato | Significato | Azione del client |
|---|---|---|
| `400` | Input non valido o parametro non supportato | Correggi la richiesta secondo lo schema dell'endpoint e del modello selezionati. |
| `401` | Credenziale mancante, non valida, revocata o scaduta | Sostituisci o ruota la credenziale; non riprovare senza modifiche. |
| `402` | La richiesta non può essere finanziata o è stato raggiunto un limite di spesa | Risolvi i limiti di fatturazione o della chiave prima di riprovare. |
| `403` | La credenziale non ha i permessi, oppure una superficie di compatibilità mappa un errore di spesa su 403 | Esamina l'envelope documentato e usa una chiave autorizzata. |
| `404` | Modello o risorsa non trovati | Verifica il nome attuale del modello o l'ID della risorsa. |
| `409` | Conflitto di stato della risorsa | Leggi lo stato più recente della risorsa prima di decidere se un retry è sicuro. |
| `429` | Limite di richieste dell'organizzazione o limite di concorrenza video | Riprova con backoff esponenziale limitato e jitter. |
| `500`, `502`, `503`, `504` | Errore transitorio di SandBase o a monte | Riprova solo quando l'operazione può essere ripetuta in sicurezza. |

## Messaggi di autenticazione e limiti di frequenza {#authentication-and-rate-limit-messages}

I messaggi di autenticazione documentati includono:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Una chiave con ambito limitato usata fuori dal proprio ambito restituisce invece `403` con un corpo annidato: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Le risorse della piattaforma Agents restituiscono lo stesso `code` nel proprio envelope.

Il messaggio documentato per il limite di frequenza è `organization rate limit exceeded` (il limite di richieste al minuto assegnato
all'organizzazione, condiviso da tutte le sue chiavi API). Al momento una risposta `429` non include gli header `Retry-After` o
`X-RateLimit-*` e non esiste un valore predefinito universale pubblicato per RPM o concorrenza.

## Ricerca di modelli e risorse {#model-and-resource-lookup}

Usa `GET /v1/models` per scoprire gli ID dei modelli abilitati e `GET /v1/models/{id_or_name}` per esaminare un modello prima
dell'esecuzione. Tratta l'ID di una risorsa come opaco e verificalo con la relativa operazione di elenco o lettura. Non costruire un
URL di polling diverso a partire dal prefisso di un ID.

## Algoritmo di retry {#retry-algorithm}

Usa un backoff esponenziale limitato con jitter:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Applica queste regole:

- riprova un `429` dopo un ritardo calcolato dal client;
- riprova le risposte `5xx` transitorie solo un numero piccolo e limitato di volte;
- non riprovare una richiesta `400`, `401`, `402`, `403` o `404` senza modifiche;
- verifica l'idempotenza prima di ripetere qualsiasi richiesta di creazione, attivazione o azione esterna;
- conserva l'output parziale quando uno stream fallisce e decidi se è sicuro continuare o ricominciare;
- riporta al chiamante lo stato HTTP finale e l'errore specifico dell'endpoint ripulito.

## Errori della piattaforma Agents {#agents-platform-errors}

Agents, Session, Skills, connessioni MCP e Secrets restituiscono un unico envelope. Per la maggior parte dei codici, `message` è una frase fissa e sicura; `invalid_request` può contenere una breve spiegazione, ad esempio quale forma di input o opzione non è supportata. Basa la logica su `code`, non su `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` è `authentication_error` per 401, `server_error` per 5xx e `invalid_request_error` negli altri casi.

| HTTP | `code` | Significato | Cosa fare |
|---|---|---|---|
| 400 | `invalid_request` | Campi malformati o sconosciuti, validazione non superata o un'opzione non supportata | Correggi la richiesta; non riprovare senza modifiche |
| 400 | `skill_not_found` | Una Skill o una versione referenziata non è disponibile | Correggi `skills` dell'Agent |
| 401 | `unauthorized` | Header della chiave API mancanti, non validi o in conflitto | Controlla `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Limite di spesa della chiave o saldo dell'organizzazione esaurito | Aggiungi crediti o aumenta il limite |
| 403 | `insufficient_scope` | La chiave ha un ambito limitato e non può usare le risorse Agents | Usa una chiave standard creata dalla Console |
| 403 | `org_disabled` | L'organizzazione non è autorizzata a eseguire Agents | Contatta il supporto |
| 404 | `not_found` | La risorsa non esiste nella tua organizzazione | Controlla l'ID |
| 409 | `conflict` | `row_version` non aggiornato, uno stato che non consente la modifica o un `Idempotency-Key` riusato con un corpo diverso | Rileggi la risorsa, poi decidi |
| 409 | `session_input_pending` | Un input precedente è ancora in consegna | Attendi; non reinviarlo con una nuova chiave |
| 409 | `session_input_expired` | L'accettazione dell'input è scaduta | Esamina la cronologia prima di inviare di nuovo |
| 409 | `session_environment_unavailable` | L'ambiente di esecuzione non è disponibile | Attendi o crea una nuova Session |
| 413 | `request_too_large` | Il corpo della richiesta, o la configurazione della Session congelata a partire da esso, supera il limite di dimensione | Invia un corpo più piccolo; non riprovare senza modifiche |
| 429 | `quota_exceeded` | Quota degli Agents superata | Riprova più tardi |
| 502 | `executor_rejected`, `executor_contract_error` | Il livello di esecuzione ha rifiutato la richiesta o ha risposto in modo inatteso | Controlla la configurazione dell'Agent, poi riprova |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Una dipendenza è temporaneamente non disponibile | Riprova con backoff e lo stesso `Idempotency-Key` |

Può comparire anche `skill_runtime_incompatible`; viene restituito come 503 con il messaggio `internal error`.

## Errori durante lo streaming {#streaming-failures}

Dopo l'inizio di una risposta in streaming, un errore può arrivare nel formato dello stream del protocollo invece che come nuovo
stato HTTP. Considera lo stream incompleto, chiudilo, conserva gli eventuali contenuti parziali necessari all'applicazione e
riprova solo quando la richiesta può essere ripetuta in sicurezza.

## Vedi anche {#see-also}

- [Codici di errore](/api-reference/errors): formati di risposta pubblici e stati HTTP comuni
- [Limiti di frequenza](/guides/rate-limiting): gestione dei 429 e distribuzione delle richieste
- [Errori e retry](/guides/error-handling): pattern di implementazione
- [Autenticazione](/api-reference/authentication): credenziali supportate e ciclo di vita delle chiavi
