---
i18nSource: 8cb9626a2127cb8d
title: Avvio rapido
description: "Scegli come usare SandBase: sulla piattaforma, tramite l'API o con il tuo Agent. Trova Skills e Tools, segui i passaggi e parti dai repository dell'SDK o della CLI."
pageClass: quickstart-page
---

# Avvio rapido {#quick-start}

## Scegli come usare SandBase {#connect}

Queste sono **tre modalità alternative per iniziare**, non tre passaggi da completare. Usa lo stesso account e lo stesso workspace SandBase in tutte.

<QuickstartPaths />

Ti serve solo un'attività pronta all'uso? [Esplora i Tools](#use-tools) oppure [scegli una Skill](#use-skills). Puoi consultare i cataloghi pubblici e la documentazione anche prima di accedere.

### Parti dai repository open source {#start-from-the-open-source-repositories}

- **[SandBase — SDK ed esempi](https://github.com/sandbaseai/sandbase)**: client Python, TypeScript e Go, esempi di API e flussi di lavoro per Agents ospitati. Usalo quando sviluppi una tua applicazione.
- **[SandBase CLI e MCP](https://github.com/sandbaseai/cli)**: installa e collega il tuo strumento AI, oppure individua ed esegui funzionalità da terminale. Usalo con il tuo Agent esistente.

## Prima di iniziare: accedi {#create-account}

Accedi prima di usare un Playground, eseguire una Skill ospitata o creare una API key. Gli strumenti gratuiti che funzionano senza account si possono usare direttamente. **Hai già effettuato l'accesso? Salta questo passaggio** e verifica che il menu dell'account mostri il workspace che intendi usare.

SandBase usa GitHub o Google. Non esiste una registrazione separata con email e password.

1. Apri [Crea account / Accedi](https://www.sandbase.ai/login){target="_blank"}.
2. Completa il controllo di sicurezza, poi scegli **Sign in with GitHub** o **Sign in with Google**.
3. Approva l'accesso nella finestra del provider.
4. Torna alla pagina che stavi usando oppure apri la [Console](https://www.sandbase.ai/console){target="_blank"}.

Il primo accesso crea il tuo account e un **workspace personale**. Non devi creare un'organizzazione per provare SandBase.

Se compare un credito di benvenuto, puoi iniziare senza aggiungere un metodo di pagamento. La scheda **Balance** nella Dashboard della Console e la pagina [Billing](https://www.sandbase.ai/console/billing){target="_blank"} mostrano il saldo attuale.

## Sulla piattaforma {#use-on-website}

Scegli questa modalità se vuoi provare prima un Model, un'API o un Agent nel browser, senza installare client e senza scrivere codice.

1. Accedi, poi apri il catalogo:
   - [Modelli linguistici](https://www.sandbase.ai/models){target="_blank"}
   - [Modelli di immagini e video](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [API](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Apri la pagina di dettaglio di un modello o di un'API e seleziona **Playground**, se disponibile.
3. Inserisci gli input richiesti, ad esempio un prompt, un'immagine, una query di ricerca o un URL. Controlla il prezzo mostrato prima di eseguire.
4. Esegui la richiesta e visualizza il testo, i dati, l'immagine, il video o lo stato del task restituiti.

Per il Playground del sito non serve creare una API key separata. Se una funzionalità non offre un Playground, usa la sua scheda **API** e segui il percorso API qui sotto.

## Tramite l'API {#call-api}

Scegli questa modalità se stai aggiungendo una funzionalità alla tua app.

1. Riusa una chiave valida per il workspace che intendi usare, oppure crea una [API key](/getting-started/api-keys) in [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} con **New key**. Copiala subito: viene mostrata una sola volta.
2. Filtra il catalogo e apri una pagina di dettaglio:
   - [Modelli linguistici](https://www.sandbase.ai/models){target="_blank"}: filtra per provider, funzionalità, contesto e prezzo
   - [Modelli di immagini e video](https://www.sandbase.ai/models/image-video){target="_blank"}: filtra i modelli multimodali come text-to-image, image-to-image, text-to-video e image-to-video
   - [API](https://www.sandbase.ai/apis){target="_blank"}: filtra le risorse API per piattaforma e fonte dati
3. Apri la scheda **API**, copia la richiesta di esempio e compila i campi obbligatori di quell'endpoint.
4. Salva la tua chiave SandBase in una variabile d'ambiente lato server ed esegui la richiesta. Non inserirla nel codice del browser né in un repository pubblico.
5. Controlla la risposta. Per un task asincrono, segui l'esempio di polling dello stato dell'endpoint finché non viene completato.

Esempio di chiamata a un modello linguistico per **Bash / zsh** (macOS, Linux o Windows con WSL). Sostituisci localmente la chiave segnaposto. Per altri ambienti, usa gli esempi Python, TypeScript o Go nel repository qui sotto; i comandi shell non sono intercambiabili con PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Parti dal codice: [SDK ed esempi SandBase su GitHub](https://github.com/sandbaseai/sandbase).

Per saperne di più: [Prima chiamata API](/getting-started/first-call).

## Con il tuo Agent {#use-in-ai-tool}

Scegli questa modalità se usi Claude Code, Codex, Cursor, Kiro o un altro client supportato e vuoi i Models e le API SandBase all'interno di quell'app.

**Per la configurazione locale automatica:** il tuo client deve poter eseguire comandi e la sua macchina deve avere Node.js 20+ con npm. Se usi un client solo chat, segui invece le [istruzioni di connessione specifiche per il client](/setup/).

1. Apri [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} nella Console.
2. Incolla questa riga nella chat del tuo assistente AI, poi digli cosa vuoi realizzare. È un'istruzione per la chat, non un comando shell:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Approva l'accesso dal browser che l'agente apre. Non c'è nessuna API key da incollare.
4. Avvia una nuova sessione o riavvia l'app in modo che i tool SandBase vengano caricati.
5. Chiedi all'agente di individuare ed esaminare il tool pertinente, poi di effettuare una sola richiesta circoscritta, entro la tua autorizzazione e il tuo budget. Per lo sviluppo, chiedigli di integrare la risposta nel tuo progetto e di fornirti il comando di esecuzione e i risultati effettivi dei test. La sola individuazione non verifica una chiamata API di business.

Preferisci il terminale? Esegui `npx -y @sandbaseai/cli@latest connect`. Configura i client supportati che rileva; per configurarne uno solo, usa `npx -y @sandbaseai/cli@latest connect --client codex` (sostituisci `codex` con il tuo client supportato). Poi riavvia quel client. Controlla il workspace selezionato prima di un'esecuzione a pagamento.

Ad esempio, puoi chiedere:

> Trova un'API SandBase per cercare post pubblici su X riguardo agli agenti AI. Esamina prima gli input obbligatori e il prezzo, poi dimmi il costo di una richiesta prima di eseguirla. Mantieni nel risultato i link alle fonti originali.

Sorgenti e istruzioni di installazione: [SandBase CLI e MCP su GitHub](https://github.com/sandbaseai/cli).

Per saperne di più: [Collegare strumenti AI](/setup/).

### Fatti aiutare dal tuo assistente AI {#start-with-your-agent}

La [Skill di configurazione](https://www.sandbase.ai/SKILL.md) guida il tuo agente in base alla tua situazione attuale: nessun account, una API key esistente, uno strumento già collegato, un progetto esistente o una nuova funzionalità. Controlla gli input e il prezzo dell'endpoint, aiuta a implementare l'integrazione e distingue la configurazione da una chiamata verificata e da una funzionalità funzionante. Indicagli il tuo obiettivo e un eventuale limite di spesa; non incollare la tua chiave nella chat.

Hai già una chiave o un progetto? Dillo; non devi ricominciare da capo. Ad esempio: “Ho una chiave SandBase. Aggiungi a questo progetto una ricerca del traffico Similarweb; esamina l'API e mostrami prima il costo del test dal vivo.” Un assistente che non può eseguire comandi o caricare tool ha bisogno del [percorso di configurazione specifico per il client](/setup/).

[Dai al tuo agente l'Avvio rapido in Markdown](https://www.sandbase.ai/quickstart.md), oppure segui i passaggi qui sotto. Installare la Skill di configurazione non crea di per sé un Agent ospitato.

### Facoltativo: esegui un Agent ospitato su SandBase {#build-agent}

Scegli questa modalità se il lavoro prevede più passaggi o deve essere riutilizzato.

1. Apri [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} e seleziona **Create**.
2. Compila **Overview** e **Instructions**.
3. Scegli un **Model**.
4. Aggiungi Skills e tool MCP in **Capabilities**, poi imposta **Runtime**.
5. Seleziona **Create & Chat** per provarlo in una Session.
6. Chiama la versione provata dalla tua app tramite la scheda **API** dell'Agent.

Per saperne di più: [Build Agent](/agents/). Per fare lo stesso da codice con l'SDK ufficiale di OpenAI, vedi [Compatibilità con OpenAI](/agents/openai-compatibility).

## Skills, Tools e altri modi per sviluppare {#skills-and-tools}

Scegli la risorsa adatta al tuo compito. Per usare un'API non devi installare una Skill né creare un Agent ospitato.

- **[Tools](https://www.sandbase.ai/tools):** completa un'attività specifica in un'interfaccia pronta, ad esempio formattare un testo o cercare dati pubblici.
- **[Skills](https://www.sandbase.ai/skills):** fornisci a un agente un flusso di lavoro riutilizzabile con istruzioni, script ed esempi.
- **Models e API:** chiama una funzionalità da un Playground, dal tuo codice o da un agente collegato. Esplora i [modelli linguistici](https://www.sandbase.ai/models), [immagini e video](https://www.sandbase.ai/models/image-video) o le [API dati](https://www.sandbase.ai/apis).
- **[Agents ospitati](/agents/):** configura ed esegui un agente riutilizzabile su SandBase.
- **[Sandboxes](/sandbox/):** fornisci al codice un ambiente isolato in cui essere eseguito e lavorare con i file.

### Usare un Tool {#use-tools}

1. Apri [Tools](https://www.sandbase.ai/tools) e scegli l'attività che vuoi completare.
2. Leggi i requisiti di input del tool e l'etichetta di prezzo o quota. Le utility gratuite possono funzionare senza account; i tool di dati richiedono l'accesso a SandBase per essere eseguiti, e i test dei modelli possono richiedere una tua chiave.
3. Inserisci il testo, l'URL, il file o gli altri input richiesti, poi usa l'azione di esecuzione del tool.
4. Controlla l'output e usa l'azione di copia o download, dove disponibile. Per un tool di dati, usa l'API collegata e l'esempio di richiesta se vuoi automatizzare la stessa attività.

**La quota giornaliera gratuita è condivisa dal workspace**, non è un'assegnazione separata per ogni tool. Controlla l'idoneità e il prezzo mostrato prima di eseguire; un'utility gratuita non rende gratuita una chiamata a un modello o a un'API.

### Usare una Skill {#use-skills}

1. Apri [Skills](https://www.sandbase.ai/skills), scegli un flusso di lavoro e leggine esempi, input richiesti e dipendenze.
2. Scegli una delle opzioni disponibili nella pagina di dettaglio della Skill:
   - **Esecuzione online:** accedi ed esegui l'esempio ospitato, se offerto. Segui l'avanzamento e apri l'output o i file risultanti. Controlla la quota mostrata; disponibilità e limiti variano da Skill a Skill.
   - **Installazione / Download:** accedi per scaricare il pacchetto, se offerto. Estrai il pacchetto completo in una cartella di lavoro, poi segui le istruzioni di installazione oppure chiedi al tuo agente locale di leggere il suo `SKILL.md`.
3. Per l'uso locale, indica il compito, gli input, l'output desiderato e il limite di spesa. Collega SandBase seguendo il [percorso con il tuo Agent](#use-in-ai-tool); se gli script della Skill richiedono una chiave, configurala nell'ambiente di esecuzione invece di incollarla nella chat.
4. Controlla il risultato effettivo. Scaricare una Skill o collegare il tuo agente non significa che il flusso di lavoro sia stato eseguito correttamente.

La **Skill di configurazione** di SandBase collega il tuo client; le Skills del catalogo descrivono singoli flussi di lavoro. Controlla le dipendenze e il client supportato di ogni Skill prima di installarla. Le chiamate a modelli e API usate da un flusso di lavoro locale possono comportare costi di utilizzo.

Vedi [Usare una Skill in locale](/guides/skills/local-use) per una procedura completa, incluse le cartelle di input e i risultati salvati.

## Facoltativo: condividi un workspace di team {#create-organization}

API key, utilizzo e fatturazione appartengono a un'organizzazione. Resta nel workspace personale se stai valutando la piattaforma da solo. Crea un team quando più persone condivideranno chiavi e spesa.

| Workspace | Quando usarlo |
|---|---|
| **Personale** | Creato automaticamente al primo accesso. Uno per utente. |
| **Team** | Membri, chiavi e saldo condivisi. Crealo per un'azienda o un progetto. |

### Creare un team {#create-team}

1. Apri [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"}, oppure scegli **Create Team** nel menu dell'account in alto a destra nella Console.
2. Inserisci un **Team name**, poi seleziona **Create team**.
3. Verifica che il menu dell'account mostri ora quel team come workspace attivo.
4. In **Developer → Team**, seleziona **Add member**, inserisci l'**Account email** di un account SandBase esistente e scegli il **Workspace role** (Member o Admin).

La persona invitata deve avere già un account SandBase. Se non ce l'ha, inviale [questa pagina](/getting-started/quickstart) perché possa accedere prima, poi aggiungila.

Se appartieni a più organizzazioni, cambia organizzazione dal menu dell'account. Chiavi e fatturazione seguono l'organizzazione **attiva**. Vedi [Organizzazioni](/admin/organizations) per i ruoli.

## Verifica che funzioni {#confirm-it-works}

Sei pronto quando tutte le condizioni seguenti sono vere:

- Il menu dell'account nella Console mostra l'organizzazione che intendi usare.
- Hai completato un percorso: una chiamata API, un'esecuzione sul sito, uno strumento AI collegato o un Agent.
- Una richiesta va a buon fine.

Se la richiesta non riesce, controlla l'organizzazione attiva, la chiave e la pagina [Errori](/guides/error-handling). Ricarica il saldo in [Billing](https://www.sandbase.ai/console/billing){target="_blank"} quando il workspace non ha più credito.

### Se ti blocchi {#if-you-get-stuck}

| Cosa vedi | Cosa controllare |
| --- | --- |
| Accesso richiesto | Accedi, torna alla pagina originale e controlla il workspace attivo. |
| Chiave non valida o accesso negato | Verifica che la chiave appartenga al workspace previsto e abbia accesso all'endpoint. Aggiungere crediti non risolve i problemi di permessi. |
| Saldo insufficiente o quota esaurita | Leggi la risposta: controlla Billing per un problema di saldo, oppure l'orario di reset mostrato per un limite di quota. |
| Nessun tool nel tuo Agent | Avvia una nuova sessione del client, poi segui la diagnostica in [Collegare strumenti AI](/setup/). |
| Task ancora in esecuzione | Segui lo stato del task restituito o l'indicatore di avanzamento della pagina. Evita di inviare ripetutamente la stessa richiesta a pagamento. |

## Fatturazione e utilizzo {#billing-and-usage}

Dopo aver effettuato l'accesso, controlla la spesa dell'organizzazione attiva:

<QuickstartResources group="ops" />

## Cosa fare dopo {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools): completa un'attività nel browser
- [Skills](https://www.sandbase.ai/skills): trova un flusso di lavoro riutilizzabile per agenti
- [API key](/getting-started/api-keys): crea e ruota le chiavi dell'organizzazione
- [Catalogo di Models e API](https://www.sandbase.ai/models): prova Models, API e Agents sul sito
- [Collegare strumenti AI](/setup/): fornisci al tuo strumento AI il catalogo SandBase
- [Build Agent](/agents/): crea Agents riutilizzabili
- [API Reference](/api-reference/): integra con il codice
