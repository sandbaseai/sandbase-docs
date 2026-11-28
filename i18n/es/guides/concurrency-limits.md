---
i18nSource: fc051d55a0cfa8bd
title: Límites de concurrencia
description: Cuántas tareas puede ejecutar tu organización a la vez, cómo escala el límite con tu nivel de cuenta y cómo gestionar los errores 429 y 402 en los envíos de video.
---

# Límites de concurrencia {#concurrency-limits}

Los límites de concurrencia controlan cuántas tareas puede tener en curso tu organización al mismo tiempo. Cada organización tiene un nivel de cuenta, y ese nivel determina su límite de concurrencia. Cuando alcanzas el límite, los envíos nuevos a los endpoints comprobados que se indican a continuación se rechazan con `429` hasta que termina una de tus tareas en ejecución. No se ponen en cola.

El límite se aplica a toda la organización, en todas sus claves de API. Qué envíos se comprueban depende del endpoint:

- `POST /v1/run` y las llamadas a la Platform API mediante `/v1/api/{vendor}/...` se comprueban para todos los tipos de modelo, incluidas las operaciones de imagen, audio, LLM y APIs de datos.
- Los demás endpoints, como Chat Completions, Responses, Messages, OpenAI Images y los endpoints compatibles con los protocolos de Gemini y Volcengine, solo comprueban los envíos de video.

## Cómo funciona {#how-it-works}

Cuando envías una tarea comprobada, SandBase cuenta las tareas que tu organización tiene en curso, es decir, las tareas en estado `pending` o `running`. Si ese recuento ya está en tu límite, el envío se rechaza de inmediato con `429`. No se crea ninguna tarea y no se cobra nada.

El recuento incluye todas las solicitudes en curso de tu organización, no solo las de video. Un chat completion en streaming que sigue abierto cuando envías una tarea comprobada ocupa un espacio. Si la misma organización ejecuta chats largos en streaming y trabajos de video, tenlos todos en cuenta al planificar la capacidad.

Un espacio se libera en cuanto una tarea llega a un estado final (`completed`, `failed` o `timeout`). No tienes que liberar nada por tu parte. Como los espacios se liberan cuando terminan las tareas y no según un temporizador, este `429` es distinto de un [límite de tasa](/guides/rate-limiting) por minuto. Esperar un intervalo fijo no garantiza un espacio. Espera a que termine una de tus propias tareas.

## Límites por defecto {#default-limits}

Todas las organizaciones nuevas empiezan en **Bronze**, con un límite de 2 tareas simultáneas. Tu nivel sube automáticamente según el importe de una única recarga correcta.

| Nivel | Recarga única | Tareas simultáneas |
|-------|---------------|------------------|
| Bronze | Por defecto | 2 |
| Silver | $10 o más | 10 |
| Gold | $100 o más | 100 |
| Platinum | $500 o más | 500 |
| Diamond | Contacta con ventas | Ilimitadas |

- **Recarga única, no un total acumulado.** Dos recargas de $60 te mantienen en Silver. Una recarga de $100 te sube a Gold.
- **Solo subidas.** Una recarga posterior más pequeña nunca baja tu nivel.
- **Solo recargas pagadas.** Los créditos promocionales, los créditos de registro y los cupones no cambian tu nivel.
- **Efecto inmediato.** El nuevo límite se aplica a tu siguiente envío de video en cuanto el pago se completa.

## Aumentar tu límite {#increasing-your-limit}

La forma más directa de aumentar tu límite es una recarga única que alcance el siguiente umbral de la tabla anterior.

Para más de 500 tareas simultáneas, o para una línea de crédito mensual, escribe a [contact@sandbase.ai](mailto:contact@sandbase.ai) sobre el nivel **Diamond**. Diamond no tiene límite de concurrencia. Lo configura el equipo de SandBase y las recargas nunca lo cambian.

## Comprobación de crédito en envíos de video {#credit-check-on-video-submissions}

Además de la comprobación de concurrencia, SandBase estima el costo de cada tarea de video antes de aceptarla. Si la estimación supera tu crédito disponible (saldo más cualquier línea de crédito), el envío se rechaza con `402`. No se crea ninguna tarea y no se cobra nada.

- Cada envío se compara con tu saldo actual. Las tareas que siguen en ejecución aún no se han cobrado, así que deja margen cuando envíes varios videos a la vez.
- Si el precio de un modelo depende de una salida que solo existe después de ejecutarlo, el costo no se puede estimar por adelantado. El envío se acepta y se factura normalmente cuando termina la tarea.

## Gestionar los errores de concurrencia {#handling-concurrency-errors}

### 429: se alcanzó el límite de concurrencia {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

No se envía el encabezado `Retry-After`. El límite se conoce de antemano, así que lo más fiable es no superarlo nunca. Limita en el cliente el número de tareas de video en curso y envía la siguiente solo cuando termine una anterior:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Si aun así recibes un `429`, por ejemplo porque otro servicio de la misma organización también está enviando tareas, espera y reintenta. Usa backoff exponencial con jitter y abandona tras un número acotado de intentos en lugar de reintentar en un bucle cerrado.

### 402: no hay crédito suficiente para este video {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

No reintentes. Recarga, o elige una duración más corta o una resolución más baja que cueste menos.

### APIs compatibles {#compatible-apis}

Los endpoints compatibles con protocolos devuelven estos errores en su propio formato nativo. Por ejemplo, el endpoint compatible con Volcengine `/api/v3/contents/generations/tasks` devuelve `RateLimitExceeded` para `429` y `AccountOverdueError` para `402`.

## Relacionado {#related}

- [Límites de tasa](/guides/rate-limiting): límites de solicitudes por minuto
- [Precios](/guides/billing): créditos y recargas
- [Errores](/api-reference/errors): todos los códigos de error
