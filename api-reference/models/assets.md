---
title: Media Assets API
description: Register reusable media Assets and retrieve their current metadata and download URLs.
---

# Media Assets API

Register media file URLs into the platform asset library and get an `asset_url` for use in video generation requests.

## Overview

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/assets` | Register an Asset |
| `GET` | `/v1/assets/{id}` | Get Asset metadata and a current download URL |

## POST /v1/assets

Registers a publicly accessible file URL into the asset library and returns an `asset_url` that can be referenced in video generation requests.

### Request

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| Field | Type | Required | Description |
|-------|------|----------|--------------|
| `url` | string | Yes | Publicly accessible file URL |
| `asset_type` | string | Yes | Asset type: `Image` / `Video` / `Audio` (case-sensitive) |
| `name` | string | No | Optional asset name |

### Response

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Field | Description |
|-------|--------------|
| `id` | Internal record ID |
| `asset_url` | Reference address used in video generation requests |
| `asset_type` | Asset type |
| `name` | Asset name |
| `created_at` | Creation timestamp |

### Using asset_url

Once registered, pass the `asset_url` to an input field that accepts an Asset reference in the selected model's live schema. Field names vary by model; for example:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Errors

| HTTP Status | Description |
|-------------|--------------|
| 400 | Missing required field or invalid `asset_type` |
| 502 | Upstream asset registration failed |
| 500 | No credential available or internal error |

---

## GET /v1/assets/{id}

Retrieves a signed download URL for a registered asset by its external ID. Used for previewing or downloading the underlying file.

### Request

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parameter | Location | Description |
|-----------|----------|--------------|
| `id` | path | The external ID (the part after `asset://` in `asset_url`) |

### Response

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Field | Description |
|-------|--------------|
| `asset_url` | Reference address for video generation (permanent) |
| `status` | Provider-reported Asset lifecycle status. Treat it as an open string. |
| `download_url` | Provider-returned download URL; it can be empty while the Asset is not ready |

### Errors

| HTTP Status | Description |
|-------------|--------------|
| 404 | Asset not found or does not belong to your organization |
| 502 | Upstream query failed |

---

## Notes

::: tip Important
- `asset_url` has the format `asset://{external_id}` and is the reusable reference to pass to supported model inputs
- Treat `download_url` as provider-managed. If it is empty or no longer works, query this endpoint again for the current value
- `asset_type` is case-sensitive: `Image` / `Video` / `Audio`
- The submitted URL must be publicly accessible (the platform needs to be able to fetch it)
:::
