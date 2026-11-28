---
i18nSource: 91c5a0d1b6de6434
title: Precios y uso
description: Consulta los precios actuales de los modelos, revisa el costo de las tareas y gestiona la facturación de SandBase de forma segura.
---

# Precios y uso {#pricing-and-usage}

SandBase usa facturación de pago por uso. La disponibilidad de los modelos, las fórmulas de precio, los multiplicadores de caché y los cargos
específicos de cada capacidad pueden cambiar de forma independiente, así que las integraciones deben leer los metadatos en vivo en lugar de depender de tablas de precios
copiadas.

## Llamadas gratuitas diarias a la API {#daily-free-api-calls}

Cada organización recibe 100 llamadas gratuitas a APIs de datos (búsqueda, redes sociales, scraping, comercio electrónico, finanzas) por día UTC. La
cuota la comparten todas las APIs de datos elegibles y todas las claves de la organización, y se restablece a las 00:00 UTC. Los LLM y
los modelos multimedia no son elegibles. Algunas APIs de datos tampoco lo son: las más caras o con precio por fórmula, como algunos
endpoints por lotes, los endpoints de crawl, Xiaohongshu PGY y las rutas `kol-*` de Douyin Xingtu, se facturan desde la primera llamada.
Para comprobar una herramienta, ejecuta `sandbase_inspect`: las herramientas elegibles incluyen `pricing.free_quota`, y las que no lo tienen siempre se
facturan.

- Las llamadas dentro de la cuota no se cobran, y una organización con saldo cero puede seguir usándolas.
- Después de la llamada número 100, las llamadas elegibles siguen funcionando y se facturan por llamada al precio que muestra la herramienta. No se
  rechazan ni se limitan por haber agotado la cuota.
- Las llamadas no usadas no se acumulan para el día siguiente.

En las [herramientas MCP de SandBase](/setup/), `sandbase_inspect` marca las herramientas elegibles con `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` devuelve la cuota del día como `free_api_quota` con
`daily_limit`, `used_today`, `remaining` y `resets_at`; `used_today` y `remaining` se omiten cuando el recuento no está disponible
temporalmente. Una vez liquidada una ejecución, `sandbase_run` y `sandbase_run_get` informan `free_quota_status`:
`free` (cubierta por la cuota), `overage` (facturada después de agotar la cuota) o `degraded` (no cobrada
porque el recuento de la cuota no estaba disponible).

## Gestionar la facturación en la Console {#manage-billing-in-the-console}

Usa **Developer → Billing** para ver tu saldo, comprar créditos, configurar la recarga automática, canjear cupones y gestionar los ajustes de facturación disponibles para tu
organización. Abre **Developer → Activities → Usage** para ver resúmenes de solicitudes, tokens y costos a nivel de organización.

::: info Límites de la API pública
Los endpoints de saldo, recarga, exportación de facturación y uso de toda la organización no forman parte actualmente de la
API pública admitida. No automatices las solicitudes de red de la Console ni dependas de rutas internas de la Console.
:::

## Consultar los precios actuales de los modelos {#read-current-model-pricing}

Primero descubre un modelo habilitado:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Después solicita su ficha de modelo completa:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

El endpoint de listado está optimizado para el descubrimiento y omite intencionadamente los precios detallados de tokens, caché y razonamiento.
Lee los precios detallados del modelo seleccionado en `model_card` de la respuesta de detalle. No existe una fórmula universal
que se aplique a todos los LLM, modelos multimedia, modelos de embeddings o capacidades de API.

## Consultar el costo registrado de una tarea {#check-one-task-s-recorded-cost}

Cuando una operación devuelve un ID de tarea, consulta su registro de liquidación:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

La respuesta distingue el `cost` actual del `estimated_cost` e indica si la liquidación es definitiva. No
uses `cost` para la conciliación de facturación hasta que `settled` sea `true`. Los registros de tareas son datos de consulta operativa y no
un libro contable. Usa los registros de facturación y las exportaciones CSV disponibles en **Developer → Activities → Usage**
para la conciliación y los registros a largo plazo.

## Prácticas de control de costos {#cost-control-practices}

- Obtén la ficha de modelo actual antes de lanzar una nueva carga de trabajo.
- Revisa `capability_tags`, `supported_modes` y `unified_schema`; las alternativas más baratas solo son útiles si
  admiten el comportamiento de entrada y salida necesario.
- Limita el contexto innecesario del prompt y establece un límite adecuado de tokens de salida cuando el modelo seleccionado lo admita.
- Trata el almacenamiento en caché como algo específico de cada modelo. Revisa la ficha del modelo y los campos de uso devueltos en lugar de suponer un descuento
  general del proveedor.
- Registra los ID de tarea solo para consultar el costo de la tarea; para el trabajo asíncrono de `/v1/run`, registra el ID de ejecución opaco devuelto y sondea `GET /v1/run/{id}` solo mientras el estado sea `pending` o `running`.
- Usa los controles de gasto que ofrece la Console para tu organización.

## Errores de pago {#payment-errors}

Una operación de la API puede devolver HTTP `402` cuando la organización no puede financiar la solicitud. Los envoltorios de error varían según la
superficie de compatibilidad de la API, así que gestiona el estado HTTP y el objeto de error documentado en lugar de buscar una cadena de
mensaje concreta. Tras resolver la facturación en la Console, reintenta según las reglas de idempotencia y recuperación de la operación.

Los envíos de video también se comprueban según su costo estimado antes de empezar. Una sola recarga de $10 o más
sube el nivel de tu cuenta, lo que permite ejecutar más tareas de video a la vez. Consulta
[Límites de concurrencia](/guides/concurrency-limits).

Consulta [Modelos y precios](/for-agents/models), [Costo de la tarea](/api-reference/tasks/cost) y
[Errores](/api-reference/errors) para conocer los contratos públicos actuales.
