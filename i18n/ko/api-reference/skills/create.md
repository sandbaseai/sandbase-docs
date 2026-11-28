---
i18nSource: 612f99de1f80d99a
title: Skill 생성
description: POST /v1/skills로 Skill ZIP 번들을 업로드합니다.
aside: false
outline: false
apiReference:
  title: Skill 생성
  operation: Skills
  method: POST
  path: /v1/skills
  description: "ZIP 번들을 업로드해 버전 1의 Skill을 생성합니다. multipart 본문에는 files(또는 files[])라는 이름의 파일 파트가 정확히 하나 있어야 하며 최대 5 MiB입니다. ZIP에는 SKILL.md를 담은 최상위 폴더가 하나 있어야 하며(예: zip -r release-notes.zip release-notes/), SKILL.md 프런트매터에 name과 description을 지정해야 합니다. ZIP 루트에 SKILL.md가 있으면 400 invalid_request를 반환합니다."
  groups:
    - title: 헤더
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 선택 사항이며, 앞뒤 공백 없이 1~128바이트입니다. 생략하면 서비스가 키를 생성하므로 재시도한 요청이 중복을 만들 수 있습니다. 재시도에는 고정된 자체 키를 보내세요.
    - title: 요청 본문
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: 단일 최상위 폴더에 SKILL.md가 들어 있는 ZIP 아카이브입니다.
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
