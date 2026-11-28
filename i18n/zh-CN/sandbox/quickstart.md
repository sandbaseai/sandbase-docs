---
i18nSource: 0d7d66842e233794
title: 使用 E2B SDK 快速上手 Sandbox
description: 将官方 E2B JavaScript 和 Python SDK 连接到 SandBase，运行命令、读写文件，并安全地管理沙箱。
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# 使用 E2B SDK 快速上手 Sandbox {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

使用官方 E2B SDK 和你的 SandBase API 密钥，创建隔离的沙箱、运行命令并读写文件。本指南适用于 **E2B JavaScript 和 Python SDK 2.51.0**。

如需在浏览器中创建和观察实例，请登录 [Sandbox Console](https://www.sandbase.ai/console/sandboxes) 创建实例，并查看其状态、日志和指标。如需在应用中集成，请继续阅读下文的 SDK 步骤，或阅读 [Sandbox 产品概览](https://www.sandbase.ai/sandbox)。

## 1. 配置官方 SDK {#_1-configure-the-official-sdk}

[在 Console 中创建 SandBase API 密钥](https://www.sandbase.ai/console/keys)，然后配置标准的 E2B 环境变量。官方 SDK 在 JavaScript 和 Python 中都会自动读取这些变量。

| 环境变量 | 值 |
|---|---|
| `E2B_API_KEY` | 你在 [Developer → API Keys](https://www.sandbase.ai/console/keys) 中获取的 SandBase API 密钥 |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | 不要设置，以便 SDK 使用每个沙箱的数据面地址 |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

如果你已经将密钥存放在 `SANDBASE_API_KEY` 中，可以直接复用：

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

你只需要 SandBase API 密钥。请使用具备 Sandbox 访问权限的普通 SandBase 密钥；仅限其他能力的密钥可能会被拒绝。参见 [API 密钥](/getting-started/api-keys)。

### 现有的 E2B 代码能否保持不变？ {#can-existing-e2b-code-stay-unchanged}

可以，前提是使用受支持的操作、你的应用已经从环境变量读取 SDK 连接设置，并且其模板在 SandBase 上可用。保留官方 SDK 和现有调用，只需更改上述密钥、API URL 和域名。应用代码中显式指定的连接选项优先于环境变量，因此请移除或更新所有硬编码的 E2B 端点、域名或服务商密钥。

请**同时**设置 `E2B_API_URL` 和 `E2B_DOMAIN`。如果只设置域名，SDK 2.51.0 推导出的 API 主机会多一个 `api.` 前缀。`E2B_SANDBOX_URL` 会覆盖每个实例的命令/文件地址；不要将其设置为控制 API 的源地址。调试模式会改变 SDK 在本地开发时的地址选择，因此对于此 HTTPS 服务请保持禁用。

控制 API 用于创建和管理实例。命令、文件和应用端口使用 `sandbox.sandbase.ai` 下的各实例子域名。不要附加模型 API 的 `/v1` 前缀。控制 API 请求成功本身并不能证明命令/文件访问或服务商的所有功能都可用。

示例从进程环境变量中读取配置。只有当你的应用或启动器在使用 SDK 之前加载了 `.env` 文件时，该文件才会生效。

### 选择模板 {#choose-a-template}

使用你的 SandBase 密钥列出你的组织可见的模板：

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

选择一个 `buildStatus: "ready"` 的模板并复制其 `templateID`。显示名称位于 `names` 或 `aliases` 中；如果两者都为空，请使用 ID。`public` 字段用于区分公开模板和你的组织可见的私有模板。

响应是一个数组。如果响应头包含 `X-Next-Token`，请将其值作为 `nextToken` 查询参数传入以获取下一页。

设置所选的模板 ID：

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` 是下文示例使用的变量，并非 E2B SDK 的内置设置。示例会将它显式传给 `Sandbox.create`。如果现有代码中的模板 ID 或名称在 SandBase 上可用，可以保留其模板参数。不要假定上游 E2B 的模板 ID 或 SDK 默认的 `base` 可用；如果列表为空，请为你的组织申请模板访问权限。

## 2. 创建、执行和清理 {#_2-create-execute-and-clean-up}

这些示例会创建真实的资源。它们使用两分钟的生命周期，并在 `finally` 中显式删除实例。请先运行一个示例，确认清理完成后再次运行。

### JavaScript {#javascript}

在应用目录中使用 Node.js 22 或更高版本：

```bash
npm install --save-exact e2b@2.51.0
```

保存为 `sandbox-example.mjs`：

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

在配置好 SDK 环境变量和所选模板后运行：

```bash
node sandbox-example.mjs
```

### Python {#python}

在你的 Python 环境中安装固定版本的 SDK：

```bash
python -m pip install 'e2b==2.51.0'
```

保存为 `sandbox_example.py`：

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

成功意味着命令/文件验证和清理都已完成。请勿将运行 ID 和沙箱 ID 泄露到组织之外。不要记录 SDK 对象的日志：其中可能包含访问令牌。

如果创建超时且未返回 ID，资源可能仍然存在。在再次创建之前，请让你的运维人员使用 `quickstartRunId` 元数据定位该资源。超时或进程中断并不代表已删除；进程被强制终止后，`finally` 无法执行。

## 3. 延长生命周期或暂停后重新连接 {#_3-extend-the-lifetime-or-pause-and-reconnect}

将以下代码片段插入对应示例的 `try` 块中，位于文件检查之后、清理之前。暂停/恢复需要所选模板和服务商支持。

JavaScript 中这些 SDK 超时使用**毫秒**：

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

重新连接会返回新的 SDK 对象和会话凭据。后续的命令和文件操作请使用该对象。删除沙箱会结束其生命周期；本指南不保证删除后存储仍会保留。沙箱的生命周期与单个命令或 HTTP 请求的超时是不同的设置。

## 4. 访问应用端口 {#_4-access-application-ports}

当应用在沙箱内开始监听后，在 JavaScript 中使用 `sandbox.getHost(port)`，或在 Python 中使用 `sandbox.get_host(port)` 获取其主机地址。应用流量需要携带 `e2b-traffic-access-token` 请求头，其值取自当前连接的 `sandbox.trafficAccessToken` 或 `sandbox.traffic_access_token`。

仅有主机地址并不能获得访问授权。你的 HTTP 或 WebSocket 客户端必须发送该请求头；直接在浏览器标签页中打开 URL 不会自动添加它。请将流量令牌和签名文件 URL 视为凭据，不要将它们写入日志或分享链接。端口访问需要所选沙箱环境支持。

## 故障排查 {#troubleshooting}

| 现象 | 检查项 |
|---|---|
| 认证或权限范围错误 | SandBase 密钥的有效性、组织访问权限和密钥权限范围 |
| 找不到模板 | 已启用模板的确切 ID/名称，以及它对你的组织是否可见 |
| 创建成功但命令/文件操作失败 | 你的网络连接和当前会话凭据；请重新连接，如问题持续存在请联系支持团队 |
| 请求被发送到错误的服务 | `E2B_API_URL`、`E2B_DOMAIN`，以及任何覆盖它们的硬编码 SDK 选项 |
| 暂停后访问失败 | 重新连接并使用新返回的 SDK 对象 |
| 应用端口拒绝请求 | 应用是否已就绪，以及当前的流量令牌请求头 |
| `unsupported_operation` | 所选服务商不支持该操作；依赖该操作前请先确认可用性 |
| 创建响应结果未知 | 在创建新实例之前，先核对已记录的运行 ID |
| 清理失败 | 针对已记录的实例 ID 重试删除；不要重新运行整个创建流程 |

这些示例涵盖基本的命令/文件工作流。模板构建、快照、事件、Webhook 和高级网络功能需要单独确认能力支持。安装 E2B SDK 本身并不能证明与所有服务商完全兼容。

## SDK 参考 {#sdk-references}

- [E2B 文档](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
