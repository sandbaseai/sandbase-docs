---
i18nSource: 4bd032d88bac0470
title: Seedance 動画（Volcengine Ark プロトコル）
description: Volcengine Ark Contents Generations タスクプロトコルで Seedance 2.0 と 2.5 の動画を生成します。入力、ポーリング、課金、メディア Assets について説明します。
aside: false
outline: false
apiReference:
  title: Seedance 動画
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Seedance 動画タスクを送信します。送信に成功すると、HTTP 200 と SandBase のタスク id が返されます。
  groups:
    - title: リクエストボディ
      fields:
        - name: model
          type: string
          required: true
          description: 対応するモデル識別子：bytedance/seedance/2.0-official または bytedance/seedance/2.5-official。
        - name: content
          type: array
          required: true
          description: 型付きのテキストと任意のメディア入力。各項目の形式はモデルによって検証されます。
        - name: duration
          type: integer
          required: false
          description: そのままモデルに転送されます。モデルによる検証が適用されます。
        - name: resolution
          type: string
          required: false
          description: そのままモデルに転送されます。モデルによる検証が適用されます。
        - name: ratio
          type: string
          required: false
          description: そのままモデルに転送されます。モデルによる検証が適用されます。
        - name: generate_audio
          type: boolean
          required: false
          description: そのままモデルに転送されます。対応している場合は、生成された音声を要求します。
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Seedance ガイド {#seedance-guide}

Seedance は、テキスト、開始フレームと終了フレーム、そして画像、動画、音声などのマルチモーダルな参照から動画を生成します。
シンプルなテキストから動画へのクリップから、視覚的な被写体、カメラの動き、サウンドトラックに従う演出されたショットまで、
幅広く使えます。

生成は非同期で行われます。タスクを送信し、終了ステータスになるまでポーリングしてください。

## モデルの選択 {#choosing-a-model}

| `model` | 適した用途 | 出力解像度 |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | 1080p での納品と、利用可能な最高の出力解像度 | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | 480p または 720p で十分な場合の低コストな生成 | 480p, 720p |

どちらのモデルも同じマルチモーダル入力を受け付け、テキストから動画、画像から動画、マルチモーダル参照のワークフローに
単一のリクエスト形式で対応しています。480p または 720p で要件を満たし、低価格な選択肢を選びたい場合は `2.0-official` を
選んでください。1080p が必要な場合は `2.5-official` を選んでください。

## API リファレンス {#api-reference}

| メソッド | パス |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

タスクの一覧表示、キャンセル、削除には対応していません。結果を取得するために、返されたタスクの `id` を保存してください。

すべてのリクエストは、タスクの作成に使ったものと同じ API キーで認証します。

```
Authorization: Bearer $SANDBASE_API_KEY
```

`model` の値は、[モデルの選択](#choosing-a-model) に記載された名前のいずれかと一致する必要があります。結果の受け取りには
ポーリングを使用してください。このエンドポイントでは `callback_url` に頼らないでください。

## クイックスタート {#quickstart}

タスクを送信します。

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

`status` が `succeeded`、`failed`、`expired`、`cancelled` のいずれかになるまで、その id で 5〜10 秒ごとにタスクをポーリングします。

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

生成された動画は `content.video_url` から取得できます。

## 入力ワークフローを選ぶ {#choose-an-input-workflow}

API は一般的な 7 つの入力ワークフローに対応しています。`content` の各項目には `type` があり、項目のタイプとロールの
組み合わせでワークフローが決まります。

| 目的 | `content` の組み合わせ | 使う場面 |
| --- | --- | --- |
| テキストから動画 | テキスト | シーンをプロンプトだけで説明できる場合 |
| 開始フレームをアニメーション化 | テキスト（任意）+ `first_frame` の画像 | 最初のフレームを指定した画像と一致させる必要がある場合 |
| 2 つのフレーム間のトランジション | テキスト（任意）+ `first_frame` + `last_frame` | ショットの始まりと終わりを制御する必要がある場合 |
| 視覚的な参照に従う | テキスト（任意）+ `reference_image` の画像 | 被写体、製品、衣装、ビジュアルスタイルを識別できる状態に保つ場合 |
| 動きやカメラワークに従う | テキスト（任意）+ `reference_video` の動画 | 動き、タイミング、編集のリズム、カメラの動きを参照クリップから取り入れる場合 |
| 音声の参照を追加 | テキスト/画像/動画 + `reference_audio` の音声 | セリフ、音楽、声、サウンドデザインで結果を導く場合 |
| フルマルチモーダルの演出 | テキスト + 画像 + 動画 + 音声の参照 | 1 つのショットで、外観、動き、音をそれぞれ別のアセットで制御する場合 |

音声だけでは使用できません。音声の項目を含むリクエストには、テキスト、画像、動画の項目も少なくとも 1 つ含める必要が
あります。

### コンテンツ項目の形式 {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` は、モデルがアセットをどのように使うかを示します。

| アセット | `role` | 効果 |
| --- | --- | --- |
| 画像 | `first_frame` | 画像を開始フレームとして使用します |
| 画像 | `last_frame` | 画像を終了フレームとして使用します。同じリクエストに `first_frame` を含めてください |
| 画像 | `reference_image` | 被写体、構図、製品、衣装、ビジュアルスタイルを参照します |
| 動画 | `reference_video` | 動き、カメラワーク、タイミング、編集のリズムを参照します |
| 音声 | `reference_audio` | 声、セリフ、音楽、サウンドデザインを参照します |

画像の項目には、公開 URL またはインラインの `data:image/...;base64,...` 値を指定できます。動画と音声の参照には、
モデルがダウンロードできる公開 URL を使用してください。

`video_url` の項目を 1 つでも含めると、リクエストは動画から動画へのモードになり、トークンのレートが変わります。
[課金](#billing)を参照してください。

## よく使うレシピ {#common-recipes}

以下の例はリクエストボディです。いずれも [クイックスタート](#quickstart) に示したタスク作成エンドポイントに送信します。

### 最初のフレームをアニメーション化する {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### 最初から最後のフレームへのトランジションを作成する {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### 画像、動画、音声の参照でショットを演出する {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

プロンプトでは、各参照に明確な役割を割り当ててください。たとえば「画像から製品の外観を維持し、動画のカメラの動きを使い、
音声のペースに合わせる」のように指定します。すべてのアセットに結果全体を制御させるよりも、確実な結果が得られます。

## 効果的なプロンプトの書き方 {#writing-an-effective-prompt}

実用的なプロンプトは、通常次の順序で構成します。

1. **被写体** — ショットに登場する人物や物。
2. **アクション** — 何が変化し、何が動くか。
3. **シーン** — 場所、時間帯、天候、周囲の詳細。
4. **ビジュアルスタイル** — シネマティック、ドキュメンタリー、製品 CM、アニメーションなど。
5. **カメラ** — フレーミング、レンズの雰囲気、カメラの動き、カット。
6. **サウンド** — `generate_audio` が有効な場合のセリフ、環境音、音楽、効果音。

変わってはいけない要素を明示してください。たとえば「製品ラベルは読みやすいまま、カメラはゆっくり 1 回だけ
プッシュインし、シーンのカットはなし、自然な室内の環境音」のように指定します。複数の参照がある場合は、それぞれから
どの視覚的特徴や動きの特徴を取り入れるかを記述してください。

## 出力オプション {#output-options}

| パラメータ | 型 | デフォルト | 値 |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`、`720p`、`1080p`。`2.0-official` は `1080p` に対応していません |
| `ratio` | string | `adaptive` | `16:9`、`9:16`、`4:3`、`3:4`、`1:1`、`21:9`、`adaptive`。`adaptive` は入力とプロンプトから比率を選びます |
| `duration` | integer | `5` | 4〜15 秒、または対応範囲内でモデルに選ばせる場合は `-1` |
| `generate_audio` | boolean | `true` | 同期した音声、効果音、BGM を生成します |
| `seed` | integer | `-1` | `-1`〜`2^32-1`。同じプロンプトとシードでは、同一ではないものの似た出力になります |
| `watermark` | boolean | `false` | 右下に AI 生成の透かしを追加します |
| `tools` | array | `[]` | `[{"type": "web_search"}]` を指定すると、ショットの計画時に Web 検索が有効になります |

### タスクの制御 {#task-control}

| パラメータ | 型 | デフォルト | 備考 |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | タスクのタイムアウト（秒）。3600〜259200。これを過ぎたタスクは `expired` になります |
| `service_tier` | string | `default` | これらのモデルは `flex` に対応していません |
| `safety_identifier` | string | — | 不透明なエンドユーザー識別子（最大 64 文字）。生の個人データではなくハッシュを送信してください |

### フレームサイズ {#frame-size}

`resolution` と `ratio` の組み合わせでピクセル寸法が決まります。

| 解像度 | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## タスクのステータス {#task-status}

| `status` | 意味 | 対応 |
| --- | --- | --- |
| `queued` | 受け付け済みで、開始待ち | 5〜10 秒ごとにポーリングを続けます |
| `running` | 生成中 | ポーリングを続けます |
| `succeeded` | 完了 | `content.video_url` をダウンロードします |
| `failed` | コンテンツ審査で拒否された、またはモデルでエラーが発生した | `error.message` を読み、プロンプトを調整してからリトライします |
| `expired` | `execution_expires_after` を超過した | 再度送信します |
| `cancelled` | 生成の開始前に終了した | 再度送信します |

### タスクのフィールド {#task-fields}

| フィールド | 型 | 備考 |
| --- | --- | --- |
| `id` | string | 送信時に返されたタスク id |
| `model` | string | 送信した `model` の値 |
| `status` | string | 上記を参照してください |
| `created_at` | integer | Unix 秒 |
| `updated_at` | integer | Unix 秒。タスクが完了するまでは `created_at` と同じ値です |
| `content` | object | タスクが成功するまでは空です。生成された `video_url` を含みます |
| `usage` | object | トークン数。[課金](#billing)を参照してください |
| `error` | object | `failed` と `expired` の場合に存在します。`code` と `message` を含みます |

### Python での完全なフロー {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## 課金 {#billing}

これらのモデルは、タスクの完了時に報告される `usage.completion_tokens` に基づいて課金されます。トークンのレートは次の 2 つの
要素で決まります。

- **入力に動画が含まれるかどうか。** 動画から動画へのリクエスト（タイプが `video_url` の `content` 項目を含むもの）は、
  テキストから動画よりも低いレートで課金されます。
- **出力解像度。** `2.5-official` では、1080p は 480p や 720p よりも高く課金されます。`2.0-official` のレートは
  解像度によって変わりません。

`usage` は `completion_tokens` と `total_tokens` を報告し、現在この 2 つは同じ値です。タスクの実行中は空です。
実際の請求額は [アカウント履歴](/api-reference/account/history) で、現在のレートは
[料金ガイド](/guides/billing) で確認してください。

## エラー {#errors}

無効なリクエストはすぐにエラーを返します。生成時のエラーは、ポーリング後にタスク内に表示されます。どちらも、
機械可読な `code` と人間が読める `message` を持つ `error` オブジェクトを使用します。

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

一般的な復旧手順：

| 結果 | 試すこと |
| --- | --- |
| `400 InvalidParameter` | モデル名、必須コンテンツ、ロール、解像度、長さ、アセットの URL を確認します |
| コンテンツ審査エラーでタスクのステータスが `failed` | 再送信する前に、プロンプトを書き直すか、指摘された参照アセットを差し替えます |
| タスクのステータスが `expired` | 新しいタスクを送信します。高解像度や長いクリップの場合は、`execution_expires_after` を長くすることを検討してください |
| `429 RateLimitExceeded` | 指数バックオフでリトライし、同時送信数を減らします |
| `503 ServiceUnavailable` | 少し待ってから同じリクエストをリトライします |

## 登録済みのメディア Assets を使う {#use-registered-media-assets}

SandBase は、公式互換の Asset プロトコルを `/v1/assets` で提供しています。Asset のリクエストと返される `asset://`
参照は公式プロトコルに従っており、この参照はネイティブの ByteDance Contents Generations リクエストでそのまま
渡されます。
`bytedance/seedance/2.5-official` と `bytedance/seedance/2.0-official` のどちらも、通常公開 HTTP(S) URL を受け付ける箇所で
この参照を受け付けます。

ワークフロー全体は次のとおりです。

1. `POST /v1/assets` で、到達可能なメディア URL を登録します。
2. プロバイダーが Asset を使用可能と報告するまで、`GET /v1/assets/{external_id}` を照会します。
3. 返された `asset_url` を Seedance の `content` 項目に入れ、生成タスクを送信します。

### 公式互換の Asset 操作 {#official-compatible-asset-operations}

| メソッド | パス | 目的 |
| --- | --- | --- |
| `POST` | `/v1/assets` | 到達可能なメディア URL を登録し、公式互換の `asset://` 参照を受け取ります |
| `GET` | `/v1/assets/{external_id}` | プロバイダーのステータスを読み取り、現在のプレビュー/ダウンロード URL を取得します |

公開 API で現在提供されているのは、登録と照会のみです。Asset グループ、一覧表示、名前変更、更新、削除は
公開されている操作ではありません。Assets は API キーに関連付けられた組織に属します。

### ステップ 1：Asset を登録する {#step-1-register-the-asset}

到達可能な URL を `POST /v1/assets` に送信します。`asset_type` は大文字と小文字が区別され、`Image`、`Video`、`Audio` のいずれかである必要があります。

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

レスポンスの `asset_url` を保存します。

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`asset://` の後の値が、公式互換の照会操作で使う `external_id` です。

### ステップ 2：準備状況を確認する {#step-2-check-readiness}

`asset://` プレフィックスを除いた `external_id` で Asset を照会します。

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`status` は網羅的な列挙型ではなく、プロバイダーが定義する可変の値として扱ってください。生成タスクを送信する前に、プロバイダーが使用可能な
状態を報告するまで待ちます。一般的な準備完了の値は `Active` です。`download_url` はプロバイダーが管理しており、
処理中は空の場合があります。最新のプレビュー URL が必要なときは、Asset を再度照会してください。Seedance のリクエストでは、
`download_url` をコピーせず、永続的な `asset_url` を使い続けてください。

### ステップ 3：Asset を使って生成する {#step-3-generate-with-the-asset}

メディアタイプに対応する URL フィールドに `asset_url` を入れます。この例では、登録した画像を視覚的な
参照として使用します。

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

作成のレスポンスはタスクの `id` を返します。選択したモデルのページの説明に従って、
`GET /api/v3/contents/generations/tasks/{task_id}` をポーリングしてください。

### コンテンツ項目とロールを選ぶ {#choose-the-content-item-and-role}

| Asset タイプ | `content[].type` | URL フィールド | 対応ロール | 用途 |
| --- | --- | --- | --- | --- |
| 画像 | `image_url` | `image_url.url` | `first_frame` | このフレームそのものから動画を開始します |
| 画像 | `image_url` | `image_url.url` | `last_frame` | このフレームで終了します。同じリクエストに `first_frame` を含めてください |
| 画像 | `image_url` | `image_url.url` | `reference_image` | 被写体、製品、構図、衣装、ビジュアルスタイルを維持します |
| 動画 | `video_url` | `video_url.url` | `reference_video` | 動き、タイミング、カメラワーク、編集のリズムに従います |
| 音声 | `audio_url` | `audio_url.url` | `reference_audio` | 声、セリフ、音楽、サウンドデザインに従います |

音声だけを入力にすることはできません。`reference_audio` の Asset は、テキスト、画像、動画のいずれかと組み合わせてください。
`video_url` を含むリクエストには、動画から動画への課金レートが適用されます。

#### 動画 Asset の例 {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### 音声 Asset の例 {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### 直接 URL と `asset://` 参照のどちらを使うか {#direct-url-or-asset-reference}

| 入力 | 適した場面 | トレードオフ |
| --- | --- | --- |
| 公開 HTTP(S) URL | メディアがすでにホストされており、1 回だけ使う場合 | 最も速い方法ですが、タスクの送信からプロバイダーによる取得まで URL に到達できる必要があります |
| `asset://` 参照 | 公式の Asset プロトコルでメディアを再利用する場合 | 登録と準備確認のステップが増えますが、以降の Seedance タスクで使える永続的な参照が得られます |

リクエストパラメータ、ポーリング、タスクのステータス、課金については、上記の [Seedance ガイド](#seedance-guide) を参照してください。

## ByteDance の公式リソース {#official-bytedance-resources}
- [Seedance 動画生成ドキュメント](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [コンテンツ生成タスク作成 API](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 プロンプトガイド](https://www.volcengine.com/docs/82379/2222480?lang=en)
