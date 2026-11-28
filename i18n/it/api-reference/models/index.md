---
i18nSource: 3ccdc1071b9be798
title: Models API
description: Consulta i metadati, i prezzi, lo stato di supporto e le funzionalità dei modelli SandBase.
---

# Models API {#models-api}

Usa la Models API per individuare i modelli prima di scegliere un endpoint di inferenza. L'operazione di elenco è compatibile con OpenAI e restituisce record di identità compatti. Recupera un singolo modello per ottenere i metadati SandBase su funzionalità, schema e prezzi.

| Operazione | Endpoint | Documentazione |
|---|---|---|
| Elencare i modelli | `GET /v1/models` | [Elenca modelli](./list) |
| Ottenere un modello | `GET /v1/models/{id_or_name}` | [Ottieni modello](./get) |
| Invocare una funzionalità API tramite percorso | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Eseguire un modello o una funzionalità API | `POST /v1/run` | [Esegui funzionalità](./run) |
| Ottenere un risultato asincrono | `GET /v1/run/{id}` | [Ottieni risultato dell'esecuzione](./run-get) |
| Ricevere un callback asincrono | `webhook_url` su `POST /v1/run` | [Callback webhook](./run#webhook-callbacks) |
| Sfogliare i modelli supportati | — | [Catalogo dei modelli](https://www.sandbase.ai/models) |

Per eseguire un modello, apri la sua pagina di riferimento dal [Catalogo dei modelli](https://www.sandbase.ai/models); ogni pagina mostra l'identificatore esatto, i campi della richiesta e i prezzi. Questa pagina documenta la ricerca dei modelli, l'esecutore unificato delle funzionalità, l'API passthrough, gli asset e la consultazione dei costi delle attività.

`GET /v1/models` supporta `q`, `vendor`, `type` e `order`; non è paginato. Se ometti `type` il valore predefinito è `llm`, mentre un `type=` esplicitamente vuoto elenca tutti i tipi di modello pubblici. Il filtro `vendor` è esatto e distingue tra maiuscole e minuscole; `q` è una ricerca per sottostringa che non distingue tra maiuscole e minuscole. Ogni elemento dell'elenco contiene `id`, `object`, `created` e `owned_by`, dove `id` è il nome logico del modello usato nelle richieste.

I nomi dei modelli possono contenere `/`. Passa queste barre come separatori di percorso quando chiami l'endpoint di dettaglio, ad esempio `/v1/models/openai/gpt-5.6-luna`; la route del server interpreta il resto del percorso come un unico identificatore logico. Ricava l'ID corrente da `GET /v1/models` invece di copiare un identificatore da una guida meno recente.

Per una risposta asincrona `202` di un'API di inferenza, esegui il polling di `GET /v1/run/{id}` con l'ID opaco restituito. Non dedurre un prefisso dell'ID e non costruire un percorso di polling diverso a partire dagli header di compatibilità.
