---
i18nSource: dab112fdbbc56799
title: Учётные данные для MCP-инструментов
description: Храните Bearer-токены только для записи в виде Secrets, чтобы Agents могли вызывать MCP-серверы с аутентификацией.
---

# Учётные данные для MCP-инструментов {#credentials-for-mcp-tools}

Если MCP-сервер требует аутентификации, сохраните его Bearer-токен как **Secret** и прикрепите Secret к [MCP-подключению](/agents/mcp-tools#mcp-connections). Среда выполнения отправляет токен только этому серверу.

## Как работают Secrets {#how-secrets-work}

- `kind` всегда равен `mcp_bearer`: Bearer-токен для одного MCP-сервера.
- Каждый Secret привязан к одному точному `server_url`. Подключение может использовать его, только если его `server_url` совпадает. Для другого URL создайте другой Secret.
- Токен доступен только для записи. API возвращает имя Secret, URL, статус и `row_version`, но никогда не сам токен.
- Secrets — это не переменные окружения. Они не внедряются в среду выполнения Agent, и Agents не могут их прочитать.

Ранние версии SandBase хранили учётные данные на уровне рабочего пространства или Agent и внедряли их как переменные окружения, например `GITHUB_TOKEN`. Эта модель выведена из эксплуатации, а её записи не переносятся. Создайте нужные значения заново как Secrets в MCP-подключениях.

## Через API {#with-the-api}
Создавайте, ротируйте и отзывайте Secrets через API. Это руководство описывает контракт API; страница Credentials в Console, открываемая из редактора Agent, не является справочником по поведению Secret. Вызывайте эти эндпоинты с доверенного бэкенда, а не из браузерного кода: они принимают API-ключ SandBase и токен в открытом виде.

| Метод | Путь | Назначение |
|---|---|---|
| `POST` | `/v1/secrets` | [Создать Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [Список Secrets](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Получить Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Ротировать токен](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Отозвать Secret](#revoke-a-secret) |

Каждая операция записи требует `Idempotency-Key` (1–128 байт, без пробелов в начале и конце). Объект Secret содержит `id` (префикс `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` и `updated_at`. `status` равен `pending`, пока токен сохраняется, `active`, когда его можно использовать, и `disabled` после отзыва. `created_at` и `updated_at` — строки меток времени в формате RFC 3339.

### Создание Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` должен быть `mcp_bearer`.
- `server_url` должен использовать HTTPS без учётных данных пользователя, query и фрагмента. Secret работает только для этого точного URL.
- `name` и `token` обязательны и не могут быть пустыми. `name` — до 128 байт, `token` — до 16384 байт, `server_url` — до 2048 байт.

Ответ — `201 Created` без токена. Используйте ID с префиксом `sec_` как `secret_id` при [создании MCP-подключения](/api-reference/mcp-connections/#create-a-connection).

### Список Secrets {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Пагинация по смещению с `data`, `total`, `limit` и `offset`. По умолчанию `limit` равен 20, максимум — 200; при отсутствующих, некорректных или неположительных значениях используется 20. По умолчанию `offset` равен 0; при некорректных или неположительных значениях используется 0. Увеличивайте смещение на возвращённый `limit`, пока `offset + data.length >= total`. Отключённые Secrets остаются в списке.

### Получение Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Ротация Secret {#rotate-a-secret}

Присвойте `SECRET_ROW_VERSION` последнее значение `row_version` из Get a Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Ротация заменяет токен, сохраняя тот же Secret и `server_url`. Обязательны `token` и положительное целое `row_version`, Secret должен быть в статусе `active`, а `row_version` должен совпадать с последним значением. Возвращает `201 Created`. Новые сессии используют новый токен; уже запущенные сессии сохраняют зафиксированные учётные данные.

### Отзыв Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Возвращает `204 No Content` и устанавливает `status` в `disabled`. Подключения, использующие этот Secret, перестают работать для новых сессий и для дальнейшего ввода в существующие сессии. Отзыв нельзя отменить: создайте новый Secret и замените подключение.

### Ошибки и повторные попытки {#errors-and-retries}

Ошибки используют [формат ошибок Agents](/api-reference/errors#agents-platform-errors). Некорректные поля или отсутствие ключа идемпотентности при записи возвращают `400 invalid_request`; неизвестный или недоступный Secret возвращает `404 not_found`. Устаревший `row_version`, несовместимое состояние жизненного цикла или повторное использование ключа создания с другими входными данными возвращают `409 conflict`. Перед повторной попыткой прочитайте Secret заново и используйте новый ключ для каждой новой операции записи.

## Безопасность {#security}

- Создавайте и ротируйте Secrets с доверенного бэкенда, а не из браузерного кода.
- Считывайте токены из собственного хранилища секретов или окружения, как `$GITHUB_MCP_TOKEN` выше, а не вставляйте их в скрипты.
- Не помещайте токены в инструкции, ввод сессии, метаданные и пакеты Skill.
- Отзывайте Secret сразу, как только токен мог утечь, затем создайте новый и замените подключение.

## Дальнейшие шаги {#next-steps}

- [Skills и MCP-инструменты](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
