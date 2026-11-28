---
i18nSource: 43d08f60800d37f5
title: API de Media Assets
description: Registra Assets de medios reutilizables y obtén sus metadatos actuales y URLs de descarga.
---

# API de Media Assets {#media-assets-api}

Usa el protocolo de Assets compatible con el oficial, expuesto en `/v1/assets`, para registrar URLs de medios y obtener un `asset_url` para
solicitudes nativas de generación de video.

Para ver un ejemplo completo que registra medios y usa la referencia `asset://` devuelta con Seedance, consulta
[Usar Assets de medios registrados](/api-reference/volcengine-contents-generations#use-registered-media-assets) en la referencia de Seedance.

## Descripción general {#overview}

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/v1/assets` | Registrar un Asset |
| `GET` | `/v1/assets/{id}` | Obtener los metadatos del Asset y una URL de descarga actual |

## POST /v1/assets {#post-v1-assets}

Registra una URL de archivo de acceso público en la biblioteca de assets y devuelve un `asset_url` que se puede referenciar en solicitudes de generación de video.

### Solicitud {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|----------|--------------|
| `url` | string | Sí | URL de archivo de acceso público |
| `asset_type` | string | Sí | Tipo de asset: `Image` / `Video` / `Audio` (distingue mayúsculas y minúsculas) |
| `name` | string | No | Nombre opcional del asset |

### Respuesta {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Campo | Descripción |
|-------|--------------|
| `id` | ID interno del registro |
| `asset_url` | Dirección de referencia que se usa en las solicitudes de generación de video |
| `asset_type` | Tipo de asset |
| `name` | Nombre del asset |
| `created_at` | Marca de tiempo de creación |

### Uso de asset_url {#using-asset-url}

Una vez registrado, pasa el `asset_url` a un campo de entrada que acepte una referencia de Asset en el esquema en vivo del modelo seleccionado. Los nombres de los campos varían según el modelo; por ejemplo:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Errores {#errors}

| Estado HTTP | Descripción |
|-------------|--------------|
| 400 | Falta un campo obligatorio o `asset_type` no es válido |
| 502 | Falló el registro del asset en el servicio upstream |
| 500 | No hay credenciales disponibles o se produjo un error interno |

---

## GET /v1/assets/{id}

Obtiene una URL de descarga firmada para un asset registrado a partir de su ID externo. Se usa para previsualizar o descargar el archivo subyacente.

### Solicitud {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parámetro | Ubicación | Descripción |
|-----------|----------|--------------|
| `id` | path | El ID externo (la parte posterior a `asset://` en `asset_url`) |

### Respuesta {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Campo | Descripción |
|-------|--------------|
| `asset_url` | Dirección de referencia para la generación de video (permanente) |
| `status` | Estado del ciclo de vida del Asset informado por el proveedor. Trátalo como una cadena abierta. |
| `download_url` | URL de descarga devuelta por el proveedor; puede estar vacía mientras el Asset no esté listo |

### Errores {#errors-1}

| Estado HTTP | Descripción |
|-------------|--------------|
| 404 | El asset no existe o no pertenece a tu organización |
| 502 | Falló la consulta al servicio upstream |

---

## Notas {#notes}

::: tip Importante
- `asset_url` tiene el formato `asset://{external_id}` y es la referencia reutilizable que se pasa a las entradas de los modelos compatibles
- Trata `download_url` como gestionada por el proveedor. Si está vacía o deja de funcionar, vuelve a consultar este endpoint para obtener el valor actual
- `asset_type` distingue mayúsculas y minúsculas: `Image` / `Video` / `Audio`
- La URL enviada debe ser de acceso público (la plataforma necesita poder descargarla)
:::
