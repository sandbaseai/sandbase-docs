---
i18nSource: 996f166544016111
title: Zaktualizuj Skill
description: Zmień domyślną wersję, status lub metadane Skill.
aside: false
outline: false
apiReference:
  title: Zaktualizuj Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Zmień default_version, status lub metadane market. row_version jest wymagany, gdy wysyłane są metadata; w przeciwnym razie używana jest bieżąca wartość.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: skill_id
          type: string
          required: true
          description: Identyfikator Skill (prefiks skl_).
    - title: Treść żądania
      description: Obiekt JSON.
      fields:
        - name: default_version
          type: string
          required: false
          description: Wartość domyślna używana przy pierwszym dołączeniu tego Skill bez jawnej wersji. Istniejące powiązania Agentów zachowują przypięte wersje.
        - name: status
          type: string
          required: false
          description: active lub disabled.
        - name: metadata
          type: object | null
          required: false
          description: Metadane prezentacyjne wyłącznie w przestrzeni nazw market (do 16 KiB). Wymaga row_version; zastępuje obiekt metadata. Nieznane przestrzenie nazw lub pola zwracają 400. Zobacz przykład metadanych poniżej.
        - name: row_version
          type: integer
          required: false
          description: Bieżący row_version z Get Skill. Nieaktualna wartość zwraca 409 conflict; wymagany, gdy obecne są metadata.
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

## Przykład metadanych {#metadata-example}

Wyślij bieżący `row_version` razem z kompletnym obiektem metadanych:

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

Metadane market opisują Skill na potrzeby wyświetlania. Nie instalują serwera, nie nadają poświadczeń ani nie zmieniają wyboru MCP Agenta. `metadata: {}` lub `metadata: null` je czyści; oba warianty nadal wymagają `row_version`.
