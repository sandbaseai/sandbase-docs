---
i18nSource: 0d7d66842e233794
title: Inicio rápido de Sandbox con el SDK de E2B
description: Conecta los SDK oficiales de E2B para JavaScript y Python a SandBase, ejecuta comandos, lee y escribe archivos y gestiona un sandbox de forma segura.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Inicio rápido de Sandbox con el SDK de E2B {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Usa el SDK oficial de E2B con tu clave de API de SandBase para crear un sandbox aislado, ejecutar un comando y leer y escribir archivos. Esta guía está pensada para **E2B JavaScript and Python SDK 2.51.0**.

Para crear y observar desde el navegador, inicia sesión en la [Sandbox Console](https://www.sandbase.ai/console/sandboxes) para crear una instancia y ver su estado, logs y métricas. Continúa con los pasos del SDK que siguen para integrarlo en tu aplicación, o lee la [descripción general del producto Sandbox](https://www.sandbase.ai/sandbox).

## 1. Configura el SDK oficial {#_1-configure-the-official-sdk}

[Crea una clave de API de SandBase en la Console](https://www.sandbase.ai/console/keys) y configura las variables de entorno estándar de E2B. El SDK oficial las lee automáticamente tanto en JavaScript como en Python.

| Variable de entorno | Valor |
|---|---|
| `E2B_API_KEY` | Tu clave de API de SandBase de [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Déjala sin definir para que el SDK use la dirección del plano de datos de cada sandbox |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Si ya guardas la clave en `SANDBASE_API_KEY`, reutilízala:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Solo necesitas tu clave de API de SandBase. Usa una clave normal de SandBase con acceso a Sandbox; una clave restringida a otra capacidad puede ser rechazada. Consulta [Claves de API](/getting-started/api-keys).

### ¿Puede quedarse igual el código de E2B existente? {#can-existing-e2b-code-stay-unchanged}

Sí, para las operaciones admitidas, siempre que tu aplicación ya lea la configuración de conexión del SDK desde el entorno y su plantilla esté disponible en SandBase. Mantén el SDK oficial y tus llamadas actuales; cambia la clave, la URL de la API y el dominio indicados arriba. Las opciones de conexión explícitas en el código de la aplicación tienen prioridad sobre las variables de entorno, así que elimina o actualiza cualquier endpoint, dominio o clave de proveedor de E2B escrito directamente en el código.

Define **ambas** variables, `E2B_API_URL` y `E2B_DOMAIN`. Con solo un dominio, el SDK 2.51.0 deriva un host de API con un prefijo `api.` adicional. `E2B_SANDBOX_URL` sobrescribe la dirección de comandos y archivos de cada instancia; no la definas con el origen de la API de control. El modo de depuración cambia la selección de direcciones del SDK para el desarrollo local, así que mantenlo desactivado para este servicio HTTPS.

La API de control crea y gestiona las instancias. Los comandos, los archivos y los puertos de aplicación usan subdominios por instancia bajo `sandbox.sandbase.ai`. No añadas el prefijo `/v1` de la API de modelos. Una solicitud correcta a la API de control no verifica por sí sola el acceso a comandos y archivos ni todas las funciones del proveedor.

Los ejemplos leen variables de entorno del proceso. Un archivo `.env` solo funciona si tu aplicación o tu lanzador lo carga antes de usar el SDK.

### Elige una plantilla {#choose-a-template}

Usa tu clave de SandBase para listar las plantillas visibles para tu organización:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Elige una plantilla con `buildStatus: "ready"` y copia su `templateID`. Los nombres visibles se indican en `names` o `aliases`; si ambos están vacíos, usa el ID. El campo `public` distingue las plantillas públicas de las plantillas privadas visibles para tu organización.

La respuesta es un array. Si los encabezados de respuesta incluyen `X-Next-Token`, pasa su valor como parámetro de consulta `nextToken` para obtener la página siguiente.

Define el ID de la plantilla seleccionada:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` es una variable que usan los ejemplos siguientes, no un ajuste integrado del SDK de E2B. Los ejemplos la pasan explícitamente a `Sandbox.create`. El código existente puede conservar su argumento de plantilla si ese ID o nombre está disponible en SandBase. No supongas que un ID de plantilla de E2B upstream o la plantilla por defecto del SDK, `base`, están disponibles; si la lista está vacía, solicita acceso a plantillas para tu organización.

## 2. Crea, ejecuta y limpia {#_2-create-execute-and-clean-up}

Estos ejemplos crean un recurso real. Usan una vida útil de dos minutos y eliminan la instancia explícitamente en `finally`. Ejecuta primero un ejemplo y confirma la limpieza antes de volver a ejecutarlo.

### JavaScript {#javascript}

Usa Node.js 22 o posterior en un directorio de aplicación:

```bash
npm install --save-exact e2b@2.51.0
```

Guárdalo como `sandbox-example.mjs`:

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

Ejecútalo con las variables de entorno del SDK y la plantilla seleccionada configuradas:

```bash
node sandbox-example.mjs
```

### Python {#python}

Instala la versión fijada del SDK en tu entorno de Python:

```bash
python -m pip install 'e2b==2.51.0'
```

Guárdalo como `sandbox_example.py`:

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

El éxito significa que se completaron tanto la verificación de comandos y archivos como la limpieza. Mantén los IDs de ejecución y de sandbox dentro de tu organización. No registres en logs el objeto del SDK: puede contener tokens de acceso.

Si la creación agota el tiempo de espera sin devolver un ID, el recurso puede existir igualmente. Pide a tu operador que lo localice con los metadatos `quickstartRunId` antes de crear otro. Un tiempo de espera agotado o un proceso interrumpido no confirma la eliminación; `finally` no se ejecuta tras una terminación forzada del proceso.

## 3. Amplía la vida útil o pausa y reconéctate {#_3-extend-the-lifetime-or-pause-and-reconnect}

Inserta estos fragmentos dentro del bloque `try` del ejemplo correspondiente, después de la comprobación de archivos y antes de la limpieza. La plantilla y el proveedor seleccionados deben admitir pausar y reanudar.

JavaScript usa **milisegundos** para estos tiempos de espera del SDK:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python usa **segundos**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

La reconexión devuelve un objeto del SDK nuevo y credenciales de sesión nuevas. Usa ese objeto para los comandos y archivos posteriores. Eliminar un sandbox termina su ciclo de vida; esta guía no garantiza la persistencia del almacenamiento tras la eliminación. La vida útil del sandbox y el tiempo de espera de un comando o una solicitud HTTP individual son ajustes distintos.

## 4. Accede a los puertos de la aplicación {#_4-access-application-ports}

Cuando tu aplicación esté escuchando dentro del sandbox, usa `sandbox.getHost(port)` en JavaScript o `sandbox.get_host(port)` en Python para obtener su host. El tráfico de la aplicación requiere el encabezado `e2b-traffic-access-token`, con `sandbox.trafficAccessToken` o `sandbox.traffic_access_token` de la conexión actual.

El host por sí solo no autoriza el acceso. Tu cliente HTTP o WebSocket debe enviar el encabezado; abrir la URL en una pestaña del navegador no lo añade. Trata los tokens de tráfico y las URLs de archivo firmadas como credenciales, y mantenlos fuera de los logs y de los enlaces compartidos. El entorno de sandbox seleccionado debe admitir el acceso a puertos.

## Solución de problemas {#troubleshooting}

| Síntoma | Qué revisar |
|---|---|
| Error de autenticación o de alcance | Validez de la clave de SandBase, acceso de la organización y alcance de la clave |
| Plantilla no encontrada | El ID o nombre exacto de la plantilla habilitada y su visibilidad para tu organización |
| La creación funciona pero fallan los comandos o archivos | Tu conexión de red y las credenciales de sesión actuales; reconéctate y contacta con soporte si el problema persiste |
| Las solicitudes van al servicio equivocado | `E2B_API_URL`, `E2B_DOMAIN` y cualquier opción del SDK escrita en el código que las sobrescriba |
| El acceso falla tras pausar | Reconéctate y usa el objeto del SDK recién devuelto |
| El puerto de la aplicación rechaza una solicitud | Que la aplicación esté lista y el encabezado del token de tráfico actual |
| `unsupported_operation` | El proveedor seleccionado no admite esa operación; comprueba la disponibilidad antes de depender de ella |
| Se desconoce la respuesta de creación | Concilia el ID de ejecución registrado antes de crear otra instancia |
| Falla la limpieza | Reintenta la eliminación del ID de instancia registrado; no vuelvas a ejecutar todo el flujo de creación |

Los ejemplos cubren el flujo básico de comandos y archivos. La compilación de plantillas, las instantáneas, los eventos, los webhooks y las redes avanzadas requieren comprobaciones de capacidad por separado. Instalar un SDK de E2B no demuestra por sí solo la compatibilidad total con todos los proveedores.

## Referencias del SDK {#sdk-references}

- [Documentación de E2B](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
