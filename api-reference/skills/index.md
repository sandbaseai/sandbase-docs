---
title: Skills API
description: Upload versioned Skill bundles and attach them to Agents.
---
# Skills API

A Skill is a versioned ZIP bundle of instructions and resources that an Agent can mount. Skill IDs use the `skl_` prefix, and version identifiers are strings such as `"1"`.

## Skill operations

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/skills` | [Create a Skill](./create) from a ZIP upload |
| `GET` | `/v1/skills` | [List Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Get a Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Update](./update) default version, status, or metadata |
| `DELETE` | `/v1/skills/{skill_id}` | [Delete a Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Download the default version ZIP |
| `GET` | `/v1/skills/{skill_id}/versions` | [List versions](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Upload a version](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Get a version](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Download a version ZIP |
| `GET` | `/v1/skills/catalog` | [Browse public Skills](./catalog) |

## Five-minute setup

1. Create a folder with a `SKILL.md` whose frontmatter sets `name` and `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Zip it (`zip -r release-notes.zip release-notes/`). The archive can be at most 5 MiB.
3. Upload it as the single multipart part `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Reference it from an Agent with [Update Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

`"version": null` follows the Skill's `default_version`; a string pins one version. The version is resolved and frozen when each Session starts, and the Session reports it in `environment.skills`.

## Versions

- Uploading to `POST /v1/skills/{skill_id}/versions` adds the next version. Send the form field `default=true` to make it the default.
- `POST /v1/skills/{skill_id}` with `default_version` switches the default without uploading.
- `status` is `active` or `disabled`. New Sessions of an Agent that references a disabled Skill fail with `400 skill_not_found`; Sessions that already froze a version keep it.
- A Skill that any Agent version references cannot be deleted (409). Disable it instead, or remove it from your Agents first.

## Pagination and errors

Lists use cursor pagination with `limit` 0-100, `after`, and `order`. Errors use the [Agents error envelope](/api-reference/errors#agents-platform-errors).
