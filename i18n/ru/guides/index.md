---
i18nSource: c922bd433deabf32
title: Руководства
description: Практические руководства по использованию Models, APIs, Agents и Setup в SandBase, биллингу, потоковой передаче и надёжности в продакшене.
---

# Руководства {#guides}

Эти руководства описывают типовые подходы к использованию SandBase в продакшене.

## Вызов моделей {#call-models}
| Руководство | Описание |
|-------|-------------|
| [Chat Completions](./chat-completions) | Вызов SandBase через OpenAI-совместимый чат-протокол |
| [OpenAI Responses](./openai-responses) | Вызов моделей GPT через OpenAI-совместимый протокол Responses |
| [Anthropic Messages](./anthropic-messages) | Вызов SandBase через Anthropic-совместимый протокол messages |
| [Google Gemini](../api-reference/gemini-generate-content) | Вызов SandBase через Google Gemini-совместимый протокол GenerateContent |
| [Изображения и видео](./image-video) | Генерация изображений и видео через общий асинхронный Run API |
| [Потоковая передача](./streaming) | Потоковая передача вывода совместимых моделей в ваше приложение |
| [Каталог API](https://www.sandbase.ai/apis) | Обзор возможностей API и их эндпоинтов с указанием поставщика |

## Работа в продакшене {#run-in-production}
| Руководство | Описание |
|-------|-------------|
| [Ошибки и повторные попытки](./error-handling) | Классификация сбоев и повтор только безопасных для повторения операций |
| [Ограничения частоты](./rate-limiting) | Обработка ответов 429 и сглаживание всплесков запросов |
| [Лимиты параллельности](./concurrency-limits) | Сколько задач ваша организация может выполнять одновременно |
| [Цены и использование](./billing) | Кредиты, использование и контроль расходов |

## Полезные советы {#quick-tips}

- Используйте [Setup](/setup/), если пользователю нужны инструменты внутри Codex, Claude, Cursor или Kiro.
- Используйте [Models](https://www.sandbase.ai/models) или [APIs](https://www.sandbase.ai/apis), если вашему приложению нужна одна возможность.
- Используйте [Build Agent](/agents/), если работа состоит из нескольких шагов или должна использоваться повторно.
- Используйте [Activities](https://www.sandbase.ai/console/activities) в Console, чтобы просматривать запросы и использование вместе.
