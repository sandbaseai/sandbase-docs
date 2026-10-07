---
title: Update Agent
description: Partially update an Agent with the OpenAI SDK-style POST update.
aside: false
outline: false
apiReference:
  title: Update Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: SDK-style partial update. Supplied fields replace the saved values and create a new version; omitted fields keep their values. No row_version is needed. description and note are not accepted here; use Replace (PATCH) for them. Archived Agents return 404.
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID (agt_ prefix).
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional. When omitted the service generates one, so a retried request can create a duplicate. Send your own stable key for retries.
    - title: Request body
      description: Any subset of these fields. Other fields return 400.
      fields:
        - name: model
          type: string
          required: false
          description: Model ID from the Models API, up to 200 characters.
        - name: name
          type: string
          required: false
          description: Display name, up to 128 characters.
        - name: instructions
          type: string
          required: false
          description: System instructions, up to 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Execution runtime: codex (default), claude, or mcode."
        - name: skills
          type: array
          required: false
          description: 'Skill references: {"skill_id": "skl_…", "version": null | "<version>"}. null uses the Skill default version, resolved when a Session starts.'
        - name: mcp_connections
          type: array
          required: false
          description: "MCP references: {connection_id, server_label, allowed_tools, required}. Up to 32; server_label must be unique in the Agent."
        - name: tools
          type: array
          required: false
          description: Up to 64 function tools plus at most one web_search tool. Sessions currently require web_search mode disabled, and client-side function results are not supported yet.
        - name: text
          type: object
          required: false
          description: format.type text or json_schema (with an object schema); verbosity low, medium, or high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh, or max; summary concise, detailed, or auto.
        - name: service_tier
          type: string
          required: false
          description: auto (default), default, flex, priority, or fast.
        - name: metadata
          type: object
          required: false
          description: Up to 16 string pairs; keys up to 64 and values up to 512 characters.
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
