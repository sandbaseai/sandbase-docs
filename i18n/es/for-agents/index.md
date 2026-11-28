---
i18nSource: 0314b37a870481ae
title: Documentación legible por IA
description: Todo lo que un agente de IA necesita para descubrir y usar la API de SandBase, en una sola página.
---

# Descripción general de la API para IA {#ai-friendly-api-overview}

::: info Contrato de Session
Una Session (`ses_*`) ejecuta una versión guardada de un Agent; créala directamente con `POST /v1/agents/sessions`. Las instancias de runtime son internas y nunca se devuelven.
:::

> Una referencia concisa tanto para personas como para agentes de IA. Para versiones en texto plano optimizadas para que las procesen LLMs, consulta [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## ¿Qué es SandBase? {#what-is-sandbase}

SandBase es una plataforma de infraestructura para agentes de IA. Una sola API key da acceso a los Models y APIs habilitados de lenguaje, imagen, video, audio, búsqueda y datos, además de flujos de trabajo de Agents. Consulta el catálogo actual en lugar de depender de una cifra fija.

## URL base de la API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Autenticación {#authentication}

Todas las solicitudes requieren un token Bearer:

```
Authorization: Bearer sk-YOUR_KEY
```

Obtén tu clave en [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Ejemplo rápido {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## APIs principales {#core-apis}

| Método | Ruta | Descripción |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | Chat compatible con OpenAI; las capacidades opcionales dependen del modelo seleccionado |
| `POST` | `/v1/messages` | API de mensajes compatible con Anthropic |
| `POST` | `/v1/run` | Envía una generación de modelo usando el esquema específico del modelo |
| `GET` | `/v1/run/{id}` | Consulta el estado de una generación asíncrona y obtén los resultados |
| `GET` | `/v1/models` | Lista los modelos lógicos habilitados; por defecto, el tipo LLM |
| `GET` | `/v1/models/{id_or_name}` | Obtén los detalles, el esquema, las capacidades y los precios del modelo |
| `GET` | `/v1/tasks/{task_id}/cost` | Obtén el costo y el uso de una tarea |

## Grupos de API adicionales {#additional-api-groups}

Además de las APIs principales de generación, SandBase ofrece APIs para gestionar el ciclo de vida de los agentes. Consulta la [Guía de la API para IA](./full) para los flujos de trabajo habituales y la [especificación OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) para el contrato completo.

| Grupo | Rutas clave | Propósito |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Crear y versionar definiciones de Agents guardadas |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Ejecutar un Agent, enviar entradas y transmitir eventos en vivo |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Paquetes de instrucciones versionados que montan los Agents |
| **MCP Connections y Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Herramientas MCP remotas por HTTPS y sus tokens Bearer de solo escritura |

Los recursos de la plataforma de Agents aceptan `Authorization: Bearer` o `X-API-Key` y devuelven `{"error":{"type","code","param","message"}}` en caso de error.

## Modelo de precios {#pricing-model}

Pago por uso. Los precios son específicos de cada modelo y pueden cambiar con independencia de esta página:

- **Precios de modelos**: lee la fórmula y las unidades actuales del modelo seleccionado en `model_card`
- **Precios por token**: pueden incluir componentes de entrada, salida, caché o razonamiento cuando el modelo los declara
- **Medios y otras operaciones**: pueden usar unidades por solicitud, duración, resolución u otras específicas del modelo
- **APIs de datos** (búsqueda, redes sociales, scraping, comercio electrónico, finanzas): cada organización recibe 100 llamadas gratuitas por día UTC, compartidas entre las APIs de datos elegibles; después, las llamadas se facturan por llamada, no se bloquean. En MCP, las herramientas elegibles muestran `pricing.free_quota` en `sandbase_inspect`, y `sandbase_account` devuelve `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Consulta [Llamadas gratuitas diarias a APIs](/guides/billing#daily-free-api-calls).

Obtén el ID de modelo actual con `GET /v1/models` y luego inspecciona `GET /v1/models/{id_or_name}` antes de enviar una solicitud. No supongas que los precios o los descuentos de caché son iguales entre proveedores.

Cuando una operación devuelve un ID de tarea, consulta su costo registrado:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Límites de frecuencia {#rate-limits}

No hay un valor numérico predeterminado universal publicado. Las solicitudes están sujetas a un límite opcional de solicitudes por minuto
asignado a tu organización y compartido por todas sus API keys. Una respuesta `429` no incluye encabezados de cuota ni `Retry-After`; usa
backoff exponencial acotado con jitter. Consulta la [Guía de errores](./errors).

---

## Lecturas adicionales {#further-reading}

- [Guía de la API para IA](./full): flujos de trabajo principales, formatos de solicitud y respuesta, y ejemplos con curl
- [Modelos y precios](./models): descubrimiento de modelos en vivo, precios y orientación sobre capacidades
- [Guía de errores](./errors): formatos de respuesta documentados, manejo de HTTP y reintentos seguros
- [Especificación OpenAPI](https://www.sandbase.ai/docs/openapi.yaml): OpenAPI 3.1 legible por máquinas

## Versiones en texto plano (para agentes de IA) {#plain-text-versions-for-ai-agents}

| Archivo | URL | Contenido |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Resumen compacto (~60 líneas) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Guía de la API ampliada y orientada a IA |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Especificación OpenAPI 3.1 legible por máquinas |
