---
i18nSource: f63049c1cf01130e
title: Erreurs et nouvelles tentatives
description: Classez les échecs de l'API SandBase, déterminez quand une nouvelle tentative est sans danger et conservez des diagnostics utiles sans exposer de secrets.
---

# Erreurs et nouvelles tentatives {#errors-and-retries}

Traitez les erreurs selon le statut HTTP, la famille d'endpoints et la sémantique de l'opération. SandBase expose plusieurs protocoles compatibles ;
il n'existe donc pas de forme JSON d'erreur unique commune à tous les endpoints.

## Lisez la forme d'erreur de l'endpoint {#read-the-endpoint-s-error-shape}

- Les opérations compatibles OpenAI renvoient normalement un objet `error` avec un message et un type.
- Anthropic Messages renvoie des enveloppes d'erreur compatibles Anthropic.
- Les opérations principales de la plateforme peuvent renvoyer un corps plat `{ "error": "..." }` ou une erreur documentée propre à la ressource.
- Les opérations Google et natives des fournisseurs conservent la forme de leur protocole compatible lorsque c'est documenté.

Utilisez le statut HTTP et le corps documenté de la réponse. N'exigez pas de champs facultatifs comme `code`, `param` ou
`request_id`, sauf si l'endpoint sélectionné les garantit. Consultez la [référence des erreurs de l'API](/api-reference/errors) pour
des exemples et la [spécification OpenAPI](/openapi.yaml) pour les réponses propres à chaque opération.

## Décidez quoi faire selon le statut {#decide-what-to-do-by-status}

| Statut | Cause typique | Action recommandée |
|---|---|---|
| `400` / `422` | Corps ou paramètre invalide, ou capacité du modèle non prise en charge | Corrigez la requête avant de réessayer. |
| `401` | Identifiant manquant, invalide, expiré ou révoqué | Remplacez l'identifiant. |
| `402` | L'état de facturation n'autorise pas la requête | Régularisez le solde du compte ou le contrôle des dépenses. |
| `403` | Scope de l'identifiant ou accès à la ressource insuffisant | Utilisez une clé ou une ressource autorisée. |
| `404` | Modèle, tâche ou ressource de la plateforme introuvable | Vérifiez l'identifiant et l'organisation. |
| `409` | Conflit d'état de la ressource ou d'opérations concurrentes | Lisez l'état actuel, puis décidez s'il faut réessayer. |
| `429` | SandBase ou un fournisseur en amont a limité la requête | Respectez `Retry-After` lorsqu'il est présent ; sinon, appliquez un backoff avec jitter. |
| `500` / `502` / `503` / `504` | Défaillance interne, en amont ou indisponibilité temporaire | Ne réessayez que si répéter l'opération est sans danger. |

Ce tableau est un guide de traitement ; il ne garantit pas que chaque endpoint émet chacun de ces statuts.

## Utilisez une politique de nouvelles tentatives bornée {#use-a-bounded-retry-policy}

Pour une requête qui peut être répétée sans risque, utilisez un backoff exponentiel avec jitter, plafonnez le délai et imposez un budget total de requêtes.
Désactivez les nouvelles tentatives du SDK si une couche applicative externe réessaie déjà, ou tenez compte des deux couches lorsque vous définissez le budget.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Lorsqu'une réponse inclut `Retry-After`, analysez-le et respectez-le au lieu d'utiliser le délai de repli. Gardez la politique
configurable ; le bon nombre de tentatives et la bonne échéance dépendent du budget de latence et de coût de l'appelant.

## Protégez-vous contre les effets de bord en double {#protect-against-duplicate-side-effects}

Répéter une requête d'inférence crée une nouvelle génération et peut entraîner un coût supplémentaire. Ce n'est acceptable que si
l'application a besoin de n'importe quelle réponse valide et peut tolérer une régénération.

Soyez plus prudent avec les opérations qui créent, mettent à jour, suppriment, publient, planifient ou déclenchent un travail :

- utilisez la prise en charge documentée de l'idempotence lorsqu'un endpoint la fournit ;
- sinon, lisez l'état actuel avant de répéter une requête ambiguë ;
- ne rejouez jamais un appel d'outil simplement parce que le flux du modèle qui l'entoure s'est déconnecté ;
- conservez un ID d'opération client dans votre propre système lorsque vous devez rapprocher les nouvelles tentatives.

## Traitez séparément les timeouts et les flux {#handle-timeouts-and-streams-separately}

Un timeout ne prouve pas que le serveur a cessé de traiter la requête. Avant de réessayer une opération asynchrone ou qui modifie un état,
interrogez si possible le statut documenté de sa ressource ou de sa tâche.

Pour les réponses en streaming, distinguez une erreur HTTP survenue avant le début du flux d'une déconnexion après une sortie partielle.
Seul le signal de fin normal du protocole prouve qu'un flux est complet. Consultez [Réponses en streaming](/guides/streaming).

## Journalisez des diagnostics utiles et sûrs {#log-useful-safe-diagnostics}

Enregistrez :

- l'endpoint et l'identifiant du modèle ;
- le statut HTTP et le type d'erreur compatible lorsqu'il est présent ;
- l'identifiant du fournisseur ou de la requête lorsqu'il est renvoyé ;
- le nombre de tentatives, le temps écoulé et si des octets de réponse ont été reçus.

Ne journalisez pas les clés API, les valeurs d'identifiants, les prompts sensibles complets ni les réponses non expurgées des fournisseurs. Affichez aux utilisateurs un message
concis et exploitable, tout en conservant des diagnostics nettoyés pour les opérateurs.

## Ressources associées {#related-guidance}

- [Référence des erreurs de l'API](/api-reference/errors)
- [Limites de débit](/guides/rate-limiting)
- [Réponses en streaming](/guides/streaming)
- [Authentification](/api-reference/authentication)
