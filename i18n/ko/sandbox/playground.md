---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground(실험적)
description: 자체 API 키로 실제 SandBase Sandbox를 사용해 보세요. 생성하고, 명령을 실행하고, 일시 중지 및 재개 후 파일을 확인하고, 수명 주기 이벤트를 살펴봅니다.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

자체 키로 Sandbox API를 사용해 보세요. 작업은 **sandbox.sandbase.ai**에 연결되며 요금이 발생할 수 있습니다.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## 키는 사용자가 직접 관리합니다 {#your-key-stays-under-your-control}

- **페이지 메모리에만 보관합니다.** 이 Playground는 API 키나 연결 토큰을 브라우저 저장소나 쿠키에 저장하지 않고, URL에 넣지 않으며, 페이지 활동이나 요청 예시에 기록하지 않습니다.
- **언제든지 지울 수 있습니다.** **Clear key**를 선택하면 요청이 실행 중이더라도 키, 연결 토큰, 표시된 활동이 제거됩니다. 페이지를 새로 고치거나 떠나도 지워집니다. 다시 연결하려면 키를 다시 입력해야 합니다.
- **사용자의 요청에만 사용됩니다.** 키는 요청한 Sandbox 작업을 인증하기 위해 SandBase로 전송됩니다. 이 페이지를 지워도 키가 폐기되지는 않으므로, 필요하면 [Developer → API Keys](https://www.sandbase.ai/console/keys)에서 폐기하세요.

이 약속은 이 Playground가 자격 증명을 다루는 방식에 대한 것입니다. Sandbox 활동이나 서비스 측 사용 기록이 삭제된다는 의미는 아닙니다. 명령이나 파일 내용은 Sandbox에 남을 수 있으므로 비밀 정보를 입력하지 마세요.

## 리소스는 별도로 정리하세요 {#clean-up-resources-separately}

키를 지워도 서비스가 이미 받은 작업이 취소되거나 Sandbox가 삭제되지는 않습니다. 작업이 끝나면 인스턴스를 삭제하세요. 생성 결과를 알 수 없다면 다른 인스턴스를 만들기 전에 인스턴스 목록을 확인하세요. 이 페이지를 지우기 전에 정리에 필요한 인스턴스 ID를 보관하세요.

[개요 및 기능](./index) · [빠른 시작 / E2B SDK](./quickstart)
