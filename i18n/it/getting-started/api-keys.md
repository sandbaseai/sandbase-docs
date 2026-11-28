---
i18nSource: 3dc57d405dbf561d
title: Chiavi API
description: Come creare, gestire e proteggere le chiavi API di SandBase per autenticare le richieste API.
---

# Chiavi API {#api-keys}

Le chiavi API autenticano le tue richieste a SandBase. Questa guida spiega come creare le chiavi, usarle nelle richieste e mantenerle al sicuro.

## Creare una chiave API {#create-an-api-key}

1. Accedi alla [SandBase Console](https://www.sandbase.ai/console)
2. Apri **Developer → API Keys** (oppure vai direttamente a [API Keys](https://www.sandbase.ai/console/keys))
3. Fai clic su **New key**
4. Inserisci un **Name** descrittivo (ad es. "Production Server", "Local Development")
5. Facoltativamente imposta uno **Spending limit** (vuoto significa illimitato) e una data **Expires** (vuoto significa nessuna scadenza)
6. Fai clic su **Create key**
7. Copia subito la chiave dal banner **API key created**: verrà mostrata una sola volta

::: danger Importante
La chiave API viene mostrata una sola volta, al momento della creazione. Se la perdi, dovrai crearne una nuova. Conservala in un luogo sicuro prima di chiudere la finestra di dialogo.
:::

## Formato della chiave {#key-format}

Le nuove chiavi API create nella Console usano il prefisso `sk-` seguito da 64 caratteri esadecimali:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Le chiavi `sk-sb-...` esistenti restano valide finché non scadono o vengono revocate. Non usare il solo prefisso per convalidare una
credenziale; tratta sempre il valore completo come un segreto opaco.

## Metodi di autenticazione {#authentication-methods}

SandBase supporta due modi per passare la chiave API nelle richieste:

### Header Authorization (consigliato) {#authorization-header-recommended}

Usa l'header standard `Authorization: Bearer`. È compatibile con gli SDK di OpenAI e Anthropic:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: header x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` accetta anche l'header nativo di Anthropic `x-api-key`:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Tra i gateway dei modelli, solo `POST /v1/messages` legge `x-api-key`, che ha la precedenza quando sono presenti entrambi gli header
supportati. Anche le [risorse della piattaforma Agents](/api-reference/authentication#agents-platform-resources) accettano
`X-API-Key`. Usa l'header Bearer per tutti gli altri endpoint pubblici.
:::

## Permessi della chiave {#key-permissions}

Le chiavi API di SandBase hanno ambito a **livello di organizzazione**:

- Una chiave standard creata dalla Console può chiamare le risorse API pubbliche disponibili per l'organizzazione
- L'utilizzo viene addebitato all'organizzazione proprietaria della chiave
- Una chiave può avere una scadenza e un limite di spesa facoltativi
- Le credenziali emesse da SandBase, come le chiavi CLI Login, possono avere uno scope limitato e restituire `403` al di fuori di tale scope

Al momento la Console non consente di scegliere gli scope di una chiave standard. Le chiavi CLI Login vengono create quando colleghi uno strumento AI. La pagina API Keys le raggruppa in un'unica riga espandibile **CLI Login** e non possono essere modificate come le chiavi standard. Le chiavi che SandBase crea per te hanno il badge **Auto-created**; non hanno un limite a livello di chiave e sono vincolate dal saldo dell'account.

L'elenco delle chiavi mostra **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** e **Status** per ogni chiave. Usa **Edit** per modificare il nome, il limite di spesa o la scadenza di una chiave standard.

Tratta ogni chiave come una credenziale applicativa e non come una password personale. Usa l'appartenenza all'organizzazione per l'accesso delle persone e le chiavi API per i carichi di lavoro.

## Strategia per ambiente {#environment-strategy}

Crea una chiave diversa per ogni applicazione e ambiente:

| Chiave | Nome di esempio | Perché |
|---|---|---|
| Sviluppo locale | `research-app-dev` | Ruotala senza interrompere la produzione |
| Staging | `research-app-staging` | Isola l'utilizzo di test e gli incidenti |
| Produzione | `research-app-production` | Dai alla produzione un responsabile chiaro e un'esposizione limitata |
| Automazione temporanea | `release-check-2026-08` | Imposta una scadenza e revocala in modo indipendente |

Annota il responsabile e il deployment che usa ciascuna chiave. Durante la rotazione, distribuisci la nuova chiave, verifica che le richieste vadano a buon fine e solo allora revoca la vecchia chiave.

## Scadenza e revoca delle chiavi {#key-expiration-and-revocation}

### Scadenza {#expiration}

Quando crei una chiave, puoi facoltativamente impostare una data di scadenza. Una volta scaduta, la chiave smette di funzionare e le richieste restituiscono un errore `401 Unauthorized`.

Le chiavi senza data di scadenza restano valide finché non vengono revocate manualmente.

### Revocare una chiave {#revoking-a-key}

Per revocare (disattivare) una chiave:

1. Vai a [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Trova la chiave che vuoi revocare
3. Fai clic su **Revoke**
4. Conferma l'azione

Le chiavi revocate non possono autenticare nuove richieste. La revoca non può essere annullata: se revochi una chiave per errore, creane una nuova.

## Best practice di sicurezza {#security-best-practices}

### Non eseguire mai il commit delle chiavi nel controllo di versione {#never-commit-keys-to-version-control}

Usa invece variabili d'ambiente o un gestore di segreti:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Usa chiavi separate per ambienti diversi {#use-separate-keys-for-different-environments}

Crea chiavi distinte per sviluppo, staging e produzione. In questo modo puoi revocare una chiave di sviluppo compromessa senza influire sulla produzione.

### Ruota regolarmente le chiavi {#rotate-keys-regularly}

Crea periodicamente nuove chiavi e dismetti quelle vecchie. Così limiti la finestra di esposizione in caso di fuga di una chiave.

### Monitora l'attività {#monitor-activity}

Controlla regolarmente **Developer → Activities** per individuare picchi imprevisti di richieste o di utilizzo, che potrebbero indicare una chiave compromessa. **Request History** può filtrare per chiave API.

Se una chiave viene esposta, revocala immediatamente, creane una sostitutiva, aggiorna l'applicazione che la usa ed esamina Activities e la fatturazione per individuare utilizzi imprevisti. Non aspettare una rotazione programmata.

### Imposta date di scadenza {#set-expiration-dates}

Per gli accessi temporanei (pipeline CI/CD, accessi di collaboratori esterni, demo), imposta una data di scadenza in modo che la chiave smetta di funzionare automaticamente.

## Risoluzione dei problemi {#troubleshooting}

| Errore | Causa | Soluzione |
|-------|-------|-----|
| `401 - missing API key` | Nessuna chiave fornita nella richiesta | Aggiungi un header `Authorization: Bearer <key>` |
| `401 - invalid API key` | La chiave non esiste | Controlla eventuali errori di battitura e assicurati di includere la chiave completa |
| `401 - API key has been revoked` | La chiave è stata revocata definitivamente nella Console | Crea una chiave sostitutiva |
| `401 - API key has expired` | La chiave ha superato la data di scadenza | Crea una nuova chiave o estendi la scadenza |
| `402 - API key spending limit exceeded` | La chiave ha raggiunto il limite di spesa configurato | Aumenta il limite o usa un'altra chiave autorizzata |
| `403 - insufficient_scope` | Una credenziale con scope non può chiamare questo endpoint | Usa una chiave autorizzata per l'endpoint |

## Passaggi successivi {#next-steps}

- [**Prima chiamata API**](/getting-started/first-call): esegui una chiamata API dettagliata con una spiegazione completa di richiesta e risposta
- [**Autenticazione**](/api-reference/authentication): header supportati, ciclo di vita ed errori specifici del protocollo
- [**Riferimento API**](/api-reference/): documentazione completa degli endpoint
