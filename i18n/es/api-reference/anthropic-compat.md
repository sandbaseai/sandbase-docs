---
i18nSource: 04f3657850b71e58
title: Crear mensaje de Anthropic
description: Crea un mensaje compatible con Anthropic usando un modelo de SandBase.
aside: false
outline: false
apiReference:
  title: Crear mensaje de Anthropic
  operation: Inference
  method: POST
  path: /v1/messages
  description: Crea un mensaje a través del endpoint Messages de SandBase compatible con Anthropic. SandBase asigna el modelo al proveedor seleccionado y conserva los campos compatibles de la solicitud y la respuesta.
  signature: client.messages.create(params)
  groups:
    - title: Encabezados de la solicitud
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "Clave de API de SandBase. También se acepta Authorization: Bearer; x-api-key tiene prioridad cuando ambos están presentes."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Versión de la API de Anthropic que se reenvía al proveedor. SandBase usa 2023-06-01 si se omite.
        - name: anthropic-beta
          type: string
          required: false
          description: Identificadores de funciones beta separados por comas, sujetos a la compatibilidad del proveedor.
    - title: Cuerpo de la solicitud
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificador de modelo compatible con Anthropic.
        - name: messages
          type: object[]
          required: true
          description: Mensajes de usuario y del asistente con texto o bloques de contenido tipados.
        - name: max_tokens
          type: integer
          required: true
          description: Número máximo de tokens de salida.
        - name: system
          type: string | object[]
          required: false
          description: Instrucción de sistema de nivel superior.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura de muestreo de 0 a 1.
        - name: top_p
          type: number
          required: false
          description: Umbral de muestreo de núcleo (nucleus sampling).
        - name: top_k
          type: integer
          required: false
          description: Limita el muestreo a los K tokens más probables.
        - name: stop_sequences
          type: string[]
          required: false
          description: Secuencias personalizadas que detienen la generación.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Devuelve Server-Sent Events al estilo de Anthropic.
        - name: metadata
          type: object
          required: false
          description: Metadatos de la solicitud, incluido un user_id opcional.
        - name: tools
          type: object[]
          required: false
          description: Definiciones de herramientas disponibles para el modelo.
        - name: tool_choice
          type: object
          required: false
          description: Controla cómo se seleccionan las herramientas.
        - name: thinking
          type: object
          required: false
          description: Configuración de razonamiento extendido para los modelos compatibles.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Autenticación
      description: "Usa x-api-key o Authorization: Bearer. Si se envían ambos, x-api-key tiene prioridad."
    - title: Protocolo transparente
      description: Salvo la asignación de modelos y las reglas de compatibilidad configuradas para el proveedor, SandBase reenvía los campos compatibles de la solicitud, las respuestas sin streaming y los eventos SSE sin traducir el protocolo.
    - title: Funciones beta
      description: anthropic-beta se reenvía cuando está presente. Las reglas de compatibilidad de un candidato pueden eliminar campos beta no compatibles u omitir ese candidato.
  errors:
    - status: "400"
      description: Cuerpo de solicitud no válido o función no compatible.
    - status: "401"
      description: Clave de API ausente o no válida.
    - status: "402"
      description: Se alcanzó el límite de gasto de la organización.
    - status: "403"
      description: Límite de gasto de la clave de API alcanzado o fallo de permisos de la organización.
    - status: "404"
      description: Modelo no encontrado o no disponible.
    - status: "413"
      description: El proveedor rechazó la solicitud por ser demasiado grande.
    - status: "429"
      description: Se superó el límite de velocidad del proveedor.
    - status: "500"
      description: Error del ciclo de vida de la predicción o del proveedor.
    - status: "502"
      description: El stream del proveedor terminó antes de producir contenido utilizable.
    - status: "503"
      description: Falló el enrutamiento o ningún proveedor candidato estaba disponible.
---

<ApiReferencePage />
