---
i18nSource: 43d08f60800d37f5
title: 媒体 Assets API
description: 注册可复用的媒体 Asset，并获取其当前元数据和下载 URL。
---

# 媒体 Assets API {#media-assets-api}

使用 `/v1/assets` 提供的官方兼容 Asset 协议注册媒体 URL，并获取用于
原生视频生成请求的 `asset_url`。

如需查看注册媒体并在 Seedance 中使用返回的 `asset://` 引用的端到端示例，请参阅
Seedance 参考中的[使用已注册的媒体 Asset](/api-reference/volcengine-contents-generations#use-registered-media-assets)。

## 概览 {#overview}

| 方法 | 路径 | 说明 |
|--------|------|-------------|
| `POST` | `/v1/assets` | 注册 Asset |
| `GET` | `/v1/assets/{id}` | 获取 Asset 元数据和当前下载 URL |

## POST /v1/assets {#post-v1-assets}

将可公开访问的文件 URL 注册到素材库，并返回可在视频生成请求中引用的 `asset_url`。

### 请求 {#request}

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

| 字段 | 类型 | 必填 | 说明 |
|-------|------|----------|--------------|
| `url` | string | 是 | 可公开访问的文件 URL |
| `asset_type` | string | 是 | Asset 类型：`Image` / `Video` / `Audio`（区分大小写） |
| `name` | string | 否 | 可选的 Asset 名称 |

### 响应 {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| 字段 | 说明 |
|-------|--------------|
| `id` | 内部记录 ID |
| `asset_url` | 在视频生成请求中使用的引用地址 |
| `asset_type` | Asset 类型 |
| `name` | Asset 名称 |
| `created_at` | 创建时间戳 |

### 使用 asset_url {#using-asset-url}

注册完成后，将 `asset_url` 传入所选模型实时 schema 中接受 Asset 引用的输入字段。字段名因模型而异，例如：

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### 错误 {#errors}

| HTTP 状态码 | 说明 |
|-------------|--------------|
| 400 | 缺少必填字段或 `asset_type` 无效 |
| 502 | 上游 Asset 注册失败 |
| 500 | 无可用凭据或内部错误 |

---

## GET /v1/assets/{id}

根据外部 ID 获取已注册 Asset 的签名下载 URL，用于预览或下载底层文件。

### 请求 {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| 参数 | 位置 | 说明 |
|-----------|----------|--------------|
| `id` | path | 外部 ID（`asset_url` 中 `asset://` 之后的部分） |

### 响应 {#response-1}

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

| 字段 | 说明 |
|-------|--------------|
| `asset_url` | 用于视频生成的引用地址（永久有效） |
| `status` | 服务商报告的 Asset 生命周期状态。请将其视为开放字符串。 |
| `download_url` | 服务商返回的下载 URL；Asset 未就绪时可能为空 |

### 错误 {#errors-1}

| HTTP 状态码 | 说明 |
|-------------|--------------|
| 404 | Asset 不存在或不属于你的组织 |
| 502 | 上游查询失败 |

---

## 注意事项 {#notes}

::: tip 重要
- `asset_url` 的格式为 `asset://{external_id}`，是可传给受支持模型输入的可复用引用
- `download_url` 由服务商管理。如果为空或已失效，请再次查询此端点获取当前值
- `asset_type` 区分大小写：`Image` / `Video` / `Audio`
- 提交的 URL 必须可公开访问（平台需要能够获取该文件）
:::
