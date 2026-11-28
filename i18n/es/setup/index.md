---
i18nSource: 28b1ef75a197824a
title: Conectar herramientas de IA
description: Da a Claude Code, Codex, Cursor, Kiro y otras herramientas de IA acceso al catálogo de Models y APIs de SandBase con un solo prompt o un solo comando de la CLI.
---

# Conectar herramientas de IA {#connect-ai-tools}

La página [AI tools](https://www.sandbase.ai/console/setup) de la Console (**Build → AI tools**) conecta SandBase con el agente o la herramienta de IA que ya usas. Las herramientas conectadas pueden buscar en el catálogo de Models y APIs de SandBase, leer el esquema de entrada y el precio de cada herramienta y ejecutarla. Cada llamada se factura al espacio de trabajo activo.

Los clientes compatibles incluyen Claude Code, Codex, Cursor, Kiro IDE y Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop y ChatGPT. La página AI tools muestra la lista actual.

## Inicio rápido: pega un prompt {#quick-start-paste-one-prompt}

Pega esta línea en tu agente:

```text
set up https://www.sandbase.ai/SKILL.md
```

El agente lee la Skill de SandBase, instala la CLI y te pide que apruebes un inicio de sesión en el navegador. No tienes que pegar ninguna clave de API. Cuando el agente indique que el cliente está configurado, inicia una sesión nueva o reinicia la aplicación para que se carguen las herramientas `sandbase_*`.

La Skill necesita Node.js 20 o posterior en la máquina que ejecuta el agente.

## Otras formas de conectarse {#other-ways-to-connect}

### CLI {#cli}

Conéctate desde una terminal. Sin `--client`, la CLI configura todos los clientes compatibles que encuentra:

```sh
npx -y @sandbaseai/cli@latest connect
```

Para configurar un solo cliente, pasa su id, por ejemplo `codex`, `claude-code`, `cursor` o `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

El script de instalación ejecuta el mismo comando:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Para listar los clientes que reconoce el instalador sin cambiar la configuración local:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` abre la autorización en el navegador, crea una clave **CLI Login** para el espacio de trabajo que apruebes y solo escribe configuración de cliente propiedad de SandBase. La [SandBase CLI](https://github.com/sandbaseai/cli) de código abierto documenta cada cliente.

### Clientes MCP que configuras a mano {#mcp-clients-you-configure-by-hand}

Los usuarios con sesión iniciada ven la dirección del servidor MCP en **Other ways to connect** en la página [AI tools](https://www.sandbase.ai/console/setup). Autentícalo con una [clave de API](/getting-started/api-keys) de **Developer → API Keys** y guarda la clave en la configuración de secretos del cliente.

## Verifica la conexión {#verify-the-connection}

La instalación o la autorización no demuestran por sí solas que un cliente esté conectado. Confirma que:

- el servidor o conector de SandBase es visible en el cliente
- las herramientas `sandbase_*` se pueden descubrir en una sesión nueva
- una solicitud segura en lenguaje natural se completa correctamente

Para los clientes gestionados por la CLI, ejecuta el diagnóstico después de reconectar o cambiar la configuración:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` comprueba la credencial local, la entrada MCP y la Skill, y luego hace un viaje de ida y vuelta a SandBase. Haz siempre la llamada final a la herramienta dentro del propio cliente.

Las ejecuciones hechas por las herramientas conectadas aparecen en [Activities](https://www.sandbase.ai/console/activities) con su costo.

## Solución de problemas {#troubleshooting}

| Problema | Qué revisar |
|---|---|
| Las herramientas no aparecen | Inicia una sesión nueva del cliente o reinicia la aplicación, ejecuta `npx -y @sandbaseai/cli doctor --client <client>` y vuelve a intentarlo. |
| Falta la autorización | Vuelve a ejecutar `connect` y aprueba el inicio de sesión en el navegador para el espacio de trabajo al que quieres facturar. |
| Las llamadas fallan con HTTP 402 | Añade crédito en [Billing](https://www.sandbase.ai/console/billing) para el espacio de trabajo activo. |

## Elimina la configuración gestionada {#remove-the-managed-configuration}

Elimina solo la entrada propiedad de SandBase de un cliente:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

El comando solo elimina la configuración cuya propiedad de SandBase puede verificar y deja sin cambios las entradas no relacionadas o gestionadas por el usuario. Después, revoca la clave **CLI Login** correspondiente en **Developer → API Keys** si ya no la necesitas.

## Código fuente y soporte {#source-and-support}

- [Código fuente](https://github.com/sandbaseai/cli)
- [Paquete de npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Preguntas y ejemplos](https://github.com/sandbaseai/cli/discussions)
- [Reportes de errores](https://github.com/sandbaseai/cli/issues/new/choose)

## Próximos pasos {#next-steps}

- [Catálogo de Models y APIs](https://www.sandbase.ai/models)
- [Tutoriales de Skills](/guides/skills/)
- [Crear un Agent](/agents/)
