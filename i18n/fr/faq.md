---
i18nSource: a86346e2696c732c
title: FAQ
description: Questions fréquentes sur la connexion des outils d'IA, le catalogue SandBase, les Models, les API, les Agents, les Sessions et la facturation.
---

# Questions fréquentes {#frequently-asked-questions}

## Qu'est-ce que SandBase ? {#what-is-sandbase}

SandBase aide les Agents à se connecter au monde réel.

Vous pouvez utiliser des Models et des API prêts à l'emploi, les utiliser depuis vos outils d'IA après les avoir connectés dans AI tools, ou créer des Agents réutilisables et les exécuter dans des Sessions.

## À qui s'adresse SandBase ? {#who-is-sandbase-for}

SandBase s'adresse principalement à trois groupes :

- les **utilisateurs d'outils d'IA** qui veulent des capacités utiles dans Codex, Claude, Cursor ou Kiro
- les **développeurs** qui veulent appeler directement des Models et des API
- les **FDE et les équipes** qui créent des Agents réutilisables pour des clients ou des workflows internes

## Où parcourir les capacités ? {#where-do-i-browse-capabilities}
Le site web SandBase présente le catalogue des capacités :

- [Models](https://www.sandbase.ai/models) et [modèles d'image et de vidéo](https://www.sandbase.ai/models/image-video)
- [API](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Selon le type de capacité, vous pouvez l'inspecter, la tester, l'installer, l'appeler ou la cloner.

## Qu'est-ce que AI tools ? {#what-is-ai-tools}

**Build → AI tools** dans la Console connecte SandBase à l'outil d'IA que vous utilisez déjà, comme Claude Code, Codex, Cursor ou Kiro. Collez `set up https://www.sandbase.ai/SKILL.md` dans votre agent, ou exécutez `npx -y @sandbaseai/cli@latest connect`. L'outil connecté peut rechercher et exécuter les Models et API du catalogue SandBase, facturés à votre workspace. Consultez [Connecter des outils d'IA](/setup/).

## Qu'est-ce que Build Agent ? {#what-is-build-agent}

Build Agent est l'endroit où vous définissez et testez un Agent.

Un Agent combine des instructions, un Model, des Skills et des outils MCP en un workflow réutilisable et versionné.

## Un Agent est-il différent d'une API ? {#is-an-agent-different-from-an-api}
Oui. Un Agent est une configuration versionnée que vous modifiez et testez, et vous l'exécutez en créant une Session. Votre application peut créer des Sessions avec l'[API Sessions](/api-reference/sessions/) pendant que vous continuez à modifier l'Agent.

## Que sont les Sessions ? {#what-are-sessions}
Une Session est une exécution d'un Agent, avec sa conversation, son activité d'outils et sa sortie.

## Comment donner à un Agent l'accès à des API externes ? {#how-do-i-give-an-agent-access-to-external-apis}

Connectez le système externe sous forme de serveur MCP et ajoutez-le aux connexions MCP de l'Agent. Si le serveur exige un jeton Bearer, stockez-le avec l'[API Secrets](/agents/api-credentials#with-the-api) sous forme de Secret en écriture seule lié à l'URL de ce serveur. Les jetons ne sont envoyés qu'à ce serveur et n'apparaissent jamais dans les prompts ni dans le runtime de l'Agent. Consultez [Identifiants pour les outils MCP](/agents/api-credentials).

## Où se trouvent les Models ? {#where-do-models-live}

Les Models ont leur propre [catalogue](https://www.sandbase.ai/models), car ce sont des briques de base importantes.

Vous pouvez appeler un Model directement, l'utiliser depuis un outil d'IA connecté ou l'utiliser dans un Agent.

## Dois-je écrire du code ? {#do-i-need-to-write-code}

Pas toujours.

[Connectez votre outil d'IA](/setup/) si vous voulez y disposer de capacités sans écrire de code.

Utilisez l'API Reference si vous voulez appeler SandBase depuis votre application.

Utilisez Build Agent si vous voulez un travail réutilisable en plusieurs étapes.

## Comment obtenir une clé API ? {#how-do-i-get-an-api-key}

Ouvrez la Console, accédez à **Developer → API Keys** et sélectionnez **New key**.

Utilisez la clé ainsi :

```http
Authorization: Bearer sk-YOUR_KEY
```

## Comment fonctionne la facturation ? {#how-does-billing-work}

SandBase utilise des crédits et une facturation à l'usage.

Les Models, les API, les Agents et le travail d'exécution peuvent avoir des coûts différents. Consultez la Console pour connaître l'utilisation et les tarifs actuels.

## Étapes suivantes {#next-steps}

- [Prise en main](/getting-started/)
- [Catalogue des Models et API](https://www.sandbase.ai/models)
- [Connecter des outils d'IA](/setup/)
- [Build Agent](/agents/)
- [Référence de l'API](/api-reference/)
