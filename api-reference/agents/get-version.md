---
title: Get Agent Version
description: Retrieve one immutable Agent snapshot by version resource ID or version number.
aside: false
outline: false
apiReference:
  title: Get Agent Version
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: Retrieve an immutable historical Agent snapshot. The version path value accepts either a version resource ID or a positive numeric version.
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Stable identifier of the parent Agent.
        - name: version
          type: string | integer
          required: true
          description: Immutable version resource ID or positive numeric version.
  examples:
    - label: cURL
      language: bash
      code: |
        curl "https://api.sandbase.ai/v1/agents/agent_01HqR2k7.../versions/2" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |
      {
        "id": "agent_01HqR2k7...",
        "type": "agent",
        "version": 2,
        "name": "Research Assistant",
        "description": "A general-purpose research Agent.",
        "model": {"id": "anthropic/claude-sonnet-5", "effort": {"type": "high"}, "speed": "standard"},
        "system": "Always cite sources.",
        "tools": [],
        "mcp_servers": [],
        "skills": [],
        "handoffs": [],
        "metadata": {},
        "created_at": "2026-05-29T11:00:00Z",
        "updated_at": "2026-05-29T11:00:00Z",
        "archived_at": null
      }
  errors:
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
    - status: 404
      type: not_found
      description: The Agent or requested version does not exist.
---

<ApiReferencePage />
