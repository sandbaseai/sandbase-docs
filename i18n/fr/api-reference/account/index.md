---
i18nSource: 3b9b3fc27f878cd5
title: API Account
description: Consultez le solde de l'organisation et l'historique d'exécution récent associés à une clé API.
---

# API Account {#account-api}

Les endpoints Account sont en lecture seule et portent sur l'organisation déterminée à partir de la clé API Bearer.

| Opération | Endpoint |
|---|---|
| [Obtenir le solde](./balance) | `GET /v1/account/balance` |
| [Lister l'historique d'exécution](./history) | `GET /v1/account/history` |

Les valeurs de solde et de coût sont des chaînes décimales exactes. Conservez-les sous forme de valeurs décimales plutôt que de les convertir
via une arithmétique à virgule flottante binaire.

L'historique d'exécution est destiné à l'inspection opérationnelle récente. Utilisez les relevés de facturation ou les exports pour le rapprochement
financier à long terme.

Le filtrage de l'historique utilise des horodatages UTC bruts. Sans `request_id`, le paramètre de compatibilité facultatif `timezone` est validé comme nom de fuseau horaire IANA, mais ne transforme pas les horodatages de la réponse ; le mode `request_id` exact l'ignore, comme les autres filtres. Les valeurs de `type` inconnues n'appliquent aucun filtre par type d'exécution ; utilisez `multimodal`, `llm` ou `api` pour un filtre effectif. Les valeurs de `range` non prises en charge reviennent à `7d`.

Les entrées de l'historique peuvent contenir les paramètres de requête enregistrés et la sortie du modèle. Restreignez l'accès à la clé API en conséquence,
et ne copiez pas les réponses de l'historique dans des logs ou des tickets de support sans vérifier qu'elles ne contiennent pas de données sensibles.
