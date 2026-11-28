---
i18nSource: 8c960d117a998817
title: Modelos de imagen y video
description: Usa la Run API compartida de SandBase para generar imágenes y videos de forma asíncrona.
---

# Modelos de imagen y video {#image-and-video-models}

Los modelos de imagen y video usan la Run API asíncrona compartida de SandBase. Envía una tarea
con `POST /v1/run` y luego consulta `GET /v1/run/{id}` hasta que la ejecución alcance un
estado terminal.

## Enviar una tarea {#submit-a-task}

Usa el ID de modelo exacto de [Modelos de imagen y video](https://www.sandbase.ai/models/image-video). El resto de
los campos de la solicitud son específicos del modelo; abre la referencia de la API del modelo para ver sus
entradas obligatorias y sus límites.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

La respuesta incluye un `id` opaco y un `status` como `pending` o
`running`.

## Consultar el resultado {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Sigue consultando hasta que `status` sea `completed`, `failed` o `timeout`. Las ejecuciones
completadas contienen salidas específicas de la capacidad, como la URL de una imagen o de un video. Conserva
el ID de la ejecución y trata la respuesta de la ejecución como el estado de referencia.

## Callbacks de webhook {#webhook-callbacks}

Las tareas asíncronas compatibles también pueden indicar `webhook_url` en la solicitud de envío.
El callback es un aviso de entrega, no un sustituto de la consulta periódica; sigue
usando `GET /v1/run/{id}` y gestiona de forma segura los callbacks duplicados o retrasados. Consulta
[Ejecutar una capacidad](/api-reference/models/run#webhook-callbacks) para ver el contrato
común de callbacks.

## Las capacidades de API usan una ruta derivada de la URL {#api-capabilities-use-a-url-derived-path}

La Run API compartida es para la generación con modelos. Las capacidades de API del
[catálogo de APIs](https://www.sandbase.ai/apis) usan una
ruta distinta derivada de la URL: `GET` o `POST /v1/api/{vendor}/{upstream_path}`.
El nombre de la capacidad calificado con el proveedor proviene de la Models API o del catálogo de APIs, así que el
campo `model` se puede omitir del cuerpo de un POST:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Esta ruta es para capacidades de API y no sustituye a `/v1/run` cuando
llamas a modelos de imagen o video. Si la capacidad de API seleccionada es asíncrona,
consulta el ID de ejecución devuelto con `GET /v1/run/{id}`.

## Próximos pasos {#next-steps}

- [Modelos de imagen y video](https://www.sandbase.ai/models/image-video)
- [Ejecutar una capacidad](/api-reference/models/run)
- [Obtener el resultado de una ejecución](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
