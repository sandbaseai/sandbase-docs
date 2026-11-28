---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Crea, versiona, archiva y clona configuraciones de Agent guardadas.
---

# Agents API {#agents-api}

Un Agent es una configuración guardada y versionada: un modelo, instrucciones, un perfil de runtime, Skills, conexiones MCP y ajustes de salida. Crear o actualizar un Agent no lo ejecuta. Ejecútalo en una [Session](/api-reference/sessions/).

La Agents API sigue el protocolo OpenAI Agents (`client.beta.agents` en el SDK de Python de OpenAI). El encabezado `OpenAI-Beta` es opcional; si lo envías, debe ser `agents=v1`. SandBase añade versiones, actualizaciones de comparar y establecer, archivado y restauración, y un catálogo público.

## Operaciones de Agent {#agent-operations}

| Método | Ruta | Propósito |
|---|---|---|
| `POST` | `/v1/agents` | [Crear un Agent](./create) en la versión 1 |
| `GET` | `/v1/agents` | [Listar Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Obtener un Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Actualizar un Agent](./update) (actualización parcial al estilo del SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Reemplazar con comparar y establecer](./replace) sobre `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Eliminar](./delete), lo que archiva el Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Archivar un Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Desarchivar un Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Restaurar una versión anterior](./restore) como versión nueva |
| `GET` | `/v1/agents/{agent_id}/versions` | [Listar versiones](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Obtener una versión](./get-version) |
| `GET` | `/v1/agents/catalog` | [Explorar el catálogo público](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Clonar un Agent del catálogo](./catalog#clone-a-catalog-agent) en tu organización |

Los IDs de Agent usan el prefijo `agt_`. Los cuerpos de solicitud son JSON estricto de hasta 1 MiB; los campos desconocidos devuelven 400.

## Versiones y actualizaciones {#versions-and-updates}

- Cada escritura efectiva (create, update, replace, restore) produce una versión inmutable. `version` es el número de la versión actual.
- `POST /v1/agents/{agent_id}` es la actualización del SDK de OpenAI. No necesita `row_version`, así que prevalece la última escritura.
- `PATCH /v1/agents/{agent_id}` requiere el `row_version` que leíste por última vez y devuelve 409 si otra persona cambió el Agent antes. Úsalo desde editores y automatizaciones que puedan ejecutarse en paralelo.
- Cada Session congela la versión del Agent, las versiones de Skills y la configuración de conexiones MCP con las que se inició.

## Preparación {#readiness}

Una versión recién escrita indica `projection_status` mientras se prepara para la ejecución. Las Sessions necesitan un Agent activo cuyo `projection_status` sea `ready`; de lo contrario, devuelven 409. Los Agents archivados también devuelven 409 para ejecuciones nuevas.

## Límites actuales {#current-limits}

- `tools` acepta herramientas `function` y como máximo una herramienta `web_search`. Por ahora, la ejecución requiere que `web_search.mode` sea `disabled`.
- Las herramientas de función se pueden guardar, pero los Runs que piden al cliente devolver un resultado de herramienta (`requires_action`) aún no se admiten y aparecen como `502 executor_contract_error`.
- `multi_agent` debe omitirse o ser `null`.

## Paginación {#pagination}

`GET /v1/agents` y el catálogo usan paginación por cursor: `limit` (1-100, por defecto 20), `after` y `order` (`asc` o `desc`, por defecto `desc`). Las respuestas contienen `object: "list"`, `data`, `has_more`, `first_id` y `last_id`; pasa `last_id` como `after` para obtener la página siguiente.

`GET /v1/agents/{agent_id}/versions` usa paginación por desplazamiento: `limit` y `offset`, con `data`, `total`, `limit` y `offset` en la respuesta.

## Errores {#errors}

Los errores usan el sobre de Agents `{"error":{"type","code","param":null,"message"}}`. Consulta [Errores](/api-reference/errors#agents-platform-errors) para ver la lista de códigos.
