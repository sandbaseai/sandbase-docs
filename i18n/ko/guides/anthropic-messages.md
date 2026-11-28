---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: SandBase에서 Anthropic 호환 메시지, 콘텐츠 블록, 도구, thinking, 스트리밍을 사용합니다.
---

# Anthropic Messages {#anthropic-messages}

SandBase는 `POST /v1/messages`에서 Anthropic 호환 엔드포인트를 제공합니다. Anthropic SDK 애플리케이션은 API 키와 기본 URL만 바꾸면 연결할 수 있습니다.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## 인증 및 버전 헤더 {#authentication-and-version-headers}

`x-api-key` 또는 `Authorization: Bearer …`를 사용합니다. 둘 다 지정하면 `x-api-key`가 우선합니다. 선택 사항인 `anthropic-version` 헤더는 업스트림으로 전달되며, 생략하면 기본값 `2023-06-01`이 적용됩니다. 선택 사항인 `anthropic-beta` 값도 제공업체 호환성에 따라 전달됩니다.

## 메시지와 콘텐츠 블록 {#messages-and-content-blocks}

메시지는 `user`와 `assistant` 역할을 사용합니다. 시스템 지침은 최상위 `system` 필드에 넣습니다. 콘텐츠는 일반 텍스트이거나 `text`, `image`, `tool_use`, `tool_result` 같은 유형이 지정된 블록의 배열일 수 있습니다.

## 도구와 확장 사고 {#tools-and-extended-thinking}

`tools`에 도구 정의를 추가하고 `tool_choice`로 선택 방식을 제어합니다. 선택한 모델이 지원하면 `thinking`으로 확장 추론을 설정할 수 있습니다. 대화를 이어갈 때는 반환된 thinking 블록을 그대로 유지하세요.

## 스트리밍 {#streaming}

`stream: true`를 설정하면 `message_start`, 콘텐츠 블록 이벤트, `message_delta`, `message_stop`을 포함한 Anthropic 방식의 SSE 이벤트를 받습니다. SandBase는 keepalive 이벤트와 제공업체가 정의한 베타 이벤트도 전달합니다. 향후 호환성을 위해 클라이언트는 알 수 없는 이벤트 유형을 무시하고, 프로토콜 수준의 `error` 이벤트를 처리해야 합니다.

## 호환성 {#compatibility}

SandBase는 공개 모델 이름을 선택된 제공업체에 매핑합니다. 제공업체에 지원되지 않는 필드를 제거하거나 후보를 거부하는 명시적 호환성 규칙이 없는 한, 그 밖의 호환 요청 필드와 응답 바이트는 그대로 유지됩니다. 제공업체별 베타 기능은 모든 모델에서 사용할 수 있는 것은 아닙니다. 전체 요청 및 응답 스키마는 [Anthropic 메시지 생성](/api-reference/anthropic-compat)을 참고하세요.
