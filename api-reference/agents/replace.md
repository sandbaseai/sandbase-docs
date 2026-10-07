---
title: Replace Agent (CAS)
description: Update an Agent with compare-and-set on row_version.
aside: false
outline: false
apiReference:
  title: Replace Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Product update with compare-and-set. row_version is required and must equal the current value, otherwise 409. Supplied fields replace saved values; explicit null values return 400. Use this form when several editors can change the same Agent.
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
      description: row_version plus any subset of the Agent fields.
      fields:
        - name: row_version
          type: integer
          required: true
          description: The row_version you last read. A stale value returns 409.
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
        - name: description
          type: string
          required: false
          description: Up to 4096 characters.
        - name: note
          type: string
          required: false
          description: Change note recorded on the new version.
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
