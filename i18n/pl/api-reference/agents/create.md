---
i18nSource: f3150233afd08b90
title: Utwórz Agent
description: Utwórz zapisany, wersjonowany Agent za pomocą POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Utwórz Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Tworzy zapisany Agent w wersji 1. Treść żądania to ścisły JSON: nieznane pola zwracają 400. multi_agent musi zostać pominięte lub mieć wartość null."
  groups:
    - title: Nagłówki
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcjonalny. Jeśli go pominiesz, usługa wygeneruje klucz sama, więc ponowione żądanie może utworzyć duplikat. Przy ponawianiu wysyłaj własny, stały klucz.
    - title: Treść żądania
      description: Obiekt JSON.
      fields:
        - name: model
          type: string
          required: true
          description: Wymagany identyfikator modelu z Models API, do 200 znaków. Nie ma wartości domyślnej; pominięcie model zwraca 400. Przykłady używają deepseek/deepseek-v4-flash.
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
          description: 'Odwołania do Skills: {"skill_id": "skl_…", "version": null | "<version>"}. Maksymalnie 32. Przy nowym powiązaniu null przypina bieżącą wersję domyślną w momencie zapisania Agenta. Przy istniejącym powiązaniu null zachowuje przypiętą wersję; aby zaktualizować, podaj jawną wersję.'
        - name: mcp_connections
          type: array
          required: false
          description: 'Odwołania do MCP: {connection_id, server_label, allowed_tools, required}. Maksymalnie 32; server_label musi być unikalny w obrębie Agenta. Pomiń pole, aby otrzymać wbudowane narzędzia SandBase ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); wysłana lista zastępuje to ustawienie domyślne, a [] tworzy Agenta bez narzędzi. Zobacz Wbudowane narzędzia SandBase (/agents/mcp-tools#built-in-sandbase-tools).'
        - name: tools
          type: array
          required: false
          description: Do 64 narzędzi funkcyjnych i co najwyżej jedno narzędzie web_search. Sessions wymagają obecnie wyłączonego trybu web_search, a wyniki funkcji po stronie klienta nie są jeszcze obsługiwane.
        - name: text
          type: object
          required: false
          description: "format.type: text lub json_schema (ze schematem obiektu); verbosity: low, medium lub high."
        - name: reasoning
          type: object
          required: false
          description: "effort: none, minimal, low, medium, high, xhigh lub max; summary: concise, detailed lub auto."
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
          description: Dłuższy opis, do 4096 znaków.
        - name: note
          type: string
          required: false
          description: Notatka o zmianie zapisana przy wersji 1.
    - title: Obiekt Agent
      description: Zwracany przez create, get, update, archive, unarchive, restore i clone.
      fields:
        - name: id
          type: string
          required: true
          description: Identyfikator Agenta z prefiksem agt_.
        - name: object
          type: string
          required: true
          description: Zawsze agent.
        - name: version
          type: integer
          required: true
          description: Bieżąca wersja. Każdy skuteczny zapis tworzy nową wersję.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set dla PATCH, archive, unarchive i restore.
        - name: status
          type: string
          required: true
          description: active lub archived.
        - name: projection_status
          type: string
          required: true
          description: Gotowość bieżącej wersji do wykonania. Sessions wymagają ready; nowy Agent może przez chwilę zgłaszać pending.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude lub mcode.
        - name: visibility
          type: string
          required: true
          description: private dla Twoich Agentów; public dla wpisów katalogu.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Sekundy Unix. archived_at ma wartość null, dopóki Agent jest aktywny.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-research-agent-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.create(
            model="deepseek/deepseek-v4-flash",
            name="Research assistant",
            instructions="Answer with cited sources.",
            metadata={"team": "research"},
        )
        print(agent.id, agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-research-agent-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents",
            headers=headers,
            json={
                "name": "Research assistant",
                "model": "deepseek/deepseek-v4-flash",
                "instructions": "Answer with cited sources.",
                "metadata": {
                    "team": "research"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-research-agent-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
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
        "version": 1,
        "row_version": 1,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [
          {"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin", "allowed_tools": null, "required": true}
        ],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
