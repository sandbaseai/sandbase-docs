---
i18nSource: fb62188053fb216d
title: Прямой вызов API
description: Вызов включённых API-возможностей каталога по путям с указанием вендора.
aside: false
outline: false
apiReference:
  title: Прямой вызов API
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Разрешает включённую возможность каталога с именем vendor/upstream_path и выполняет JSON-объект через единый конвейер SandBase. Для возможностей, которые его используют, поддерживается также GET.
  groups:
    - title: Параметры пути
      fields:
        - name: vendor
          type: string
          required: true
          description: Первый сегмент имени возможности.
        - name: upstream_path
          type: string
          required: true
          description: Оставшаяся часть пути
          including literal slash-separated segments when present.: null
    - title: Тело запроса
      fields:
        - name: model
          type: string
          required: false
          description: Не указывайте, чтобы использовать идентификатор vendor/path из URL. Если указано
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Поля, определённые актуальной схемой выбранной возможности.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

URL разрешается во включённую модель с именем `vendor/upstream_path`. Используйте точное имя с указанием вендора, которое возвращает [Models API](./). Вложенные имена возможностей остаются буквальными сегментами пути, а не косыми чертами в percent-кодировке.

POST принимает только JSON-объект. Пустое тело POST допускается и ведёт себя как объект, содержащий модель из URL. GET использует пустое тело. Поля ответа, а также синхронное или асинхронное поведение зависят от выбранной возможности; асинхронные результаты опрашивайте через `GET /v1/run/{id}`.
