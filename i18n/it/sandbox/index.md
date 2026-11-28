---
i18nSource: 4191d2eb16a594f5
title: Panoramica e funzionalità di Sandbox
description: Crea sandbox con l'SDK E2B o con la SandBase Console, controlla stato, log e metriche, ed esplora il Playground sperimentale separato.
---

# Panoramica e funzionalità di Sandbox {#sandbox-overview-and-capabilities}

Sandbox fornisce ambienti isolati per eseguire comandi, eseguire codice e leggere o scrivere file. Metti in pausa un'istanza, riconnettiti e rileggi un file per verificare la persistenza.

[Guida rapida / SDK E2B](./quickstart) · [Apri il Playground (sperimentale)](./playground)

Usa l'[SDK ufficiale di E2B](./quickstart) per integrare Sandbox nella tua applicazione. Accedi alla [Sandbox Console](https://www.sandbase.ai/console/sandboxes) per creare sandbox e vedere stato, log e metriche delle istanze. Per un'introduzione vedi la [panoramica del prodotto Sandbox](https://www.sandbase.ai/sandbox). La procedura guidata e la tabella di supporto seguenti descrivono il Playground sperimentale, che è separato.

## Il Playground in cinque minuti {#a-five-minute-playground-walkthrough}

1. Inserisci una [chiave API](/getting-started/api-keys) con permessi Sandbox. La connessione legge solo template e istanze.
2. Scegli un template disponibile, conferma l'avviso sulle risorse e crea un'istanza di breve durata.
3. Esegui l'esempio di informazioni di sistema o quello Python. Osserva l'output e gli eventi dei processi accanto al pannello dei comandi.
4. Scrivi e verifica un file di testo, metti in pausa l'istanza, riprendila e rileggi lo stesso file.
5. Esamina eventi del ciclo di vita, metriche, log e dati sul tempo macchina. Elimina l'istanza quando hai finito.

L'aggiornamento della pagina cancella le credenziali della pagina e la cronologia locale delle operazioni; non elimina le sandbox. Le istanze in esecuzione seguono il timeout del server. Le istanze in pausa possono mantenere risorse. Annota gli ID delle istanze e usa gli strumenti della tua organizzazione per riconciliare e liberare le risorse dopo aver lasciato la pagina.

## Funzionalità e limiti {#capabilities-and-boundaries}

| Funzionalità | Supporto nel Playground |
| --- | --- |
| Creare, elencare, mettere in pausa, riprendere, estendere il timeout, eliminare | Disponibile; i controlli di modifica valgono solo per le istanze create in questa sessione della pagina |
| Comandi e file di testo | Disponibile; i comandi vengono eseguiti fino a 25 secondi e la modifica dei file è limitata a `/tmp/` e a 32 KiB |
| Eventi del ciclo di vita, log, metriche, tempo macchina | La disponibilità varia in base all'ambiente; esamina i risultati restituiti |
| Chat AI e contesto della conversazione | Non integrati; richiedono una configurazione del modello e un carico di lavoro Agent |
| PTY, porte applicative, webhook, build di template | Non disponibili in questa interfaccia |
| Snapshot e fork | Non disponibili in questo Playground |

L'interazione con la shell non è una chat AI. Ripristino dell'istanza, persistenza dei file, sopravvivenza dei processi e continuità della conversazione sono aspetti distinti da verificare.

## Capire gli eventi {#understanding-events}

Le voci **Sandbox lifecycle** sono eventi nativi del server recuperati all'aggiornamento e possono arrivare in ritardo. Le voci **Sandbox process** descrivono gli avvii dei processi e l'output in streaming. Le voci **Playground** registrano il completamento o l'errore delle richieste locali; non sono eventi del ciclo di vita del servizio.

Un elenco vuoto non dimostra un utilizzo pari a zero e l'assenza di eventi non dimostra che un'operazione sia fallita. I dati sul tempo macchina non sono una fattura definitiva. Dopo un timeout o una connessione interrotta, riconcilia le istanze prima di tentare un'altra richiesta di creazione.

## Visibilità dei template {#template-visibility}

I template possono essere pubblici o privati della tua organizzazione. Il loro numero non è fisso. Le voci senza nome restano visibili e usano alias o ID come etichette di riserva. L'accesso della tua organizzazione e la disponibilità dei template determinano quali template puoi vedere e usare.

## Sandbox e Session degli Agent {#sandboxes-and-agent-sessions}

Le Session degli Agents vengono eseguite nel cloud ospitato di SandBase. Sono separate dalle istanze Sandbox che crei con l'SDK E2B e l'Agents API non espone le istanze Sandbox. Vedi [Session](/agents/sessions).
