---
i18nSource: fc051d55a0cfa8bd
title: 同時実行数の上限
description: 組織で同時に実行できるタスク数、アカウントレベルに応じた上限の変化、動画送信時の 429 と 402 の処理方法について説明します。
---

# 同時実行数の上限 {#concurrency-limits}

同時実行数の上限は、組織で同時に処理中にできるタスクの数を制御します。すべての組織にはアカウントレベルがあり、そのレベルによって同時実行数の上限が決まります。上限に達すると、下記のチェック対象エンドポイントへの新しい送信は、実行中のタスクのいずれかが完了するまで `429` で拒否されます。キューには入りません。

上限は、すべての API キーを含む組織全体に適用されます。どの送信がチェックされるかはエンドポイントによって異なります。

- `POST /v1/run` と、`/v1/api/{vendor}/...` 経由の Platform API の呼び出しは、画像、音声、LLM、データ API の操作を含むすべてのモデルタイプでチェックされます。
- Chat Completions、Responses、Messages、OpenAI Images、プロトコル互換の Gemini と Volcengine のエンドポイントなど、その他のエンドポイントでは動画の送信のみがチェックされます。

## 仕組み {#how-it-works}

チェック対象のタスクを送信すると、SandBase は組織で現在処理中のタスク、つまり `pending` または `running` 状態のタスクを数えます。その数がすでに上限に達している場合、送信はただちに `429` で拒否されます。タスクは作成されず、料金も発生しません。

この数には、動画だけでなく組織内で処理中のすべてのリクエストが含まれます。チェック対象のタスクを送信した時点でまだ開いているストリーミングのチャット補完も、1 枠を使用します。同じ組織で長時間のストリーミングチャットと動画ジョブを実行する場合は、そのすべてを考慮して容量を計画してください。

タスクが最終状態（`completed`、`failed`、`timeout`）になるとすぐに枠が解放されます。利用者側で解放する操作は必要ありません。枠はタイマーではなくタスクの完了によって解放されるため、この `429` は 1 分あたりの [レート制限](/guides/rate-limiting) とは異なります。一定時間待っても枠が空くとは限りません。代わりに、自分のタスクのいずれかが完了するのを待ってください。

## デフォルトの上限 {#default-limits}

新しい組織はすべて **Bronze** から始まり、同時実行タスクの上限は 2 です。レベルは、1 回の成功したチャージの金額に基づいて自動的に上がります。

| レベル | 1 回のチャージ | 同時実行タスク数 |
|-------|---------------|------------------|
| Bronze | デフォルト | 2 |
| Silver | $10 以上 | 10 |
| Gold | $100 以上 | 100 |
| Platinum | $500 以上 | 500 |
| Diamond | 営業担当にお問い合わせください | 無制限 |

- **累計ではなく 1 回のチャージ金額で判定します。** $60 を 2 回チャージしても Silver のままです。$100 を 1 回チャージすると Gold になります。
- **アップグレードのみです。** 後から少額をチャージしても、レベルが下がることはありません。
- **有料のチャージのみが対象です。** キャンペーンのクレジット、登録時のクレジット、クーポンではレベルは変わりません。
- **すぐに反映されます。** 支払いが完了すると、次の動画の送信から新しい上限が適用されます。

## 上限を引き上げる {#increasing-your-limit}

上限を引き上げる最も直接的な方法は、上の表の次のしきい値に達する金額を 1 回でチャージすることです。

500 を超える同時実行タスク、または月単位のクレジットラインが必要な場合は、**Diamond** レベルについて [contact@sandbase.ai](mailto:contact@sandbase.ai) にお問い合わせください。Diamond には同時実行数の上限がありません。SandBase チームが設定し、チャージによって変更されることはありません。

## 動画送信時のクレジットチェック {#credit-check-on-video-submissions}

SandBase は、同時実行数のチェックに加えて、各動画タスクを受け付ける前にコストを見積もります。見積もりが利用可能なクレジット（残高とクレジットラインの合計）を超える場合、送信は `402` で拒否されます。タスクは作成されず、料金も発生しません。

- 各送信は現在の残高に対してチェックされます。実行中のタスクはまだ課金されていないため、複数の動画を一度に送信する場合は余裕を残してください。
- モデルの料金が実行後にしかわからない出力に依存する場合、コストを事前に見積もることはできません。その場合、送信は受け付けられ、タスクの完了時に通常どおり課金されます。

## 同時実行エラーの処理 {#handling-concurrency-errors}

### 429: 同時実行数の上限に達した {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

`Retry-After` ヘッダーは送信されません。上限は事前にわかっているため、最も確実なのは上限を超えないようにすることです。クライアント側で処理中の動画タスクの数を制限し、前のタスクが完了してから次のタスクを送信してください。

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

同じ組織の別のサービスも送信しているなどの理由で `429` が返された場合は、待機してから再試行してください。ジッター付きのエクスポネンシャルバックオフを使用し、短い間隔で繰り返し再試行するのではなく、決まった回数で諦めてください。

### 402: この動画に必要なクレジットが不足している {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

再試行しないでください。チャージするか、より短い長さや低い解像度など、コストの低い設定を選んでください。

### 互換 API {#compatible-apis}

プロトコル互換のエンドポイントは、これらのエラーを独自のネイティブ形式で返します。たとえば、Volcengine 互換の `/api/v3/contents/generations/tasks` エンドポイントは、`429` に対して `RateLimitExceeded`、`402` に対して `AccountOverdueError` を返します。

## 関連項目 {#related}

- [レート制限](/guides/rate-limiting): 1 分あたりのリクエスト上限
- [料金](/guides/billing): クレジットとチャージ
- [エラー](/api-reference/errors): すべてのエラーコード
