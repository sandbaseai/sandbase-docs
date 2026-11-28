---
i18nSource: 0ca53876f04eb96d
title: Primera llamada a la API
description: Recorrido detallado para hacer tu primera llamada a la API de SandBase y entender la anatomía de la solicitud, la estructura de la respuesta y el streaming.
---

# Primera llamada a la API {#first-api-call}

Esta guía explica en detalle la anatomía de una solicitud y una respuesta de la API de SandBase. Al terminar, entenderás cada campo del cuerpo de la solicitud, cómo leer la respuesta y cómo usar streaming.

## Antes de empezar {#before-you-start}

Necesitas una organización activa de SandBase, una [clave de API](/getting-started/api-keys) y un ID de modelo del [catálogo de modelos](https://www.sandbase.ai/models). Exporta la clave para que los ejemplos no incluyan secretos en el código fuente:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Empieza con una solicitud sin streaming. Cuando la autenticación y el manejo de la respuesta funcionen, agrega streaming y la lógica de reintentos para producción.

## Anatomía de la solicitud {#request-anatomy}

Este recorrido usa la ruta de Chat Completions compatible con OpenAI:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Encabezados obligatorios {#required-headers}

| Encabezado | Valor | Descripción |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | Tu clave de API de SandBase |
| `Content-Type` | `application/json` | Formato del cuerpo de la solicitud |

### Cuerpo de la solicitud {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Parámetros del cuerpo {#body-parameters}

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|----------|-------------|
| `model` | string | Sí | Un ID de modelo habilitado que devuelve `GET /v1/models` (por ejemplo, `deepseek/deepseek-v4-flash`) |
| `messages` | array | Sí | Historial de la conversación como un array de objetos de mensaje |
| `temperature` | number | No | Temperatura de muestreo (0–2). La compatibilidad y los valores predeterminados pueden variar según el modelo. |
| `max_tokens` | integer | No | Máximo de tokens que se generan en la respuesta |
| `top_p` | number | No | Parámetro de muestreo de núcleo (0–1) |
| `stream` | boolean | No | Si la respuesta se transmite en streaming. Predeterminado: `false` |
| `stop` | string or array | No | Secuencias de parada: la generación se detiene al encontrarlas |
| `frequency_penalty` | number | No | Penalización por repetición compatible con el proveedor, si se admite |
| `presence_penalty` | number | No | Penalización por presencia compatible con el proveedor, si se admite |

### Roles de los mensajes {#message-roles}

| Rol | Propósito |
|------|---------|
| `system` | Define el comportamiento y la personalidad del asistente |
| `user` | La entrada de la persona |
| `assistant` | Respuestas anteriores del asistente (para conversaciones de varios turnos) |
| `developer`, `tool` | Roles adicionales compatibles con OpenAI, si el modelo y la ruta seleccionados los admiten |

## Ejemplo completo de solicitud {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Estructura de la respuesta {#response-structure}

### Respuesta típica sin streaming {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Explicación de los campos de la respuesta {#response-fields-explained}

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único de esta completion |
| `object` | Objeto de respuesta compatible con OpenAI, normalmente `"chat.completion"` en esta ruta |
| `created` | Marca de tiempo Unix del momento en que se generó la respuesta |
| `model` | El modelo que generó la respuesta |
| `choices` | Array de opciones de completion (normalmente una) |
| `choices[].index` | Índice de esta opción en el array |
| `choices[].message.role` | Rol devuelto para el mensaje generado, normalmente `"assistant"` |
| `choices[].message.content` | El texto generado |
| `choices[].finish_reason` | Por qué se detuvo la generación (ver más abajo) |
| `usage.prompt_tokens` | Tokens de tu entrada |
| `usage.completion_tokens` | Tokens de la salida generada |
| `usage.total_tokens` | Suma de los tokens de prompt y de completion |

### Motivos de finalización {#finish-reasons}

Los motivos de finalización dependen del proveedor. Entre los valores comunes compatibles con OpenAI están:

| Valor | Significado habitual |
|-------|---------|
| `stop` | Fin natural de la respuesta o se encontró una secuencia de parada |
| `length` | Se alcanzó el límite de `max_tokens`: la respuesta quedó truncada |

Trata los valores desconocidos como salida válida del proveedor en lugar de rechazar la respuesta.

## Respuestas en streaming {#streaming-responses}

Para obtener salida en tiempo real (como un chatbot que va escribiendo), usa streaming. La respuesta llega como Server-Sent Events (SSE):

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Formato SSE del streaming {#streaming-sse-format}

Un stream compatible suele emitir Server-Sent Events como estos:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Puntos clave:

- consume los fragmentos en orden y concatena los fragmentos de `delta.content`
- tolera fragmentos que solo contienen metadatos, deltas vacíos y campos compatibles con el proveedor que no reconozcas
- detente cuando se cierre el stream o llegue su marcador final; Chat Completions suele usar `data: [DONE]`
- no supongas que todos los modelos emiten exactamente la misma forma en el primer o el último fragmento

## Usar el SDK de Anthropic {#using-the-anthropic-sdk}

SandBase también expone un endpoint compatible con Anthropic en `POST /v1/messages`. Usa el SDK de Anthropic cambiando `base_url`:

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Estructura de la respuesta de Anthropic {#anthropic-response-structure}

El endpoint compatible con Anthropic devuelve una respuesta al estilo de Anthropic. Una respuesta de texto típica se ve así:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Campo | Descripción |
|-------|-------------|
| `id` | ID del mensaje (con el prefijo `msg_`) |
| `type` | Tipo de objeto del mensaje, normalmente `"message"` |
| `role` | Rol del mensaje generado, normalmente `"assistant"` |
| `content` | Array de bloques de contenido tipados; no supongas que todos los bloques son texto |
| `model` | El modelo que generó la respuesta |
| `stop_reason` | `"end_turn"` (parada natural), `"max_tokens"` (se alcanzó el límite) o `"stop_sequence"` |
| `usage.input_tokens` | Tokens de tu entrada |
| `usage.output_tokens` | Tokens de la salida generada |

### Streaming con Anthropic {#anthropic-streaming}

El streaming con el SDK de Anthropic funciona igual: solo pasa `stream=True`:

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Elegir un modelo {#choosing-a-model}

Al elegir un modelo, revisa su ficha en tiempo real para conocer la disponibilidad, los precios, la longitud de contexto, las entradas admitidas y las capacidades. Estos valores cambian de forma independiente, así que no te bases en una comparación de modelos copiada.

- Explora el [catálogo de modelos](https://www.sandbase.ai/models) actual.
- Abre la página de un modelo en el catálogo para ver sus campos de solicitud específicos.
- Consulta `GET /v1/models` cuando una integración necesite obtener por código los metadatos actuales de los modelos.

En los modelos que comparten la misma interfaz compatible, cambiar de modelo suele empezar por el parámetro `model`. Vuelve a revisar las capacidades y el esquema del modelo seleccionado antes de reutilizar campos opcionales, herramientas, entradas multimedia o configuraciones de salida estructurada.

## Próximos pasos {#next-steps}

Antes de pasar a producción, define tiempos de espera para las solicitudes, reintenta solo los fallos transitorios con backoff exponencial limitado, registra los IDs de solicitud cuando estén disponibles y supervisa el uso sin registrar prompts ni claves de API.

- [**Referencia de la API**](/api-reference/): endpoints de inferencia y contratos de la API de la plataforma
- [**Guía de streaming**](/guides/streaming): patrones avanzados de streaming y manejo de errores
- [**Modelos**](https://www.sandbase.ai/models): descubrimiento de modelos, capacidades y precios actuales
- [**Errores**](/guides/error-handling): manejo de fallos y reintentos
