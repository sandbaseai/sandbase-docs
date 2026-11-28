---
i18nSource: 2ffb24dad49b9c79
title: Ottenere un run asincrono
description: Esegui il polling di un run asincrono di un modello o di un'API SandBase e recuperane il risultato corrente o finale.
aside: false
outline: false
apiReference:
  title: Ottenere un run asincrono
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Recupera lo stato corrente o finale di un run asincrono creato con POST /v1/run.
  groups:
    - title: Parametri di percorso
      fields:
        - name: id
          type: string
          required: true
          description: Identificatore opaco del run restituito da POST /v1/run. Usalo esattamente come restituito; nessun prefisso è garantito.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Polling {#polling}

Per i task multimediali o API di lunga durata, esegui il polling ogni 5–10 secondi. Fermati quando `status` è `completed`, `failed` o `timeout`. Una risposta non finale può omettere `outputs`; tratta l'ID del run come opaco e non costruire un URL di stato diverso.
