---
i18nSource: 06a65ded83bf9438
title: Lista plików obszaru roboczego
description: Wyświetl bieżące pliki obszaru roboczego Session ze ścieżką, rozmiarem i paginacją. Ten endpoint tylko do odczytu zwraca metadane plików.
aside: false
outline: false
apiReference:
  title: Lista plików obszaru roboczego
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Wyświetl bieżące ścieżki i rozmiary plików w jednym katalogu obszaru roboczego Session. To lista wyłącznie metadanych, a nie historia załączników ani zawartość artefaktów. Nieznane lub powtórzone parametry zapytania zwracają 400.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: session_id
          type: string
          required: true
          description: Identyfikator Session (prefiks ses_).
    - title: Parametry zapytania
      fields:
        - name: path
          type: string
          required: false
          description: Bezwzględny katalog /workspace lub znormalizowany katalog poniżej niego. Maksymalnie 4096 bajtów; bez przechodzenia w górę, ukośników wstecznych ani końcowego ukośnika.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Rozmiar strony od 1 do 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Kolejność sortowania ścieżek: asc lub desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Nieprzezroczysta wartość next z poprzedniej odpowiedzi. Pomiń na pierwszej stronie; nie wysyłaj pustego ciągu. Nie zmieniaj path, order ani limit.
    - title: Pola odpowiedzi
      fields:
        - name: object
          type: string
          required: true
          description: Zawsze page.
        - name: data
          type: array
          required: true
          description: Pliki bieżącego katalogu, każdy z path i size_bytes. To nie jest lista rekurencyjna.
        - name: next
          type: string | null
          required: true
          description: Przekaż tę wartość jako page, aby kontynuować; null na końcu.
        - name: has_more
          type: boolean
          required: true
          description: Czy dostępna jest kolejna strona.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Odczyty obszaru roboczego mogą zwracać `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` lub `workspace_unavailable`. Jeśli kursor jest nieprawidłowy, zacznij od pierwszej strony. Aby znaleźć wygenerowane wyniki do pobrania, użyj [Artifacts](./list-artifacts).
