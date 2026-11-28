---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: SandBase를 통해 GPT 모델에서 OpenAI 호환 Responses API를 사용합니다.
---

# OpenAI Responses {#openai-responses}

GPT 모델은 `POST /v1/responses`에서 OpenAI 호환 Responses API를 지원합니다.
프롬프트나 구조화된 콘텐츠는 `input`에 넣고, 생성된 항목은
`output`에서 읽습니다.

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Chat Completions 호환성 {#chat-completions-compatibility}

같은 GPT 모델은 `POST /v1/chat/completions`도 지원합니다. 이 프로토콜은
요청에 `messages`, 응답에 `choices`를 사용하며, Responses는
`input`과 `output`을 사용합니다. 두 매개변수 구조는 서로 바꿔 쓸 수 없으므로
사용하는 SDK에 맞는 엔드포인트를 선택하세요.

호환 요청 형식은 [Chat Completions](./chat-completions)를,
모델별 필드와 제한은 [GPT 모델 레퍼런스](https://www.sandbase.ai/models)를
참고하세요.

## 다음 단계 {#next-steps}

- [Responses API 레퍼런스](/api-reference/responses)
- [Chat Completions API 레퍼런스](/api-reference/llm-gateway)
- [Models 카탈로그](https://www.sandbase.ai/models)
