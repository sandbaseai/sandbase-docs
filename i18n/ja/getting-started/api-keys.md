---
i18nSource: 3dc57d405dbf561d
title: API キー
description: API リクエストの認証に使用する SandBase の API キーを作成、管理し、安全に保つ方法を説明します。
---

# API キー {#api-keys}

API キーは、SandBase へのリクエストを認証します。このガイドでは、キーの作成方法、リクエストでの使用方法、安全な管理方法を説明します。

## API キーを作成する {#create-an-api-key}

1. [SandBase Console](https://www.sandbase.ai/console) にログインします
2. **Developer → API Keys** を開きます（または [API Keys](https://www.sandbase.ai/console/keys) に直接アクセスします）
3. **New key** をクリックします
4. わかりやすい **Name** を入力します（例: 「Production Server」「Local Development」）
5. 必要に応じて **Spending limit**（空欄は無制限）と **Expires** の日付（空欄は無期限）を設定します
6. **Create key** をクリックします
7. **API key created** バナーからすぐにキーをコピーします。キーは一度しか表示されません

::: danger 重要
API キーは作成時に一度だけ表示されます。紛失した場合は、新しいキーを作成する必要があります。ダイアログを閉じる前に、安全な場所に保存してください。
:::

## キーの形式 {#key-format}

Console で作成した新しい API キーは、`sk-` プレフィックスの後に 64 文字の 16 進数が続く形式です。

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

既存の `sk-sb-...` キーは、期限切れになるか失効されるまで引き続き有効です。プレフィックスだけで
認証情報を検証しないでください。値全体を常に不透明なシークレットとして扱ってください。

## 認証方法 {#authentication-methods}

SandBase では、リクエストで API キーを渡す方法が 2 つあります。

### Authorization ヘッダー（推奨） {#authorization-header-recommended}

標準の `Authorization: Bearer` ヘッダーを使用します。OpenAI と Anthropic の SDK と互換性があります。

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: x-api-key ヘッダー {#anthropic-messages-x-api-key-header}

`POST /v1/messages` は、Anthropic ネイティブの `x-api-key` ヘッダーも受け付けます。

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
モデルゲートウェイのうち `x-api-key` を読み取るのは `POST /v1/messages` だけで、サポートされている両方のヘッダーが
ある場合はこちらが優先されます。[Agents プラットフォームのリソース](/api-reference/authentication#agents-platform-resources) も
`X-API-Key` を受け付けます。その他の公開エンドポイントでは、すべて Bearer ヘッダーを使用してください。
:::

## キーの権限 {#key-permissions}

SandBase の API キーは **組織レベル** でスコープされます。

- Console で作成した標準のキーは、組織が利用できる公開 API リソースを呼び出せます
- 使用量は、キーを所有する組織に請求されます
- キーには任意で有効期限と利用上限を設定できます
- CLI Login キーなど SandBase が発行する認証情報は、制限されたスコープを持つ場合があり、スコープ外では `403` を返します

現在、Console では標準のキーにユーザーがスコープを選択する機能は提供されていません。CLI Login キーは、AI ツールを接続したときに作成されます。API Keys ページでは、これらは展開可能な 1 つの **CLI Login** 行にまとめられ、標準のキーのように編集することはできません。SandBase が自動的に作成したキーには **Auto-created** バッジが付きます。これらにはキー単位の上限がなく、アカウント残高によって制限されます。

キーの一覧には、各キーの **Name**、**Key Prefix**、**Spent**、**Limit**、**Expires**、**Status** が表示されます。標準のキーの名前、利用上限、有効期限を変更するには **Edit** を使用します。

各キーは、個人のパスワードではなくアプリケーションの認証情報として扱ってください。人によるアクセスには組織のメンバーシップを、ワークロードには API キーを使用します。

## 環境ごとの運用 {#environment-strategy}

アプリケーションと環境ごとに異なるキーを作成します。

| キー | 名前の例 | 理由 |
|---|---|---|
| ローカル開発 | `research-app-dev` | 本番環境を中断せずにローテーションできる |
| ステージング | `research-app-staging` | テストでの使用やインシデントを分離できる |
| 本番 | `research-app-production` | 本番環境の所有者を明確にし、影響範囲を限定できる |
| 一時的な自動化 | `release-check-2026-08` | 有効期限を設定し、個別に失効できる |

各キーの所有者と、そのキーを使用するデプロイを記録してください。ローテーション時は、新しいキーをデプロイしてリクエストが成功することを確認してから、古いキーを失効させます。

## キーの有効期限と失効 {#key-expiration-and-revocation}

### 有効期限 {#expiration}

キーの作成時に、任意で有効期限を設定できます。期限切れになるとキーは使用できなくなり、リクエストは `401 Unauthorized` エラーを返します。

有効期限のないキーは、手動で失効させるまで有効です。

### キーを失効させる {#revoking-a-key}

キーを失効（無効化）するには、次の手順を実行します。

1. [Developer → API Keys](https://www.sandbase.ai/console/keys) に移動します
2. 失効させるキーを見つけます
3. **Revoke** をクリックします
4. 操作を確定します

失効したキーでは新しいリクエストを認証できません。失効は取り消せません。誤って失効させた場合は、新しいキーを作成してください。

## セキュリティのベストプラクティス {#security-best-practices}

### キーをバージョン管理にコミットしない {#never-commit-keys-to-version-control}

代わりに環境変数またはシークレットマネージャーを使用します。

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### 環境ごとに別のキーを使用する {#use-separate-keys-for-different-environments}

開発、ステージング、本番で別々のキーを作成します。こうすることで、漏えいした開発用キーを本番環境に影響を与えずに失効させられます。

### キーを定期的にローテーションする {#rotate-keys-regularly}

定期的に新しいキーを作成し、古いキーを廃止します。キーが漏えいした場合に、悪用される期間を短くできます。

### アクティビティを監視する {#monitor-activity}

**Developer → Activities** を定期的に確認し、予期しないリクエストや使用量の急増がないか確認してください。これらはキーの漏えいを示している可能性があります。**Request History** は API キーで絞り込めます。

キーが漏えいした場合は、すぐに失効させ、代わりのキーを作成し、利用側のアプリケーションを更新したうえで、Activities と請求に予期しない使用がないか確認してください。定期ローテーションを待たないでください。

### 有効期限を設定する {#set-expiration-dates}

一時的なアクセス（CI/CD パイプライン、外部委託先のアクセス、デモ）には有効期限を設定し、キーが自動的に使用できなくなるようにします。

## トラブルシューティング {#troubleshooting}

| エラー | 原因 | 対処法 |
|-------|-------|-----|
| `401 - missing API key` | リクエストにキーが指定されていない | `Authorization: Bearer <key>` ヘッダーを追加します |
| `401 - invalid API key` | キーが存在しない | 入力ミスがないか確認し、キー全体が含まれていることを確認します |
| `401 - API key has been revoked` | Console でキーが完全に失効された | 代わりのキーを作成します |
| `401 - API key has expired` | キーの有効期限が切れた | 新しいキーを作成するか、有効期限を延長します |
| `402 - API key spending limit exceeded` | キーが設定された利用上限に達した | 上限を引き上げるか、権限のある別のキーを使用します |
| `403 - insufficient_scope` | スコープ付きの認証情報ではこのエンドポイントを呼び出せない | このエンドポイントで許可されたキーを使用します |

## 次のステップ {#next-steps}

- [**最初の API 呼び出し**](/getting-started/first-call) — リクエストとレスポンスを詳しく追いながら API を呼び出します
- [**認証**](/api-reference/authentication) — サポートされるヘッダー、ライフサイクル、プロトコル固有のエラー
- [**API リファレンス**](/api-reference/) — すべてのエンドポイントのドキュメント
