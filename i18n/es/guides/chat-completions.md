---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: Usa con SandBase chat completions compatibles con OpenAI, streaming, herramientas, entrada multimodal y salida estructurada.
---

# Chat Completions {#chat-completions}

SandBase ofrece un endpoint de Chat Completions compatible con OpenAI en `POST /v1/chat/completions`. Las aplicaciones que ya usan el SDK de OpenAI pueden usar SandBase cambiando la clave de API y la URL base.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Mensajes y contenido multimodal {#messages-and-multimodal-content}

Envía los mensajes en el orden de la conversación con los roles que admite el proveedor seleccionado, normalmente `system`, `developer`, `user`, `assistant` y `tool`. El texto puede ser una cadena. Los modelos con visión también aceptan partes de contenido como `text` e `image_url`.

## Streaming {#streaming}

Define `stream: true` para recibir Server-Sent Events. Lee cada evento `data:` en orden y concatena `choices[0].delta.content`. El stream termina con `data: [DONE]`. Agrega `stream_options: {"include_usage": true}` cuando el proveedor seleccionado informe el uso en streaming; de lo contrario, es posible que el uso no aparezca.

## Herramientas {#tools}

Define las funciones invocables en `tools`. Cuando el asistente devuelva `tool_calls`, ejecuta cada función en tu aplicación y luego agrega un mensaje `tool` con el `tool_call_id` correspondiente antes de continuar.

## Salida estructurada {#structured-output}

Usa `response_format` para solicitar una respuesta en forma de objeto JSON o con JSON Schema. La compatibilidad varía según el modelo, así que revisa las capacidades del modelo seleccionado antes de depender de una validación estricta del esquema.

## Parámetros específicos del proveedor {#provider-specific-parameters}

SandBase usa `model` y `stream` para el enrutamiento. Los demás campos de solicitud compatibles con OpenAI se conservan cuando el proveedor seleccionado usa el mismo protocolo. Cuando SandBase traduce entre protocolos, usa los campos documentados o `extra_body`; la compatibilidad varía según el proveedor.

## Errores y reintentos {#errors-and-retries}

Usa un backoff limitado para los `429` reintentables y las respuestas transitorias del servidor, solo cuando sea seguro volver a generar. No reintentes automáticamente solicitudes mal formadas, fallos de autenticación ni solicitudes cuyas herramientas puedan haber producido ya efectos secundarios. Consulta [Errores y reintentos](/guides/error-handling). Para ver el esquema completo de campos y respuestas, consulta la [API de Chat Completions](/api-reference/llm-gateway).
