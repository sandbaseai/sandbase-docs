---
i18nSource: dab112fdbbc56799
title: Credenciales para herramientas MCP
description: Guarda tokens Bearer de solo escritura como Secrets para que los Agents puedan llamar a servidores MCP autenticados.
---

# Credenciales para herramientas MCP {#credentials-for-mcp-tools}

Cuando un servidor MCP requiere autenticación, guarda su token Bearer como un **Secret** y asocia el Secret a una [conexión MCP](/agents/mcp-tools#mcp-connections). El entorno de ejecución envía el token solo a ese servidor.

## Cómo funcionan los Secrets {#how-secrets-work}

- `kind` siempre es `mcp_bearer`: un token Bearer para un servidor MCP.
- Cada Secret está vinculado a un `server_url` exacto. Una conexión solo puede usarlo cuando su `server_url` coincide. Para usar otra URL, crea otro Secret.
- El token es de solo escritura. La API devuelve el nombre, la URL, el estado y el `row_version` del Secret, nunca el token.
- Los Secrets no son variables de entorno. No se inyectan en el runtime del Agent y los Agents no pueden leerlos.

Las versiones anteriores de SandBase guardaban credenciales con alcance de espacio de trabajo o de Agent y las inyectaban como variables de entorno, por ejemplo `GITHUB_TOKEN`. Ese modelo se retiró y sus registros no se migran. Vuelve a crear los valores que aún necesites como Secrets en conexiones MCP.

## Con la API {#with-the-api}
Crea, rota y revoca Secrets con la API. Esta guía es el contrato de la API; la página Credentials de la Console, que se abre desde el editor del Agent, no es la referencia del comportamiento de los Secrets. Llama a estos endpoints desde un backend de confianza, nunca desde código de navegador: reciben una clave de API de SandBase y un token en texto plano.

| Método | Ruta | Propósito |
|---|---|---|
| `POST` | `/v1/secrets` | [Crear un Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [Listar Secrets](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Obtener un Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Rotar el token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Revocar un Secret](#revoke-a-secret) |

Toda escritura requiere `Idempotency-Key` (de 1 a 128 bytes, sin espacios al principio ni al final). El objeto Secret tiene `id` (prefijo `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` y `updated_at`. `status` es `pending` mientras se guarda el token, `active` cuando se puede usar y `disabled` después de la revocación. `created_at` y `updated_at` son cadenas de marca de tiempo RFC 3339.

### Crear un Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` debe ser `mcp_bearer`.
- `server_url` debe ser HTTPS, sin información de usuario, query ni fragmento. El Secret solo funciona para esa URL exacta.
- `name` y `token` son obligatorios y no pueden estar vacíos. `name` admite hasta 128 bytes, `token` hasta 16384 bytes y `server_url` hasta 2048 bytes.

La respuesta es `201 Created` sin el token. Usa el ID `sec_` como `secret_id` al [crear la conexión MCP](/api-reference/mcp-connections/#create-a-connection).

### Listar Secrets {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginación por offset con `data`, `total`, `limit` y `offset`. `limit` vale 20 por defecto y tiene un máximo de 200; los valores ausentes, no válidos o no positivos usan 20. `offset` vale 0 por defecto; los valores no válidos o no positivos usan 0. Avanza según el `limit` devuelto hasta que `offset + data.length >= total`. Los Secrets deshabilitados siguen apareciendo en la lista.

### Obtener un Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Rotar un Secret {#rotate-a-secret}

Asigna a `SECRET_ROW_VERSION` el `row_version` más reciente obtenido con Obtener un Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

La rotación reemplaza el token y conserva el mismo Secret y el mismo `server_url`. Se requieren `token` y un `row_version` entero positivo, el Secret debe estar `active` y `row_version` debe coincidir con el valor más reciente. Devuelve `201 Created`. Las Sessions nuevas usan el token nuevo; las Sessions que ya comenzaron conservan la credencial que congelaron.

### Revocar un Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Devuelve `204 No Content` y cambia `status` a `disabled`. Las conexiones que usan el Secret dejan de funcionar para las Sessions nuevas y para cualquier entrada adicional en las Sessions existentes. La revocación no se puede deshacer: crea un Secret nuevo y reemplaza la conexión.

### Errores y reintentos {#errors-and-retries}

Los errores usan el [sobre de error de Agents](/api-reference/errors#agents-platform-errors). Los campos no válidos o la falta de clave de idempotencia en una escritura devuelven `400 invalid_request`; un Secret desconocido o inaccesible devuelve `404 not_found`. Un `row_version` desactualizado, un estado de ciclo de vida incompatible o la reutilización de una clave de creación con una entrada distinta devuelven `409 conflict`. Vuelve a leer el Secret antes de reintentar y usa una clave nueva para cada escritura nueva.

## Seguridad {#security}

- Crea y rota Secrets desde un backend de confianza, nunca desde código de navegador.
- Lee los tokens de tu propio almacén de secretos o del entorno, como `$GITHUB_MCP_TOKEN` en los ejemplos anteriores, en lugar de pegarlos en scripts.
- Mantén los tokens fuera de las instrucciones, la entrada de las Sessions, los metadatos y los paquetes de Skills.
- Revoca un Secret en cuanto su token pueda haberse filtrado; luego crea uno nuevo y reemplaza la conexión.

## Próximos pasos {#next-steps}

- [Skills y herramientas MCP](/agents/mcp-tools)
- [API de conexiones MCP](/api-reference/mcp-connections/)
