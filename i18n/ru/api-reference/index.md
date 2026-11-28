---
i18nSource: 071e97a48f9c4f4c
title: Справочник API
description: Вызывайте модели SandBase и управляйте Agents, Sessions, Skills, MCP-подключениями, Secrets и ресурсами аккаунта.
---

# Справочник API {#api-reference}

С помощью API можно вызывать модели напрямую или определять повторно используемые Agents, запускать их в Sessions и подключать к ним Skills и инструменты MCP.

::: tip Нужен инференс моделей?
Контракты инференса (Chat Completions, Responses, Anthropic Messages, Gemini, Images и видео Seedance) находятся в разделе **Model inference** этого справочника. Собственные поля и цены каждой модели указаны на её странице в [каталоге Models](https://www.sandbase.ai/models).
:::

## С чего начать {#choose-a-starting-point}

| Цель | Начните с | Что дальше |
|---|---|---|
| Определить повторно используемое поведение | [Agents](/api-reference/agents/) | Создайте конфигурацию Agent и управляйте её версиями |
| Запустить Agent напрямую | [Sessions](/api-reference/sessions/) | Отправляйте ввод, получайте поток событий и читайте историю |
| Повторно использовать наборы инструкций | [Skills](/api-reference/skills/) | Загружайте ZIP-пакеты с версиями и подключайте их к Agents |
| Вызывать внешние инструменты | [MCP-подключения](/api-reference/mcp-connections/) | Регистрируйте удалённые HTTPS-серверы MCP для Agents |
| Аутентифицировать внешние инструменты | [Secrets](/agents/api-credentials#with-the-api) | Храните доступные только для записи Bearer-токены для MCP-подключений |

## Жизненный цикл ресурсов {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent** (`agt_`) — сохранённая конфигурация с версиями; её создание не запускает выполнение.
- **Session** (`ses_`) запускает одну версию Agent и фиксирует её Skills и MCP-подключения. Пути Session находятся в `/v1/agents/sessions`.
- **Skill** (`skl_`) — набор инструкций с версиями. **MCP-подключение** (`mcp_`) регистрирует удалённый сервер инструментов, а **Secret** (`sec_`) хранит его Bearer-токен.

## Соглашения для ресурсов платформы Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, MCP-подключения и Secrets обслуживаются по адресу `https://api.sandbase.ai/v1` и подчиняются общим правилам:

- Аутентификация через `Authorization: Bearer` или `X-API-Key`. См. [Аутентификация](/api-reference/authentication#agents-platform-resources).
- Тела запросов — строгий JSON размером до 1 МиБ; неизвестные поля возвращают 400.
- Запросы на запись, создающие MCP-подключения или Secrets, требуют `Idempotency-Key`. Остальные запросы на запись принимают его по желанию.
- Оптимистичная блокировка использует `row_version`: передавайте значение, прочитанное последним, а при 409 читайте ресурс заново.
- Agents, Sessions, items, turns и Skills используют курсорную пагинацию (`limit`, `after`, `order`; ответы содержат `has_more` и `last_id`). Версии Agent, вложения, MCP-подключения и Secrets используют пагинацию со смещением (`limit`, `offset`; ответы содержат `total`).
- Ошибки возвращаются в формате `{"error": {"type", "code", "param", "message"}}`. См. [Ошибки платформы Agents](/api-reference/errors#agents-platform-errors).

## Аутентификация {#authentication}

Передавайте API-ключ SandBase как Bearer-токен:

```http
Authorization: Bearer sk-YOUR_KEY
```

Считайте ключ непрозрачным секретом, храните его на сервере и никогда не включайте в код для браузера или в логи. Подробности совместимости см. в разделе [Аутентификация](/api-reference/authentication), а публичные форматы ошибок — в разделе [Ошибки](/api-reference/errors).

## Организация и использование {#organization-and-usage}

Ресурсы платформы принадлежат организации, связанной с API-ключом. С помощью [Account API](/api-reference/account/) можно просматривать поддерживаемые представления баланса и недавней истории выполнения. Администрирование организации и управление оплатой выполняются в Console, если здесь не задокументирован публичный эндпоинт.

## Форматы справочника {#reference-formats}

- Просматривайте операции на боковой панели, чтобы увидеть примеры и подробности ответов.
- Скачайте машиночитаемую [спецификацию OpenAPI](/openapi.yaml).
- Точные поля запроса смотрите на странице модели в [каталоге Models](https://www.sandbase.ai/models) или на странице API в [каталоге APIs](https://www.sandbase.ai/apis).

## Дальнейшие шаги {#next-steps}

- Если вы впервые работаете с управляемыми Agents: [Создание Agent](/agents/)
- Прямой вызов модели: [Chat Completions](/api-reference/llm-gateway) или [каталог Models](https://www.sandbase.ai/models)
