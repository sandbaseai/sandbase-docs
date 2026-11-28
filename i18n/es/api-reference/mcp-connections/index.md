---
i18nSource: ee126767f58b111b
title: API de conexiones MCP
description: Registra servidores MCP remotos por HTTPS a los que pueden llamar los Agents.
---

# API de conexiones MCP {#mcp-connections-api}

Una conexión MCP registra un servidor MCP remoto accesible por HTTPS. Los Agents hacen referencia a las conexiones en `mcp_connections`; cada Session congela la configuración de la conexión al iniciarse. Los ID de conexión usan el prefijo `mcp_`. Para autenticarte en el servidor con un Bearer token, crea primero un [Secret](/agents/api-credentials#with-the-api) para la misma URL.

| Método | Ruta | Propósito |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Crear una conexión](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Listar conexiones](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Obtener una conexión](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Reemplazar una conexión](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Habilitar una conexión](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Deshabilitar una conexión](#disable-a-connection) |

Toda escritura requiere `Idempotency-Key` (de 1 a 128 bytes, sin espacios al principio ni al final). El objeto de conexión tiene `id`, `name`, `server_url`, `secret_id` (si está definido), `status` (`active` o `disabled`), `row_version`, `created_at` y `updated_at`.

## Crear una conexión {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` es obligatorio y no puede estar vacío; hasta 128 bytes.
- `server_url` debe ser HTTPS sin información de usuario, query ni fragmento (hasta 2048 bytes).
- `secret_id` es opcional. Omítelo para un servidor anónimo. Si se define, el Secret debe estar `active` y su `server_url` debe coincidir exactamente con este `server_url`; de lo contrario, la solicitud falla (409 para un Secret inactivo, 400 si la URL no coincide).

Devuelve `201 Created`.

## Listar conexiones {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginación por offset con `data`, `total`, `limit` y `offset`. `limit` vale 20 por defecto y tiene un máximo de 200; los valores ausentes, no válidos o no positivos usan 20. `offset` vale 0 por defecto; los valores no válidos o no positivos usan 0. Avanza según el `limit` devuelto hasta que `offset + data.length >= total`. Los recursos deshabilitados siguen apareciendo en la lista.

## Obtener una conexión {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Reemplazar una conexión {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` reemplaza `name`, `server_url` y `secret_id` a la vez; si omites `secret_id`, la conexión pasa a ser anónima. `row_version` es obligatorio y debe coincidir con el valor actual que devuelve Get Connection. Devuelve `200 OK` con la conexión actualizada. Una conexión deshabilitada sigue deshabilitada tras el reemplazo hasta que la habilites.

## Habilitar una conexión {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` es obligatorio y debe ser un entero positivo que coincida con el recurso actual. Devuelve `200 OK` con la conexión. Al habilitarla se conserva el mismo ID de conexión. No restaura un Secret revocado; primero reemplaza la conexión con un Secret activo nuevo.

## Deshabilitar una conexión {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Devuelve `204 No Content` y establece `status` en `disabled`. Las nuevas Sessions no pueden usar la conexión, y las Sessions existentes que la congelaron rechazan más entradas. Una llamada a herramienta que ya está en ejecución no se interrumpe.

## Cambios y Sessions en ejecución {#changes-and-running-sessions}

Las Sessions congelan la configuración de la conexión al iniciarse. Después de reemplazar una conexión o rotar su Secret, las nuevas Sessions usan la nueva configuración y las Sessions existentes conservan su instantánea. Deshabilitar la conexión o revocar su Secret bloquea tanto las nuevas Sessions como las entradas adicionales en las existentes.

## Errores y reintentos {#errors-and-retries}

Los errores usan el [envoltorio de error de Agents](/api-reference/errors#agents-platform-errors). Los campos no válidos o la falta de la clave de idempotencia en una escritura devuelven `400 invalid_request`; un recurso desconocido o inaccesible devuelve `404 not_found`. Un `row_version` obsoleto, un estado de ciclo de vida incompatible o reutilizar una clave de creación/actualización con una entrada distinta devuelven `409 conflict`. Vuelve a leer el recurso antes de emitir una nueva actualización y usa una clave nueva para cada nueva operación de escritura.

`created_at` y `updated_at` son cadenas de marca de tiempo RFC 3339.
