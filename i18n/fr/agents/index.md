---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Définissez, testez et exécutez des Agents réutilisables et versionnés dans des Sessions SandBase.
---

# Build Agent {#build-agent}

Build Agent est l'endroit où vous définissez et testez un Agent, puis décidez de son mode d'exécution.

Un Agent est une configuration enregistrée et versionnée : un modèle, des instructions, un profil de runtime, des Skills et des connexions MCP vers des outils externes. Enregistrer un Agent ne l'exécute pas.

## Qu'est-ce qu'un Agent {#what-an-agent-is}

| Question | Où cela se trouve |
|---|---|
| Que doit-il faire ? | `instructions` |
| Quel modèle effectue le travail ? | `model`, un ID de modèle issu de l'[API Models](/api-reference/models/) |
| Que sait-il faire ? | Les [Skills](/agents/mcp-tools#skills), des bundles d'instructions versionnés |
| Quels outils externes peut-il appeler ? | Les [connexions MCP](/agents/mcp-tools#mcp-connections), avec des [identifiants](/agents/api-credentials) lorsque le serveur exige un jeton |
| Comment s'exécute-t-il ? | Dans une [Session](/agents/sessions) |

Chaque modification effective crée une nouvelle version immuable. Vous pouvez lister les versions et restaurer une version antérieure à tout moment.

## Comment un Agent s'exécute {#how-an-agent-runs}

Vous exécutez un Agent dans une [Session](/agents/sessions). Une Session est une ressource `ses_` à laquelle vous envoyez des entrées et dont vous recevez les événements en streaming, qu'il s'agisse d'une conversation interactive, d'un test ou d'un appel depuis votre application. Chaque Session fige la version de l'Agent avec laquelle elle a démarré : vous pouvez donc continuer à modifier l'Agent sans changer les Sessions existantes.

## Cycle de vie d'un Agent : brouillon → test dans une Session → exécution depuis votre application → inspection des Sessions {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Brouillon {#_1-draft}

Créez un Agent dans la Console sous **Build → Agents**, ou avec [`POST /v1/agents`](/agents/agent-api). Commencez par le plus petit workflow utile et n'ajoutez des Skills et des connexions MCP que lorsque les instructions en ont besoin.

### 2. Test dans une Session {#_2-test-in-a-session}

Créez une Session pour l'Agent, envoyez une entrée représentative et examinez la sortie, l'activité des outils et les erreurs. Testez les entrées manquantes, les outils indisponibles, les résultats vides et les exigences de format de sortie, pas seulement le cas nominal.

### 3. Exécution depuis votre application {#_3-run-from-your-app}

Créez des Sessions pour l'Agent testé depuis votre application avec l'[API Sessions](/api-reference/sessions/).

### 4. Inspection des Sessions {#_4-inspect-sessions}

Lisez les éléments et les tours de chaque Session avec l'API Sessions pour examiner la conversation complète, l'activité des outils et les erreurs.

## Liste de contrôle pour la production {#production-checklist}

- `model` utilise un ID de modèle actuel issu de l'API Models.
- Les Skills sont épinglés à une version lorsque le comportement ne doit pas changer sans prévenir.
- Les connexions MCP n'exposent que les outils dont l'Agent a besoin, via `allowed_tools`.
- Les jetons sont stockés sous forme de [Secrets](/agents/api-credentials), jamais écrits dans les instructions, les entrées ou les métadonnées.
- La création de Session envoie un `Idempotency-Key`, et les nouvelles tentatives le réutilisent.
- Le statut et les erreurs des Sessions sont vérifiés après le lancement.

## Agents du catalogue {#catalog-agents}

Le [catalogue d'Agents](/api-reference/agents/catalog) public liste les Agents publiés par SandBase. Vous pouvez lire un Agent du catalogue, mais pour le modifier, clonez-le d'abord dans votre organisation avec `POST /v1/agents/catalog/{agent_id}/clone`. Le clone est un nouvel Agent privé qui vous appartient et que vous pouvez exécuter.

::: tip Utiliser le SDK OpenAI
Les Agents, les Sessions et les Skills suivent l'API OpenAI Agents : le SDK OpenAI officiel fonctionne donc avec `base_url="https://api.sandbase.ai/v1"`. Consultez [Compatibilité OpenAI](/agents/openai-compatibility) pour des exemples vérifiés et les différences.
:::

## Étapes suivantes {#next-steps}

- [Définir un Agent](/agents/agent-api)
- [Compatibilité OpenAI](/agents/openai-compatibility)
- [Skills et outils MCP](/agents/mcp-tools)
- [Sessions](/agents/sessions)
