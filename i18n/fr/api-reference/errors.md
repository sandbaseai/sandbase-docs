---
i18nSource: ac4e3b9b9eef4c7d
title: Erreurs de l'API
description: Gérez les erreurs de l'API SandBase selon le statut HTTP, la famille d'endpoints, le format de réponse documenté et la sécurité des nouvelles tentatives.
---

# Erreurs de l'API {#api-errors}

SandBase utilise les codes de statut HTTP standard, mais n'expose pas de corps d'erreur universel. Basez-vous d'abord sur le statut HTTP, puis analysez le schéma de réponse documenté pour l'endpoint appelé. N'exigez pas que chaque erreur contienne `code`, `param`, `message` ou `request_id`.

## Formats de réponse {#response-shapes}

Le middleware principal et plusieurs endpoints `/v1/*` renvoient une erreur à plat :

```json
{"error":"organization rate limit exceeded"}
```

Les ressources de la plateforme Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) renvoient un objet au format OpenAI avec un `code` stable. Voir [Erreurs de la plateforme Agents](#agents-platform-errors) :

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

L'API Events des webhooks (`/events/webhooks*`) renvoie `{"code":<http status>,"message":"..."}`. Voir [Webhooks](/api-reference/webhooks#authentication-and-errors).

Les endpoints compatibles OpenAI conservent une enveloppe compatible OpenAI. `POST /v1/messages` conserve une enveloppe compatible Anthropic :

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Consultez la [spécification OpenAPI](/openapi.yaml) pour les codes de statut et schémas exacts d'une opération publique.

## Gestion des statuts HTTP {#http-status-handling}

| Statut | Signification habituelle | Action du client |
|---|---|---|
| `400` | Entrée invalide ou paramètre non pris en charge | Corrigez la requête à l'aide du schéma de l'endpoint et du modèle choisi. |
| `401` | Identifiant manquant, invalide, révoqué ou expiré | Remplacez ou renouvelez l'identifiant ; ne réessayez pas à l'identique. |
| `402` | La requête ne peut pas être financée ou une limite de dépenses a été atteinte | Réglez le problème de solde ou de limite de clé avant de réessayer. |
| `403` | L'identifiant n'a pas l'autorisation requise, ou un endpoint de compatibilité convertit un échec de dépense en 403 | Examinez l'enveloppe propre à l'endpoint et utilisez une clé autorisée. |
| `404` | Le modèle ou la ressource n'est pas disponible pour l'appelant | Vérifiez l'ID de modèle ou de ressource actuel. |
| `409` | Conflit d'état de la ressource | Lisez l'état le plus récent avant de décider si une nouvelle tentative est sûre. |
| `422` | Entrée de ressource sémantiquement invalide | Corrigez les valeurs des champs documentés. |
| `429` | Limite de requêtes de l'organisation ou limite de concurrence vidéo | Réessayez avec un backoff borné et du jitter si l'opération peut être répétée sans risque. |
| `500`, `502`, `503`, `504` | Défaillance de SandBase ou d'un service en amont | Réessayez uniquement si l'opération peut être répétée sans risque. |

Tous les endpoints ne documentent pas tous les statuts de ce tableau. La table des réponses OpenAPI de l'opération fait foi.

## Erreurs d'authentification {#authentication-errors}

Les messages d'authentification documentés sont notamment :

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Une clé à portée restreinte utilisée hors de sa portée renvoie `403` avec un corps imbriqué : `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Les ressources de la plateforme Agents renvoient le même `code` dans leur propre enveloppe.

Utilisez `Authorization: Bearer $SANDBASE_API_KEY` pour les endpoints standard. `POST /v1/messages` accepte aussi `x-api-key` ; les endpoints compatibles avec les protocoles Google documentent leurs propres en-têtes de clé pris en charge.

Une clé révoquée ne peut pas être réactivée. Créez une clé de remplacement, mettez à jour l'application qui l'utilise, vérifiez-la, puis supprimez toutes les références restantes à l'ancienne clé.

## Limites de débit {#rate-limits}

`organization rate limit exceeded` (`429`) signifie que votre organisation a atteint sa limite de requêtes par minute, partagée par toutes ses clés API. Les endpoints compatibles avec d'autres protocoles la renvoient dans leur propre enveloppe. SandBase ne publie pas de limite numérique universelle, car la limite est attribuée par organisation.

Si une réponse contient `Retry-After`, respectez-le. Sinon, utilisez un backoff exponentiel borné avec jitter. Consultez [Limites de débit](/guides/rate-limiting) pour les techniques de lissage des requêtes.

Les soumissions de tâches font l'objet de deux vérifications supplémentaires. `organization concurrency limit exceeded` (`429`) signifie que votre organisation a déjà autant de tâches en cours que son niveau de compte le permet ; l'erreur disparaît lorsqu'une tâche en cours se termine. Elle s'applique à tous les types de modèles sur `POST /v1/run` et `/v1/api/*`, ainsi qu'aux soumissions vidéo sur les autres endpoints. `insufficient credit for estimated video cost` (`402`) signifie que le coût estimé dépasse votre solde plus votre ligne de crédit ; rechargez avant de réessayer. Voir [Limites de concurrence](/guides/concurrency-limits).

## Sécurité des nouvelles tentatives {#retry-safety}

Suivez cet ordre de décision :

1. Déterminez si l'opération a déjà produit un effet visible de l'extérieur.
2. Ne réessayez pas à l'identique une requête `400`, `401`, `402`, `403`, `404` ou `422`.
3. Pour `409`, lisez l'état actuel de la ressource avant de réessayer.
4. Réessayez les réponses `429` et `5xx` transitoires un nombre de fois limité et réduit.
5. Avant de répéter une requête de création, de déclenchement, d'envoi de fichier ou d'action externe, vérifiez que l'opération est idempotente ou que votre application sait réconcilier les doublons.

Un délai adapté est :

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Erreurs de la plateforme Agents {#agents-platform-errors}

Les Agents, Sessions, Skills, connexions MCP et Secrets renvoient une enveloppe unique. Pour la plupart des codes, `message` est une phrase fixe et sûre ; `invalid_request` peut contenir une courte explication, par exemple le format d'entrée ou l'option non pris en charge. Basez votre logique sur `code`, pas sur `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` vaut `authentication_error` pour 401, `server_error` pour 5xx et `invalid_request_error` sinon.

| HTTP | `code` | Signification | Que faire |
|---|---|---|---|
| 400 | `invalid_request` | Champs mal formés ou inconnus, échec de validation ou option non prise en charge | Corrigez la requête ; ne réessayez pas à l'identique |
| 400 | `skill_not_found` | Une Skill ou une version référencée n'est pas disponible | Corrigez les `skills` de l'Agent |
| 401 | `unauthorized` | En-têtes de clé API manquants, invalides ou contradictoires | Vérifiez `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Limite de dépenses de la clé ou solde de l'organisation épuisé | Ajoutez des crédits ou relevez la limite |
| 403 | `insufficient_scope` | La clé a une portée restreinte et ne peut pas utiliser les ressources Agents | Utilisez une clé standard créée dans la Console |
| 403 | `org_disabled` | L'organisation n'est pas autorisée à exécuter des Agents | Contactez le support |
| 404 | `not_found` | La ressource n'existe pas dans votre organisation | Vérifiez l'ID |
| 409 | `conflict` | `row_version` obsolète, état qui n'autorise pas la modification, ou `Idempotency-Key` réutilisée avec un corps différent | Relisez la ressource, puis décidez |
| 409 | `session_input_pending` | Une entrée précédente est encore en cours de livraison | Patientez ; ne renvoyez pas avec une nouvelle clé |
| 409 | `session_input_expired` | L'admission de l'entrée a expiré | Consultez l'historique avant de renvoyer |
| 409 | `session_environment_unavailable` | L'environnement d'exécution est indisponible | Patientez ou créez une nouvelle Session |
| 413 | `request_too_large` | Le corps de la requête, ou la configuration de Session figée à partir de celui-ci, dépasse la taille maximale | Envoyez un corps plus petit ; ne réessayez pas à l'identique |
| 429 | `quota_exceeded` | Quota Agents dépassé | Réessayez plus tard |
| 502 | `executor_rejected`, `executor_contract_error` | La couche d'exécution a rejeté la requête ou a répondu de manière inattendue | Vérifiez la configuration de l'Agent, puis réessayez |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Une dépendance est temporairement indisponible | Réessayez avec backoff et la même `Idempotency-Key` |

`skill_runtime_incompatible` peut également apparaître ; il est renvoyé en 503 avec le message `internal error`.

## Échecs en streaming {#streaming-failures}

Une fois un flux démarré, une erreur peut arriver dans le format de flux du protocole plutôt que sous forme de nouvelle réponse HTTP. Considérez le flux comme incomplet, conservez toute sortie partielle dont votre application a besoin et ne réessayez que si régénérer la requête est sans risque. Ne supposez pas que tous les fournisseurs émettent le même événement final ou la même raison de fin.

## Débogage opérationnel {#operational-debugging}

Enregistrez l'endpoint, le statut HTTP, l'ID de modèle ou de ressource sélectionné, l'horodatage et tout identifiant de requête sûr renvoyé par le serveur. Ne journalisez jamais les en-têtes d'autorisation, les clés API, les valeurs d'identifiants ni le contenu sensible des prompts.

Utilisez [Developer → Activities](https://www.sandbase.ai/console/activities) pour consulter l'historique des requêtes de l'organisation. Pour signaler un échec persistant, joignez les métadonnées de requête nettoyées et la plus petite requête permettant de reproduire le problème.

## Voir aussi {#see-also}

- [Authentification](/api-reference/authentication)
- [Erreurs et nouvelles tentatives](/guides/error-handling)
- [Limites de débit](/guides/rate-limiting)
- [Guide des erreurs lisible par l'IA](/for-agents/errors)
