---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: Consulta el saldo de la organización y el historial reciente de ejecuciones asociados a una API key.
---

# Account API {#account-api}

Los endpoints de cuenta son de solo lectura y operan sobre la organización resuelta a partir de la API key Bearer.

| Operación | Endpoint |
|---|---|
| [Obtener saldo](./balance) | `GET /v1/account/balance` |
| [Listar historial de ejecuciones](./history) | `GET /v1/account/history` |

Los valores de saldo y costo son cadenas decimales exactas. Mantenlos como valores decimales en lugar de convertirlos
mediante aritmética binaria de punto flotante.

El historial de ejecuciones está pensado para la inspección operativa reciente. Usa los registros o exportaciones de
facturación para la conciliación financiera a largo plazo.

El filtrado del historial usa marcas de tiempo UTC sin procesar. Sin `request_id`, el parámetro de compatibilidad opcional `timezone` se valida como nombre de zona horaria IANA, pero no transforma las marcas de tiempo de la respuesta; el modo exacto por `request_id` lo ignora junto con los demás filtros. Los valores de `type` desconocidos no aplican ningún filtro por tipo de ejecución; usa `multimodal`, `llm` o `api` para filtrar de forma efectiva. Los valores de `range` no admitidos se sustituyen por `7d`.

Las entradas del historial pueden contener parámetros de solicitud almacenados y salidas de modelos. Restringe el acceso a la API key en consecuencia
y no copies respuestas del historial en logs o tickets de soporte sin revisar antes si contienen datos sensibles.
