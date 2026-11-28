---
i18nSource: e4dcecbecc736e53
title: Рабочее пространство из репозитория GitHub
description: Клонируйте репозиторий GitHub в /workspace сессии, отправляйте изменения в ветки сессии и открывайте pull request.
---

# Рабочее пространство из репозитория GitHub {#github-repository-workspace}

Сессия может стартовать с репозиторием GitHub, уже клонированным в `/workspace`. Agent работает с кодом обычными командами `git`, отправляет коммиты в ветки, зарезервированные для сессии, и может открыть pull request для проверки человеком.

Доступ к репозиторию идёт через git-прокси SandBase. Токен GitHub в сессию не попадает.

## Перед началом {#before-you-start}

Администратор организации настраивает это один раз в консоли:

1. Подключите GitHub в разделе **Console → Integrations** и выберите репозитории, которые может использовать подключение.
2. Назначьте подключение Agent в разделе **Integrations** этого Agent. Инструменты Agent для этого подключения должны включать **Read code** для клонирования. Для отправки изменений также нужен **Commit to a task branch**.
3. Необязательно: выберите **Workspace repository** и ветку в этом назначении. Тогда сессии будут клонировать его по умолчанию.

`repository_id` — числовой ID репозитория в GitHub. Его можно получить из `GET https://api.github.com/repos/{owner}/{repo}` (поле `id`) или с помощью инструмента `github_list_repositories`.

## Выбор репозитория для сессии {#choose-the-repository-per-session}

Передайте `github_workspace` при создании сессии:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: fix-login-2026-11-18" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "github_workspace": {"repository_id": "1195090324", "ref": "main"},
    "input": "Fix the failing login test, push your change and open a pull request."
  }'
```

| Поле | Обязательно | Значение |
|---|---|---|
| `repository_id` | Да | Десятичная строка. Репозиторий должен входить в область репозиториев Agent для этого подключения. |
| `ref` | Нет | Ветка для checkout. По умолчанию — ветка репозитория по умолчанию. |
| `connection_id` | Нет | Какое подключение GitHub использовать. По умолчанию — назначение с репозиторием рабочего пространства или единственное подключение GitHub у Agent. |

`github_workspace` необязателен:

- Не указан или `null`: сессия клонирует репозиторий рабочего пространства Agent, если он задан. Иначе ничего не клонируется, и сессия стартует как обычно.
- Указан: заменяет значение Agent по умолчанию только для этой сессии.

У каждой сессии не более одного репозитория рабочего пространства. Выбор фиксируется при создании сессии.

## Что получает сессия {#what-the-session-gets}

- Checkout `ref` в `/workspace`, где `origin` указывает на git-прокси. `git fetch`, `git pull` и `git push` работают как обычно.
- Коммиты от имени `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, например `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY` — `owner/name` репозитория.

## Правила отправки {#push-rules}

Agent может отправлять изменения только в ветки под своим префиксом:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Можно повторно отправлять в ту же ветку, в том числе в ветку, для которой уже открыт pull request.
- Отправка в ветку по умолчанию, другие ветки, префиксы других сессий и теги отклоняется до того, как достигнет GitHub. Git выводит `sandbase: only agents/<session>/* branches can be pushed`.
- Прокси не может изменять файлы workflow GitHub Actions.

Веткой сессии считается только ветка, которую отправила сама сессия. Её принимает инструмент `github_open_pull_request`, а также подключение, область слияния которого ограничена управляемыми ветками.

## Права определяются подключением {#permissions-follow-the-connection}

Каждый git-запрос проверяется по текущему назначению Agent и текущей политике подключения.

- Если администратор сужает область репозиториев, следующий fetch или push отклоняется.
- Если администратор убирает **Commit to a task branch**, следующий push отклоняется.
- Если администратор отзывает подключение, следующий fetch или push отклоняется.

Каждая сессия может выполнять до 120 git-запросов в минуту.

## Ошибки {#errors}

| Ответ | Причина |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` не является десятичной строкой, `ref` не является простым именем ветки, у Agent нет подключения GitHub или имя ветки репозитория по умолчанию не поддерживается (задайте `ref` явно). |
| `400 invalid_request` | У Agent несколько подключений GitHub, и ни у одного нет репозитория рабочего пространства. Передайте `connection_id`. |
| `403 insufficient_scope` | Репозиторий или подключение вне области Agent, либо инструменты Agent не включают **Read code**. |

## Дальнейшие шаги {#next-steps}

- [Запуск сессий](/agents/sessions)
- [Справочник API Create Session](/api-reference/sessions/create)
