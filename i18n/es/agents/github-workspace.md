---
i18nSource: e4dcecbecc736e53
title: Espacio de trabajo con un repositorio de GitHub
description: Clona un repositorio de GitHub en el /workspace de una Session, haz push a ramas de la Session y abre pull requests.
---

# Espacio de trabajo con un repositorio de GitHub {#github-repository-workspace}

Una Session puede comenzar con un repositorio de GitHub ya clonado en `/workspace`. El Agent trabaja en el código con comandos `git` normales, sube sus commits a ramas reservadas para la Session y puede abrir un pull request para que una persona lo revise.

Se accede al repositorio a través del proxy de git de SandBase. Ningún token de GitHub entra en la Session.

## Antes de empezar {#before-you-start}

Un administrador de la organización configura esto una sola vez en la Console:

1. Conecta GitHub en **Console → Integrations** y elige los repositorios que puede usar la conexión.
2. Asigna la conexión al Agent en la sección **Integrations** del Agent. Para clonar, las herramientas del Agent para esta conexión deben incluir **Read code**. Para hacer push, también deben incluir **Commit to a task branch**.
3. Opcional: elige un **Workspace repository** y una rama en esa asignación. Así, las Sessions lo clonan por defecto.

`repository_id` es el ID numérico del repositorio en GitHub. Puedes obtenerlo con `GET https://api.github.com/repos/{owner}/{repo}` (el campo `id`) o con la herramienta `github_list_repositories`.

## Elegir el repositorio para cada Session {#choose-the-repository-per-session}

Envía `github_workspace` al crear la Session:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: fix-login-2026-11-18" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "github_workspace": {"repository_id": "1195090324", "ref": "main"},
    "input": "Fix the failing login test, push your change and open a pull request."
  }'
```

| Campo | Obligatorio | Significado |
|---|---|---|
| `repository_id` | Sí | Cadena decimal. El repositorio debe estar dentro del alcance de repositorios del Agent para esa conexión. |
| `ref` | No | Rama que se va a hacer checkout. Por defecto, la rama predeterminada del repositorio. |
| `connection_id` | No | Qué conexión de GitHub usar. Por defecto, la asignación que tiene un repositorio de espacio de trabajo o la única conexión de GitHub del Agent. |

`github_workspace` es opcional:

- Omitido o `null`: la Session clona el repositorio de espacio de trabajo del Agent, si hay uno configurado. Si no, no se clona nada y la Session comienza normalmente.
- Enviado: reemplaza el valor predeterminado del Agent solo para esta Session.

Cada Session tiene como máximo un repositorio de espacio de trabajo. La elección queda fijada al crear la Session.

## Qué recibe la Session {#what-the-session-gets}

- Un checkout de `ref` en `/workspace`, con `origin` apuntando al proxy de git. `git fetch`, `git pull` y `git push` funcionan como de costumbre.
- Commits con autoría de `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, por ejemplo `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, el `owner/name` del repositorio.

## Reglas de push {#push-rules}

El Agent solo puede hacer push a ramas bajo su propio prefijo:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Puede volver a hacer push a la misma rama, incluso a una rama que ya tiene un pull request abierto.
- Los push a la rama predeterminada, a otras ramas, a prefijos de otras Sessions y a tags se rechazan antes de llegar a GitHub. Git muestra `sandbase: only agents/<session>/* branches can be pushed`.
- El proxy no puede modificar archivos de flujos de trabajo de GitHub Actions.

Solo una rama a la que la Session hizo push se considera rama de la Session. La herramienta `github_open_pull_request` la acepta, al igual que una conexión cuyo alcance de merge está limitado a ramas administradas.

## Los permisos dependen de la conexión {#permissions-follow-the-connection}

Cada solicitud de git se valida contra la asignación actual del Agent y la política actual de la conexión.

- Si un administrador reduce el alcance de repositorios, se rechaza el siguiente fetch o push.
- Si un administrador quita **Commit to a task branch**, se rechaza el siguiente push.
- Si un administrador revoca la conexión, se rechaza el siguiente fetch o push.

Cada Session puede hacer hasta 120 solicitudes de git por minuto.

## Errores {#errors}

| Respuesta | Causa |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` no es una cadena decimal, `ref` no es un nombre de rama simple, el Agent no tiene conexión de GitHub o el nombre de la rama predeterminada del repositorio no es compatible (indica `ref` explícitamente). |
| `400 invalid_request` | El Agent tiene varias conexiones de GitHub y ninguna tiene un repositorio de espacio de trabajo. Envía `connection_id`. |
| `403 insufficient_scope` | El repositorio o la conexión están fuera del alcance del Agent, o las herramientas del Agent no incluyen **Read code**. |

## Próximos pasos {#next-steps}

- [Ejecutar Sessions](/agents/sessions)
- [Referencia de la API para crear una Session](/api-reference/sessions/create)
