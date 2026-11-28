---
i18nSource: 096e3c57e599c5ca
title: Skill-Version hochladen
description: Eine neue Skill-Version hochladen.
aside: false
outline: false
apiReference:
  title: Skill-Version hochladen
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Lädt ein neues ZIP-Bundle als nächste Version hoch (200 OK). Der Aufbau des ZIP entspricht dem von „Skill erstellen“ (ein Ordner auf oberster Ebene mit SKILL.md). Sende default=true, um sie zur Standardversion zu machen. Versionen listest du mit GET /v1/skills/{skill_id}/versions auf, eine einzelne liest du mit GET /v1/skills/{skill_id}/versions/{version}, und mit GET /v1/skills/{skill_id}/versions/{version}/content lädst du eine herunter. Versionskennungen sind Strings.
  groups:
    - title: Pfadparameter
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill-ID (Präfix skl_).
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
          description: ZIP-Archiv, bis zu 5 MiB.
        - name: default
          type: string
          required: false
          description: true macht diese Version zum Standard für künftige Anhänge; false oder weggelassen behält den aktuellen Standard. Bestehende Agent-Bindungen bleiben unverändert.
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

## Versionen auflisten und herunterladen {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` akzeptiert `limit` (0–100, Standard 20), `order` (`asc` oder `desc`, Standard `desc`) und `after`. Die Antwort enthält `object: "list"`, `data`, `has_more`, `first_id` und `last_id`. Übergib `last_id` unverändert als nächstes `after`; es ist eine Versions-ID mit Skill-Präfix, nicht die reine Versionsnummer.

`GET /v1/skills/{skill_id}/versions/{version}` gibt ein Versionsobjekt zurück. Der zugehörige `/content`-Endpunkt gibt die ZIP-Bytes zurück; siehe das [Download-Beispiel](./#download-a-bundle).
