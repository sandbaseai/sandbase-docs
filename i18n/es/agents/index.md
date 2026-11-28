---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Define, prueba y ejecuta Agents reutilizables y versionados en Sessions de SandBase.
---

# Build Agent {#build-agent}

En Build Agent defines y pruebas un Agent, y luego decides cómo se ejecuta.

Un Agent es una configuración guardada y versionada: un modelo, instrucciones, un perfil de runtime, Skills y conexiones MCP a herramientas externas. Guardar un Agent no lo ejecuta.

## Qué es un Agent {#what-an-agent-is}

| Pregunta | Dónde se define |
|---|---|
| ¿Qué debe hacer? | `instructions` |
| ¿Qué modelo hace el trabajo? | `model`, un ID de modelo de la [API de modelos](/api-reference/models/) |
| ¿Qué sabe hacer? | [Skills](/agents/mcp-tools#skills), paquetes de instrucciones versionados |
| ¿Qué herramientas externas puede llamar? | [Conexiones MCP](/agents/mcp-tools#mcp-connections), con [credenciales](/agents/api-credentials) cuando el servidor necesita un token |
| ¿Cómo se ejecuta? | En una [Session](/agents/sessions) |

Cada cambio efectivo crea una nueva versión inmutable. Puedes listar las versiones y restaurar una anterior en cualquier momento.

## Cómo se ejecuta un Agent {#how-an-agent-runs}

Un Agent se ejecuta en una [Session](/agents/sessions). Una Session es un recurso `ses_` al que envías entradas y del que recibes eventos en streaming, ya sea para una conversación interactiva, una ejecución de prueba o una llamada desde tu aplicación. Cada Session congela la versión del Agent con la que comenzó, así que puedes seguir editando el Agent sin modificar las Sessions que ya existen.

## Ciclo de vida del Agent: Borrador → Prueba en una Session → Ejecución desde tu app → Revisión de Sessions {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Borrador {#_1-draft}

Crea un Agent en la Console en **Build → Agents**, o con [`POST /v1/agents`](/agents/agent-api). Empieza con el flujo de trabajo útil más pequeño y agrega Skills y conexiones MCP solo cuando las instrucciones las necesiten.

### 2. Prueba en una Session {#_2-test-in-a-session}

Crea una Session para el Agent, envía entradas representativas y revisa la salida, la actividad de las herramientas y los errores. Prueba entradas faltantes, herramientas no disponibles, resultados vacíos y requisitos de formato de salida, no solo el caso ideal.

### 3. Ejecución desde tu app {#_3-run-from-your-app}

Crea Sessions para el Agent ya probado desde tu aplicación con la [API de Sessions](/api-reference/sessions/).

### 4. Revisión de Sessions {#_4-inspect-sessions}

Lee los elementos y turnos de cada Session con la API de Sessions para revisar la conversación completa, la actividad de las herramientas y los errores.

## Lista de verificación para producción {#production-checklist}

- `model` usa un ID de modelo vigente de la API de modelos.
- Las Skills están fijadas a una versión cuando el comportamiento no debe cambiar sin aviso.
- Las conexiones MCP exponen solo las herramientas que el Agent necesita, mediante `allowed_tools`.
- Los tokens se guardan como [Secrets](/agents/api-credentials) y nunca se escriben en las instrucciones, la entrada ni los metadatos.
- La creación de Sessions envía un `Idempotency-Key` y los reintentos lo reutilizan.
- El estado y los errores de las Sessions se revisan después del lanzamiento.

## Agents del catálogo {#catalog-agents}

El [catálogo de Agents](/api-reference/agents/catalog) público lista los Agents publicados por SandBase. Puedes leer un Agent del catálogo, pero para modificarlo primero debes clonarlo en tu organización con `POST /v1/agents/catalog/{agent_id}/clone`. El clon es un Agent privado nuevo que te pertenece y que puedes ejecutar.

::: tip Uso del SDK de OpenAI
Agents, Sessions y Skills siguen la API de Agents de OpenAI, por lo que el SDK oficial de OpenAI funciona con `base_url="https://api.sandbase.ai/v1"`. Consulta [Compatibilidad con OpenAI](/agents/openai-compatibility) para ver ejemplos verificados y diferencias.
:::

## Próximos pasos {#next-steps}

- [Definir un Agent](/agents/agent-api)
- [Compatibilidad con OpenAI](/agents/openai-compatibility)
- [Skills y herramientas MCP](/agents/mcp-tools)
- [Sessions](/agents/sessions)
