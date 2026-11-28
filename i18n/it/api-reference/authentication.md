---
i18nSource: 5b94f91222d138de
title: Autenticazione API
description: Autentica le API di SandBase con Bearer token e con gli header di API key compatibili con i protocolli supportati.
---

# Autenticazione {#authentication}

SandBase usa le API key per autenticare le richieste all'API pubblica. Questa pagina descrive i metodi di integrazione supportati e
le buone pratiche di gestione delle chiavi. L'autenticazione della Console e le sue API interne non fanno parte del contratto dell'API pubblica.

## Metodi di autenticazione {#authentication-methods}

Gli endpoint standard `/v1/*` di SandBase richiedono un Bearer token. Le operazioni Anthropic Messages e quelle compatibili con Google Gemini accettano anche le posizioni dell'API key previste dai rispettivi SDK nativi.

### Bearer token {#bearer-token}

Includi la chiave nell'header `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

È il metodo standard usato dagli SDK compatibili con OpenAI.

### Anthropic Messages: header x-api-key {#anthropic-messages-x-api-key-header}

Includi la chiave nell'header `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Questo header è supportato solo da `POST /v1/messages`. Gli altri endpoint pubblici non lo leggono; usa l'autenticazione
Bearer per Chat Completions, `/v1/run` e le API delle risorse.

### Priorità {#priority}

Solo per `POST /v1/messages`, se sono presenti entrambi gli header, `x-api-key` ha la priorità.

### API key compatibili con Google Gemini {#google-gemini-compatible-api-keys}

Le operazioni Gemini GenerateContent e Interactions accettano `x-goog-api-key`, `Authorization: Bearer …` o il parametro di query `key`, in quest'ordine di priorità. Preferisci un header, perché le credenziali nella query string possono comparire nei log e nella cronologia del browser. Consulta [Google Gemini](/api-reference/gemini-generate-content) e [Gemini Interactions](/api-reference/gemini-interactions) per i percorsi supportati.

### Logica di estrazione {#extraction-logic}

Gli endpoint standard leggono solo `Authorization: Bearer <key>`. Il middleware di Anthropic Messages legge prima `x-api-key`
e poi ripiega sull'header Bearer. Le risorse della piattaforma Agents accettano `Authorization: Bearer` o
`X-API-Key` (vedi sotto). Anche la [webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) accetta entrambi gli
header e usa l'header Bearer se sono presenti entrambi. Una credenziale supportata mancante restituisce `401 Unauthorized`.

### Risorse della piattaforma Agents {#agents-platform-resources}

`/v1/agents*` (incluso `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
e `/v1/skills*` accettano la chiave in uno qualsiasi dei due header:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Se invii sia `Authorization: Bearer` sia `X-API-Key`, devono contenere la stessa chiave; valori diversi restituiscono `401 unauthorized`. Anche ripetere uno dei due header restituisce 401.
- `OpenAI-Beta` è facoltativo. Se presente, deve essere `agents=v1`.
- Le richieste di lettura richiedono il permesso `agents.read` e le scritture `agents.write`. Le chiavi standard create dalla Console li hanno entrambi. Le chiavi con ambito limitato emesse da SandBase, come le chiavi CLI Login, restituiscono `403 insufficient_scope`.
- `402 spending_limit_exceeded` significa che il limite di spesa della chiave o il saldo dell'organizzazione è esaurito.
- Gli errori usano l'[envelope di errore degli Agent](/api-reference/errors#agents-platform-errors), non la forma piatta `{"error": "…"}` mostrata più sotto.

## Formato delle API key {#api-key-format}

Le nuove API key create dalla Console hanno questo formato:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Componente | Descrizione |
|-----------|-------------|
| `sk-` | Prefisso standard "secret key" |
| `xxxx...` | 64 caratteri esadecimali generati da 32 byte casuali |

Le chiavi legacy `sk-sb-...` restano utilizzabili finché non scadono o vengono revocate. I client devono trattare le chiavi come stringhe opache
invece di rifiutare una credenziale in base al prefisso o alla lunghezza.

::: warning
Non esporre mai la tua API key nel codice lato client, nei repository pubblici o nei log. Trattala come una password.
:::

## Creare API key {#create-api-keys}

### Dalla Console {#via-console}

1. Accedi alla [Console SandBase](https://www.sandbase.ai/console)
2. Apri **Developer → API Keys**
3. Fai clic su **New key**
4. Dai alla chiave un nome descrittivo (ad es. "Production Backend", "Development")
5. Copia subito la chiave: non verrà più mostrata

### Proprietà della chiave {#key-properties}

| Proprietà | Descrizione |
|----------|-------------|
| Nome | Etichetta leggibile per identificare la chiave |
| Organizzazione | L'organizzazione a cui appartiene la chiave |
| Abilitata | Indica se la chiave è attiva |
| Limite di spesa | Tetto di spesa facoltativo per singola chiave |
| Scadenza | Data di scadenza facoltativa |
| Data di creazione | Quando è stata creata la chiave |

Le chiavi standard create dalla Console hanno accesso a livello di organizzazione all'API pubblica documentata. Le credenziali emesse da SandBase, come le chiavi CLI Login, possono avere un ambito limitato. La Console non permette di scegliere gli ambiti per le chiavi standard.

## Ciclo di vita delle chiavi {#key-lifecycle}

### Rotazione {#rotation}

Per ruotare una chiave:

1. Crea una nuova chiave nella Console
2. Aggiorna l'applicazione per usare la nuova chiave
3. Verifica che la nuova chiave funzioni in produzione
4. Revoca la vecchia chiave

::: tip
Crea sempre la nuova chiave prima di revocare la vecchia, per evitare interruzioni del servizio.
:::

### Revoca {#revocation}

Le chiavi revocate non possono autenticare nuove richieste. L'API restituisce `401 Unauthorized` con il messaggio:

```json
{"error":"API key has been revoked"}
```

### Scadenza {#expiration}

Le chiavi possono avere una data di scadenza facoltativa. Le chiavi scadute restituiscono `401 Unauthorized` con il messaggio:

```json
{"error":"API key has expired"}
```

## Requisiti di autenticazione degli endpoint {#endpoint-authentication-requirements}

| Endpoint | Metodo di autenticazione | Descrizione |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API key (Bearer) | Chat Completions |
| `POST /v1/responses` | API key (Bearer) | Responses API compatibile con OpenAI |
| `POST /v1/messages` | API key (Bearer o x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API key (x-goog-api-key, Bearer o key in query) | Gemini GenerateContent |
| `/v1beta/interactions*` | API key (x-goog-api-key, Bearer o key in query) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API key (Bearer o X-API-Key) | Risorse della piattaforma Agents |

La Console SandBase usa un flusso di autenticazione separato per il browser. Le sue richieste interne non sono endpoint pubblici
supportati e non devono essere usate dalle integrazioni.

## Isolamento tra organizzazioni {#organization-isolation}

Le API key hanno come ambito un'organizzazione. Quando ti autentichi con una chiave:

- Puoi accedere solo alle risorse della tua organizzazione
- Utilizzo e fatturazione vengono registrati per organizzazione

## Risposte di errore {#error-responses}

| Stato HTTP | Messaggio | Causa |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Nessuna chiave fornita |
| 401 | `invalid API key` | Chiave non trovata nel database |
| 401 | `API key has been revoked` | La chiave è stata disabilitata |
| 401 | `API key has expired` | La chiave ha superato la data di scadenza |
| 402 o 403 specifico del protocollo | `API key spending limit exceeded` | Raggiunto il limite di spesa della chiave; consulta il contratto di errore documentato dell'endpoint |
| 403 | `API key is not authorized for this endpoint` | Chiave con ambito limitato usata su un endpoint fuori dal suo ambito |

Questi messaggi arrivano nel corpo piatto `{"error":"<message>"}`, tranne gli errori di ambito `403`. Sugli endpoint dei modelli e dell'account
questi usano `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
sulle risorse della piattaforma Agents usano l'[envelope di errore degli Agent](/api-reference/errors#agents-platform-errors) con
`code` `insufficient_scope`.

## Buone pratiche di sicurezza {#security-best-practices}

### Da fare {#do}

- **Conserva le chiavi in variabili d'ambiente**: non inserire mai le chiavi direttamente nel codice sorgente
- **Usa chiavi separate per ogni ambiente**: chiavi diverse per dev, staging e produzione
- **Imposta date di scadenza**: scegli un intervallo di rotazione adeguato alla tua policy di sicurezza
- **Monitora l'utilizzo**: controlla nella Console eventuali attività impreviste
- **Usa chiavi standard solo per i carichi di lavoro che richiedono l'accesso all'API pubblica**: lascia le credenziali CLI Login con ambito limitato nel loro flusso gestito

### Da non fare {#don-t}

- **Non fare commit delle chiavi nel controllo di versione**: aggiungi `.env` a `.gitignore`
- **Non condividere una chiave tra applicazioni non correlate**: chiavi separate rendono più sicure la rotazione e la gestione degli incidenti
- **Non esporre le chiavi nel codice lato client**: passa sempre attraverso un proxy sul tuo backend
- **Non registrare le API key nei log**: oscura le chiavi nei log dell'applicazione

### Esempio di variabile d'ambiente {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Limiti di frequenza per chiave {#rate-limiting-by-key}

I limiti delle richieste sono assegnati per organizzazione e condivisi da tutte le sue API key, quindi creare più chiavi non aumenta
il limite. L'API non pubblica un valore numerico predefinito
universale né header sulla quota residua.

Consulta [Rate Limiting](/guides/rate-limiting) per i dettagli sui limiti e sulla gestione delle risposte 429.
