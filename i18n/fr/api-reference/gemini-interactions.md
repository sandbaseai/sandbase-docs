---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Créez, streamez et interrogez des Interactions de modèle via le protocole Google natif.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Crée une Interaction Google native. Vérifiez status même en cas de HTTP 200 ; une réponse in_progress doit être interrogée.
  groups:
    - title: Corps de la requête
      fields:
        - name: model
          type: string
          required: true
          description: Nom logique du modèle SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Entrée native d'une Interaction Google.
        - name: stream
          type: boolean
          required: false
          description: Renvoyer des événements SSE Google Interactions lorsque le modèle le permet.
        - name: background
          type: boolean
          required: false
          description: Soumettre de façon durable et renvoyer une Interaction interrogeable immédiatement. Incompatible avec stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Poursuivre à partir d'une Interaction amont en conservant l'affinité fournisseur.
        - name: store
          type: boolean
          required: false
          description: Transmettre la préférence de stockage amont sans modification.
        - name: system_instruction
          type: string
          required: false
          description: Instruction système native.
        - name: tools
          type: array
          required: false
          description: Définitions d'outils Google natives.
        - name: generation_config
          type: object
          required: false
          description: Configuration de génération native.
        - name: response_format
          type: object | array
          required: false
          description: Format de réponse demandé.
        - name: response_modalities
          type: array
          required: false
          description: Modalités de sortie demandées.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Authentification {#authentication}

Utilisez `x-goog-api-key`, `Authorization: Bearer …` ou le paramètre de requête `key`, dans cet ordre de priorité. Préférez un en-tête, car les identifiants placés dans la query string peuvent être journalisés.

## Modèles pris en charge {#supported-models}

L'endpoint Interactions n'est pas une route générique pour tous les modèles dont le nom de catalogue commence par `google/`. Le modèle
doit disposer d'un mappage fournisseur compatible Interactions. SandBase documente actuellement ces modèles compatibles :

- Gemini Omni Flash Preview : `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview : `google/gemini-omni-1.1-flash-preview`

Les autres modèles Google utilisent d'autres endpoints. Par exemple, Nano Banana Pro et Nano Banana 2 utilisent
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), et non `/v1beta/interactions`. Un modèle non pris en charge échoue au lieu d'être routé
via un autre protocole Google.

## Succès et polling {#success-and-polling}

Les soumissions réussies renvoient HTTP `200`, y compris pour le travail en arrière-plan et pour les requêtes synchrones dont l'attente bornée expire. Vérifiez toujours `status` :

- `completed`, `failed`, `cancelled` et `incomplete` sont des états terminaux.
- `in_progress` est toujours en cours. Interrogez `GET /v1beta/interactions/{id}` ; la réponse peut aussi inclure ce chemin dans l'en-tête `Location`.
- `requires_action` est un statut du protocole, mais SandBase n'expose pas encore l'endpoint de confirmation d'outil nécessaire pour le faire avancer.

L'ID de polling est l'`id` de l'Interaction amont renvoyé par `POST`, et non un ID de prédiction SandBase. La clé API SandBase qui a créé l'Interaction doit être celle qui la récupère.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Les réponses GET non terminales omettent la sortie partielle et l'utilisation. Les réponses terminales peuvent contenir des données image, audio ou vidéo inline et peser plusieurs mégaoctets. Téléchargez et conservez rapidement les médias nécessaires : après l'expiration de la rétention amont, SandBase ne peut renvoyer qu'une version terminale dégradée avec la structure et les métadonnées, sans les octets d'origine du média.

## Streaming {#streaming}

Définissez `stream: true` dans le corps de la requête. La réponse est `text/event-stream` ; `?alt=sse` n'est pas utilisé par ce protocole. Les types d'événements et de deltas sont ouverts et transmis sans liste d'autorisation fixe : les clients doivent donc tolérer les valeurs inconnues. Une fois les en-têtes de streaming écrits, les échecs arrivent sous forme d'événement `error` plutôt que d'un autre statut HTTP.

Le streaming dépend du modèle. Un fournisseur amont peut rejeter `stream: true` même si le protocole le prend en charge.

## Limites actuelles {#current-limits}

SandBase n'expose actuellement que la création et la récupération :

- Les Agent Interactions sont rejetées ; utilisez `model`.
- `background: true` et `stream: true` ne peuvent pas être combinés.
- La liste, la suppression et l'annulation des Interactions ne sont pas exposées.
- La livraison par URI et la reconnexion au flux via GET ne sont pas exposées.
- `previous_interaction_id` nécessite un mappage d'affinité fournisseur actif et la prise en charge en amont. SandBase échoue plutôt que de changer de fournisseur sans prévenir lorsque l'affinité n'est pas disponible.

Les erreurs utilisent l'enveloppe Google `{ "error": { "code", "message", "status" } }`. Considérez le statut HTTP comme stable ; le texte amont nettoyé dans `message` peut changer.
