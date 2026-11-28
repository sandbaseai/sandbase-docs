---
i18nSource: 258f8ff4bb1ed96f
title: Organizaciones
description: Gestiona organizaciones, miembros y roles en SandBase.
---

# Organizaciones {#organizations}

Las organizaciones son la unidad de facturación y control de acceso en SandBase. Las API keys, el saldo, el uso y los miembros pertenecen a una organización.

## Tipos de organización {#organization-types}

| Tipo | Descripción |
|------|-------------|
| **Personal** | Se crea automáticamente en el primer inicio de sesión. Una por usuario. |
| **Equipo** | Se crea manualmente. Varios miembros con roles. |

## Roles de miembros {#member-roles}

| Rol | Permisos |
|------|-------------|
| **Owner** | Acceso completo al espacio de trabajo, incluido el cambio de roles de los miembros. |
| **Admin** | Gestiona claves y facturación, y añade o elimina miembros que no son propietarios. |
| **Member** | Usa el espacio de trabajo y sus API keys sin acceso a la gestión de miembros. |

## Crear una organización de equipo {#create-a-team-organization}

1. Abre el menú de la cuenta en la esquina superior derecha de la Console.
2. Elige **Create Team**, o abre **Developer → Team** y selecciona **Create team**.
3. Introduce un **Team name** y selecciona **Create team**.
4. Selecciona **Add member**, introduce el **Account email** de una cuenta de SandBase existente y elige un **Workspace role**: **Member** o **Admin**.

Un miembro añadido debe tener ya una cuenta de SandBase. Los propietarios pueden cambiar los roles de los miembros; los propietarios y los administradores pueden eliminar
a los miembros que no son propietarios.

## Cambiar de organización {#switch-organizations}

Si perteneces a varias organizaciones, cambia entre ellas en el menú de la cuenta o usa la franja **Switch workspace** en **Developer → Team**. Tus API keys y la facturación se limitan a la organización activa.

## Saldo y facturación {#balance-and-billing}

Cada organización tiene su propio saldo. Las llamadas a modelos, las llamadas a la API, las Sessions de Agents y el trabajo en tiempo de ejecución se cobran de este saldo. Consulta [Facturación](/admin/billing) para más detalles.
