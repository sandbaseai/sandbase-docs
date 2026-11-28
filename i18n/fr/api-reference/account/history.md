---
i18nSource: 06feb27e20f1b7f5
title: Lister l'historique du compte
description: Liste les enregistrements d'exécution récents de l'organisation de la clé API.
aside: false
outline: false
apiReference:
  title: Lister l'historique du compte
  operation: Account
  method: GET
  path: /v1/account/history
  description: Liste les enregistrements d'exécution récents de l'organisation, du plus récent au plus ancien. Les messages d'erreur sont nettoyés et les instantanés JSON stockés sont omis lorsqu'ils ne peuvent pas être décodés.
  groups:
    - title: Paramètres de requête
      fields:
        - name: model
          type: string
          required: false
          description: Nom logique exact du modèle.
        - name: api_key_id
          type: string
          required: false
          description: ID exact de la ressource API Key.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Catégorie d'exécution ; multimodal inclut image, vidéo et audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Statut d'exécution regroupé.
        - name: error_type
          type: string
          required: false
          description: Type d'erreur exact, ou unknown pour les enregistrements qui n'en ont pas.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Plage glissante sur la date de création ; 7d par défaut.
        - name: page
          type: integer
          required: false
          description: Numéro de page, à partir de 1.
        - name: page_size
          type: integer
          required: false
          description: Éléments par page, de 1 à 100 ; 20 par défaut.
        - name: request_id
          type: string
          required: false
          description: ID d'exécution exact au sein de l'organisation. S'il est défini, les autres filtres sont ignorés et un seul résultat est demandé.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Référence d'horodatage pour une fenêtre explicite.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Filtre de règlement ; positive et token exigent time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Début de fenêtre inclus, associé à end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Fin de fenêtre exclue ; la fenêtre ne peut pas dépasser 32 jours.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Limite les mesures de latence aux valeurs positives.
        - name: min_latency_ms
          type: integer
          required: false
          description: Latence minimale en millisecondes.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Validation de compatibilité uniquement. Les horodatages restent en UTC ; la recherche exacte par request_id ignore ce paramètre.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
