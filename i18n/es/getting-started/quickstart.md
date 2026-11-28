---
i18nSource: 8cb9626a2127cb8d
title: Inicio rápido
description: "Elige cómo usar SandBase: en la plataforma, mediante la API o con tu Agent. Encuentra Skills y Tools, sigue los pasos y empieza desde los repositorios del SDK o de la CLI."
pageClass: quickstart-page
---

# Inicio rápido {#quick-start}

## Elige cómo quieres usar SandBase {#connect}

Son **tres formas alternativas de empezar**, no tres pasos que debas completar. Usa la misma cuenta y el mismo workspace de SandBase en todas ellas.

<QuickstartPaths />

¿Solo necesitas una tarea ya lista? [Explora las Tools](#use-tools) o [elige una Skill](#use-skills). Puedes explorar los catálogos públicos y la documentación antes de iniciar sesión.

### Empieza desde los repositorios de código abierto {#start-from-the-open-source-repositories}

- **[SandBase: SDKs y ejemplos](https://github.com/sandbaseai/sandbase)**: clientes de Python, TypeScript y Go, ejemplos de la API y flujos de trabajo de Agents alojados. Úsalo cuando crees tu propia aplicación.
- **[SandBase CLI y MCP](https://github.com/sandbaseai/cli)**: instala y conecta tu herramienta de IA, o descubre y ejecuta capacidades desde una terminal. Úsalo con tu Agent existente.

## Antes de empezar: inicia sesión {#create-account}

Inicia sesión antes de usar un Playground, ejecutar una Skill alojada o crear una API key. Las herramientas gratuitas que funcionan sin cuenta se pueden usar directamente. **¿Ya iniciaste sesión? Omite este paso** y comprueba que el menú de la cuenta muestre el workspace que quieres usar.

SandBase usa GitHub o Google. No hay un registro aparte con correo electrónico y contraseña.

1. Abre [Crear cuenta / Iniciar sesión](https://www.sandbase.ai/login){target="_blank"}.
2. Completa la verificación de seguridad y luego elige **Sign in with GitHub** o **Sign in with Google**.
3. Aprueba el acceso en la ventana del proveedor.
4. Vuelve a la página que estabas usando o abre la [Console](https://www.sandbase.ai/console){target="_blank"}.

El primer inicio de sesión crea tu cuenta y un **workspace personal**. No necesitas crear una organización para probar SandBase.

Si aparece un crédito de bienvenida, puedes empezar sin añadir un método de pago. La tarjeta **Balance** del Dashboard de la Console y [Billing](https://www.sandbase.ai/console/billing){target="_blank"} muestran el saldo actual.

## En la plataforma {#use-on-website}

Elige esta opción si quieres probar primero un Model, una API o un Agent en el navegador, sin instalar ningún cliente ni escribir código.

1. Inicia sesión y abre el catálogo:
   - [Modelos de lenguaje](https://www.sandbase.ai/models){target="_blank"}
   - [Modelos de imagen y video](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Abre la página de detalle de un modelo o una API y selecciona **Playground** cuando esté disponible.
3. Introduce las entradas obligatorias, como un prompt, una imagen, una consulta de búsqueda o una URL. Revisa el precio mostrado antes de ejecutar.
4. Ejecuta la solicitud y consulta el texto, los datos, la imagen, el video o el estado de la tarea devueltos.

No necesitas crear una API key aparte para el Playground del sitio web. Si una capacidad no ofrece Playground, usa su pestaña **API** y sigue la ruta de la API que se describe a continuación.

## Mediante la API {#call-api}

Elige esta opción si vas a añadir una capacidad a tu aplicación.

1. Reutiliza una clave válida del workspace que quieres usar, o crea una [API key](/getting-started/api-keys) en [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} con **New key**. Cópiala de inmediato; solo se muestra una vez.
2. Filtra el catálogo y abre una página de detalle:
   - [Modelos de lenguaje](https://www.sandbase.ai/models){target="_blank"}: filtra por proveedor, capacidades, contexto y precio
   - [Modelos de imagen y video](https://www.sandbase.ai/models/image-video){target="_blank"}: filtra modelos multimodales como text-to-image, image-to-image, text-to-video e image-to-video
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}: filtra los recursos de API por plataforma y fuente de datos
3. Abre la pestaña **API**, copia la solicitud de ejemplo y rellena los campos obligatorios de ese endpoint.
4. Guarda tu clave de SandBase en una variable de entorno del servidor y ejecuta la solicitud. No la pongas en código del navegador ni en un repositorio público.
5. Revisa la respuesta. Para una tarea asíncrona, sigue el ejemplo de consulta de estado del endpoint hasta que termine.

Ejemplo de llamada a un modelo de lenguaje para **Bash / zsh** (macOS, Linux o Windows con WSL). Reemplaza la clave de marcador en tu equipo. Para otros entornos, usa los ejemplos de Python, TypeScript o Go del repositorio indicado más abajo; los comandos de shell no son intercambiables con PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Empieza desde código: [SDKs y ejemplos de SandBase en GitHub](https://github.com/sandbaseai/sandbase).

Más información: [Primera llamada a la API](/getting-started/first-call).

## Con tu Agent {#use-in-ai-tool}

Elige esta opción si usas Claude Code, Codex, Cursor, Kiro u otro cliente compatible y quieres tener los Models y las APIs de SandBase dentro de esa aplicación.

**Para la configuración local automática:** tu cliente debe poder ejecutar comandos y su equipo necesita Node.js 20+ con npm. Si usas un cliente solo de chat, sigue en su lugar sus [instrucciones de conexión específicas](/setup/).

1. Abre [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} en la Console.
2. Pega esta línea en el chat de tu asistente de IA y luego dile qué quieres crear. Es una instrucción de chat, no un comando de shell:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Aprueba el inicio de sesión en el navegador que abre el agente. No hay ninguna API key que pegar.
4. Inicia una sesión nueva o reinicia la aplicación para que se carguen las herramientas de SandBase.
5. Pide al agente que descubra e inspeccione la herramienta adecuada y que luego haga una solicitud acotada dentro de tu autorización y tu presupuesto. Para desarrollo, pídele que integre la respuesta en tu proyecto y que te dé el comando de ejecución y los resultados reales de las pruebas. El descubrimiento por sí solo no verifica una llamada a una API de negocio.

¿Prefieres una terminal? Ejecuta `npx -y @sandbaseai/cli@latest connect`. Configura los clientes compatibles que detecte; para configurar solo uno, usa `npx -y @sandbaseai/cli@latest connect --client codex` (reemplaza `codex` por tu cliente compatible). Después, reinicia ese cliente. Comprueba el workspace seleccionado antes de una ejecución de pago.

Por ejemplo, puedes pedir:

> Busca una API de SandBase para buscar publicaciones públicas de X sobre agentes de IA. Inspecciona primero sus entradas obligatorias y su precio, y dime el costo de una solicitud antes de ejecutarla. Conserva los enlaces a las fuentes originales en el resultado.

Código fuente e instrucciones de instalación: [SandBase CLI y MCP en GitHub](https://github.com/sandbaseai/cli).

Más información: [Conectar herramientas de IA](/setup/).

### Deja que tu asistente de IA te ayude a crear {#start-with-your-agent}

La [Skill de configuración](https://www.sandbase.ai/SKILL.md) guía a tu agente según tu situación actual: sin cuenta todavía, con una API key existente, con una herramienta ya conectada, con un proyecto existente o con una funcionalidad nueva. Comprueba las entradas y el precio del endpoint, ayuda a implementar la integración y distingue entre la configuración, una llamada verificada y una funcionalidad que funciona. Dile tu objetivo y cualquier límite de gasto; no pegues tu clave en el chat.

¿Ya tienes una clave o un proyecto? Díselo; no necesitas empezar de cero. Por ejemplo: “Tengo una clave de SandBase. Añade una consulta de tráfico de Similarweb a este proyecto; inspecciona la API y muéstrame primero el costo de la prueba en vivo.” Un asistente que no puede ejecutar comandos ni cargar herramientas necesita la [ruta de configuración específica del cliente](/setup/).

[Dale a tu agente el Quickstart en Markdown](https://www.sandbase.ai/quickstart.md) o sigue los pasos a continuación. Instalar la Skill de configuración no crea por sí mismo un Agent alojado.

### Opcional: ejecuta un Agent alojado en SandBase {#build-agent}

Elige esta opción si el trabajo tiene varios pasos o debe reutilizarse.

1. Abre [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} y selecciona **Create**.
2. Rellena **Overview** e **Instructions**.
3. Elige un **Model**.
4. Añade Skills y herramientas MCP en **Capabilities** y luego configura **Runtime**.
5. Selecciona **Create & Chat** para probarlo en una Session.
6. Llama a la versión probada desde tu aplicación usando la pestaña **API** del Agent.

Más información: [Build Agent](/agents/). Para hacer lo mismo desde código con el SDK oficial de OpenAI, consulta [Compatibilidad con OpenAI](/agents/openai-compatibility).

## Skills, Tools y otras formas de crear {#skills-and-tools}

Elige el recurso que corresponda a tu tarea. No necesitas instalar una Skill ni crear un Agent alojado para usar una API.

- **[Tools](https://www.sandbase.ai/tools):** completa una tarea concreta en una interfaz ya lista, como dar formato a un texto o consultar datos públicos.
- **[Skills](https://www.sandbase.ai/skills):** dale a un agente un flujo de trabajo reutilizable con instrucciones, scripts y ejemplos.
- **Models y APIs:** llama a una capacidad desde un Playground, tu código o un agente conectado. Explora los [modelos de lenguaje](https://www.sandbase.ai/models), los de [imagen y video](https://www.sandbase.ai/models/image-video) o las [APIs de datos](https://www.sandbase.ai/apis).
- **[Agents alojados](/agents/):** configura y ejecuta un agente reutilizable en SandBase.
- **[Sandboxes](/sandbox/):** dale al código un entorno aislado para ejecutarse y trabajar con archivos.

### Usar una Tool {#use-tools}

1. Abre [Tools](https://www.sandbase.ai/tools) y elige la tarea que quieres completar.
2. Lee los requisitos de entrada de la herramienta y su etiqueta de precio o cuota. Las utilidades gratuitas pueden funcionar sin cuenta; las herramientas de datos requieren iniciar sesión en SandBase para ejecutarse, y las pruebas de modelos pueden requerir tu propia clave.
3. Introduce el texto, la URL, el archivo u otras entradas solicitadas y luego usa la acción de ejecución de la herramienta.
4. Revisa la salida y usa la acción de copiar o descargar cuando esté disponible. En una herramienta de datos, usa su API enlazada y su solicitud de ejemplo si quieres automatizar la misma tarea.

**La cuota diaria gratuita es compartida por el workspace**, no una asignación aparte para cada herramienta. Comprueba la elegibilidad y el precio mostrado antes de ejecutar; una utilidad gratuita no hace gratuita una llamada a un modelo o a una API.

### Usar una Skill {#use-skills}

1. Abre [Skills](https://www.sandbase.ai/skills), elige un flujo de trabajo y lee sus ejemplos, entradas obligatorias y dependencias.
2. Elige una de las opciones disponibles en la página de detalle de esa Skill:
   - **Run online:** inicia sesión y ejecuta el ejemplo alojado cuando se ofrezca. Sigue su progreso y abre la salida o los archivos resultantes. Revisa la asignación mostrada; la disponibilidad y los límites varían según la Skill.
   - **Install / Download:** inicia sesión para descargar el paquete cuando se ofrezca. Extrae el paquete completo en una carpeta de trabajo y luego sigue sus instrucciones de instalación o pide a tu agente local que lea su `SKILL.md`.
3. Para el uso local, indica tu tarea, las entradas, la salida deseada y el límite de gasto. Conecta SandBase siguiendo la [ruta del Agent](#use-in-ai-tool); si los scripts de la Skill requieren una clave, configúrala en el entorno de ejecución en lugar de pegarla en el chat.
4. Revisa el resultado real. Descargar una Skill o conectar tu agente no significa que el flujo de trabajo se haya ejecutado correctamente.

La **Skill de configuración** de SandBase conecta tu cliente; las Skills del catálogo describen flujos de trabajo individuales. Comprueba las dependencias y el cliente compatible de cada Skill antes de instalarla. Las llamadas a modelos y APIs que usa un flujo de trabajo local pueden generar cargos por uso.

Consulta [Usar una Skill en local](/guides/skills/local-use) para ver un recorrido completo, incluidas las carpetas de entrada y los entregables guardados.

## Opcional: comparte un workspace de equipo {#create-organization}

Las API keys, el uso y la facturación pertenecen a una organización. Quédate en el workspace personal si estás evaluando por tu cuenta. Crea un equipo cuando varias personas vayan a compartir claves y gasto.

| Workspace | Cuándo usarlo |
|---|---|
| **Personal** | Se crea automáticamente en el primer inicio de sesión. Uno por usuario. |
| **Equipo** | Miembros, claves y saldo compartidos. Créalo para una empresa o un proyecto. |

### Crear un equipo {#create-team}

1. Abre [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"} o elige **Create Team** en el menú de la cuenta, en la parte superior derecha de la Console.
2. Introduce un **Team name** y luego selecciona **Create team**.
3. Confirma que el menú de la cuenta muestra ahora ese equipo como workspace activo.
4. En **Developer → Team**, selecciona **Add member**, introduce el **Account email** de una cuenta de SandBase existente y elige el **Workspace role** (Member o Admin).

La persona invitada ya debe tener una cuenta de SandBase. Si no la tiene, envíale [esta página](/getting-started/quickstart) para que inicie sesión primero y luego añádela.

Si perteneces a más de una organización, cambia de una a otra en el menú de la cuenta. Las claves y la facturación siguen a la organización **activa**. Consulta [Organizaciones](/admin/organizations) para ver los roles.

## Confirma que funciona {#confirm-it-works}

Estás listo cuando se cumple todo lo siguiente:

- El menú de la cuenta de la Console muestra la organización que quieres usar.
- Completaste una ruta: una llamada a la API, una ejecución en el sitio web, una herramienta de IA conectada o un Agent.
- Una solicitud se completa correctamente.

Si la solicitud falla, revisa la organización activa, la clave y [Errores](/guides/error-handling). Recarga saldo en [Billing](https://www.sandbase.ai/console/billing){target="_blank"} cuando el workspace no tenga saldo disponible.

### Si te atascas {#if-you-get-stuck}

| Lo que ves | Qué revisar |
| --- | --- |
| Se requiere iniciar sesión | Inicia sesión, vuelve a la página original y comprueba el workspace activo. |
| Clave no válida o acceso denegado | Confirma que la clave pertenece al workspace previsto y tiene acceso al endpoint. Añadir créditos no soluciona los permisos. |
| Saldo insuficiente o cuota agotada | Lee la respuesta: revisa Billing si es un problema de saldo, o la hora de restablecimiento mostrada si es un límite de cuota. |
| No hay herramientas en tu Agent | Inicia una sesión nueva del cliente y luego sigue los diagnósticos de [Conectar herramientas de IA](/setup/). |
| La tarea sigue en ejecución | Sigue el estado de la tarea devuelto o el indicador de progreso de la página. Evita enviar repetidamente la misma solicitud de pago. |

## Facturación y uso {#billing-and-usage}

Después de iniciar sesión, revisa el gasto de la organización activa:

<QuickstartResources group="ops" />

## Qué hacer a continuación {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools): completa una tarea en el navegador
- [Skills](https://www.sandbase.ai/skills): encuentra un flujo de trabajo de agente reutilizable
- [API keys](/getting-started/api-keys): crea y rota las claves de la organización
- [Catálogo de Models y APIs](https://www.sandbase.ai/models): prueba Models, APIs y Agents en el sitio web
- [Conectar herramientas de IA](/setup/): dale a tu herramienta de IA el catálogo de SandBase
- [Build Agent](/agents/): crea Agents reutilizables
- [Referencia de la API](/api-reference/): integra con código
