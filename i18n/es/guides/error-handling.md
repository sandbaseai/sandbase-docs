---
i18nSource: f63049c1cf01130e
title: Errores y reintentos
description: Clasifica los fallos de la API de SandBase, decide cuándo es seguro reintentar y conserva diagnósticos útiles sin exponer secretos.
---

# Errores y reintentos {#errors-and-retries}

Gestiona los errores según el estado HTTP, la familia del endpoint y la semántica de la operación. SandBase expone varios protocolos compatibles,
así que no hay una única forma de JSON de error compartida por todos los endpoints.

## Lee la forma de error del endpoint {#read-the-endpoint-s-error-shape}

- Las operaciones compatibles con OpenAI normalmente devuelven un objeto `error` con un mensaje y un tipo.
- Anthropic Messages devuelve sobres de error compatibles con Anthropic.
- Las operaciones principales de la plataforma pueden devolver un cuerpo plano `{ "error": "..." }` o un error documentado específico del recurso.
- Las operaciones de Google y las nativas del proveedor conservan la forma de su protocolo compatible cuando así se documenta.

Usa el estado HTTP y el cuerpo documentado de la respuesta. No exijas campos opcionales como `code`, `param` o
`request_id` a menos que el endpoint seleccionado los garantice. Consulta la [referencia de errores de la API](/api-reference/errors) para ver
ejemplos y la [especificación OpenAPI](/openapi.yaml) para las respuestas específicas de cada operación.

## Decide qué hacer según el estado {#decide-what-to-do-by-status}

| Estado | Causa habitual | Acción recomendada |
|---|---|---|
| `400` / `422` | Cuerpo o parámetro no válido, o capacidad del modelo no admitida | Corrige la solicitud antes de reintentar. |
| `401` | Credencial ausente, no válida, caducada o revocada | Reemplaza la credencial. |
| `402` | El estado de facturación no permite la solicitud | Resuelve el saldo de la cuenta o el control de gasto. |
| `403` | El alcance de la credencial o el acceso al recurso es insuficiente | Usa una clave o un recurso autorizado. |
| `404` | No se encontró el modelo, la tarea o el recurso de la plataforma | Verifica el identificador y la organización. |
| `409` | Conflicto por el estado del recurso o por una operación concurrente | Lee el estado actual y luego decide si reintentar. |
| `429` | SandBase o un proveedor upstream limitó la solicitud | Respeta `Retry-After` cuando esté presente; si no, aplica backoff con jitter. |
| `500` / `502` / `503` / `504` | Fallo interno, upstream o de disponibilidad temporal | Reintenta solo si repetir la operación es seguro. |

Esta tabla es una guía de manejo, no una garantía de que todos los endpoints emitan todos los estados.

## Usa una política de reintentos acotada {#use-a-bounded-retry-policy}

Para una solicitud que se puede repetir de forma segura, usa backoff exponencial con jitter, limita la espera y aplica un presupuesto total de solicitudes.
Desactiva los reintentos del SDK si una capa externa de la aplicación ya reintenta, o ten en cuenta ambas capas al fijar el presupuesto.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Cuando una respuesta incluya `Retry-After`, analízalo y respétalo en lugar de usar la espera de respaldo. Mantén la política
configurable; el número de intentos y el plazo adecuados dependen de la latencia y el presupuesto de costo de quien llama.

## Protégete contra efectos secundarios duplicados {#protect-against-duplicate-side-effects}

Repetir una solicitud de inferencia crea una nueva generación y puede implicar un costo adicional. Solo es aceptable cuando la
aplicación necesita cualquier respuesta válida y puede tolerar la regeneración.

Sé más conservador con las operaciones que crean, actualizan, eliminan, publican, programan o invocan trabajo:

- usa el soporte de idempotencia documentado cuando el endpoint lo ofrezca;
- si no, lee el estado actual antes de repetir una solicitud ambigua;
- nunca repitas una llamada a herramienta solo porque se desconectó el flujo del modelo que la contenía;
- guarda un ID de operación del cliente en tu propio sistema cuando necesites conciliar reintentos.

## Gestiona por separado los tiempos de espera y los flujos {#handle-timeouts-and-streams-separately}

Un tiempo de espera agotado no demuestra que el servidor dejara de procesar la solicitud. Antes de reintentar una operación asíncrona o que cambie el estado,
consulta el estado documentado de su recurso o tarea siempre que sea posible.

En las respuestas en streaming, distingue un error HTTP antes de que empiece el flujo de una desconexión tras una salida parcial.
Solo la señal de terminación normal del protocolo demuestra que el flujo está completo. Consulta [Respuestas en streaming](/guides/streaming).

## Registra diagnósticos útiles y seguros {#log-useful-safe-diagnostics}

Registra:

- el endpoint y el identificador del modelo;
- el estado HTTP y el tipo de error compatible cuando esté presente;
- el identificador del proveedor o de la solicitud cuando se devuelva;
- el número de intentos, el tiempo transcurrido y si llegó algún byte de respuesta.

No registres API keys, valores de credenciales, prompts sensibles completos ni respuestas del proveedor sin censurar. Muestra a los usuarios un mensaje breve
y accionable, y conserva diagnósticos saneados para los operadores.

## Guías relacionadas {#related-guidance}

- [Referencia de errores de la API](/api-reference/errors)
- [Límites de frecuencia](/guides/rate-limiting)
- [Respuestas en streaming](/guides/streaming)
- [Autenticación](/api-reference/authentication)
