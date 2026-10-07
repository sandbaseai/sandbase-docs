---
title: Endpoint resources (retired)
description: Endpoint resources and their REST, MCP, and ACP transports have been retired. Use Services.
robots: noindex,follow
---

# Endpoint resources (retired)

Endpoint resources, including their REST, MCP, and ACP invocation transports, have been retired and are no longer served.

Use the [Services API](/api-reference/services/) instead. A Service pins an Agent version, each invocation returns a Run, and each Run creates a Session you can read with the [Sessions API](/api-reference/sessions/). To call Services from AI tools, see [Use a Service from AI tools](/api-reference/services/#use-a-service-from-ai-tools).
