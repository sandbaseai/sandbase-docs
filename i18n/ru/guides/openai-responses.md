---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Используйте OpenAI-совместимый Responses API с моделями GPT через SandBase.
---

# OpenAI Responses {#openai-responses}

Модели GPT поддерживают OpenAI-совместимый Responses API по адресу `POST /v1/responses`.
Используйте `input` для промптов или структурированного содержимого и читайте сгенерированные элементы из
`output`.

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Совместимость с Chat Completions {#chat-completions-compatibility}

Те же модели GPT поддерживают и `POST /v1/chat/completions`. Этот протокол
использует `messages` в запросе и `choices` в ответе, а Responses
использует `input` и `output`. Форматы параметров не взаимозаменяемы;
выберите эндпоинт, соответствующий вашему SDK.

Совместимый формат запроса описан в разделе [Chat Completions](./chat-completions), а поля и ограничения
отдельных моделей — в [справочниках моделей GPT](https://www.sandbase.ai/models).

## Дальнейшие шаги {#next-steps}

- [Справочник Responses API](/api-reference/responses)
- [Справочник Chat Completions API](/api-reference/llm-gateway)
- [Каталог Models](https://www.sandbase.ai/models)
