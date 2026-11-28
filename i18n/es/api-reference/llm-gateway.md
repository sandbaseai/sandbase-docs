---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: Crea chat completions compatibles con OpenAI con los modelos de lenguaje y visión de SandBase.
aside: false
outline: false
apiReference:
  title: Crear chat completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Crea una chat completion compatible con OpenAI con cualquier modelo de chat compatible de SandBase. Los campos compatibles con el proveedor se conservan cuando la ruta seleccionada los admite.
  signature: client.chat.completions.create(params)
  groups:
    - title: Cuerpo de la solicitud
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificador del modelo de la Models API.
        - name: messages
          type: object[]
          required: true
          description: Mensajes de la conversación con los roles que admite el proveedor seleccionado, normalmente system, developer, user, assistant o tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura de muestreo de 0 a 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Umbral de muestreo nucleus.
        - name: max_tokens
          type: integer
          required: false
          description: Número máximo de tokens de salida.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Devuelve Server-Sent Events incrementales.
        - name: stop
          type: string | string[]
          required: false
          description: Secuencia o secuencias que detienen la generación.
        - name: tools
          type: object[]
          required: false
          description: Definiciones de funciones disponibles para el modelo.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Controla si se selecciona una herramienta y cuál.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Permite que los modelos compatibles emitan varias llamadas a herramientas en un turno.
        - name: user
          type: string
          required: false
          description: Identificador del usuario final compatible con el proveedor.
        - name: response_format
          type: object
          required: false
          description: Configuración de salida como objeto JSON o JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Ajuste de esfuerzo de razonamiento compatible con el proveedor.
        - name: reasoning
          type: object
          required: false
          description: Configuración de razonamiento, como effort o max_tokens.
        - name: thinking
          type: object
          required: false
          description: Configuración de thinking, como type o budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Parámetros específicos del proveedor para rutas que requieren traducción de protocolo.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Número de opciones de respuesta que se generan.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Penalización por presencia de -2 a 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Penalización por frecuencia de -2 a 2.
        - name: stream_options
          type: object
          required: false
          description: Opciones de streaming, como include_usage.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Streaming y herramientas
      description: "Establece stream en true para usar SSE; el flujo termina con data: [DONE]. Añade stream_options.include_usage para recibir el fragmento final de uso. Las llamadas a herramientas y el contenido multimodal siguen el esquema compatible con OpenAI."
    - title: Compatibilidad con proveedores
      description: SandBase conserva los campos compatibles adicionales en las rutas del mismo protocolo. La compatibilidad de campos entre protocolos y de campos específicos del proveedor varía; usa extra_body cuando corresponda.
  errors:
    - status: "400"
      description: Cuerpo de la solicitud no válido o parámetro no admitido.
    - status: "401"
      description: API key ausente o no válida.
    - status: "402"
      description: Se alcanzó el límite de gasto de la organización.
    - status: "404"
      description: Modelo no encontrado o no disponible.
    - status: "429"
      description: Se superó el límite de frecuencia.
    - status: "500"
      description: Falló la persistencia de la solicitud o la búsqueda de la organización.
    - status: "502"
      description: El proveedor seleccionado devolvió una respuesta no válida.
    - status: "503"
      description: Ninguna ruta de proveedor tuvo éxito.
---

<ApiReferencePage />
