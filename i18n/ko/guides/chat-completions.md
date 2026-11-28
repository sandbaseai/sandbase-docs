---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: SandBase에서 OpenAI 호환 채팅 완성, 스트리밍, 도구, 멀티모달 입력, 구조화된 출력을 사용합니다.
---

# Chat Completions {#chat-completions}

SandBase는 `POST /v1/chat/completions`에서 OpenAI 호환 Chat Completions 엔드포인트를 제공합니다. 기존 OpenAI SDK 애플리케이션은 API 키와 base URL만 바꾸면 SandBase를 사용할 수 있습니다.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## 메시지와 멀티모달 콘텐츠 {#messages-and-multimodal-content}

선택한 공급자가 지원하는 역할(일반적으로 `system`, `developer`, `user`, `assistant`, `tool`)을 사용해 대화 순서대로 메시지를 보냅니다. 텍스트는 문자열로 보낼 수 있습니다. 비전을 지원하는 모델은 `text`, `image_url` 같은 콘텐츠 파트도 받습니다.

## 스트리밍 {#streaming}

Server-Sent Events를 받으려면 `stream: true`를 설정합니다. 각 `data:` 이벤트를 순서대로 읽고 `choices[0].delta.content`를 이어 붙이세요. 스트림은 `data: [DONE]`으로 끝납니다. 선택한 공급자가 스트리밍 사용량을 제공하는 경우 `stream_options: {"include_usage": true}`를 추가하세요. 그렇지 않으면 사용량이 없을 수 있습니다.

## 도구 {#tools}

호출 가능한 함수를 `tools`에 정의합니다. 어시스턴트가 `tool_calls`를 반환하면 애플리케이션에서 각 함수를 실행한 뒤, 일치하는 `tool_call_id`를 담은 `tool` 메시지를 추가하고 대화를 이어 갑니다.

## 구조화된 출력 {#structured-output}

JSON 객체 또는 JSON Schema 응답을 요청하려면 `response_format`을 사용합니다. 지원 여부는 모델마다 다르므로, 엄격한 스키마 적용에 의존하기 전에 선택한 모델의 기능을 확인하세요.

## 공급자별 매개변수 {#provider-specific-parameters}

SandBase는 라우팅에 `model`과 `stream`을 사용합니다. 선택한 공급자가 같은 프로토콜을 사용하면 추가 OpenAI 호환 요청 필드가 그대로 유지됩니다. SandBase가 프로토콜 간 변환을 하는 경우에는 문서화된 필드나 `extra_body`를 사용하세요. 지원 여부는 공급자마다 다릅니다.

## 오류 및 재시도 {#errors-and-retries}

재시도 가능한 `429`와 일시적인 서버 응답에 대해서는 다시 생성해도 안전한 경우에만 횟수가 제한된 백오프를 사용하세요. 잘못된 형식의 요청, 인증 실패, 도구의 부수 효과가 이미 발생했을 수 있는 요청은 자동으로 재시도하지 마세요. [오류 및 재시도](/guides/error-handling)를 참고하세요. 전체 필드와 응답 스키마는 [Chat Completions API](/api-reference/llm-gateway)를 참고하세요.
