---
i18nSource: faccf5122e785ea0
title: Pobierz artefakt Session
description: Pobierz zapisany artefakt Session według identyfikatora. Poznaj limit pobierania całego pliku, obsługiwane typy odpowiedzi i zachowanie nagłówka Range.
aside: false
outline: false
apiReference:
  title: Pobierz artefakt Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Pobiera cały niezmienny artefakt na podstawie identyfikatora z listy artefaktów Session. Obsługiwane są pliki do 200 MiB. Parametry zapytania nie są akceptowane; żądania Range zwracają 416 po weryfikacji dostępu.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: session_id
          type: string
          required: true
          description: Identyfikator Session (prefiks ses_).
        - name: artifact_id
          type: string
          required: true
          description: Dokładny nieprzejrzysty identyfikator art_ zwrócony przez listę artefaktów tej Session. Identyfikatory załączników i ścieżki obszaru roboczego nie są akceptowane.
    - title: Nagłówki odpowiedzi
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Typ multimediów ustalony na podstawie rozszerzenia pliku lub application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment z nazwą pliku artefaktu.
        - name: Content-Length
          type: integer
          required: true
          description: Pełny rozmiar pliku w bajtach.
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

Odpowiedź w przypadku powodzenia to bajty pliku, a nie JSON. Pobieraj cały plik; transfery częściowe i wznawiane pobieranie z nagłówkiem Range nie są obsługiwane. Niedostępny artefakt zwraca `404`; niedostępna usługa artefaktów zwraca `executor_unavailable`.
