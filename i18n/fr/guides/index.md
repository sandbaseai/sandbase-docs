---
i18nSource: c922bd433deabf32
title: Guides
description: Guides pratiques pour utiliser les Models, APIs, Agents et la configuration de SandBase, ainsi que la facturation, le streaming et la fiabilité en production.
---

# Guides {#guides}

Ces guides présentent les pratiques courantes pour utiliser SandBase en production.

## Appeler des modèles {#call-models}
| Guide | Description |
|-------|-------------|
| [Chat Completions](./chat-completions) | Appeler SandBase via le protocole de chat compatible OpenAI |
| [OpenAI Responses](./openai-responses) | Appeler les modèles GPT via le protocole Responses compatible OpenAI |
| [Anthropic Messages](./anthropic-messages) | Appeler SandBase via le protocole Messages compatible Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | Appeler SandBase via le protocole GenerateContent compatible Google Gemini |
| [Image et vidéo](./image-video) | Générer des images et des vidéos via la Run API asynchrone commune |
| [Streaming](./streaming) | Diffuser en streaming la sortie des Models compatibles vers votre application |
| [Catalogue des APIs](https://www.sandbase.ai/apis) | Parcourir les fonctionnalités des APIs et leurs endpoints qualifiés par fournisseur |

## Exécuter en production {#run-in-production}
| Guide | Description |
|-------|-------------|
| [Erreurs et nouvelles tentatives](./error-handling) | Classer les échecs et ne réessayer que lorsqu'une opération peut être répétée sans risque |
| [Limites de débit](./rate-limiting) | Gérer les réponses 429 et lisser les pics de requêtes |
| [Limites de concurrence](./concurrency-limits) | Nombre de tâches que votre organisation peut exécuter simultanément |
| [Tarifs et utilisation](./billing) | Comprendre les crédits, l'utilisation et le contrôle des coûts |

## Conseils rapides {#quick-tips}

- Utilisez [Configuration](/setup/) lorsque l'utilisateur veut des outils dans Codex, Claude, Cursor ou Kiro.
- Utilisez les [Models](https://www.sandbase.ai/models) ou les [APIs](https://www.sandbase.ai/apis) lorsque votre application a besoin d'une seule fonctionnalité.
- Utilisez [Créer un Agent](/agents/) lorsque le travail comporte plusieurs étapes ou doit être réutilisé.
- Utilisez [Activities](https://www.sandbase.ai/console/activities) dans la Console pour examiner ensemble les requêtes et l'utilisation.
