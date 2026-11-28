---
i18nSource: d326fdb78ea64bdf
title: Límites de frecuencia
description: Gestiona de forma segura los límites de frecuencia de la API de SandBase con reintentos acotados, jitter, colas y solicitudes que tienen en cuenta la idempotencia.
---

# Límites de frecuencia {#rate-limits}

SandBase puede asignar a tu organización un límite de solicitudes por minuto. Lo comparten todas las API keys de la organización
y se cuenta en una ventana deslizante de un minuto. Los proveedores de modelos de origen también pueden devolver sus propias
respuestas `429 Too Many Requests`. No fijes una cuota en el código salvo que SandBase haya asignado una a tu carga de trabajo.

## El límite de tu organización {#your-organization-s-limit}
SandBase no publica un número fijo de solicitudes por minuto, porque el límite se asigna por organización. Todas las
API keys de la organización cuentan para el mismo límite, así que crear más claves no lo aumenta. Actualmente, el límite no
se muestra en la API pública ni en la Console.

Si tu carga de trabajo necesita un límite garantizado o más alto, contacta con el soporte de SandBase indicando la organización, la aplicación,
la tasa sostenida esperada y la tasa de ráfaga esperada. No diseñes un cliente de producción en torno a un valor numérico predeterminado no documentado.

## Gestionar una respuesta 429 {#handle-a-429-response}

Las respuestas de límite de frecuencia de `/v1/*` generadas por la plataforma usan un cuerpo de error plano:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

El límite de la organización se aplica a `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload` y a los endpoints de Gemini `generateContent`, `streamGenerateContent` y `POST /v1beta/interactions`. Los endpoints de sondeo, como
`GET /v1/run/{id}`, no cuentan. Los endpoints compatibles con otros protocolos devuelven el mismo `429` en su propio envoltorio de error,
como la forma de error de Anthropic o de Google. Una respuesta originada en el proveedor puede usar la forma de error del endpoint compatible
y puede incluir los encabezados de límite de frecuencia del proveedor.

No se garantizan los encabezados `Retry-After` ni los de cuota restante. Si `Retry-After` está presente, respétalo. Si no, usa
retroceso exponencial con jitter y un número máximo de intentos.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

El SDK de OpenAI también admite reintentos integrados mediante `max_retries`. Elige de forma deliberada entre los reintentos del SDK o un bucle de reintentos
en la aplicación para que los reintentos no se multipliquen entre capas.

## Reintentar solo operaciones seguras {#retry-only-safe-operations}

Una solicitud de inferencia repetida puede crear una segunda generación y generar un costo adicional. Reintenta solo cuando tu
aplicación acepte la regeneración. No reintentes automáticamente una solicitud que cambia el estado salvo que la operación documente
idempotencia o tu aplicación pueda demostrar que el primer intento no tuvo éxito.

En las solicitudes de streaming, un `429` normalmente llega antes de que empiece el flujo. Una vez que han llegado bytes, trata una desconexión
como una generación interrumpida en lugar de suponer un error de límite de frecuencia. Conserva o descarta la salida parcial según
los requisitos de tu producto; volver a empezar crea una generación nueva.

## Controlar el rendimiento {#control-throughput}

- Limita la concurrencia en lugar de lanzar de golpe un lote sin límite.
- Pon en cola el trabajo a ráfagas y suaviza la tasa de envío.
- Evita las solicitudes duplicadas y guarda en caché los resultados reutilizables cuando los requisitos de privacidad y actualidad lo permitan.
- Usa claves separadas para la propiedad, los controles de gasto y la revocación, no para eludir los límites de la plataforma.
- Registra el endpoint, el modelo, el estado HTTP y el cuerpo de error saneado para la resolución de problemas.
- Contacta con el soporte de SandBase cuando una carga de trabajo necesite un límite de capacidad asignado o más alto.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

La concurrencia no es lo mismo que las solicitudes por minuto. Ajusta ambas según la latencia observada y la capacidad asignada a
tu aplicación.

::: info Llamadas gratuitas diarias a la API
Las 100 llamadas gratuitas a APIs de datos por día UTC de la organización son una cuota de facturación, no un límite de frecuencia. Las llamadas que la superan
se facturan por llamada en lugar de rechazarse. Consulta [Llamadas gratuitas diarias a la API](/guides/billing#daily-free-api-calls).
:::

::: tip Tareas de video
Los envíos de video también están limitados por el número de tareas que tu organización puede ejecutar a la vez, según el nivel de su cuenta.
Ese `429` indica `organization concurrency limit exceeded` y se libera cuando termina una tarea en ejecución, no tras un tiempo fijo. Consulta
[Límites de concurrencia](/guides/concurrency-limits).
:::

## Guías relacionadas {#related-guidance}

- [Gestión de errores](/guides/error-handling)
- [Streaming](/guides/streaming)
- [Referencia de errores de la API](/api-reference/errors)
- [API keys](/getting-started/api-keys)
