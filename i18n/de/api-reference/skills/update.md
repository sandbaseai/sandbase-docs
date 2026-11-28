---
i18nSource: 996f166544016111
title: Skill aktualisieren
description: Standardversion, Status oder Metadaten eines Skills ändern.
aside: false
outline: false
apiReference:
  title: Skill aktualisieren
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Ändert default_version, status oder Market-Metadaten. row_version ist erforderlich, wenn metadata gesendet wird; andernfalls wird der aktuelle Wert verwendet.
  groups:
    - title: Pfadparameter
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill-ID (Präfix skl_).
    - title: Request-Body
      description: JSON-Objekt.
      fields:
        - name: default_version
          type: string
          required: false
          description: Standard, der beim ersten Anhängen dieses Skills ohne explizite Version verwendet wird. Bestehende Agent-Bindungen behalten ihre gepinnten Versionen.
        - name: status
          type: string
          required: false
          description: active oder disabled.
        - name: metadata
          type: object | null
          required: false
          description: Präsentations-Metadaten nur im Namespace market (bis zu 16 KiB). Erfordert row_version; ersetzt das Metadaten-Objekt. Unbekannte Namespaces oder Felder ergeben 400. Siehe das Metadaten-Beispiel unten.
        - name: row_version
          type: integer
          required: false
          description: Aktuelle row_version aus „Skill abrufen“. Ein veralteter Wert ergibt 409 conflict; erforderlich, wenn metadata vorhanden ist.
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

## Metadaten-Beispiel {#metadata-example}

Sende die aktuelle `row_version` zusammen mit dem vollständigen Metadaten-Objekt:

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

Market-Metadaten beschreiben den Skill für die Anzeige. Sie installieren keinen Server, vergeben keine Credentials und ändern nicht die MCP-Auswahl des Agents. `metadata: {}` oder `metadata: null` leert sie; beide erfordern trotzdem `row_version`.
