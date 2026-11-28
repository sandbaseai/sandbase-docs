---
i18nSource: efa205ed7505643c
title: Exécuter une capacité de modèle ou d'API
description: Soumettez une capacité de modèle ou d'API SandBase via l'endpoint d'exécution unifié.
aside: false
outline: false
apiReference:
  title: Exécuter une capacité de modèle ou d'API
  operation: Models
  method: POST
  path: /v1/run
  description: Exécute une capacité de modèle ou d'API SandBase activée. Les champs de la requête dépendent de la capacité ; consultez la page de référence du modèle ou de l'API sur le site SandBase pour le schéma de la capacité sélectionnée.
  groups:
    - title: Corps de la requête
      fields:
        - name: model
          type: string
          required: true
          description: Identifiant du modèle logique ou de la capacité d'API activé.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Indication du mode d'exécution. `auto` utilise la valeur par défaut configurée pour la capacité sélectionnée ; les autres valeurs doivent être prises en charge par la capacité.
        - name: stream
          type: boolean
          required: false
          description: "Demande une sortie en streaming si la capacité sélectionnée la prend en charge. Équivaut à `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Callback HTTPS facultatif pour les tâches asynchrones d'image prises en charge
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Exécution et résultats {#execution-and-results}

Les capacités synchrones renvoient une réponse complète dans la requête d'origine. Les capacités asynchrones renvoient `202 Accepted` avec un `id` opaque ; interrogez [Obtenir une exécution asynchrone](./run-get) jusqu'à ce que le statut soit final.

Les champs de requête et les formats de sortie propres à chaque capacité sont définis sur la page du modèle ou de l'opération d'API sélectionné. Envoyez ces champs au premier niveau du corps JSON ; ne les encapsulez pas dans un objet `input`. Ne supposez pas que toutes les capacités acceptent les mêmes paramètres.

## Callbacks webhook {#webhook-callbacks}

Définissez `webhook_url` uniquement pour les tâches asynchrones d'image, de vidéo ou d'audio prises en charge. SandBase envoie l'événement d'exécution final à l'endpoint HTTPS après la réussite ou l'échec ; le callback est une indication de livraison et ne remplace pas `GET /v1/run/{id}`. Continuez toujours à interroger l'endpoint d'exécution pour obtenir le statut de référence, et réessayez de façon sûre lorsqu'un callback est retardé ou dupliqué. Les réponses de modèles synchrones et les endpoints natifs des fournisseurs n'utilisent pas ce champ de callback.
