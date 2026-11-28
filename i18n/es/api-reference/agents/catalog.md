---
i18nSource: 1b5099685e9df6ce
title: Catálogo de Agents
description: Explora los Agents públicos y clona uno en tu organización.
---

# Catálogo de Agents {#agent-catalog}

El catálogo enumera los Agents que SandBase publica para su reutilización. Las entradas del catálogo son de solo lectura. Clona una para obtener un Agent privado en tu organización que puedas editar, ejecutar y desplegar.

| Método | Ruta | Propósito |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Listar Agents públicos |
| `GET` | `/v1/agents/catalog/{agent_id}` | Obtener un Agent público, opcionalmente en `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Copiarlo en tu organización |

## Listar Agents del catálogo {#list-catalog-agents}

Paginación por cursor con `limit` (1-100), `after` y `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Cada entrada tiene `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` y `updated_at`.

## Obtener un Agent del catálogo {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` es opcional y debe ser un entero positivo. La respuesta de detalle añade un objeto `configuration` de solo lectura (nombre, descripción, modelo, instrucciones, perfil de runtime, metadatos, herramientas, texto, razonamiento y Skills).

## Clonar un Agent del catálogo {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

El cuerpo acepta `version` opcional (entero positivo; por defecto, la versión pública actual) y `name` (hasta 128 caracteres). La respuesta es `201 Created` con un [objeto Agent](./create) completo que tiene un nuevo ID `agt_` en tu organización. `Idempotency-Key` es opcional; envía una clave estable para que un reintento no cree una segunda copia.

Después de clonarlo, [crea una Session](/api-reference/sessions/create) para probarlo.
