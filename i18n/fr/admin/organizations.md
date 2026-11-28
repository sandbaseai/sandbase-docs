---
i18nSource: 258f8ff4bb1ed96f
title: Organisations
description: Gérez les organisations, les membres et les rôles sur SandBase.
---

# Organisations {#organizations}

Les organisations sont l'unité de facturation et de contrôle d'accès dans SandBase. Les clés API, le solde, l'utilisation et les membres appartiennent tous à une organisation.

## Types d'organisation {#organization-types}

| Type | Description |
|------|-------------|
| **Personnelle** | Créée automatiquement à la première connexion. Une par utilisateur. |
| **Équipe** | Créée manuellement. Plusieurs membres avec des rôles. |

## Rôles des membres {#member-roles}

| Rôle | Autorisations |
|------|-------------|
| **Owner** | Accès complet à l'espace de travail, y compris la modification des rôles des membres. |
| **Admin** | Gère les clés et la facturation, et ajoute ou retire les membres qui ne sont pas Owner. |
| **Member** | Utilise l'espace de travail et ses clés API, sans accès à la gestion des membres. |

## Créer une organisation d'équipe {#create-a-team-organization}

1. Ouvrez le menu du compte en haut à droite de la Console.
2. Choisissez **Create Team**, ou ouvrez **Developer → Team** et sélectionnez **Create team**.
3. Saisissez un **Team name**, puis sélectionnez **Create team**.
4. Sélectionnez **Add member**, saisissez l'**Account email** d'un compte SandBase existant et choisissez un **Workspace role** : **Member** ou **Admin**.

Un membre ajouté doit déjà disposer d'un compte SandBase. Les Owners peuvent modifier les rôles des membres ; les Owners et les Admins peuvent retirer
les membres qui ne sont pas Owner.

## Changer d'organisation {#switch-organizations}

Si vous appartenez à plusieurs organisations, passez de l'une à l'autre depuis le menu du compte, ou utilisez la bande **Switch workspace** dans **Developer → Team**. Vos clés API et votre facturation sont rattachées à l'organisation active.

## Solde et facturation {#balance-and-billing}

Chaque organisation dispose de son propre solde. Les appels de modèles, les appels d'API, les Sessions d'Agent et le travail d'exécution sont débités de ce solde. Consultez [Facturation](/admin/billing) pour plus de détails.
