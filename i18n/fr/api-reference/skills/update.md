---
i18nSource: 996f166544016111
title: Mettre à jour un Skill
description: Modifier la version par défaut, le statut ou les métadonnées d'un Skill.
aside: false
outline: false
apiReference:
  title: Mettre à jour un Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Modifie default_version, status ou les métadonnées market. row_version est obligatoire lorsque metadata est envoyé ; sinon, la valeur actuelle est utilisée.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID du Skill (préfixe skl_).
    - title: Corps de la requête
      description: Objet JSON.
      fields:
        - name: default_version
          type: string
          required: false
          description: Version utilisée par défaut lors du premier rattachement de ce Skill sans version explicite. Les liaisons d'Agent existantes conservent leurs versions épinglées.
        - name: status
          type: string
          required: false
          description: active ou disabled.
        - name: metadata
          type: object | null
          required: false
          description: Métadonnées de présentation, uniquement sous l'espace de noms market (16 KiB au maximum). Exige row_version ; remplace l'objet metadata. Les espaces de noms ou champs inconnus renvoient 400. Voir l'exemple de métadonnées ci-dessous.
        - name: row_version
          type: integer
          required: false
          description: row_version actuelle issue de Get Skill. Une valeur obsolète renvoie 409 conflict ; obligatoire lorsque metadata est présent.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "default_version": "2"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.update("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", default_version="2")
        print(skill.default_version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
            json={
                "default_version": "2"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "default_version": "2"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "2",
        "latest_version": "2",
        "status": "active",
        "visibility": "private",
        "row_version": 3,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />

## Exemple de métadonnées {#metadata-example}

Envoyez la `row_version` actuelle avec l'objet de métadonnées complet :

```json
{
  "row_version": 3,
  "metadata": {
    "market": {
      "display_name": "Release notes",
      "categories": ["development"],
      "tags": ["releases"],
      "required_endpoints": ["github.issues"],
      "servers": ["github"]
    }
  }
}
```

Les métadonnées market décrivent le Skill pour l'affichage. Elles n'installent pas de serveur, n'accordent pas d'identifiants et ne modifient pas la sélection MCP de l'Agent. `metadata: {}` ou `metadata: null` les efface ; dans les deux cas, `row_version` reste obligatoire.
