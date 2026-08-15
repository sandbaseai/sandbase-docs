---
title: Sandbox Lifecycle
description: Sandbox states, timeout behavior, keepalive, and maximum lifetime on SandBase.
---

# Sandbox Lifecycle

Every sandbox goes through a defined lifecycle from creation to termination. Understanding these states helps you manage resources efficiently and avoid unexpected shutdowns.

## States

```
creating ──→ running ──→ paused ──→ stopped
                │                      ▲
                │                      │
                └──────────────────────┘
                    (timeout/shutdown)
```

| State | Description | Billable |
|-------|-------------|----------|
| `creating` | Sandbox is being provisioned (typically 2-5 seconds) | No |
| `running` | Sandbox is active and accepting commands | Yes |
| `paused` | Sandbox state is saved to disk, not consuming compute | No |
| `stopped` | Sandbox is terminated and resources are released | No |

## State Transitions

### Creating → Running

When you call `POST /sandboxes`, the sandbox enters `creating` state while the environment is provisioned. Once ready, it transitions to `running` automatically.

```python
import requests
import time

# Create sandbox
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={"templateID": "code_interpreter", "timeout": 300}
)
sandbox = response.json()

# Sandbox is immediately in "running" state (creation is synchronous)
print(sandbox["status"])  # "running"
```

### Running → Paused

Pause a sandbox to save its state without consuming compute resources. The filesystem and process state are preserved.

```python
# Pause the sandbox
requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/pause",
    headers={"Authorization": "Bearer sk-sb-your-key"}
)
```

**When to pause:**
- Long gaps between interactions (>5 minutes)
- Saving state for later use
- Reducing costs during idle periods

### Paused → Running (Resume)

Resume a paused sandbox to continue where you left off:

```python
# Resume the sandbox
response = requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/resume",
    headers={"Authorization": "Bearer sk-sb-your-key"}
)
# Sandbox is back in "running" state
```

**Resume time:** Typically 1-3 seconds. All files and environment state are preserved.

### Running → Stopped

A sandbox stops when:
1. You explicitly shut it down
2. The timeout expires
3. The maximum lifetime (1 hour) is reached

```python
# Explicitly stop a sandbox
requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/shutdown",
    headers={"Authorization": "Bearer sk-sb-your-key"}
)
```

::: warning
Once stopped, a sandbox cannot be resumed. All data is permanently deleted. Download any files you need before stopping.
:::

## Timeout Behavior

Every sandbox has a timeout — the maximum duration of inactivity before automatic shutdown.

### Default Timeouts

| Template | Default Timeout |
|----------|----------------|
| code_interpreter | 300s (5 minutes) |
| claude | 600s (10 minutes) |
| code_interpreter | 300s (5 minutes) |
| claude | 600s (10 minutes) |
| codex | 600s (10 minutes) |
| hermes-agent | 600s (10 minutes) |
| opencode | 600s (10 minutes) |
| desktop | 600s (10 minutes) |
| base | 300s (5 minutes) |

### Setting Custom Timeout

Specify a timeout when creating the sandbox:

```python
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "templateID": "code_interpreter",
        "timeout": 900  # 15 minutes
    }
)
```

### Timeout Reset

The timeout resets every time you interact with the sandbox (execute a command, read/write files). If you don't interact for the timeout duration, the sandbox automatically stops.

```
[Create] ──→ [Exec command] ──→ [5 min idle] ──→ [Exec command] ──→ [5 min idle] ──→ [STOPPED]
  │              │                                     │
  └── timer ─────┘── timer resets ─────────────────────┘── timer resets ──→ expires
```

### Extending Timeout (Keepalive)

To prevent a sandbox from timing out during long-running operations, use the keepalive endpoint:

```python
# Extend the sandbox timeout by refreshing it
requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/refreshes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={"duration": 300}  # Add 5 more minutes
)
```

You can also update the timeout setting:

```python
# Change the timeout duration
requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/timeout",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={"timeout": 600}  # Set to 10 minutes
)
```

## Maximum Lifetime

Regardless of timeout settings and keepalive calls, every sandbox has a **maximum lifetime of 1 hour**. After 1 hour from creation, the sandbox is automatically stopped.

This limit exists to:
- Prevent runaway resource consumption
- Ensure fair resource allocation across users
- Protect against forgotten sandboxes

::: tip
For long-running workloads, pause the sandbox when idle and resume when needed. Paused time does not count toward the 1-hour lifetime.
:::

## Monitoring Sandbox Status

### Get Sandbox Details

```bash
curl https://api.sandbase.ai/sandboxes/SANDBOX_ID \
  -H "Authorization: Bearer sk-sb-your-key"
```

Response:

```json
{
  "sandboxID": "sb_abc123",
  "templateID": "code_interpreter",
  "status": "running",
  "createdAt": "2024-01-15T10:00:00Z",
  "endAt": "2024-01-15T11:00:00Z",
  "metadata": {
    "agent_id": "agt_xyz"
  }
}
```

### List All Sandboxes

```bash
curl https://api.sandbase.ai/sandboxes \
  -H "Authorization: Bearer sk-sb-your-key"
```

Filter by status:

```bash
curl "https://api.sandbase.ai/sandboxes?status=running" \
  -H "Authorization: Bearer sk-sb-your-key"
```

## Lifecycle Best Practices

### 1. Set Appropriate Timeouts

Don't set timeouts longer than needed. Shorter timeouts save costs:

```python
# Interactive coding session — longer timeout
sandbox = create_sandbox("code_interpreter", timeout=600)

# Quick script execution — short timeout
sandbox = create_sandbox("base", timeout=60)
```

### 2. Pause Instead of Keeping Alive

If you'll return to a sandbox later, pause it rather than keeping it running:

```python
# After finishing a batch of work
pause_sandbox(sandbox_id)

# Later, when you need it again
resume_sandbox(sandbox_id)
```

### 3. Clean Up When Done

Always shut down sandboxes you no longer need:

```python
# Download results first
download_file(sandbox_id, "/workspace/results.csv")

# Then shut down
shutdown_sandbox(sandbox_id)
```

### 4. Handle Timeout Gracefully

Your application should handle the case where a sandbox has timed out:

```python
def exec_with_recovery(sandbox_id, cmd, args):
    """Execute a command, recovering from timeout."""
    try:
        return exec_command(sandbox_id, cmd, args)
    except requests.HTTPError as e:
        if e.response.status_code == 404:
            # Sandbox was stopped — create a new one
            new_sandbox = create_sandbox("code_interpreter", timeout=300)
            return exec_command(new_sandbox["sandboxID"], cmd, args)
        raise
```

### 5. Use Metadata for Tracking

Tag sandboxes with metadata to track their purpose:

```python
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "templateID": "code_interpreter",
        "timeout": 300,
        "metadata": {
            "user_id": "user_123",
            "task": "data_analysis",
            "session": "abc-def-ghi"
        }
    }
)
```
