---
i18nSource: 258f8ff4bb1ed96f
title: Organisationen
description: Verwalte Organisationen, Mitglieder und Rollen in SandBase.
---

# Organisationen {#organizations}

Organisationen sind in SandBase die Einheit für Abrechnung und Zugriffskontrolle. API-Schlüssel, Guthaben, Nutzung und Mitglieder gehören jeweils zu einer Organisation.

## Organisationstypen {#organization-types}

| Typ | Beschreibung |
|------|-------------|
| **Personal** | Wird beim ersten Login automatisch erstellt. Eine pro Nutzer. |
| **Team** | Wird manuell erstellt. Mehrere Mitglieder mit Rollen. |

## Mitgliederrollen {#member-roles}

| Rolle | Berechtigungen |
|------|-------------|
| **Owner** | Vollzugriff auf den Workspace, einschließlich Ändern von Mitgliederrollen. |
| **Admin** | Schlüssel und Abrechnung verwalten sowie Mitglieder, die keine Owner sind, hinzufügen oder entfernen. |
| **Member** | Workspace und dessen API-Schlüssel nutzen, ohne Zugriff auf die Mitgliederverwaltung. |

## Team-Organisation erstellen {#create-a-team-organization}

1. Öffne das Kontomenü oben rechts in der Console.
2. Wähle **Create Team**, oder öffne **Developer → Team** und wähle **Create team**.
3. Gib einen **Team name** ein und wähle dann **Create team**.
4. Wähle **Add member**, gib die **Account email** eines bestehenden SandBase-Kontos ein und wähle eine **Workspace role**: **Member** oder **Admin**.

Ein hinzugefügtes Mitglied muss bereits ein SandBase-Konto haben. Owner können Mitgliederrollen ändern; Owner und Admins können
Mitglieder entfernen, die keine Owner sind.

## Organisation wechseln {#switch-organizations}

Wenn du mehreren Organisationen angehörst, wechselst du im Kontomenü zwischen ihnen oder nutzt die Leiste **Switch workspace** unter **Developer → Team**. Deine API-Schlüssel und die Abrechnung gelten jeweils für die aktive Organisation.

## Guthaben und Abrechnung {#balance-and-billing}

Jede Organisation hat ihr eigenes Guthaben. Modellaufrufe, API-Aufrufe, Agent-Sessions und Runtime-Arbeit werden mit diesem Guthaben verrechnet. Details findest du unter [Abrechnung](/admin/billing).
