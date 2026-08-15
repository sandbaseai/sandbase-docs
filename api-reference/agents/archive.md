---
title: Archive Agent
description: Archive an agent so it cannot be used for new sessions.
aside: false
outline: false
apiReference:
  title: Archive Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/archive
  description: Archive an agent. Existing sessions keep their agent snapshot, while new sessions can no longer reference the archived agent.
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Unique agent identifier beginning with agent_.
  examples:
    - label: cURL
      language: bash
      code: |
        curl -X POST \
          "https://api.sandbase.ai/v1/agents/agent_01HqR2k7.../archive" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |
        agent = client.beta.agents.archive(
            agent_id="agent_01HqR2k7..."
        )
        print(agent.archived_at)
    - label: TypeScript
      language: typescript
      code: |
        const agent = await client.beta.agents.archive(
          'agent_01HqR2k7...'
        );
        console.log(agent.archived_at);
  response:
    status: 200 OK
    code: |
      {
        "id": "agent_01HqR2k7...",
        "type": "agent",
        "version": 1,
        "name": "Research Assistant",
        "archived_at": "2026-05-29T12:00:00Z",
        "updated_at": "2026-05-29T12:00:00Z"
      }
  notes:
    - title: Soft delete
      description: Archiving is designed as a soft delete. Existing sessions continue to run from their pinned agent snapshot.
  errors:
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
    - status: 404
      type: not_found
      description: The agent does not exist.
---

<ApiReferencePage />
