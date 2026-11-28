---
i18nSource: 0d7d66842e233794
title: E2B SDK による Sandbox クイックスタート
description: 公式の E2B JavaScript および Python SDK を SandBase に接続し、コマンドの実行、ファイルの読み書き、Sandbox の安全な管理を行います。
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# E2B SDK による Sandbox クイックスタート {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

公式の E2B SDK と SandBase の API キーを使って、分離された Sandbox を作成し、コマンドを実行し、ファイルを読み書きします。このガイドは **E2B JavaScript および Python SDK 2.51.0** を対象としています。

ブラウザーで作成・確認する場合は、[Sandbox Console](https://www.sandbase.ai/console/sandboxes) にサインインしてインスタンスを作成し、ステータス、ログ、メトリクスを確認できます。アプリケーションに組み込む場合は以下の SDK の手順に進むか、[Sandbox の製品概要](https://www.sandbase.ai/sandbox) をご覧ください。

## 1. 公式 SDK を設定する {#_1-configure-the-official-sdk}

[Console で SandBase の API キーを作成](https://www.sandbase.ai/console/keys)し、標準の E2B 環境変数を設定します。公式 SDK は JavaScript と Python のどちらでも、これらを自動的に読み取ります。

| 環境変数 | 値 |
|---|---|
| `E2B_API_KEY` | [Developer → API Keys](https://www.sandbase.ai/console/keys) で取得した SandBase の API キー |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | SDK が各 Sandbox のデータプレーンのアドレスを使用するよう、設定しないでください |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

すでにキーを `SANDBASE_API_KEY` に保存している場合は、それを再利用します。

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

必要なのは SandBase の API キーだけです。Sandbox へのアクセスが許可された通常の SandBase キーを使用してください。別の機能に制限されたキーは拒否される場合があります。[API キー](/getting-started/api-keys) を参照してください。

### 既存の E2B コードは変更せずに使えますか？ {#can-existing-e2b-code-stay-unchanged}

はい。アプリケーションがすでに SDK の接続設定を環境変数から読み取っていて、使用するテンプレートが SandBase で利用できる場合、サポートされている操作はそのまま使えます。公式 SDK と既存の呼び出しはそのままにして、上記のキー、API URL、ドメインを変更してください。アプリケーションコード内で明示的に指定した接続オプションは環境変数より優先されるため、ハードコードされた E2B のエンドポイント、ドメイン、プロバイダーキーは削除または更新してください。

`E2B_API_URL` と `E2B_DOMAIN` は **両方** 設定してください。ドメインだけを設定すると、SDK 2.51.0 は `api.` プレフィックスを追加した API ホストを導出します。`E2B_SANDBOX_URL` はインスタンスごとのコマンド/ファイルのアドレスを上書きします。コントロール API のオリジンを設定しないでください。デバッグモードはローカル開発向けに SDK のアドレス選択を変更するため、この HTTPS サービスでは無効のままにしてください。

コントロール API はインスタンスを作成・管理します。コマンド、ファイル、アプリケーションのポートは、`sandbox.sandbase.ai` 配下のインスタンスごとのサブドメインを使用します。モデル API の `/v1` プレフィックスは付けないでください。コントロール API へのリクエストが成功しただけでは、コマンド/ファイルへのアクセスやプロバイダーのすべての機能が動作することは確認できません。

例ではプロセスの環境変数を読み取ります。`.env` ファイルは、SDK を使用する前にアプリケーションまたはランチャーが読み込む場合にのみ機能します。

### テンプレートを選ぶ {#choose-a-template}

SandBase のキーを使って、組織から参照できるテンプレートを一覧表示します。

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

`buildStatus: "ready"` のテンプレートを選び、その `templateID` をコピーします。表示名は `names` または `aliases` に含まれます。どちらも空の場合は ID を使用してください。`public` フィールドで、公開テンプレートと組織から参照できるプライベートテンプレートを区別できます。

レスポンスは配列です。レスポンスヘッダーに `X-Next-Token` が含まれる場合は、その値を `nextToken` クエリパラメーターとして渡すと次のページを取得できます。

選択したテンプレート ID を設定します。

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` は以下の例で使用する変数であり、E2B SDK の組み込み設定ではありません。例ではこれを `Sandbox.create` に明示的に渡しています。既存のコードは、その ID または名前が SandBase で利用できる場合、テンプレート引数をそのまま使えます。上流の E2B のテンプレート ID や SDK のデフォルトの `base` が利用できるとは限りません。一覧が空の場合は、組織のテンプレートアクセスをリクエストしてください。

## 2. 作成、実行、クリーンアップ {#_2-create-execute-and-clean-up}

これらの例は実際のリソースを作成します。有効期間は 2 分で、`finally` でインスタンスを明示的に削除します。まず 1 つの例を実行し、クリーンアップを確認してから再度実行してください。

### JavaScript {#javascript}

アプリケーションのディレクトリで Node.js 22 以降を使用します。

```bash
npm install --save-exact e2b@2.51.0
```

`sandbox-example.mjs` として保存します。

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

SDK の環境変数と選択したテンプレートを設定した状態で実行します。

```bash
node sandbox-example.mjs
```

### Python {#python}

Python 環境に、バージョンを固定した SDK をインストールします。

```bash
python -m pip install 'e2b==2.51.0'
```

`sandbox_example.py` として保存します。

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

コマンド/ファイルの検証とクリーンアップの両方が完了すれば成功です。実行 ID と Sandbox ID は組織内で管理してください。SDK オブジェクトはアクセストークンを保持している場合があるため、ログに出力しないでください。

ID が返されないまま作成がタイムアウトした場合でも、リソースが存在している可能性があります。別のリソースを作成する前に、`quickstartRunId` メタデータを使って探すようオペレーターに依頼してください。タイムアウトやプロセスの中断は削除を保証しません。プロセスが強制終了された後は `finally` が実行されません。

## 3. 有効期間を延長する、または一時停止して再接続する {#_3-extend-the-lifetime-or-pause-and-reconnect}

以下のスニペットは、対応する例の `try` ブロック内で、ファイルのチェックの後、クリーンアップの前に挿入してください。一時停止/再開は、選択したテンプレートとプロバイダーがサポートしている必要があります。

JavaScript では、これらの SDK のタイムアウトに **ミリ秒** を使用します。

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python では **秒** を使用します。

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

再接続すると、新しい SDK オブジェクトとセッションの認証情報が返されます。以降のコマンドとファイルにはそのオブジェクトを使用してください。Sandbox を削除するとそのライフサイクルは終了します。このガイドは削除後のストレージの永続性を保証しません。Sandbox の有効期間と、個々のコマンドや HTTP リクエストのタイムアウトは別の設定です。

## 4. アプリケーションのポートにアクセスする {#_4-access-application-ports}

Sandbox 内でアプリケーションが待ち受けを開始したら、JavaScript では `sandbox.getHost(port)`、Python では `sandbox.get_host(port)` でホストを取得します。アプリケーションへのトラフィックには `e2b-traffic-access-token` ヘッダーが必要です。値には現在の接続の `sandbox.trafficAccessToken` または `sandbox.traffic_access_token` を使用します。

ホストだけではアクセスは許可されません。HTTP または WebSocket のクライアントがヘッダーを送信する必要があり、ブラウザーのタブで URL を開くだけではヘッダーは付与されません。トラフィックトークンと署名付きファイル URL は認証情報として扱い、ログや共有リンクに含めないでください。ポートへのアクセスは、選択した Sandbox 環境がサポートしている必要があります。

## トラブルシューティング {#troubleshooting}

| 症状 | 確認事項 |
|---|---|
| 認証エラーまたはスコープエラー | SandBase キーの有効性、組織のアクセス権、キーのスコープ |
| テンプレートが見つからない | 有効なテンプレートの正確な ID/名前と、組織からの参照可否 |
| 作成は成功するがコマンド/ファイルが失敗する | ネットワーク接続と現在のセッションの認証情報。再接続し、問題が続く場合はサポートに問い合わせてください |
| リクエストが別のサービスに送信される | `E2B_API_URL`、`E2B_DOMAIN`、およびそれらを上書きするハードコードされた SDK オプション |
| 一時停止後にアクセスできない | 再接続し、新しく返された SDK オブジェクトを使用します |
| アプリケーションのポートがリクエストを拒否する | アプリケーションの準備状態と、現在のトラフィックトークンのヘッダー |
| `unsupported_operation` | 選択したプロバイダーがその操作をサポートしていません。利用する前に提供状況を確認してください |
| 作成レスポンスが不明 | 別のインスタンスを作成する前に、記録した実行 ID で照合します |
| クリーンアップが失敗する | 記録したインスタンス ID の削除を再試行します。作成フロー全体を再実行しないでください |

例では基本的なコマンド/ファイルのワークフローを扱っています。テンプレートのビルド、スナップショット、イベント、Webhook、高度なネットワーク機能については、個別に機能の確認が必要です。E2B SDK をインストールしただけでは、すべてのプロバイダーとの完全な互換性は保証されません。

## SDK リファレンス {#sdk-references}

- [E2B ドキュメント](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
