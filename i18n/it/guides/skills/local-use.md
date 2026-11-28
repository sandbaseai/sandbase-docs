---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Usare una Skill in locale
description: Scegli una Skill di SandBase Lab, scarica il suo pacchetto, configura l'accesso ai modelli e crea e salva un progetto con un agente locale.
---

# Usare una Skill in locale {#use-a-skill-locally}

Scarica una Skill di SandBase e completa un progetto con un agente sul tuo computer. Una Skill contiene istruzioni, script ed esempi. L'agente segue il flusso di lavoro descritto nel suo `SKILL.md`.


## 1. Scegliere una Skill {#_1-choose-a-skill}

1. Apri [SandBase Lab](https://www.sandbase.ai/lab/).
2. Sfoglia esempi come video, animazioni e mappe. Apri una Skill adatta al tuo progetto.
3. Esamina l'esempio, gli input richiesti, il formato di output e le lingue supportate.
4. Usa l'azione di download della Skill per salvare il pacchetto ZIP.

Per un film su mappa sulla storia di una città, parti dagli esempi e dalle istruzioni di [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Preparare una cartella di lavoro locale {#_2-prepare-a-local-working-folder}

1. Crea una cartella di progetto, ad esempio `my-city-film`.
2. Estrai al suo interno l'intero ZIP della Skill, mantenendo istruzioni, script e asset.
3. Apri il progetto nel tuo agente locale e concedi l'accesso ai suoi file e ai comandi richiesti dal flusso di lavoro.
4. Segui le istruzioni di installazione nella pagina della Skill, oppure chiedi all'agente di leggere direttamente il `SKILL.md` estratto.

Un progetto può usare questa struttura:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Usa i nomi file e i percorsi di output specifici richiesti dalla Skill.

## 3. Collegare SandBase {#_3-connect-sandbase}

Incolla `set up https://www.sandbase.ai/SKILL.md` nel tuo agente e approva l'accesso dal browser che si apre, oppure esegui `npx -y @sandbaseai/cli@latest connect` in un terminale. Poi avvia una nuova sessione dell'agente, così i tool di SandBase vengono caricati. Le stesse opzioni si trovano in [Build → AI tools](https://www.sandbase.ai/console/setup) nella Console.

Vedi [Collegare i tool AI](/setup/) per il flusso di collegamento completo.

Se gli script della Skill richiedono `SANDBASE_API_KEY`:

1. Apri [API Keys](https://www.sandbase.ai/console/keys) e crea o seleziona una chiave per il progetto.
2. Configurala tramite le impostazioni sicure del tuo agente locale o nell'ambiente di esecuzione degli script.
3. Chiedi all'agente di verificare che l'accesso sia configurato e di proseguire con il flusso di lavoro della Skill.

Conserva la chiave in una configurazione locale sicura. Includi solo informazioni sul progetto nei deliverable, nei file sorgente e negli screenshot pubblici. Controlla l'utilizzo dei modelli e il tuo saldo in [Billing](https://www.sandbase.ai/console/billing).

## 4. Fornire un brief {#_4-provide-a-brief}

Indica all'agente quale Skill usare, cosa creare, i requisiti di output e il tuo budget. Adatta questo esempio al tuo progetto:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

L'agente legge le istruzioni, controlla le dipendenze, elabora gli input e genera o renderizza il progetto. Aggiungi gli eventuali asset richiesti allo stesso progetto e prosegui con il task.

## 5. Seguire l'avanzamento ed esaminare il risultato {#_5-follow-progress-and-review-the-result}

La durata dipende dalla Skill, dai modelli, dagli asset e dalla lunghezza dell'output. I progetti video possono richiedere da decine di minuti a diverse ore. Mantieni l'agente in esecuzione e il computer attivo.

Chiedi lo stato di avanzamento nella stessa conversazione:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Apri i percorsi dei file consegnati, controlla immagini, audio, sottotitoli e contenuti, e salva i file finali.

## 6. Rivedere il progetto {#_6-revise-the-project}

Richiedi modifiche specifiche nel task originale e riusa gli asset esistenti:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Se l'esecuzione si interrompe, conserva la cartella di lavoro e chiedi all'agente di proseguire dal passaggio corrente.

## Passi successivi {#next-steps}

- [Partecipa ad AI City Remix](/guides/skills/ai-city-remix)
- [Collega il tuo agente](/setup/)
- [Configura le chiavi API](/getting-started/api-keys)
