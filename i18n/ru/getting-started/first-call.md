---
i18nSource: 0ca53876f04eb96d
title: Первый вызов API
description: "Подробное руководство по первому вызову API SandBase: структура запроса, структура ответа и потоковая передача."
---

# Первый вызов API {#first-api-call}

В этом руководстве подробно разбирается структура запроса и ответа API SandBase. Прочитав его, вы будете понимать каждое поле тела запроса, сможете читать ответ и использовать потоковую передачу.

## Перед началом {#before-you-start}

Вам понадобятся активная организация SandBase, [API-ключ](/getting-started/api-keys) и ID модели из [каталога моделей](https://www.sandbase.ai/models). Экспортируйте ключ, чтобы примеры не размещали секреты в исходном коде:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Начните с запроса без потоковой передачи. Когда аутентификация и обработка ответа заработают, добавьте потоковую передачу и логику повторных попыток для продакшена.

## Структура запроса {#request-anatomy}

В этом разборе используется OpenAI-совместимый маршрут Chat Completions:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Обязательные заголовки {#required-headers}

| Заголовок | Значение | Описание |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | Ваш API-ключ SandBase |
| `Content-Type` | `application/json` | Формат тела запроса |

### Тело запроса {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Параметры тела {#body-parameters}

| Параметр | Тип | Обязательно | Описание |
|-----------|------|----------|-------------|
| `model` | string | Да | ID включённой модели, возвращаемый `GET /v1/models` (например, `deepseek/deepseek-v4-flash`) |
| `messages` | array | Да | История диалога в виде массива объектов сообщений |
| `temperature` | number | Нет | Температура сэмплирования (0–2). Поддержка и значения по умолчанию зависят от модели. |
| `max_tokens` | integer | Нет | Максимальное количество токенов в ответе |
| `top_p` | number | Нет | Параметр nucleus-сэмплирования (0–1) |
| `stream` | boolean | Нет | Передавать ли ответ потоком. По умолчанию: `false` |
| `stop` | string или array | Нет | Стоп-последовательности — генерация останавливается, когда они встречаются |
| `frequency_penalty` | number | Нет | Штраф за повторения, совместимый с провайдером, если поддерживается |
| `presence_penalty` | number | Нет | Штраф за присутствие, совместимый с провайдером, если поддерживается |

### Роли сообщений {#message-roles}

| Роль | Назначение |
|------|---------|
| `system` | Задаёт поведение и характер ассистента |
| `user` | Ввод человека |
| `assistant` | Предыдущие ответы ассистента (для многоходовых диалогов) |
| `developer`, `tool` | Дополнительные OpenAI-совместимые роли, если их поддерживают выбранная модель и маршрут |

## Полный пример запроса {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Структура ответа {#response-structure}

### Типичный ответ без потоковой передачи {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Описание полей ответа {#response-fields-explained}

| Поле | Описание |
|-------|-------------|
| `id` | Уникальный идентификатор этого completion |
| `object` | OpenAI-совместимый объект ответа, на этом маршруте обычно `"chat.completion"` |
| `created` | Unix-метка времени генерации ответа |
| `model` | Модель, сгенерировавшая ответ |
| `choices` | Массив вариантов completion (обычно один) |
| `choices[].index` | Индекс этого варианта в массиве |
| `choices[].message.role` | Роль сгенерированного сообщения, обычно `"assistant"` |
| `choices[].message.content` | Сгенерированный текст |
| `choices[].finish_reason` | Причина остановки генерации (см. ниже) |
| `usage.prompt_tokens` | Токены во входных данных |
| `usage.completion_tokens` | Токены в сгенерированном выводе |
| `usage.total_tokens` | Сумма токенов prompt и completion |

### Причины завершения {#finish-reasons}

Причины завершения зависят от провайдера. Распространённые OpenAI-совместимые значения:

| Значение | Типичное значение |
|-------|---------|
| `stop` | Естественное завершение ответа или достигнута стоп-последовательность |
| `length` | Достигнут лимит `max_tokens` — ответ обрезан |

Считайте неизвестные значения допустимым выводом провайдера и не отклоняйте ответ.

## Потоковые ответы {#streaming-responses}

Для вывода в реальном времени (как печатающий чат-бот) используйте потоковую передачу. Ответ приходит в виде Server-Sent Events (SSE):

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Формат потоковых SSE {#streaming-sse-format}

Совместимый поток обычно отправляет такие Server-Sent Events:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Главное:

- обрабатывайте чанки по порядку и дописывайте фрагменты `delta.content`
- допускайте чанки только с метаданными, пустые дельты и незнакомые вам поля, совместимые с провайдером
- останавливайтесь, когда поток закрывается или приходит его конечный маркер; в Chat Completions обычно это `data: [DONE]`
- не рассчитывайте, что все модели отправляют первый и последний чанки одинаковой формы

## Использование Anthropic SDK {#using-the-anthropic-sdk}

SandBase также предоставляет Anthropic-совместимый эндпоинт `POST /v1/messages`. Используйте Anthropic SDK, изменив `base_url`:

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Структура ответа Anthropic {#anthropic-response-structure}

Anthropic-совместимый эндпоинт возвращает ответ в стиле Anthropic. Типичный текстовый ответ выглядит так:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Поле | Описание |
|-------|-------------|
| `id` | ID сообщения (с префиксом `msg_`) |
| `type` | Тип объекта сообщения, обычно `"message"` |
| `role` | Роль сгенерированного сообщения, обычно `"assistant"` |
| `content` | Массив типизированных блоков контента; не рассчитывайте, что каждый блок — текст |
| `model` | Модель, сгенерировавшая ответ |
| `stop_reason` | `"end_turn"` (естественная остановка), `"max_tokens"` (достигнут лимит) или `"stop_sequence"` |
| `usage.input_tokens` | Токены во входных данных |
| `usage.output_tokens` | Токены в сгенерированном выводе |

### Потоковая передача Anthropic {#anthropic-streaming}

Потоковая передача в Anthropic SDK работает так же — просто передайте `stream=True`:

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Выбор модели {#choosing-a-model}

При выборе модели проверяйте её актуальную карточку: доступность, цены, длину контекста, поддерживаемые входные данные и возможности. Эти значения меняются независимо друг от друга, поэтому не полагайтесь на скопированное сравнение моделей.

- Просмотрите актуальный [каталог моделей](https://www.sandbase.ai/models).
- Откройте страницу модели в каталоге, чтобы узнать её специфичные поля запроса.
- Запрашивайте `GET /v1/models`, если интеграции нужны актуальные метаданные моделей программно.

Для моделей с одинаковым совместимым интерфейсом переключение обычно начинается с параметра `model`. Прежде чем переносить необязательные поля, инструменты, медиавходы или настройки структурированного вывода, перепроверьте возможности и схему выбранной модели.

## Дальнейшие шаги {#next-steps}

Перед выходом в продакшен задайте тайм-ауты запросов, повторяйте только временные сбои с ограниченной экспоненциальной задержкой, логируйте ID запросов, если они доступны, и отслеживайте использование, не записывая в логи промпты и API-ключи.

- [**Справочник API**](/api-reference/) — эндпоинты инференса и контракты Platform API
- [**Руководство по потоковой передаче**](/guides/streaming) — продвинутые сценарии потоковой передачи и обработка ошибок
- [**Модели**](https://www.sandbase.ai/models) — поиск моделей, возможности и актуальные цены
- [**Ошибки**](/guides/error-handling) — обработка сбоев и повторные попытки
