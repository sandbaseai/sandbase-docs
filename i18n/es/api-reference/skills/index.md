---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Sube paquetes de Skill versionados y adjúntalos a Agents.
---

# Skills API {#skills-api}

Una Skill es un paquete ZIP versionado de instrucciones y recursos que un Agent puede montar. Los IDs de Skill usan el prefijo `skl_`, y los identificadores de versión son cadenas como `"1"`.

## Operaciones de Skill {#skill-operations}

| Método | Ruta | Propósito |
|---|---|---|
| `POST` | `/v1/skills` | [Crear una Skill](./create) a partir de un ZIP subido |
| `GET` | `/v1/skills` | [Listar Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Obtener una Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Actualizar](./update) la versión por defecto, el estado o los metadatos |
| `DELETE` | `/v1/skills/{skill_id}` | [Eliminar una Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Descargar el ZIP de la versión por defecto |
| `GET` | `/v1/skills/{skill_id}/versions` | [Listar versiones](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Subir una versión](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Obtener una versión](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Descargar el ZIP de una versión |
| `GET` | `/v1/skills/catalog` | [Explorar Skills públicas](./catalog) |

## Configuración en cinco minutos {#five-minute-setup}

1. Crea una carpeta con un `SKILL.md` cuyo frontmatter defina `name` y `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Comprímela (`zip -r release-notes.zip release-notes/`). El archivo puede ocupar como máximo 5 MiB.
3. Súbela como la única parte multipart `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Haz referencia a ella desde un Agent con [Actualizar Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Al adjuntar una Skill por primera vez, `"version": null` (o un `version` omitido) se resuelve en su `default_version` actual cuando se guarda el Agent. El Agent guardado contiene una versión explícita. Cambiar la versión por defecto de la Skill no actualiza un Agent existente. Para actualizarlo, modifica su array `skills` con una versión explícita como `"2"`; enviar `null` para una vinculación existente conserva su versión fijada. Cada Session usa la versión guardada del Agent e indica las Skills resueltas en `environment.skills`.

Un Agent admite hasta 32 Skills. Los IDs y los nombres de Skill deben ser únicos dentro de su selección.

## Versiones {#versions}

- Subir a `POST /v1/skills/{skill_id}/versions` añade la siguiente versión. Envía el campo de formulario `default=true` para que sea la versión por defecto.
- `POST /v1/skills/{skill_id}` con `default_version` cambia la versión por defecto sin subir nada.
- `status` es `active` o `disabled`. Las Sessions nuevas de un Agent que hace referencia a una Skill desactivada fallan con `400 skill_not_found`; las Sessions que ya congelaron una versión la conservan.
- Una Skill a la que hace referencia alguna versión de Agent no se puede eliminar (409). Desactívala en su lugar. Quitarla de la última versión del Agent no elimina las referencias de las versiones históricas.

## Paginación y errores {#pagination-and-errors}

Las listas usan paginación por cursor con `limit` 0-100, `after` y `order`. Los errores usan el [sobre de errores de Agents](/api-reference/errors#agents-platform-errors).

## Descargar un paquete {#download-a-bundle}

Los endpoints de contenido devuelven `application/zip`, no JSON. Guarda la respuesta en un archivo:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Usa `/v1/skills/{skill_id}/content` para la versión por defecto actual. Para los paquetes del catálogo público, usa `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Las listas de versiones usan los mismos parámetros de cursor que las listas de Skills. Pasa el `last_id` devuelto (por ejemplo, `skl_…:2`) como `after`; no pases solo el número de versión.
