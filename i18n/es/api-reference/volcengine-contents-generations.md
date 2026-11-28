---
i18nSource: 4bd032d88bac0470
title: Video Seedance (protocolo Volcengine Ark)
description: Genera videos con Seedance 2.0 y 2.5 a través del protocolo de tareas Contents Generations de Volcengine Ark, con entradas, sondeo, facturación y Assets multimedia.
aside: false
outline: false
apiReference:
  title: Video Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Envía una tarea de video de Seedance. Un envío correcto devuelve HTTP 200 y un id de tarea de SandBase.
  groups:
    - title: Cuerpo de la solicitud
      fields:
        - name: model
          type: string
          required: true
          description: "Identificador de modelo admitido: bytedance/seedance/2.0-official o bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Entradas tipadas de texto y, opcionalmente, multimedia. El modelo valida la forma de cada elemento.
        - name: duration
          type: integer
          required: false
          description: Se reenvía al modelo sin cambios. Se aplica la validación del modelo.
        - name: resolution
          type: string
          required: false
          description: Se reenvía al modelo sin cambios. Se aplica la validación del modelo.
        - name: ratio
          type: string
          required: false
          description: Se reenvía al modelo sin cambios. Se aplica la validación del modelo.
        - name: generate_audio
          type: boolean
          required: false
          description: Se reenvía al modelo sin cambios. Solicita audio generado cuando se admite.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Guía de Seedance {#seedance-guide}

Seedance genera video a partir de texto, fotogramas de apertura y cierre, y referencias multimodales como imágenes, video y
audio. Úsalo para cualquier cosa, desde un clip sencillo de texto a video hasta una toma dirigida que siga a un sujeto visual, un movimiento de cámara
y una banda sonora.

La generación es asíncrona. Envía una tarea y sondéala hasta que llegue a un estado final.

## Elegir un modelo {#choosing-a-model}

| `model` | Ideal para | Resoluciones de salida |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Entrega en 1080p y la mayor resolución de salida disponible | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Generación de menor costo cuando basta con 480p o 720p | 480p, 720p |

Ambos modelos aceptan la misma entrada multimodal y admiten flujos de texto a video, imagen a video y referencias
multimodales con una única forma de solicitud. Elige `2.0-official` cuando 480p o 720p cubran tus necesidades y quieras la opción
más económica. Elige `2.5-official` cuando necesites 1080p.

## Referencia de la API {#api-reference}

| Método | Ruta |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

No se admite listar tareas ni cancelar o eliminar una tarea. Guarda el `id` de la tarea devuelto para obtener el resultado.

Autentica cada solicitud con la misma API key que usaste para crear la tarea:

```
Authorization: Bearer $SANDBASE_API_KEY
```

El valor de `model` debe coincidir con uno de los nombres de [Elegir un modelo](#choosing-a-model). El sondeo es la forma admitida de
recibir resultados; no dependas de `callback_url` en este endpoint.

## Inicio rápido {#quickstart}

Envía una tarea:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Sondea la tarea con ese id cada 5 a 10 segundos hasta que `status` sea `succeeded`, `failed`, `expired` o `cancelled`:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

El video generado está disponible en `content.video_url`.

## Elegir un flujo de entrada {#choose-an-input-workflow}

La API admite siete flujos de entrada habituales. Cada elemento de `content` tiene un `type`; la combinación de tipos de elemento y
roles determina el flujo:

| Objetivo | Combinación de `content` | Cuándo usarlo |
| --- | --- | --- |
| Texto a video | Texto | La escena se puede describir por completo en el prompt |
| Animar un fotograma de apertura | Texto (opcional) + imagen con `first_frame` | El primer fotograma debe coincidir con una imagen proporcionada |
| Transición entre dos fotogramas | Texto (opcional) + `first_frame` + `last_frame` | La toma necesita un inicio y un final controlados |
| Seguir una referencia visual | Texto (opcional) + imagen con `reference_image` | Un sujeto, producto, vestuario o estilo visual debe seguir siendo reconocible |
| Seguir el movimiento o el lenguaje de cámara | Texto (opcional) + video con `reference_video` | El movimiento, el ritmo, el montaje o el movimiento de cámara provienen de un clip de referencia |
| Añadir una referencia de audio | Texto/imagen/video + audio con `reference_audio` | Diálogos, música, voz o diseño sonoro deben guiar el resultado |
| Dirección multimodal completa | Referencias de texto + imagen + video + audio | Distintos recursos controlan la apariencia, el movimiento y el sonido en una sola toma |

El audio no puede ir solo. Toda solicitud que incluya un elemento de audio debe incluir también al menos un elemento de texto, imagen o
video.

### Formas de los elementos de contenido {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` indica cómo debe usar el modelo el recurso:

| Recurso | `role` | Efecto |
| --- | --- | --- |
| Imagen | `first_frame` | Usa la imagen como fotograma de apertura |
| Imagen | `last_frame` | Usa la imagen como fotograma de cierre; incluye un `first_frame` en la misma solicitud |
| Imagen | `reference_image` | Toma como referencia el sujeto, la composición, el producto, el vestuario o el estilo visual |
| Video | `reference_video` | Toma como referencia el movimiento, el trabajo de cámara, el ritmo o el montaje |
| Audio | `reference_audio` | Toma como referencia la voz, los diálogos, la música o el diseño sonoro |

Los elementos de imagen aceptan una URL pública o un valor en línea `data:image/...;base64,...`. Las referencias de video y audio deben
usar URL públicas que el modelo pueda descargar.

Incluir cualquier elemento `video_url` pone la solicitud en modo video a video, lo que cambia la tarifa por token. Consulta
[Facturación](#billing).

## Recetas habituales {#common-recipes}

Los ejemplos siguientes muestran cuerpos de solicitud. Envía cualquiera de ellos al endpoint de creación de tareas que aparece en el [Inicio rápido](#quickstart).

### Animar un primer fotograma {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### Crear una transición del primer al último fotograma {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Dirigir una toma con referencias de imagen, video y audio {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Usa el prompt para asignar una función clara a cada referencia: por ejemplo, «mantén la apariencia del producto de la imagen, usa
el movimiento de cámara del video y sigue el ritmo del audio». Esto es más fiable que pedir a cada recurso
que controle todo el resultado.

## Escribir un prompt eficaz {#writing-an-effective-prompt}

Un prompt práctico suele seguir este orden:

1. **Sujeto**: quién o qué aparece en la toma.
2. **Acción**: qué cambia o se mueve.
3. **Escena**: lugar, momento del día, clima y detalles del entorno.
4. **Estilo visual**: cinematográfico, documental, anuncio de producto, animación, etc.
5. **Cámara**: encuadre, sensación de lente, movimiento de cámara y cortes.
6. **Sonido**: diálogos, ambiente, música o efectos cuando `generate_audio` está habilitado.

Indica explícitamente qué debe permanecer estable. Por ejemplo: «La etiqueta del producto sigue siendo legible, la cámara hace un único acercamiento
lento, sin cortes de escena, con sonido ambiente natural». Cuando haya varias referencias, describe qué cualidad visual o de movimiento
tomar de cada una.

## Opciones de salida {#output-options}

| Parámetro | Tipo | Predeterminado | Valores |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` no admite `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` elige una relación a partir de la entrada y el prompt |
| `duration` | integer | `5` | De 4 a 15 segundos, o `-1` para que el modelo elija dentro del rango admitido |
| `generate_audio` | boolean | `true` | Genera voz, efectos de sonido y música de fondo sincronizados |
| `seed` | integer | `-1` | De `-1` a `2^32-1`. El mismo prompt y la misma semilla producen resultados similares, no idénticos |
| `watermark` | boolean | `false` | Añade una marca de agua de contenido generado por IA en la esquina inferior derecha |
| `tools` | array | `[]` | `[{"type": "web_search"}]` habilita la búsqueda web al planificar la toma |

### Control de la tarea {#task-control}

| Parámetro | Tipo | Predeterminado | Notas |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Tiempo de espera de la tarea en segundos, de 3600 a 259200. Una tarea que lo supera pasa a `expired` |
| `service_tier` | string | `default` | Estos modelos no admiten `flex` |
| `safety_identifier` | string | — | Identificador opaco del usuario final, de 64 caracteres como máximo. Envía un hash, no datos personales sin procesar |

### Tamaño del fotograma {#frame-size}

`resolution` y `ratio` determinan juntos las dimensiones en píxeles:

| Resolución | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Estado de la tarea {#task-status}

| `status` | Significado | Qué hacer |
| --- | --- | --- |
| `queued` | Aceptada, a la espera de iniciarse | Sigue sondeando cada 5 a 10 segundos |
| `running` | Generando | Sigue sondeando |
| `succeeded` | Terminada | Descarga `content.video_url` |
| `failed` | Rechazada por la revisión de contenido, o el modelo dio un error | Lee `error.message`. Ajusta el prompt antes de reintentar |
| `expired` | Superó `execution_expires_after` | Envíala de nuevo |
| `cancelled` | Terminó antes de que empezara la generación | Envíala de nuevo |

### Campos de la tarea {#task-fields}

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | string | El id de la tarea devuelto al enviarla |
| `model` | string | El valor de `model` que enviaste |
| `status` | string | Consulta arriba |
| `created_at` | integer | Segundos Unix |
| `updated_at` | integer | Segundos Unix. Es igual a `created_at` hasta que la tarea termina |
| `content` | object | Vacío hasta que la tarea se completa correctamente. Contiene la `video_url` generada |
| `usage` | object | Recuentos de tokens. Consulta [Facturación](#billing) |
| `error` | object | Presente en `failed` y `expired`. Contiene `code` y `message` |

### Flujo completo en Python {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Facturación {#billing}

Estos modelos facturan según `usage.completion_tokens`, que la tarea informa al terminar. La tarifa por token depende de dos
dimensiones:

- **Si la entrada incluye video.** Las solicitudes de video a video, es decir, cualquier elemento de `content` de tipo `video_url`, se facturan a
  una tarifa menor que las de texto a video.
- **Resolución de salida.** En `2.5-official`, 1080p se factura más caro que 480p y 720p. La tarifa de `2.0-official` no varía
  según la resolución.

`usage` informa `completion_tokens` y `total_tokens`, que actualmente son iguales. Está vacío mientras la tarea se ejecuta.
Consulta tu [historial de la cuenta](/api-reference/account/history) para ver los cargos reales y la
[guía de precios](/guides/billing) para ver las tarifas actuales.

## Errores {#errors}

Una solicitud no válida devuelve un error de inmediato. Un error durante la generación aparece en la tarea al sondearla. Ambos usan un
objeto `error` con un `code` legible por máquinas y un `message` legible por personas:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Pasos de recuperación habituales:

| Resultado | Qué probar |
| --- | --- |
| `400 InvalidParameter` | Revisa el nombre del modelo, el contenido obligatorio, los roles, la resolución, la duración y las URL de los recursos |
| Estado de tarea `failed` con un error de revisión de contenido | Reescribe el prompt o sustituye el recurso de referencia marcado antes de volver a enviarla |
| Estado de tarea `expired` | Envía una tarea nueva; considera un `execution_expires_after` más largo para clips de alta resolución o largos |
| `429 RateLimitExceeded` | Reintenta con retroceso exponencial y reduce los envíos simultáneos |
| `503 ServiceUnavailable` | Reintenta la misma solicitud tras una breve espera |

## Usar Assets multimedia registrados {#use-registered-media-assets}

SandBase expone el protocolo de Assets compatible con el oficial en `/v1/assets`. La solicitud de Asset y la referencia `asset://`
devuelta siguen el protocolo oficial, y la referencia se pasa sin cambios en la solicitud nativa de ByteDance Contents
Generations. Tanto
`bytedance/seedance/2.5-official` como `bytedance/seedance/2.0-official` aceptan esa referencia
donde normalmente aceptan una URL HTTP(S) pública.

El flujo completo es:

1. Registra una URL multimedia accesible con `POST /v1/assets`.
2. Consulta `GET /v1/assets/{external_id}` hasta que el proveedor indique que el Asset se puede usar.
3. Coloca el `asset_url` devuelto en un elemento `content` de Seedance y envía la tarea de generación.

### Operaciones de Asset compatibles con el oficial {#official-compatible-asset-operations}

| Método | Ruta | Propósito |
| --- | --- | --- |
| `POST` | `/v1/assets` | Registra una URL multimedia accesible y recibe una referencia `asset://` compatible con el oficial |
| `GET` | `/v1/assets/{external_id}` | Lee el estado del proveedor y obtiene la URL actual de vista previa/descarga |

La API pública expone actualmente el registro y la consulta. Los grupos de Assets, el listado, el renombrado, la actualización y la eliminación no
son operaciones públicas. Los Assets pertenecen a la organización asociada a la API key.

### Paso 1: registrar el Asset {#step-1-register-the-asset}

Envía la URL accesible a `POST /v1/assets`. `asset_type` distingue mayúsculas y minúsculas y debe ser `Image`, `Video` o `Audio`:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Guarda el `asset_url` de la respuesta:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

El valor que sigue a `asset://` es el `external_id` que usa la operación de consulta compatible con el oficial.

### Paso 2: comprobar si está listo {#step-2-check-readiness}

Consulta el Asset con el `external_id`, sin el prefijo `asset://`:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Trata `status` como un valor abierto del proveedor y no como un enum exhaustivo. Espera hasta que el proveedor indique un estado
utilizable antes de enviar la tarea de generación; un valor habitual de listo es `Active`. `download_url` lo gestiona el proveedor y
puede estar vacío durante el procesamiento. Vuelve a consultar el Asset cuando necesites una URL de vista previa actual. Sigue usando el
`asset_url` persistente en las solicitudes de Seedance en lugar de copiar `download_url`.

### Paso 3: generar con el Asset {#step-3-generate-with-the-asset}

Coloca `asset_url` en el campo de URL que corresponda al tipo de contenido. Este ejemplo usa la imagen registrada como referencia
visual:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

La respuesta de creación devuelve un `id` de tarea. Sondea
`GET /api/v3/contents/generations/tasks/{task_id}` como se describe en la página del modelo seleccionado.

### Elegir el elemento de contenido y el rol {#choose-the-content-item-and-role}

| Tipo de Asset | `content[].type` | Campo de URL | Rol admitido | Úsalo para |
| --- | --- | --- | --- | --- |
| Imagen | `image_url` | `image_url.url` | `first_frame` | Empezar el video exactamente en este fotograma |
| Imagen | `image_url` | `image_url.url` | `last_frame` | Terminar en este fotograma; incluye un `first_frame` en la misma solicitud |
| Imagen | `image_url` | `image_url.url` | `reference_image` | Conservar un sujeto, producto, composición, vestuario o estilo visual |
| Video | `video_url` | `video_url.url` | `reference_video` | Seguir el movimiento, el ritmo, el trabajo de cámara o el montaje |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Seguir la voz, los diálogos, la música o el diseño sonoro |

El audio no puede ser la única entrada. Combina un Asset `reference_audio` con texto, una imagen o un video. Cualquier solicitud que
contenga un `video_url` usa la tarifa de facturación de video a video.

#### Ejemplo de Asset de video {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Ejemplo de Asset de audio {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### ¿URL directa o referencia `asset://`? {#direct-url-or-asset-reference}

| Entrada | Ideal cuando | Contrapartida |
| --- | --- | --- |
| URL HTTP(S) pública | El contenido ya está alojado y se usa una sola vez | Es la vía más rápida, pero la URL debe seguir accesible durante el envío de la tarea y la descarga por parte del proveedor |
| Referencia `asset://` | El contenido se reutiliza mediante el protocolo oficial de Assets | Añade un paso de registro/comprobación, y luego ofrece una referencia persistente para futuras tareas de Seedance |

Para los parámetros de la solicitud, el sondeo, los estados de las tareas y la facturación, consulta la [Guía de Seedance](#seedance-guide) más arriba.

## Recursos oficiales de ByteDance {#official-bytedance-resources}
- [Documentación de generación de video con Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API para crear tareas de generación de contenido](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Guía de prompts de Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
