---
title: Run a Command
---

# Run a Command

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/processes</code>
</div>

Run a command inside a running sandbox and wait for it to finish. The request
blocks until the process exits, then returns the captured output and exit
code. This is the synchronous, E2B-compatible process endpoint.

All endpoints require authentication and enforce org isolation: a sandbox
that does not belong to your org returns `404 sandbox not found`.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cmd` | string | ✅ | Command to run (e.g. `python3`). |
| `args` | array | ❌ | Command arguments. |
| `envVars` | object | ❌ | Extra environment variables for the process (`{ "KEY": "value" }`). |
| `cwd` | string | ❌ | Working directory. Defaults to `/workspace`. |
| `timeout` | integer | ❌ | Maximum run time in seconds. Defaults to `60`. |

## Request Example

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cmd": "python3", "args": ["-c", "print(1+1)"]}'
```

## Response

```json
{
  "processID": "1234",
  "stdout": "2\n",
  "stderr": "",
  "exitCode": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `processID` | string | The provider's native process identifier. |
| `stdout` | string | Captured standard output. |
| `stderr` | string | Captured standard error. |
| `exitCode` | integer | Process exit code (`0` on success). |

::: tip Exit codes
A non-zero `exitCode` is still returned with HTTP `200` — the command ran but
exited unsuccessfully. A `502` means the command could not be run at all (for
example, the sandbox runtime was unreachable or the run timed out).
:::

## Errors

| Status | Meaning |
|--------|---------|
| `400` | Invalid sandbox id, or missing required `cmd`. |
| `404` | Sandbox not found (or not owned by your org). |
| `502` | The sandbox runtime failed to run the command (unreachable or timed out). |

## Roadmap

The current endpoint runs a command to completion and returns its output in a
single response. The following E2B `Process` streaming capabilities are not
yet exposed by SandBase and are planned for a future release:

- **Streaming start / connect** — stream `stdout`/`stderr` as the process
  runs, instead of waiting for completion (`Process/Start`, `Process/Connect`).
- **Background processes & list** — start long-running processes and list them
  (`Process/List`, process tags).
- **Interactive input** — write to stdin, stream input, or close stdin
  (`Process/SendInput`, `Process/StreamInput`, `Process/CloseStdin`).
- **Signals** — send `SIGTERM` / `SIGKILL` to a running process
  (`Process/SendSignal`).
- **PTY** — allocate a pseudo-terminal and resize it (`Process/Start` with
  `pty`, `Process/Update`).

Until these land, run commands synchronously with this endpoint and keep
individual commands within the `timeout` window.
