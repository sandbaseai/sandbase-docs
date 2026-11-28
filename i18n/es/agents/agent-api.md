---
i18nSource: 2ba7f0f41847d04f
title: Definir un Agent
description: "Crea y actualiza un Agent versionado con la Agents API: campos, límites, versiones y archivado."
---

# Definir un Agent {#define-an-agent}

Crea un Agent con `POST /v1/agents`. La API sigue el protocolo de OpenAI Agents, así que puedes usar HTTP directo o `client.beta.agents` del SDK de OpenAI con `base_url="https://api.sandbase.ai/v1"`. El encabezado `OpenAI-Beta` es opcional; si lo envías, debe ser `agents=v1`. Consulta [Compatibilidad con OpenAI](/agents/openai-compatibility) para ver qué admite el SDK.

## Crear un Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

La respuesta es `201 Created` con el Agent: un ID `agt_`, `version: 1`, `row_version`, `status: "active"` y `projection_status`. Cada versión nueva se prepara para su ejecución en segundo plano; inicia Sessions cuando `projection_status` sea `ready`.

`Idempotency-Key` es opcional. Si lo omites, el servicio genera uno, por lo que una solicitud reintentada puede crear un segundo Agent. Envía tu propia clave estable cuando reintentes.

## Campos {#fields}

El cuerpo es JSON estricto (hasta 1 MiB). Los campos desconocidos devuelven 400.

| Campo | Obligatorio | Límites y valores |
|---|---|---|
| `model` | Sí | ID del modelo, hasta 200 caracteres |
| `name` | No | Hasta 128 caracteres |
| `instructions` | No | Hasta 256 KiB |
| `description` | No | Hasta 4096 caracteres |
| `runtime_profile` | No | `codex` (predeterminado), `claude` o `mcode` |
| `skills` | No | Hasta 32 referencias. Una vinculación nueva con `version: null` fija la versión predeterminada actual al guardar; las vinculaciones existentes conservan su versión fijada. Indica una versión explícita para actualizar; consulta [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | No | Hasta 32 referencias; consulta [Conexiones MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | No | Hasta 64 herramientas `function` y como máximo una herramienta `web_search` |
| `text` | No | `format.type` `text` o `json_schema` (esquema de objeto); `verbosity` `low`, `medium` o `high` |
| `reasoning` | No | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` o `max`; `summary` `concise`, `detailed` o `auto` |
| `service_tier` | No | `auto` (predeterminado), `default`, `flex`, `priority` o `fast` |
| `metadata` | No | Hasta 16 pares de cadenas; claves de hasta 64 caracteres y valores de hasta 512 |
| `note` | No | Nota de cambios almacenada en la versión |

## Límites actuales {#current-limits}

- `web_search` debe usar `"mode": "disabled"` para que las Sessions puedan iniciarse.
- Las herramientas `function` se pueden guardar, pero aún no se admiten las ejecuciones que necesitan que el cliente devuelva un resultado de herramienta (`requires_action`). Una Session en ese estado devuelve `502 executor_contract_error`. En su lugar, dale al Agent capacidades externas mediante [conexiones MCP](/agents/mcp-tools#mcp-connections).
- `multi_agent` debe omitirse o ser `null`.

## Actualizar un Agent {#update-an-agent}

Hay dos formas de actualización. Ambas crean una nueva versión.

- `POST /v1/agents/{agent_id}` es la actualización del SDK de OpenAI. Envía solo los campos que quieras cambiar. No se necesita `row_version`, así que prevalece la última escritura. En esta forma no se aceptan `description` ni `note`.
- `PATCH /v1/agents/{agent_id}` es la actualización compare-and-set. Requiere el `row_version` que leíste por última vez y devuelve 409 si el Agent cambió entretanto. Se rechazan los valores `null` explícitos.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versiones, archivado y restauración {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` lista las instantáneas inmutables; `GET /v1/agents/{agent_id}/versions/{version}` lee una.
- `POST /v1/agents/{agent_id}/restore` con `{"source_version": 1, "row_version": 3}` copia una configuración anterior en una nueva versión actual.
- `POST /v1/agents/{agent_id}/archive` y `/unarchive` reciben `{"row_version": …}`. Los Agents archivados no pueden iniciar Sessions nuevas.
- `DELETE /v1/agents/{agent_id}` archiva el Agent. Los Agents nunca se eliminan definitivamente.

## Próximos pasos {#next-steps}

- [Skills y herramientas MCP](/agents/mcp-tools)
- [Ejecutar el Agent en una Session](/agents/sessions)
- [Referencia de la Agents API](/api-reference/agents/)
