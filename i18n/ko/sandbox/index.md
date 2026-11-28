---
i18nSource: 4191d2eb16a594f5
title: Sandbox 개요와 기능
description: E2B SDK 또는 SandBase Console로 Sandbox를 생성하고, 상태·로그·메트릭을 확인하고, 별도의 실험적 Playground를 살펴봅니다.
---

# Sandbox 개요와 기능 {#sandbox-overview-and-capabilities}

Sandbox는 명령 실행, 코드 실행, 파일 읽기와 쓰기를 위한 격리된 환경을 제공합니다. 인스턴스를 일시 중지했다가 다시 연결하고, 파일을 다시 읽어 데이터가 유지되는지 확인할 수 있습니다.

[빠른 시작 / E2B SDK](./quickstart) · [Playground 열기(실험적)](./playground)

[공식 E2B SDK](./quickstart)로 애플리케이션에 Sandbox를 통합하세요. [Sandbox Console](https://www.sandbase.ai/console/sandboxes)에 로그인하면 Sandbox를 생성하고 인스턴스 상태, 로그, 메트릭을 확인할 수 있습니다. 소개는 [Sandbox 제품 개요](https://www.sandbase.ai/sandbox)를 참고하세요. 아래의 둘러보기와 지원 표는 별도의 실험적 Playground에 대한 설명입니다.

## 5분 Playground 둘러보기 {#a-five-minute-playground-walkthrough}

1. Sandbox 권한이 있는 [API 키](/getting-started/api-keys)를 입력합니다. 연결 시에는 템플릿과 인스턴스만 읽습니다.
2. 사용 가능한 템플릿을 선택하고 리소스 안내를 확인한 뒤 수명이 짧은 인스턴스를 생성합니다.
3. 시스템 정보 또는 Python 예제를 실행합니다. 명령 패널 옆에서 출력과 프로세스 이벤트를 확인합니다.
4. 텍스트 파일을 쓰고 확인한 뒤, 인스턴스를 일시 중지했다가 재개하고 같은 파일을 다시 읽습니다.
5. 수명 주기 이벤트, 메트릭, 로그, 머신 사용 시간 기록을 확인합니다. 작업이 끝나면 인스턴스를 삭제합니다.

새로고침하면 페이지의 자격 증명과 로컬 작업 기록이 지워지지만 Sandbox는 삭제되지 않습니다. 실행 중인 인스턴스는 서버 타임아웃을 따릅니다. 일시 중지된 인스턴스는 리소스를 계속 점유할 수 있습니다. 인스턴스 ID를 기록해 두고, 페이지를 떠난 뒤에는 조직의 도구로 리소스를 대조하고 정리하세요.

## 기능과 제한 {#capabilities-and-boundaries}

| 기능 | Playground 지원 |
| --- | --- |
| 생성, 목록 조회, 일시 중지, 재개, 타임아웃 연장, 삭제 | 사용 가능. 변경 작업은 이 페이지 세션에서 생성한 인스턴스에만 적용됩니다 |
| 명령과 텍스트 파일 | 사용 가능. 명령은 최대 25초 동안 실행되며, 파일 편집은 `/tmp/`와 32 KiB로 제한됩니다 |
| 수명 주기 이벤트, 로그, 메트릭, 머신 사용 시간 | 환경에 따라 제공 여부가 다르므로 반환된 결과를 확인하세요 |
| AI 채팅과 대화 컨텍스트 | 통합되지 않음. 모델 설정과 Agent 워크로드가 필요합니다 |
| PTY, 애플리케이션 포트, webhook, 템플릿 빌드 | 이 인터페이스에서는 사용할 수 없습니다 |
| 스냅샷과 fork | 이 Playground에서는 사용할 수 없습니다 |

셸 상호작용은 AI 채팅이 아닙니다. 인스턴스 복구, 파일 지속성, 프로세스 유지, 대화 연속성은 각각 따로 확인해야 합니다.

## 이벤트 이해하기 {#understanding-events}

**Sandbox lifecycle** 항목은 새로고침 시 가져오는 네이티브 서버 이벤트이며 지연되어 도착할 수 있습니다. **Sandbox process** 항목은 프로세스 시작과 스트리밍 출력을 나타냅니다. **Playground** 항목은 로컬 요청의 완료 또는 실패를 기록하며, 서비스 수명 주기 이벤트가 아닙니다.

목록이 비어 있다고 사용량이 0이라는 뜻은 아니며, 이벤트가 없다고 작업이 실패했다는 뜻도 아닙니다. 머신 사용 시간 기록은 최종 청구서가 아닙니다. 타임아웃이나 연결 중단 후에는 다시 생성 요청을 보내기 전에 인스턴스를 대조하세요.

## 템플릿 표시 범위 {#template-visibility}

템플릿은 공개이거나 조직 전용일 수 있습니다. 개수는 고정되어 있지 않습니다. 이름이 없는 항목도 표시되며, 별칭이나 ID가 대체 레이블로 사용됩니다. 조직의 접근 권한과 템플릿 제공 여부에 따라 보고 사용할 수 있는 템플릿이 결정됩니다.

## Sandbox와 Agent Session {#sandboxes-and-agent-sessions}

Agents Session은 SandBase 호스팅 클라우드에서 실행됩니다. E2B SDK로 생성하는 Sandbox 인스턴스와는 별개이며, Agents API는 Sandbox 인스턴스를 노출하지 않습니다. [Session](/agents/sessions)을 참고하세요.
