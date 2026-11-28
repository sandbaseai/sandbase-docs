---
i18nSource: 43d08f60800d37f5
title: 媒體 Assets API
description: 註冊可重複使用的媒體 Assets，並取得其目前的中繼資料與下載 URL。
---

# 媒體 Assets API {#media-assets-api}

使用 `/v1/assets` 提供的官方相容 Asset 協定來註冊媒體 URL，並取得可用於
原生影片生成請求的 `asset_url`。

如需註冊媒體並在 Seedance 中使用回傳之 `asset://` 參照的完整範例，請參閱 Seedance 參考文件中的
[使用已註冊的媒體 Assets](/api-reference/volcengine-contents-generations#use-registered-media-assets)。

## 概覽 {#overview}

| 方法 | 路徑 | 說明 |
|--------|------|-------------|
| `POST` | `/v1/assets` | 註冊 Asset |
| `GET` | `/v1/assets/{id}` | 取得 Asset 中繼資料與目前的下載 URL |

## POST /v1/assets {#post-v1-assets}

將可公開存取的檔案 URL 註冊到資產庫，並回傳可在影片生成請求中參照的 `asset_url`。

### 請求 {#request}

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

| 欄位 | 類型 | 必填 | 說明 |
|-------|------|----------|--------------|
| `url` | string | 是 | 可公開存取的檔案 URL |
| `asset_type` | string | 是 | Asset 類型：`Image` / `Video` / `Audio`（區分大小寫） |
| `name` | string | 否 | 選用的 Asset 名稱 |

### 回應 {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| 欄位 | 說明 |
|-------|--------------|
| `id` | 內部紀錄 ID |
| `asset_url` | 在影片生成請求中使用的參照位址 |
| `asset_type` | Asset 類型 |
| `name` | Asset 名稱 |
| `created_at` | 建立時間戳記 |

### 使用 asset_url {#using-asset-url}

註冊完成後，請將 `asset_url` 傳入所選模型即時 schema 中接受 Asset 參照的輸入欄位。欄位名稱因模型而異，例如：

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### 錯誤 {#errors}

| HTTP 狀態 | 說明 |
|-------------|--------------|
| 400 | 缺少必填欄位或 `asset_type` 無效 |
| 502 | 上游 Asset 註冊失敗 |
| 500 | 沒有可用的憑證或發生內部錯誤 |

---

## GET /v1/assets/{id}

依外部 ID 取得已註冊 Asset 的已簽署下載 URL，用於預覽或下載底層檔案。

### 請求 {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| 參數 | 位置 | 說明 |
|-----------|----------|--------------|
| `id` | path | 外部 ID（`asset_url` 中 `asset://` 之後的部分） |

### 回應 {#response-1}

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

| 欄位 | 說明 |
|-------|--------------|
| `asset_url` | 用於影片生成的參照位址（永久有效） |
| `status` | 供應商回報的 Asset 生命週期狀態。請將其視為開放式字串。 |
| `download_url` | 供應商回傳的下載 URL；Asset 尚未就緒時可能為空 |

### 錯誤 {#errors-1}

| HTTP 狀態 | 說明 |
|-------------|--------------|
| 404 | 找不到 Asset，或該 Asset 不屬於您的組織 |
| 502 | 上游查詢失敗 |

---

## 注意事項 {#notes}

::: tip 重要
- `asset_url` 的格式為 `asset://{external_id}`，是可重複傳入支援之模型輸入的參照
- 請將 `download_url` 視為由供應商管理。若其為空或已失效，請再次查詢此端點以取得目前的值
- `asset_type` 區分大小寫：`Image` / `Video` / `Audio`
- 提交的 URL 必須可公開存取（平台需要能擷取它）
:::
