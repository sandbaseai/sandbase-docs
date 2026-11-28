---
i18nSource: 28b1ef75a197824a
title: Collegare strumenti AI
description: Fornisci a Claude Code, Codex, Cursor, Kiro e ad altri strumenti AI il catalogo SandBase di modelli e API con un solo prompt o un solo comando CLI.
---

# Collegare strumenti AI {#connect-ai-tools}

La pagina [AI tools](https://www.sandbase.ai/console/setup) della Console (**Build → AI tools**) collega SandBase all'agent o allo strumento AI che usi già. Gli strumenti collegati possono cercare nel catalogo SandBase di modelli e API, leggere lo schema di input e il prezzo di ciascuno strumento ed eseguirlo. Ogni chiamata viene addebitata al workspace attivo.

I client supportati includono Claude Code, Codex, Cursor, Kiro IDE e Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop e ChatGPT. La pagina AI tools elenca il set aggiornato.

## Avvio rapido: incolla un prompt {#quick-start-paste-one-prompt}

Incolla questa riga nel tuo agent:

```text
set up https://www.sandbase.ai/SKILL.md
```

L'agent legge la Skill di SandBase, installa la CLI e ti chiede di approvare un accesso dal browser. Non devi incollare alcuna chiave API. Quando l'agent segnala che il client è configurato, avvia una nuova sessione o riavvia l'app per caricare gli strumenti `sandbase_*`.

La Skill richiede Node.js 20 o versioni successive sulla macchina che esegue l'agent.

## Altri modi per collegarsi {#other-ways-to-connect}

### CLI {#cli}

Collegati da un terminale. Senza `--client`, la CLI configura tutti i client supportati che trova:

```sh
npx -y @sandbaseai/cli@latest connect
```

Per configurare un solo client, passa il suo id, ad esempio `codex`, `claude-code`, `cursor` o `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Lo script di installazione esegue lo stesso comando:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Per elencare i client riconosciuti dall'installer senza modificare la configurazione locale:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` apre l'autorizzazione nel browser, crea una chiave **CLI Login** per il workspace che approvi e scrive solo la configurazione dei client di proprietà di SandBase. La [SandBase CLI](https://github.com/sandbaseai/cli) open source documenta ogni client.

### Client MCP configurati manualmente {#mcp-clients-you-configure-by-hand}

Gli utenti che hanno effettuato l'accesso vedono l'indirizzo del server MCP in **Other ways to connect** nella pagina [AI tools](https://www.sandbase.ai/console/setup). Autenticalo con una [chiave API](/getting-started/api-keys) creata in **Developer → API Keys** e conserva la chiave nella configurazione dei segreti del client.

## Verificare la connessione {#verify-the-connection}

L'installazione o l'autorizzazione da sole non dimostrano che un client sia collegato. Verifica che:

- il server o il connettore SandBase sia visibile nel client
- gli strumenti `sandbase_*` siano individuabili in una nuova sessione
- una richiesta sicura in linguaggio naturale vada a buon fine

Per i client gestiti dalla CLI, esegui la diagnostica dopo esserti ricollegato o aver modificato la configurazione:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` controlla la credenziale locale, la voce MCP e la Skill, poi esegue un round trip verso SandBase. Esegui sempre la chiamata finale allo strumento all'interno del client stesso.

Le esecuzioni effettuate dagli strumenti collegati compaiono in [Activities](https://www.sandbase.ai/console/activities) con il relativo costo.

## Risoluzione dei problemi {#troubleshooting}

| Problema | Cosa controllare |
|---|---|
| Gli strumenti non compaiono | Avvia una nuova sessione del client o riavvia l'app, esegui `npx -y @sandbaseai/cli doctor --client <client>` e riprova. |
| Manca l'autorizzazione | Esegui di nuovo `connect` e approva l'accesso dal browser per il workspace a cui vuoi addebitare i costi. |
| Le chiamate falliscono con HTTP 402 | Aggiungi credito in [Billing](https://www.sandbase.ai/console/billing) per il workspace attivo. |

## Rimuovere la configurazione gestita {#remove-the-managed-configuration}

Rimuovi solo la voce di proprietà di SandBase per un client:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

Il comando rimuove solo la configurazione di cui può verificare la proprietà SandBase e lascia invariate le voci non correlate o gestite dall'utente. Poi revoca la chiave **CLI Login** corrispondente in **Developer → API Keys** se non ti serve più.

## Codice sorgente e supporto {#source-and-support}

- [Codice sorgente](https://github.com/sandbaseai/cli)
- [Pacchetto npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Domande ed esempi](https://github.com/sandbaseai/cli/discussions)
- [Segnalazione di bug](https://github.com/sandbaseai/cli/issues/new/choose)

## Passaggi successivi {#next-steps}

- [Catalogo di modelli e API](https://www.sandbase.ai/models)
- [Tutorial sulle Skill](/guides/skills/)
- [Crea un Agent](/agents/)
