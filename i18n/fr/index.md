---
i18nSource: c063864501452a7b
title: Documentation SandBase
description: Construisez directement avec les Models et les APIs, ou définissez des Agents réutilisables qui s'exécutent sur une infrastructure gérée.
---

# Documentation SandBase {#sandbase-docs}

Construisez directement avec les Models et les APIs, ou définissez des Agents réutilisables qui s'exécutent sur une infrastructure gérée.

SandBase propose deux façons complémentaires de créer des applications d'IA. Commencez par la surface la plus réduite adaptée au besoin ; vous pourrez les combiner à mesure que l'application grandit.

## Choisir comment construire {#choose-how-to-build}

| | Models et APIs | Agents gérés |
|---|---|---|
| **De quoi s'agit-il** | Accès direct aux modèles de langage, d'image, de vidéo et d'audio, ainsi qu'aux APIs tierces | Configurations d'Agent réutilisables et versionnées, exécutées par SandBase |
| **Idéal pour** | Boucles applicatives personnalisées et contrôle fin des requêtes | Travaux en plusieurs étapes, asynchrones ou répétables |
| **Vous gérez** | Prompts, orchestration, nouvelles tentatives et état de l'application | Définition de l'Agent, fonctionnalités activées, entrées et mode de livraison |
| **Commencer ici** | [Models et APIs](https://www.sandbase.ai/models) | [Créer un Agent](/agents/) |

::: tip Une seule clé API SandBase
La même clé API peut appeler les Models, les APIs et les Agents. Conservez les clés côté serveur et ne les exposez jamais dans du code exécuté dans le navigateur.
:::

## Concepts clés {#core-concepts}

### Models et APIs {#models-and-apis}

Utilisez les Models pour les charges de travail de langage, d'image, de vidéo et d'audio. Utilisez les APIs lorsque l'application a besoin de données ou d'actions externes. Le catalogue du site SandBase présente les fonctionnalités disponibles, les tarifs, les schémas d'entrée et des exemples fonctionnels.

- [Parcourir les Models](https://www.sandbase.ai/models)
- [Parcourir les APIs](https://www.sandbase.ai/apis)
- [Effectuer votre premier appel d'API](/getting-started/first-call)
- [Ouvrir la référence de l'API](/api-reference/)

### Agents {#agents}

Un Agent est une configuration réutilisable et versionnée qui contient un Model, des instructions, des Skills et des connexions MCP. Définissez-le une fois, puis exécutez-le dans des Sessions.

- [Comprendre les Agents](/agents/)
- [Définir un Agent](/agents/agent-api)
- [Ajouter des Skills et des outils MCP](/agents/mcp-tools)

### Sessions {#sessions}
Une Session exécute une version d'Agent. Créez-la avec `POST /v1/agents/sessions`, envoyez des entrées, suivez le flux d'événements, puis lisez la conversation complète.

- [Guide des Sessions](/agents/sessions)
- [API Sessions](/api-reference/sessions/)

## Premières étapes {#first-steps}

1. Créez une organisation et une [clé API](/getting-started/api-keys).
2. Choisissez un Model, une API ou un Agent dans le [catalogue](https://www.sandbase.ai/models).
3. Envoyez une requête directe, ou définissez et testez un Agent.
4. Exécutez l'Agent testé dans des Sessions depuis votre application.
5. Examinez les Sessions, les erreurs, la latence et les coûts dans la Console.

## Conseils d'exploitation {#operational-guidance}

- [Réponses en streaming](/guides/streaming)
- [Gestion des erreurs et nouvelles tentatives](/guides/error-handling)
- [Limitation de débit](/guides/rate-limiting)
- [Facturation et tarifs](/guides/billing)
- [Administration de l'espace de travail](/admin/)

## Étapes suivantes {#next-steps}

- Créer avec des Skills locaux : [tutoriels Skills](/guides/skills/)

- Vous découvrez SandBase : [Prise en main](/getting-started/)
- Appeler un Model ou une API : [catalogue des Models](https://www.sandbase.ai/models) et [catalogue des APIs](https://www.sandbase.ai/apis)
- APIs d'inférence et d'Agents : [Référence de l'API](/api-reference/)
- Créer un travail réutilisable : [Créer un Agent](/agents/)
- Connecter un outil d'IA : [Configuration](/setup/)
