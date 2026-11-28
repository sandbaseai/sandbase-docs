---
i18nSource: 2ba7f0f41847d04f
title: Определение Agent
description: "Создание и обновление версионируемого Agent через Agents API: поля, ограничения, версии и архивирование."
---

# Определение Agent {#define-an-agent}

Agent создаётся запросом `POST /v1/agents`. API следует протоколу OpenAI Agents, поэтому можно использовать обычный HTTP или `client.beta.agents` из OpenAI SDK с `base_url="https://api.sandbase.ai/v1"`. Заголовок `OpenAI-Beta` необязателен; если вы его отправляете, его значение должно быть `agents=v1`. О том, что поддерживает SDK, см. [Совместимость с OpenAI](/agents/openai-compatibility).

## Создание Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

В ответ приходит `201 Created` с Agent: ID с префиксом `agt_`, `version: 1`, `row_version`, `status: "active"` и `projection_status`. Новая версия готовится к выполнению в фоне; запускайте сессии, когда `projection_status` станет `ready`.

`Idempotency-Key` необязателен. Если его не передать, сервис сгенерирует ключ сам, и повторный запрос может создать второй Agent. При повторных попытках отправляйте собственный постоянный ключ.

## Поля {#fields}

Тело запроса — строгий JSON (до 1 MiB). Неизвестные поля возвращают 400.

| Поле | Обязательное | Ограничения и значения |
|---|---|---|
| `model` | Да | ID модели, до 200 символов |
| `name` | Нет | До 128 символов |
| `instructions` | Нет | До 256 KiB |
| `description` | Нет | До 4096 символов |
| `runtime_profile` | Нет | `codex` (по умолчанию), `claude` или `mcode` |
| `skills` | Нет | До 32 ссылок. Новая привязка с `version: null` при сохранении закрепляет текущую версию по умолчанию; существующие привязки сохраняют закреплённую версию. Для обновления укажите версию явно; см. [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Нет | До 32 ссылок; см. [MCP-подключения](/agents/mcp-tools#mcp-connections) |
| `tools` | Нет | До 64 инструментов `function` и не более одного инструмента `web_search` |
| `text` | Нет | `format.type`: `text` или `json_schema` (схема объекта); `verbosity`: `low`, `medium` или `high` |
| `reasoning` | Нет | `effort`: `none`, `minimal`, `low`, `medium`, `high`, `xhigh` или `max`; `summary`: `concise`, `detailed` или `auto` |
| `service_tier` | Нет | `auto` (по умолчанию), `default`, `flex`, `priority` или `fast` |
| `metadata` | Нет | До 16 строковых пар; ключи до 64, значения до 512 символов |
| `note` | Нет | Примечание к изменению, сохраняемое в версии |

## Текущие ограничения {#current-limits}

- Чтобы сессии запускались, `web_search` должен использовать `"mode": "disabled"`.
- Инструменты `function` можно сохранить, но запуски (Runs), которым нужно, чтобы клиент вернул результат инструмента (`requires_action`), пока не поддерживаются. Сессия в таком состоянии возвращает `502 executor_contract_error`. Вместо этого давайте Agent внешние возможности через [MCP-подключения](/agents/mcp-tools#mcp-connections).
- `multi_agent` нужно опустить или передать `null`.

## Обновление Agent {#update-an-agent}

Есть две формы обновления. Обе создают новую версию.

- `POST /v1/agents/{agent_id}` — обновление в стиле OpenAI SDK. Передавайте только те поля, которые хотите изменить. `row_version` не нужен, поэтому побеждает последняя запись. `description` и `note` в этой форме не принимаются.
- `PATCH /v1/agents/{agent_id}` — обновление по принципу compare-and-set. Оно требует `row_version`, полученный при последнем чтении, и возвращает 409, если Agent за это время изменился. Явные значения `null` отклоняются.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Версии, архивирование и восстановление {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` возвращает список неизменяемых снимков; `GET /v1/agents/{agent_id}/versions/{version}` читает один из них.
- `POST /v1/agents/{agent_id}/restore` с `{"source_version": 1, "row_version": 3}` копирует более раннюю конфигурацию в новую текущую версию.
- `POST /v1/agents/{agent_id}/archive` и `/unarchive` принимают `{"row_version": …}`. Архивированные Agents не могут запускать новые сессии.
- `DELETE /v1/agents/{agent_id}` архивирует Agent. Agents никогда не удаляются физически.

## Дальнейшие шаги {#next-steps}

- [Skills и MCP-инструменты](/agents/mcp-tools)
- [Запуск Agent в сессии](/agents/sessions)
- [Справочник Agents API](/api-reference/agents/)
