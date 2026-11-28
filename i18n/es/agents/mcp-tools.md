---
i18nSource: 417ea5dc930a8786
title: Skills y herramientas MCP
description: Dale a un Agent de SandBase Skills reutilizables y herramientas MCP remotas, y controla qué versiones y herramientas usa cada Session.
---

# Skills y herramientas MCP {#skills-and-mcp-tools}

Un Agent obtiene capacidades de dos maneras:

- **Skills** le enseñan al Agent cómo hacer un trabajo. Una Skill es un paquete ZIP versionado de instrucciones y recursos.
- **Conexiones MCP** permiten que el Agent llame a herramientas de un servidor MCP remoto mediante HTTPS, con autenticación opcional mediante un [Secret](/agents/api-credentials).

Los Agents más útiles combinan ambas: un servidor MCP obtiene datos o realiza acciones, y una Skill describe cómo usar los resultados.

## Skills {#skills}

1. Empaqueta una carpeta que contenga `SKILL.md` con frontmatter `name` y `description`, y comprime la propia carpeta (`zip -r release-notes.zip release-notes/`, 5 MiB como máximo). El ZIP debe tener esa carpeta en su nivel superior; un `SKILL.md` en la raíz del ZIP devuelve `400 invalid_request`.
2. Súbela con `POST /v1/skills` en el campo multipart `files`. La respuesta contiene un ID `skl_` y `default_version: "1"`.
3. Haz referencia a ella en el array `skills` del Agent.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- En la primera vinculación, `"version": null` se resuelve a la `default_version` actual de la Skill al guardar el Agent. Una cadena como `"2"` selecciona esa versión de forma explícita.
- El Agent guardado fija la versión. Cambiar la versión predeterminada de la Skill no actualiza los Agents existentes ni sus Sessions nuevas. Actualiza el Agent con una versión explícita para actualizarla; enviar `null` en una vinculación existente conserva su versión fijada.
- Sube una versión nueva con `POST /v1/skills/{skill_id}/versions` y cambia la predeterminada con `default=true` o `POST /v1/skills/{skill_id}`.
- Una Skill deshabilitada hace que las Sessions nuevas de los Agents que la referencian fallen con `400 skill_not_found`.

También puedes explorar las Skills públicas en el [catálogo de Skills](/api-reference/skills/catalog). Consulta la [Skills API](/api-reference/skills/) para ver el recorrido completo.

## Herramientas integradas de SandBase {#built-in-sandbase-tools}

Todo Agent nuevo puede usar las herramientas propias de SandBase sin configuración. Con `sandbase_discover`, `sandbase_inspect` y `sandbase_run`, el Agent busca un modelo o una API en el catálogo, lee su esquema y su precio, y lo llama con tu clave. Si omites `mcp_connections` al crearlo, el Agent recibe este valor predeterminado:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **La lista que envías reemplaza el valor predeterminado.** Para añadir tu propio servidor MCP y conservar las herramientas de SandBase, incluye la entrada integrada en tu lista.
- **`builtin:sandbase` requiere `server_label: "sandbase_builtin"`.** Cualquier otra etiqueta, o esa etiqueta en otra conexión, devuelve `400`.
- **Para crear un Agent sin herramientas,** envía `"mcp_connections": []`.
- **Las herramientas integradas son gratuitas.** Solo pagas por los modelos y las APIs que el Agent llama a través de ellas.

## Conexiones MCP {#mcp-connections}

1. Si el servidor MCP necesita un token Bearer, [crea un Secret](/agents/api-credentials) para su URL exacta.
2. Registra el servidor con `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Haz referencia a la conexión en el array `mcp_connections` del Agent:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Campo | Significado |
|---|---|
| `connection_id` | ID de conexión `mcp_` de tu organización, o `builtin:sandbase` para el servidor integrado de SandBase |
| `server_label` | Empieza por una letra; letras, dígitos, `_` y `-`; hasta 64 caracteres; único dentro del Agent |
| `allowed_tools` | Si se omite o es `null`, permite todas las herramientas que ofrece el servidor; `[]` no permite ninguna; una lista permite solo esos nombres (hasta 256 nombres, cada uno no vacío y de 128 bytes como máximo) |
| `required` | Si la Session debe cargar este servidor |

Un Agent puede referenciar hasta 32 conexiones. Las conexiones de la organización deben estar `active` cuando se inicia una Session.

### Herramientas integradas de SandBase {#built-in-sandbase-tools-1}

Crear un Agent sin `mcp_connections` selecciona el servidor integrado de SandBase. Para conservarlo de forma explícita junto a tu propio servidor, incluye esta entrada en el array:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Un array explícito reemplaza toda la selección; el ejemplo anterior con solo un servidor personalizado excluye el servidor integrado. Envía `[]` para desactivar todas las herramientas MCP. Omitir el campo al actualizar un Agent conserva la selección existente; `null` devuelve `400`. La entrada integrada no requiere crear una conexión MCP ni un Secret. No envíes el campo retirado `use_sandbase_mcp`.

::: info Diferencia con OpenAI
La Agents API de OpenAI declara los servidores MCP en línea como `tools: [{"type": "mcp", ...}]`. SandBase devuelve `400` para esa forma: registra el servidor como un recurso de conexión y haz referencia a él en `mcp_connections`. El SDK de OpenAI no tiene métodos para `/v1/mcp-connections` ni `/v1/secrets`, así que llámalos con `client.post(...)` y pasa `mcp_connections` mediante `extra_body` (Python) o el cuerpo de la solicitud (Node.js). Consulta [Compatibilidad con OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Cambios y Sessions en ejecución {#changes-and-running-sessions}

Cada Session congela la versión de su Agent, las versiones de Skills y la configuración de las conexiones MCP cuando se inicia.

- Después de reemplazar una conexión o rotar su Secret, las Sessions nuevas usan la nueva configuración; las Sessions existentes conservan su instantánea.
- Deshabilitar una conexión o revocar su Secret bloquea las Sessions nuevas y rechaza nuevas entradas en las Sessions existentes que la usan. Una llamada a herramienta que ya está en curso no se interrumpe.

## Mantén los tokens fuera de los prompts {#keep-tokens-out-of-prompts}

Guarda los tokens como Secrets. No los pongas en instrucciones, entradas de Session, metadatos ni paquetes de Skills: cualquiera con acceso al Agent o a la Session puede leerlos.

## Próximos pasos {#next-steps}

- [Credenciales para herramientas MCP](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Definir un Agent](/agents/agent-api)
