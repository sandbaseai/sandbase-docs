---
i18nSource: 0d7d66842e233794
title: Bắt đầu nhanh với Sandbox bằng E2B SDK
description: Kết nối E2B JavaScript và Python SDK chính thức với SandBase, chạy lệnh, đọc và ghi file, và quản lý sandbox một cách an toàn.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Bắt đầu nhanh với Sandbox bằng E2B SDK {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Dùng E2B SDK chính thức cùng SandBase API key để tạo một sandbox cô lập, chạy lệnh, đọc và ghi file. Hướng dẫn này dành cho **E2B JavaScript và Python SDK 2.51.0**.

Nếu muốn tạo và theo dõi qua trình duyệt, hãy đăng nhập vào [Sandbox Console](https://www.sandbase.ai/console/sandboxes) để tạo instance và xem trạng thái, log và metric của nó. Để tích hợp vào ứng dụng, hãy tiếp tục với các bước SDK bên dưới, hoặc đọc [tổng quan sản phẩm Sandbox](https://www.sandbase.ai/sandbox).

## 1. Cấu hình SDK chính thức {#_1-configure-the-official-sdk}

[Tạo SandBase API key trong Console](https://www.sandbase.ai/console/keys), sau đó cấu hình các biến môi trường E2B tiêu chuẩn. SDK chính thức tự động đọc các biến này trong cả JavaScript và Python.

| Biến môi trường | Giá trị |
|---|---|
| `E2B_API_KEY` | SandBase API key của bạn từ [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Để trống để SDK dùng địa chỉ data plane của từng sandbox |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Nếu bạn đã lưu key trong `SANDBASE_API_KEY`, hãy dùng lại:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Bạn chỉ cần SandBase API key. Hãy dùng một SandBase key thông thường có quyền truy cập Sandbox; key bị giới hạn cho năng lực khác có thể bị từ chối. Xem [API key](/getting-started/api-keys).

### Có thể giữ nguyên mã E2B hiện có không? {#can-existing-e2b-code-stay-unchanged}

Có, với các thao tác được hỗ trợ, khi ứng dụng của bạn đã đọc thiết lập kết nối SDK từ biến môi trường và template của ứng dụng có sẵn trên SandBase. Hãy giữ SDK chính thức và các lệnh gọi hiện có; chỉ đổi key, API URL và domain ở trên. Các tùy chọn kết nối khai báo rõ trong mã ứng dụng được ưu tiên hơn biến môi trường, vì vậy hãy xóa hoặc cập nhật mọi endpoint, domain hay key nhà cung cấp E2B được ghi cứng.

Đặt **cả** `E2B_API_URL` và `E2B_DOMAIN`. Nếu chỉ có domain, SDK 2.51.0 sẽ suy ra API host với thêm tiền tố `api.`. `E2B_SANDBOX_URL` ghi đè địa chỉ lệnh/file của từng instance; đừng đặt biến này thành origin của control API. Chế độ debug thay đổi cách SDK chọn địa chỉ cho phát triển cục bộ, vì vậy hãy tắt chế độ này với dịch vụ HTTPS này.

Control API tạo và quản lý instance. Lệnh, file và cổng ứng dụng dùng subdomain riêng của từng instance dưới `sandbox.sandbase.ai`. Đừng thêm tiền tố `/v1` của model API. Một request control API thành công không đủ để xác minh quyền truy cập lệnh/file hoặc mọi tính năng của nhà cung cấp.

Các ví dụ đọc biến môi trường của tiến trình. File `.env` chỉ có tác dụng nếu ứng dụng hoặc trình khởi chạy của bạn nạp file đó trước khi dùng SDK.

### Chọn template {#choose-a-template}

Dùng SandBase key để liệt kê các template mà tổ chức của bạn nhìn thấy:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Chọn một template có `buildStatus: "ready"` và sao chép `templateID` của nó. Tên hiển thị nằm trong `names` hoặc `aliases`; nếu cả hai đều rỗng, hãy dùng ID. Trường `public` phân biệt template công khai với template riêng tư mà tổ chức của bạn nhìn thấy.

Response là một mảng. Nếu header của response có `X-Next-Token`, hãy truyền giá trị đó làm tham số query `nextToken` để lấy trang tiếp theo.

Đặt ID template đã chọn:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` là biến được dùng trong các ví dụ bên dưới, không phải thiết lập tích hợp sẵn của E2B SDK. Các ví dụ truyền rõ biến này vào `Sandbox.create`. Mã hiện có có thể giữ nguyên tham số template nếu ID hoặc tên đó có sẵn trên SandBase. Đừng giả định ID template E2B gốc hoặc template mặc định `base` của SDK có sẵn; nếu danh sách rỗng, hãy yêu cầu quyền truy cập template cho tổ chức của bạn.

## 2. Tạo, thực thi và dọn dẹp {#_2-create-execute-and-clean-up}

Các ví dụ này tạo tài nguyên thật. Chúng dùng thời gian sống hai phút và xóa instance một cách tường minh trong `finally`. Hãy chạy một ví dụ trước và xác nhận đã dọn dẹp xong rồi mới chạy lại.

### JavaScript {#javascript}

Dùng Node.js 22 trở lên trong một thư mục ứng dụng:

```bash
npm install --save-exact e2b@2.51.0
```

Lưu thành `sandbox-example.mjs`:

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

Chạy với các biến môi trường SDK và template đã chọn được cấu hình:

```bash
node sandbox-example.mjs
```

### Python {#python}

Cài SDK với phiên bản cố định trong môi trường Python của bạn:

```bash
python -m pip install 'e2b==2.51.0'
```

Lưu thành `sandbox_example.py`:

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

Thành công nghĩa là cả việc xác minh lệnh/file và việc dọn dẹp đều đã hoàn tất. Hãy giữ ID run và ID sandbox trong phạm vi tổ chức của bạn. Đừng ghi log đối tượng SDK vì nó có thể chứa access token.

Nếu việc tạo hết thời gian chờ mà không có ID, tài nguyên có thể vẫn tồn tại. Hãy nhờ người vận hành tìm tài nguyên đó bằng metadata `quickstartRunId` trước khi tạo cái khác. Hết thời gian chờ hoặc tiến trình bị gián đoạn không xác nhận rằng tài nguyên đã bị xóa; `finally` không thể chạy sau khi tiến trình bị buộc dừng.

## 3. Kéo dài thời gian sống hoặc tạm dừng và kết nối lại {#_3-extend-the-lifetime-or-pause-and-reconnect}

Chèn các đoạn mã này vào khối `try` của ví dụ tương ứng, sau bước kiểm tra file và trước bước dọn dẹp. Template và nhà cung cấp đã chọn phải hỗ trợ tạm dừng/tiếp tục.

JavaScript dùng **mili giây** cho các timeout SDK này:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python dùng **giây**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Kết nối lại sẽ trả về đối tượng SDK và thông tin xác thực phiên mới. Hãy dùng đối tượng đó cho các lệnh và file tiếp theo. Xóa sandbox sẽ kết thúc vòng đời của nó; hướng dẫn này không cam kết lưu trữ được giữ lại sau khi xóa. Thời gian sống của sandbox và timeout của từng lệnh hoặc request HTTP là các thiết lập khác nhau.

## 4. Truy cập cổng ứng dụng {#_4-access-application-ports}

Sau khi ứng dụng của bạn đã lắng nghe bên trong sandbox, hãy dùng `sandbox.getHost(port)` trong JavaScript hoặc `sandbox.get_host(port)` trong Python để lấy host. Lưu lượng đến ứng dụng cần header `e2b-traffic-access-token`, dùng `sandbox.trafficAccessToken` hoặc `sandbox.traffic_access_token` từ kết nối hiện tại.

Chỉ có host thì không đủ để được cấp quyền truy cập. Client HTTP hoặc WebSocket của bạn phải gửi header này; chỉ mở URL trong tab trình duyệt sẽ không thêm header. Hãy coi traffic token và URL file đã ký là thông tin xác thực, và không để chúng xuất hiện trong log hay liên kết chia sẻ. Môi trường sandbox đã chọn phải hỗ trợ truy cập cổng.

## Khắc phục sự cố {#troubleshooting}

| Triệu chứng | Cần kiểm tra |
|---|---|
| Lỗi xác thực hoặc phạm vi | Tính hợp lệ của SandBase key, quyền truy cập của tổ chức và phạm vi của key |
| Không tìm thấy template | ID/tên chính xác của template đã bật và việc tổ chức của bạn có nhìn thấy template đó hay không |
| Tạo thành công nhưng lệnh/file thất bại | Kết nối mạng và thông tin xác thực phiên hiện tại; hãy kết nối lại và liên hệ bộ phận hỗ trợ nếu sự cố vẫn tiếp diễn |
| Request đi đến sai dịch vụ | `E2B_API_URL`, `E2B_DOMAIN` và mọi tùy chọn SDK được ghi cứng ghi đè chúng |
| Truy cập thất bại sau khi tạm dừng | Kết nối lại và dùng đối tượng SDK mới được trả về |
| Cổng ứng dụng từ chối request | Ứng dụng đã sẵn sàng chưa và header traffic token hiện tại |
| `unsupported_operation` | Nhà cung cấp đã chọn không hỗ trợ thao tác đó; hãy kiểm tra khả năng hỗ trợ trước khi phụ thuộc vào nó |
| Không rõ response của thao tác tạo | Đối soát ID run đã ghi lại trước khi tạo instance khác |
| Dọn dẹp thất bại | Thử xóa lại instance theo ID đã ghi lại; không chạy lại toàn bộ luồng tạo |

Các ví dụ bao quát luồng lệnh/file cơ bản. Build template, snapshot, sự kiện, webhook và mạng nâng cao cần kiểm tra năng lực riêng. Chỉ cài E2B SDK thôi không chứng minh được khả năng tương thích đầy đủ với mọi nhà cung cấp.

## Tài liệu tham chiếu SDK {#sdk-references}

- [Tài liệu E2B](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
