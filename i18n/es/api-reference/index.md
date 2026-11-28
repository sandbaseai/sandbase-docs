---
i18nSource: 071e97a48f9c4f4c
title: Referencia de la API
description: Llama a los modelos de SandBase y gestiona Agents, Sessions, Skills, conexiones MCP, Secrets y recursos de la cuenta.
---

# Referencia de la API {#api-reference}

Usa la API para llamar a modelos directamente o para definir Agents reutilizables, ejecutarlos en Sessions y conectarlos a Skills y herramientas MCP.

::: tip ¿Buscas inferencia de modelos?
Los contratos de inferencia (Chat Completions, Responses, Anthropic Messages, Gemini, Images y video Seedance) están en la sección **Model inference** de esta referencia. Los campos y precios propios de cada modelo están en su página del [catálogo de Models](https://www.sandbase.ai/models).
:::

## Elige un punto de partida {#choose-a-starting-point}

| Objetivo | Empieza con | Qué ocurre después |
|---|---|---|
| Definir un comportamiento reutilizable | [Agents](/api-reference/agents/) | Crea y versiona una configuración de Agent |
| Ejecutar un Agent directamente | [Sessions](/api-reference/sessions/) | Envía entradas, transmite eventos y lee el historial |
| Reutilizar paquetes de instrucciones | [Skills](/api-reference/skills/) | Sube paquetes ZIP versionados y adjúntalos a Agents |
| Llamar a herramientas externas | [Conexiones MCP](/api-reference/mcp-connections/) | Registra servidores MCP remotos HTTPS para Agents |
| Autenticar herramientas externas | [Secrets](/agents/api-credentials#with-the-api) | Guarda tokens Bearer de solo escritura para conexiones MCP |

## Ciclo de vida de los recursos {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- Un **Agent** (`agt_`) es una configuración guardada y versionada; crearlo no lo ejecuta.
- Una **Session** (`ses_`) ejecuta una versión de un Agent y congela sus Skills y conexiones MCP. Las rutas de Session están bajo `/v1/agents/sessions`.
- Una **Skill** (`skl_`) es un paquete de instrucciones versionado. Una **conexión MCP** (`mcp_`) registra un servidor de herramientas remoto, y un **Secret** (`sec_`) guarda su token Bearer.

## Convenciones de los recursos de la plataforma de Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, conexiones MCP y Secrets se sirven bajo `https://api.sandbase.ai/v1` y comparten estas reglas:

- Autentícate con `Authorization: Bearer` o `X-API-Key`. Consulta [Autenticación](/api-reference/authentication#agents-platform-resources).
- Los cuerpos de solicitud son JSON estricto de hasta 1 MiB; los campos desconocidos devuelven 400.
- Las escrituras que crean conexiones MCP o Secrets requieren una `Idempotency-Key`. Las demás escrituras la aceptan.
- La concurrencia optimista usa `row_version`: envía el valor que leíste por última vez y gestiona el 409 volviendo a leer.
- Agents, Sessions, items, turns y Skills usan paginación por cursor (`limit`, `after`, `order`; las respuestas tienen `has_more` y `last_id`). Las versiones de Agent, los adjuntos, las conexiones MCP y los Secrets usan paginación por desplazamiento (`limit`, `offset`; las respuestas tienen `total`).
- Los errores usan `{"error": {"type", "code", "param", "message"}}`. Consulta [Errores de la plataforma de Agents](/api-reference/errors#agents-platform-errors).

## Autenticación {#authentication}

Envía una clave de API de SandBase como token Bearer:

```http
Authorization: Bearer sk-YOUR_KEY
```

Trata la clave como un secreto opaco, mantenla en el servidor y nunca la incluyas en código del navegador ni en logs. Consulta [Autenticación](/api-reference/authentication) para los detalles de compatibilidad y [Errores](/api-reference/errors) para los sobres de error públicos.

## Organización y uso {#organization-and-usage}

Los recursos de la plataforma pertenecen a la organización asociada a la clave de API. Usa la [Account API](/api-reference/account/) para consultar el saldo admitido y las vistas recientes del historial de ejecución. La administración de la organización y la gestión de la facturación siguen siendo flujos de la Console, salvo que aquí se documente un endpoint público.

## Formatos de referencia {#reference-formats}

- Explora las operaciones desde la barra lateral para ver ejemplos y detalles de respuesta.
- Descarga la [especificación OpenAPI](/openapi.yaml) legible por máquinas.
- Abre la página de un modelo en el [catálogo de Models](https://www.sandbase.ai/models) o la de una API en el [catálogo de APIs](https://www.sandbase.ai/apis) para ver sus campos de solicitud exactos.

## Próximos pasos {#next-steps}

- Si eres nuevo en los Agents gestionados: [Crear un Agent](/agents/)
- Llamar a un modelo directamente: [Chat Completions](/api-reference/llm-gateway) o el [catálogo de Models](https://www.sandbase.ai/models)
