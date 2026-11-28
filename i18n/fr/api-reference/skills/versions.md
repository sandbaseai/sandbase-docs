---
i18nSource: 096e3c57e599c5ca
title: Téléverser une version de Skill
description: Téléverser une nouvelle version de Skill.
aside: false
outline: false
apiReference:
  title: Téléverser une version de Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Téléverse un nouveau bundle ZIP comme version suivante (200 OK). La structure du ZIP est la même que pour Create Skill (un seul dossier de premier niveau contenant SKILL.md). Envoyez default=true pour en faire la version par défaut. Listez les versions avec GET /v1/skills/{skill_id}/versions, lisez-en une avec GET /v1/skills/{skill_id}/versions/{version} et téléchargez-en une avec GET /v1/skills/{skill_id}/versions/{version}/content. Les identifiants de version sont des chaînes.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID du Skill (préfixe skl_).
    - title: En-têtes
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facultatif, 1 à 128 octets sans espace au début ni à la fin. S'il est omis, le service en génère un ; une requête réessayée peut alors créer un doublon. Envoyez votre propre clé stable pour les nouvelles tentatives.
    - title: Corps de la requête
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: Archive ZIP, 5 MiB au maximum.
        - name: default
          type: string
          required: false
          description: true en fait la version par défaut pour les futurs rattachements ; false ou une absence de valeur conserve la version par défaut actuelle. Les liaisons d'Agent existantes ne changent pas.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-v2" \
          -F "files=@release-notes-v2.zip;type=application/zip" \
          -F "default=true"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes-v2.zip", "rb") as bundle:
            version = client.skills.versions.create(
                "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
                files=[("release-notes-v2.zip", bundle.read(), "application/zip")],
                default=True,
            )
        print(version.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-v2",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions",
            headers=headers,
            files={"files": open("release-notes-v2.zip", "rb")},
            data={"default": "true"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes-v2.zip')], { type: 'application/zip' }), 'release-notes-v2.zip');
        form.append('default', 'true');

        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-v2',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "skill.version",
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57:2",
        "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "version": "2",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "created_at": 1791360000
      }
---

<ApiReferencePage />

## Lister et télécharger les versions {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` accepte `limit` (0-100, 20 par défaut), `order` (`asc` ou `desc`, `desc` par défaut) et `after`. Sa réponse contient `object: "list"`, `data`, `has_more`, `first_id` et `last_id`. Passez `last_id` sans modification comme `after` suivant ; il s'agit d'un ID de version préfixé par le Skill, et non du simple numéro de version.

`GET /v1/skills/{skill_id}/versions/{version}` renvoie un objet version. L'endpoint `/content` correspondant renvoie les octets du ZIP ; voir l'[exemple de téléchargement](./#download-a-bundle).
