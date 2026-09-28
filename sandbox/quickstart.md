---
title: Sandbox quickstart with the E2B SDK
description: Connect the official E2B JavaScript and Python SDKs to SandBase, run commands, read and write files, and manage a sandbox safely.
---

<script setup>
import SandboxPromo from '../.vitepress/theme/SandboxPromo.vue'
</script>

# Sandbox quickstart with the E2B SDK

<SandboxPromo />

Use the official E2B SDK with your SandBase API key to create an isolated sandbox, run a command, and read and write files. This guide targets **E2B JavaScript and Python SDK 2.51.0**.

## 1. Configure the official SDK

[Create a SandBase API key in the Console](https://www.sandbase.ai/console/keys), then configure the standard E2B environment variables. The official SDK reads these automatically in both JavaScript and Python.

| Environment variable | Value |
|---|---|
| `E2B_API_KEY` | Your SandBase API key from [Console → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Leave unset so the SDK uses each sandbox's data-plane address |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

If you already store the key in `SANDBASE_API_KEY`, reuse it:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

You do not need an E2B or Novita provider key. Use a regular SandBase key eligible for Sandbox access; a key restricted to another capability may be rejected. See [API keys](/getting-started/api-keys).

### Can existing E2B code stay unchanged?

Yes, for supported operations when your application already reads SDK connection settings from the environment and its template is available on SandBase. Keep the official SDK and your existing calls; change the key, API URL, and domain above. Explicit connection options in application code take precedence over environment variables, so remove or update any hardcoded E2B endpoint, domain, or provider key.

Set **both** `E2B_API_URL` and `E2B_DOMAIN`. With only a domain, SDK 2.51.0 derives an API host with an additional `api.` prefix. `E2B_SANDBOX_URL` overrides the per-instance command/file address; do not set it to the control API origin. Debug mode changes SDK address selection for local development, so keep it disabled for this HTTPS service.

The control API creates and manages instances. Commands, files, and application ports use per-instance subdomains under `sandbox.sandbase.ai`. Do not append the model API's `/v1` prefix. A successful control API request alone does not verify command/file access or all provider features.

The examples read process environment variables. A `.env` file works only if your application or launcher loads it before using the SDK.

### Choose a template

Use your SandBase key to list the templates visible to your organization:

```bash
curl --fail --silent --show-error https://sandbox.sandbase.ai/templates \
  -H "X-API-Key: $E2B_API_KEY"
```

Choose an enabled template from the response and copy its `templateID`:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` is a variable used by the examples below, not a built-in E2B SDK setting. They pass it explicitly to `Sandbox.create`. Existing code can keep its template argument if that ID or name is available on SandBase. Do not assume an upstream E2B template ID or the SDK default `base` is available; if the list is empty, request template access for your organization.

## 2. Create, execute, and clean up

These examples create a real resource. They use a two-minute lifetime and explicitly delete the instance in `finally`. Run one example first and confirm cleanup before running it again.

### JavaScript

Use Node.js 22 or newer in an application directory:

```bash
npm install --save-exact e2b@2.51.0
```

Save as `sandbox-example.mjs`:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

Run with the SDK environment variables and selected template configured:

```bash
node sandbox-example.mjs
```

### Python

Install the pinned SDK in your Python environment:

```bash
python -m pip install 'e2b==2.51.0'
```

Save as `sandbox_example.py`:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

Success means both command/file verification and cleanup completed. Keep run and sandbox IDs within your organization. Do not log the SDK object: it can hold access tokens.

If creation times out without an ID, the resource may still exist. Ask your operator to locate it using `quickstartRunId` metadata before creating another. A timeout or interrupted process does not confirm deletion; `finally` cannot run after a forced process termination.

## 3. Extend the lifetime or pause and reconnect

Insert these snippets inside the corresponding example's `try` block after the file check and before cleanup. Pause/resume must be supported by the selected template and provider.

JavaScript uses **milliseconds** for these SDK timeouts:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python uses **seconds**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Reconnect returns a fresh SDK object and session credentials. Use that object for subsequent commands and files. Deleting a sandbox ends its lifecycle; this guide does not promise storage persistence after deletion. The sandbox lifetime and the timeout for an individual command or HTTP request are different settings.

## 4. Access application ports

After your application is listening inside the sandbox, use `sandbox.getHost(port)` in JavaScript or `sandbox.get_host(port)` in Python to obtain its host. Application traffic requires the `e2b-traffic-access-token` header, using `sandbox.trafficAccessToken` or `sandbox.traffic_access_token` from the current connection.

The host alone does not authorize access. Your HTTP or WebSocket client must send the header; simply opening the URL in a browser tab does not add it. Treat traffic tokens and signed file URLs as credentials, and keep them out of logs and shared links. Port access depends on the deployment's data plane and the selected provider's capabilities.

## Troubleshooting

| Symptom | What to check |
|---|---|
| Authentication or scope error | SandBase key validity, organization access, and key scope |
| Template not found | The exact enabled template ID/name and its visibility to your organization |
| Create succeeds but commands/files fail | Sandbox wildcard DNS, TLS, gateway routing, and current session credentials |
| Requests go to the wrong service | `E2B_API_URL`, `E2B_DOMAIN`, and any hardcoded SDK options that override them |
| Access fails after pause | Reconnect and use the newly returned SDK object |
| Application port rejects a request | Application readiness and the current traffic token header |
| `unsupported_operation` | The selected provider does not support that operation; check availability before relying on it |
| Create response is unknown | Reconcile the recorded run ID before creating another instance |
| Cleanup fails | Retry deletion for the recorded instance ID; do not rerun the whole create flow |

The examples cover the basic command/file workflow. Template builds, snapshots, events, webhooks, and advanced networking need separate capability checks. Installing an E2B SDK does not by itself prove full compatibility with every provider.

## SDK references

- [E2B documentation](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
