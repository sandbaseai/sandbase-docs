---
title: Connect to a Running Sandbox
description: Reconnect to an existing sandbox by ID and continue controlling it with the SDK.
---

# Connect to a Running Sandbox

If you already have a running (or paused) sandbox, you can connect to it by ID and continue controlling it with the SDK. This is useful for reusing the same sandbox for a returning user, or resuming work after a short period of inactivity.

## 1. Get the sandbox ID

Retrieve a sandbox ID by [listing sandboxes](/agents/sandbox-list):

::: code-group

```python [Python]
from e2b import Sandbox

paginator = Sandbox.list(api_url="https://api.sandbase.ai")
running = paginator.next_items()
if not running:
    raise Exception("No running sandboxes found")

sandbox_id = running[0].sandbox_id
```

```javascript [JavaScript]
import { Sandbox } from 'e2b'

const paginator = await Sandbox.list({
  query: { state: ['running'] },
  apiUrl: 'https://api.sandbase.ai',
})
const running = await paginator.nextItems()
if (running.length === 0) {
  throw new Error('No running sandboxes found')
}

const sandboxId = running[0].sandboxId
```

:::

## 2. Connect to the sandbox

Use `connect()` with the sandbox ID. If the sandbox is paused, connecting resumes it automatically.

::: code-group

```python [Python]
from e2b import Sandbox

sandbox = Sandbox.connect(sandbox_id, api_url="https://api.sandbase.ai")

result = sandbox.commands.run("whoami")
print(f'Running in {sandbox.sandbox_id} as "{result.stdout.strip()}"')
```

```javascript [JavaScript]
import { Sandbox } from 'e2b'

const sandbox = await Sandbox.connect(sandboxId, { apiUrl: 'https://api.sandbase.ai' })

const result = await sandbox.commands.run('whoami')
console.log(`Running in ${sandbox.sandboxId} as "${result.stdout.trim()}"`)
```

:::

### REST API

Connecting to (and resuming) a sandbox maps to:

```bash
curl -X POST https://api.sandbase.ai/sandboxes/SANDBOX_ID/resume \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

## Keeping a sandbox alive

While connected, you can extend a sandbox's timeout to prevent it from shutting down during long-running work. See [Sandbox Lifecycle → Keepalive](/agents/sandbox-lifecycle) for details.

## Next steps

- [List Sandboxes](/agents/sandbox-list)
- [Sandbox Persistence](/agents/sandbox-persistence)
- [Sandbox Lifecycle](/agents/sandbox-lifecycle)
