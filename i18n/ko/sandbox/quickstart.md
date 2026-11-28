---
i18nSource: 0d7d66842e233794
title: E2B SDK로 시작하는 Sandbox 빠른 시작
description: 공식 E2B JavaScript 및 Python SDK를 SandBase에 연결하여 명령을 실행하고, 파일을 읽고 쓰고, 샌드박스를 안전하게 관리합니다.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# E2B SDK로 시작하는 Sandbox 빠른 시작 {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

공식 E2B SDK와 SandBase API 키로 격리된 샌드박스를 만들고, 명령을 실행하고, 파일을 읽고 씁니다. 이 가이드는 **E2B JavaScript 및 Python SDK 2.51.0**을 기준으로 합니다.

브라우저에서 생성하고 확인하려면 [Sandbox Console](https://www.sandbase.ai/console/sandboxes)에 로그인하여 인스턴스를 만들고 상태, 로그, 메트릭을 확인하세요. 애플리케이션에 통합하려면 아래 SDK 단계를 계속 진행하거나 [Sandbox 제품 개요](https://www.sandbase.ai/sandbox)를 읽어 보세요.

## 1. 공식 SDK 구성 {#_1-configure-the-official-sdk}

[Console에서 SandBase API 키를 만든](https://www.sandbase.ai/console/keys) 다음 표준 E2B 환경 변수를 설정합니다. 공식 SDK는 JavaScript와 Python 모두에서 이 변수를 자동으로 읽습니다.

| 환경 변수 | 값 |
|---|---|
| `E2B_API_KEY` | [Developer → API Keys](https://www.sandbase.ai/console/keys)에서 발급한 SandBase API 키 |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | SDK가 각 샌드박스의 데이터 플레인 주소를 사용하도록 설정하지 않음 |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

이미 `SANDBASE_API_KEY`에 키를 저장했다면 그대로 재사용합니다.

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

필요한 것은 SandBase API 키뿐입니다. Sandbox 접근이 허용된 일반 SandBase 키를 사용하세요. 다른 기능으로 제한된 키는 거부될 수 있습니다. [API 키](/getting-started/api-keys)를 참고하세요.

### 기존 E2B 코드를 그대로 쓸 수 있나요? {#can-existing-e2b-code-stay-unchanged}

지원되는 작업이고, 애플리케이션이 이미 환경 변수에서 SDK 연결 설정을 읽으며, 사용하는 템플릿을 SandBase에서 쓸 수 있다면 그대로 쓸 수 있습니다. 공식 SDK와 기존 호출은 유지하고 위의 키, API URL, 도메인만 바꾸세요. 애플리케이션 코드의 명시적 연결 옵션은 환경 변수보다 우선하므로, 하드코딩된 E2B 엔드포인트, 도메인, 제공업체 키는 제거하거나 업데이트하세요.

`E2B_API_URL`과 `E2B_DOMAIN`을 **모두** 설정하세요. 도메인만 설정하면 SDK 2.51.0은 앞에 `api.` 접두사를 추가로 붙인 API 호스트를 만듭니다. `E2B_SANDBOX_URL`은 인스턴스별 명령/파일 주소를 덮어쓰므로 컨트롤 API 오리진으로 설정하지 마세요. 디버그 모드는 로컬 개발용으로 SDK의 주소 선택 방식을 바꾸므로, 이 HTTPS 서비스에서는 비활성화 상태로 두세요.

컨트롤 API는 인스턴스를 생성하고 관리합니다. 명령, 파일, 애플리케이션 포트는 `sandbox.sandbase.ai` 아래의 인스턴스별 하위 도메인을 사용합니다. 모델 API의 `/v1` 접두사를 붙이지 마세요. 컨트롤 API 요청이 성공했다고 해서 명령/파일 접근이나 모든 제공업체 기능이 확인되는 것은 아닙니다.

예제는 프로세스 환경 변수를 읽습니다. `.env` 파일은 애플리케이션이나 실행기가 SDK를 사용하기 전에 불러오는 경우에만 동작합니다.

### 템플릿 선택 {#choose-a-template}

SandBase 키로 조직에서 볼 수 있는 템플릿을 나열합니다.

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

`buildStatus: "ready"`인 템플릿을 선택하고 `templateID`를 복사하세요. 표시 이름은 `names` 또는 `aliases`에 있으며, 둘 다 비어 있으면 ID를 사용합니다. `public` 필드로 공개 템플릿과 조직에서 볼 수 있는 비공개 템플릿을 구분합니다.

응답은 배열입니다. 응답 헤더에 `X-Next-Token`이 있으면 그 값을 `nextToken` 쿼리 매개변수로 전달해 다음 페이지를 가져옵니다.

선택한 템플릿 ID를 설정합니다.

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID`는 아래 예제에서 사용하는 변수이며, E2B SDK에 내장된 설정이 아닙니다. 예제는 이 값을 `Sandbox.create`에 명시적으로 전달합니다. 기존 코드는 해당 ID나 이름을 SandBase에서 쓸 수 있다면 템플릿 인수를 그대로 유지할 수 있습니다. 업스트림 E2B 템플릿 ID나 SDK 기본값 `base`를 쓸 수 있다고 가정하지 마세요. 목록이 비어 있으면 조직에 대한 템플릿 접근 권한을 요청하세요.

## 2. 생성, 실행, 정리 {#_2-create-execute-and-clean-up}

이 예제는 실제 리소스를 생성합니다. 수명을 2분으로 설정하고 `finally`에서 인스턴스를 명시적으로 삭제합니다. 먼저 예제 하나를 실행하고 정리가 완료되었는지 확인한 뒤 다시 실행하세요.

### JavaScript {#javascript}

애플리케이션 디렉터리에서 Node.js 22 이상을 사용합니다.

```bash
npm install --save-exact e2b@2.51.0
```

`sandbox-example.mjs`로 저장합니다.

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

SDK 환경 변수와 선택한 템플릿을 설정한 상태에서 실행합니다.

```bash
node sandbox-example.mjs
```

### Python {#python}

Python 환경에 버전을 고정한 SDK를 설치합니다.

```bash
python -m pip install 'e2b==2.51.0'
```

`sandbox_example.py`로 저장합니다.

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

명령/파일 검증과 정리가 모두 완료되면 성공입니다. 실행 ID와 샌드박스 ID는 조직 안에서만 관리하세요. SDK 객체는 액세스 토큰을 담고 있을 수 있으므로 로그에 남기지 마세요.

ID 없이 생성 시간이 초과되어도 리소스는 존재할 수 있습니다. 새로 만들기 전에 운영자에게 `quickstartRunId` 메타데이터로 해당 리소스를 찾아 달라고 요청하세요. 시간 초과나 중단된 프로세스는 삭제를 보장하지 않으며, 프로세스가 강제 종료되면 `finally`가 실행되지 않습니다.

## 3. 수명 연장 또는 일시 중지 후 재연결 {#_3-extend-the-lifetime-or-pause-and-reconnect}

이 코드 조각을 해당 예제의 `try` 블록 안, 파일 검사 뒤와 정리 앞에 넣으세요. 일시 중지/재개는 선택한 템플릿과 제공업체가 지원해야 합니다.

JavaScript에서는 이 SDK 시간 제한에 **밀리초**를 사용합니다.

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python에서는 **초**를 사용합니다.

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

재연결하면 새 SDK 객체와 세션 자격 증명이 반환됩니다. 이후 명령과 파일 작업에는 그 객체를 사용하세요. 샌드박스를 삭제하면 수명 주기가 끝나며, 이 가이드는 삭제 후 저장소가 유지된다고 보장하지 않습니다. 샌드박스 수명과 개별 명령 또는 HTTP 요청의 시간 제한은 서로 다른 설정입니다.

## 4. 애플리케이션 포트 접근 {#_4-access-application-ports}

샌드박스 안에서 애플리케이션이 수신 대기를 시작하면 JavaScript에서는 `sandbox.getHost(port)`, Python에서는 `sandbox.get_host(port)`로 호스트를 얻습니다. 애플리케이션 트래픽에는 `e2b-traffic-access-token` 헤더가 필요하며, 값은 현재 연결의 `sandbox.trafficAccessToken` 또는 `sandbox.traffic_access_token`을 사용합니다.

호스트만으로는 접근이 허용되지 않습니다. HTTP 또는 WebSocket 클라이언트가 이 헤더를 보내야 하며, 브라우저 탭에서 URL을 여는 것만으로는 헤더가 추가되지 않습니다. 트래픽 토큰과 서명된 파일 URL은 자격 증명으로 취급하고, 로그와 공유 링크에 포함하지 마세요. 포트 접근은 선택한 샌드박스 환경이 지원해야 합니다.

## 문제 해결 {#troubleshooting}

| 증상 | 확인할 사항 |
|---|---|
| 인증 또는 범위 오류 | SandBase 키의 유효성, 조직 접근 권한, 키 범위 |
| 템플릿을 찾을 수 없음 | 활성화된 정확한 템플릿 ID/이름과 조직에 대한 공개 여부 |
| 생성은 성공하지만 명령/파일이 실패함 | 네트워크 연결과 현재 세션 자격 증명. 재연결하고, 문제가 계속되면 지원팀에 문의 |
| 요청이 잘못된 서비스로 감 | `E2B_API_URL`, `E2B_DOMAIN`, 그리고 이를 덮어쓰는 하드코딩된 SDK 옵션 |
| 일시 중지 후 접근 실패 | 재연결하고 새로 반환된 SDK 객체를 사용 |
| 애플리케이션 포트가 요청을 거부함 | 애플리케이션 준비 상태와 현재 트래픽 토큰 헤더 |
| `unsupported_operation` | 선택한 제공업체가 해당 작업을 지원하지 않음. 사용하기 전에 지원 여부를 확인 |
| 생성 응답을 알 수 없음 | 다른 인스턴스를 만들기 전에 기록한 실행 ID로 상태를 대조 |
| 정리 실패 | 기록한 인스턴스 ID로 삭제를 재시도. 생성 흐름 전체를 다시 실행하지 않음 |

예제는 기본 명령/파일 워크플로를 다룹니다. 템플릿 빌드, 스냅샷, 이벤트, 웹훅, 고급 네트워킹은 별도로 기능 지원 여부를 확인해야 합니다. E2B SDK를 설치했다고 해서 모든 제공업체와 완전히 호환되는 것은 아닙니다.

## SDK 레퍼런스 {#sdk-references}

- [E2B 문서](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
