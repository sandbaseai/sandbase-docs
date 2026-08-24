---
title: Update Agent
description: Update an agent and create a new version.
aside: false
outline: false
apiReference:
  title: Update Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Update an agent configuration. Every effective change creates a new immutable version; existing sessions keep the version they started with.
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Unique agent identifier beginning with agent_.
    - title: Request body
      fields:
        - name: version
          type: integer
          required: false
          description: Optional current Agent version for optimistic locking. When omitted, the server applies the update to the version it just loaded.
        - name: model
          type: string
          description: Replacement model identifier. Omit to preserve the current value.
        - name: name
          type: string
          description: Replacement name. Omit to preserve the current value.
        - name: description
          type: string
          description: Replacement description. Send an empty string to clear it; null is treated as omitted and preserves the current value.
        - name: system
          type: string
          description: Replacement system instructions. Send an empty string to clear them; null is treated as omitted and preserves the current value.
        - name: tools
          type: array · null
          description: Full replacement tool list. Send an empty array or null to clear all tools.
        - name: mcp_servers
          type: array · null
          description: Full replacement MCP server configuration list.
        - name: skills
          type: array · null
          description: Full replacement Skill list.
        - name: handoffs
          type: array · null
          description: Full replacement handoff configuration list.
        - name: metadata
          type: object · null
          description: Full replacement metadata object. Omitted metadata is preserved; null clears caller-owned metadata. Supplied metadata replaces caller-owned metadata rather than merging individual keys, while the platform-owned _sandbase namespace remains unchanged.
  examples:
    - label: cURL
      language: bash
      code: |
        curl -X POST \
          "https://api.sandbase.ai/v1/agents/agent_01HqR2k7..." \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "version": 1,
            "system": "Research carefully and always cite sources."
          }'
    - label: Python
      language: python
      code: |
        agent = client.beta.agents.update(
            agent_id="agent_01HqR2k7...",
            version=1,
            system="Research carefully and always cite sources.",
        )
        print(agent.version)
    - label: TypeScript
      language: typescript
      code: |
        const agent = await client.beta.agents.update(
          'agent_01HqR2k7...',
          {
            version: 1,
            system: 'Research carefully and always cite sources.',
          },
        );
        console.log(agent.version);
  response:
    status: 200 OK
    code: |
      {
        "id": "agent_01HqR2k7...",
        "type": "agent",
        "version": 2,
        "name": "Research Assistant",
        "model": {"id": "claude-sonnet-4", "effort": {"type": "high"}, "speed": "standard"},
        "system": "Research carefully and always cite sources.",
        "updated_at": "2026-05-29T11:00:00Z"
      }
  notes:
    - title: Optimistic locking
      description: When version is supplied, a stale value returns 409 conflict. Fetch the current Agent, reapply the change, and retry with the latest version.
    - title: Array replacement
      description: Array fields are not merged. Read the current agent and send the complete intended list when changing tools, MCP servers, Skills, or handoffs.
  errors:
    - status: 400
      type: invalid_request
      description: One or more fields have invalid values.
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
    - status: 404
      type: not_found
      description: The agent does not exist.
    - status: 409
      type: conflict
      description: The supplied version does not match the current agent version.
---

<ApiReferencePage />
