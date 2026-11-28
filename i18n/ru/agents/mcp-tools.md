---
i18nSource: 417ea5dc930a8786
title: Skills и MCP-инструменты
description: Подключайте к Agent в SandBase многократно используемые Skills и удалённые MCP-инструменты и управляйте тем, какие версии и инструменты использует каждая сессия.
---

# Skills и MCP-инструменты {#skills-and-mcp-tools}

Agent получает возможности двумя способами:

- **Skills** учат Agent выполнять работу. Skill — это версионируемый ZIP-пакет с инструкциями и ресурсами.
- **MCP-подключения** позволяют Agent вызывать инструменты удалённого MCP-сервера по HTTPS, при необходимости с аутентификацией через [Secret](/agents/api-credentials).

Самые полезные Agents сочетают оба способа: MCP-сервер получает данные или выполняет действия, а Skill описывает, как использовать результаты.

## Skills {#skills}

1. Подготовьте папку с файлом `SKILL.md`, во frontmatter которого есть `name` и `description`, и заархивируйте саму папку (`zip -r release-notes.zip release-notes/`, не более 5 MiB). Эта папка должна находиться на верхнем уровне ZIP; `SKILL.md` в корне ZIP возвращает `400 invalid_request`.
2. Загрузите архив через `POST /v1/skills` в multipart-поле `files`. Ответ содержит ID с префиксом `skl_` и `default_version: "1"`.
3. Укажите его в массиве `skills` у Agent.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- При первой привязке `"version": null` при сохранении Agent разрешается в текущую `default_version` Skill. Строка, например `"2"`, явно выбирает эту версию.
- Сохранённый Agent закрепляет версию. Смена версии Skill по умолчанию не обновляет существующие Agents и их новые сессии. Чтобы обновиться, обновите Agent с явной версией; `null` для существующей привязки сохраняет закреплённую версию.
- Новую версию загружайте через `POST /v1/skills/{skill_id}/versions`, а версию по умолчанию переключайте через `default=true` или `POST /v1/skills/{skill_id}`.
- Если Skill отключён, новые сессии Agents, которые на него ссылаются, завершаются ошибкой `400 skill_not_found`.

Публичные Skills также можно просмотреть в [каталоге Skills](/api-reference/skills/catalog). Полное пошаговое описание см. в [Skills API](/api-reference/skills/).

## Встроенные инструменты SandBase {#built-in-sandbase-tools}

Любой новый Agent может без настройки использовать собственные инструменты SandBase. С помощью `sandbase_discover`, `sandbase_inspect` и `sandbase_run` Agent находит модель или API в каталоге, читает схему и цену и вызывает их с вашим ключом. Если при создании не указать `mcp_connections`, Agent получает такое значение по умолчанию:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **Переданный список заменяет значение по умолчанию.** Чтобы добавить свой MCP-сервер и сохранить инструменты SandBase, включите встроенную запись в список.
- **Для `builtin:sandbase` требуется `server_label: "sandbase_builtin"`.** Любая другая метка, как и эта метка на другом подключении, возвращает `400`.
- **Чтобы создать Agent без инструментов,** отправьте `"mcp_connections": []`.
- **Встроенные инструменты бесплатны.** Вы платите только за модели и API, которые Agent вызывает через них.

## MCP-подключения {#mcp-connections}

1. Если MCP-серверу нужен Bearer-токен, [создайте Secret](/agents/api-credentials) для его точного URL.
2. Зарегистрируйте сервер через `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Укажите подключение в массиве `mcp_connections` у Agent:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Поле | Значение |
|---|---|
| `connection_id` | ID подключения `mcp_` в вашей организации или `builtin:sandbase` для встроенного сервера SandBase |
| `server_label` | Начинается с буквы; буквы, цифры, `_` и `-`; до 64 символов; уникально в пределах Agent |
| `allowed_tools` | Если поле опущено или равно `null`, разрешены все инструменты сервера; `[]` не разрешает ни одного; список разрешает только указанные имена (до 256 имён, каждое непустое и не длиннее 128 байт) |
| `required` | Должна ли сессия загрузить этот сервер |

Agent может ссылаться не более чем на 32 подключения. Подключения организации должны быть в статусе `active` на момент запуска сессии.

### Встроенные инструменты SandBase {#built-in-sandbase-tools-1}

Если создать Agent без `mcp_connections`, выбирается встроенный сервер SandBase. Чтобы явно сохранить его вместе с собственным сервером, включите в массив такую запись:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Явный массив заменяет весь выбор; пример выше только с собственным сервером исключает встроенный сервер. Отправьте `[]`, чтобы отключить все MCP-инструменты. Если опустить поле при обновлении Agent, текущий выбор сохраняется; `null` возвращает `400`. Для встроенной записи не нужно создавать MCP-подключение или Secret. Не отправляйте устаревшее поле `use_sandbase_mcp`.

::: info Отличие от OpenAI
В Agents API от OpenAI MCP-серверы объявляются прямо в запросе как `tools: [{"type": "mcp", ...}]`. На такую форму SandBase возвращает `400`: зарегистрируйте сервер как ресурс подключения и укажите его в `mcp_connections`. В OpenAI SDK нет методов для `/v1/mcp-connections` и `/v1/secrets`, поэтому вызывайте их через `client.post(...)` и передавайте `mcp_connections` через `extra_body` (Python) или в теле запроса (Node.js). См. [Совместимость с OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Изменения и работающие сессии {#changes-and-running-sessions}

При запуске каждая сессия фиксирует версию Agent, версии Skills и конфигурацию MCP-подключений.

- После замены подключения или ротации его Secret новые сессии используют новую конфигурацию; существующие сессии сохраняют свой снимок.
- Отключение подключения или отзыв его Secret блокирует новые сессии и отклоняет дальнейший ввод в существующие сессии, которые его используют. Уже выполняющийся вызов инструмента не прерывается.

## Не храните токены в промптах {#keep-tokens-out-of-prompts}

Храните токены как Secrets. Не помещайте их в инструкции, ввод сессии, метаданные или пакеты Skills: их может прочитать любой, у кого есть доступ к Agent или сессии.

## Дальнейшие шаги {#next-steps}

- [Учётные данные для MCP-инструментов](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Определение Agent](/agents/agent-api)
