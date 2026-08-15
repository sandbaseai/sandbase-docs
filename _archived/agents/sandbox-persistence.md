---
title: Sandbox Persistence
description: Pause a sandbox and resume it later from the exact state it was in — filesystem and memory preserved.
---

# Sandbox Persistence

Sandbox persistence lets you pause a sandbox and resume it later from the same state it was in when you paused it. This preserves both the sandbox's **filesystem** and its **memory** — all running processes, loaded variables, and data.

SandBase is E2B-compatible, so you can use the E2B SDK pointed at SandBase:

::: code-group

```python [Python]
from e2b import Sandbox

sbx = Sandbox.create(api_url="https://api.sandbase.ai")
```

```javascript [JavaScript]
import { Sandbox } from 'e2b'

const sbx = await Sandbox.create({ apiUrl: 'https://api.sandbase.ai' })
```

:::

## Sandbox state transitions

```
            create
              │
              ▼
        ┌──────────┐   pause    ┌──────────┐
        │ running  │ ─────────▶ │  paused  │
        │          │ ◀───────── │          │
        └────┬─────┘  connect   └────┬─────┘
             │                       │
             │ kill                  │ kill
             ▼                       ▼
          ┌──────────────────────────┐
          │          stopped          │
          └──────────────────────────┘
```

| State | Description |
|-------|-------------|
| `running` | Actively executing, consuming resources. Initial state after creation. |
| `paused` | Execution suspended; filesystem + memory preserved. Cannot execute code. |
| `stopped` | Terminated, resources released. Terminal state — cannot be resumed. |

## Pausing a sandbox

When you pause a sandbox, both its filesystem and memory state are saved. Save the sandbox ID so you can resume it later.

::: code-group

```python [Python]
from e2b import Sandbox

sbx = Sandbox.create(api_url="https://api.sandbase.ai")
print("Sandbox created", sbx.sandbox_id)

# Pause the sandbox — save the ID to resume later
sbx.pause()
print("Sandbox paused", sbx.sandbox_id)
```

```javascript [JavaScript]
import { Sandbox } from 'e2b'

const sbx = await Sandbox.create({ apiUrl: 'https://api.sandbase.ai' })
console.log('Sandbox created', sbx.sandboxId)

await sbx.pause()
console.log('Sandbox paused', sbx.sandboxId)
```

:::

### REST API

If you're not using the SDK, pause maps to:

```bash
curl -X POST https://api.sandbase.ai/sandboxes/SANDBOX_ID/pause \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

## Resuming a sandbox

Resuming restores the sandbox to the exact state it was in when paused — files, processes, and in-memory data.

::: code-group

```python [Python]
from e2b import Sandbox

# Connect to a paused sandbox by ID — it resumes automatically
sbx = Sandbox.connect(sandbox_id, api_url="https://api.sandbase.ai")
print("Resumed", sbx.sandbox_id)
```

```javascript [JavaScript]
import { Sandbox } from 'e2b'

const sbx = await Sandbox.connect(sandboxId, { apiUrl: 'https://api.sandbase.ai' })
console.log('Resumed', sbx.sandboxId)
```

:::

### REST API

```bash
curl -X POST https://api.sandbase.ai/sandboxes/SANDBOX_ID/resume \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

## Timeout on resume

When you connect to a paused sandbox, its timeout resets. Pass a custom timeout to control how long it stays running after resuming:

::: code-group

```python [Python]
sbx = Sandbox.connect(sandbox_id, timeout=60, api_url="https://api.sandbase.ai")  # 60 seconds
```

```javascript [JavaScript]
const sbx = await Sandbox.connect(sandboxId, { timeoutMs: 60_000, apiUrl: 'https://api.sandbase.ai' })
```

:::

## Removing a paused sandbox

Paused sandboxes are retained until you explicitly remove them. Call `kill()` to permanently delete a sandbox — this cannot be undone.

::: code-group

```python [Python]
sbx.kill()
# Or by ID:
Sandbox.kill(sandbox_id, api_url="https://api.sandbase.ai")
```

```javascript [JavaScript]
await sbx.kill()
// Or by ID:
await Sandbox.kill(sandboxId, { apiUrl: 'https://api.sandbase.ai' })
```

:::

## Network and running services

If you have a service (e.g. a web server) running inside a sandbox and you pause it, the service becomes unreachable and connected clients are disconnected. After resuming, the service is reachable again, but clients need to reconnect.

## Notes and limits

- **Resume time**: typically a few seconds, depending on memory size.
- **Paused retention**: paused sandboxes are kept until explicitly killed.
- **Continuous runtime**: a running sandbox has a maximum continuous lifetime (see [Sandbox Lifecycle](/agents/sandbox-lifecycle)). Pausing and resuming resets that window.

::: tip Roadmap
E2B's **snapshots** (one-to-many checkpoints that spawn new sandboxes) and **auto-resume on request** are not yet available on SandBase. Today, persistence is one-to-one: a paused sandbox is resumed back into the same sandbox via `connect()`.
:::

## Next steps

- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — states, timeout, and keepalive
- [List Sandboxes](/agents/sandbox-list) — find running and paused sandboxes
- [Connect to a Running Sandbox](/agents/sandbox-connect) — reconnect by ID
