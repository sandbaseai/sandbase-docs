---
i18nSource: 0d7d66842e233794
title: 使用 E2B SDK 的 Sandbox 快速入門
description: 將官方 E2B JavaScript 與 Python SDK 連接到 SandBase，執行指令、讀寫檔案，並安全地管理 sandbox。
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# 使用 E2B SDK 的 Sandbox 快速入門 {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

搭配您的 SandBase API 金鑰使用官方 E2B SDK，建立隔離的 sandbox、執行指令，以及讀寫檔案。本指南適用於 **E2B JavaScript 與 Python SDK 2.51.0**。

若要透過瀏覽器建立與觀察，請登入 [Sandbox Console](https://www.sandbase.ai/console/sandboxes) 建立執行個體，並查看其狀態、日誌與指標。若要整合到應用程式，請繼續進行下方的 SDK 步驟，或閱讀 [Sandbox 產品總覽](https://www.sandbase.ai/sandbox)。

## 1. 設定官方 SDK {#_1-configure-the-official-sdk}

[在 Console 中建立 SandBase API 金鑰](https://www.sandbase.ai/console/keys)，然後設定標準的 E2B 環境變數。官方 SDK 在 JavaScript 與 Python 中都會自動讀取這些變數。

| 環境變數 | 值 |
|---|---|
| `E2B_API_KEY` | 您從 [Developer → API Keys](https://www.sandbase.ai/console/keys) 取得的 SandBase API 金鑰 |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | 保持未設定，讓 SDK 使用每個 sandbox 的資料平面位址 |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

若您已將金鑰儲存在 `SANDBASE_API_KEY` 中，可直接重複使用：

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

您只需要 SandBase API 金鑰。請使用具備 Sandbox 存取資格的一般 SandBase 金鑰；限定於其他功能的金鑰可能會被拒絕。請參閱 [API 金鑰](/getting-started/api-keys)。

### 既有的 E2B 程式碼可以保持不變嗎？ {#can-existing-e2b-code-stay-unchanged}

可以，前提是使用支援的操作、您的應用程式已從環境讀取 SDK 連線設定，且其範本可在 SandBase 上使用。保留官方 SDK 與既有的呼叫，只需變更上述的金鑰、API URL 與網域。應用程式程式碼中明確指定的連線選項會優先於環境變數，因此請移除或更新所有寫死的 E2B 端點、網域或供應商金鑰。

請**同時**設定 `E2B_API_URL` 與 `E2B_DOMAIN`。若只設定網域，SDK 2.51.0 推導出的 API 主機會多出 `api.` 前綴。`E2B_SANDBOX_URL` 會覆寫每個執行個體的指令／檔案位址；請勿將其設為控制 API 的來源。除錯模式會改變 SDK 在本機開發時的位址選擇，因此對此 HTTPS 服務請保持停用。

控制 API 用於建立與管理執行個體。指令、檔案與應用程式連接埠使用 `sandbox.sandbase.ai` 下各執行個體專屬的子網域。請勿加上模型 API 的 `/v1` 前綴。控制 API 請求成功本身並不代表指令／檔案存取或所有供應商功能皆已驗證可用。

範例會讀取程序環境變數。只有在您的應用程式或啟動器在使用 SDK 之前載入 `.env` 檔案時，`.env` 檔案才會生效。

### 選擇範本 {#choose-a-template}

使用您的 SandBase 金鑰列出您組織可見的範本：

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

選擇 `buildStatus: "ready"` 的範本並複製其 `templateID`。顯示名稱提供於 `names` 或 `aliases` 中；若兩者皆為空，請使用 ID。`public` 欄位用於區分公開範本與您組織可見的私有範本。

回應為陣列。若回應標頭包含 `X-Next-Token`，請將其值作為 `nextToken` 查詢參數傳入，以取得下一頁。

設定所選的範本 ID：

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` 是下方範例所使用的變數，並非 E2B SDK 的內建設定。範例會明確地將它傳給 `Sandbox.create`。若既有程式碼使用的範本 ID 或名稱可在 SandBase 上使用，則可保留其範本參數。請勿假設上游的 E2B 範本 ID 或 SDK 預設的 `base` 可用；若清單為空，請為您的組織申請範本存取權。

## 2. 建立、執行與清理 {#_2-create-execute-and-clean-up}

這些範例會建立實際的資源。它們使用兩分鐘的存續時間，並在 `finally` 中明確刪除執行個體。請先執行一個範例，並確認清理完成後再重新執行。

### JavaScript {#javascript}

在應用程式目錄中使用 Node.js 22 或更新版本：

```bash
npm install --save-exact e2b@2.51.0
```

儲存為 `sandbox-example.mjs`：

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

在設定好 SDK 環境變數與所選範本後執行：

```bash
node sandbox-example.mjs
```

### Python {#python}

在您的 Python 環境中安裝固定版本的 SDK：

```bash
python -m pip install 'e2b==2.51.0'
```

儲存為 `sandbox_example.py`：

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

成功表示指令／檔案驗證與清理皆已完成。請將執行 ID 與 sandbox ID 保留在您的組織內部。請勿將 SDK 物件寫入日誌：其中可能含有存取權杖。

若建立作業逾時且未取得 ID，該資源可能仍然存在。在建立另一個之前，請請您的維運人員使用 `quickstartRunId` 中繼資料找出該資源。逾時或程序中斷並不代表已刪除；程序被強制終止後，`finally` 將無法執行。

## 3. 延長存續時間或暫停並重新連線 {#_3-extend-the-lifetime-or-pause-and-reconnect}

將這些程式碼片段插入對應範例的 `try` 區塊中，放在檔案檢查之後、清理之前。暫停／恢復必須受到所選範本與供應商的支援。

JavaScript 的這些 SDK 逾時設定使用**毫秒**：

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python 使用**秒**：

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

重新連線會傳回新的 SDK 物件與 session 憑證。後續的指令與檔案操作請使用該物件。刪除 sandbox 會結束其生命週期；本指南不保證刪除後的儲存資料會持續保留。sandbox 的存續時間與單一指令或 HTTP 請求的逾時是不同的設定。

## 4. 存取應用程式連接埠 {#_4-access-application-ports}

在您的應用程式於 sandbox 內開始監聽後，請在 JavaScript 中使用 `sandbox.getHost(port)`，或在 Python 中使用 `sandbox.get_host(port)` 取得其主機。應用程式流量需要 `e2b-traffic-access-token` 標頭，其值使用目前連線的 `sandbox.trafficAccessToken` 或 `sandbox.traffic_access_token`。

僅有主機並不足以授權存取。您的 HTTP 或 WebSocket 用戶端必須傳送該標頭；直接在瀏覽器分頁中開啟 URL 並不會加上它。請將流量權杖與已簽署的檔案 URL 視為憑證，避免出現在日誌與分享連結中。連接埠存取必須受到所選 sandbox 環境的支援。

## 疑難排解 {#troubleshooting}

| 症狀 | 檢查項目 |
|---|---|
| 驗證或範圍錯誤 | SandBase 金鑰是否有效、組織存取權與金鑰範圍 |
| 找不到範本 | 確切的已啟用範本 ID／名稱，以及它對您組織的可見性 |
| 建立成功但指令／檔案失敗 | 您的網路連線與目前的 session 憑證；請重新連線，若問題持續請聯絡支援團隊 |
| 請求被送到錯誤的服務 | `E2B_API_URL`、`E2B_DOMAIN`，以及任何覆寫它們的寫死 SDK 選項 |
| 暫停後存取失敗 | 重新連線並使用新傳回的 SDK 物件 |
| 應用程式連接埠拒絕請求 | 應用程式是否就緒，以及目前的流量權杖標頭 |
| `unsupported_operation` | 所選供應商不支援該操作；在依賴它之前請先確認可用性 |
| 建立回應不明 | 在建立另一個執行個體之前，先核對已記錄的執行 ID |
| 清理失敗 | 針對已記錄的執行個體 ID 重試刪除；不要重新執行整個建立流程 |

這些範例涵蓋基本的指令／檔案工作流程。範本建置、快照、事件、webhook 與進階網路功能需要另行確認功能支援。安裝 E2B SDK 本身並不代表與每個供應商完全相容。

## SDK 參考 {#sdk-references}

- [E2B 文件](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
