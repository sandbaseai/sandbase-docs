---
i18nSource: e904f2b8bbd0ccc4
title: Сессии
description: Запуск Agent в сессии, потоковая передача событий, чтение истории, прикрепление файлов и обработка сбоев.
---

# Сессии {#sessions}

**Сессия** (Session) запускает одну сохранённую версию Agent в облаке SandBase; выбирать среду выполнения не нужно. Её ID начинается с `ses_`, а все пути сессий находятся в `/v1/agents/sessions`. Сессия фиксирует версию Agent, версии Skills и конфигурацию MCP-подключений, с которыми она была запущена.

## Как запускаются сессии {#how-sessions-start}

Создайте сессию через `POST /v1/agents/sessions`. Сессия возвращает `source: "direct"`.

## Запуск сессии {#run-a-session}

Нативный поток событий работает **только в реальном времени**: после отключения события повторно не воспроизводятся. Откройте поток до отправки ввода, а историю читайте из items или turns.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Тот же сценарий с официальным OpenAI Python SDK. Сначала откройте поток, отправьте ввод из другого потока выполнения и остановитесь на финальном событии хода. Версию для Node.js и отличия SDK см. в разделе [Совместимость с OpenAI](/agents/openai-compatibility).

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Каждая отправка содержит ровно одно событие. `input` — это текстовая строка или массив ровно с одним пользовательским сообщением, у которого ровно одна часть `input_text`: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Любая другая форма возвращает `400 invalid_request`. Чтобы остановить текущий ход, отправьте `{"type": "agent.session.input.cancel"}` или вызовите `POST /v1/agents/sessions/{session_id}/cancel` с заголовком `Idempotency-Key`. Отмена в простаивающей сессии всё равно возвращает `202 {"accepted": true}` и ничего не меняет. Первый `input` можно передать и при создании сессии. `stream: true` при создании не поддерживается.

## Статусы и сбои {#status-and-failures}

| Поле | Значения | Смысл |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Состояние выполнения сессии |
| `lifecycle_status` | `active`, `archived` | Принимает ли сессия ввод |
| `failure` | `null` или `{code, message, action, retryable?}` | Публичная причина сбоя и рекомендуемый следующий шаг |

`failure.action` подсказывает, что делать: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` или `create_session_with_updated_model_provider`. См. [таблицу кодов сбоев](/api-reference/sessions/#status-fields).

Инструменты-функции, запрашивающие результат у клиента (`requires_action`), пока не поддерживаются; чтение такой сессии возвращает `502 executor_contract_error`.

Если отправка возвращает `409 session_input_pending`, предыдущий ввод ещё доставляется. Подождите и прочитайте сессию; не отправляйте ввод повторно с новым `Idempotency-Key`, иначе он может выполниться дважды.

## Архивирование {#archive}

`DELETE /v1/agents/sessions/{session_id}` архивирует сессию; безвозвратно сессии не удаляются. `POST /v1/agents/sessions/{session_id}/archive` и `/unarchive` принимают `{"row_version": …}`. Архивированные сессии сохраняют историю, но отклоняют ввод, обновление метаданных и потоки.

## Вложения {#attachments}

Загрузите файл в рабочее пространство сессии через `POST /v1/agents/sessions/{session_id}/files` (multipart-поле `file`, до 5 МиБ, заголовок `Idempotency-Key` обязателен). Поддерживаемые типы: `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` и `.webp`. Когда `status` файла станет `ready`, отправьте его вместе с не более чем девятью другими:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Переподключение клиентов {#reconnecting-clients}

Клиенты браузерного типа, которым после обрыва соединения нужно согласованное представление, могут вызвать `POST /v1/agents/sessions/{session_id}/reconnect`. Вызов возвращает сессию и `stream_url` для `GET /v1/agents/sessions/{session_id}/events/stream`. Этот поток сначала отправляет `session.snapshot`, а затем события в реальном времени и `heartbeat`. Если поток выдаёт `stream.interrupted`, переподключитесь снова, а не отправляйте ввод повторно.

## Репозиторий GitHub {#github-repository}

Передайте `github_workspace` при создании, чтобы клонировать репозиторий GitHub в `/workspace` и разрешить Agent отправлять изменения в собственные ветки сессии. См. [Рабочее пространство с репозиторием GitHub](/agents/github-workspace).

## Учётные данные модели {#model-credentials}

Сессия вызывает модели с API-ключом, которым она была создана, если вы не передали `model_provider`. Чтобы работать с собственным OpenAI-совместимым HTTPS-эндпоинтом, используйте `{"type": "custom", "base_url": "https://…", "api_key": "…"}`. `model_provider` доступен только для записи.

## ID {#ids}

| Префикс | Ресурс |
|---|---|
| `agt_` | Agent |
| `ses_` | Сессия |
| `skl_` | Skill |
| `mcp_` | MCP-подключение |
| `sec_` | Секрет |
| `fil_` | Вложение сессии |

Считайте ID непрозрачными строками.

## Дальнейшие шаги {#next-steps}

- [Справочник Sessions API](/api-reference/sessions/)
- [Совместимость с OpenAI](/agents/openai-compatibility)

## Файлы рабочего пространства и сгенерированные артефакты {#workspace-files-and-generated-artifacts}

Эти три ресурса служат разным целям:

| Ресурс | Назначение | Пагинация |
|---|---|---|
| [Вложения](/api-reference/sessions/list-files) | Загруженные вами файлы, на которые можно ссылаться во вводе через `file_id` | `limit` / `offset` |
| [Файлы рабочего пространства](/api-reference/sessions/list-workspace-files) | Текущие пути и размеры файлов в каталоге рабочего пространства | `page` / `next` |
| [Артефакты](/api-reference/sessions/list-artifacts) | Неизменяемые сгенерированные результаты, доступные для скачивания | `after` / `last_id` |

Получите ID `art_` из списка артефактов и передайте именно этот ID в [Download Artifact](/api-reference/sessions/download-artifact). Путь в рабочем пространстве или `file_id` вложения его не заменяют. Список рабочего пространства возвращает только метаданные и не является API для скачивания по произвольному пути. Артефакты скачиваются целиком, размером до 200 МиБ; частичное скачивание через `Range` не поддерживается.
