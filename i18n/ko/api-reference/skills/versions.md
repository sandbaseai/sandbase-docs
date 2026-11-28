---
i18nSource: 096e3c57e599c5ca
title: Skill 버전 업로드
description: 새 Skill 버전을 업로드합니다.
aside: false
outline: false
apiReference:
  title: Skill 버전 업로드
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: 새 ZIP 번들을 다음 버전으로 업로드합니다(200 OK). ZIP 구조는 Skill 생성과 같습니다(SKILL.md를 담은 최상위 폴더 하나). 기본 버전으로 지정하려면 default=true를 보내세요. 버전 목록은 GET /v1/skills/{skill_id}/versions로, 버전 하나는 GET /v1/skills/{skill_id}/versions/{version}로 조회하고, GET /v1/skills/{skill_id}/versions/{version}/content로 다운로드합니다. 버전 식별자는 문자열입니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID(skl_ 접두사).
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
          description: ZIP 아카이브이며 최대 5 MiB입니다.
        - name: default
          type: string
          required: false
          description: true이면 이후 연결의 기본 버전이 됩니다. false이거나 생략하면 현재 기본 버전이 유지됩니다. 기존 Agent 바인딩은 변경되지 않습니다.
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

## 버전 목록 조회 및 다운로드 {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions`는 `limit`(0~100, 기본값 20), `order`(`asc` 또는 `desc`, 기본값 `desc`), `after`를 받습니다. 응답에는 `object: "list"`, `data`, `has_more`, `first_id`, `last_id`가 포함됩니다. `last_id`는 변경하지 않고 다음 `after`로 전달하세요. 이 값은 단순 버전 번호가 아니라 Skill 접두사가 붙은 버전 ID입니다.

`GET /v1/skills/{skill_id}/versions/{version}`은 버전 객체 하나를 반환합니다. 해당 `/content` 엔드포인트는 ZIP 바이트를 반환합니다. [다운로드 예시](./#download-a-bundle)를 참고하세요.
