---
i18nSource: 95410ff7ea741f64
title: Guide des erreurs lisible par l'IA
description: Gérez les erreurs de l'API SandBase selon la famille d'endpoints, le statut HTTP, la sécurité des nouvelles tentatives et la forme de réponse documentée.
---

# Gestion des erreurs pour les clients d'IA {#error-handling-for-ai-clients}

SandBase n'expose pas de schéma d'erreur universel. Commencez par aiguiller selon le statut HTTP, puis analysez la forme de réponse
documentée pour la famille d'endpoints. Ne supposez pas que chaque réponse contient `code`, `param`, `request_id` ou un
message précis.

## Formes de réponse publiques {#public-response-shapes}

Le middleware principal de `/v1/*` et plusieurs endpoints de modèles ou de ressources renvoient une erreur à plat :

```json
{"error":"organization rate limit exceeded"}
```

Les ressources de la plateforme Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) renvoient un objet de style OpenAI avec un `code` stable. Consultez [Erreurs de la plateforme Agents](#agents-platform-errors) :

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Les passerelles compatibles OpenAI conservent une enveloppe compatible OpenAI. `POST /v1/messages` conserve
l'enveloppe compatible Anthropic :

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Traitement des statuts HTTP {#http-status-handling}

| Statut | Signification | Action du client |
|---|---|---|
| `400` | Entrée invalide ou paramètre non pris en charge | Corrigez la requête à l'aide du schéma de l'endpoint et du modèle sélectionnés. |
| `401` | Identifiant manquant, invalide, révoqué ou expiré | Remplacez l'identifiant ou effectuez sa rotation ; ne réessayez pas sans modification. |
| `402` | La requête ne peut pas être financée ou une limite de dépenses a été atteinte | Réglez la facturation ou les limites de clé avant de réessayer. |
| `403` | L'identifiant n'a pas l'autorisation requise, ou une surface de compatibilité convertit un échec de dépense en 403 | Examinez l'enveloppe documentée et utilisez une clé autorisée. |
| `404` | Modèle ou ressource introuvable | Vérifiez le nom actuel du modèle ou l'ID de la ressource. |
| `409` | Conflit d'état de la ressource | Lisez l'état le plus récent de la ressource avant de décider si une nouvelle tentative est sûre. |
| `429` | Limite de requêtes de l'organisation ou limite de concurrence vidéo | Réessayez avec un backoff exponentiel borné et du jitter. |
| `500`, `502`, `503`, `504` | Défaillance transitoire de SandBase ou en amont | Réessayez uniquement si l'opération peut être répétée sans risque. |

## Messages d'authentification et de limitation de débit {#authentication-and-rate-limit-messages}

Les messages d'authentification documentés sont notamment :

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Une clé à portée restreinte utilisée hors de sa portée renvoie plutôt `403` avec un corps imbriqué : `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Les ressources de la plateforme Agents renvoient le même `code` dans leur propre enveloppe.

Le message de limitation de débit documenté est `organization rate limit exceeded` (la limite de requêtes par minute attribuée à
l'organisation, partagée par toutes ses clés API). Une réponse `429` n'inclut pas actuellement d'en-têtes `Retry-After` ni
`X-RateLimit-*`, et aucune valeur universelle par défaut de RPM ou de concurrence n'est publiée.

## Recherche de modèles et de ressources {#model-and-resource-lookup}

Utilisez `GET /v1/models` pour découvrir les ID de modèles activés et `GET /v1/models/{id_or_name}` pour examiner un modèle avant
l'exécution. Traitez un ID de ressource comme opaque et vérifiez-le avec l'opération list ou get correspondante. Ne construisez pas
une autre URL d'interrogation à partir d'un préfixe d'ID.

## Algorithme de nouvelle tentative {#retry-algorithm}

Utilisez un backoff exponentiel borné avec du jitter :

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Appliquez ces règles :

- réessayez après un `429` à l'issue d'un délai calculé par le client ;
- ne réessayez les réponses `5xx` transitoires qu'un petit nombre borné de fois ;
- ne réessayez pas une requête `400`, `401`, `402`, `403` ou `404` sans modification ;
- vérifiez l'idempotence avant de répéter toute requête de création, de déclenchement ou d'action externe ;
- conservez la sortie partielle lorsqu'un flux échoue et décidez s'il est sûr de continuer ou de recommencer ;
- remontez à l'appelant le statut HTTP final et l'erreur propre à l'endpoint, nettoyée.

## Erreurs de la plateforme Agents {#agents-platform-errors}

Les Agents, Sessions, Skills, connexions MCP et Secrets renvoient une même enveloppe. Pour la plupart des codes, `message` est une phrase fixe et sûre ; `invalid_request` peut contenir une courte explication, par exemple la forme d'entrée ou l'option qui n'est pas prise en charge. Aiguillez selon `code`, et non selon `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` vaut `authentication_error` pour 401, `server_error` pour 5xx et `invalid_request_error` dans les autres cas.

| HTTP | `code` | Signification | Que faire |
|---|---|---|---|
| 400 | `invalid_request` | Champs mal formés ou inconnus, échec de validation ou option non prise en charge | Corrigez la requête ; ne réessayez pas sans modification |
| 400 | `skill_not_found` | Un Skill ou une version référencés ne sont pas disponibles | Corrigez le champ `skills` de l'Agent |
| 401 | `unauthorized` | En-têtes de clé API manquants, invalides ou contradictoires | Vérifiez `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Limite de dépenses de la clé ou solde de l'organisation épuisé | Ajoutez des crédits ou relevez la limite |
| 403 | `insufficient_scope` | La clé a une portée restreinte et ne peut pas utiliser les ressources Agents | Utilisez une clé standard créée dans la Console |
| 403 | `org_disabled` | L'organisation n'est pas autorisée à exécuter des Agents | Contactez le support |
| 404 | `not_found` | La ressource n'existe pas dans votre organisation | Vérifiez l'ID |
| 409 | `conflict` | `row_version` obsolète, état qui n'autorise pas la modification, ou `Idempotency-Key` réutilisée avec un corps différent | Relisez la ressource, puis décidez |
| 409 | `session_input_pending` | Une entrée précédente est encore en cours de livraison | Patientez ; ne renvoyez pas avec une nouvelle clé |
| 409 | `session_input_expired` | L'admission de l'entrée a expiré | Examinez l'historique avant de renvoyer |
| 409 | `session_environment_unavailable` | L'environnement d'exécution est indisponible | Patientez ou créez une nouvelle Session |
| 413 | `request_too_large` | Le corps de la requête, ou la configuration de Session figée à partir de celui-ci, dépasse la taille limite | Envoyez un corps plus petit ; ne réessayez pas sans modification |
| 429 | `quota_exceeded` | Quota Agents dépassé | Réessayez plus tard |
| 502 | `executor_rejected`, `executor_contract_error` | La couche d'exécution a refusé la requête ou a répondu de façon inattendue | Vérifiez la configuration de l'Agent, puis réessayez |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Une dépendance est temporairement indisponible | Réessayez avec un backoff et la même `Idempotency-Key` |

`skill_runtime_incompatible` peut également apparaître ; il est renvoyé en 503 avec le message `internal error`.

## Échecs de streaming {#streaming-failures}

Une fois qu'une réponse en streaming a commencé, un échec peut arriver au format de flux du protocole plutôt que sous la forme d'un nouveau
statut HTTP. Considérez le flux comme incomplet, fermez-le, conservez tout contenu partiel nécessaire à l'application, et
ne réessayez que si la requête peut être répétée sans risque.

## Voir aussi {#see-also}

- [Codes d'erreur](/api-reference/errors) — formats de réponse publics et statuts HTTP courants
- [Limites de débit](/guides/rate-limiting) — gestion des 429 et lissage des requêtes
- [Erreurs et nouvelles tentatives](/guides/error-handling) — modèles d'implémentation
- [Authentification](/api-reference/authentication) — identifiants pris en charge et cycle de vie des clés
