---
i18nSource: 335b45fb98c53890
title: Respuestas en streaming
description: Transmite en streaming la salida de los modelos de SandBase con los SDK compatibles con OpenAI o Anthropic y maneja de forma segura los resultados parciales.
---

# Respuestas en streaming {#streaming-responses}

El streaming devuelve la salida del modelo a medida que está disponible. SandBase conserva el formato de eventos de la API compatible que
llamas: OpenAI Chat Completions usa Server-Sent Events (SSE) solo con datos, mientras que Anthropic Messages usa eventos SSE con nombre.

Siempre que puedas, usa un SDK oficial compatible. Maneja el enmarcado de eventos, los argumentos incrementales de las llamadas a herramientas y el
cierre del protocolo de forma más segura que si divides tú mismo el texto sin procesar de la respuesta.

## OpenAI Chat Completions {#openai-chat-completions}

Define `stream: true` en `POST /v1/chat/completions`.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

Los fragmentos compatibles con OpenAI colocan el texto incremental en `choices[0].delta.content`. Los argumentos de las llamadas a herramientas, cuando el
modelo seleccionado las admite, llegan como fragmentos de cadena en `delta.tool_calls`; concatena los fragmentos por índice de opción y de llamada a herramienta
antes de analizar el JSON completo. El stream normalmente termina con `data: [DONE]`.

No supongas que todos los proveedores devuelven el uso de tokens en un stream. Si el modelo seleccionado admite
`stream_options.include_usage` de OpenAI, el uso puede aparecer cerca del final; si no, usa la respuesta sin streaming o el
flujo de costo de task que corresponda.

## Anthropic Messages {#anthropic-messages}

Usa el SDK de Anthropic con `POST /v1/messages`. El helper de streaming del SDK ensambla los eventos con nombre y los bloques de contenido.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Los streams sin procesar de Anthropic usan nombres de evento como `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` y `message_stop`. El texto llega en bloques `text_delta`. La entrada de las herramientas usa
bloques JSON incrementales que deben ensamblarse antes de analizarlos.

## Manejar interrupciones y cancelaciones {#handle-interruption-and-cancellation}

Un error HTTP devuelto antes de que empiece el streaming usa el cuerpo de error normal del endpoint. Una vez iniciada la respuesta,
un fallo de red puede dejar texto parcial sin un evento final. Considera la salida completa solo después de la señal de
cierre normal del protocolo.

- Mantén la salida parcial separada del estado confirmado de la aplicación.
- Limita los tiempos de espera de conexión y de inactividad en tu propio cliente o proxy según la carga de trabajo.
- Usa el mecanismo de cancelación del SDK o un `AbortController` en JavaScript cuando el usuario detenga la generación.
- No agregues automáticamente un stream reintentado a la salida parcial; un reintento es una generación nueva.
- Evita el buffering de SSE en los proxies inversos que controlas.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

Al leer SSE sin procesar, analiza tramas de evento completas separadas por líneas en blanco. Los fragmentos de red no corresponden uno a uno
con los eventos SSE, y un carácter UTF-8 puede quedar repartido entre fragmentos. Usa un decodificador de texto en streaming y conserva cualquier trama incompleta
hasta que lleguen más bytes.

## Guías relacionadas {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Manejo de errores](/guides/error-handling)
- [Límites de velocidad](/guides/rate-limiting)
