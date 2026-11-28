---
i18nSource: 270917aea416aa76
title: Lister les artefacts de Session
description: Listez les artefacts de sortie capturés d'une Session avec pagination par curseur, ID opaques, tailles de fichier et liens de téléchargement.
aside: false
outline: false
apiReference:
  title: Lister les artefacts de Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Liste les sorties générées immuables de cette Session. Les ID d'artefact sont des identifiants opaques limités à la Session ; transmettez l'ID renvoyé tel quel à l'endpoint de téléchargement. Les paramètres de requête inconnus ou répétés renvoient 400.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (préfixe ses_).
    - title: Paramètres de requête
      fields:
        - name: limit
          type: integer
          required: false
          description: Taille de page de 1 à 100 ; les valeurs invalides renvoient 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc ou desc.
          default: desc
        - name: after
          type: string
          required: false
          description: ID d'artefact renvoyé comme last_id sur la page précédente. Conservez le même ordre pour continuer.
    - title: Objet artefact
      fields:
        - name: object
          type: string
          required: true
          description: Toujours agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Identifiant art_ opaque. Ne le construisez pas et ne le décodez pas.
        - name: session_id
          type: string
          required: true
          description: ID de la Session propriétaire.
        - name: path
          type: string
          required: true
          description: Chemin de la sortie générée sous /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Taille de l'artefact en octets.
        - name: created_at
          type: integer
          required: true
          description: Horodatage de création en secondes Unix.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

L'identifiant de l'exemple est fourni à titre indicatif. Utilisez l'`id` renvoyé par votre propre requête pour [Télécharger un artefact](./download-artifact). Lorsque `has_more` vaut true, envoyez `after=last_id` pour obtenir la page suivante. `first_id` et `last_id` valent null pour une liste vide. Aucun endpoint GET distinct pour les métadonnées d'artefact n'est exposé.
