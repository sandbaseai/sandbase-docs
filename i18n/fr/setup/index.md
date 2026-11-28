---
i18nSource: 28b1ef75a197824a
title: Connecter des outils d'IA
description: Donnez à Claude Code, Codex, Cursor, Kiro et d'autres outils d'IA accès au catalogue SandBase de Models et d'API avec un seul prompt ou une seule commande CLI.
---

# Connecter des outils d'IA {#connect-ai-tools}

La page [AI tools](https://www.sandbase.ai/console/setup) de la Console (**Build → AI tools**) connecte SandBase à l'agent ou à l'outil d'IA que vous utilisez déjà. Les outils connectés peuvent rechercher dans le catalogue SandBase de Models et d'API, lire le schéma d'entrée et le prix de chaque outil, puis l'exécuter. Chaque appel est facturé à l'espace de travail actif.

Les clients pris en charge incluent Claude Code, Codex, Cursor, Kiro IDE et Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop et ChatGPT. La page AI tools indique la liste à jour.

## Démarrage rapide : collez un seul prompt {#quick-start-paste-one-prompt}

Collez cette ligne dans votre agent :

```text
set up https://www.sandbase.ai/SKILL.md
```

L'agent lit la Skill SandBase, installe la CLI et vous demande d'approuver une connexion dans le navigateur. Vous n'avez pas à coller de clé API. Lorsque l'agent indique que le client est configuré, démarrez une nouvelle session ou redémarrez l'application pour charger les outils `sandbase_*`.

La Skill nécessite Node.js 20 ou une version ultérieure sur la machine qui exécute l'agent.

## Autres méthodes de connexion {#other-ways-to-connect}

### CLI {#cli}

Connectez-vous depuis un terminal. Sans `--client`, la CLI configure tous les clients pris en charge qu'elle détecte :

```sh
npx -y @sandbaseai/cli@latest connect
```

Pour configurer un seul client, passez son identifiant, par exemple `codex`, `claude-code`, `cursor` ou `kiro` :

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Le script d'installation exécute la même commande :

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Pour lister les clients reconnus par le programme d'installation sans modifier la configuration locale :

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` ouvre l'autorisation dans le navigateur, crée une clé **CLI Login** pour l'espace de travail que vous approuvez et n'écrit que la configuration client propre à SandBase. La [CLI SandBase](https://github.com/sandbaseai/cli) open source documente chaque client.

### Clients MCP configurés manuellement {#mcp-clients-you-configure-by-hand}

Les utilisateurs connectés voient l'adresse du serveur MCP sous **Other ways to connect** sur la page [AI tools](https://www.sandbase.ai/console/setup). Authentifiez-le avec une [clé API](/getting-started/api-keys) issue de **Developer → API Keys**, et conservez la clé dans la configuration des secrets du client.

## Vérifier la connexion {#verify-the-connection}

L'installation ou l'autorisation seule ne prouve pas qu'un client est connecté. Vérifiez que :

- le serveur ou connecteur SandBase est visible dans le client
- les outils `sandbase_*` sont détectables dans une nouvelle session
- une requête simple et sans risque en langage naturel aboutit

Pour les clients gérés par la CLI, lancez le diagnostic après une reconnexion ou une modification de configuration :

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` vérifie l'identifiant local, l'entrée MCP et la Skill, puis effectue un aller-retour vers SandBase. Effectuez toujours l'appel d'outil final depuis le client lui-même.

Les exécutions lancées par les outils connectés apparaissent dans [Activities](https://www.sandbase.ai/console/activities) avec leur coût.

## Dépannage {#troubleshooting}

| Problème | Que vérifier |
|---|---|
| Les outils n'apparaissent pas | Démarrez une nouvelle session du client ou redémarrez l'application, exécutez `npx -y @sandbaseai/cli doctor --client <client>`, puis réessayez. |
| L'autorisation est absente | Relancez `connect` et approuvez la connexion dans le navigateur pour l'espace de travail à facturer. |
| Les appels échouent avec HTTP 402 | Ajoutez du crédit dans [Billing](https://www.sandbase.ai/console/billing) pour l'espace de travail actif. |

## Supprimer la configuration gérée {#remove-the-managed-configuration}

Supprimez uniquement l'entrée propre à SandBase pour un client :

```sh
npx -y @sandbaseai/cli unregister --client codex
```

La commande ne supprime que la configuration dont elle peut vérifier l'appartenance à SandBase et laisse intactes les entrées sans rapport ou gérées par l'utilisateur. Révoquez ensuite la clé **CLI Login** correspondante sous **Developer → API Keys** si vous n'en avez plus besoin.

## Code source et support {#source-and-support}

- [Code source](https://github.com/sandbaseai/cli)
- [Paquet npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Questions et exemples](https://github.com/sandbaseai/cli/discussions)
- [Signaler un bug](https://github.com/sandbaseai/cli/issues/new/choose)

## Étapes suivantes {#next-steps}

- [Catalogue Models et APIs](https://www.sandbase.ai/models)
- [Tutoriels sur les Skills](/guides/skills/)
- [Créer un Agent](/agents/)
