---
title: File Operations
---

# File Operations

Read, write, list, upload, download, and delete files inside a running
sandbox. These endpoints are E2B-compatible and are served by the SandBase
API under the `/sandboxes/:id/filesystem` prefix.

All endpoints require authentication and enforce org isolation: a sandbox
that does not belong to your org returns `404 sandbox not found`.

::: tip Paths
`path` is an absolute path inside the sandbox (for example
`/home/user/main.py`). For directory listing, when `path` is omitted it
defaults to `/workspace`.
:::

## List Directory

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id/filesystem/list?path=/home/user</code>
</div>

List files and directories at the given path.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | ❌ | Directory to list. Defaults to `/workspace`. |

### Response

```json
[
  {"name": "main.py", "path": "/home/user/main.py", "isDir": false, "size": 1024},
  {"name": "data", "path": "/home/user/data", "isDir": true, "size": 0}
]
```

## Read File

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id/filesystem?path=/home/user/main.py</code>
</div>

Read file content. The body is returned base64-encoded (E2B compatible).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | ✅ | File to read. |

### Response

```json
{
  "content": "cHJpbnQoIkhlbGxvIik="
}
```

::: tip Binary downloads
For large or binary files, prefer [Download File](#download-file), which
streams the raw bytes instead of base64-encoding them in JSON.
:::

## Write File

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/filesystem</code>
</div>

Write content to a file. If the file exists it is overwritten. Content must
be base64-encoded (E2B compatible).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | ✅ | Destination path in the sandbox. |
| `content` | string | ✅ | File content, base64-encoded. |

### Request Example

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01.../filesystem \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path": "/home/user/main.py", "content": "cHJpbnQoIkhlbGxvIik="}'
```

Returns `200 OK` with an empty body on success.

## Upload File

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/filesystem/upload</code>
</div>

Upload a file using a multipart form. Use this for binary files or files
too large to base64-encode inline.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | ✅ | Destination path in the sandbox (form field). |
| `file` | file | ✅ | File content (form field). |

### Request Example

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01.../filesystem/upload \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -F "path=/home/user/data.csv" \
  -F "file=@./data.csv"
```

Returns `200 OK` on success.

::: warning
Maximum file upload size: 100 MB.
:::

## Download File

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id/filesystem/download?path=/home/user/data.csv</code>
</div>

Download a file as raw binary. The response streams the file content with a
`Content-Disposition: attachment` header and
`Content-Type: application/octet-stream`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | ✅ | File to download. |

### Request Example

```bash
curl -X GET "https://api.sandbase.ai/sandboxes/sbx_01.../filesystem/download?path=/home/user/data.csv" \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -o data.csv
```

## Delete File

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">DELETE</span>
  <code>/sandboxes/:id/filesystem?path=/home/user/main.py</code>
</div>

Delete a file. Returns `204 No Content` on success.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | ✅ | File to delete. |

## Stat

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id/filesystem/stat?path=/home/user/main.py</code>
</div>

Return metadata for a single file or directory.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | ✅ | File or directory to inspect. |

### Response

```json
{
  "name": "main.py",
  "path": "/home/user/main.py",
  "isDir": false,
  "size": 1024
}
```

## Make Directory

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/filesystem/mkdir</code>
</div>

Create a directory. Parent directories are created as needed.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | ✅ | Directory path to create. |

### Request Example

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01.../filesystem/mkdir \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path": "/home/user/project/src"}'
```

### Response

```json
{
  "name": "src",
  "path": "/home/user/project/src",
  "isDir": true,
  "size": 0
}
```

## Move / Rename

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/filesystem/move</code>
</div>

Move or rename a file or directory.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | ✅ | Existing path. |
| `destination` | string | ✅ | New path. |

### Request Example

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01.../filesystem/move \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"source": "/home/user/old.txt", "destination": "/home/user/new.txt"}'
```

### Response

```json
{
  "name": "new.txt",
  "path": "/home/user/new.txt",
  "isDir": false,
  "size": 1024
}
```

## Errors

| Status | Meaning |
|--------|---------|
| `400` | Invalid sandbox id, missing `path`/`source`/`destination`, or invalid base64 content. |
| `404` | Sandbox not found (or not owned by your org). |
| `502` | Provider failed to perform the file operation. |

## Roadmap

The following E2B envd filesystem operations are not yet exposed by SandBase
and are planned for a future release:

- **Compose** — zero-copy concatenation of multiple files into one.
- **Watch directory** — streaming filesystem change events
  (`CreateWatcher` / `GetWatcherEvents` / `WatchDir` / `RemoveWatcher`).

Until directory watching lands, change notifications can be polled by listing
the directory.
