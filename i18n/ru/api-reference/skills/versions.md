---
i18nSource: 096e3c57e599c5ca
title: Загрузить версию Skill
description: Загрузка новой версии Skill.
aside: false
outline: false
apiReference:
  title: Загрузить версию Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Загружает новый ZIP-пакет как следующую версию (200 OK). Структура ZIP такая же, как в Create Skill (одна папка верхнего уровня с SKILL.md). Передайте default=true, чтобы сделать её версией по умолчанию. Список версий — GET /v1/skills/{skill_id}/versions, одна версия — GET /v1/skills/{skill_id}/versions/{version}, скачивание — GET /v1/skills/{skill_id}/versions/{version}/content. Идентификаторы версий — строки.
  groups:
    - title: Параметры пути
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID Skill (префикс skl_).
    - title: Заголовки
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Необязательно, 1–128 байт без пробелов в начале и конце. Если не указан, сервис генерирует ключ сам, поэтому повторный запрос может создать дубликат. Для повторных попыток передавайте собственный стабильный ключ.
    - title: Тело запроса
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: ZIP-архив размером до 5 MiB.
        - name: default
          type: string
          required: false
          description: true делает эту версию версией по умолчанию для будущих подключений; false или отсутствие значения сохраняет текущую версию по умолчанию. Существующие привязки Agent не меняются.
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

## Список и скачивание версий {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` принимает `limit` (0–100, по умолчанию 20), `order` (`asc` или `desc`, по умолчанию `desc`) и `after`. Ответ содержит `object: "list"`, `data`, `has_more`, `first_id` и `last_id`. Передавайте `last_id` без изменений как следующий `after`; это ID версии с префиксом Skill, а не просто номер версии.

`GET /v1/skills/{skill_id}/versions/{version}` возвращает один объект версии. Соответствующий эндпоинт `/content` возвращает байты ZIP; см. [пример скачивания](./#download-a-bundle).
