---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Регистрация удалённых MCP-серверов по HTTPS, которые могут вызывать Agents.
---

# MCP Connections API {#mcp-connections-api}

MCP-подключение регистрирует удалённый MCP-сервер, доступный по HTTPS. Agents ссылаются на подключения в `mcp_connections`; каждая сессия фиксирует конфигурацию подключения при запуске. ID подключений используют префикс `mcp_`. Чтобы аутентифицироваться на сервере с Bearer-токеном, сначала создайте [секрет](/agents/api-credentials#with-the-api) для того же URL.

| Метод | Путь | Назначение |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Создать подключение](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Список подключений](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Получить подключение](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Заменить подключение](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Включить подключение](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Отключить подключение](#disable-a-connection) |

Каждая операция записи требует `Idempotency-Key` (1-128 байт, без пробелов в начале и в конце). Объект подключения содержит `id`, `name`, `server_url`, `secret_id` (если задан), `status` (`active` или `disabled`), `row_version`, `created_at` и `updated_at`.

## Создание подключения {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` обязателен и не может быть пустым, до 128 байт.
- `server_url` должен использовать HTTPS и не содержать данных пользователя, query-строки или фрагмента (до 2048 байт).
- `secret_id` необязателен. Не указывайте его для анонимного сервера. Если он задан, секрет должен быть `active`, а его `server_url` должен в точности совпадать с этим `server_url`, иначе запрос завершится ошибкой (409 для неактивного секрета, 400 при несовпадении URL).

Возвращает `201 Created`.

## Список подключений {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Пагинация по смещению с `data`, `total`, `limit` и `offset`. `limit` по умолчанию равен 20, максимум 200; при отсутствии, недопустимом или неположительном значении используется 20. `offset` по умолчанию равен 0; при недопустимом или неположительном значении используется 0. Сдвигайтесь на возвращённый `limit`, пока не выполнится `offset + data.length >= total`. Отключённые ресурсы остаются видимыми в списке.

## Получение подключения {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Замена подключения {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` заменяет `name`, `server_url` и `secret_id` одновременно; если не указать `secret_id`, подключение станет анонимным. `row_version` обязателен и должен совпадать с текущим значением, возвращённым Get Connection. Возвращает `200 OK` с обновлённым подключением. Отключённое подключение после замены остаётся отключённым, пока вы его не включите.

## Включение подключения {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` обязателен и должен быть положительным целым числом, совпадающим с текущим значением ресурса. Возвращает `200 OK` с подключением. При включении ID подключения сохраняется. Отозванный секрет при этом не восстанавливается; сначала замените подключение, указав новый активный секрет.

## Отключение подключения {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Возвращает `204 No Content` и устанавливает `status` в `disabled`. Новые сессии не могут использовать подключение, а существующие сессии, зафиксировавшие его, отклоняют дальнейший ввод. Уже выполняющийся вызов инструмента не прерывается.

## Изменения и работающие сессии {#changes-and-running-sessions}

Сессии фиксируют настройки подключения при запуске. После замены подключения или ротации его секрета новые сессии используют новую конфигурацию, а существующие сохраняют свой снимок. Отключение подключения или отзыв его секрета блокирует и новые сессии, и дальнейший ввод в существующие.

## Ошибки и повторные попытки {#errors-and-retries}

Ошибки используют [формат ошибок Agents](/api-reference/errors#agents-platform-errors). Недопустимые поля или отсутствие ключа идемпотентности при записи возвращают `400 invalid_request`; неизвестный или недоступный ресурс возвращает `404 not_found`. Устаревший `row_version`, несовместимое состояние жизненного цикла или повторное использование ключа create/update с другими входными данными возвращают `409 conflict`. Перед новым обновлением прочитайте ресурс заново и используйте новый ключ для каждой новой операции записи.

`created_at` и `updated_at` — строки временных меток в формате RFC 3339.
