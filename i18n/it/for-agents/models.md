---
i18nSource: b95a8cd6f82c3a9a
title: Models e prezzi leggibili dall'AI
description: Scopri modelli, funzionalità, schemi e prezzi attuali di SandBase tramite l'API Models.
---

# Models e prezzi {#models-pricing}

Tutti i modelli sono accessibili con una sola API key SandBase. Disponibilità, schemi, funzionalità, limiti di contesto
e prezzi dei modelli possono cambiare in modo indipendente.

::: info Usa i metadata dei modelli in tempo reale
Usa sempre `GET /v1/models` e `GET /v1/models/{id_or_name}` per ottenere dati aggiornati e autorevoli. Non dedurre che ogni
LLM supporti streaming, visione, tool, output strutturato o caching, e non copiare i campi di input o
i prezzi di un modello su un altro.
:::

## Risposte del catalogo e dei dettagli {#catalog-and-detail-responses}

`GET /v1/models` restituisce record di identità compatibili con OpenAI che contengono `id`, `object`, `created` e `owned_by`.
Omette intenzionalmente i metadata SandBase su funzionalità, schema e prezzi.

`GET /v1/models/{id_or_name}` aggiunge `unified_schema`, `supported_modes` e `model_card`. Leggi i prezzi dettagliati da
`model_card`; non esiste un oggetto `pricing` di primo livello. Considera `capability_tags`, `supported_modes` e
`unified_schema` come specifici del modello.

## Individuare i modelli {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

L'endpoint di elenco supporta `q`, `vendor`, `type` e `order`; non è paginato e usa per impostazione predefinita `type=llm`.
Restituisce elementi compatibili con OpenAI con `id`, `object`, `created` e `owned_by`. Usa l'`id` restituito come
nome del modello quando richiedi i dettagli o invochi il modello.

Per qualsiasi risposta asincrona `202`, esegui il polling di `GET /v1/run/{id}` con l'ID restituito. Tratta l'ID come opaco; non
dedurne il formato e non costruire un percorso di polling diverso a partire da un prefisso dell'ID o da un header di compatibilità.

## Esaminare un modello {#inspect-one-model}

I nomi dei modelli sono qualificati dal vendor e possono contenere `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Prima dell'esecuzione, controlla:

- `enabled` ed `execution_mode`
- `capability_tags` e `supported_modes`
- `unified_schema` per i campi di richiesta accettati
- `model_card` per la formula di prezzo corrente e i moltiplicatori per token o cache

## Verificare il costo effettivo di un task {#check-actual-task-cost}

Per un task completato o in corso, interroga il costo registrato invece di ricalcolarlo da una tabella non aggiornata:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Vedi il [riferimento API Models](/api-reference/models/) per i contratti di risposta e la
[Guida agli errori](/for-agents/errors) per indicazioni su strutture di risposta e retry.
