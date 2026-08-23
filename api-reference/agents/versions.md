---
title: List Agent Versions
description: List historical versions of an agent.
aside: false
outline: false
apiReference:
  title: List Agent Versions
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions
  description: List immutable agent configuration snapshots, ordered from newest version to oldest.
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Unique agent identifier beginning with agent_.
    - title: Query parameters
      fields:
        - name: limit
          type: integer
          description: Number of versions to return. Accepts values from 1 to 100.
          default: "20"
        - name: page
          type: string
          description: Opaque cursor returned in a previous response's next_page field.
  examples:
    - label: cURL
      language: bash
      code: |
        curl "https://api.sandbase.ai/v1/agents/agent_01HqR2k7.../versions" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |
        page = client.beta.agents.versions.list(
            agent_id="agent_01HqR2k7..."
        )
        for item in page.data:
            print(item.version, item.created_at)
    - label: TypeScript
      language: typescript
      code: |
        const page = await client.beta.agents.versions.list(
          'agent_01HqR2k7...'
        );
        page.data.forEach((item) => console.log(item.version));
  response:
    status: 200 OK
    code: |
      {
        "data": [
          {
            "id": "agent_01HqR2k7...",
            "type": "agent",
            "version": 2,
            "name": "Research Assistant",
            "model": {"id": "claude-sonnet-4", "effort": {"type": "high"}, "speed": "standard"},
            "system": "Always cite sources.",
            "created_at": "2026-05-29T11:00:00Z"
          }
        ]
      }
  notes:
    - title: Immutable Agent projections
      description: Each item is the full Agent projection at that immutable version. No-op updates do not create a version.
    - title: Pagination
      description: When another page is available, the response includes next_page. The field is absent on the final page.
  errors:
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
    - status: 404
      type: not_found
      description: The agent does not exist.
---

<ApiReferencePage />
