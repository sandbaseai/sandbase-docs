---
title: Skills and MCP tools
description: Give a SandBase Agent reusable Skills and remote MCP tools, and control which versions and tools each Session uses.
---

# Skills and MCP tools

An Agent gets capabilities in two ways:

- **Skills** teach the Agent how to do a job. A Skill is a versioned ZIP bundle of instructions and resources.
- **MCP connections** let the Agent call tools on a remote MCP server over HTTPS, optionally authenticated with a [Secret](/agents/api-credentials).

Most useful Agents combine both: an MCP server fetches data or takes actions, and a Skill describes how to use the results.

## Skills

1. Package a folder that contains `SKILL.md` with `name` and `description` frontmatter, and zip the folder itself (`zip -r release-notes.zip release-notes/`, 5 MiB maximum). The ZIP must have that folder at its top level; a `SKILL.md` at the ZIP root returns `400 invalid_request`.
2. Upload it with `POST /v1/skills` as the multipart field `files`. The response contains an `skl_` ID and `default_version: "1"`.
3. Reference it in the Agent's `skills` array.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- `"version": null` uses the Skill's `default_version`. A string such as `"2"` pins one version.
- The version is resolved and frozen when each Session starts. Changing the default later affects new Sessions only.
- Upload a new version with `POST /v1/skills/{skill_id}/versions`, and switch the default with `default=true` or `POST /v1/skills/{skill_id}`.
- A disabled Skill makes new Sessions of Agents that reference it fail with `400 skill_not_found`.

You can also browse public Skills in the [Skills catalog](/api-reference/skills/catalog). See the [Skills API](/api-reference/skills/) for the full walkthrough.

## MCP connections

1. If the MCP server needs a Bearer token, [create a Secret](/agents/api-credentials) for its exact URL.
2. Register the server with `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Reference the connection in the Agent's `mcp_connections` array:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Field | Meaning |
|---|---|
| `connection_id` | `mcp_` connection ID in your organization |
| `server_label` | Starts with a letter; letters, digits, `_`, and `-`; up to 64 characters; unique within the Agent |
| `allowed_tools` | `null` allows every tool the server offers; `[]` allows none; a list allows only those names |
| `required` | Whether the Session must load this server |

An Agent can reference up to 32 connections. The connection must be `active` when a Session starts.

::: info Differs from OpenAI
OpenAI's Agents API declares MCP servers inline as `tools: [{"type": "mcp", ...}]`. SandBase returns `400` for that form: register the server as a connection resource and reference it in `mcp_connections`. The OpenAI SDK has no methods for `/v1/mcp-connections` or `/v1/secrets`, so call them with `client.post(...)` and pass `mcp_connections` through `extra_body` (Python) or the request body (Node.js). See [OpenAI compatibility](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Changes and running Sessions

Each Session freezes its Agent version, Skill versions, and MCP connection configuration when it starts.

- After you replace a connection or rotate its Secret, new Sessions use the new configuration; existing Sessions keep their snapshot.
- Disabling a connection or revoking its Secret blocks new Sessions and rejects further input to existing Sessions that use it. A tool call that is already running is not interrupted.

## Keep tokens out of prompts

Store tokens as Secrets. Do not put them in instructions, Session input, metadata, or Skill bundles: those are readable by anyone with access to the Agent or Session.

## Next steps

- [Credentials for MCP tools](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Define an Agent](/agents/agent-api)
