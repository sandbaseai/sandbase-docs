---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Создавайте, версионируйте, архивируйте и клонируйте сохранённые конфигурации Agent.
---

# Agents API {#agents-api}

Agent — это сохранённая конфигурация с версиями: модель, инструкции, профиль среды выполнения, Skills, MCP-подключения и настройки вывода. Создание или обновление Agent не запускает его. Запускайте Agent в [Session](/api-reference/sessions/).

Agents API следует протоколу OpenAI Agents (`client.beta.agents` в OpenAI Python SDK). Заголовок `OpenAI-Beta` необязателен; если вы его передаёте, он должен иметь значение `agents=v1`. SandBase добавляет версии, обновления с compare-and-set, архивирование и восстановление, а также публичный каталог.

## Операции с Agent {#agent-operations}

| Метод | Путь | Назначение |
|---|---|---|
| `POST` | `/v1/agents` | [Создание Agent](./create) версии 1 |
| `GET` | `/v1/agents` | [Список Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Получение Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Обновление Agent](./update) (частичное обновление в стиле SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Замена с compare-and-set](./replace) по `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Удаление](./delete), то есть архивирование Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Архивирование Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Разархивирование Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Восстановление прежней версии](./restore) в виде новой версии |
| `GET` | `/v1/agents/{agent_id}/versions` | [Список версий](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Получение одной версии](./get-version) |
| `GET` | `/v1/agents/catalog` | [Просмотр публичного каталога](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Клонирование Agent из каталога](./catalog#clone-a-catalog-agent) в вашу организацию |

ID Agents имеют префикс `agt_`. Тела запросов — строгий JSON размером до 1 МиБ; неизвестные поля возвращают 400.

## Версии и обновления {#versions-and-updates}

- Каждая фактическая запись (create, update, replace, restore) создаёт неизменяемую версию. `version` — номер текущей версии.
- `POST /v1/agents/{agent_id}` — это обновление из OpenAI SDK. Ему не нужен `row_version`, поэтому побеждает последняя запись.
- `PATCH /v1/agents/{agent_id}` требует `row_version`, который вы прочитали последним, и возвращает 409, если кто-то другой изменил Agent раньше. Используйте этот метод в редакторах и автоматизации, которые могут работать параллельно.
- Каждая Session фиксирует версию Agent, версии Skills и конфигурацию MCP-подключений, с которыми она была запущена.

## Готовность {#readiness}

Только что записанная версия сообщает `projection_status`, пока готовится к выполнению. Для Sessions нужен активный Agent со значением `projection_status`, равным `ready`; иначе возвращается 409. Для архивированных Agents новые запуски тоже возвращают 409.

## Текущие ограничения {#current-limits}

- `tools` принимает инструменты `function` и не более одного инструмента `web_search`. Сейчас для выполнения требуется, чтобы `web_search.mode` имел значение `disabled`.
- Function-инструменты можно сохранить, но Runs, которые просят клиента вернуть результат инструмента (`requires_action`), пока не поддерживаются и завершаются ошибкой `502 executor_contract_error`.
- Поле `multi_agent` нужно опустить или передать `null`.

## Пагинация {#pagination}

`GET /v1/agents` и каталог используют курсорную пагинацию: `limit` (1-100, по умолчанию 20), `after` и `order` (`asc` или `desc`, по умолчанию `desc`). Ответы содержат `object: "list"`, `data`, `has_more`, `first_id` и `last_id`; чтобы получить следующую страницу, передайте `last_id` в `after`.

`GET /v1/agents/{agent_id}/versions` использует пагинацию со смещением: `limit` и `offset`, а ответ содержит `data`, `total`, `limit` и `offset`.

## Ошибки {#errors}

Ошибки возвращаются в формате Agents `{"error":{"type","code","param":null,"message"}}`. Список кодов см. в разделе [Ошибки](/api-reference/errors#agents-platform-errors).
