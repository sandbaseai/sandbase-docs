---
i18nSource: 3ccdc1071b9be798
title: Models API
description: Descubre los metadatos, precios, estado de soporte y capacidades de los modelos de SandBase.
---

# Models API {#models-api}

Usa la Models API para descubrir modelos antes de elegir un endpoint de inferencia. La operación de listado es compatible con OpenAI y devuelve registros de identidad compactos. Obtén un modelo concreto para ver los metadatos de capacidades, esquema y precios de SandBase.

| Operación | Endpoint | Documentación |
|---|---|---|
| Listar modelos | `GET /v1/models` | [Listar modelos](./list) |
| Obtener un modelo | `GET /v1/models/{id_or_name}` | [Obtener modelo](./get) |
| Invocar una capacidad de API por ruta | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Ejecutar un modelo o una capacidad de API | `POST /v1/run` | [Ejecutar capacidad](./run) |
| Obtener un resultado asíncrono | `GET /v1/run/{id}` | [Obtener el resultado de una ejecución](./run-get) |
| Recibir un callback asíncrono | `webhook_url` en `POST /v1/run` | [Callbacks de webhook](./run#webhook-callbacks) |
| Explorar los modelos admitidos | — | [Catálogo de Models](https://www.sandbase.ai/models) |

Para ejecutar un modelo, abre su página de referencia desde el [catálogo de Models](https://www.sandbase.ai/models); cada página muestra el identificador exacto, los campos de la solicitud y los precios. Esta página documenta el descubrimiento, el ejecutor unificado de capacidades, el API passthrough, los assets y la consulta del costo de tareas.

`GET /v1/models` admite `q`, `vendor`, `type` y `order`; no está paginado. Si omites `type`, se usa `llm` por defecto, mientras que un `type=` vacío explícito lista todos los tipos de modelo públicos. El filtro `vendor` es exacto y distingue mayúsculas y minúsculas; `q` es una búsqueda de subcadena que no las distingue. Cada elemento de la lista contiene `id`, `object`, `created` y `owned_by`, donde `id` es el nombre lógico del modelo que se usa en las solicitudes.

Los nombres de modelo pueden contener `/`. Pasa esas barras como separadores de ruta al llamar al endpoint de detalle, por ejemplo `/v1/models/openai/gpt-5.6-luna`; la ruta del servidor toma el resto de la ruta como un único identificador lógico. Obtén el ID actual de `GET /v1/models` en lugar de copiar un identificador de una guía antigua.

Para una respuesta asíncrona `202` de una API de inferencia, consulta `GET /v1/run/{id}` con el ID opaco devuelto. No deduzcas un prefijo de ID ni construyas otra ruta de consulta a partir de los encabezados de compatibilidad.
