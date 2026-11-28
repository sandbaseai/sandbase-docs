---
i18nSource: 2ffb24dad49b9c79
title: Récupérer un run asynchrone
description: Interrogez un run asynchrone de modèle ou d'API SandBase et récupérez son résultat actuel ou final.
aside: false
outline: false
apiReference:
  title: Récupérer un run asynchrone
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Récupère l'état actuel ou final d'un run asynchrone créé par POST /v1/run.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: id
          type: string
          required: true
          description: Identifiant opaque du run renvoyé par POST /v1/run. Utilisez-le exactement tel qu'il est renvoyé ; aucun préfixe n'est garanti.
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

Interrogez l'API toutes les 5 à 10 secondes pour les tâches média ou API de longue durée. Arrêtez-vous lorsque `status` vaut `completed`, `failed` ou `timeout`. Une réponse non terminale peut omettre `outputs` ; traitez l'ID du run comme opaque et ne construisez pas d'autre URL de statut.
