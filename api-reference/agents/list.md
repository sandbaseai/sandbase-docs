---
title: List Agents
description: List agents for your organization with cursor pagination.
aside: false
outline: false
apiReference:
  title: List Agents
  operation: Agents
  signature: AgentListPage agents().list(params = AgentListParams.none())
  method: GET
  path: /v1/agents
  description: List agents owned by your organization, ordered from most recently created. The response includes an opaque cursor when another page is available.
  groups:
    - title: Query parameters
      description: All parameters are optional.
      schema: AgentListParams params
      fields:
        - name: limit
          type: integer
          description: Number of agents to return. Accepts values from 1 to 100.
          default: "20"
        - name: page
          type: string
          description: Opaque cursor returned in a previous response's next_page field.
        - name: include_archived
          type: boolean
          description: Include agents that have been archived.
          default: "false"
        - name: created_at[gte]
          type: string · RFC 3339
          description: Return agents created at or after this timestamp.
        - name: created_at[lte]
          type: string · RFC 3339
          description: Return agents created at or before this timestamp.
  examples:
    - label: cURL
      language: bash
      code: |
        curl "https://api.sandbase.ai/v1/agents?limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |
        from anthropic import Anthropic

        client = Anthropic(
            api_key="sk-sb-YOUR_KEY",
            base_url="https://api.sandbase.ai",
        )

        page = client.beta.agents.list(limit=20)
        for agent in page.data:
            print(agent.id, agent.name)
    - label: TypeScript
      language: typescript
      code: |
        import Anthropic from '@anthropic-ai/sdk';

        const client = new Anthropic({
          apiKey: process.env.SANDBASE_API_KEY,
          baseURL: 'https://api.sandbase.ai',
        });

        const page = await client.beta.agents.list({ limit: 20 });
        page.data.forEach((agent) => console.log(agent.id, agent.name));
  response:
    status: 200 OK
    code: |
      {
        "data": [
          {
            "id": "agent_01HqR2k7...",
            "type": "agent",
            "version": 1,
            "name": "Research Assistant",
            "description": "A general-purpose research Agent.",
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
        ],
        "next_page": "page_eyJjIjoi..."
      }
  notes:
    - title: Pagination
      description: Results are ordered by created_at descending. Pass next_page back as page; when next_page is absent, you have reached the final page.
  errors:
    - status: 400
      type: invalid_request
      description: The page cursor is malformed.
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
---

<ApiReferencePage />
