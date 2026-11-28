---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Локальное использование Skill
description: Выберите Skill в SandBase Lab, скачайте его пакет, настройте доступ к моделям, а затем создайте и сохраните проект с помощью локального агента.
---

# Локальное использование Skill {#use-a-skill-locally}

Скачайте Skill SandBase и выполните проект с помощью агента на своём компьютере. Skill содержит инструкции, скрипты и примеры. Агент следует рабочему процессу, описанному в его `SKILL.md`.


## 1. Выберите Skill {#_1-choose-a-skill}

1. Откройте [SandBase Lab](https://www.sandbase.ai/lab/).
2. Просмотрите примеры: видео, анимации, карты. Откройте Skill, подходящий для вашего проекта.
3. Изучите пример, необходимые входные данные, формат результата и поддерживаемые языки.
4. Сохраните ZIP-пакет с помощью кнопки скачивания Skill.

Для фильма-карты об истории города начните с примеров и инструкций [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Подготовьте локальную рабочую папку {#_2-prepare-a-local-working-folder}

1. Создайте папку проекта, например `my-city-film`.
2. Распакуйте в неё весь ZIP-архив Skill, сохранив инструкции, скрипты и ресурсы.
3. Откройте проект в локальном агенте и предоставьте доступ к его файлам и командам, которые нужны рабочему процессу.
4. Следуйте инструкциям по установке на странице Skill или попросите агента напрямую прочитать распакованный `SKILL.md`.

Проект может иметь такую структуру:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Используйте конкретные имена файлов и пути вывода, которые требует Skill.

## 3. Подключите SandBase {#_3-connect-sandbase}

Вставьте в агент `set up https://www.sandbase.ai/SKILL.md` и подтвердите вход в открывшемся окне браузера или выполните в терминале `npx -y @sandbaseai/cli@latest connect`. После этого начните новую сессию агента, чтобы загрузились инструменты SandBase. Те же варианты доступны в Console на странице [Build → AI tools](https://www.sandbase.ai/console/setup).

Полный процесс подключения описан в разделе [Подключение AI-инструментов](/setup/).

Если скриптам Skill нужен `SANDBASE_API_KEY`:

1. Откройте [API Keys](https://www.sandbase.ai/console/keys) и создайте или выберите ключ для проекта.
2. Настройте его через защищённые настройки локального агента или среду выполнения скриптов.
3. Попросите агента проверить, что доступ настроен, и продолжить рабочий процесс Skill.

Храните ключ в защищённой локальной конфигурации. В результаты, исходные файлы и публичные скриншоты включайте только информацию о проекте. Использование моделей и баланс можно посмотреть в разделе [Billing](https://www.sandbase.ai/console/billing).

## 4. Опишите задачу {#_4-provide-a-brief}

Сообщите агенту, какой Skill использовать, что создать, требования к результату и ваш бюджет. Адаптируйте этот пример под свой проект:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Агент читает инструкции, проверяет зависимости, обрабатывает входные данные и генерирует или рендерит проект. Добавьте запрошенные ресурсы в тот же проект и продолжите задачу.

## 5. Следите за ходом работы и проверьте результат {#_5-follow-progress-and-review-the-result}

Длительность зависит от Skill, моделей, ресурсов и длины результата. Видеопроекты могут занимать от десятков минут до нескольких часов. Не останавливайте агента и не давайте компьютеру уйти в спящий режим.

Спрашивайте о ходе работы в том же диалоге:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Откройте переданные пути к файлам, проверьте изображение, звук, субтитры и содержание и сохраните итоговые файлы.

## 6. Доработайте проект {#_6-revise-the-project}

Запрашивайте конкретные изменения в исходной задаче и используйте уже созданные ресурсы:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Если выполнение прервалось, сохраните рабочую папку и попросите агента продолжить с текущего шага.

## Дальнейшие шаги {#next-steps}

- [Участвуйте в AI City Remix](/guides/skills/ai-city-remix)
- [Подключите своего агента](/setup/)
- [Настройте API-ключи](/getting-started/api-keys)
