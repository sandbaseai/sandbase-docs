---
title: "Update Session"
description: "Update mutable Session metadata and Session-local Agent overrides."
aside: false
outline: false
apiReference:
  title: Update Session
  operation: Sessions
  method: POST
  path: /v1/sessions/{id}
  description: Shallow-merge metadata or fully replace Session-local tool and MCP server overrides. Null metadata values delete keys; a null title preserves the current title.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: Session ID. }
    - title: Request body
      fields:
        - { name: title, type: string | null, required: false, description: New title; null or omission preserves the current title. }
        - { name: metadata, type: object, required: false, description: Shallow merge patch; null property values delete keys. }
        - { name: agent.tools, type: array, required: false, description: Full replacement for the Session-local tool override. }
        - { name: agent.mcp_servers, type: array, required: false, description: Full replacement for the Session-local MCP server override. }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/sessions/sess_01... \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"title":"Research follow-up","metadata":{"phase":2,"obsolete_key":null}}'
---

<ApiReferencePage />
