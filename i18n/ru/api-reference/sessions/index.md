---
i18nSource: 99170a141af66587
title: Sessions API
description: Запуск сохранённой версии Agent, отправка ввода, потоковая передача событий и чтение истории сессии.
---

# Sessions API {#sessions-api}

Сессия выполняет одну сохранённую версию [Agent](/api-reference/agents/) в облаке SandBase; среду выполнения выбирать не нужно. ID сессий имеют префикс `ses_`. Сессии — подресурс Agents: каждый путь начинается с `/v1/agents/sessions`.

Стандартные операции следуют протоколу OpenAI Agents (`client.beta.agents.sessions`); что официальный SDK умеет и чего не умеет, см. в разделе [Совместимость с OpenAI](/agents/openai-compatibility). Расширения SandBase добавляют переименование, состояние архивирования, отмену, вложения, метаданные файлов рабочего пространства, неизменяемые артефакты и поток с возможностью переподключения.

::: info Откуда берутся сессии
Сессия создаётся напрямую через `POST /v1/agents/sessions`. Такая сессия возвращает `source: "direct"` и `source_id: null`.
:::

## Рекомендуемый порядок работы {#recommended-flow}

1. [Создайте сессию](./create) для сохранённого Agent. Сессия фиксирует выбранную версию Agent и MCP-подключения и использует версии Skills, уже закреплённые за этой версией Agent.
2. [Откройте поток событий](./stream) через `GET /v1/agents/sessions/{session_id}/events`. Поток передаёт только события в реальном времени, поэтому открывайте его до отправки ввода.
3. [Отправьте ввод](./send-events) через `POST /v1/agents/sessions/{session_id}/events` с событием `agent.session.input.message`. Вызов возвращает 202.
4. Читайте результаты из потока или позже из [элементов](./items) и [ходов](./turns).

## Операции с сессиями {#session-operations}

| Метод | Путь | Назначение |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Создать сессию](./create) |
| `GET` | `/v1/agents/sessions` | [Список сессий](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Получить сессию](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Заменить метаданные](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Переименовать](./rename) с `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Удалить](./delete), то есть архивировать сессию |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Отправить одно событие ввода или отмены](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Поток событий в реальном времени](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Список элементов](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Список ходов](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Получить один ход](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Отменить выполняющийся ход](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Архивировать](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Разархивировать](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Переподключиться](./reconnect) после разрыва потока |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Поток «снимок, затем события в реальном времени»](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Загрузить вложение](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Список вложений](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Скачать вложение](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Удалить вложение](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Список метаданных файлов рабочего пространства](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Список неизменяемых артефактов](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Скачать артефакт](./download-artifact) |

## Поля статуса {#status-fields}

- `status` — статус выполнения: `idle`, `in_progress` или `failed`. Инструменты function, которым нужен результат от клиента (`requires_action`), пока не поддерживаются; чтение такой сессии возвращает `502 executor_contract_error`.
- `lifecycle_status` — `active` или `archived`. Архивированные сессии отклоняют ввод, обновление метаданных и потоки. `DELETE` архивирует; `unarchive` восстанавливает.
- `failure` — `null` или объект с `code`, `message`, `action` и иногда `retryable`.

| `failure.code` | Значение | Рекомендуемый `action` |
|---|---|---|
| `session_creation_rejected` | Слой выполнения отклонил сессию | `create_new_session` |
| `model_authentication_failed` | Провайдер модели отклонил ключ | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Провайдер модели ограничивает частоту запросов (можно повторить) | `retry_later` |
| `model_quota_exceeded` | У аккаунта модели нет квоты | `check_model_account` |
| `context_limit_exceeded` | Диалог превышает контекст модели | `create_new_session` |
| `environment_connection_timeout` | Среда не подключилась вовремя (можно повторить) | `retry_later` |
| `runtime_unavailable` | Среда выполнения недоступна (можно повторить) | `retry_later` |
| `model_request_failed` | Запрос к модели не завершился | `inspect_history` |
| `model_configuration_rejected` | Модель или слой выполнения отклонили конфигурацию | `create_session_with_updated_model_provider` |
| `execution_failed` | Сбой без более конкретной публичной причины | `inspect_history` |

Если сессию нельзя прочитать в реальном времени, результаты списка могут содержать строки-заглушки с `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` или `session_snapshot_unavailable`.

## Учётные данные модели {#model-credentials}

По умолчанию сессия вызывает модели с тем же API-ключом SandBase, которым она была создана. Чтобы выбрать явно, передайте `model_provider`:

- `{"type": "sandbase"}` использует вызывающий ключ. `base_url` не допускается.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` вызывает ваш собственный OpenAI-совместимый HTTPS-эндпоинт. URL не может содержать учётные данные, query или fragment, и SandBase никогда не переключается на ваш ключ SandBase.

`model_provider` доступен только для записи и никогда не возвращается в ответах.

## Допуск к выполнению и ошибки {#admission-and-errors}

Создание сессии и отправка ввода проверяют допуск к выполнению: `402 spending_limit_exceeded`, если исчерпан лимит ключа или баланс организации, `403 org_disabled`, если организация не может запускать Agents, и `503 admission_unavailable`, если проверку не удалось выполнить. Чтение, отмена и архивирование баланс не блокирует.

Отправка ввода также может вернуть `409 session_input_pending` (предыдущий ввод ещё доставляется; подождите и не отправляйте повторно с новым ключом), `409 session_input_expired` (перед повторной отправкой проверьте историю) или `409 session_environment_unavailable` (подождите или создайте новую сессию). См. [Ошибки](/api-reference/errors#agents-platform-errors).

## Пагинация {#pagination}

Сессии, элементы, ходы и артефакты используют курсорную пагинацию (`limit` 1-100, `after`, `order`). Вложения используют пагинацию по смещению (`limit` 1-100, `offset`).

Файлы рабочего пространства вместо этого используют пагинацию `page` / `next`. См. [Список файлов рабочего пространства](./list-workspace-files).
