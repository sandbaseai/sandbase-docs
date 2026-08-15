---
title: List Sandboxes
description: List your running and paused sandboxes, filter by status, and read their metadata.
---

# List Sandboxes

List the sandboxes belonging to your organization. Once you have a sandbox's ID, you can [connect](/agents/sandbox-connect) to it and control it with the SDK.

## Listing sandboxes

::: code-group

```python [Python]
from e2b import Sandbox

sandbox = Sandbox.create(
    metadata={"name": "My Sandbox"},
    api_url="https://api.sandbase.ai",
)

sandboxes = Sandbox.list(api_url="https://api.sandbase.ai")
running = sandboxes[0]
print("metadata:", running.metadata)
print("id:", running.sandbox_id)
print("started at:", running.started_at)
print("template id:", running.template_id)
```

```javascript [JavaScript]
import { Sandbox } from 'e2b'

const sandbox = await Sandbox.create({
  metadata: { name: 'My Sandbox' },
  apiUrl: 'https://api.sandbase.ai',
})

const sandboxes = await Sandbox.list({ apiUrl: 'https://api.sandbase.ai' })
const running = sandboxes[0]
console.log('metadata:', running.metadata)
console.log('id:', running.sandboxId)
console.log('startedAt:', running.startedAt)
console.log('templateId:', running.templateId)
```

:::

### REST API

```bash
curl https://api.sandbase.ai/sandboxes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

Each item looks like:

```json
{
  "sandboxID": "sbx_01abc...",
  "templateID": "code_interpreter",
  "status": "running",
  "metadata": { "name": "My Sandbox" },
  "startedAt": "2026-05-29T10:00:00Z",
  "endAt": "2026-05-29T10:05:00Z"
}
```

## Filtering by status

Filter sandboxes by their current state using the `status` query parameter. Supported values are `running` and `paused`.

```bash
# Only running sandboxes
curl "https://api.sandbase.ai/sandboxes?status=running" \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"

# Only paused sandboxes
curl "https://api.sandbase.ai/sandboxes?status=paused" \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

::: code-group

```python [Python]
from e2b import Sandbox, SandboxQuery, SandboxState

paginator = Sandbox.list(
    SandboxQuery(state=[SandboxState.RUNNING, SandboxState.PAUSED]),
    api_url="https://api.sandbase.ai",
)
sandboxes = paginator.next_items()
```

```javascript [JavaScript]
import { Sandbox } from 'e2b'

const paginator = Sandbox.list({
  query: { state: ['running', 'paused'] },
  apiUrl: 'https://api.sandbase.ai',
})
const sandboxes = await paginator.nextItems()
```

:::

## Metadata

You can attach arbitrary key-value metadata when creating a sandbox, then read it back when listing. This is useful for associating a sandbox with a user, session, or task.

::: code-group

```python [Python]
sandbox = Sandbox.create(
    metadata={"user_id": "123", "env": "dev"},
    api_url="https://api.sandbase.ai",
)
```

```javascript [JavaScript]
const sandbox = await Sandbox.create({
  metadata: { userId: '123', env: 'dev' },
  apiUrl: 'https://api.sandbase.ai',
})
```

:::

::: tip Roadmap
Cursor pagination and server-side **filtering by metadata** key/value pairs are part of the E2B API and are on the SandBase roadmap. Today, listing returns the org's sandboxes and supports the `status` filter; filter by metadata client-side in the meantime.
:::

## Next steps

- [Connect to a Running Sandbox](/agents/sandbox-connect)
- [Sandbox Lifecycle](/agents/sandbox-lifecycle)
- [Sandbox Persistence](/agents/sandbox-persistence)
