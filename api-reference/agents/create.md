---
title: Create Agent
description: Create a reusable, versioned agent configuration.
aside: false
outline: false
apiReference:
  title: Create Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: Create a reusable Agent configuration that bundles a catalog model, instructions, capabilities, and metadata. Model IDs use vendor/model form. Unknown request fields are accepted and ignored.
  groups:
    - title: Request body
      description: Send a JSON object with the agent configuration.
      fields:
        - name: model
          type: string | object
          required: true
          description: Available vendor/model identifier or {id, effort?, speed?}. Responses always use the structured object.
        - name: name
          type: string
          required: true
          description: Human-readable Agent name.
        - name: description
          type: string
          description: Short explanation of the Agent's purpose. Null is accepted as an empty string on creation.
        - name: system
          type: string
          description: System instructions that define the Agent's behavior. Null is accepted as an empty string on creation.
        - name: tools
          type: array
          description: Built-in toolset and custom tool configurations. Omission installs the default Agent toolset; explicit null does not.
        - name: mcp_servers
          type: array
          description: MCP server configurations available to the Agent runtime.
        - name: skills
          type: array
          description: Skills available to the Agent runtime.
        - name: handoffs
          type: array
          description: Agent handoff configurations.
        - name: metadata
          type: object
          description: Application-defined JSON metadata. The platform-owned _sandbase namespace is stripped from public requests.
    - title: Agent object
      description: Fields returned for an agent resource.
      fields:
        - name: id
          type: string
          required: true
          description: Stable identifier beginning with agent_.
        - name: version
          type: integer
          required: true
          description: Configuration version, beginning at 1 and incrementing after a successful change.
        - name: archived_at
          type: string · null
          description: RFC 3339 timestamp set after the agent is archived.
        - name: created_at
          type: string · RFC 3339
          required: true
          description: Time the agent was created.
        - name: updated_at
          type: string · RFC 3339
          required: true
          description: Time the current version was last updated.
  examples:
    - label: cURL
      language: bash
      code: |
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "anthropic/claude-sonnet-4",
            "name": "Research Assistant",
            "system": "Research carefully and cite sources.",
            "tools": [{"type": "agent_toolset_20260401"}]
          }'
    - label: Python
      language: python
      code: |
        agent = client.beta.agents.create(
            model="anthropic/claude-sonnet-4",
            name="Research Assistant",
            system="Research carefully and cite sources.",
            tools=[{"type": "agent_toolset_20260401"}],
        )
        print(agent.id)
    - label: TypeScript
      language: typescript
      code: |
        const agent = await client.beta.agents.create({
          model: 'anthropic/claude-sonnet-4',
          name: 'Research Assistant',
          system: 'Research carefully and cite sources.',
          tools: [{ type: 'agent_toolset_20260401' }],
        });
        console.log(agent.id);
  response:
    status: 200 OK
    code: |
      {
        "id": "agent_01HqR2k7...",
        "type": "agent",
        "version": 1,
        "name": "Research Assistant",
        "description": "",
        "model": {"id": "anthropic/claude-sonnet-4"},
        "system": "Research carefully and cite sources.",
        "tools": [{ "type": "agent_toolset_20260401" }],
        "mcp_servers": null,
        "skills": null,
        "handoffs": null,
        "metadata": null,
        "archived_at": null,
        "created_at": "2026-05-29T10:00:00Z",
        "updated_at": "2026-05-29T10:00:00Z"
      }
  notes:
    - title: Model choice
      description: SandBase is multi-model. The model field accepts any available model identifier from the SandBase catalog.
    - title: Tool execution
      description: Built-in tools run inside the managed agent runtime. Custom tools are executed by your client after an agent.custom_tool_use event.
  errors:
    - status: 400
      type: invalid_request
      description: A required field is missing or a field has an invalid value.
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
---

<ApiReferencePage />
