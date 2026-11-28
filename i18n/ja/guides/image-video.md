---
i18nSource: 8c960d117a998817
title: 画像・動画モデル
description: SandBase の共通 Run API を使って、画像と動画を非同期で生成します。
---

# 画像・動画モデル {#image-and-video-models}

画像・動画モデルは、SandBase の共通の非同期 Run API を使用します。`POST /v1/run` で
タスクを送信し、Run が終了ステータスになるまで `GET /v1/run/{id}` を
ポーリングします。

## タスクを送信する {#submit-a-task}

[画像・動画モデル](https://www.sandbase.ai/models/image-video) に記載された正確なモデル ID を使用してください。その他の
リクエストフィールドはモデル固有です。必須の入力と制限については、
モデルの API リファレンスを確認してください。

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

レスポンスには、不透明な `id` と、`pending` や `running` などの
`status` が含まれます。

## 結果をポーリングする {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`status` が `completed`、`failed`、または `timeout` になるまでポーリングを続けます。完了した
Run には、画像や動画の URL など、機能に応じた出力が含まれます。Run ID を
保持し、Run のレスポンスを正式なステータスとして扱ってください。

## Webhook コールバック {#webhook-callbacks}

対応する非同期タスクでは、送信リクエストで `webhook_url` を設定することもできます。
コールバックは配信の通知であり、ポーリングの代わりにはなりません。引き続き
`GET /v1/run/{id}` を使用し、重複したコールバックや遅延したコールバックを安全に処理してください。共通の
コールバック仕様については [機能を実行する](/api-reference/models/run#webhook-callbacks) を参照してください。

## API 機能は URL から導出したパスを使う {#api-capabilities-use-a-url-derived-path}

共通の Run API はモデル生成用です。[API カタログ](https://www.sandbase.ai/apis) の
API 機能は、URL から導出した別のルート
`GET` または `POST /v1/api/{vendor}/{upstream_path}` を使用します。
ベンダー修飾された機能名は Models API または API カタログから取得されるため、
POST ボディでは `model` フィールドを省略できます。

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

このルートは API 機能用であり、画像・動画モデルを呼び出す際の `/v1/run` の
代わりではありません。選択した API 機能が非同期の場合は、
返された Run ID を `GET /v1/run/{id}` でポーリングしてください。

## 次のステップ {#next-steps}

- [画像・動画モデル](https://www.sandbase.ai/models/image-video)
- [機能を実行する](/api-reference/models/run)
- [Run の結果を取得する](/api-reference/models/run-get)
- [API パススルー](/api-reference/models/api-passthrough)
