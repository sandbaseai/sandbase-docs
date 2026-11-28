---
i18nSource: a86346e2696c732c
title: FAQ
description: Domande frequenti su come collegare strumenti AI, il catalogo SandBase, Models, API, Agents, Sessions e fatturazione.
---

# Domande frequenti {#frequently-asked-questions}

## Che cos'è SandBase? {#what-is-sandbase}

SandBase aiuta gli Agents a connettersi al mondo reale.

Puoi usare Models e API pronti all'uso, usarli dai tuoi strumenti AI dopo averli collegati in AI tools, oppure creare Agents riutilizzabili ed eseguirli nelle Sessions.

## A chi si rivolge SandBase? {#who-is-sandbase-for}

SandBase si rivolge principalmente a tre gruppi:

- **utenti di strumenti AI** che vogliono funzionalità utili dentro Codex, Claude, Cursor o Kiro
- **sviluppatori** che vogliono chiamare direttamente Models e API
- **FDE e team** che creano Agents riutilizzabili per clienti o flussi di lavoro interni

## Dove posso consultare le funzionalità? {#where-do-i-browse-capabilities}
Il sito web di SandBase elenca il catalogo delle funzionalità:

- [Models](https://www.sandbase.ai/models) e [modelli di immagini e video](https://www.sandbase.ai/models/image-video)
- [API](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
A seconda del tipo di funzionalità, puoi esaminarla, provarla, installarla, chiamarla o clonarla.

## Che cos'è AI tools? {#what-is-ai-tools}

**Build → AI tools** nella Console collega SandBase allo strumento AI che usi già, come Claude Code, Codex, Cursor o Kiro. Incolla `set up https://www.sandbase.ai/SKILL.md` nel tuo agente, oppure esegui `npx -y @sandbaseai/cli@latest connect`. Lo strumento collegato può cercare ed eseguire il catalogo SandBase di Models e API, con addebito sul tuo workspace. Vedi [Collegare strumenti AI](/setup/).

## Che cos'è Build Agent? {#what-is-build-agent}

Build Agent è il luogo in cui definisci e provi un Agent.

Un Agent combina istruzioni, un Model, Skills e tool MCP in un unico flusso di lavoro riutilizzabile e con versioni.

## Un Agent è diverso da un'API? {#is-an-agent-different-from-an-api}
Sì. Un Agent è una configurazione con versioni che modifichi e provi, e lo esegui creando una Session. La tua app può creare Sessions con l'[API Sessions](/api-reference/sessions/) mentre continui a modificare l'Agent.

## Che cosa sono le Sessions? {#what-are-sessions}
Una Session è un'esecuzione di un Agent con la relativa conversazione, attività dei tool e output.

## Come do a un Agent l'accesso ad API esterne? {#how-do-i-give-an-agent-access-to-external-apis}

Collega il sistema esterno come server MCP e aggiungilo alle connessioni MCP dell'Agent. Se il server richiede un token Bearer, salvalo con l'[API Secrets](/agents/api-credentials#with-the-api) come Secret di sola scrittura associato all'URL di quel server. I token vengono inviati solo a quel server e non compaiono mai nei prompt né nel runtime dell'Agent. Vedi [Credenziali per i tool MCP](/agents/api-credentials).

## Dove si trovano i Models? {#where-do-models-live}

I Models hanno un proprio [catalogo](https://www.sandbase.ai/models) perché sono elementi costitutivi importanti.

Puoi chiamare un Model direttamente, usarlo da uno strumento AI collegato o usarlo all'interno di un Agent.

## Devo scrivere codice? {#do-i-need-to-write-code}

Non sempre.

[Collega il tuo strumento AI](/setup/) se vuoi usare le funzionalità al suo interno senza scrivere codice.

Usa l'API Reference se vuoi chiamare SandBase dalla tua applicazione.

Usa Build Agent se ti serve un lavoro riutilizzabile in più passaggi.

## Come ottengo una API key? {#how-do-i-get-an-api-key}

Apri la Console, vai su **Developer → API Keys** e seleziona **New key**.

Usa la chiave così:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Come funziona la fatturazione? {#how-does-billing-work}

SandBase usa crediti e una fatturazione basata sull'utilizzo.

Models, API, Agents e lavoro di runtime possono avere costi diversi. Controlla nella Console l'utilizzo e i prezzi aggiornati.

## Passaggi successivi {#next-steps}

- [Primi passi](/getting-started/)
- [Catalogo di Models e API](https://www.sandbase.ai/models)
- [Collegare strumenti AI](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
