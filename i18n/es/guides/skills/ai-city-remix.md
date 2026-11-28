---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Participa en AI City Remix
description: Reclama los créditos de AI City Remix, elige una ciudad y una Skill, crea un video con tu agente local y súbelo para su revisión.
---

# Participa en AI City Remix {#enter-ai-city-remix}

Elige una Skill y una ciudad en la página del evento y entrega las instrucciones completas a tu agente local. Después de la creación, el agente sube el video, la portada y los datos de la participación, y los envía a revisión.


## Requisitos previos {#prerequisites}

- Una cuenta de SandBase.
- Un agente local con ejecución de comandos y acceso a archivos.
- Una carpeta de trabajo para el video, la portada y los archivos del proyecto.

Para tu primera configuración local, sigue [Usar una Skill localmente](/guides/skills/local-use).

## 1. Abre el evento y reclama los créditos {#_1-open-the-event-and-claim-credits}

1. Abre [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) y lee las [reglas del evento](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) vigentes.
2. Haz clic en “Claim $5 free & create” e inicia sesión cuando se te pida.
3. El sistema reclama los créditos del evento e intenta canjearlos automáticamente. Revisa el saldo y el estado del canje; usa la acción de canje si hace falta reintentarlo.
4. Después de reclamarlos, haz clic en “Create now” para abrir el diálogo de creación.

Las fechas para reclamar, la disponibilidad y los requisitos de elegibilidad se muestran en la página del evento. Las llamadas a modelos consumen créditos según el uso real; revísalos en [Billing](https://www.sandbase.ai/console/billing).

## 2. Configura una clave de API de modelos {#_2-configure-a-model-api-key}

Si tu cuenta no tiene una clave de API utilizable, el flujo muestra un diálogo “Create an API key”.

1. Revisa el límite de gasto y el vencimiento que se muestran y haz clic en “Create API key”.
2. Haz clic en “Create with this key”. La clave nueva se incluye en las instrucciones completas que se entregan al agente.
3. Envía las instrucciones completas a un agente de tu confianza y guárdalas en un espacio de trabajo privado.

Si ya tienes una clave, configura `SANDBASE_API_KEY` mediante la configuración segura o el entorno de ejecución de tu agente local. Administra las claves en [API Keys](https://www.sandbase.ai/console/keys).

## 3. Elige una Skill y un brief {#_3-choose-a-skill-and-brief}

El diálogo se abre con una Skill oficial, una ciudad, una historia y una dirección creativa ya seleccionadas.

- Despliega “Official Skill” para leer el resumen y los detalles y elegir un enfoque visual.
- Despliega “Creative brief” para buscar una ciudad o seleccionar una ubicación en el mapa.
- Genera sugerencias aleatorias o edita directamente la historia y la dirección creativa.
- Confirma la ubicación en el mapa, el idioma admitido y el estilo de salida.

Usa fuentes verificables para la historia, las personas y los eventos. Revisa los detalles de la Skill seleccionada para conocer los idiomas y las duraciones admitidos.

## 4. Copia las instrucciones y crea {#_4-copy-the-instructions-and-create}

1. Haz clic en “Copy all” en el área del prompt.
2. Abre la carpeta del proyecto en tu agente local, inicia una tarea y pega las instrucciones completas.
3. Envíalas, proporciona las entradas que se soliciten, configura las dependencias y comienza la creación.

Las instrucciones contienen la Skill seleccionada, el brief creativo, el formato de los metadatos de la participación y la autorización de subida. Conserva la entrega completa para que el agente pueda crear y enviar el trabajo.

“Preparing” significa que se está preparando el acceso de subida. Usa “Retry” para volver a prepararlo o “Complete brief” para completar los datos que falten.

## 5. Sigue el progreso de la creación {#_5-follow-creation-progress}

La creación puede tardar desde decenas de minutos hasta horas, según la Skill, los modelos y la duración del video, y consume créditos de modelos. Mantén el agente en ejecución y la computadora encendida.

Agrega instrucciones de presupuesto y de progreso a la misma tarea:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Usa MiniMax M3.1 Flash a través de SandBase, como exigen las reglas vigentes del evento. Sigue los requisitos de la página del evento y de la página de subida sobre duración, resolución, subtítulos y tamaño de los archivos.

## 6. Envía y revisa el estado de la revisión {#_6-submit-and-check-review-status}

El agente sigue las instrucciones completas para usar el cliente oficial de subida, subir el video, la portada y los metadatos, y enviarlos a revisión.

Abre [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) para ver el progreso:

| Estado | Siguiente paso |
|---|---|
| Draft | Termina la película, sube los archivos y envíala a revisión. |
| Pending review | Sigue el estado de la revisión. |
| Approved | Abre la página pública de la participación y compártela. |
| Changes requested | Haz los cambios indicados en la nota de revisión y vuelve a enviarla. |

Si ya tienes una película, selecciona “Upload existing video” en la página del evento, completa los datos, sube el video y la portada, y envíala a revisión.

## 7. Reanuda una subida {#_7-resume-an-upload}

Si la autorización vence o se interrumpe una subida, continúa con los archivos originales:

1. Conserva el video, la portada, `entry.json` y la carpeta de trabajo.
2. Busca el mismo borrador en My entries y haz clic en “Resume upload”.
3. Copia las nuevas instrucciones de reanudación en la tarea original del agente.
4. Pide al agente que suba y envíe los archivos existentes y luego revisa el estado en My entries.

## 8. Comparte tu participación {#_8-share-your-entry}

En la página de una participación aprobada, haz clic en “Share on X” para abrir un editor con el texto ya completado. Incluye el enlace a la participación, `#AICityRemix`, `@SandbaseAI` y la publicación oficial del evento.

Para publicar un post con video, primero haz clic en “Download video”, agrega el archivo en el editor de X, revisa el texto y publícalo.

## Documentación relacionada {#related-documentation}

- [Usar una Skill localmente](/guides/skills/local-use)
- [Conecta tu agente](/setup/)
- [Configurar claves de API](/getting-started/api-keys)
