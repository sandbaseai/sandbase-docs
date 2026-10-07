---
title: Credential resources (retired)
description: Credential resources that injected runtime environment variables have been retired. Use Secrets with MCP connections.
robots: noindex,follow
---

# Credential resources (retired)

The Credential resources, which injected private values into Agent runtimes as environment variables, have been retired. Existing credential records are not migrated.

To give an Agent authenticated access to an external system, register the system as an [MCP connection](/api-reference/mcp-connections/) and store its Bearer token as a [Secret](/api-reference/secrets/). See [Credentials for MCP tools](/agents/api-credentials) for the walkthrough.
