---
i18nSource: 096e3c57e599c5ca
title: Carica versione della Skill
description: Carica una nuova versione di una Skill.
aside: false
outline: false
apiReference:
  title: Carica versione della Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Carica un nuovo bundle ZIP come versione successiva (200 OK). La struttura dello ZIP è la stessa di Create Skill (una sola cartella di primo livello che contiene SKILL.md). Invia default=true per renderla la versione predefinita. Elenca le versioni con GET /v1/skills/{skill_id}/versions, leggine una con GET /v1/skills/{skill_id}/versions/{version} e scaricane una con GET /v1/skills/{skill_id}/versions/{version}/content. Gli identificatori di versione sono stringhe.
  groups:
    - title: Parametri di percorso
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID della Skill (prefisso skl_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facoltativo, 1-128 byte senza spazi iniziali o finali. Se omesso, il servizio ne genera uno, quindi una richiesta ripetuta può creare un duplicato. Invia una tua chiave stabile per i retry.
    - title: Corpo della richiesta
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: Archivio ZIP, fino a 5 MiB.
        - name: default
          type: string
          required: false
          description: true la rende la versione predefinita per i collegamenti futuri; false o un valore omesso mantiene quella attuale. I collegamenti esistenti degli Agent restano invariati.
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

## Elencare e scaricare le versioni {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` accetta `limit` (0-100, predefinito 20), `order` (`asc` o `desc`, predefinito `desc`) e `after`. La risposta contiene `object: "list"`, `data`, `has_more`, `first_id` e `last_id`. Passa `last_id` invariato come `after` successivo; è un ID di versione con prefisso della Skill, non il semplice numero di versione.

`GET /v1/skills/{skill_id}/versions/{version}` restituisce un oggetto versione. L'endpoint `/content` corrispondente restituisce i byte dello ZIP; vedi l'[esempio di download](./#download-a-bundle).
