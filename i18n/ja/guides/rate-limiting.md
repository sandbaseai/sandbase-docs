---
i18nSource: d326fdb78ea64bdf
title: レート制限
description: 上限付きのリトライ、ジッター、キュー、冪等性を考慮したリクエスト処理で、SandBase API のレート制限に安全に対処します。
---

# レート制限 {#rate-limits}

SandBase は、組織に 1 分あたりのリクエスト数の制限を割り当てることがあります。この制限は組織内のすべての API キーで共有され、
1 分間のスライディングウィンドウでカウントされます。上流のモデルプロバイダーも、独自に
`429 Too Many Requests` レスポンスを返すことがあります。SandBase がワークロードに割り当てていない限り、クォータをハードコードしないでください。

## 組織の制限 {#your-organization-s-limit}
制限は組織ごとに割り当てられるため、SandBase は 1 分あたりのリクエスト数の固定値を公開していません。組織内のすべての
API キーが同じ制限にカウントされるため、キーを増やしても制限は上がりません。この制限は現在、
公開 API にも Console にも表示されません。

ワークロードに保証された制限やより高い制限が必要な場合は、組織、アプリケーション、想定される定常レート、
想定されるバーストレートを添えて SandBase サポートにお問い合わせください。文書化されていない数値のデフォルトを前提に本番クライアントを設計しないでください。

## 429 レスポンスを処理する {#handle-a-429-response}

プラットフォームが生成する `/v1/*` のレート制限レスポンスは、フラットなエラーボディを使用します。

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

組織の制限は、`POST /v1/run`、`POST /v1/chat/completions`、`POST /v1/responses`、`POST /v1/messages`、`POST /v1/upload`、および Gemini の `generateContent`、`streamGenerateContent`、`POST /v1beta/interactions` エンドポイントに適用されます。
`GET /v1/run/{id}` などのポーリング用エンドポイントはカウントされません。プロトコル互換のエンドポイントは、Anthropic や Google のエラー形式など、
それぞれ独自のエラーエンベロープで同じ `429` を返します。プロバイダー由来のレスポンスは、互換エンドポイントのエラー
形式を使用し、プロバイダーのレート制限ヘッダーを含む場合があります。

`Retry-After` や残りクォータのヘッダーが含まれるとは限りません。`Retry-After` がある場合は、それに従ってください。ない場合は、
ジッター付きの指数バックオフと最大試行回数を使用します。

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

OpenAI SDK も `max_retries` による組み込みのリトライに対応しています。リトライが複数のレイヤーで重複しないように、
SDK のリトライとアプリケーションのリトライループのどちらを使うかを意図的に選んでください。

## 安全な操作だけをリトライする {#retry-only-safe-operations}

推論リクエストを繰り返すと 2 回目の生成が行われ、追加のコストが発生する可能性があります。アプリケーションが再生成を許容できる場合にのみ
リトライしてください。操作が冪等性を明記している場合や、最初の試行が成功しなかったことをアプリケーションが証明できる場合を除き、
状態を変更するリクエストを自動でリトライしないでください。

ストリーミングリクエストでは、`429` は通常ストリームが始まる前に返されます。バイトを受信した後の切断は、
レート制限エラーと決めつけず、中断された生成として扱ってください。部分的な出力は製品の要件に応じて保持または破棄します。
最初からやり直すと新しい生成になります。

## スループットを制御する {#control-throughput}

- 上限のないバッチを一度に送り出すのではなく、同時実行数に上限を設けます。
- バースト的な処理はキューに入れ、送信レートを平準化します。
- 重複したリクエストを避け、プライバシーと鮮度の要件が許す場合は再利用可能な結果をキャッシュします。
- キーは所有者の区別、支出管理、取り消しのために分けるものであり、プラットフォームの制限を回避するために使うものではありません。
- トラブルシューティングのために、エンドポイント、モデル、HTTP ステータス、サニタイズしたエラーボディを記録します。
- ワークロードに割り当て済みの容量制限やより高い容量制限が必要な場合は、SandBase サポートにお問い合わせください。

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

同時実行数は 1 分あたりのリクエスト数とは異なります。観測されたレイテンシと、アプリケーションに割り当てられた容量に合わせて、
両方を調整してください。

::: info 毎日の無料 API 呼び出し
組織に UTC の 1 日あたり 100 回提供される無料のデータ API 呼び出しは課金上の無料枠であり、レート制限ではありません。無料枠を超えた呼び出しは
拒否されず、1 回ごとに課金されます。[毎日の無料 API 呼び出し](/guides/billing#daily-free-api-calls) を参照してください。
:::

::: tip 動画タスク
動画の送信は、アカウントレベルに基づいて組織が同時に実行できるタスク数によっても制限されます。
その場合の `429` は `organization concurrency limit exceeded` を示し、時間経過ではなく、実行中のタスクが完了すると解消されます。
[同時実行数の制限](/guides/concurrency-limits) を参照してください。
:::

## 関連ガイド {#related-guidance}

- [エラー処理](/guides/error-handling)
- [ストリーミング](/guides/streaming)
- [API エラーリファレンス](/api-reference/errors)
- [API キー](/getting-started/api-keys)
