---
i18nSource: 5b94f91222d138de
title: Аутентификация API
description: Аутентификация в API SandBase с помощью Bearer-токенов и поддерживаемых заголовков API-ключей совместимых протоколов.
---

# Аутентификация {#authentication}

SandBase использует API-ключи для аутентификации запросов к публичному API. На этой странице описаны поддерживаемые способы интеграции и
рекомендации по управлению ключами. Аутентификация в Console и её внутренние API не входят в контракт публичного API.

## Способы аутентификации {#authentication-methods}

Стандартные эндпоинты SandBase `/v1/*` требуют Bearer-токен. Операции Anthropic Messages и Google Gemini-совместимые операции также принимают API-ключ в местах, принятых в их нативных SDK.

### Bearer-токен {#bearer-token}

Передайте ключ в заголовке `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

Это стандартный способ, используемый OpenAI-совместимыми SDK.

### Anthropic Messages: заголовок x-api-key {#anthropic-messages-x-api-key-header}

Передайте ключ в заголовке `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Этот заголовок поддерживается только для `POST /v1/messages`. Другие публичные эндпоинты его не читают; используйте Bearer-аутентификацию
для Chat Completions, `/v1/run` и API ресурсов.

### Приоритет {#priority}

Только для `POST /v1/messages`: если указаны оба заголовка, приоритет у `x-api-key`.

### API-ключи для Google Gemini-совместимых операций {#google-gemini-compatible-api-keys}

Операции Gemini GenerateContent и Interactions принимают `x-goog-api-key`, `Authorization: Bearer …` или параметр запроса `key` — в этом порядке приоритета. Предпочитайте заголовок: учётные данные в строке запроса могут попасть в логи и историю браузера. Поддерживаемые пути см. в разделах [Google Gemini](/api-reference/gemini-generate-content) и [Gemini Interactions](/api-reference/gemini-interactions).

### Логика извлечения {#extraction-logic}

Стандартные эндпоинты читают только `Authorization: Bearer <key>`. Middleware Anthropic Messages сначала читает `x-api-key`,
а затем использует заголовок Bearer. Ресурсы платформы Agents принимают `Authorization: Bearer` или
`X-API-Key` (см. ниже). [Webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) тоже принимает любой из
заголовков и использует Bearer, если указаны оба. При отсутствии поддерживаемых учётных данных возвращается `401 Unauthorized`.

### Ресурсы платформы Agents {#agents-platform-resources}

`/v1/agents*` (включая `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
и `/v1/skills*` принимают ключ в любом из заголовков:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Если переданы и `Authorization: Bearer`, и `X-API-Key`, они должны содержать один и тот же ключ; разные значения возвращают `401 unauthorized`. Повтор любого из заголовков также возвращает 401.
- `OpenAI-Beta` необязателен. Если он указан, значение должно быть `agents=v1`.
- Для запросов на чтение нужно право `agents.read`, для записи — `agents.write`. Стандартные ключи, созданные в Console, имеют оба права. Ключи SandBase с ограниченной областью, например ключи CLI Login, возвращают `403 insufficient_scope`.
- `402 spending_limit_exceeded` означает, что исчерпан лимит расходов ключа или баланс организации.
- Ошибки используют [формат ошибок Agents](/api-reference/errors#agents-platform-errors), а не плоскую форму `{"error": "…"}`, показанную ниже.

## Формат API-ключа {#api-key-format}

Новые API-ключи, созданные в Console, имеют такой формат:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Компонент | Описание |
|-----------|-------------|
| `sk-` | Стандартный префикс «secret key» |
| `xxxx...` | 64 шестнадцатеричных символа, сгенерированных из 32 случайных байт |

Устаревшие ключи `sk-sb-...` можно использовать, пока не истечёт их срок или их не отзовут. Клиентам следует считать ключи непрозрачными строками
и не отклонять учётные данные по префиксу или длине.

::: warning
Никогда не раскрывайте API-ключ в клиентском коде, публичных репозиториях или логах. Обращайтесь с ним как с паролем.
:::

## Создание API-ключей {#create-api-keys}

### Через Console {#via-console}

1. Войдите в [SandBase Console](https://www.sandbase.ai/console)
2. Откройте **Developer → API Keys**
3. Нажмите **New key**
4. Дайте ключу понятное имя (например, «Production Backend», «Development»)
5. Сразу скопируйте ключ — он больше не будет показан

### Свойства ключа {#key-properties}

| Свойство | Описание |
|----------|-------------|
| Name | Понятная метка для идентификации |
| Organization | Организация, которой принадлежит ключ |
| Enabled | Активен ли ключ |
| Spending Limit | Необязательный лимит расходов для ключа |
| Expires At | Необязательная дата истечения срока |
| Created At | Когда ключ был создан |

Стандартные ключи, созданные в Console, дают доступ уровня организации к документированному публичному API. Учётные данные, выдаваемые SandBase, например ключи CLI Login, могут иметь ограниченную область. Console не позволяет выбирать области для стандартных ключей.

## Жизненный цикл ключа {#key-lifecycle}

### Ротация {#rotation}

Чтобы ротировать ключ:

1. Создайте новый ключ в Console
2. Переведите приложение на новый ключ
3. Убедитесь, что новый ключ работает в продакшене
4. Отзовите старый ключ

::: tip
Всегда создавайте новый ключ до отзыва старого, чтобы избежать простоя.
:::

### Отзыв {#revocation}

Отозванные ключи не могут аутентифицировать новые запросы. API возвращает `401 Unauthorized` с сообщением:

```json
{"error":"API key has been revoked"}
```

### Истечение срока {#expiration}

Для ключей можно задать дату истечения срока. Ключи с истёкшим сроком возвращают `401 Unauthorized` с сообщением:

```json
{"error":"API key has expired"}
```

## Требования к аутентификации по эндпоинтам {#endpoint-authentication-requirements}

| Эндпоинт | Способ аутентификации | Описание |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API-ключ (Bearer) | Chat Completions |
| `POST /v1/responses` | API-ключ (Bearer) | OpenAI-совместимый Responses API |
| `POST /v1/messages` | API-ключ (Bearer или x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API-ключ (x-goog-api-key, Bearer или ключ в запросе) | Gemini GenerateContent |
| `/v1beta/interactions*` | API-ключ (x-goog-api-key, Bearer или ключ в запросе) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API-ключ (Bearer или X-API-Key) | Ресурсы платформы Agents |

SandBase Console использует отдельный процесс аутентификации в браузере. Её внутренние запросы не являются поддерживаемыми публичными
эндпоинтами и не должны использоваться интеграциями.

## Изоляция организаций {#organization-isolation}

API-ключи привязаны к организации. При аутентификации с ключом:

- Вам доступны только ресурсы вашей организации
- Использование и оплата учитываются по организации

## Ответы с ошибками {#error-responses}

| HTTP-статус | Сообщение | Причина |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Ключ не передан |
| 401 | `invalid API key` | Ключ не найден в базе данных |
| 401 | `API key has been revoked` | Ключ отключён |
| 401 | `API key has expired` | Срок действия ключа истёк |
| 402 или 403, зависящий от протокола | `API key spending limit exceeded` | Достигнут лимит расходов ключа; см. документированный контракт ошибок эндпоинта |
| 403 | `API key is not authorized for this endpoint` | Ключ с ограниченной областью использован для эндпоинта вне этой области |

Эти сообщения приходят в плоском теле `{"error":"<message>"}`, кроме ошибок области `403`. На эндпоинтах моделей и аккаунта
они используют `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
на ресурсах платформы Agents — [формат ошибок Agents](/api-reference/errors#agents-platform-errors) с
`code` `insufficient_scope`.

## Рекомендации по безопасности {#security-best-practices}

### Делайте {#do}

- **Храните ключи в переменных окружения** — никогда не прописывайте ключи в исходном коде
- **Используйте отдельные ключи для каждого окружения** — разные ключи для dev, staging и production
- **Задавайте даты истечения срока** — выберите интервал ротации в соответствии с вашей политикой безопасности
- **Отслеживайте использование** — проверяйте Console на неожиданную активность
- **Используйте стандартные ключи только для задач, которым нужен доступ к публичному API** — учётные данные CLI Login с ограниченной областью оставляйте в их управляемом процессе

### Не делайте {#don-t}

- **Не коммитьте ключи в систему контроля версий** — добавьте `.env` в `.gitignore`
- **Не используйте один ключ для несвязанных приложений** — отдельные ключи упрощают ротацию и реагирование на инциденты
- **Не раскрывайте ключи в клиентском коде** — всегда проксируйте запросы через свой бэкенд
- **Не записывайте API-ключи в логи** — маскируйте ключи в логах приложения

### Пример переменных окружения {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Лимиты запросов по ключу {#rate-limiting-by-key}

Лимиты запросов назначаются на организацию и общие для всех её API-ключей, поэтому создание дополнительных ключей не повышает
лимит. API не публикует универсального числового
значения по умолчанию или заголовков с оставшейся квотой.

Подробнее о лимитах и обработке ответов 429 см. в разделе [Лимиты запросов](/guides/rate-limiting).
