---
i18nSource: c063864501452a7b
title: Documentación de SandBase
description: Crea directamente con Models y APIs, o define Agents reutilizables que se ejecutan en infraestructura gestionada.
---

# Documentación de SandBase {#sandbase-docs}

Crea directamente con Models y APIs, o define Agents reutilizables que se ejecutan en infraestructura gestionada.

SandBase ofrece dos formas complementarias de crear aplicaciones de IA. Empieza por la opción más pequeña que se ajuste al trabajo; puedes combinarlas a medida que la aplicación crezca.

## Elige cómo crear {#choose-how-to-build}

| | Models y APIs | Agents gestionados |
|---|---|---|
| **Qué es** | Acceso directo a APIs de lenguaje, imagen, video, audio y de terceros | Configuraciones de Agent reutilizables y versionadas que ejecuta SandBase |
| **Ideal para** | Bucles de aplicación personalizados y control detallado de las solicitudes | Trabajo de varios pasos, asíncrono o repetible |
| **Tú gestionas** | Prompts, orquestación, reintentos y estado de la aplicación | Definición del Agent, capacidades habilitadas, entradas y comportamiento de entrega |
| **Empieza aquí** | [Models y APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Una sola API key de SandBase
La misma API key puede llamar a Models, APIs y Agents. Guarda las claves en el servidor y nunca las expongas en el código del navegador.
:::

## Conceptos clave {#core-concepts}

### Models y APIs {#models-and-apis}

Usa Models para cargas de trabajo de lenguaje, imagen, video y audio. Usa APIs cuando la aplicación necesite datos o acciones externos. El catálogo del sitio web de SandBase muestra las capacidades disponibles, los precios, los esquemas de entrada y ejemplos funcionales.

- [Explorar Models](https://www.sandbase.ai/models)
- [Explorar APIs](https://www.sandbase.ai/apis)
- [Haz tu primera llamada a la API](/getting-started/first-call)
- [Abrir la referencia de la API](/api-reference/)

### Agents {#agents}

Un Agent es una configuración reutilizable y versionada que contiene un modelo, instrucciones, Skills y conexiones MCP. Defínelo una vez y ejecútalo en Sessions.

- [Entender los Agents](/agents/)
- [Definir un Agent](/agents/agent-api)
- [Añadir Skills y herramientas MCP](/agents/mcp-tools)

### Sessions {#sessions}
Una Session ejecuta una versión de un Agent. Créala con `POST /v1/agents/sessions`, envía la entrada, transmite los eventos y lee después la conversación completa.

- [Guía de Sessions](/agents/sessions)
- [API de Sessions](/api-reference/sessions/)

## Primeros pasos {#first-steps}

1. Crea una organización y una [API key](/getting-started/api-keys).
2. Elige un modelo, una API o un Agent del [catálogo](https://www.sandbase.ai/models).
3. Haz una solicitud directa o define y prueba un Agent.
4. Ejecuta el Agent probado en Sessions desde tu aplicación.
5. Revisa las Sessions, los errores, la latencia y el costo en la Console.

## Guías operativas {#operational-guidance}

- [Respuestas en streaming](/guides/streaming)
- [Gestión de errores y reintentos](/guides/error-handling)
- [Límites de frecuencia](/guides/rate-limiting)
- [Facturación y precios](/guides/billing)
- [Administración del espacio de trabajo](/admin/)

## Próximos pasos {#next-steps}

- Crear con Skills locales: [Tutoriales de Skills](/guides/skills/)

- Si eres nuevo en SandBase: [Primeros pasos](/getting-started/)
- Llamar a un modelo o una API: [Catálogo de Models](https://www.sandbase.ai/models) y [Catálogo de APIs](https://www.sandbase.ai/apis)
- APIs de inferencia y de Agents: [Referencia de la API](/api-reference/)
- Crear trabajo reutilizable: [Build Agent](/agents/)
- Conectar una herramienta de IA: [Setup](/setup/)
