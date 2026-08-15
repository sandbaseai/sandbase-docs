---
title: Create Environment
description: Create an execution environment defining the container, packages, and networking for agent sessions.
---

# Create Environment

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/environments</code>
</div>

Create an environment. An environment defines the container configuration — packages and networking — that agent sessions run in.

::: info Claude API compatibility
SandBase implements the `cloud` environment type from the [Claude Managed Agents](https://platform.claude.com/docs/en/api/python/beta/environments/create) Environment API. The `self_hosted` type and `scope` field are accepted for forward compatibility but not yet active.
:::

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | ✅ | Human-readable name for the environment. |
| `description` | string | ❌ | Optional description. |
| `config` | object | ❌ | Environment configuration. Defaults to a `cloud` environment with unrestricted networking and no extra packages. |
| `metadata` | object | ❌ | Arbitrary key-value metadata. |

### Config Object

For a cloud environment, `config` has the following shape:

```json
{
  "type": "cloud",
  "networking": { "type": "unrestricted" },
  "packages": {
    "type": "packages",
    "pip": ["pandas", "numpy"],
    "npm": ["express"]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"cloud"` |
| `networking` | object | Network access policy. See [Networking](#networking). |
| `packages` | object | Packages to preinstall. See [Packages](#packages). |

::: tip SandBase extension — `base_template`
SandBase sandboxes are template-based. You may include an optional `base_template` field in the cloud config (e.g. `"code_interpreter"`, `"hermes-agent"`) to select the base image. If omitted, a default base is used and packages are layered on top. See [Templates](/api-reference/sandboxes/templates).
:::

### Networking

The `networking` field is a discriminated union on `type`.

#### Unrestricted

```json
{ "type": "unrestricted" }
```

Full outbound network access.

#### Limited

```json
{
  "type": "limited",
  "allowed_hosts": ["api.example.com"],
  "allow_mcp_servers": false,
  "allow_package_managers": true
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `allowed_hosts` | string[] | `[]` | Domains the container can reach. |
| `allow_mcp_servers` | boolean | `false` | Allow outbound access to the agent's configured MCP endpoints, beyond `allowed_hosts`. |
| `allow_package_managers` | boolean | `false` | Allow outbound access to public package registries (PyPI, npm, etc.), beyond `allowed_hosts`. |

### Packages

Preinstall packages by manager. Use the version syntax of each manager (e.g. `package==1.0.0` for pip). Unversioned installs the latest.

```json
{
  "type": "packages",
  "apt": ["ffmpeg"],
  "pip": ["pandas", "numpy==1.26.0"],
  "npm": ["express"],
  "go": [],
  "cargo": [],
  "gem": []
}
```

| Field | Type | Description |
|-------|------|-------------|
| `apt` | string[] | Ubuntu/Debian packages |
| `pip` | string[] | Python packages |
| `npm` | string[] | Node.js packages |
| `go` | string[] | Go packages |
| `cargo` | string[] | Rust packages |
| `gem` | string[] | Ruby packages |

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

env = client.beta.environments.create(
    name="python-data-analysis",
    description="Python environment with data-analysis packages.",
    config={
        "type": "cloud",
        "networking": { "type": "limited", "allowed_hosts": ["api.example.com"], "allow_package_managers": True },
        "packages": { "type": "packages", "pip": ["pandas", "numpy"] }
    }
)
print(env.id)
```

```bash [cURL]
curl -X POST https://api.sandbase.ai/v1/environments \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "python-data-analysis",
    "config": {
      "type": "cloud",
      "networking": { "type": "limited", "allowed_hosts": ["api.example.com"], "allow_package_managers": true },
      "packages": { "type": "packages", "pip": ["pandas", "numpy"] }
    }
  }'
```

:::

## Response

Returns an [Environment object](#environment-object).

```json
{
  "id": "env_011CZkZ9X2dpNyB7HsEFoRfW",
  "type": "environment",
  "name": "python-data-analysis",
  "description": "Python environment with data-analysis packages.",
  "config": {
    "type": "cloud",
    "networking": {
      "type": "limited",
      "allowed_hosts": ["api.example.com"],
      "allow_mcp_servers": false,
      "allow_package_managers": true
    },
    "packages": {
      "type": "packages",
      "apt": [],
      "cargo": [],
      "gem": [],
      "go": [],
      "npm": [],
      "pip": ["pandas", "numpy"]
    }
  },
  "metadata": {},
  "archived_at": null,
  "created_at": "2026-05-29T10:00:00Z",
  "updated_at": "2026-05-29T10:00:00Z"
}
```

## Environment Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Environment identifier (`env_...`) |
| `type` | string | Always `"environment"` |
| `name` | string | Human-readable name |
| `description` | string | User-provided description |
| `config` | object | Cloud configuration (`networking`, `packages`) |
| `metadata` | object | User-defined key-value pairs |
| `archived_at` | string \| null | RFC 3339 timestamp when archived |
| `created_at` | string | RFC 3339 timestamp |
| `updated_at` | string | RFC 3339 timestamp |

::: tip Roadmap
Claude's Environment also supports a `self_hosted` config type and an organization/account `scope` field. These are not yet active in SandBase.
:::

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing required fields or invalid config |
| 401 | `authentication_error` | Invalid or missing API key |
