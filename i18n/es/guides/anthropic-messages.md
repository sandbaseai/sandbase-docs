---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Usa mensajes, bloques de contenido, herramientas, pensamiento y streaming compatibles con Anthropic en SandBase.
---

# Anthropic Messages {#anthropic-messages}

SandBase ofrece un endpoint compatible con Anthropic en `POST /v1/messages`. Las aplicaciones con el SDK de Anthropic pueden conectarse cambiando la clave de API y la URL base.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Encabezados de autenticación y versión {#authentication-and-version-headers}

Usa `x-api-key` o `Authorization: Bearer …`. Si se envían ambos, `x-api-key` tiene prioridad. El encabezado opcional `anthropic-version` se reenvía al upstream y, si se omite, toma el valor `2023-06-01`. Los valores opcionales de `anthropic-beta` también se reenvían, según la compatibilidad del proveedor.

## Mensajes y bloques de contenido {#messages-and-content-blocks}

Los mensajes usan los roles `user` y `assistant`. Coloca la instrucción del sistema en el campo `system` de nivel superior. El contenido puede ser texto plano o un array de bloques tipados como `text`, `image`, `tool_use` y `tool_result`.

## Herramientas y pensamiento extendido {#tools-and-extended-thinking}

Añade definiciones de herramientas en `tools` y controla la selección con `tool_choice`. Cuando el modelo seleccionado lo admita, configura el razonamiento extendido con `thinking`; conserva los bloques de pensamiento devueltos al continuar la conversación.

## Streaming {#streaming}

Define `stream: true` para recibir eventos SSE al estilo de Anthropic, incluidos `message_start`, los eventos de bloques de contenido, `message_delta` y `message_stop`. SandBase también reenvía los eventos keepalive y los eventos beta definidos por el proveedor. Los consumidores deben ignorar los tipos de evento desconocidos por compatibilidad futura y gestionar los eventos `error` a nivel de protocolo.

## Compatibilidad {#compatibility}

SandBase asigna el nombre público del modelo al proveedor seleccionado. Los demás campos de solicitud compatibles y los bytes de la respuesta se conservan, salvo que ese proveedor tenga una regla de compatibilidad explícita que elimine un campo no admitido o rechace al candidato. Es posible que las funciones beta específicas del proveedor no estén disponibles en todos los modelos. Para ver el esquema completo de solicitud y respuesta, consulta [Crear un mensaje de Anthropic](/api-reference/anthropic-compat).
