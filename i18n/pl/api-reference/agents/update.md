---
i18nSource: 1b680f7f0804feb7
title: Aktualizuj Agenta
description: Częściowo zaktualizuj Agenta przez aktualizację POST w stylu OpenAI SDK.
aside: false
outline: false
apiReference:
  title: Aktualizuj Agenta
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Częściowa aktualizacja w stylu SDK. Podane pola zastępują zapisane wartości i tworzą nową wersję; pominięte pola zachowują swoje wartości. row_version nie jest potrzebne. Pola description i note nie są tu akceptowane; do nich użyj Replace (PATCH). Zarchiwizowane Agents zwracają 404.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: agent_id
          type: string
          required: true
          description: Identyfikator Agenta (prefiks agt_).
    - title: Nagłówki
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcjonalny. Gdy go pominiesz, usługa wygeneruje klucz, więc ponowione żądanie może utworzyć duplikat. Przy ponawianiu wysyłaj własny, stały klucz.
    - title: Treść żądania
      description: Dowolny podzbiór tych pól. Inne pola zwracają 400.
      fields:
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
          description: 'Odwołania do Skills: {"skill_id": "skl_…", "version": null | "<version>"}. Do 32. Przy nowym powiązaniu null przypina bieżącą wersję domyślną w momencie zapisu Agenta. Przy istniejącym powiązaniu null zachowuje przypiętą wersję; aby zaktualizować, podaj jawną wersję.'
        - name: mcp_connections
          type: array
          required: false
          description: "Odwołania do MCP: {connection_id, server_label, allowed_tools, required}. Do 32; server_label musi być unikalny w obrębie Agenta."
        - name: tools
          type: array
          required: false
          description: Do 64 narzędzi funkcyjnych oraz co najwyżej jedno narzędzie web_search. Sessions wymagają obecnie wyłączonego trybu web_search, a wyniki funkcji po stronie klienta nie są jeszcze obsługiwane.
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
          description: Do 16 par ciągów znaków; klucze do 64, a wartości do 512 znaków.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "instructions": "Answer in five bullet points with cited sources."
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.update(
            "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            instructions="Answer in five bullet points with cited sources.",
        )
        print(agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "instructions": "Answer in five bullet points with cited sources."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "instructions": "Answer in five bullet points with cited sources."
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
        "instructions": "Answer in five bullet points with cited sources.",
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
        "version": 2,
        "row_version": 2,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
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
