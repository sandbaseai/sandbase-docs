---
i18nSource: 91c5a0d1b6de6434
title: 料金と使用量
description: 現在のモデル料金を確認し、タスクのコストを調べ、SandBase の課金を安全に管理します。
---

# 料金と使用量 {#pricing-and-usage}

SandBase は従量課金制です。モデルの提供状況、料金計算式、キャッシュの倍率、機能ごとの料金はそれぞれ独立して変わる可能性があるため、
インテグレーションではコピーした料金表に頼らず、最新のメタデータを読み取ってください。

## 毎日の無料 API 呼び出し {#daily-free-api-calls}

すべての組織は、UTC の 1 日あたり 100 回まで、データ API（検索、ソーシャル、スクレイピング、EC、金融）を無料で呼び出せます。この
無料枠は対象となるすべてのデータ API と組織のすべてのキーで共有され、00:00 UTC にリセットされます。LLM とメディアモデルは
対象外です。一部のデータ API も対象外です。一部のバッチエンドポイント、クロールエンドポイント、Xiaohongshu PGY、Douyin Xingtu の `kol-*` ルートなど、料金が高いものや計算式で料金が決まるものは、最初の呼び出しから課金されます。
ツールが対象かどうかを確認するには `sandbase_inspect` を実行します。対象のツールには `pricing.free_quota` があり、これがないツールは常に
課金されます。

- 無料枠内の呼び出しは課金されず、残高がゼロの組織でも利用できます。
- 100 回目を超えても対象の呼び出しは引き続き動作し、ツールに表示される料金で 1 回ごとに課金されます。無料枠を使い切ったことで
  拒否されたりレート制限されたりすることはありません。
- 使わなかった回数は翌日に繰り越されません。

[SandBase MCP ツール](/setup/) では、`sandbase_inspect` が対象のツールに `pricing.free_quota`
（`daily_limit`、`scope`、`resets`）を付けて示します。`sandbase_account` は当日の無料枠を `free_api_quota` として返し、
`daily_limit`、`used_today`、`remaining`、`resets_at` を含みます。回数が一時的に取得できない場合、`used_today` と `remaining` は
省略されます。実行の精算後、`sandbase_run` と `sandbase_run_get` は `free_quota_status` を報告します：
`free`（無料枠でカバー）、`overage`（無料枠を使い切った後に課金）、または `degraded`（無料枠の回数を取得できなかったため
課金なし）。

## Console で課金を管理する {#manage-billing-in-the-console}

**Developer → Billing** では、残高の確認、クレジットの購入、自動チャージの設定、クーポンの利用、組織で利用できる課金設定の管理ができます。
組織単位のリクエスト、トークン、コストの概要は **Developer → Activities → Usage** で確認できます。

::: info 公開 API の範囲
残高、チャージ、課金データのエクスポート、組織全体の使用量のエンドポイントは、現在サポート対象の
公開 API には含まれていません。Console のネットワークリクエストを自動化したり、Console の内部ルートに依存したりしないでください。
:::

## 現在のモデル料金を読み取る {#read-current-model-pricing}

まず、有効なモデルを探します。

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

次に、そのモデルの完全なモデルカードを取得します。

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

一覧エンドポイントは探索向けに最適化されており、トークン、キャッシュ、推論の詳細な料金は意図的に省略されています。
選択したモデルの詳細な料金は、詳細レスポンスの `model_card` から読み取ってください。すべての LLM、メディアモデル、埋め込みモデル、API 機能に
共通する計算式はありません。

## タスクごとの記録済みコストを確認する {#check-one-task-s-recorded-cost}

操作がタスク ID を返した場合は、その精算記録を照会します。

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

レスポンスでは現在の `cost` と `estimated_cost` が区別され、精算が確定したかどうかが報告されます。`settled` が `true` になるまでは、
課金の照合に `cost` を使わないでください。タスク記録は運用上の照会データであり、会計台帳ではありません。
照合や長期的な記録には、**Developer → Activities → Usage** で利用できる課金記録と CSV エクスポートを使用してください。

## コスト管理のベストプラクティス {#cost-control-practices}

- 新しいワークロードを開始する前に、現在のモデルカードを確認します。
- `capability_tags`、`supported_modes`、`unified_schema` を確認します。安価な代替モデルが役立つのは、必要な入出力の動作に
  対応している場合だけです。
- 不要なプロンプトコンテキストを減らし、選択したモデルが対応していれば適切な出力トークンの上限を設定します。
- キャッシュはモデルごとに異なるものとして扱います。プロバイダー全体で割引されると想定せず、モデルカードと返される使用量フィールドを
  確認してください。
- タスク ID はタスクコストの照会用にのみ記録します。非同期の `/v1/run` の処理では、返された不透明な run ID を記録し、ステータスが `pending` または `running` の間だけ `GET /v1/run/{id}` をポーリングします。
- 組織向けに Console で提供されている支出管理機能を使用します。

## 支払いエラー {#payment-errors}

組織がリクエストの費用を賄えない場合、API 操作は HTTP `402` を返すことがあります。エラーエンベロープは API の
互換インターフェースによって異なるため、特定のメッセージ文字列と照合するのではなく、HTTP ステータスと文書化されたエラーオブジェクトで
処理してください。Console で課金の問題を解決した後、その操作の冪等性と復旧のルールに従ってリトライしてください。

動画の送信は、開始前に見積もりコストに対してもチェックされます。1 回で $10 以上チャージすると
アカウントレベルが上がり、同時に実行できる動画タスクの数が増えます。
[同時実行数の制限](/guides/concurrency-limits) を参照してください。

現在の公開仕様については、[モデルと料金](/for-agents/models)、[タスクコスト](/api-reference/tasks/cost)、
[エラー](/api-reference/errors) を参照してください。
