---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (expérimental)
description: Essayez de vraies sandboxes SandBase avec votre propre clé API. Créez-en, exécutez des commandes, vérifiez les fichiers après une pause et une reprise, et inspectez les événements du cycle de vie.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Essayez l'API Sandbox avec votre propre clé. Les opérations se connectent à **sandbox.sandbase.ai** et peuvent être facturées.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Votre clé reste sous votre contrôle {#your-key-stays-under-your-control}

- **Uniquement en mémoire de la page.** Ce Playground n'enregistre pas votre clé API ni vos jetons de connexion dans le stockage du navigateur ou dans des cookies, ne les place pas dans des URL et ne les consigne pas dans l'activité de la page ni dans les exemples de requêtes.
- **Effaçable à tout moment.** Sélectionnez **Clear key** pour supprimer la clé, les jetons de connexion et l'activité affichée, même pendant qu'une requête est en cours. Actualiser ou quitter cette page les efface également. Vous devrez saisir de nouveau votre clé pour vous reconnecter.
- **Utilisée uniquement pour vos requêtes.** Votre clé est transmise à SandBase pour authentifier les opérations Sandbox que vous demandez. Effacer cette page ne révoque pas la clé ; révoquez-la dans [Developer → API Keys](https://www.sandbase.ai/console/keys) si nécessaire.

Ces engagements portent sur la manière dont ce Playground gère les identifiants. Ils ne signifient pas que l'activité Sandbox ou les enregistrements d'utilisation côté service sont effacés. Évitez de saisir des secrets dans des commandes ou des fichiers, dont le contenu peut subsister dans votre sandbox.

## Nettoyez les ressources séparément {#clean-up-resources-separately}

Effacer votre clé n'annule pas une opération déjà reçue par le service et ne supprime pas de sandbox. Supprimez les instances une fois terminé. Si le résultat d'une création est inconnu, vérifiez vos instances avant d'en créer une autre. Notez les ID d'instance dont vous avez besoin pour le nettoyage avant d'effacer cette page.

[Vue d'ensemble et capacités](./index) · [Quickstart / SDK E2B](./quickstart)
