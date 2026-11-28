---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Загружайте пакеты Skills с версиями и подключайте их к Agents.
---

# Skills API {#skills-api}

Skill — это ZIP-пакет с версиями, содержащий инструкции и ресурсы, которые Agent может подключить. ID Skills имеют префикс `skl_`, а идентификаторы версий — строки, например `"1"`.

## Операции со Skills {#skill-operations}

| Метод | Путь | Назначение |
|---|---|---|
| `POST` | `/v1/skills` | [Создание Skill](./create) из загруженного ZIP |
| `GET` | `/v1/skills` | [Список Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Получение Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Обновление](./update) версии по умолчанию, статуса или метаданных |
| `DELETE` | `/v1/skills/{skill_id}` | [Удаление Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Скачивание ZIP версии по умолчанию |
| `GET` | `/v1/skills/{skill_id}/versions` | [Список версий](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Загрузка версии](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Получение версии](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Скачивание ZIP версии |
| `GET` | `/v1/skills/catalog` | [Просмотр публичных Skills](./catalog) |

## Настройка за пять минут {#five-minute-setup}

1. Создайте папку с файлом `SKILL.md`, во frontmatter которого заданы `name` и `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Упакуйте её в ZIP (`zip -r release-notes.zip release-notes/`). Размер архива — не более 5 МиБ.
3. Загрузите его как единственную multipart-часть `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Сошлитесь на него из Agent с помощью [обновления Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

При первом подключении Skill значение `"version": null` (или отсутствие `version`) при сохранении Agent разрешается в текущую `default_version`. Сохранённый Agent содержит явную версию. Изменение версии Skill по умолчанию не обновляет существующий Agent. Чтобы обновить его, измените массив `skills`, указав явную версию, например `"2"`; передача `null` для существующей привязки сохраняет закреплённую версию. Каждая Session использует сохранённую версию Agent и сообщает разрешённые Skills в `environment.skills`.

Agent поддерживает до 32 Skills. ID и имена Skills в его наборе должны быть уникальными.

## Версии {#versions}

- Загрузка в `POST /v1/skills/{skill_id}/versions` добавляет следующую версию. Передайте поле формы `default=true`, чтобы сделать её версией по умолчанию.
- `POST /v1/skills/{skill_id}` с `default_version` переключает версию по умолчанию без загрузки.
- `status` принимает значения `active` или `disabled`. Новые Sessions Agent, который ссылается на отключённый Skill, завершаются ошибкой `400 skill_not_found`; Sessions, уже зафиксировавшие версию, сохраняют её.
- Skill, на который ссылается любая версия Agent, нельзя удалить (409). Вместо этого отключите его. Удаление Skill из последней версии Agent не убирает ссылки в предыдущих версиях.

## Пагинация и ошибки {#pagination-and-errors}

Списки используют курсорную пагинацию с `limit` от 0 до 100, `after` и `order`. Ошибки возвращаются в [формате ошибок Agents](/api-reference/errors#agents-platform-errors).

## Скачивание пакета {#download-a-bundle}

Эндпоинты содержимого возвращают `application/zip`, а не JSON. Сохраните ответ в файл:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Для текущей версии по умолчанию используйте `/v1/skills/{skill_id}/content`. Для пакетов из публичного каталога используйте `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Списки версий используют те же параметры курсора, что и списки Skills. Передавайте возвращённый `last_id` (например, `skl_…:2`) в `after`; не передавайте просто номер версии.
