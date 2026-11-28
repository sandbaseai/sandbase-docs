---
i18nSource: 4191d2eb16a594f5
title: Descripción general y capacidades de Sandbox
description: Crea sandboxes con el E2B SDK o la Console de SandBase, revisa el estado, los logs y las métricas, y explora el Playground experimental independiente.
---

# Descripción general y capacidades de Sandbox {#sandbox-overview-and-capabilities}

Sandbox ofrece entornos aislados para ejecutar comandos, ejecutar código y leer o escribir archivos. Pausa una instancia, vuelve a conectarte a ella y lee de nuevo un archivo para verificar la persistencia.

[Inicio rápido / E2B SDK](./quickstart) · [Abrir Playground (experimental)](./playground)

Usa el [E2B SDK oficial](./quickstart) para integrar Sandbox en tu aplicación. Inicia sesión en la [Console de Sandbox](https://www.sandbase.ai/console/sandboxes) para crear sandboxes y ver el estado, los logs y las métricas de las instancias. Consulta la [descripción general del producto Sandbox](https://www.sandbase.ai/sandbox) para una introducción. El recorrido y la tabla de compatibilidad de abajo describen el Playground experimental, que es independiente.

## Un recorrido de cinco minutos por el Playground {#a-five-minute-playground-walkthrough}

1. Introduce una [API key](/getting-started/api-keys) con permisos de Sandbox. Al conectarte solo se leen las plantillas y las instancias.
2. Elige una plantilla disponible, acepta el aviso de recursos y crea una instancia de corta duración.
3. Ejecuta el ejemplo de información del sistema o el de Python. Observa la salida y los eventos de proceso junto al panel de comandos.
4. Escribe y verifica un archivo de texto, pausa la instancia, reanúdala y vuelve a leer el mismo archivo.
5. Revisa los eventos del ciclo de vida, las métricas, los logs y la evidencia de tiempo de máquina. Elimina tu instancia al terminar.

Al recargar la página se borran las credenciales de la página y el historial local de operaciones; no se eliminan los sandboxes. Las instancias en ejecución siguen el tiempo de espera del servidor. Las instancias pausadas pueden conservar recursos. Anota los ID de las instancias y usa las herramientas de tu organización para conciliar y limpiar los recursos después de salir de la página.

## Capacidades y límites {#capabilities-and-boundaries}

| Capacidad | Compatibilidad en el Playground |
| --- | --- |
| Crear, listar, pausar, reanudar, ampliar el tiempo de espera, eliminar | Disponible; los controles de modificación solo se aplican a las instancias creadas en esta sesión de la página |
| Comandos y archivos de texto | Disponible; los comandos se ejecutan durante un máximo de 25 segundos y la edición de archivos se limita a `/tmp/` y 32 KiB |
| Eventos del ciclo de vida, logs, métricas, tiempo de máquina | La disponibilidad varía según el entorno; revisa los resultados devueltos |
| Chat de IA y contexto de conversación | No integrado; requiere configuración de modelos y una carga de trabajo de Agent |
| PTY, puertos de aplicación, webhooks, compilación de plantillas | No disponible en esta interfaz |
| Instantáneas y fork | No disponible en este Playground |

La interacción con la shell no es un chat de IA. La recuperación de instancias, la persistencia de archivos, la supervivencia de procesos y la continuidad de la conversación son cosas distintas que hay que verificar.

## Entender los eventos {#understanding-events}

Las entradas de **Sandbox lifecycle** son eventos nativos del servidor que se obtienen al actualizar y pueden llegar con retraso. Las entradas de **Sandbox process** describen los inicios de procesos y la salida transmitida. Las entradas de **Playground** registran la finalización o el fallo de solicitudes locales; no son eventos del ciclo de vida del servicio.

Una lista vacía no demuestra que el uso sea cero, y la falta de eventos no demuestra que una operación haya fallado. La evidencia de tiempo de máquina no es una factura final. Concilia las instancias tras un tiempo de espera agotado o una conexión interrumpida antes de intentar otra solicitud de creación.

## Visibilidad de las plantillas {#template-visibility}

Las plantillas pueden ser públicas o privadas para tu organización. Su número no es fijo. Las entradas sin nombre siguen visibles, con alias o ID como etiquetas alternativas. El acceso de tu organización y la disponibilidad de las plantillas determinan qué plantillas puedes ver y usar.

## Sandboxes y Sessions de Agents {#sandboxes-and-agent-sessions}

Las Sessions de Agents se ejecutan en la nube alojada de SandBase. Son independientes de las instancias de Sandbox que creas con el E2B SDK, y la Agents API no expone instancias de Sandbox. Consulta [Sessions](/agents/sessions).
