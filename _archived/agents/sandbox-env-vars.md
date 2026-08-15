---
title: Environment Variables
description: Set environment variables for a sandbox at creation time and when running commands.
---

# Environment Variables

This page covers how to set environment variables in a sandbox and the default environment variables available inside it.

## Default environment variables

When a sandbox is created, SandBase sets useful metadata as environment variables so processes inside the sandbox can detect their context:

| Variable | Description |
|----------|-------------|
| `E2B_SANDBOX` | Set to `true` inside a sandbox VM |
| `E2B_SANDBOX_ID` | The sandbox ID |
| `E2B_TEMPLATE_ID` | The template the sandbox was created from |

::: code-group

```python [Python]
sandbox = Sandbox.create(api_url="https://api.sandbase.ai")
result = sandbox.commands.run("echo $E2B_SANDBOX_ID")
print(result.stdout)
```

```javascript [JavaScript]
const sandbox = await Sandbox.create({ apiUrl: 'https://api.sandbase.ai' })
const result = await sandbox.commands.run('echo $E2B_SANDBOX_ID')
console.log(result.stdout)
```

:::

::: tip Compatibility
SandBase keeps the `E2B_*` variable names for drop-in compatibility with the E2B SDK and existing tooling.
:::

## Setting environment variables

There are two ways to set environment variables.

### 1. Global — at sandbox creation

Set environment variables that apply to all commands run in the sandbox.

::: code-group

```python [Python]
sandbox = Sandbox.create(
    envs={"MY_VAR": "my_value"},
    api_url="https://api.sandbase.ai",
)
```

```javascript [JavaScript]
const sandbox = await Sandbox.create({
  envs: { MY_VAR: 'my_value' },
  apiUrl: 'https://api.sandbase.ai',
})
```

:::

#### REST API

When creating a sandbox over REST, pass `envVars`:

```bash
curl -X POST https://api.sandbase.ai/sandboxes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "templateID": "code_interpreter",
    "timeout": 300,
    "envVars": { "MY_VAR": "my_value" }
  }'
```

### 2. Per-command — when running a command

Set environment variables scoped to a single command. These override a global variable of the same name for that command only.

::: code-group

```python [Python]
sandbox = Sandbox.create(api_url="https://api.sandbase.ai")
sandbox.commands.run("echo $MY_VAR", envs={"MY_VAR": "123"})
```

```javascript [JavaScript]
const sandbox = await Sandbox.create({ apiUrl: 'https://api.sandbase.ai' })
await sandbox.commands.run('echo $MY_VAR', { envs: { MY_VAR: '123' } })
```

:::

::: warning
Per-command environment variables are scoped to that command but are **not** private at the OS level — other processes in the sandbox may be able to read them.
:::

## Next steps

- [Cloud Sandboxes](/agents/sandboxes)
- [Sandbox Lifecycle](/agents/sandbox-lifecycle)
