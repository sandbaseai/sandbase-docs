---
i18nSource: b5cf676d897d17a3
title: Crear respuesta
description: Crea una respuesta de modelo compatible con OpenAI, incluidas las solicitudes con streaming y con herramientas.
aside: false
outline: false
apiReference:
  title: Crear respuesta
  operation: Inference
  method: POST
  path: /v1/responses
  description: Crea una respuesta de modelo compatible con OpenAI. SandBase conserva los campos de la solicitud tras el mapeo del modelo y luego depura las respuestas para dejar solo los campos públicos de OpenAI.
  signature: client.responses.create(params)
  groups:
    - title: Cuerpo de la solicitud
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificador del modelo de la Models API.
        - name: input
          type: string | object[]
          required: false
          description: Texto, elementos de mensaje u otra entrada admitida por el modelo y el proveedor seleccionados.
        - name: instructions
          type: string
          required: false
          description: Instrucción de sistema o de desarrollador para la respuesta.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Devuelve Server-Sent Events compatibles con OpenAI.
        - name: background
          type: boolean
          required: false
          description: Solicita ejecución en segundo plano cuando el proveedor seleccionado la admite.
        - name: include
          type: string[]
          required: false
          description: Datos públicos adicionales de la respuesta que se incluyen cuando se admiten.
        - name: max_output_tokens
          type: integer
          required: false
          description: Máximo de tokens generados.
        - name: max_tool_calls
          type: integer
          required: false
          description: Máximo de llamadas a herramientas integradas, cuando se admite.
        - name: metadata
          type: object
          required: false
          description: Metadatos de la solicitud que se reenvían al proveedor.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Permite que los modelos compatibles invoquen herramientas en paralelo.
        - name: previous_response_id
          type: string
          required: false
          description: Respuesta anterior que se continúa cuando la ruta seleccionada lo admite.
        - name: reasoning
          type: object
          required: false
          description: Configuración de razonamiento para los modelos compatibles.
        - name: store
          type: boolean
          required: false
          description: Solicita el almacenamiento de la respuesta en el proveedor cuando se admite.
        - name: text
          type: object
          required: false
          description: Configuración de la salida de texto y del formato estructurado.
        - name: tool_choice
          type: string | object
          required: false
          description: Controla la selección de herramientas.
        - name: tools
          type: object[]
          required: false
          description: Herramientas disponibles para el modelo.
        - name: truncation
          type: string
          required: false
          description: Comportamiento de truncado de la entrada.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: Compatibilidad de la solicitud
      description: SandBase reescribe model al modelo upstream seleccionado y conserva los demás campos de la solicitud. El soporte de cada proveedor sigue variando.
    - title: Respuestas depuradas
      description: Solo se devuelven los campos públicos de respuesta de OpenAI y el uso de tokens. Se eliminan la facturación, la cuenta y el enrutamiento del proveedor, así como las extensiones de nivel superior desconocidas; el contenido de los elementos de salida se conserva.
    - title: Streaming
      description: Los eventos SSE públicos response.* y error se depuran y se reenvían. Los eventos privados desconocidos se descartan; los datos mal formados cierran el stream en lugar de reenviar contenido inseguro.
  errors:
    - status: "400"
      description: JSON no válido, model ausente o una solicitud al proveedor no válida.
    - status: "401"
      description: Clave de API ausente o no válida.
    - status: "402"
      description: Se alcanzó el límite de gasto de la organización o de la clave de API.
    - status: "403"
      description: Rechazo por el alcance de la clave de API o por permisos upstream.
    - status: "413"
      description: El proveedor upstream rechazó la solicitud por ser demasiado grande.
    - status: "500"
      description: Falló el ciclo de vida de la predicción o la búsqueda de la organización.
    - status: "502"
      description: La respuesta upstream no se pudo analizar y depurar de forma segura.
    - status: "503"
      description: Falló el enrutamiento o se agotaron todos los proveedores candidatos.
---

<ApiReferencePage />
