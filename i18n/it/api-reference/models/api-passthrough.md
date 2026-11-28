---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Invoca le funzionalità API abilitate del catalogo tramite i loro percorsi qualificati dal vendor.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Risolve una funzionalità abilitata del catalogo denominata vendor/upstream_path ed esegue un oggetto JSON tramite la pipeline unificata di SandBase. GET è supportato anche per le funzionalità che lo usano.
  groups:
    - title: Parametri di percorso
      fields:
        - name: vendor
          type: string
          required: true
          description: Primo segmento del nome della funzionalità.
        - name: upstream_path
          type: string
          required: true
          description: Percorso rimanente
          including literal slash-separated segments when present.: null
    - title: Body della richiesta
      fields:
        - name: model
          type: string
          required: false
          description: Omettilo per usare l'identità vendor/path derivata dall'URL. Se fornito
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Campi definiti dallo schema attuale della funzionalità selezionata.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

L'URL risolve un modello abilitato denominato `vendor/upstream_path`. Usa il nome esatto, qualificato dal vendor, restituito dall'[API Models](./). I nomi di funzionalità annidati restano segmenti di percorso letterali, non slash codificati in percent-encoding.

POST accetta solo un oggetto JSON. Un body POST vuoto è consentito e si comporta come un oggetto contenente il modello derivato dall'URL. GET usa un body vuoto. I campi della risposta e il comportamento sincrono o asincrono dipendono dalla funzionalità selezionata; esegui il polling dei risultati asincroni tramite `GET /v1/run/{id}`.
