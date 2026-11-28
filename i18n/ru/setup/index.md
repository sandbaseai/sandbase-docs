---
i18nSource: 28b1ef75a197824a
title: Подключение ИИ-инструментов
description: Откройте Claude Code, Codex, Cursor, Kiro и другим ИИ-инструментам доступ к каталогу Models и APIs SandBase одним промптом или одной командой CLI.
---

# Подключение ИИ-инструментов {#connect-ai-tools}

Страница [AI tools](https://www.sandbase.ai/console/setup) в Console (**Build → AI tools**) подключает SandBase к агенту или ИИ-инструменту, которым вы уже пользуетесь. Подключённые инструменты могут искать в каталоге Models и APIs SandBase, читать схему входных данных и цену каждого инструмента и запускать его. Каждый вызов оплачивается из активного рабочего пространства.

Поддерживаются, в частности, Claude Code, Codex, Cursor, Kiro IDE и Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop и ChatGPT. Актуальный список приведён на странице AI tools.

## Быстрый старт: вставьте один промпт {#quick-start-paste-one-prompt}

Вставьте эту строку в своего агента:

```text
set up https://www.sandbase.ai/SKILL.md
```

Агент прочитает Skill SandBase, установит CLI и попросит вас подтвердить один вход через браузер. Вставлять API-ключ не нужно. Когда агент сообщит, что клиент настроен, начните новый сеанс или перезапустите приложение, чтобы загрузились инструменты `sandbase_*`.

Для Skill на машине, где работает агент, нужен Node.js 20 или новее.

## Другие способы подключения {#other-ways-to-connect}

### CLI {#cli}

Подключитесь из терминала. Без `--client` CLI настраивает все найденные поддерживаемые клиенты:

```sh
npx -y @sandbaseai/cli@latest connect
```

Чтобы настроить один клиент, передайте его id, например `codex`, `claude-code`, `cursor` или `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Скрипт установки выполняет ту же команду:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Чтобы вывести список клиентов, которые распознаёт установщик, не меняя локальную конфигурацию:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` открывает авторизацию в браузере, создаёт ключ **CLI Login** для подтверждённого вами рабочего пространства и записывает только конфигурацию клиента, принадлежащую SandBase. Каждый клиент описан в документации открытого [SandBase CLI](https://github.com/sandbaseai/cli).

### MCP-клиенты, настраиваемые вручную {#mcp-clients-you-configure-by-hand}

Вошедшие пользователи видят адрес MCP-сервера в разделе **Other ways to connect** на странице [AI tools](https://www.sandbase.ai/console/setup). Аутентифицируйте его с помощью [API-ключа](/getting-started/api-keys) из **Developer → API Keys** и храните ключ в секретной конфигурации клиента.

## Проверка подключения {#verify-the-connection}

Сами по себе установка или авторизация не подтверждают, что клиент подключён. Убедитесь, что:

- сервер или коннектор SandBase виден в клиенте
- инструменты `sandbase_*` обнаруживаются в новом сеансе
- один безопасный запрос на естественном языке выполняется успешно

Для клиентов, управляемых через CLI, запустите диагностику после повторного подключения или изменения конфигурации:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` проверяет локальные учётные данные, запись MCP и Skill, а затем выполняет один запрос к SandBase и обратно. Финальный вызов инструмента всегда выполняйте в самом клиенте.

Запуски, выполненные подключёнными инструментами, отображаются в [Activities](https://www.sandbase.ai/console/activities) вместе со стоимостью.

## Устранение неполадок {#troubleshooting}

| Проблема | Что проверить |
|---|---|
| Инструменты не появляются | Начните новый сеанс клиента или перезапустите приложение, выполните `npx -y @sandbaseai/cli doctor --client <client>` и повторите попытку. |
| Нет авторизации | Снова выполните `connect` и подтвердите вход через браузер для рабочего пространства, из которого нужно оплачивать вызовы. |
| Вызовы завершаются ошибкой HTTP 402 | Пополните баланс активного рабочего пространства в разделе [Billing](https://www.sandbase.ai/console/billing). |

## Удаление управляемой конфигурации {#remove-the-managed-configuration}

Удалите только запись SandBase для одного клиента:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

Команда удаляет только ту конфигурацию, принадлежность которой SandBase она может подтвердить, и не трогает посторонние записи или записи, которыми управляет пользователь. Затем, если ключ больше не нужен, отзовите соответствующий ключ **CLI Login** в разделе **Developer → API Keys**.

## Исходный код и поддержка {#source-and-support}

- [Исходный код](https://github.com/sandbaseai/cli)
- [Пакет npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Вопросы и примеры](https://github.com/sandbaseai/cli/discussions)
- [Сообщения об ошибках](https://github.com/sandbaseai/cli/issues/new/choose)

## Дальнейшие шаги {#next-steps}

- [Каталог Models и APIs](https://www.sandbase.ai/models)
- [Руководства по Skills](/guides/skills/)
- [Создание Agent](/agents/)
