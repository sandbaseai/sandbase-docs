---
i18nSource: 096e3c57e599c5ca
title: Prześlij wersję Skill
description: Prześlij nową wersję Skill.
aside: false
outline: false
apiReference:
  title: Prześlij wersję Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Prześlij nowy pakiet ZIP jako kolejną wersję (200 OK). Układ ZIP jest taki sam jak w Create Skill (jeden folder najwyższego poziomu zawierający SKILL.md). Wyślij default=true, aby ustawić ją jako wersję domyślną. Listę wersji pobierzesz przez GET /v1/skills/{skill_id}/versions, jedną wersję odczytasz przez GET /v1/skills/{skill_id}/versions/{version}, a pobierzesz ją przez GET /v1/skills/{skill_id}/versions/{version}/content. Identyfikatory wersji są ciągami znaków.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: skill_id
          type: string
          required: true
          description: Identyfikator Skill (prefiks skl_).
    - title: Nagłówki
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcjonalny, 1-128 bajtów bez białych znaków na początku i końcu. Gdy zostanie pominięty, usługa generuje go sama, więc ponowione żądanie może utworzyć duplikat. Przy ponowieniach wysyłaj własny stały klucz.
    - title: Treść żądania
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: Archiwum ZIP, do 5 MiB.
        - name: default
          type: string
          required: false
          description: true ustawia tę wersję jako domyślną dla przyszłych dołączeń; false lub brak wartości zachowuje bieżącą domyślną. Istniejące powiązania Agentów pozostają bez zmian.
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

## Lista i pobieranie wersji {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` przyjmuje `limit` (0-100, domyślnie 20), `order` (`asc` lub `desc`, domyślnie `desc`) i `after`. Odpowiedź zawiera `object: "list"`, `data`, `has_more`, `first_id` i `last_id`. Przekaż `last_id` bez zmian jako następny `after`; jest to identyfikator wersji z prefiksem Skill, a nie sam numer wersji.

`GET /v1/skills/{skill_id}/versions/{version}` zwraca jeden obiekt wersji. Odpowiedni endpoint `/content` zwraca bajty ZIP; zobacz [przykład pobierania](./#download-a-bundle).
