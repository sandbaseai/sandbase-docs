---
i18nSource: 335b45fb98c53890
title: Потоковые ответы
description: Получайте вывод моделей SandBase в потоковом режиме через OpenAI- или Anthropic-совместимые SDK и безопасно обрабатывайте частичные результаты.
---

# Потоковые ответы {#streaming-responses}

Потоковая передача возвращает вывод модели по мере готовности. SandBase сохраняет формат событий того совместимого API, который вы
вызываете: OpenAI Chat Completions использует Server-Sent Events (SSE) только с data, а Anthropic Messages — именованные SSE-события.

По возможности используйте официальный совместимый SDK. Он надёжнее обрабатывает разбиение событий, инкрементальные аргументы вызовов инструментов и
завершение протокола, чем самостоятельное разбиение сырого текста ответа.

## OpenAI Chat Completions {#openai-chat-completions}

Укажите `stream: true` в `POST /v1/chat/completions`.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

OpenAI-совместимые чанки содержат инкрементальный текст в `choices[0].delta.content`. Аргументы вызовов инструментов, если их поддерживает
выбранная модель, приходят строковыми фрагментами в `delta.tool_calls`; объединяйте фрагменты по индексу варианта и вызова инструмента,
прежде чем разбирать готовый JSON. Обычно поток завершается `data: [DONE]`.

Не рассчитывайте, что каждый провайдер возвращает использование токенов в потоке. Если выбранная модель поддерживает
`stream_options.include_usage` от OpenAI, использование может появиться ближе к концу; иначе используйте ответ без потоковой передачи или
соответствующий процесс расчёта стоимости задачи.

## Anthropic Messages {#anthropic-messages}

Используйте Anthropic SDK с `POST /v1/messages`. Вспомогательный метод потока в SDK собирает именованные события и блоки контента.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Сырые потоки Anthropic используют такие имена событий, как `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` и `message_stop`. Текст передаётся в блоках `text_delta`. Ввод инструментов использует
инкрементальные JSON-блоки, которые нужно собрать перед разбором.

## Обработка прерывания и отмены {#handle-interruption-and-cancellation}

HTTP-ошибка, возвращённая до начала потока, использует обычное тело ошибки эндпоинта. После начала ответа
сетевой сбой может оставить частичный текст без финального события. Считайте вывод завершённым только после
штатного сигнала завершения протокола.

- Храните частичный вывод отдельно от зафиксированного состояния приложения.
- Ограничивайте тайм-ауты подключения и бездействия в своём клиенте или прокси в зависимости от нагрузки.
- Когда пользователь останавливает генерацию, используйте механизм отмены SDK или `AbortController` в JavaScript.
- Не дописывайте автоматически повторный поток к частичному выводу: повтор — это новая генерация.
- Отключайте буферизацию SSE в обратных прокси, которыми вы управляете.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

При чтении сырого SSE разбирайте полные кадры событий, разделённые пустыми строками. Сетевые чанки не соответствуют SSE-событиям
один к одному, а символ UTF-8 может быть разбит между чанками. Используйте потоковый декодер текста и сохраняйте незавершённый кадр,
пока не придут новые байты.

## Связанные материалы {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Обработка ошибок](/guides/error-handling)
- [Лимиты запросов](/guides/rate-limiting)
