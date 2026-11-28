---
i18nSource: 0d7d66842e233794
title: Быстрый старт Sandbox с E2B SDK
description: Подключите официальные E2B SDK для JavaScript и Python к SandBase, выполняйте команды, читайте и записывайте файлы и безопасно управляйте песочницей.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Быстрый старт Sandbox с E2B SDK {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Используйте официальный E2B SDK с API-ключом SandBase, чтобы создать изолированную песочницу, выполнить команду, а также читать и записывать файлы. Руководство рассчитано на **E2B JavaScript и Python SDK 2.51.0**.

Чтобы создавать экземпляры и наблюдать за ними в браузере, войдите в [Sandbox Console](https://www.sandbase.ai/console/sandboxes): там можно создать экземпляр и посмотреть его статус, логи и метрики. Для интеграции с приложением выполните шаги с SDK ниже или прочитайте [обзор продукта Sandbox](https://www.sandbase.ai/sandbox).

## 1. Настройка официального SDK {#_1-configure-the-official-sdk}

[Создайте API-ключ SandBase в Console](https://www.sandbase.ai/console/keys), затем задайте стандартные переменные окружения E2B. Официальный SDK автоматически читает их и в JavaScript, и в Python.

| Переменная окружения | Значение |
|---|---|
| `E2B_API_KEY` | Ваш API-ключ SandBase из [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Не задавайте, чтобы SDK использовал адрес плоскости данных каждой песочницы |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Если ключ уже хранится в `SANDBASE_API_KEY`, используйте его повторно:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Вам нужен только API-ключ SandBase. Используйте обычный ключ SandBase с доступом к Sandbox; ключ, ограниченный другой возможностью, может быть отклонён. См. [API-ключи](/getting-started/api-keys).

### Можно ли оставить существующий код E2B без изменений? {#can-existing-e2b-code-stay-unchanged}

Да, для поддерживаемых операций, если ваше приложение уже читает параметры подключения SDK из окружения, а его шаблон доступен в SandBase. Оставьте официальный SDK и существующие вызовы; измените ключ, URL API и домен, указанные выше. Явные параметры подключения в коде приложения имеют приоритет над переменными окружения, поэтому удалите или обновите жёстко заданные эндпоинт, домен или ключ провайдера E2B.

Задайте **обе** переменные: `E2B_API_URL` и `E2B_DOMAIN`. Если указан только домен, SDK 2.51.0 формирует хост API с дополнительным префиксом `api.`. `E2B_SANDBOX_URL` переопределяет адрес команд и файлов для отдельного экземпляра; не задавайте в нём адрес управляющего API. Режим отладки меняет выбор адресов в SDK для локальной разработки, поэтому для этого HTTPS-сервиса держите его выключенным.

Управляющий API создаёт экземпляры и управляет ими. Команды, файлы и порты приложений используют поддомены отдельных экземпляров в `sandbox.sandbase.ai`. Не добавляйте префикс `/v1` из API моделей. Один успешный запрос к управляющему API ещё не подтверждает доступ к командам и файлам или наличие всех функций провайдера.

Примеры читают переменные окружения процесса. Файл `.env` работает, только если ваше приложение или средство запуска загружает его до использования SDK.

### Выбор шаблона {#choose-a-template}

С помощью ключа SandBase получите список шаблонов, доступных вашей организации:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Выберите шаблон с `buildStatus: "ready"` и скопируйте его `templateID`. Отображаемые имена указаны в `names` или `aliases`; если оба поля пусты, используйте ID. Поле `public` отличает публичные шаблоны от приватных, доступных вашей организации.

Ответ представляет собой массив. Если заголовки ответа содержат `X-Next-Token`, передайте его значение в параметре запроса `nextToken`, чтобы получить следующую страницу.

Задайте ID выбранного шаблона:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` — переменная, которую используют примеры ниже, а не встроенный параметр E2B SDK. Примеры явно передают её в `Sandbox.create`. Существующий код может сохранить свой аргумент шаблона, если такой ID или имя доступны в SandBase. Не рассчитывайте на доступность ID шаблона из исходного E2B или шаблона SDK по умолчанию `base`; если список пуст, запросите доступ к шаблонам для своей организации.

## 2. Создание, выполнение и очистка {#_2-create-execute-and-clean-up}

Эти примеры создают реальный ресурс. Они задают время жизни в две минуты и явно удаляют экземпляр в `finally`. Сначала запустите один пример и убедитесь, что очистка прошла, прежде чем запускать его снова.

### JavaScript {#javascript}

Используйте Node.js 22 или новее в каталоге приложения:

```bash
npm install --save-exact e2b@2.51.0
```

Сохраните как `sandbox-example.mjs`:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

Запустите, предварительно настроив переменные окружения SDK и выбранный шаблон:

```bash
node sandbox-example.mjs
```

### Python {#python}

Установите SDK зафиксированной версии в своё окружение Python:

```bash
python -m pip install 'e2b==2.51.0'
```

Сохраните как `sandbox_example.py`:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

Успех означает, что и проверка команд и файлов, и очистка завершены. Не передавайте ID запусков и песочниц за пределы своей организации. Не записывайте в лог объект SDK: он может содержать токены доступа.

Если при создании истекло время ожидания и ID не получен, ресурс всё равно может существовать. Попросите оператора найти его по метаданным `quickstartRunId`, прежде чем создавать новый. Тайм-аут или прерванный процесс не подтверждают удаление; `finally` не выполнится после принудительного завершения процесса.

## 3. Продление времени жизни или пауза и повторное подключение {#_3-extend-the-lifetime-or-pause-and-reconnect}

Вставьте эти фрагменты в блок `try` соответствующего примера после проверки файла и перед очисткой. Пауза и возобновление должны поддерживаться выбранным шаблоном и провайдером.

В JavaScript эти тайм-ауты SDK задаются в **миллисекундах**:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

В Python — в **секундах**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Повторное подключение возвращает новый объект SDK и новые учётные данные сеанса. Используйте этот объект для последующих команд и файлов. Удаление песочницы завершает её жизненный цикл; это руководство не гарантирует сохранность хранилища после удаления. Время жизни песочницы и тайм-аут отдельной команды или HTTP-запроса — разные параметры.

## 4. Доступ к портам приложения {#_4-access-application-ports}

Когда приложение внутри песочницы начнёт прослушивать порт, получите его хост с помощью `sandbox.getHost(port)` в JavaScript или `sandbox.get_host(port)` в Python. Трафик приложения требует заголовка `e2b-traffic-access-token` со значением `sandbox.trafficAccessToken` или `sandbox.traffic_access_token` из текущего подключения.

Сам по себе хост не даёт доступа. Ваш HTTP- или WebSocket-клиент должен отправлять этот заголовок; если просто открыть URL во вкладке браузера, заголовок не добавится. Относитесь к токенам трафика и подписанным URL файлов как к учётным данным и не допускайте их попадания в логи и общие ссылки. Доступ к портам должен поддерживаться выбранной средой песочницы.

## Устранение неполадок {#troubleshooting}

| Симптом | Что проверить |
|---|---|
| Ошибка аутентификации или области действия | Действительность ключа SandBase, доступ организации и область действия ключа |
| Шаблон не найден | Точный ID или имя включённого шаблона и его доступность для вашей организации |
| Создание проходит, но команды или файлы не работают | Сетевое подключение и текущие учётные данные сеанса; подключитесь повторно и обратитесь в поддержку, если проблема не исчезнет |
| Запросы уходят не в тот сервис | `E2B_API_URL`, `E2B_DOMAIN` и жёстко заданные параметры SDK, которые их переопределяют |
| Доступ не работает после паузы | Подключитесь повторно и используйте новый возвращённый объект SDK |
| Порт приложения отклоняет запрос | Готовность приложения и текущий заголовок с токеном трафика |
| `unsupported_operation` | Выбранный провайдер не поддерживает эту операцию; проверьте доступность, прежде чем на неё полагаться |
| Результат создания неизвестен | Сверьтесь с записанным ID запуска, прежде чем создавать новый экземпляр |
| Очистка не удалась | Повторите удаление для записанного ID экземпляра; не запускайте заново весь процесс создания |

Примеры охватывают базовый сценарий работы с командами и файлами. Сборка шаблонов, снимки, события, вебхуки и расширенные сетевые возможности требуют отдельной проверки поддержки. Сама по себе установка E2B SDK не доказывает полной совместимости с каждым провайдером.

## Справочники SDK {#sdk-references}

- [Документация E2B](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
