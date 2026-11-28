---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Partecipa ad AI City Remix
description: Riscatta i crediti di AI City Remix, scegli una città e una Skill, crea un video con il tuo agent locale e caricalo per la revisione.
---

# Partecipa ad AI City Remix {#enter-ai-city-remix}

Scegli una Skill e una città nella pagina dell'evento, poi passa le istruzioni complete al tuo agent locale. Al termine della creazione, l'agent carica il video, la copertina e i dettagli della partecipazione e li invia per la revisione.


## Prerequisiti {#prerequisites}

- Un account SandBase.
- Un agent locale in grado di eseguire comandi e accedere ai file.
- Una cartella di lavoro per il video, la copertina e i file del progetto.

Per la prima configurazione locale, segui [Usare una Skill in locale](/guides/skills/local-use).

## 1. Apri l'evento e riscatta i crediti {#_1-open-the-event-and-claim-credits}

1. Apri [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) e leggi il [regolamento dell'evento](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) aggiornato.
2. Fai clic su “Claim $5 free & create” e accedi quando richiesto.
3. Il sistema riscatta i crediti dell'evento e prova ad applicarli automaticamente. Controlla il saldo e lo stato del riscatto; usa l'azione di riscatto se serve un nuovo tentativo.
4. Dopo il riscatto, fai clic su “Create now” per aprire la finestra di creazione.

Date di riscatto, disponibilità e requisiti sono indicati nella pagina dell'evento. Le chiamate ai modelli consumano crediti in base all'utilizzo effettivo; puoi controllarli in [Billing](https://www.sandbase.ai/console/billing).

## 2. Configura una API key per i modelli {#_2-configure-a-model-api-key}

Se il tuo account non ha una API key utilizzabile, il flusso mostra una finestra “Create an API key”.

1. Controlla il tetto di spesa e la scadenza indicati, poi fai clic su “Create API key”.
2. Fai clic su “Create with this key”. La nuova chiave viene inclusa nelle istruzioni complete passate all'agent.
3. Invia le istruzioni complete a un agent di cui ti fidi e conservale in un workspace privato.

Per una chiave esistente, configura `SANDBASE_API_KEY` tramite le impostazioni sicure o l'ambiente di esecuzione del tuo agent locale. Gestisci le chiavi in [API Keys](https://www.sandbase.ai/console/keys).

## 3. Scegli una Skill e un brief {#_3-choose-a-skill-and-brief}

La finestra parte con una Skill ufficiale, una città, una storia e una direzione creativa già selezionate.

- Espandi “Official Skill” per leggere il riepilogo e i dettagli e scegliere un approccio visivo.
- Espandi “Creative brief” per cercare una città o selezionare un luogo sulla mappa.
- Rimescola i suggerimenti o modifica direttamente la storia e la direzione creativa.
- Conferma il luogo sulla mappa, la lingua supportata e lo stile dell'output.

Usa fonti verificabili per storia, persone ed eventi. Controlla nei dettagli della Skill selezionata le lingue e le durate supportate.

## 4. Copia le istruzioni e avvia la creazione {#_4-copy-the-instructions-and-create}

1. Fai clic su “Copy all” nell'area del prompt.
2. Apri la cartella del progetto nel tuo agent locale, avvia un task e incolla le istruzioni complete.
3. Inviale, fornisci gli input richiesti, configura le dipendenze e avvia la creazione.

Le istruzioni contengono la Skill selezionata, il brief creativo, il formato dei metadati della partecipazione e l'autorizzazione al caricamento. Passale per intero, così l'agent può creare e inviare il lavoro.

“Preparing” indica che l'accesso per il caricamento è in preparazione. Usa “Retry” per prepararlo di nuovo, oppure “Complete brief” per compilare i dettagli mancanti.

## 5. Segui l'avanzamento della creazione {#_5-follow-creation-progress}

La creazione può richiedere da decine di minuti ad alcune ore, a seconda della Skill, dei modelli e della durata del video, e consuma crediti dei modelli. Lascia l'agent in esecuzione e il computer acceso.

Aggiungi allo stesso task istruzioni su budget e avanzamento:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Usa MiniMax M3.1 Flash tramite SandBase, come richiesto dal regolamento attuale dell'evento. Rispetta i requisiti dell'evento e della pagina di caricamento su durata, risoluzione, sottotitoli e dimensioni dei file.

## 6. Invia e controlla lo stato della revisione {#_6-submit-and-check-review-status}

L'agent segue le istruzioni complete per usare il client di caricamento ufficiale, caricare video, copertina e metadati e inviarli per la revisione.

Apri [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) per controllare l'avanzamento:

| Stato | Passaggio successivo |
|---|---|
| Bozza | Completa il film, carica i file e invialo per la revisione. |
| In attesa di revisione | Segui lo stato della revisione. |
| Approvata | Apri la pagina pubblica della partecipazione e condividila. |
| Modifiche richieste | Rivedi il lavoro secondo la nota di revisione e invialo di nuovo. |

Per un film già pronto, seleziona “Upload existing video” nella pagina dell'evento, compila i dettagli, carica video e copertina e invia per la revisione.

## 7. Riprendi un caricamento {#_7-resume-an-upload}

Se l'autorizzazione scade o un caricamento si interrompe, continua con i file originali:

1. Conserva il video, la copertina, `entry.json` e la cartella di lavoro.
2. Trova la stessa bozza in My entries e fai clic su “Resume upload”.
3. Copia le nuove istruzioni di ripresa nel task originale dell'agent.
4. Chiedi all'agent di caricare e inviare i file esistenti, poi controlla lo stato in My entries.

## 8. Condividi la tua partecipazione {#_8-share-your-entry}

Nella pagina di una partecipazione approvata, fai clic su “Share on X” per aprire un post precompilato. Include il link alla partecipazione, `#AICityRemix`, `@SandbaseAI` e il post ufficiale dell'evento.

Per pubblicare un post con il video, fai prima clic su “Download video”, aggiungi il file nel composer di X, rivedi il testo e pubblica.

## Documentazione correlata {#related-documentation}

- [Usare una Skill in locale](/guides/skills/local-use)
- [Connettere il tuo agent](/setup/)
- [Configurare le API key](/getting-started/api-keys)
