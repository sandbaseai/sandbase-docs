---
i18nSource: 4191d2eb16a594f5
title: Présentation et fonctionnalités de Sandbox
description: Créez des sandboxes avec le SDK E2B ou la Console SandBase, consultez le statut, les journaux et les métriques, et explorez le Playground expérimental, qui est distinct.
---

# Présentation et fonctionnalités de Sandbox {#sandbox-overview-and-capabilities}

Sandbox fournit des environnements isolés pour exécuter des commandes et du code, et pour lire ou écrire des fichiers. Mettez une instance en pause, reconnectez-vous à elle et relisez un fichier pour vérifier la persistance.

[Démarrage rapide / SDK E2B](./quickstart) · [Ouvrir le Playground (expérimental)](./playground)

Utilisez le [SDK E2B officiel](./quickstart) pour intégrer Sandbox à votre application. Connectez-vous à la [Console Sandbox](https://www.sandbase.ai/console/sandboxes) pour créer des sandboxes et consulter le statut, les journaux et les métriques des instances. Consultez la [présentation du produit Sandbox](https://www.sandbase.ai/sandbox) pour une introduction. La démonstration pas à pas et le tableau de prise en charge ci-dessous concernent le Playground expérimental, qui est distinct.

## Découvrir le Playground en cinq minutes {#a-five-minute-playground-walkthrough}

1. Saisissez une [clé API](/getting-started/api-keys) disposant des autorisations Sandbox. La connexion se limite à lire les templates et les instances.
2. Choisissez un template disponible, prenez connaissance de l'avertissement sur les ressources et créez une instance de courte durée.
3. Exécutez l'exemple d'informations système ou l'exemple Python. Suivez la sortie et les événements de processus à côté du panneau de commandes.
4. Écrivez et vérifiez un fichier texte, mettez l'instance en pause, reprenez-la, puis relisez le même fichier.
5. Examinez les événements de cycle de vie, les métriques, les journaux et les données de temps machine. Supprimez votre instance une fois terminé.

L'actualisation de la page efface les identifiants de la page et l'historique local des opérations ; elle ne supprime pas les sandboxes. Les instances en cours d'exécution suivent le délai d'expiration du serveur. Les instances en pause peuvent conserver des ressources. Notez les ID des instances et utilisez les outils de votre organisation pour rapprocher et nettoyer les ressources après avoir quitté la page.

## Fonctionnalités et limites {#capabilities-and-boundaries}

| Fonctionnalité | Prise en charge dans le Playground |
| --- | --- |
| Créer, lister, mettre en pause, reprendre, prolonger le délai d'expiration, supprimer | Disponible ; les commandes de modification ne s'appliquent qu'aux instances créées pendant la session de cette page |
| Commandes et fichiers texte | Disponible ; les commandes s'exécutent pendant 25 secondes au maximum, et l'édition de fichiers est limitée à `/tmp/` et à 32 Kio |
| Événements de cycle de vie, journaux, métriques, temps machine | La disponibilité varie selon l'environnement ; examinez les résultats renvoyés |
| Chat IA et contexte de conversation | Non intégré ; nécessite une configuration de modèle et une charge de travail d'Agent |
| PTY, ports applicatifs, webhooks, builds de templates | Non disponible dans cette interface |
| Snapshots et fork | Non disponible dans ce Playground |

L'interaction avec le shell n'est pas un chat IA. La récupération de l'instance, la persistance des fichiers, la survie des processus et la continuité de la conversation sont des points distincts à vérifier.

## Comprendre les événements {#understanding-events}

Les entrées **Sandbox lifecycle** sont des événements natifs du serveur récupérés lors de l'actualisation et peuvent arriver avec un délai. Les entrées **Sandbox process** décrivent les démarrages de processus et la sortie diffusée en streaming. Les entrées **Playground** enregistrent la réussite ou l'échec des requêtes locales ; ce ne sont pas des événements de cycle de vie du service.

Une liste vide ne prouve pas une utilisation nulle, et l'absence d'événements ne prouve pas l'échec d'une opération. Les données de temps machine ne constituent pas une facture définitive. Après un délai d'expiration ou une connexion interrompue, rapprochez les instances avant de tenter une nouvelle requête de création.

## Visibilité des templates {#template-visibility}

Les templates peuvent être publics ou privés à votre organisation. Leur nombre n'est pas fixe. Les entrées sans nom restent visibles, avec des alias ou des ID utilisés comme libellés de remplacement. Les accès de votre organisation et la disponibilité des templates déterminent ceux que vous pouvez voir et utiliser.

## Sandboxes et Sessions d'Agent {#sandboxes-and-agent-sessions}

Les Sessions d'Agents s'exécutent dans le cloud hébergé de SandBase. Elles sont distinctes des instances Sandbox que vous créez avec le SDK E2B, et l'API Agents n'expose pas les instances Sandbox. Consultez [Sessions](/agents/sessions).
