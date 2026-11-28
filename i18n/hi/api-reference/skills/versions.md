---
i18nSource: 096e3c57e599c5ca
title: Skill version अपलोड करें
description: नया Skill version अपलोड करें।
aside: false
outline: false
apiReference:
  title: Skill version अपलोड करें
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: नया ZIP bundle अगले version के रूप में अपलोड करें (200 OK)। ZIP का layout Create Skill जैसा ही है (एक top-level folder जिसमें SKILL.md हो)। इसे default version बनाने के लिए default=true भेजें। GET /v1/skills/{skill_id}/versions से versions की सूची पाएँ, GET /v1/skills/{skill_id}/versions/{version} से एक version पढ़ें, और GET /v1/skills/{skill_id}/versions/{version}/content से उसे download करें। Version identifiers strings होते हैं।
  groups:
    - title: Path parameters
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID (skl_ prefix)।
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: वैकल्पिक, 1-128 bytes, शुरुआत या अंत में whitespace के बिना। न भेजने पर सर्विस खुद एक key बनाती है, इसलिए दोबारा भेजा गया request डुप्लिकेट बना सकता है। retry के लिए अपनी स्थिर key भेजें।
    - title: Request body
      description: multipart/form-data।
      fields:
        - name: files
          type: file
          required: true
          description: ZIP archive, अधिकतम 5 MiB।
        - name: default
          type: string
          required: false
          description: true इसे भविष्य के attachments के लिए default बनाता है; false या न भेजने पर मौजूदा default बना रहता है। मौजूदा Agent bindings नहीं बदलते।
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

## Versions की सूची और download {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` `limit` (0-100, default 20), `order` (`asc` या `desc`, default `desc`) और `after` स्वीकार करता है। इसके response में `object: "list"`, `data`, `has_more`, `first_id` और `last_id` होते हैं। `last_id` को बिना बदले अगले `after` के रूप में भेजें; यह Skill-prefixed version ID है, केवल version संख्या नहीं।

`GET /v1/skills/{skill_id}/versions/{version}` एक version object लौटाता है। संबंधित `/content` endpoint ZIP bytes लौटाता है; [download का उदाहरण](./#download-a-bundle) देखें।
