---
i18nSource: c922bd433deabf32
title: Guías
description: Guías prácticas para usar Models, APIs, Agents y Setup de SandBase, la facturación, el streaming y la fiabilidad en producción.
---

# Guías {#guides}

Estas guías cubren patrones habituales para usar SandBase en producción.

## Llamar a modelos {#call-models}
| Guía | Descripción |
|-------|-------------|
| [Chat Completions](./chat-completions) | Llama a SandBase mediante el protocolo de chat compatible con OpenAI |
| [OpenAI Responses](./openai-responses) | Llama a modelos GPT mediante el protocolo Responses compatible con OpenAI |
| [Anthropic Messages](./anthropic-messages) | Llama a SandBase mediante el protocolo de mensajes compatible con Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | Llama a SandBase mediante el protocolo GenerateContent compatible con Google Gemini |
| [Imagen y video](./image-video) | Genera imágenes y videos mediante la Run API asíncrona compartida |
| [Streaming](./streaming) | Transmite la salida de modelos compatibles a tu aplicación |
| [Catálogo de APIs](https://www.sandbase.ai/apis) | Explora las capacidades de API y sus endpoints con el proveedor indicado |

## Ejecutar en producción {#run-in-production}
| Guía | Descripción |
|-------|-------------|
| [Errores y reintentos](./error-handling) | Clasifica los fallos y reintenta solo cuando sea seguro repetir una operación |
| [Límites de frecuencia](./rate-limiting) | Gestiona las respuestas 429 y suaviza las ráfagas de solicitudes |
| [Límites de concurrencia](./concurrency-limits) | Cuántas tareas puede ejecutar tu organización a la vez |
| [Precios y uso](./billing) | Entiende los créditos, el uso y los controles de costos |

## Consejos rápidos {#quick-tips}

- Usa [Setup](/setup/) cuando el usuario quiera herramientas dentro de Codex, Claude, Cursor o Kiro.
- Usa [Models](https://www.sandbase.ai/models) o [APIs](https://www.sandbase.ai/apis) cuando tu aplicación necesite una sola capacidad.
- Usa [Build Agent](/agents/) cuando el trabajo tenga varios pasos o deba reutilizarse.
- Usa [Activities](https://www.sandbase.ai/console/activities) en la Console para revisar las solicitudes y el uso a la vez.
