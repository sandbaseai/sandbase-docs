---
i18nSource: 270917aea416aa76
title: Lista artefaktów Session
description: Wyświetl zapisane artefakty wyjściowe Session z paginacją kursorową, nieprzejrzystymi identyfikatorami, rozmiarami plików i linkami do pobrania.
aside: false
outline: false
apiReference:
  title: Lista artefaktów Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Wyświetla niezmienne wygenerowane wyniki tej Session. Identyfikatory artefaktów są nieprzejrzystymi uchwytami w zakresie Session; przekaż zwrócony identyfikator bez zmian do endpointu pobierania. Nieznane lub powtórzone parametry zapytania zwracają 400.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: session_id
          type: string
          required: true
          description: Identyfikator Session (prefiks ses_).
    - title: Parametry zapytania
      fields:
        - name: limit
          type: integer
          required: false
          description: Rozmiar strony od 1 do 100; nieprawidłowe wartości zwracają 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc lub desc.
          default: desc
        - name: after
          type: string
          required: false
          description: Identyfikator artefaktu zwrócony jako last_id na poprzedniej stronie. Przy kontynuowaniu zachowaj tę samą kolejność.
    - title: Obiekt artefaktu
      fields:
        - name: object
          type: string
          required: true
          description: Zawsze agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Nieprzejrzysty uchwyt art_. Nie konstruuj go ani nie dekoduj.
        - name: session_id
          type: string
          required: true
          description: Identyfikator Session, do której należy artefakt.
        - name: path
          type: string
          required: true
          description: Ścieżka wygenerowanego wyniku w katalogu /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Rozmiar artefaktu w bajtach.
        - name: created_at
          type: integer
          required: true
          description: Znacznik czasu utworzenia w sekundach Unix.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

Identyfikator w przykładzie jest poglądowy. W [Pobieraniu artefaktu](./download-artifact) używaj `id` zwróconego przez Twoje własne żądanie. Gdy `has_more` ma wartość true, wyślij `after=last_id`, aby pobrać następną stronę. Dla pustej listy `first_id` i `last_id` mają wartość null. Osobny endpoint GET metadanych artefaktu nie jest udostępniany.
