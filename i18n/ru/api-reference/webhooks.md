---
i18nSource: efd4d5f7b8980661
title: Вебхуки
description: Регистрация вебхуков SandBase для асинхронных событий моделей и управление ими.
---

# Вебхуки {#webhooks}

SandBase поддерживает два режима исходящих обратных вызовов:

- **Зарегистрированные вебхуки** привязаны к вашей организации, подписываются на асинхронные события моделей и содержат HMAC-подпись `X-Signature`.
- **Обратные вызовы модели для отдельной задачи** используют `webhook_url` в одном асинхронном запросе изображения, видео или аудио. Регистрация для них не нужна, и `X-Signature` они не содержат.

Оба режима используют доставку «как минимум один раз». Делайте обработчики идемпотентными с помощью ID события.

## Регистрация вебхука {#register-a-webhook}

Events API — публичный интерфейс, работающий с API-ключом:

```text
POST https://api.sandbase.ai/events/webhooks
```

Создавать вебхуки и управлять ими также можно на [странице Webhooks в Console](https://www.sandbase.ai/console/webhooks).

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| Поле | Тип | Обязательное | Описание |
|---|---|---:|---|
| `name` | string | Да | Понятное человеку имя. |
| `url` | string | Да | Действительный HTTP(S)-эндпоинт. В продакшене используйте HTTPS. |
| `resourceType` | `model` | Да | Выбирает перечисленные ниже асинхронные события моделей. `model` — единственное поддерживаемое значение. |
| `events` | string[] | Нет | Пустое или опущенное значение означает все текущие и будущие события выбранного типа ресурса. |
| `enabled` | boolean | Нет | По умолчанию `true`. |
| `signatureSecret` | string | Нет | Не указывайте это поле, чтобы SandBase сгенерировал секрет с высокой энтропией. Существующие клиенты могут по-прежнему передавать собственное непустое значение. |

Типы ресурсов `session`, `sandbox` и `template` выведены из использования: создание вебхука с любым из них возвращает HTTP 400. Существующие регистрации этих типов отображаются в списке для очистки: `PATCH` для них возвращает HTTP 400, если тот же запрос не меняет `resourceType` на `model` (и итоговая подписка корректна), поэтому удалите их или преобразуйте в `model`. Подписки `model` доступны только для перечисленных ниже терминальных событий асинхронной генерации изображений, видео и аудио. API отклоняет события других типов ресурсов и неизвестные имена событий.

### Успешный ответ {#successful-response}

Events API возвращает зарегистрированный вебхук напрямую. Итоговый `signatureSecret` включается только в этот ответ на создание. Сразу сохраните его в надёжном месте: ответы на получение списка и редактирование никогда его не возвращают, и восстановить его позже нельзя.

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

[Страница Webhooks в Console](https://www.sandbase.ai/console/webhooks) показывает сгенерированный секрет один раз после регистрации и требует сохранить его, прежде чем закрыть диалог.

### Список, редактирование и удаление {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Используйте ту же аутентификацию по API-ключу. `PATCH` может содержать одно или несколько полей из `name`, `url`, `resourceType`, `events` и `enabled`; опущенные поля не меняются. Итоговая подписка из `resourceType` и `events` целиком должна быть корректной. Пустой массив `events` по-прежнему означает все события этого типа ресурса.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` нельзя просмотреть или изменить через `PATCH`; запрос, содержащий это поле, отклоняется. Если секрет утерян, удалите вебхук и создайте его заново. Просматривать, редактировать, включать и отключать, а также удалять регистрации можно и на [странице Webhooks в Console](https://www.sandbase.ai/console/webhooks).

`GET` возвращает JSON-массив вебхуков (без `signatureSecret`), `PATCH` возвращает обновлённый вебхук, а `DELETE`
возвращает `204 No Content`.

### Аутентификация и ошибки {#authentication-and-errors}

Events API принимает API-ключ в виде `Authorization: Bearer $SANDBASE_API_KEY` или `X-API-Key: $SANDBASE_API_KEY`. Если
переданы оба, используется заголовок Bearer.

Ошибки имеют собственное тело, в котором HTTP-статус повторяется в `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Ветвите логику по HTTP-статусу. `401` означает, что ключ отсутствует, недействителен или отозван; `400` — что тело запроса или
подписка некорректны; `404` (`webhook not found`) — что вебхука нет в вашей организации.

## Обратный вызов модели для отдельной задачи {#per-task-model-callback}

Для одной асинхронной задачи генерации изображения, видео или аудио добавьте `webhook_url` в `POST /v1/run` вместо регистрации нового вебхука:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

Поле разбирается и проверяется, только если выбрана модель изображений, видео или аудио и запрос выполняется асинхронно. В этом случае оно должно быть непустой строкой с действительным и безопасным публичным HTTPS URL; иначе запрос возвращает HTTP 400. Для синхронных, потоковых, LLM- и других неподдерживаемых запросов SandBase игнорирует `webhook_url` независимо от его JSON-значения: обратный вызов не планируется, URL не сохраняется, и поле не передаётся провайдеру модели. Если поле опустить, сохраняется обычная схема с опросом.

Целевой адрес должен быть публичным HTTPS URL. При статусах completed, failed, timeout или cancelled SandBase отправляет тот же терминальный конверт события модели, что описан ниже, с `Content-Type: application/json` и `X-Event-ID`. Неудачная доставка может повторяться, поэтому устраняйте дубликаты по `id` или `X-Event-ID` и быстро возвращайте 2xx.

У обратного вызова для отдельной задачи нет общего секрета SandBase, поэтому он **не** содержит `X-Signature`. Если ваш эндпоинт требует проверки HMAC, не указывайте `webhook_url` и вместо этого зарегистрируйте Model Webhook организации. Вы можете поместить в query HTTPS URL непрозрачный токен доступа, сгенерированный вашей системой, и проверять его на своём эндпоинте. Считайте такой URL конфиденциальным.

Для каждой асинхронной задачи модели адресат выбирается однозначно. Если запрос содержит корректный `webhook_url`, SandBase отправляет терминальное событие этого Prediction только на URL задачи и пропускает для этого события все зарегистрированные Model Webhooks организации. Если запрос не содержит `webhook_url`, зарегистрированные Model Webhooks организации получают подходящие события как обычно. При неудачной доставке для отдельной задачи повторяется отправка на тот же URL задачи, без переключения на зарегистрированный вебхук. Этот приоритет не создаёт, не заменяет, не отключает и не изменяет регистрации и не влияет на другие события моделей.

## Типы событий {#event-types}

### Генерация моделями {#model-generation}

Вебхуки моделей доступны только для асинхронной генерации изображений, видео и аудио. Они не отправляются для синхронных запросов изображений, видео и аудио и для любых синхронных LLM-запросов: результаты таких запросов возвращаются в исходном HTTP-ответе.

| Событие | Описание |
|---|---|
| `model.generation.completed` | Асинхронная генерация изображения, видео или аудио завершена. |
| `model.generation.failed` | Асинхронная генерация изображения, видео или аудио завершилась ошибкой. |
| `model.generation.timeout` | Время асинхронной генерации изображения, видео или аудио истекло. |
| `model.generation.cancelled` | Асинхронная генерация изображения, видео или аудио отменена. |

## Полезная нагрузка доставки {#delivery-payload}

SandBase отправляет `Content-Type: application/json` и следующий JSON-конверт. `data` зависит от события, и со временем в нём могут появляться новые поля.

### Пример завершения генерации {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

События ошибки и истечения времени не содержат outputs и включают только очищенную категорию ошибки.

| Поле | Описание |
|---|---|
| `id` | Уникальный ID события. Используйте его или `X-Event-ID` как ключ идемпотентности. |
| `resourceType` | `model`. |
| `resourceID` | ID затронутого Prediction. |
| `type` | Тип события из таблицы выше. |
| `data` | Данные, зависящие от события. |
| `createdAt` | Время создания события в формате RFC 3339 UTC. |

## Проверка подписи зарегистрированного вебхука {#verify-a-registered-webhook-signature}

Каждая доставка зарегистрированного вебхука содержит следующие заголовки:

| Заголовок | Значение |
|---|---|
| `X-Event-ID` | `id` из полезной нагрузки. |
| `X-Signature` | HMAC-SHA256 необработанного тела запроса с ключом `signatureSecret` в шестнадцатеричном виде строчными буквами. |

Проверяйте подпись по необработанным байтам запроса до разбора JSON. Обратные вызовы с `webhook_url` для отдельной задачи не содержат этот заголовок и не могут использовать эту проверку. Приведённые ниже обработчики предназначены для зарегистрированных вебхуков: сначала они проверяют подпись, затем разбирают тело, используют `id` как ключ идемпотентности и передают работу асинхронной функции. Замените вызов очереди-заглушки на собственную надёжную очередь или воркер.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

Входные данные HMAC — точное необработанное тело. Не вызывайте JSON-парсер и не сериализуйте полезную нагрузку повторно перед вычислением.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Поведение доставки {#delivery-behavior}

- Ответ в диапазоне `2xx` в течение 10 секунд считается успешным.
- Сетевые ошибки, тайм-ауты и ответы не из диапазона 2xx считаются сбоями. Текущий диспетчер событий может повторять неудачную доставку; получатели должны корректно обрабатывать дублирующиеся доставки.
- Возвращайте ответ 2xx после надёжного приёма, а медленную работу выполняйте асинхронно. В примерах дедупликация в памяти используется только для того, чтобы они оставались запускаемыми; в продакшене замените её уникальным ключом в базе данных или надёжной очередью. Не рассчитывайте на доставку ровно один раз или на порядок событий.
