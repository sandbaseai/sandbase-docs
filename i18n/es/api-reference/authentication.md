---
i18nSource: 5b94f91222d138de
title: Autenticación de la API
description: Autentica las API de SandBase con tokens Bearer y los encabezados de clave de API compatibles con cada protocolo.
---

# Autenticación {#authentication}

SandBase usa claves de API para autenticar las solicitudes a la API pública. Esta página describe los métodos de integración compatibles y
las buenas prácticas para administrar claves. La autenticación de la Console y sus API internas no forman parte del contrato de la API pública.

## Métodos de autenticación {#authentication-methods}

Los endpoints estándar `/v1/*` de SandBase requieren un token Bearer. Las operaciones de Anthropic Messages y las compatibles con Google Gemini también aceptan las ubicaciones de clave de API nativas de sus SDK.

### Token Bearer {#bearer-token}

Incluye la clave en el encabezado `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

Este es el método estándar que usan los SDK compatibles con OpenAI.

### Anthropic Messages: encabezado x-api-key {#anthropic-messages-x-api-key-header}

Incluye la clave en el encabezado `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Este encabezado solo lo admite `POST /v1/messages`. Los demás endpoints públicos no lo leen; usa autenticación
Bearer para Chat Completions, `/v1/run` y las API de recursos.

### Prioridad {#priority}

Solo en `POST /v1/messages`, `x-api-key` tiene prioridad cuando ambos encabezados están presentes.

### Claves de API compatibles con Google Gemini {#google-gemini-compatible-api-keys}

Las operaciones GenerateContent e Interactions de Gemini aceptan `x-goog-api-key`, `Authorization: Bearer …` o el parámetro de consulta `key`, en ese orden de prioridad. Es preferible usar un encabezado, porque las credenciales en la query string pueden aparecer en logs y en el historial del navegador. Consulta [Google Gemini](/api-reference/gemini-generate-content) y [Gemini Interactions](/api-reference/gemini-interactions) para ver las rutas compatibles.

### Lógica de extracción {#extraction-logic}

Los endpoints estándar solo leen `Authorization: Bearer <key>`. El middleware de Anthropic Messages lee primero `x-api-key`
y, si no está, usa el encabezado Bearer. Los recursos de la plataforma de Agents aceptan `Authorization: Bearer` o
`X-API-Key` (ver más abajo). La [API de eventos de webhooks](/api-reference/webhooks) (`/events/webhooks*`) también acepta cualquiera de los dos
encabezados y usa el encabezado Bearer cuando ambos están presentes. Si falta una credencial compatible, se devuelve `401 Unauthorized`.

### Recursos de la plataforma de Agents {#agents-platform-resources}

`/v1/agents*` (incluido `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
y `/v1/skills*` aceptan la clave en cualquiera de los dos encabezados:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Si se envían `Authorization: Bearer` y `X-API-Key` a la vez, deben llevar la misma clave; los valores distintos devuelven `401 unauthorized`. Repetir cualquiera de los encabezados también devuelve 401.
- `OpenAI-Beta` es opcional. Si está presente, debe ser `agents=v1`.
- Las solicitudes de lectura requieren el permiso `agents.read` y las de escritura `agents.write`. Las claves estándar creadas en la Console tienen ambos. Las claves con alcance restringido emitidas por SandBase, como las claves de CLI Login, devuelven `403 insufficient_scope`.
- `402 spending_limit_exceeded` significa que se agotó el límite de gasto de la clave o el saldo de la organización.
- Los errores usan el [sobre de error de Agents](/api-reference/errors#agents-platform-errors), no el formato plano `{"error": "…"}` que se muestra más abajo.

## Formato de las claves de API {#api-key-format}

Las nuevas claves de API creadas en la Console tienen este formato:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Componente | Descripción |
|-----------|-------------|
| `sk-` | Prefijo estándar de "clave secreta" |
| `xxxx...` | 64 caracteres hexadecimales generados a partir de 32 bytes aleatorios |

Las claves heredadas `sk-sb-...` siguen funcionando hasta que vencen o se revocan. Los clientes deben tratar las claves como cadenas opacas
en lugar de rechazar una credencial por su prefijo o su longitud.

::: warning
Nunca expongas tu clave de API en código del lado del cliente, repositorios públicos ni logs. Trátala como una contraseña.
:::

## Crear claves de API {#create-api-keys}

### Desde la Console {#via-console}

1. Inicia sesión en la [Console de SandBase](https://www.sandbase.ai/console)
2. Abre **Developer → API Keys**
3. Haz clic en **New key**
4. Ponle a la clave un nombre descriptivo (por ejemplo, "Production Backend", "Development")
5. Copia la clave de inmediato: no se volverá a mostrar

### Propiedades de la clave {#key-properties}

| Propiedad | Descripción |
|----------|-------------|
| Name | Etiqueta legible para identificarla |
| Organization | La organización a la que pertenece la clave |
| Enabled | Si la clave está activa |
| Spending Limit | Límite de gasto opcional por clave |
| Expires At | Fecha de vencimiento opcional |
| Created At | Cuándo se creó la clave |

Las claves estándar creadas en la Console tienen acceso a nivel de organización a la API pública documentada. Las credenciales emitidas por SandBase, como las claves de CLI Login, pueden tener un alcance restringido. La Console no permite elegir alcances para las claves estándar.

## Ciclo de vida de las claves {#key-lifecycle}

### Rotación {#rotation}

Para rotar una clave:

1. Crea una clave nueva en la Console
2. Actualiza tu aplicación para que use la clave nueva
3. Verifica que la clave nueva funcione en producción
4. Revoca la clave anterior

::: tip
Crea siempre la clave nueva antes de revocar la anterior para evitar interrupciones del servicio.
:::

### Revocación {#revocation}

Las claves revocadas no pueden autenticar solicitudes nuevas. La API devuelve `401 Unauthorized` con el mensaje:

```json
{"error":"API key has been revoked"}
```

### Vencimiento {#expiration}

Las claves pueden tener una fecha de vencimiento opcional. Las claves vencidas devuelven `401 Unauthorized` con el mensaje:

```json
{"error":"API key has expired"}
```

## Requisitos de autenticación por endpoint {#endpoint-authentication-requirements}

| Endpoint | Método de autenticación | Descripción |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | Clave de API (Bearer) | Chat Completions |
| `POST /v1/responses` | Clave de API (Bearer) | API Responses compatible con OpenAI |
| `POST /v1/messages` | Clave de API (Bearer o x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | Clave de API (x-goog-api-key, Bearer o key en la query) | Gemini GenerateContent |
| `/v1beta/interactions*` | Clave de API (x-goog-api-key, Bearer o key en la query) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | Clave de API (Bearer o X-API-Key) | Recursos de la plataforma de Agents |

La Console de SandBase usa un flujo de autenticación de navegador independiente. Sus solicitudes internas no son endpoints públicos
compatibles y las integraciones no deben usarlas.

## Aislamiento por organización {#organization-isolation}

Las claves de API tienen alcance de organización. Cuando te autenticas con una clave:

- Solo puedes acceder a los recursos que pertenecen a tu organización
- El uso y la facturación se registran por organización

## Respuestas de error {#error-responses}

| Estado HTTP | Mensaje | Causa |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | No se proporcionó ninguna clave |
| 401 | `invalid API key` | La clave no existe en la base de datos |
| 401 | `API key has been revoked` | La clave se deshabilitó |
| 401 | `API key has expired` | La clave superó su fecha de vencimiento |
| 402 o 403 específico del protocolo | `API key spending limit exceeded` | Se alcanzó el límite de gasto de la clave; consulta el contrato de errores documentado del endpoint |
| 403 | `API key is not authorized for this endpoint` | Se usó una clave con alcance restringido en un endpoint fuera de su alcance |

Estos mensajes llegan en el cuerpo plano `{"error":"<message>"}`, salvo los errores de alcance `403`. En los endpoints de modelos y de
cuenta, esos errores usan `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
en los recursos de la plataforma de Agents usan el [sobre de error de Agents](/api-reference/errors#agents-platform-errors) con
`code` `insufficient_scope`.

## Buenas prácticas de seguridad {#security-best-practices}

### Haz esto {#do}

- **Guarda las claves en variables de entorno**: nunca las escribas directamente en el código fuente
- **Usa claves distintas por entorno**: claves diferentes para desarrollo, staging y producción
- **Define fechas de vencimiento**: elige un intervalo de rotación acorde a tu política de seguridad
- **Supervisa el uso**: revisa la Console para detectar actividad inesperada
- **Usa claves estándar solo para cargas de trabajo que necesiten acceso a la API pública**: mantén las credenciales restringidas de CLI Login en su flujo administrado

### No hagas esto {#don-t}

- **No subas claves al control de versiones**: agrega `.env` a `.gitignore`
- **No compartas una misma clave entre aplicaciones no relacionadas**: las claves separadas hacen más segura la rotación y la respuesta a incidentes
- **No expongas claves en código del lado del cliente**: pasa siempre las solicitudes por tu backend
- **No registres claves de API en logs**: oculta las claves en los logs de la aplicación

### Ejemplo con variables de entorno {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Límites de velocidad por clave {#rate-limiting-by-key}

Los límites de solicitudes se asignan por organización y los comparten todas sus claves de API, así que crear más claves no aumenta
el límite. La API no publica un valor numérico predeterminado universal
ni encabezados de cuota restante.

Consulta [Límites de velocidad](/guides/rate-limiting) para obtener detalles sobre los límites y cómo manejar las respuestas 429.
