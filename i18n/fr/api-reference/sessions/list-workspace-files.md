---
i18nSource: 06a65ded83bf9438
title: Lister les fichiers de l'espace de travail
description: Listez les fichiers actuels de l'espace de travail d'une Session avec leur chemin, leur taille et une pagination. Cet endpoint en lecture seule renvoie les métadonnées des fichiers.
aside: false
outline: false
apiReference:
  title: Lister les fichiers de l'espace de travail
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Liste les chemins et tailles actuels des fichiers d'un répertoire de l'espace de travail d'une Session. Il s'agit d'une liste de métadonnées uniquement, et non de l'historique des pièces jointes ni du contenu des artefacts. Des paramètres de requête inconnus ou répétés renvoient 400.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (préfixe ses_).
    - title: Paramètres de requête
      fields:
        - name: path
          type: string
          required: false
          description: Répertoire absolu /workspace ou répertoire normalisé situé en dessous. 4096 octets au maximum ; pas de remontée d'arborescence, de barres obliques inverses ni de barre oblique finale.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Taille de page de 1 à 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Ordre de tri des chemins : asc ou desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Valeur next opaque issue de la réponse précédente. Omettez-la pour la première page ; n'envoyez pas de chaîne vide. Ne modifiez pas path, order ni limit.
    - title: Champs de la réponse
      fields:
        - name: object
          type: string
          required: true
          description: Toujours page.
        - name: data
          type: array
          required: true
          description: Fichiers du répertoire courant, chacun avec path et size_bytes. Cette liste n'est pas récursive.
        - name: next
          type: string | null
          required: true
          description: Passez cette valeur comme page pour continuer ; null à la fin.
        - name: has_more
          type: boolean
          required: true
          description: Indique si une autre page est disponible.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Les lectures de l'espace de travail peuvent renvoyer `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` ou `workspace_unavailable`. Si le curseur est invalide, recommencez à partir de la première page. Utilisez [Artifacts](./list-artifacts) pour trouver les sorties générées téléchargeables.
