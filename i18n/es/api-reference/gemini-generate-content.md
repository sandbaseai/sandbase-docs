---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Llama a SandBase con el protocolo nativo GenerateContent de Google Gemini.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Envía una solicitud nativa de Gemini y recibe una respuesta compatible con Gemini. Usa streamGenerateContent para streaming.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: model
          type: string
          required: true
          description: Nombre del modelo de Google sin prefijo, como gemini-3.5-flash. SandBase lo resuelve como google/{model}.
    - title: Cuerpo de la solicitud
      fields:
        - name: contents
          type: array
          required: false
          description: Contenido de la conversación de Gemini formado por role y parts.
        - name: systemInstruction
          type: object
          required: false
          description: Instrucción de sistema en texto con formato Content de Gemini.
        - name: generationConfig
          type: object
          required: false
          description: Configuración de muestreo, longitud de salida, salida estructurada y razonamiento.
        - name: tools
          type: array
          required: false
          description: Declaraciones de funciones o configuración compatible de herramientas integradas de Gemini.
        - name: toolConfig
          type: object
          required: false
          description: Política de llamadas a funciones de Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Categorías y umbrales de seguridad de Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Recurso de contenido en caché de Gemini, que se reenvía cuando es compatible.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## Autenticación {#authentication}

Las solicitudes compatibles con Google pueden incluir la clave de API de SandBase en `x-goog-api-key`, en `Authorization: Bearer …` o en el parámetro de consulta `key`, en ese orden de prioridad. Es preferible usar un encabezado: las credenciales en la query string pueden aparecer en los logs de proxies y en el historial del navegador.

## Streaming {#streaming}

Reemplaza el sufijo del método por `:streamGenerateContent`. Sin parámetro de consulta, SandBase devuelve objetos de respuesta compatibles con Google como un array JSON en streaming. Agrega `?alt=sse` para recibir Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Generación nativa de imágenes {#native-image-generation}

Estos modelos de imagen tienen asignaciones nativas dedicadas de GenerateContent:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

La página de cada modelo indica sus precios por token y el costo por imagen.

Para estas asignaciones, SandBase reenvía los payloads de la solicitud y la respuesta sin convertirlos a través de Chat
Completions. Así se conservan las partes de imagen, las modalidades de respuesta y los campos definidos por el proveedor. Usa el nombre
del modelo sin prefijo en la URL; por ejemplo, `google/gemini-3.1-flash-image` se convierte en `gemini-3.1-flash-image` en la ruta.
### Editar una imagen {#edit-an-image}

Agrega la imagen de origen como una parte `inlineData` junto a la instrucción de texto. Usa el tipo MIME de los bytes que envías:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Usar el SDK de Google Gen AI {#use-the-google-gen-ai-sdk}

Configura el SDK oficial para que apunte a SandBase y usa tu clave de API de SandBase:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Para streaming, llama a `:streamGenerateContent?alt=sse` (en el SDK: `generate_content_stream`) con el mismo cuerpo.

### Manejo de la respuesta {#response-handling}
Lee los archivos multimedia generados desde las partes del candidato devuelto. Como estos modelos usan passthrough nativo, el uso de mayúsculas
en los campos definidos por el proveedor y los metadatos MIME se devuelven tal como se reciben. Decodifica el payload base64 y verifica los bytes
reales del archivo antes de elegir una extensión.

## Límites del enrutamiento y la traducción {#routing-and-translation-boundaries}

SandBase selecciona solo proveedores compatibles con el protocolo nativo de Gemini solicitado. Si el modelo seleccionado no tiene una
asignación nativa compatible, la solicitud falla en lugar de recurrir a un proveedor con otro protocolo.

Los modelos que usan la ruta traducida de GenerateContent admiten texto, llamadas a funciones y sus respuestas, datos `image/*` en línea
y referencias públicas a imágenes HTTP(S). Esa ruta traducida rechaza tipos MIME en línea no compatibles, referencias privadas a Google Files o
`gs://`, varios candidatos y modalidades de respuesta no compatibles con una respuesta `400 INVALID_ARGUMENT` al estilo de Google. Las asignaciones
de generación de imágenes indicadas arriba usan passthrough sin procesar y no están sujetas a esos límites exclusivos de la traducción;
valida los campos multimedia devueltos según la respuesta del proveedor seleccionado.
