---
i18nSource: 09bd958c8a1bba3a
title: Skill-Katalog
description: Öffentliche Skills durchsuchen.
aside: false
outline: false
apiReference:
  title: Skill-Katalog
  operation: Skills
  method: GET
  path: /v1/skills/catalog
  description: Listet öffentliche Skills mit Cursor-Paginierung auf. Einen einzelnen liest du mit GET /v1/skills/catalog/{skill_id}, seine Versionen listest du mit GET /v1/skills/catalog/{skill_id}/versions auf, eine Version liest du mit GET /v1/skills/catalog/{skill_id}/versions/{version} und lädst sie mit GET /v1/skills/catalog/{skill_id}/versions/{version}/content herunter.
  groups:
    - title: Query-Parameter
      fields:
        - name: limit
          type: integer
          required: false
          description: Seitengröße von 0 bis 100. Werte außerhalb des Bereichs liefern 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Cursor. Übergib last_id der vorherigen Seite.
        - name: order
          type: string
          required: false
          description: asc oder desc.
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/skills/catalog?limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/skills/catalog?limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/catalog?limit=20', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
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
            "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            "object": "skill",
            "name": "release-notes",
            "description": "Draft release notes from merged changes.",
            "default_version": "1",
            "latest_version": "1",
            "status": "active",
            "visibility": "public",
            "row_version": 1,
            "metadata": {},
            "created_at": 1791273600,
            "updated_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "last_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57"
      }
---

<ApiReferencePage />
