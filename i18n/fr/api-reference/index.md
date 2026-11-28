---
i18nSource: 071e97a48f9c4f4c
title: Référence de l'API
description: Appelez les modèles SandBase et gérez les Agents, Sessions, Skills, connexions MCP, Secrets et ressources de compte.
---

# Référence de l'API {#api-reference}

Utilisez l'API pour appeler directement des modèles, ou pour définir des Agents réutilisables, les exécuter dans des Sessions et les connecter à des Skills et à des outils MCP.

::: tip Vous cherchez l'inférence de modèles ?
Les contrats d'inférence (Chat Completions, Responses, Anthropic Messages, Gemini, Images et vidéo Seedance) se trouvent dans la section **Model inference** de cette référence. Les champs et tarifs propres à chaque modèle figurent sur sa page dans le [catalogue Models](https://www.sandbase.ai/models).
:::

## Choisir un point de départ {#choose-a-starting-point}

| Objectif | Commencer par | Étape suivante |
|---|---|---|
| Définir un comportement réutilisable | [Agents](/api-reference/agents/) | Créer et versionner une configuration d'Agent |
| Exécuter directement un Agent | [Sessions](/api-reference/sessions/) | Envoyer des entrées, diffuser des événements et lire l'historique |
| Réutiliser des ensembles d'instructions | [Skills](/api-reference/skills/) | Envoyer des archives ZIP versionnées et les associer à des Agents |
| Appeler des outils externes | [Connexions MCP](/api-reference/mcp-connections/) | Enregistrer des serveurs MCP HTTPS distants pour les Agents |
| Authentifier des outils externes | [Secrets](/agents/api-credentials#with-the-api) | Stocker en écriture seule des jetons Bearer pour les connexions MCP |

## Cycle de vie des ressources {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- Un **Agent** (`agt_`) est une configuration enregistrée et versionnée ; le créer ne l'exécute pas.
- Une **Session** (`ses_`) exécute une version d'Agent et fige ses Skills et ses connexions MCP. Les chemins des Sessions se trouvent sous `/v1/agents/sessions`.
- Une **Skill** (`skl_`) est un ensemble d'instructions versionné. Une **connexion MCP** (`mcp_`) enregistre un serveur d'outils distant, et un **Secret** (`sec_`) stocke son jeton Bearer.

## Conventions des ressources de la plateforme Agents {#conventions-for-agents-platform-resources}

Les Agents, Sessions, Skills, connexions MCP et Secrets sont servis sous `https://api.sandbase.ai/v1` et partagent ces règles :

- Authentifiez-vous avec `Authorization: Bearer` ou `X-API-Key`. Voir [Authentification](/api-reference/authentication#agents-platform-resources).
- Les corps de requête sont du JSON strict d'au plus 1 Mio ; les champs inconnus renvoient 400.
- Les écritures qui créent des connexions MCP ou des Secrets exigent une `Idempotency-Key`. Les autres écritures l'acceptent.
- La concurrence optimiste utilise `row_version` : envoyez la dernière valeur lue et gérez le 409 en relisant la ressource.
- Les Agents, Sessions, items, tours et Skills utilisent la pagination par curseur (`limit`, `after`, `order` ; les réponses contiennent `has_more` et `last_id`). Les versions d'Agent, pièces jointes, connexions MCP et Secrets utilisent la pagination par décalage (`limit`, `offset` ; les réponses contiennent `total`).
- Les erreurs utilisent `{"error": {"type", "code", "param", "message"}}`. Voir [Erreurs de la plateforme Agents](/api-reference/errors#agents-platform-errors).

## Authentification {#authentication}

Envoyez une clé API SandBase comme jeton Bearer :

```http
Authorization: Bearer sk-YOUR_KEY
```

Traitez la clé comme un secret opaque, conservez-la côté serveur et ne l'incluez jamais dans le code du navigateur ni dans les journaux. Consultez [Authentification](/api-reference/authentication) pour les détails de compatibilité et [Erreurs](/api-reference/errors) pour les enveloppes d'erreur publiques.

## Organisation et utilisation {#organization-and-usage}

Les ressources de la plateforme appartiennent à l'organisation associée à la clé API. Utilisez l'[API Account](/api-reference/account/) pour consulter le solde et les vues de l'historique d'exécution récent prises en charge. L'administration de l'organisation et la gestion de la facturation restent des opérations de la Console, sauf si un endpoint public est documenté ici.

## Formats de référence {#reference-formats}

- Parcourez les opérations dans la barre latérale pour voir les exemples et le détail des réponses.
- Téléchargez la [spécification OpenAPI](/openapi.yaml) lisible par machine.
- Ouvrez la page d'un modèle dans le [catalogue Models](https://www.sandbase.ai/models) ou celle d'une API dans le [catalogue APIs](https://www.sandbase.ai/apis) pour connaître ses champs de requête exacts.

## Étapes suivantes {#next-steps}

- Vous découvrez les Agents managés : [Créer un Agent](/agents/)
- Appeler directement un modèle : [Chat Completions](/api-reference/llm-gateway) ou le [catalogue Models](https://www.sandbase.ai/models)
