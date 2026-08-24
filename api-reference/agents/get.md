---
title: Get Agent
description: Retrieve an agent by ID, optionally pinned to a version.
aside: false
outline: false
apiReference:
  title: Get Agent
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}
  description: Retrieve the latest version of an agent, or request a specific historical version.
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Unique agent identifier beginning with agent_.
    - title: Query parameters
      fields:
        - name: version
          type: integer
          description: Historical version to retrieve. Omit this field to return the latest version.
  examples:
    - label: cURL
      language: bash
      code: |
        curl "https://api.sandbase.ai/v1/agents/agent_01HqR2k7..." \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |
        agent = client.beta.agents.retrieve(
            agent_id="agent_01HqR2k7..."
        )
        print(agent.name, agent.version)
    - label: TypeScript
      language: typescript
      code: |
        const agent = await client.beta.agents.retrieve(
          'agent_01HqR2k7...'
        );
        console.log(agent.name, agent.version);
  response:
    status: 200 OK
    code: |
      {
        "id": "agent_01HqR2k7...",
        "type": "agent",
        "version": 1,
        "name": "Research Assistant",
        "description": "A general-purpose research agent.",
        "model": {"id": "anthropic/claude-sonnet-4", "effort": {"type": "high"}, "speed": "standard"},
        "system": "You are a research assistant...",
        "tools": [],
        "mcp_servers": [],
        "skills": [],
        "handoffs": [],
        "metadata": {},
        "archived_at": null,
        "created_at": "2026-05-29T10:00:00Z",
        "updated_at": "2026-05-29T10:00:00Z"
      }
  errors:
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
    - status: 404
      type: not_found
      description: The agent or requested version does not exist.
---

<ApiReferencePage />
