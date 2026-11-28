---
i18nSource: a4db28360a2974cd
title: Editar imagen
description: Edita imágenes subidas con la API síncrona compatible con OpenAI Images.
aside: false
outline: false
apiReference:
  title: Editar imagen
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Edita una o varias imágenes subidas mediante el endpoint multipart síncrono de SandBase compatible con OpenAI Images.
  signature: client.images.edit(params)
  groups:
    - title: Cuerpo de la solicitud
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: Uno de gpt-image-2, gpt-image-2.5-flare o gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Descripción en texto de la edición solicitada.
        - name: image
          type: file | file[]
          required: true
          description: Uno o varios archivos de imagen de origen. Repite el campo multipart para enviar varias imágenes.
        - name: mask
          type: file
          required: false
          description: Imagen de máscara opcional para inpainting.
        - name: n
          type: integer
          required: false
          description: Número de imágenes editadas que se devuelven, cuando se admite.
        - name: size
          type: string
          required: false
          description: Dimensiones de salida admitidas por el modelo.
        - name: quality
          type: string
          required: false
          description: Calidad de salida admitida por el modelo.
        - name: background
          type: string
          required: false
          description: Configuración del fondo de salida.
        - name: input_fidelity
          type: string
          required: false
          description: Grado en que los modelos compatibles deben conservar los detalles de la imagen de origen.
        - name: output_format
          type: string
          required: false
          description: Codificación de salida, como png, webp o jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Nivel de compresión de salida de 0 a 100.
        - name: user
          type: string
          required: false
          description: Identificador de usuario final compatible con el proveedor.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Subidas multipart
      description: Envía model, prompt e image como multipart/form-data. Repetir el campo image conserva varios archivos de origen.
    - title: Solo síncrono
      description: Se rechazan stream=true, mode=stream y mode=async.
  errors:
    - status: "400"
      description: Cuerpo multipart no válido, modelo no admitido, modo de streaming o solicitud al proveedor no válida.
    - status: "401"
      description: API key ausente o no válida.
    - status: "402"
      description: Se alcanzó el límite de gasto de la organización o de la API Key.
    - status: "403"
      description: El alcance de la API key no autoriza este endpoint.
    - status: "404"
      description: El modelo de edición de imágenes enrutado no está disponible.
    - status: "429"
      description: Se superó el límite de frecuencia.
    - status: "500"
      description: Falló la persistencia de la solicitud o el procesamiento de la respuesta.
    - status: "502"
      description: El proveedor devolvió una respuesta nativa no válida.
    - status: "503"
      description: Ninguna ruta de proveedor tuvo éxito.
---

<ApiReferencePage />

## Modelos admitidos {#supported-models}
Estos modelos de imagen de OpenAI usan la Images API nativa en este endpoint y en [`/v1/images/generations`](/api-reference/images/generations). Envía el nombre público del modelo en `model`:

| `model` | Ideal para |
| --- | --- |
| `gpt-image-2.5-flare` | Generación y edición rápidas y de alta calidad para el trabajo creativo diario |
| `gpt-image-2.5-sunburst` | Trabajos en los que la fidelidad visual y la precisión son lo más importante |
| `gpt-image-2` | La generación anterior de GPT Image |

Las solicitudes son síncronas y devuelven los datos de imagen en `data` como `b64_json` o como URL. Este endpoint es independiente del endpoint general asíncrono de modelos `/v1/run`; la página de cada modelo en el [catálogo de modelos](https://www.sandbase.ai/models/image-video) documenta ese contrato y sus precios.

Indica `model`, `prompt` y al menos un archivo `image`. Repite el campo `image` para componer o editar varias imágenes de origen:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
