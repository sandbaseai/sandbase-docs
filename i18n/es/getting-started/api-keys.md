---
i18nSource: 3dc57d405dbf561d
title: Claves de API
description: Cómo crear, gestionar y proteger tus claves de API de SandBase para autenticar las solicitudes a la API.
---

# Claves de API {#api-keys}

Las claves de API autentican tus solicitudes a SandBase. Esta guía explica cómo crear claves, usarlas en las solicitudes y mantenerlas seguras.

## Crear una clave de API {#create-an-api-key}

1. Inicia sesión en la [SandBase Console](https://www.sandbase.ai/console)
2. Abre **Developer → API Keys** (o ve directamente a [API Keys](https://www.sandbase.ai/console/keys))
3. Haz clic en **New key**
4. Introduce un **Name** descriptivo (por ejemplo, "Production Server", "Local Development")
5. Opcionalmente, define un **Spending limit** (vacío significa sin límite) y una fecha en **Expires** (vacío significa sin caducidad)
6. Haz clic en **Create key**
7. Copia la clave del aviso **API key created** de inmediato: solo se mostrará una vez

::: danger Importante
Tu clave de API solo se muestra una vez, al crearla. Si la pierdes, tendrás que crear una nueva. Guárdala de forma segura antes de cerrar el cuadro de diálogo.
:::

## Formato de la clave {#key-format}

Las claves de API nuevas creadas en la Console usan el prefijo `sk-` seguido de 64 caracteres hexadecimales:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Las claves `sk-sb-...` existentes siguen siendo válidas hasta que caduquen o se revoquen. No uses solo el prefijo para validar una
credencial; trata siempre el valor completo como un secreto opaco.

## Métodos de autenticación {#authentication-methods}

SandBase admite dos formas de pasar tu clave de API en las solicitudes:

### Encabezado Authorization (recomendado) {#authorization-header-recommended}

Usa el encabezado estándar `Authorization: Bearer`. Es compatible con los SDK de OpenAI y Anthropic:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: encabezado x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` también acepta el encabezado nativo de Anthropic `x-api-key`:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Entre los gateways de modelos, solo `POST /v1/messages` lee `x-api-key`, y tiene prioridad cuando están presentes ambos encabezados
admitidos. Los [recursos de la plataforma de Agents](/api-reference/authentication#agents-platform-resources) también aceptan
`X-API-Key`. Usa el encabezado Bearer para todos los demás endpoints públicos.
:::

## Permisos de las claves {#key-permissions}

Las claves de API de SandBase tienen alcance a **nivel de organización**:

- Una clave estándar creada en la Console puede llamar a los recursos públicos de la API disponibles para la organización
- El uso se factura a la organización propietaria de la clave
- Una clave puede tener una caducidad y un límite de gasto opcionales
- Las credenciales emitidas por SandBase, como las claves de CLI Login, pueden tener un alcance restringido y devuelven `403` fuera de ese alcance

Por ahora, la Console no permite elegir alcances para una clave estándar. Las claves de CLI Login se crean al conectar una herramienta de IA. La página API Keys las agrupa en una fila desplegable **CLI Login**, y no se pueden editar como las claves estándar. Las claves que SandBase crea por ti llevan una insignia **Auto-created**; no tienen límite a nivel de clave y están limitadas por el saldo de la cuenta.

La lista de claves muestra **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** y **Status** de cada clave. Usa **Edit** para cambiar el nombre, el límite de gasto o la caducidad de una clave estándar.

Trata cada clave como una credencial de aplicación y no como una contraseña personal. Usa la pertenencia a la organización para el acceso de personas y las claves de API para las cargas de trabajo.

## Estrategia por entorno {#environment-strategy}

Crea una clave distinta para cada aplicación y entorno:

| Clave | Nombre de ejemplo | Por qué |
|---|---|---|
| Desarrollo local | `research-app-dev` | Rotarla sin interrumpir producción |
| Staging | `research-app-staging` | Aislar el uso y los incidentes de prueba |
| Producción | `research-app-production` | Dar a producción un responsable claro y una exposición limitada |
| Automatización temporal | `release-check-2026-08` | Definir una caducidad y revocarla de forma independiente |

Registra el responsable y el despliegue que usa cada clave. Durante la rotación, despliega la clave nueva, verifica que las solicitudes funcionan y solo entonces revoca la clave antigua.

## Caducidad y revocación de claves {#key-expiration-and-revocation}

### Caducidad {#expiration}

Al crear una clave, puedes definir opcionalmente una fecha de caducidad. Una vez caducada, la clave deja de funcionar y las solicitudes devuelven un error `401 Unauthorized`.

Las claves sin fecha de caducidad siguen siendo válidas hasta que se revoquen manualmente.

### Revocar una clave {#revoking-a-key}

Para revocar (desactivar) una clave:

1. Ve a [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Busca la clave que quieres revocar
3. Haz clic en **Revoke**
4. Confirma la acción

Las claves revocadas no pueden autenticar solicitudes nuevas. La revocación no se puede deshacer: crea una clave nueva si revocas una por error.

## Buenas prácticas de seguridad {#security-best-practices}

### Nunca subas claves al control de versiones {#never-commit-keys-to-version-control}

Usa variables de entorno o un gestor de secretos:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Usa claves distintas para cada entorno {#use-separate-keys-for-different-environments}

Crea claves diferentes para desarrollo, staging y producción. Así puedes revocar una clave de desarrollo comprometida sin afectar a producción.

### Rota las claves con regularidad {#rotate-keys-regularly}

Crea claves nuevas periódicamente y retira las antiguas. Esto limita el periodo de exposición si una clave se filtra.

### Supervisa la actividad {#monitor-activity}

Revisa **Developer → Activities** con regularidad para detectar picos inesperados de solicitudes o de uso, que podrían indicar una clave comprometida. **Request History** permite filtrar por clave de API.

Si una clave queda expuesta, revócala de inmediato, crea una de reemplazo, actualiza la aplicación que la usa y revisa Activities y la facturación en busca de uso inesperado. No esperes a una rotación programada.

### Define fechas de caducidad {#set-expiration-dates}

Para accesos temporales (pipelines de CI/CD, acceso de contratistas, demos), define una fecha de caducidad para que la clave deje de funcionar automáticamente.

## Solución de problemas {#troubleshooting}

| Error | Causa | Solución |
|-------|-------|-----|
| `401 - missing API key` | No se proporcionó ninguna clave en la solicitud | Añade un encabezado `Authorization: Bearer <key>` |
| `401 - invalid API key` | La clave no existe | Revisa si hay errores tipográficos y asegúrate de incluir la clave completa |
| `401 - API key has been revoked` | La clave se revocó de forma permanente en la Console | Crea una clave de reemplazo |
| `401 - API key has expired` | La clave superó su fecha de caducidad | Crea una clave nueva o amplía la caducidad |
| `402 - API key spending limit exceeded` | La clave alcanzó su límite de gasto configurado | Aumenta el límite o usa otra clave autorizada |
| `403 - insufficient_scope` | Una credencial con alcance limitado no puede llamar a este endpoint | Usa una clave autorizada para el endpoint |

## Próximos pasos {#next-steps}

- [**Primera llamada a la API**](/getting-started/first-call): haz una llamada a la API detallada con un recorrido completo de solicitud y respuesta
- [**Autenticación**](/api-reference/authentication): encabezados admitidos, ciclo de vida y errores específicos de cada protocolo
- [**Referencia de la API**](/api-reference/): documentación completa de los endpoints
