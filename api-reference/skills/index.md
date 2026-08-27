---
title: Skills API
description: Upload, create, and manage reusable Skills for SandBase Agents.
---

# Skills API

Skills are reusable instruction and resource bundles for Agents. Create a Skill once, then use its full `vendor_slug/plugin_slug` reference in an Agent or Service configuration.

## Create a Skill in 5 minutes

This example requires `curl`, `jq`, and `zip`. Keep API keys in environment variables rather than source files or Skill bundles.

### 1. Build the bundle

A Hermes Skill ZIP must contain exactly one `SKILL.md`. Its YAML frontmatter must include a normalized runtime `name`.

```bash
export SANDBASE_API_KEY='sk-YOUR_KEY'
export SANDBASE_API_BASE='https://api.sandbase.ai'

: "${SANDBASE_API_KEY:?SANDBASE_API_KEY is required}"

mkdir -p hello-sandbase

cat > hello-sandbase/SKILL.md <<'SKILL_EOF'
---
name: hello-sandbase
description: Give a short SandBase greeting when the user asks for one.
---

# Hello SandBase

When the user asks for a SandBase greeting, reply with one concise sentence that starts with "Hello from SandBase".
SKILL_EOF

(
  cd hello-sandbase
  zip -q -X ../hello-sandbase.zip SKILL.md
)
```

The runtime `name` must match `^[a-z0-9][a-z0-9._-]{0,63}$`, cannot end in `.`, and cannot be a reserved system filename. The registered plugin slug can differ from this runtime name.

### 2. Upload and register it

Upload the ZIP to persistent Skill storage, then register the returned private object URL:

```bash
UPLOAD_RESPONSE="$(
  curl -fsS -X POST "$SANDBASE_API_BASE/v1/skills/files" \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -F 'file=@hello-sandbase.zip'
)"

SKILL_FILE_URL="$(jq -er '.url' <<<"$UPLOAD_RESPONSE")"

SKILL_PAYLOAD="$(
  jq -nc \
    --arg url "$SKILL_FILE_URL" \
    '{
      name: "hello-sandbase",
      description: "A minimal Skill created through the SandBase API",
      categories: ["quickstart"],
      skill_file_url: $url
    }'
)"

SKILL_RESPONSE="$(
  curl -fsS -X POST "$SANDBASE_API_BASE/v1/skills" \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H 'Content-Type: application/json' \
    --data "$SKILL_PAYLOAD"
)"

SKILL_ID="$(jq -er '.id' <<<"$SKILL_RESPONSE")"
SKILL_REF="$(jq -er '.name' <<<"$SKILL_RESPONSE")"

jq '{id, name, display_name, vendor_slug, plugin_slug}' <<<"$SKILL_RESPONSE"
```

`SKILL_REF` is the full reference required by Agent definitions. Do not substitute the Skill ID, a bare plugin slug, or the file URL.

### 3. Attach it to a Service

```bash
ENDPOINT_PAYLOAD="$(
  jq -nc \
    --arg skill "$SKILL_REF" \
    '{
      name: "hello-skill-endpoint",
      runtime: "hermes",
      skills: [$skill],
      protocols: ["rest"]
    }'
)"

curl -fsS -X POST "$SANDBASE_API_BASE/v1/endpoints" \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H 'Content-Type: application/json' \
  --data "$ENDPOINT_PAYLOAD" \
  | jq .
```

SandBase validates and installs the bundle before the Service invokes its Agent. Missing or duplicate `SKILL.md` files, invalid frontmatter names, unsafe archive paths, and unreadable bundles fail materialization instead of starting the Agent without the Skill.

## Upload a Skill file

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/skills/files</code>
</div>

Send `multipart/form-data` with a required `file` field. The same endpoint accepts Skill archives and preview images. The response is `201 Created`:

```json
{
  "url": "https://media.sandbase.ai/_private/your-org/skills/file-id/my-skill.zip",
  "key": "_private/your-org/skills/file-id/my-skill.zip",
  "filename": "my-skill.zip",
  "size": 1234,
  "content_type": "application/zip"
}
```

Skill archives can be up to 50 MB. JPEG, PNG, WebP, and GIF preview images can be up to 10 MB. Although the upload API accepts several archive formats, use ZIP for Agent runtime usage. A bundle can contain up to 1,024 files and 60 MB of uncompressed data at runtime. Files outside the directory containing the unique `SKILL.md` are not installed.

## Create a Skill resource

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/skills</code>
</div>

```json
{
  "name": "my-skill",
  "description": "A reusable Skill",
  "categories": ["productivity"],
  "skill_file_url": "https://media.sandbase.ai/_private/.../my-skill.zip",
  "preview_image_urls": []
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Display name, up to 100 characters. SandBase derives a unique plugin slug from it. |
| `description` | string | ❌ | Description, up to 1,000 characters. |
| `categories` | string[] | ❌ | Category labels. |
| `skill_file_url` | string | Conditional | URL returned by `/v1/skills/files`. Required unless `git_url` is provided. |
| `git_url` | string | Conditional | Git source URL. Required unless `skill_file_url` is provided. Use an uploaded ZIP when attaching the Skill to an Agent runtime. |
| `preview_image_urls` | string[] | ❌ | Preview image URLs. |

A successful response is `201 Created`. Its `name` is the generated full Skill reference:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "vendor-slug/my-skill",
  "display_name": "my-skill",
  "vendor_slug": "vendor-slug",
  "plugin_slug": "my-skill",
  "icon_url": "",
  "preview_urls": [],
  "created_at": "2026-07-17T00:00:00Z"
}
```

## Manage Skills

All operations are scoped to the organization associated with the API key.

Skill resource IDs are UUIDs. Agent and Service definitions use the separate `vendor_slug/plugin_slug` reference returned in `name`.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/skills` | [Create a Skill](./create) from an uploaded bundle or Git source. |
| `GET` | `/v1/skills?page=1&page_size=20` | [List Skills](./list). `page_size` is capped at 1,000. |
| `GET` | `/v1/skills/{skill_id}` | [Get a Skill](./get) and its source metadata. |
| `PUT` | `/v1/skills/{skill_id}` | [Update Skill metadata](./update) or replace its uploaded bundle URL. |
| `DELETE` | `/v1/skills/{skill_id}` | [Soft-delete a Skill](./delete). |

`PUT` has mixed replacement semantics. Always send the display fields you want to keep: omitted `name`, `description`, and `categories` are cleared. By contrast, omitted `skill_file_url`, `preview_image_urls`, `metadata`, and `unified_schema` preserve their stored values. A blank bundle URL also preserves the current bundle; an explicit empty preview array clears previews. The generated full Skill reference in the response's `name` field never changes.

Delete the Quickstart Skill when you no longer need it:

```bash
curl -fsS -X DELETE "$SANDBASE_API_BASE/v1/skills/$SKILL_ID" \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  | jq .
```

## Errors

```json
{
  "error": {
    "type": "invalid_request",
    "message": "name is required"
  }
}
```

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Invalid request body, missing name/source, or invalid file upload. |
| 401 | `authentication_error` | API key is missing or invalid. |
| 404 | `not_found` | Skill does not exist or is not visible to the caller. |
| 500 | `internal_error` | Skill creation or storage failed. |

For Service validation and runtime errors, see [Service errors](/api-reference/endpoints/#errors).
