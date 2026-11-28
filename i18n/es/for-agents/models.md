---
i18nSource: b95a8cd6f82c3a9a
title: Modelos y precios legibles por IA
description: Descubre los modelos, capacidades, esquemas y precios actuales de SandBase mediante la Models API.
---

# Modelos y precios {#models-pricing}

Todos los modelos son accesibles con una sola API key de SandBase. La disponibilidad, los esquemas, las capacidades, los límites de contexto
y los precios de los modelos pueden cambiar de forma independiente.

::: info Usa los metadatos de modelos en vivo
Usa siempre `GET /v1/models` y `GET /v1/models/{id_or_name}` para obtener datos actuales y fiables. No deduzcas que todos los
LLM admiten streaming, visión, herramientas, salida estructurada o caché, y no copies los campos de entrada ni los
precios de un modelo a otro.
:::

## Respuestas del catálogo y de detalle {#catalog-and-detail-responses}

`GET /v1/models` devuelve registros de identidad compatibles con OpenAI que contienen `id`, `object`, `created` y `owned_by`.
Omite intencionadamente los metadatos de capacidades, esquema y precios de SandBase.

`GET /v1/models/{id_or_name}` añade `unified_schema`, `supported_modes` y `model_card`. Lee los precios detallados en
`model_card`; no hay un objeto `pricing` de nivel superior. Trata `capability_tags`, `supported_modes` y
`unified_schema` como específicos de cada modelo.

## Descubrir modelos {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

El endpoint de listado admite `q`, `vendor`, `type` y `order`; no está paginado y usa `type=llm` de forma predeterminada.
Devuelve elementos compatibles con OpenAI con `id`, `object`, `created` y `owned_by`. Usa el `id` devuelto como
nombre del modelo al solicitar detalles o invocar el modelo.

Para cualquier respuesta asíncrona `202`, consulta `GET /v1/run/{id}` con el ID devuelto. Trata el ID como opaco; no
deduzcas su formato ni construyas una ruta de consulta distinta a partir de un prefijo del ID o de un encabezado de compatibilidad.

## Inspeccionar un modelo {#inspect-one-model}

Los nombres de modelo están calificados con el proveedor y pueden contener `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Antes de ejecutar, inspecciona:

- `enabled` y `execution_mode`
- `capability_tags` y `supported_modes`
- `unified_schema` para los campos de solicitud aceptados
- `model_card` para la fórmula de precios actual y los multiplicadores de tokens o caché

## Consultar el costo real de una tarea {#check-actual-task-cost}

Para una tarea completada o en curso, consulta el costo registrado en lugar de recalcularlo a partir de una tabla desactualizada:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Consulta la [referencia de la Models API](/api-reference/models/) para los contratos de respuesta y la
[Guía de errores](/for-agents/errors) para orientación sobre formatos de respuesta y reintentos.
