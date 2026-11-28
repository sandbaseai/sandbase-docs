---
i18nSource: b95a8cd6f82c3a9a
title: Модели и цены для ИИ
description: Поиск актуальных моделей SandBase, их возможностей, схем и цен через Models API.
---

# Модели и цены {#models-pricing}

Все модели доступны с одним API-ключом SandBase. Доступность моделей, схемы, возможности, лимиты контекста
и цены могут меняться независимо друг от друга.

::: info Используйте актуальные метаданные моделей
Для актуальных и достоверных данных всегда используйте `GET /v1/models` и `GET /v1/models/{id_or_name}`. Не считайте, что каждая
LLM поддерживает потоковую передачу, зрение, инструменты, структурированный вывод или кэширование, и не переносите входные поля или
цены одной модели на другую.
:::

## Ответы каталога и сведений о модели {#catalog-and-detail-responses}

`GET /v1/models` возвращает OpenAI-совместимые идентификационные записи с полями `id`, `object`, `created` и `owned_by`.
Метаданные SandBase о возможностях, схеме и ценах в них намеренно не включены.

`GET /v1/models/{id_or_name}` добавляет `unified_schema`, `supported_modes` и `model_card`. Подробные цены читайте в
`model_card`; объекта `pricing` верхнего уровня нет. Считайте `capability_tags`, `supported_modes` и
`unified_schema` специфичными для модели.

## Поиск моделей {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Эндпоинт списка поддерживает `q`, `vendor`, `type` и `order`; пагинации нет, по умолчанию используется `type=llm`.
Он возвращает OpenAI-совместимые элементы с `id`, `object`, `created` и `owned_by`. Используйте возвращённый `id` как
имя модели при запросе сведений или вызове модели.

Для любого асинхронного ответа `202` опрашивайте `GET /v1/run/{id}` с возвращённым ID. Считайте ID непрозрачным: не
делайте выводов о его формате и не составляйте другой путь опроса по префиксу ID или заголовку совместимости.

## Сведения об одной модели {#inspect-one-model}

Имена моделей содержат вендора и могут включать `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Перед выполнением проверьте:

- `enabled` и `execution_mode`
- `capability_tags` и `supported_modes`
- `unified_schema` — допустимые поля запроса
- `model_card` — текущую формулу цены и множители для токенов или кэша

## Проверка фактической стоимости задачи {#check-actual-task-cost}

Для завершённой или выполняющейся задачи запрашивайте записанную стоимость, а не пересчитывайте её по устаревшей таблице:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Контракты ответов см. в [справочнике Models API](/api-reference/models/), а рекомендации по форматам ответов и повторам — в
[Руководстве по ошибкам](/for-agents/errors).
