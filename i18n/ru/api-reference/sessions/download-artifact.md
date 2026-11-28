---
i18nSource: faccf5122e785ea0
title: Скачивание артефакта Session
description: Скачайте сохранённый артефакт Session по ID. Узнайте об ограничении на скачивание полного файла, поддерживаемых типах ответа и поведении Range.
aside: false
outline: false
apiReference:
  title: Скачивание артефакта Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Скачивает полный неизменяемый артефакт по его ID из списка артефактов Session. Поддерживаются файлы размером до 200 МиБ. Параметры запроса не принимаются; запросы Range после проверки доступа возвращают 416.
  groups:
    - title: Параметры пути
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (префикс ses_).
        - name: artifact_id
          type: string
          required: true
          description: Точный непрозрачный ID art_, возвращённый в списке артефактов этой Session. ID вложений и пути в рабочем пространстве не принимаются.
    - title: Заголовки ответа
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Тип содержимого, определённый по расширению файла, или application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment с именем файла артефакта.
        - name: Content-Length
          type: integer
          required: true
          description: Полный размер файла в байтах.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

Успешный ответ содержит байты файла, а не JSON. Скачивайте файл целиком; частичная передача и докачка через Range не поддерживаются. Недоступный артефакт возвращает `404`; недоступность сервиса артефактов возвращает `executor_unavailable`.
