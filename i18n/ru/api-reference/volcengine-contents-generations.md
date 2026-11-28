---
i18nSource: 4bd032d88bac0470
title: Видео Seedance (протокол Volcengine Ark)
description: "Генерация видео Seedance 2.0 и 2.5 через протокол задач Volcengine Ark Contents Generations: входные данные, опрос, биллинг и медиа-Assets."
aside: false
outline: false
apiReference:
  title: Видео Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Отправка задачи на генерацию видео Seedance. Успешная отправка возвращает HTTP 200 и id задачи SandBase.
  groups:
    - title: Тело запроса
      fields:
        - name: model
          type: string
          required: true
          description: "Поддерживаемый идентификатор модели: bytedance/seedance/2.0-official или bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Типизированный текст и необязательные медиаданные. Формат элементов проверяет модель.
        - name: duration
          type: integer
          required: false
          description: Передаётся модели без изменений. Применяется валидация модели.
        - name: resolution
          type: string
          required: false
          description: Передаётся модели без изменений. Применяется валидация модели.
        - name: ratio
          type: string
          required: false
          description: Передаётся модели без изменений. Применяется валидация модели.
        - name: generate_audio
          type: boolean
          required: false
          description: Передаётся модели без изменений. Запрашивает генерацию аудио, если она поддерживается.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Руководство по Seedance {#seedance-guide}

Seedance генерирует видео по тексту, начальному и конечному кадрам, а также по мультимодальным референсам: изображениям, видео и
аудио. Используйте его для любых задач: от простого клипа по тексту до режиссированного кадра с заданным визуальным объектом, движением
камеры и звуковой дорожкой.

Генерация асинхронная. Отправьте задачу, затем опрашивайте её, пока она не перейдёт в финальный статус.

## Выбор модели {#choosing-a-model}

| `model` | Лучше всего подходит для | Разрешения вывода |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Выдачи в 1080p и максимально доступного разрешения | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Более дешёвой генерации, когда достаточно 480p или 720p | 480p, 720p |

Обе модели принимают одинаковые мультимодальные входные данные и поддерживают сценарии text-to-video, image-to-video и мультимодальные референсы
в едином формате запроса. Выбирайте `2.0-official`, если вам достаточно 480p или 720p и нужен более дешёвый
вариант. Выбирайте `2.5-official`, если нужно 1080p.

## Справочник API {#api-reference}

| Метод | Путь |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Получение списка задач, а также отмена и удаление задачи не поддерживаются. Сохраните возвращённый `id` задачи, чтобы получить результат.

Аутентифицируйте каждый запрос тем же API-ключом, которым была создана задача:

```
Authorization: Bearer $SANDBASE_API_KEY
```

Значение `model` должно совпадать с одним из имён в разделе [Выбор модели](#choosing-a-model). Поддерживаемый способ получения
результатов — опрос; не полагайтесь на `callback_url` для этого эндпоинта.

## Быстрый старт {#quickstart}

Отправьте задачу:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Опрашивайте задачу с этим id каждые 5–10 секунд, пока `status` не станет `succeeded`, `failed`, `expired` или `cancelled`:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

Сгенерированное видео доступно по адресу `content.video_url`.

## Выбор сценария ввода {#choose-an-input-workflow}

API поддерживает семь распространённых сценариев ввода. У каждого элемента в `content` есть `type`; сочетание типов элементов и
ролей определяет сценарий:

| Цель | Сочетание в `content` | Когда использовать |
| --- | --- | --- |
| Видео по тексту | Текст | Сцену можно полностью описать в промпте |
| Анимация начального кадра | Текст (необязательно) + изображение с `first_frame` | Первый кадр должен совпадать с переданным изображением |
| Переход между двумя кадрами | Текст (необязательно) + `first_frame` + `last_frame` | Кадру нужны контролируемые начало и конец |
| Следование визуальному референсу | Текст (необязательно) + изображение с `reference_image` | Объект, продукт, костюм или визуальный стиль должны оставаться узнаваемыми |
| Следование движению или языку камеры | Текст (необязательно) + видео с `reference_video` | Движение, тайминг, ритм монтажа или движение камеры берутся из референсного клипа |
| Добавление аудиореференса | Текст/изображение/видео + аудио с `reference_audio` | Результат должен опираться на диалог, музыку, голос или звуковой дизайн |
| Полная мультимодальная режиссура | Текст + референсы изображения, видео и аудио | Разные материалы управляют внешним видом, движением и звуком в одном кадре |

Аудио не может использоваться отдельно. Каждый запрос с аудиоэлементом должен также содержать хотя бы один текстовый элемент, изображение или видео.

### Формат элементов content {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` определяет, как модель должна использовать материал:

| Материал | `role` | Эффект |
| --- | --- | --- |
| Изображение | `first_frame` | Изображение используется как начальный кадр |
| Изображение | `last_frame` | Изображение используется как конечный кадр; добавьте в тот же запрос `first_frame` |
| Изображение | `reference_image` | Референс для объекта, композиции, продукта, костюма или визуального стиля |
| Видео | `reference_video` | Референс для движения, работы камеры, тайминга или ритма монтажа |
| Аудио | `reference_audio` | Референс для голоса, диалога, музыки или звукового дизайна |

Элементы изображений принимают публичный URL или встроенное значение `data:image/...;base64,...`. Для видео- и аудиореференсов следует
использовать публичные URL, которые модель может скачать.

Любой элемент `video_url` переводит запрос в режим video-to-video, что меняет тариф за токены. См.
[Биллинг](#billing).

## Типовые рецепты {#common-recipes}

В примерах ниже показаны тела запросов. Отправляйте любое из них на эндпоинт создания задачи из раздела [Быстрый старт](#quickstart).

### Анимация первого кадра {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### Переход от первого кадра к последнему {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Режиссура кадра с референсами изображения, видео и аудио {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Используйте промпт, чтобы назначить каждому референсу понятную задачу, например: «сохрани внешний вид продукта с изображения, используй
движение камеры из видео и следуй темпу аудио». Это надёжнее, чем просить каждый материал
управлять всем результатом.

## Как написать эффективный промпт {#writing-an-effective-prompt}

Практичный промпт обычно строится в таком порядке:

1. **Объект** — кто или что находится в кадре.
2. **Действие** — что меняется или движется.
3. **Сцена** — место, время суток, погода и окружающие детали.
4. **Визуальный стиль** — кинематографичный, документальный, рекламный ролик продукта, анимация и т. д.
5. **Камера** — кадрирование, ощущение объектива, движение камеры и склейки.
6. **Звук** — диалог, атмосфера, музыка или эффекты, если включён `generate_audio`.

Явно указывайте, что должно оставаться неизменным. Например: «Этикетка продукта остаётся читаемой, камера делает один медленный
наезд, без смены сцен, естественный фон помещения». Если референсов несколько, опишите, какое визуальное качество или движение
брать из каждого.

## Параметры вывода {#output-options}

| Параметр | Тип | По умолчанию | Значения |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` не поддерживает `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` выбирает соотношение по входным данным и промпту |
| `duration` | integer | `5` | От 4 до 15 секунд или `-1`, чтобы модель выбрала длительность в поддерживаемом диапазоне |
| `generate_audio` | boolean | `true` | Генерация синхронизированного голоса, звуковых эффектов и фоновой музыки |
| `seed` | integer | `-1` | От `-1` до `2^32-1`. Один и тот же промпт и seed дают похожий, но не идентичный результат |
| `watermark` | boolean | `false` | Добавить водяной знак о генерации ИИ в правый нижний угол |
| `tools` | array | `[]` | `[{"type": "web_search"}]` включает веб-поиск при планировании кадра |

### Управление задачей {#task-control}

| Параметр | Тип | По умолчанию | Примечания |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Тайм-аут задачи в секундах, от 3600 до 259200. Задача, превысившая его, получает статус `expired` |
| `service_tier` | string | `default` | Эти модели не поддерживают `flex` |
| `safety_identifier` | string | — | Непрозрачный идентификатор конечного пользователя, не более 64 символов. Передавайте хеш, а не исходные персональные данные |

### Размер кадра {#frame-size}

`resolution` и `ratio` вместе определяют размеры в пикселях:

| Разрешение | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Статус задачи {#task-status}

| `status` | Значение | Что делать |
| --- | --- | --- |
| `queued` | Принята, ожидает запуска | Продолжайте опрашивать каждые 5–10 секунд |
| `running` | Идёт генерация | Продолжайте опрашивать |
| `succeeded` | Готово | Скачайте `content.video_url` |
| `failed` | Отклонена модерацией контента или произошла ошибка модели | Прочитайте `error.message`. Измените промпт перед повтором |
| `expired` | Превышено `execution_expires_after` | Отправьте заново |
| `cancelled` | Завершена до начала генерации | Отправьте заново |

### Поля задачи {#task-fields}

| Поле | Тип | Примечания |
| --- | --- | --- |
| `id` | string | id задачи, возвращённый при отправке |
| `model` | string | Отправленное вами значение `model` |
| `status` | string | См. выше |
| `created_at` | integer | Секунды Unix |
| `updated_at` | integer | Секунды Unix. Совпадает с `created_at`, пока задача не завершится |
| `content` | object | Пусто, пока задача не выполнится успешно. Содержит сгенерированный `video_url` |
| `usage` | object | Количество токенов. См. [Биллинг](#billing) |
| `error` | object | Присутствует для `failed` и `expired`. Содержит `code` и `message` |

### Полный пример на Python {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Биллинг {#billing}

Эти модели тарифицируются по `usage.completion_tokens`, которые задача сообщает по завершении. Тариф за токены зависит от двух
факторов:

- **Есть ли во входных данных видео.** Запросы video-to-video, то есть с любым элементом `content` типа `video_url`, тарифицируются
  ниже, чем text-to-video.
- **Разрешение вывода.** Для `2.5-official` 1080p стоит дороже, чем 480p и 720p. Тариф `2.0-official` не зависит
  от разрешения.

`usage` содержит `completion_tokens` и `total_tokens`, которые сейчас совпадают. Пока задача выполняется, поле пустое.
Фактические списания смотрите в [истории аккаунта](/api-reference/account/history), а актуальные тарифы — в
[руководстве по ценам](/guides/billing).

## Ошибки {#errors}

Недопустимый запрос сразу возвращает ошибку. Ошибка во время генерации появляется в задаче при опросе. В обоих случаях используется
объект `error` с машиночитаемым `code` и понятным человеку `message`:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Типовые шаги восстановления:

| Результат | Что попробовать |
| --- | --- |
| `400 InvalidParameter` | Проверьте имя модели, обязательное содержимое, роли, разрешение, длительность и URL материалов |
| Статус задачи `failed` с ошибкой модерации контента | Перепишите промпт или замените помеченный референсный материал перед повторной отправкой |
| Статус задачи `expired` | Отправьте новую задачу; для высокого разрешения или длинных клипов рассмотрите увеличение `execution_expires_after` |
| `429 RateLimitExceeded` | Повторите с экспоненциальной задержкой и сократите число одновременных отправок |
| `503 ServiceUnavailable` | Повторите тот же запрос после короткой паузы |

## Использование зарегистрированных медиа-Assets {#use-registered-media-assets}

SandBase предоставляет совместимый с официальным протокол Asset по адресу `/v1/assets`. Запрос Asset и возвращаемая ссылка `asset://`
соответствуют официальному протоколу, а ссылка передаётся без изменений в нативном запросе ByteDance Contents
Generations. Обе модели,
`bytedance/seedance/2.5-official` и `bytedance/seedance/2.0-official`, принимают такую ссылку
там, где обычно принимают публичный HTTP(S) URL.

Полный процесс:

1. Зарегистрируйте доступный URL медиафайла через `POST /v1/assets`.
2. Запрашивайте `GET /v1/assets/{external_id}`, пока провайдер не сообщит, что Asset готов к использованию.
3. Укажите возвращённый `asset_url` в элементе `content` Seedance и отправьте задачу на генерацию.

### Операции Asset, совместимые с официальным протоколом {#official-compatible-asset-operations}

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/v1/assets` | Зарегистрировать доступный URL медиафайла и получить совместимую с официальным протоколом ссылку `asset://` |
| `GET` | `/v1/assets/{external_id}` | Прочитать статус у провайдера и получить текущий URL для предпросмотра/скачивания |

Сейчас публичный API предоставляет только регистрацию и получение. Группы Assets, получение списка, переименование, обновление и удаление
не являются публичными операциями. Assets принадлежат организации, связанной с API-ключом.

### Шаг 1: зарегистрируйте Asset {#step-1-register-the-asset}

Отправьте доступный URL на `POST /v1/assets`. `asset_type` чувствителен к регистру и должен быть `Image`, `Video` или `Audio`:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Сохраните `asset_url` из ответа:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Значение после `asset://` — это `external_id`, который используется в совместимой с официальным протоколом операции получения.

### Шаг 2: проверьте готовность {#step-2-check-readiness}

Запросите Asset по `external_id` без префикса `asset://`:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Считайте `status` открытым значением провайдера, а не исчерпывающим перечислением. Дождитесь, пока провайдер сообщит о пригодном
состоянии, прежде чем отправлять задачу на генерацию; распространённое значение готовности — `Active`. `download_url` управляется провайдером и
может быть пустым во время обработки. Запросите Asset снова, когда нужен актуальный URL для предпросмотра. В запросах Seedance продолжайте использовать постоянный
`asset_url`, а не копируйте `download_url`.

### Шаг 3: генерируйте с Asset {#step-3-generate-with-the-asset}

Укажите `asset_url` в поле URL, соответствующем типу медиа. В этом примере зарегистрированное изображение используется как визуальный
референс:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

Ответ на создание возвращает `id` задачи. Опрашивайте
`GET /api/v3/contents/generations/tasks/{task_id}`, как описано на странице выбранной модели.

### Выбор элемента content и роли {#choose-the-content-item-and-role}

| Тип Asset | `content[].type` | Поле URL | Поддерживаемая роль | Назначение |
| --- | --- | --- | --- | --- |
| Изображение | `image_url` | `image_url.url` | `first_frame` | Начать видео именно с этого кадра |
| Изображение | `image_url` | `image_url.url` | `last_frame` | Закончить этим кадром; добавьте в тот же запрос `first_frame` |
| Изображение | `image_url` | `image_url.url` | `reference_image` | Сохранить объект, продукт, композицию, костюм или визуальный стиль |
| Видео | `video_url` | `video_url.url` | `reference_video` | Следовать движению, таймингу, работе камеры или ритму монтажа |
| Аудио | `audio_url` | `audio_url.url` | `reference_audio` | Следовать голосу, диалогу, музыке или звуковому дизайну |

Аудио не может быть единственным входом. Сочетайте Asset с `reference_audio` с текстом, изображением или видео. Любой запрос,
содержащий `video_url`, тарифицируется по ставке video-to-video.

#### Пример Asset с видео {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Пример Asset с аудио {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### Прямой URL или ссылка `asset://`? {#direct-url-or-asset-reference}

| Вход | Когда лучше | Компромисс |
| --- | --- | --- |
| Публичный HTTP(S) URL | Медиафайл уже размещён и используется один раз | Самый быстрый путь, но URL должен оставаться доступным до отправки задачи и загрузки провайдером |
| Ссылка `asset://` | Медиафайл используется повторно через официальный протокол Asset | Добавляет шаг регистрации и проверки готовности, но даёт постоянную ссылку для последующих задач Seedance |

Параметры запроса, опрос, статусы задач и биллинг описаны выше в [руководстве по Seedance](#seedance-guide).

## Официальные ресурсы ByteDance {#official-bytedance-resources}
- [Документация по генерации видео Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API создания задачи contents generation](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Руководство по промптам для Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
