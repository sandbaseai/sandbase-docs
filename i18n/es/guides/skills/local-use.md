---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Usar una Skill en local
description: Elige una Skill de SandBase Lab, descarga su paquete, configura el acceso a los modelos y crea y guarda un proyecto con un agente local.
---

# Usar una Skill en local {#use-a-skill-locally}

Descarga una Skill de SandBase y completa un proyecto con un agente en tu computadora. Una Skill contiene instrucciones, scripts y ejemplos. El agente sigue el flujo de trabajo descrito en su `SKILL.md`.


## 1. Elige una Skill {#_1-choose-a-skill}

1. Abre [SandBase Lab](https://www.sandbase.ai/lab/).
2. Explora ejemplos como videos, animaciones y mapas. Abre una Skill que se ajuste a tu proyecto.
3. Revisa el ejemplo, las entradas necesarias, el formato de salida y los idiomas admitidos.
4. Usa la acción de descarga de la Skill para guardar el paquete ZIP.

Para una película de mapas sobre la historia de una ciudad, empieza con los ejemplos y las instrucciones de [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Prepara una carpeta de trabajo local {#_2-prepare-a-local-working-folder}

1. Crea una carpeta de proyecto, como `my-city-film`.
2. Extrae en ella el ZIP completo de la Skill, conservando las instrucciones, los scripts y los recursos.
3. Abre el proyecto en tu agente local y concédele acceso a sus archivos y a los comandos que requiere el flujo de trabajo.
4. Sigue las instrucciones de instalación de la página de la Skill o pide al agente que lea directamente el `SKILL.md` extraído.

Un proyecto puede usar esta estructura:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Usa los nombres de archivo y las ubicaciones de salida concretos que requiera la Skill.

## 3. Conecta SandBase {#_3-connect-sandbase}

Pega `set up https://www.sandbase.ai/SKILL.md` en tu agente y aprueba el inicio de sesión en el navegador que abre, o ejecuta `npx -y @sandbaseai/cli@latest connect` en una terminal. Después, inicia una nueva sesión del agente para que se carguen las herramientas de SandBase. Las mismas opciones están en [Build → AI tools](https://www.sandbase.ai/console/setup) en la Console.

Consulta [Conectar herramientas de IA](/setup/) para ver el flujo de conexión completo.

Si los scripts de la Skill requieren `SANDBASE_API_KEY`:

1. Abre [API Keys](https://www.sandbase.ai/console/keys) y crea o selecciona una clave para el proyecto.
2. Configúrala mediante los ajustes seguros de tu agente local o el entorno de ejecución de los scripts.
3. Pide al agente que compruebe que el acceso está configurado y que continúe con el flujo de trabajo de la Skill.

Guarda la clave en una configuración local segura. Incluye solo información del proyecto en los entregables, los archivos fuente y las capturas de pantalla públicas. Consulta el uso de los modelos y tu saldo en [Billing](https://www.sandbase.ai/console/billing).

## 4. Proporciona un briefing {#_4-provide-a-brief}

Indica al agente qué Skill usar, qué crear, los requisitos de salida y tu presupuesto. Adapta este ejemplo a tu proyecto:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

El agente lee las instrucciones, comprueba las dependencias, procesa las entradas y genera o renderiza el proyecto. Añade los recursos que te pida al mismo proyecto y continúa la tarea.

## 5. Sigue el progreso y revisa el resultado {#_5-follow-progress-and-review-the-result}

La duración depende de la Skill, los modelos, los recursos y la longitud de la salida. Los proyectos de video pueden tardar desde decenas de minutos hasta varias horas. Mantén el agente en ejecución y la computadora encendida.

Pregunta por el progreso en la misma conversación:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Abre las rutas de los archivos entregados, revisa las imágenes, el audio, los subtítulos y el contenido, y guarda los archivos finales.

## 6. Revisa el proyecto {#_6-revise-the-project}

Solicita cambios concretos en la tarea original y reutiliza los recursos existentes:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Si la ejecución se interrumpe, conserva la carpeta de trabajo y pide al agente que continúe desde el paso actual.

## Próximos pasos {#next-steps}

- [Participa en AI City Remix](/guides/skills/ai-city-remix)
- [Conecta tu agente](/setup/)
- [Configura las API keys](/getting-started/api-keys)
