---
i18nSource: c922bd433deabf32
title: 가이드
description: SandBase Models, APIs, Agents, 설정, 결제, 스트리밍, 프로덕션 안정성을 위한 실용 가이드입니다.
---

# 가이드 {#guides}

이 가이드는 프로덕션 환경에서 SandBase를 사용할 때의 일반적인 패턴을 다룹니다.

## 모델 호출 {#call-models}
| 가이드 | 설명 |
|-------|-------------|
| [Chat Completions](./chat-completions) | OpenAI 호환 채팅 프로토콜로 SandBase를 호출합니다 |
| [OpenAI Responses](./openai-responses) | OpenAI 호환 Responses 프로토콜로 GPT 모델을 호출합니다 |
| [Anthropic Messages](./anthropic-messages) | Anthropic 호환 messages 프로토콜로 SandBase를 호출합니다 |
| [Google Gemini](../api-reference/gemini-generate-content) | Google Gemini 호환 GenerateContent 프로토콜로 SandBase를 호출합니다 |
| [이미지와 비디오](./image-video) | 공통 비동기 Run API로 이미지와 비디오를 생성합니다 |
| [스트리밍](./streaming) | 호환 모델 출력을 애플리케이션으로 스트리밍합니다 |
| [API 카탈로그](https://www.sandbase.ai/apis) | API 기능과 벤더별 엔드포인트를 둘러봅니다 |

## 프로덕션 운영 {#run-in-production}
| 가이드 | 설명 |
|-------|-------------|
| [오류와 재시도](./error-handling) | 실패를 분류하고, 반복해도 안전한 작업만 재시도합니다 |
| [속도 제한](./rate-limiting) | 429 응답을 처리하고 요청 급증을 완화합니다 |
| [동시 실행 한도](./concurrency-limits) | 조직이 동시에 실행할 수 있는 작업 수 |
| [가격과 사용량](./billing) | 크레딧, 사용량, 비용 관리를 이해합니다 |

## 빠른 팁 {#quick-tips}

- 사용자가 Codex, Claude, Cursor, Kiro 안에서 도구를 사용하려면 [설정](/setup/)을 사용하세요.
- 앱에 필요한 기능이 하나라면 [Models](https://www.sandbase.ai/models) 또는 [APIs](https://www.sandbase.ai/apis)를 사용하세요.
- 작업이 여러 단계로 이루어지거나 재사용해야 한다면 [Build Agent](/agents/)를 사용하세요.
- 요청과 사용량을 함께 검토하려면 Console의 [Activities](https://www.sandbase.ai/console/activities)를 사용하세요.
