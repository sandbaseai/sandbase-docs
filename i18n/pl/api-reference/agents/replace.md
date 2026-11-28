---
i18nSource: 4e711691737c9671
title: Zastąp Agent (CAS)
description: Aktualizuje Agent metodą compare-and-set na row_version.
aside: false
outline: false
apiReference:
  title: Zastąp Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Aktualizacja produktu metodą compare-and-set. Pole row_version jest wymagane i musi być równe bieżącej wartości, w przeciwnym razie zwracany jest 409. Przesłane pola zastępują zapisane wartości; jawne wartości null zwracają 400. Używaj tej formy, gdy ten sam Agent może być edytowany przez kilka osób.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: agent_id
          type: string
          required: true
          description: Identyfikator Agent (prefiks agt_).
    - title: Nagłówki
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcjonalny. Jeśli go pominiesz, usługa wygeneruje klucz sama, więc ponowione żądanie może utworzyć duplikat. Przy ponawianiu wysyłaj własny, stały klucz.
    - title: Treść żądania
      description: row_version oraz dowolny podzbiór pól Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: Ostatnio odczytana wartość row_version. Nieaktualna wartość zwraca 409.
        - name: model
          type: string
          required: false
          description: Identyfikator modelu z Models API, do 200 znaków.
        - name: name
          type: string
          required: false
          description: Nazwa wyświetlana, do 128 znaków.
        - name: instructions
          type: string
          required: false
          description: Instrukcje systemowe, do 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Środowisko wykonawcze: codex (domyślne), claude lub mcode."
        - name: skills
          type: array
          required: false
          description: 'Odwołania do Skills: {"skill_id": "skl_…", "version": null | "<version>"}. Maksymalnie 32. Przy nowym powiązaniu null przypina bieżącą domyślną wersję w chwili zapisu Agent. Przy istniejącym powiązaniu null zachowuje przypiętą wersję; aby zaktualizować, podaj jawną wersję.'
        - name: mcp_connections
          type: array
          required: false
          description: "Odwołania MCP: {connection_id, server_label, allowed_tools, required}. Maksymalnie 32; server_label musi być unikalny w obrębie Agent."
        - name: tools
          type: array
          required: false
          description: Do 64 narzędzi funkcyjnych oraz najwyżej jedno narzędzie web_search. Sesje wymagają obecnie wyłączonego trybu web_search, a wyniki funkcji po stronie klienta nie są jeszcze obsługiwane.
        - name: text
          type: object
          required: false
          description: format.type text lub json_schema (ze schematem obiektu); verbosity low, medium lub high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh lub max; summary concise, detailed lub auto.
        - name: service_tier
          type: string
          required: false
          description: auto (domyślnie), default, flex, priority lub fast.
        - name: metadata
          type: object
          required: false
          description: Do 16 par tekstowych; klucze do 64, a wartości do 512 znaków.
        - name: description
          type: string
          required: false
          description: Do 4096 znaków.
        - name: note
          type: string
          required: false
          description: Notatka o zmianie zapisywana w nowej wersji.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent",
        "name": "Research assistant",
        "model": "deepseek/deepseek-v4-flash",
        "instructions": "Answer with cited sources.",
        "tools": [],
        "text": {
          "format": {
            "type": "text"
          },
          "verbosity": "medium"
        },
        "reasoning": {
          "effort": null,
          "summary": null
        },
        "service_tier": "auto",
        "multi_agent": {
          "enabled": false,
          "max_concurrent_subagents": null
        },
        "visibility": "private",
        "status": "active",
        "version": 3,
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
