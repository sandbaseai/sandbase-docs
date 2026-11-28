---
i18nSource: 8c960d117a998817
title: Модели изображений и видео
description: Асинхронная генерация изображений и видео через общий Run API SandBase.
---

# Модели изображений и видео {#image-and-video-models}

Модели изображений и видео используют общий асинхронный Run API SandBase. Отправьте задачу
через `POST /v1/run`, затем опрашивайте `GET /v1/run/{id}`, пока запуск не перейдёт в
терминальный статус.

## Отправка задачи {#submit-a-task}

Используйте точный ID модели из раздела [Модели изображений и видео](https://www.sandbase.ai/models/image-video). Остальные
поля запроса зависят от модели; обязательные входные данные и ограничения см. в
справочнике API этой модели.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

Ответ содержит непрозрачный `id` и `status`, например `pending` или
`running`.

## Опрос результата {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Продолжайте опрос, пока `status` не станет `completed`, `failed` или `timeout`. Завершённые
запуски содержат выходные данные, зависящие от возможности, например URL изображения или видео. Сохраняйте
ID запуска и считайте ответ запуска достоверным источником статуса.

## Обратные вызовы через вебхуки {#webhook-callbacks}

Поддерживаемые асинхронные задачи также могут указать `webhook_url` в запросе на отправку.
Обратный вызов — подсказка о доставке, а не замена опросу; продолжайте
использовать `GET /v1/run/{id}` и безопасно обрабатывайте дублирующиеся или задержанные обратные вызовы. Общий
контракт обратных вызовов см. в разделе [Запуск возможности](/api-reference/models/run#webhook-callbacks).

## API-возможности используют путь из URL {#api-capabilities-use-a-url-derived-path}

Общий Run API предназначен для генерации моделями. API-возможности из
[каталога API](https://www.sandbase.ai/apis) используют
другой маршрут, производный от URL: `GET` или `POST /v1/api/{vendor}/{upstream_path}`.
Имя возможности с указанием вендора берётся из Models API или каталога API, поэтому
поле `model` в теле POST можно опустить:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Этот маршрут предназначен для API-возможностей и не заменяет `/v1/run` при
вызове моделей изображений или видео. Если выбранная API-возможность асинхронная,
опрашивайте возвращённый ID запуска через `GET /v1/run/{id}`.

## Дальнейшие шаги {#next-steps}

- [Модели изображений и видео](https://www.sandbase.ai/models/image-video)
- [Запуск возможности](/api-reference/models/run)
- [Получение результата запуска](/api-reference/models/run-get)
- [Прямой вызов API](/api-reference/models/api-passthrough)
