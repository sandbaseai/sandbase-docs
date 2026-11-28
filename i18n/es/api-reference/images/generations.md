---
i18nSource: 39ce638efc41350d
title: Generar imagen
description: Genera una imagen con la API síncrona compatible con OpenAI Images.
aside: false
outline: false
apiReference:
  title: Generar imagen
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Genera imágenes a través del endpoint síncrono de SandBase compatible con OpenAI Images. Este endpoint es distinto de la API general de modelos /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Cuerpo de la solicitud
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: Uno de gpt-image-2, gpt-image-2.5-flare o gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Descripción en texto de la imagen que se va a generar.
        - name: n
          type: integer
          required: false
          description: Número de imágenes que se generan, cuando se admite.
        - name: size
          type: string
          required: false
          description: Dimensiones de salida que admite el modelo.
        - name: quality
          type: string
          required: false
          description: Calidad de salida, como low, medium, high o auto.
        - name: background
          type: string
          required: false
          description: Ajuste del fondo, como transparent, opaque o auto.
        - name: output_format
          type: string
          required: false
          description: Codificación de salida, como png, webp o jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Nivel de compresión de salida de 0 a 100.
        - name: moderation
          type: string
          required: false
          description: Ajuste de moderación compatible con el proveedor.
        - name: user
          type: string
          required: false
          description: Identificador del usuario final compatible con el proveedor.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: Solo síncrono
      description: Se rechazan stream=true, mode=stream y mode=async. Usa directamente el array data devuelto.
    - title: Campos compatibles
      description: Los campos JSON adicionales se reenvían sin cambios, pero su compatibilidad depende del modelo y del proveedor.
  errors:
    - status: "400"
      description: JSON no válido, modelo no admitido, modo de streaming o solicitud al proveedor no válida.
    - status: "401"
      description: API key ausente o no válida.
    - status: "402"
      description: Se alcanzó el límite de gasto de la organización o de la API Key.
    - status: "403"
      description: El ámbito de la API key no autoriza este endpoint.
    - status: "404"
      description: El modelo de imagen enrutado no está disponible.
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

## Modelos compatibles {#supported-models}
Estos modelos de imagen de OpenAI usan la Images API nativa en este endpoint. Envía el nombre público del modelo en `model`:

| `model` | Ideal para |
| --- | --- |
| `gpt-image-2.5-flare` | Generación y edición rápidas y de alta calidad para el trabajo creativo diario |
| `gpt-image-2.5-sunburst` | Trabajos en los que la fidelidad visual y la precisión son lo más importante |
| `gpt-image-2` | La generación anterior de GPT Image |

Las solicitudes son síncronas y devuelven los datos de la imagen en `data` como `b64_json` o como URL. Este endpoint es independiente del endpoint general asíncrono de modelos `/v1/run`; la página de cada modelo en el [catálogo de modelos](https://www.sandbase.ai/models/image-video) documenta ese contrato y sus precios.

Para editar imágenes, envía `multipart/form-data` a [`POST /v1/images/edits`](/api-reference/images/edits) con los mismos nombres de modelo.
