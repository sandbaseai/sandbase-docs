---
i18nSource: 8c960d117a998817
title: Modelli di immagini e video
description: Usa la Run API condivisa di SandBase per generare immagini e video in modo asincrono.
---

# Modelli di immagini e video {#image-and-video-models}

I modelli di immagini e video usano la Run API asincrona condivisa di SandBase. Invia un task
con `POST /v1/run`, poi esegui il polling di `GET /v1/run/{id}` finché il run non raggiunge uno
stato finale.

## Inviare un task {#submit-a-task}

Usa l'ID esatto del modello da [Modelli di immagini e video](https://www.sandbase.ai/models/image-video). Gli altri
campi della richiesta sono specifici del modello; apri il riferimento API del modello per conoscerne
gli input obbligatori e i limiti.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

La risposta include un `id` opaco e uno `status` come `pending` o
`running`.

## Polling del risultato {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Continua il polling finché `status` non è `completed`, `failed` o `timeout`. I run
completati contengono output specifici della funzionalità, ad esempio l'URL di un'immagine o di un video. Conserva
l'ID del run e considera la risposta del run come lo stato autorevole.

## Callback webhook {#webhook-callbacks}

I task asincroni supportati possono anche impostare `webhook_url` nella richiesta di invio.
La callback è un'indicazione di consegna, non un sostituto del polling; continua a
usare `GET /v1/run/{id}` e gestisci in modo sicuro le callback duplicate o in ritardo. Vedi
[Eseguire una funzionalità](/api-reference/models/run#webhook-callbacks) per il contratto
comune delle callback.

## Le funzionalità API usano un percorso derivato dall'URL {#api-capabilities-use-a-url-derived-path}

La Run API condivisa serve per la generazione con i modelli. Le funzionalità API del
[catalogo delle API](https://www.sandbase.ai/apis) usano una
route diversa derivata dall'URL: `GET` o `POST /v1/api/{vendor}/{upstream_path}`.
Il nome della funzionalità qualificato dal vendor proviene dall'API Models o dal catalogo delle API, quindi il
campo `model` può essere omesso dal body di una POST:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Questa route serve per le funzionalità API e non sostituisce `/v1/run` quando
chiami modelli di immagini o video. Se la funzionalità API selezionata è asincrona,
esegui il polling dell'ID del run restituito con `GET /v1/run/{id}`.

## Passaggi successivi {#next-steps}

- [Modelli di immagini e video](https://www.sandbase.ai/models/image-video)
- [Eseguire una funzionalità](/api-reference/models/run)
- [Ottenere il risultato di un run](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
