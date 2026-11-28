---
i18nSource: 1b5099685e9df6ce
title: Каталог Agents
description: Просматривайте публичные Agents и клонируйте их в свою организацию.
---

# Каталог Agents {#agent-catalog}

В каталоге перечислены Agents, которые SandBase публикует для повторного использования. Записи каталога доступны только для чтения. Клонируйте запись, чтобы получить приватный Agent в своей организации, который можно редактировать, запускать и развёртывать.

| Метод | Путь | Назначение |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Список публичных Agents |
| `GET` | `/v1/agents/catalog/{agent_id}` | Получение одного публичного Agent, при необходимости в версии `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Копирование в вашу организацию |

## Список Agents в каталоге {#list-catalog-agents}

Курсорная пагинация с параметрами `limit` (1-100), `after` и `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Каждая запись содержит `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` и `updated_at`.

## Получение Agent из каталога {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Параметр `version` необязателен и должен быть положительным целым числом. Подробный ответ дополнительно содержит доступный только для чтения объект `configuration` (имя, описание, модель, инструкции, профиль среды выполнения, метаданные, инструменты, text, reasoning и Skills).

## Клонирование Agent из каталога {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Тело запроса принимает необязательные поля `version` (положительное целое число, по умолчанию — текущая публичная версия) и `name` (до 128 символов). Ответ — `201 Created` с полным [объектом Agent](./create), у которого новый ID `agt_` в вашей организации. Заголовок `Idempotency-Key` необязателен; передавайте стабильный ключ, чтобы повторная попытка не создала вторую копию.

После клонирования [создайте Session](/api-reference/sessions/create), чтобы протестировать Agent.
