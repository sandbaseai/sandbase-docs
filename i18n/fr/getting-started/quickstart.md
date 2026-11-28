---
i18nSource: 8cb9626a2127cb8d
title: Démarrage rapide
description: "Choisissez comment utiliser SandBase : sur la plateforme, via l'API ou avec votre Agent. Trouvez des Skills et des Tools, suivez les étapes et partez des dépôts du SDK ou de la CLI."
pageClass: quickstart-page
---

# Démarrage rapide {#quick-start}

## Choisissez comment utiliser SandBase {#connect}

Voici **trois façons alternatives de commencer**, et non trois étapes à enchaîner. Utilisez le même compte et le même workspace SandBase pour chacune d'elles.

<QuickstartPaths />

Vous avez simplement besoin d'une tâche prête à l'emploi ? [Explorez les Tools](#use-tools) ou [choisissez un Skill](#use-skills). Vous pouvez parcourir les catalogues publics et la documentation avant de vous connecter.

### Partir des dépôts open source {#start-from-the-open-source-repositories}

- **[SandBase — SDKs & examples](https://github.com/sandbaseai/sandbase)** : clients Python, TypeScript et Go, exemples d'API et workflows d'Agents hébergés. À utiliser pour créer votre propre application.
- **[SandBase CLI & MCP](https://github.com/sandbaseai/cli)** : installez et connectez votre outil d'IA, ou découvrez et exécutez des capacités depuis un terminal. À utiliser avec votre Agent existant.

## Avant de commencer : connectez-vous {#create-account}

Connectez-vous avant d'utiliser un Playground, d'exécuter un Skill hébergé ou de créer une clé API. Les outils gratuits qui fonctionnent sans compte peuvent être utilisés directement. **Déjà connecté ? Passez cette étape** et vérifiez que le menu du compte affiche le workspace que vous comptez utiliser.

SandBase utilise GitHub ou Google. Il n'existe pas d'inscription séparée par e-mail et mot de passe.

1. Ouvrez [Create account / Sign in](https://www.sandbase.ai/login){target="_blank"}.
2. Effectuez la vérification de sécurité, puis choisissez **Sign in with GitHub** ou **Sign in with Google**.
3. Autorisez l'accès dans la fenêtre du fournisseur.
4. Revenez à la page que vous utilisiez, ou ouvrez la [Console](https://www.sandbase.ai/console){target="_blank"}.

La première connexion crée votre compte et un **workspace personnel**. Vous n'avez pas besoin de créer une organisation pour essayer SandBase.

Si un crédit de bienvenue apparaît, vous pouvez commencer sans ajouter de moyen de paiement. La carte **Balance** du tableau de bord de la Console et la page [Billing](https://www.sandbase.ai/console/billing){target="_blank"} affichent le solde actuel.

## Sur la plateforme {#use-on-website}

Choisissez cette option si vous voulez d'abord essayer un Model, une API ou un Agent dans le navigateur, sans installer de client ni écrire de code.

1. Connectez-vous, puis ouvrez le catalogue :
   - [Modèles de langage](https://www.sandbase.ai/models){target="_blank"}
   - [Modèles d'image et de vidéo](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [API](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Ouvrez la page de détail d'un modèle ou d'une API et sélectionnez **Playground** lorsqu'il est disponible.
3. Saisissez les entrées requises, comme un prompt, une image, une requête de recherche ou une URL. Vérifiez le prix affiché avant l'exécution.
4. Exécutez la requête et consultez le texte, les données, l'image, la vidéo ou le statut de tâche renvoyés.

Vous n'avez pas besoin de créer une clé API distincte pour le Playground du site web. Si une capacité ne propose pas de Playground, utilisez son onglet **API** et suivez le parcours API ci-dessous.

## Via l'API {#call-api}

Choisissez cette option si vous ajoutez une capacité à votre application.

1. Réutilisez une clé valide pour le workspace visé, ou créez une [clé API](/getting-started/api-keys) dans [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} avec **New key**. Copiez-la immédiatement : elle n'est affichée qu'une seule fois.
2. Filtrez le catalogue et ouvrez une page de détail :
   - [Modèles de langage](https://www.sandbase.ai/models){target="_blank"} : filtrez par fournisseur, capacités, contexte et prix
   - [Modèles d'image et de vidéo](https://www.sandbase.ai/models/image-video){target="_blank"} : filtrez les modèles multimodaux, par exemple text-to-image, image-to-image, text-to-video et image-to-video
   - [API](https://www.sandbase.ai/apis){target="_blank"} : filtrez les ressources d'API par plateforme et par source de données
3. Ouvrez l'onglet **API**, copiez l'exemple de requête et renseignez les champs obligatoires de cet endpoint.
4. Stockez votre clé SandBase dans une variable d'environnement côté serveur et exécutez la requête. Ne la placez pas dans du code exécuté dans le navigateur ni dans un dépôt public.
5. Vérifiez la réponse. Pour une tâche asynchrone, suivez l'exemple d'interrogation du statut de l'endpoint jusqu'à ce qu'elle se termine.

Exemple d'appel à un modèle de langage pour **Bash / zsh** (macOS, Linux ou Windows avec WSL). Remplacez la clé fictive en local. Pour d'autres environnements, utilisez les exemples Python, TypeScript ou Go du dépôt ci-dessous ; les commandes shell ne sont pas interchangeables avec PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Partir du code : [SDK et exemples SandBase sur GitHub](https://github.com/sandbaseai/sandbase).

En savoir plus : [Premier appel d'API](/getting-started/first-call).

## Avec votre Agent {#use-in-ai-tool}

Choisissez cette option si vous utilisez Claude Code, Codex, Cursor, Kiro ou un autre client pris en charge et que vous voulez disposer des Models et API SandBase dans cette application.

**Pour une configuration locale automatique :** votre client doit pouvoir exécuter des commandes, et sa machine doit disposer de Node.js 20+ avec npm. Si vous utilisez un client de chat uniquement, suivez plutôt ses [instructions de connexion spécifiques](/setup/).

1. Ouvrez [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} dans la Console.
2. Collez cette ligne dans le chat de votre assistant IA, puis indiquez-lui ce que vous voulez créer. Il s'agit d'une instruction de chat, et non d'une commande shell :

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Validez la connexion dans le navigateur que l'agent ouvre. Aucune clé API n'est à coller.
4. Démarrez une nouvelle session ou redémarrez l'application pour que les outils SandBase se chargent.
5. Demandez à l'agent de découvrir et d'inspecter l'outil pertinent, puis d'effectuer une requête limitée, dans le respect de votre autorisation et de votre budget. Pour le développement, demandez-lui d'intégrer la réponse à votre projet et de fournir la commande d'exécution ainsi que les résultats de test réels. La découverte seule ne vérifie pas un appel d'API métier.

Vous préférez un terminal ? Exécutez `npx -y @sandbaseai/cli@latest connect`. La commande configure les clients pris en charge qu'elle détecte ; pour n'en configurer qu'un seul, utilisez `npx -y @sandbaseai/cli@latest connect --client codex` (remplacez `codex` par votre client pris en charge). Redémarrez ensuite ce client. Vérifiez le workspace sélectionné avant une exécution payante.

Par exemple, vous pouvez demander :

> Trouve une API SandBase pour rechercher des posts X publics sur les agents IA. Inspecte d'abord ses entrées requises et son prix, puis indique-moi le coût d'une requête avant de l'exécuter. Conserve les liens sources d'origine dans le résultat.

Code source et instructions d'installation : [SandBase CLI & MCP sur GitHub](https://github.com/sandbaseai/cli).

En savoir plus : [Connecter des outils d'IA](/setup/).

### Laissez votre assistant IA vous aider à construire {#start-with-your-agent}

Le [Skill de configuration](https://www.sandbase.ai/SKILL.md) guide votre agent selon votre situation : pas encore de compte, une clé API existante, un outil déjà connecté, un projet existant ou une nouvelle fonctionnalité. Il vérifie les entrées et le prix de l'endpoint, aide à implémenter l'intégration et distingue la configuration d'un appel vérifié et d'une fonctionnalité opérationnelle. Indiquez-lui votre objectif et toute limite de dépenses ; ne collez pas votre clé dans le chat.

Vous avez déjà une clé ou un projet ? Dites-le ; vous n'avez pas besoin de tout recommencer. Par exemple : « J'ai une clé SandBase. Ajoute une recherche de trafic Similarweb à ce projet ; inspecte l'API et montre-moi d'abord le coût du test en direct. » Un assistant qui ne peut pas exécuter de commandes ni charger d'outils a besoin du [parcours de configuration propre au client](/setup/).

[Donnez à votre agent le Quickstart en Markdown](https://www.sandbase.ai/quickstart.md), ou suivez les étapes ci-dessous. L'installation du Skill de configuration ne crée pas à elle seule un Agent hébergé.

### Facultatif : exécuter un Agent hébergé sur SandBase {#build-agent}

Choisissez cette option si le travail comporte plusieurs étapes ou doit être réutilisé.

1. Ouvrez [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} et sélectionnez **Create**.
2. Remplissez **Overview** et **Instructions**.
3. Choisissez un **Model**.
4. Ajoutez des Skills et des outils MCP sous **Capabilities**, puis définissez **Runtime**.
5. Sélectionnez **Create & Chat** pour le tester dans une Session.
6. Appelez la version testée depuis votre application via l'onglet **API** de l'Agent.

En savoir plus : [Build Agent](/agents/). Pour faire la même chose depuis le code avec le SDK OpenAI officiel, consultez [Compatibilité OpenAI](/agents/openai-compatibility).

## Skills, Tools et autres façons de construire {#skills-and-tools}

Choisissez la ressource adaptée à votre tâche. Vous n'avez pas besoin d'installer un Skill ni de créer un Agent hébergé pour utiliser une API.

- **[Tools](https://www.sandbase.ai/tools) :** accomplissez une tâche précise dans une interface prête à l'emploi, comme formater du texte ou rechercher des données publiques.
- **[Skills](https://www.sandbase.ai/skills) :** donnez à un agent un workflow réutilisable avec des instructions, des scripts et des exemples.
- **Models et API :** appelez une capacité depuis un Playground, votre code ou un agent connecté. Explorez les [modèles de langage](https://www.sandbase.ai/models), l'[image et la vidéo](https://www.sandbase.ai/models/image-video) ou les [API de données](https://www.sandbase.ai/apis).
- **[Agents hébergés](/agents/) :** configurez et exécutez un agent réutilisable sur SandBase.
- **[Sandboxes](/sandbox/) :** donnez au code un environnement isolé pour s'exécuter et manipuler des fichiers.

### Utiliser un Tool {#use-tools}

1. Ouvrez [Tools](https://www.sandbase.ai/tools) et choisissez la tâche à accomplir.
2. Lisez les entrées requises par l'outil et son libellé de tarif ou de quota. Les utilitaires gratuits peuvent fonctionner sans compte ; les outils de données exigent une connexion à SandBase pour s'exécuter, et les tests de modèles peuvent nécessiter votre propre clé.
3. Saisissez le texte, l'URL, le fichier ou les autres entrées demandés, puis utilisez l'action d'exécution de l'outil.
4. Vérifiez le résultat et utilisez l'action de copie ou de téléchargement lorsqu'elle est proposée. Pour un outil de données, utilisez l'API et l'exemple de requête associés si vous voulez automatiser la même tâche.

**Le quota quotidien gratuit est partagé par le workspace**, et non attribué séparément à chaque outil. Vérifiez l'éligibilité et le prix affiché avant l'exécution ; un utilitaire gratuit ne rend pas gratuit un appel de modèle ou d'API.

### Utiliser un Skill {#use-skills}

1. Ouvrez [Skills](https://www.sandbase.ai/skills), choisissez un workflow et lisez ses exemples, ses entrées requises et ses dépendances.
2. Choisissez l'une des options disponibles sur la page de détail de ce Skill :
   - **Run online :** connectez-vous et exécutez l'exemple hébergé lorsqu'il est proposé. Suivez sa progression et ouvrez le résultat ou les fichiers produits. Vérifiez l'allocation affichée ; la disponibilité et les limites varient selon le Skill.
   - **Install / Download :** connectez-vous pour télécharger le package lorsqu'il est proposé. Extrayez le package complet dans un dossier de travail, puis suivez ses instructions d'installation ou demandez à votre agent local de lire son `SKILL.md`.
3. Pour une utilisation locale, indiquez votre tâche, vos entrées, le résultat souhaité et votre limite de dépenses. Connectez SandBase en suivant le [parcours Agent](#use-in-ai-tool) ; si les scripts du Skill exigent une clé, configurez-la dans l'environnement d'exécution au lieu de la coller dans le chat.
4. Vérifiez le résultat réel. Télécharger un Skill ou connecter votre agent ne signifie pas que le workflow s'est exécuté avec succès.

Le **Skill de configuration** SandBase connecte votre client ; les Skills du catalogue décrivent des workflows individuels. Vérifiez les dépendances et le client pris en charge de chaque Skill avant de l'installer. Les appels de modèles et d'API effectués par un workflow local peuvent entraîner des frais d'utilisation.

Consultez [Utiliser un Skill en local](/guides/skills/local-use) pour une procédure complète, y compris les dossiers d'entrée et les livrables enregistrés.

## Facultatif : partager un workspace d'équipe {#create-organization}

Les clés API, l'utilisation et la facturation appartiennent à une organisation. Restez dans le workspace personnel si vous évaluez seul. Créez une équipe lorsque plusieurs personnes partageront des clés et des dépenses.

| Workspace | Quand l'utiliser |
|---|---|
| **Personnel** | Créé automatiquement à la première connexion. Un par utilisateur. |
| **Équipe** | Membres, clés et solde partagés. À créer pour une entreprise ou un projet. |

### Créer une équipe {#create-team}

1. Ouvrez [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"}, ou choisissez **Create Team** dans le menu du compte en haut à droite de la Console.
2. Saisissez un **Team name**, puis sélectionnez **Create team**.
3. Vérifiez que le menu du compte affiche désormais cette équipe comme workspace actif.
4. Sur **Developer → Team**, sélectionnez **Add member**, saisissez l'**Account email** d'un compte SandBase existant et choisissez le **Workspace role** (Member ou Admin).

La personne invitée doit déjà avoir un compte SandBase. Si ce n'est pas le cas, envoyez-lui [cette page](/getting-started/quickstart) pour qu'elle se connecte d'abord, puis ajoutez-la.

Si vous appartenez à plusieurs organisations, changez d'organisation dans le menu du compte. Les clés et la facturation suivent l'organisation **active**. Consultez [Organisations](/admin/organizations) pour les rôles.

## Vérifier que tout fonctionne {#confirm-it-works}

Vous êtes prêt lorsque toutes les conditions suivantes sont remplies :

- Le menu du compte de la Console affiche l'organisation que vous comptez utiliser.
- Vous avez suivi un parcours : un appel d'API, une exécution sur le site web, un outil d'IA connecté ou un Agent.
- Une requête aboutit.

Si la requête échoue, vérifiez l'organisation active, la clé et les [Erreurs](/guides/error-handling). Rechargez votre solde dans [Billing](https://www.sandbase.ai/console/billing){target="_blank"} lorsque le workspace n'a plus de solde.

### En cas de blocage {#if-you-get-stuck}

| Ce que vous voyez | Ce qu'il faut vérifier |
| --- | --- |
| Connexion requise | Connectez-vous, revenez à la page d'origine et vérifiez le workspace actif. |
| Clé invalide ou accès refusé | Vérifiez que la clé appartient au workspace visé et a accès à l'endpoint. Ajouter des crédits ne corrige pas les autorisations. |
| Solde insuffisant ou quota épuisé | Lisez la réponse : consultez Billing pour un problème de solde, ou l'heure de réinitialisation affichée pour une limite de quota. |
| Aucun outil dans votre Agent | Démarrez une nouvelle session du client, puis suivez les diagnostics de [Connecter des outils d'IA](/setup/). |
| Tâche toujours en cours | Suivez le statut de tâche renvoyé ou l'indicateur de progression de la page. Évitez de soumettre plusieurs fois la même requête payante. |

## Facturation et utilisation {#billing-and-usage}

Une fois connecté, consultez les dépenses de l'organisation active :

<QuickstartResources group="ops" />

## Que faire ensuite {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) : accomplir une tâche dans le navigateur
- [Skills](https://www.sandbase.ai/skills) : trouver un workflow d'agent réutilisable
- [Clés API](/getting-started/api-keys) : créer et renouveler les clés de l'organisation
- [Catalogue des Models et API](https://www.sandbase.ai/models) : essayer des Models, des API et des Agents sur le site web
- [Connecter des outils d'IA](/setup/) : donner à votre outil d'IA accès au catalogue SandBase
- [Build Agent](/agents/) : créer des Agents réutilisables
- [Référence de l'API](/api-reference/) : intégrer avec du code
