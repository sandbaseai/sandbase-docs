---
i18nSource: 0d7d66842e233794
title: Guida rapida al Sandbox con l'SDK E2B
description: Collega a SandBase gli SDK ufficiali E2B per JavaScript e Python, esegui comandi, leggi e scrivi file e gestisci un sandbox in modo sicuro.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Guida rapida al Sandbox con l'SDK E2B {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Usa l'SDK ufficiale E2B con la tua chiave API SandBase per creare un sandbox isolato, eseguire un comando e leggere e scrivere file. Questa guida si riferisce all'**SDK E2B per JavaScript e Python 2.51.0**.

Per creare e monitorare le istanze dal browser, accedi alla [Sandbox Console](https://www.sandbase.ai/console/sandboxes) per creare un'istanza e visualizzarne stato, log e metriche. Per l'integrazione nelle applicazioni prosegui con i passaggi SDK riportati sotto, oppure leggi la [panoramica del prodotto Sandbox](https://www.sandbase.ai/sandbox).

## 1. Configurare l'SDK ufficiale {#_1-configure-the-official-sdk}

[Crea una chiave API SandBase nella Console](https://www.sandbase.ai/console/keys), poi configura le variabili d'ambiente standard di E2B. L'SDK ufficiale le legge automaticamente sia in JavaScript sia in Python.

| Variabile d'ambiente | Valore |
|---|---|
| `E2B_API_KEY` | La tua chiave API SandBase da [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Lasciala non impostata, così l'SDK usa l'indirizzo del data plane di ciascun sandbox |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Se hai già salvato la chiave in `SANDBASE_API_KEY`, riutilizzala:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Ti serve solo la tua chiave API SandBase. Usa una normale chiave SandBase abilitata all'accesso al Sandbox; una chiave limitata a un'altra funzionalità potrebbe essere rifiutata. Vedi [Chiavi API](/getting-started/api-keys).

### Il codice E2B esistente può restare invariato? {#can-existing-e2b-code-stay-unchanged}

Sì, per le operazioni supportate, se la tua applicazione legge già le impostazioni di connessione dell'SDK dall'ambiente e il suo template è disponibile su SandBase. Mantieni l'SDK ufficiale e le chiamate esistenti; cambia la chiave, l'URL dell'API e il dominio indicati sopra. Le opzioni di connessione esplicite nel codice dell'applicazione hanno la precedenza sulle variabili d'ambiente, quindi rimuovi o aggiorna eventuali endpoint, domini o chiavi del provider E2B scritti direttamente nel codice.

Imposta **sia** `E2B_API_URL` **sia** `E2B_DOMAIN`. Con il solo dominio, l'SDK 2.51.0 ricava un host API con un prefisso `api.` aggiuntivo. `E2B_SANDBOX_URL` sostituisce l'indirizzo per comandi e file di ogni istanza; non impostarlo sull'origine dell'API di controllo. La modalità debug cambia la selezione degli indirizzi dell'SDK per lo sviluppo locale, quindi tienila disattivata per questo servizio HTTPS.

L'API di controllo crea e gestisce le istanze. Comandi, file e porte delle applicazioni usano sottodomini per istanza sotto `sandbox.sandbase.ai`. Non aggiungere il prefisso `/v1` dell'API dei modelli. Una richiesta riuscita all'API di controllo, da sola, non verifica l'accesso a comandi e file né tutte le funzionalità del provider.

Gli esempi leggono le variabili d'ambiente del processo. Un file `.env` funziona solo se la tua applicazione o il launcher lo carica prima di usare l'SDK.

### Scegliere un template {#choose-a-template}

Usa la tua chiave SandBase per elencare i template visibili alla tua organizzazione:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Scegli un template con `buildStatus: "ready"` e copia il suo `templateID`. I nomi visualizzati sono forniti in `names` o `aliases`; se sono entrambi vuoti, usa l'ID. Il campo `public` distingue i template pubblici dai template privati visibili alla tua organizzazione.

La risposta è un array. Se gli header della risposta includono `X-Next-Token`, passa il suo valore come parametro di query `nextToken` per ottenere la pagina successiva.

Imposta l'ID del template selezionato:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` è una variabile usata dagli esempi seguenti, non un'impostazione integrata dell'SDK E2B. Gli esempi la passano esplicitamente a `Sandbox.create`. Il codice esistente può mantenere il proprio argomento template se quell'ID o nome è disponibile su SandBase. Non dare per scontato che un ID di template E2B upstream o il `base` predefinito dell'SDK siano disponibili; se l'elenco è vuoto, richiedi l'accesso ai template per la tua organizzazione.

## 2. Creare, eseguire e ripulire {#_2-create-execute-and-clean-up}

Questi esempi creano una risorsa reale. Usano una durata di due minuti ed eliminano esplicitamente l'istanza in `finally`. Esegui prima un solo esempio e verifica la pulizia prima di eseguirlo di nuovo.

### JavaScript {#javascript}

Usa Node.js 22 o versioni successive nella directory di un'applicazione:

```bash
npm install --save-exact e2b@2.51.0
```

Salva come `sandbox-example.mjs`:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

Esegui con le variabili d'ambiente dell'SDK e il template selezionato configurati:

```bash
node sandbox-example.mjs
```

### Python {#python}

Installa l'SDK con versione fissata nel tuo ambiente Python:

```bash
python -m pip install 'e2b==2.51.0'
```

Salva come `sandbox_example.py`:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

L'esito positivo indica che sia la verifica di comandi e file sia la pulizia sono state completate. Mantieni gli ID di esecuzione e dei sandbox all'interno della tua organizzazione. Non scrivere nei log l'oggetto SDK: può contenere token di accesso.

Se la creazione va in timeout senza restituire un ID, la risorsa potrebbe esistere comunque. Chiedi al tuo operatore di individuarla tramite i metadati `quickstartRunId` prima di crearne un'altra. Un timeout o un processo interrotto non conferma l'eliminazione; `finally` non può essere eseguito dopo una terminazione forzata del processo.

## 3. Estendere la durata oppure mettere in pausa e riconnettersi {#_3-extend-the-lifetime-or-pause-and-reconnect}

Inserisci questi snippet nel blocco `try` dell'esempio corrispondente, dopo il controllo dei file e prima della pulizia. Pausa e ripresa devono essere supportate dal template e dal provider selezionati.

JavaScript usa i **millisecondi** per questi timeout dell'SDK:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python usa i **secondi**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

La riconnessione restituisce un nuovo oggetto SDK e nuove credenziali di sessione. Usa quell'oggetto per i comandi e i file successivi. L'eliminazione di un sandbox ne conclude il ciclo di vita; questa guida non garantisce la persistenza dello storage dopo l'eliminazione. La durata del sandbox e il timeout di un singolo comando o di una richiesta HTTP sono impostazioni diverse.

## 4. Accedere alle porte delle applicazioni {#_4-access-application-ports}

Quando la tua applicazione è in ascolto all'interno del sandbox, usa `sandbox.getHost(port)` in JavaScript o `sandbox.get_host(port)` in Python per ottenerne l'host. Il traffico verso l'applicazione richiede l'header `e2b-traffic-access-token`, con il valore di `sandbox.trafficAccessToken` o `sandbox.traffic_access_token` della connessione corrente.

L'host da solo non autorizza l'accesso. Il tuo client HTTP o WebSocket deve inviare l'header; aprire semplicemente l'URL in una scheda del browser non lo aggiunge. Tratta i token di traffico e gli URL firmati dei file come credenziali e tienili fuori dai log e dai link condivisi. L'accesso alle porte deve essere supportato dall'ambiente sandbox selezionato.

## Risoluzione dei problemi {#troubleshooting}

| Sintomo | Cosa controllare |
|---|---|
| Errore di autenticazione o di scope | Validità della chiave SandBase, accesso dell'organizzazione e scope della chiave |
| Template non trovato | L'ID o il nome esatto del template abilitato e la sua visibilità per la tua organizzazione |
| La creazione riesce ma comandi o file falliscono | La tua connessione di rete e le credenziali di sessione correnti; riconnettiti e contatta il supporto se il problema persiste |
| Le richieste arrivano al servizio sbagliato | `E2B_API_URL`, `E2B_DOMAIN` ed eventuali opzioni dell'SDK scritte nel codice che le sovrascrivono |
| L'accesso fallisce dopo la pausa | Riconnettiti e usa l'oggetto SDK appena restituito |
| La porta dell'applicazione rifiuta una richiesta | La disponibilità dell'applicazione e l'header con il token di traffico corrente |
| `unsupported_operation` | Il provider selezionato non supporta quell'operazione; verificane la disponibilità prima di farvi affidamento |
| La risposta di creazione è sconosciuta | Riconcilia l'ID di esecuzione registrato prima di creare un'altra istanza |
| La pulizia fallisce | Ritenta l'eliminazione per l'ID di istanza registrato; non rieseguire l'intero flusso di creazione |

Gli esempi coprono il flusso di base con comandi e file. Build dei template, snapshot, eventi, webhook e networking avanzato richiedono verifiche separate delle funzionalità. L'installazione di un SDK E2B non dimostra di per sé la piena compatibilità con ogni provider.

## Riferimenti dell'SDK {#sdk-references}

- [Documentazione E2B](https://e2b.dev/docs)
- [SDK JavaScript E2B 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [SDK Python E2B 2.51.0](https://pypi.org/project/e2b/2.51.0/)
