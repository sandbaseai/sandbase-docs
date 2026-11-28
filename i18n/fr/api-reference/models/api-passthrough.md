---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Appelez les capacités d'API activées du catalogue via leurs chemins qualifiés par le fournisseur.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Résout une capacité activée du catalogue nommée vendor/upstream_path et exécute un objet JSON via le pipeline unifié de SandBase. GET est également pris en charge pour les capacités qui l'utilisent.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: vendor
          type: string
          required: true
          description: Premier segment du nom de la capacité.
        - name: upstream_path
          type: string
          required: true
          description: Chemin restant
          including literal slash-separated segments when present.: null
    - title: Corps de la requête
      fields:
        - name: model
          type: string
          required: false
          description: Omettez-le pour utiliser l'identité vendor/path déduite de l'URL. S'il est fourni
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Champs définis par le schéma actuel de la capacité sélectionnée.
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

L'URL se résout en un modèle activé nommé `vendor/upstream_path`. Utilisez le nom exact, qualifié par le fournisseur, renvoyé par la [Models API](./). Les noms de capacités imbriqués restent des segments de chemin littéraux et non des barres obliques encodées en pourcentage.

POST n'accepte qu'un objet JSON. Un corps POST vide est autorisé et se comporte comme un objet contenant le modèle déduit de l'URL. GET utilise un corps vide. Les champs de la réponse et le comportement synchrone ou asynchrone dépendent de la capacité sélectionnée ; interrogez les résultats asynchrones via `GET /v1/run/{id}`.
