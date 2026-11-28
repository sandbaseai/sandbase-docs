---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: 再利用可能なメディア Asset を登録し、現在のメタデータとダウンロード URL を取得します。
---

# Media Assets API {#media-assets-api}

`/v1/assets` で公開されている公式互換の Asset プロトコルを使用してメディア URL を登録し、
ネイティブの動画生成リクエスト用の `asset_url` を取得します。

メディアを登録し、返された `asset://` 参照を Seedance で使用するエンドツーエンドの例については、
Seedance リファレンスの [登録済みメディア Asset を使用する](/api-reference/volcengine-contents-generations#use-registered-media-assets) を参照してください。

## 概要 {#overview}

| メソッド | パス | 説明 |
|--------|------|-------------|
| `POST` | `/v1/assets` | Asset を登録する |
| `GET` | `/v1/assets/{id}` | Asset のメタデータと現在のダウンロード URL を取得する |

## POST /v1/assets {#post-v1-assets}

公開アクセス可能なファイル URL をアセットライブラリに登録し、動画生成リクエストで参照できる `asset_url` を返します。

### リクエスト {#request}

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

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|--------------|
| `url` | string | はい | 公開アクセス可能なファイル URL |
| `asset_type` | string | はい | Asset の種類：`Image` / `Video` / `Audio`（大文字と小文字を区別） |
| `name` | string | いいえ | 任意の Asset 名 |

### レスポンス {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| フィールド | 説明 |
|-------|--------------|
| `id` | 内部レコード ID |
| `asset_url` | 動画生成リクエストで使用する参照アドレス |
| `asset_type` | Asset の種類 |
| `name` | Asset 名 |
| `created_at` | 作成日時 |

### asset_url の使い方 {#using-asset-url}

登録後、選択したモデルのライブスキーマで Asset 参照を受け付ける入力フィールドに `asset_url` を渡します。フィールド名はモデルによって異なります。例：

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### エラー {#errors}

| HTTP ステータス | 説明 |
|-------------|--------------|
| 400 | 必須フィールドがないか、`asset_type` が無効です |
| 502 | 上流でのアセット登録に失敗しました |
| 500 | 利用可能な認証情報がないか、内部エラーです |

---

## GET /v1/assets/{id}

登録済みアセットの署名付きダウンロード URL を外部 ID で取得します。元のファイルのプレビューやダウンロードに使用します。

### リクエスト {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| パラメーター | 場所 | 説明 |
|-----------|----------|--------------|
| `id` | path | 外部 ID（`asset_url` の `asset://` 以降の部分） |

### レスポンス {#response-1}

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

| フィールド | 説明 |
|-------|--------------|
| `asset_url` | 動画生成用の参照アドレス（永続） |
| `status` | プロバイダーが報告する Asset のライフサイクルステータス。任意の文字列として扱ってください。 |
| `download_url` | プロバイダーが返すダウンロード URL。Asset の準備ができていない間は空の場合があります |

### エラー {#errors-1}

| HTTP ステータス | 説明 |
|-------------|--------------|
| 404 | Asset が見つからないか、組織に属していません |
| 502 | 上流での照会に失敗しました |

---

## 注意事項 {#notes}

::: tip 重要
- `asset_url` の形式は `asset://{external_id}` で、対応するモデル入力に渡す再利用可能な参照です
- `download_url` はプロバイダー管理の値として扱ってください。空の場合や使えなくなった場合は、このエンドポイントを再度呼び出して現在の値を取得してください
- `asset_type` は大文字と小文字を区別します：`Image` / `Video` / `Audio`
- 送信する URL は公開アクセス可能である必要があります（プラットフォームが取得できる必要があります）
:::
