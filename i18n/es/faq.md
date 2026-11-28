---
i18nSource: a86346e2696c732c
title: Preguntas frecuentes
description: Preguntas frecuentes sobre cómo conectar herramientas de IA, el catálogo de SandBase, Models, APIs, Agents, Sessions y facturación.
---

# Preguntas frecuentes {#frequently-asked-questions}

## ¿Qué es SandBase? {#what-is-sandbase}

SandBase ayuda a los Agents a conectarse con el mundo real.

Puedes usar Models y APIs listos para usar, usarlos desde tus herramientas de IA después de conectarlas en AI tools, o crear Agents reutilizables y ejecutarlos en Sessions.

## ¿Para quién es SandBase? {#who-is-sandbase-for}

SandBase está pensado principalmente para tres grupos:

- **Usuarios de herramientas de IA** que quieren capacidades útiles dentro de Codex, Claude, Cursor o Kiro
- **Desarrolladores** que quieren llamar directamente a Models y APIs
- **FDEs y equipos** que crean Agents reutilizables para clientes o flujos de trabajo internos

## ¿Dónde exploro las capacidades? {#where-do-i-browse-capabilities}
El sitio web de SandBase muestra el catálogo de capacidades:

- [Models](https://www.sandbase.ai/models) y [modelos de imagen y video](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Puedes inspeccionar, probar, instalar, llamar o clonar, según el tipo de capacidad.

## ¿Qué es AI tools? {#what-is-ai-tools}

**Build → AI tools** en la Console conecta SandBase con la herramienta de IA que ya usas, como Claude Code, Codex, Cursor o Kiro. Pega `set up https://www.sandbase.ai/SKILL.md` en tu agente o ejecuta `npx -y @sandbaseai/cli@latest connect`. La herramienta conectada puede buscar y ejecutar el catálogo de Models y APIs de SandBase, con cargo a tu workspace. Consulta [Conectar herramientas de IA](/setup/).

## ¿Qué es Build Agent? {#what-is-build-agent}

Build Agent es donde defines y pruebas un Agent.

Un Agent combina instrucciones, un Model, Skills y herramientas MCP en un flujo de trabajo reutilizable y versionado.

## ¿Un Agent es distinto de una API? {#is-an-agent-different-from-an-api}
Sí. Un Agent es una configuración versionada que editas y pruebas, y que ejecutas creando una Session. Tu aplicación puede crear Sessions con la [Sessions API](/api-reference/sessions/) mientras sigues editando el Agent.

## ¿Qué son las Sessions? {#what-are-sessions}
Una Session es una ejecución de un Agent con su conversación, su actividad de herramientas y su salida.

## ¿Cómo doy a un Agent acceso a APIs externas? {#how-do-i-give-an-agent-access-to-external-apis}

Conecta el sistema externo como servidor MCP y añádelo a las conexiones MCP del Agent. Si el servidor necesita un token Bearer, guárdalo con la [Secrets API](/agents/api-credentials#with-the-api) como un Secret de solo escritura vinculado a la URL de ese servidor. Los tokens solo se envían a ese servidor y nunca aparecen en los prompts ni en el runtime del Agent. Consulta [Credenciales para herramientas MCP](/agents/api-credentials).

## ¿Dónde están los Models? {#where-do-models-live}

Los Models tienen su propio [catálogo](https://www.sandbase.ai/models) porque son piezas fundamentales.

Puedes llamar a un Model directamente, usarlo desde una herramienta de IA conectada o usarlo dentro de un Agent.

## ¿Necesito escribir código? {#do-i-need-to-write-code}

No siempre.

[Conecta tu herramienta de IA](/setup/) si quieres tener capacidades dentro de ella sin escribir código.

Usa la referencia de la API si quieres llamar a SandBase desde tu aplicación.

Usa Build Agent si quieres trabajo reutilizable de varios pasos.

## ¿Cómo obtengo una API key? {#how-do-i-get-an-api-key}

Abre la Console, ve a **Developer → API Keys** y selecciona **New key**.

Usa la clave así:

```http
Authorization: Bearer sk-YOUR_KEY
```

## ¿Cómo funciona la facturación? {#how-does-billing-work}

SandBase usa créditos y facturación basada en el uso.

Los Models, las APIs, los Agents y el trabajo de runtime pueden tener costos distintos. Consulta la Console para ver el uso y los precios actuales.

## Próximos pasos {#next-steps}

- [Primeros pasos](/getting-started/)
- [Catálogo de Models y APIs](https://www.sandbase.ai/models)
- [Conectar herramientas de IA](/setup/)
- [Build Agent](/agents/)
- [Referencia de la API](/api-reference/)
