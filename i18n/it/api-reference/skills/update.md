---
i18nSource: 996f166544016111
title: Aggiorna Skill
description: Cambia la versione predefinita, lo stato o i metadati di una Skill.
aside: false
outline: false
apiReference:
  title: Aggiorna Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Cambia default_version, status o i metadati market. row_version è obbligatorio quando invii metadata; altrimenti viene usato il valore attuale.
  groups:
    - title: Parametri di percorso
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID della Skill (prefisso skl_).
    - title: Corpo della richiesta
      description: Oggetto JSON.
      fields:
        - name: default_version
          type: string
          required: false
          description: Versione predefinita usata quando questa Skill viene collegata per la prima volta senza una versione esplicita. I collegamenti esistenti degli Agent mantengono le versioni fissate.
        - name: status
          type: string
          required: false
          description: active o disabled.
        - name: metadata
          type: object | null
          required: false
          description: Metadati di presentazione solo nel namespace market (fino a 16 KiB). Richiede row_version; sostituisce l'oggetto metadata. Namespace o campi sconosciuti restituiscono 400. Vedi l'esempio di metadati più sotto.
        - name: row_version
          type: integer
          required: false
          description: row_version attuale ottenuta da Get Skill. Un valore obsoleto restituisce 409 conflict; obbligatorio quando è presente metadata.
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

## Esempio di metadati {#metadata-example}

Invia la `row_version` attuale insieme all'oggetto metadati completo:

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

I metadati market descrivono la Skill ai fini della visualizzazione. Non installano un server, non concedono credenziali e non cambiano la selezione MCP dell'Agent. `metadata: {}` o `metadata: null` li cancellano; entrambi richiedono comunque `row_version`.
