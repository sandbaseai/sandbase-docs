---
i18nSource: 612f99de1f80d99a
title: Skill erstellen
description: Ein Skill-ZIP-Bundle mit POST /v1/skills hochladen.
aside: false
outline: false
apiReference:
  title: Skill erstellen
  operation: Skills
  method: POST
  path: /v1/skills
  description: Lädt ein ZIP-Bundle hoch und erstellt den Skill in Version 1. Der Multipart-Body muss genau einen Datei-Part namens files (oder files[]) mit bis zu 5 MiB enthalten. Das ZIP muss einen Ordner auf oberster Ebene mit SKILL.md darin enthalten (zum Beispiel zip -r release-notes.zip release-notes/), und das Frontmatter von SKILL.md muss name und description setzen. Eine SKILL.md im Stammverzeichnis des ZIP ergibt 400 invalid_request.
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional, 1–128 Bytes ohne führende oder nachgestellte Leerzeichen. Fehlt er, erzeugt der Dienst einen, sodass eine wiederholte Anfrage ein Duplikat erstellen kann. Sende für Retries deinen eigenen stabilen Key.
    - title: Request-Body
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: ZIP-Archiv, dessen einziger Ordner auf oberster Ebene SKILL.md enthält.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-skill-1" \
          -F "files=@release-notes.zip;type=application/zip"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes.zip", "rb") as bundle:
            skill = client.skills.create(files=[("release-notes.zip", bundle.read(), "application/zip")])
        print(skill.id, skill.default_version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-skill-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills",
            headers=headers,
            files={"files": open("release-notes.zip", "rb")},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes.zip')], { type: 'application/zip' }), 'release-notes.zip');

        const response = await fetch('https://api.sandbase.ai/v1/skills', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-skill-1',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "1",
        "latest_version": "1",
        "status": "active",
        "visibility": "private",
        "row_version": 1,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />
