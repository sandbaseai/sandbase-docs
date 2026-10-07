---
title: Create Agent
description: Create a saved, versioned Agent with POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Create Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Create a saved Agent at version 1. The body is strict JSON: unknown fields return 400. multi_agent must be omitted or null."
  groups:
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional. When omitted the service generates one, so a retried request can create a duplicate. Send your own stable key for retries.
    - title: Request body
      description: JSON object.
      fields:
        - name: model
          type: string
          required: true
          description: Model ID from the Models API, up to 200 characters.
          default: deepseek/deepseek-v4-flash
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
          description: Longer description, up to 4096 characters.
        - name: note
          type: string
          required: false
          description: Change note recorded on version 1.
    - title: Agent object
      description: Returned by create, get, update, archive, unarchive, restore, and clone.
      fields:
        - name: id
          type: string
          required: true
          description: Agent ID with the agt_ prefix.
        - name: object
          type: string
          required: true
          description: Always agent.
        - name: version
          type: integer
          required: true
          description: Current version. Every effective write creates a new version.
        - name: row_version
          type: integer
          required: true
          description: Compare-and-set token for PATCH, archive, unarchive, and restore.
        - name: status
          type: string
          required: true
          description: active or archived.
        - name: projection_status
          type: string
          required: true
          description: Execution readiness of the current version. Sessions, Services, and Schedules need ready; a new Agent can briefly report pending.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude, or mcode.
        - name: visibility
          type: string
          required: true
          description: private for your Agents; public for catalog entries.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix seconds. archived_at is null while active.
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
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
