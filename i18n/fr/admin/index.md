---
i18nSource: adfacb669489863e
title: Compte et facturation
description: Gérez votre organisation SandBase, vos clés API, la facturation, l'utilisation et les limites.
---

# Compte et facturation {#account-and-billing}

Les paramètres de votre organisation déterminent à qui revient l'utilisation, comment les applications s'authentifient et comment les dépenses sont suivies.

## Ce que vous gérez {#what-you-manage}

| Domaine | Utilisation |
|---|---|
| [Organisations](/admin/organizations) | Gérer le périmètre de l'espace de travail, les membres et la propriété |
| [Clés API](/getting-started/api-keys) | Créer, renouveler et révoquer les identifiants des applications |
| [Facturation et crédits](/admin/billing) | Consulter le solde, acheter des crédits, configurer la recharge automatique et examiner l'utilisation dans Activities et Analysis |
| [Tarifs et utilisation](/guides/billing) | Trouver les tarifs des modèles, les appels API gratuits quotidiens et le coût d'une tâche |
| [Limites de débit](/guides/rate-limiting) | Comprendre les limites de requêtes et les bonnes pratiques de nouvelle tentative |

## Configuration recommandée {#recommended-setup}

1. Vérifiez que vous travaillez dans la bonne organisation.
2. Créez des clés API distinctes pour le développement, la préproduction et la production.
3. Nommez les clés d'après leur application et leur environnement.
4. Examinez Activities et la facturation après les premières requêtes en production.
5. Révoquez les clés inutilisées et analysez rapidement toute utilisation inattendue.

## Propriété et accès {#ownership-and-access}

Les clés API et l'utilisation appartiennent à une organisation. Changer d'organisation modifie les ressources, les clés et le contexte de facturation visibles dans la Console. Avant de modifier la configuration de production, vérifiez l'organisation sélectionnée et coordonnez le renouvellement des clés avec les applications qui les utilisent.

## Bases de la sécurité {#security-basics}

- stockez les clés dans des variables d'environnement ou un gestionnaire de secrets
- ne collez jamais de clés dans les instructions d'un Agent, le code source, des captures d'écran ou des messages au support
- utilisez une clé distincte pour chaque application et chaque environnement
- révoquez immédiatement une clé si elle a pu être exposée
- surveillez Activities pour détecter un volume, des modèles ou des endpoints inattendus
