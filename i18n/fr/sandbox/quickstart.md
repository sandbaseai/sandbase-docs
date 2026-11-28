---
i18nSource: 0d7d66842e233794
title: Démarrage rapide du Sandbox avec le SDK E2B
description: Connectez les SDK officiels E2B JavaScript et Python à SandBase, exécutez des commandes, lisez et écrivez des fichiers, et gérez un sandbox en toute sécurité.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Démarrage rapide du Sandbox avec le SDK E2B {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Utilisez le SDK officiel E2B avec votre clé API SandBase pour créer un sandbox isolé, exécuter une commande, et lire et écrire des fichiers. Ce guide cible les **SDK E2B JavaScript et Python 2.51.0**.

Pour créer et observer des instances depuis le navigateur, connectez-vous à la [Sandbox Console](https://www.sandbase.ai/console/sandboxes) afin de créer une instance et de consulter son statut, ses journaux et ses métriques. Poursuivez avec les étapes SDK ci-dessous pour l'intégration dans une application, ou consultez la [présentation du produit Sandbox](https://www.sandbase.ai/sandbox).

## 1. Configurer le SDK officiel {#_1-configure-the-official-sdk}

[Créez une clé API SandBase dans la Console](https://www.sandbase.ai/console/keys), puis configurez les variables d'environnement E2B standard. Le SDK officiel les lit automatiquement en JavaScript comme en Python.

| Variable d'environnement | Valeur |
|---|---|
| `E2B_API_KEY` | Votre clé API SandBase, depuis [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Laissez-la non définie pour que le SDK utilise l'adresse du plan de données de chaque sandbox |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Si vous stockez déjà la clé dans `SANDBASE_API_KEY`, réutilisez-la :

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Seule votre clé API SandBase est nécessaire. Utilisez une clé SandBase standard autorisée à accéder au Sandbox ; une clé limitée à une autre capacité peut être refusée. Voir [Clés API](/getting-started/api-keys).

### Le code E2B existant peut-il rester inchangé ? {#can-existing-e2b-code-stay-unchanged}

Oui, pour les opérations prises en charge, si votre application lit déjà les paramètres de connexion du SDK depuis l'environnement et si son template est disponible sur SandBase. Conservez le SDK officiel et vos appels existants ; changez la clé, l'URL de l'API et le domaine indiqués ci-dessus. Les options de connexion explicites dans le code de l'application sont prioritaires sur les variables d'environnement : supprimez ou mettez à jour tout endpoint, domaine ou clé de fournisseur E2B codé en dur.

Définissez **à la fois** `E2B_API_URL` et `E2B_DOMAIN`. Avec un domaine seul, le SDK 2.51.0 déduit un hôte d'API avec un préfixe `api.` supplémentaire. `E2B_SANDBOX_URL` remplace l'adresse des commandes et fichiers propre à chaque instance ; ne lui attribuez pas l'origine de l'API de contrôle. Le mode debug modifie la sélection d'adresse du SDK pour le développement local ; laissez-le donc désactivé pour ce service HTTPS.

L'API de contrôle crée et gère les instances. Les commandes, les fichiers et les ports d'application utilisent des sous-domaines propres à chaque instance sous `sandbox.sandbase.ai`. N'ajoutez pas le préfixe `/v1` de l'API des modèles. Une requête réussie à l'API de contrôle ne garantit pas à elle seule l'accès aux commandes et fichiers ni à toutes les fonctionnalités du fournisseur.

Les exemples lisent les variables d'environnement du processus. Un fichier `.env` ne fonctionne que si votre application ou votre lanceur le charge avant d'utiliser le SDK.

### Choisir un template {#choose-a-template}

Utilisez votre clé SandBase pour lister les templates visibles par votre organisation :

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Choisissez un template dont `buildStatus` vaut `"ready"` et copiez son `templateID`. Les noms d'affichage figurent dans `names` ou `aliases` ; si les deux sont vides, utilisez l'ID. Le champ `public` distingue les templates publics des templates privés visibles par votre organisation.

La réponse est un tableau. Si les en-têtes de réponse contiennent `X-Next-Token`, passez sa valeur comme paramètre de requête `nextToken` pour obtenir la page suivante.

Définissez l'ID du template sélectionné :

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` est une variable utilisée par les exemples ci-dessous, et non un paramètre intégré du SDK E2B. Les exemples la passent explicitement à `Sandbox.create`. Le code existant peut conserver son argument de template si cet ID ou ce nom est disponible sur SandBase. Ne supposez pas qu'un ID de template E2B amont ou le `base` par défaut du SDK est disponible ; si la liste est vide, demandez l'accès aux templates pour votre organisation.

## 2. Créer, exécuter et nettoyer {#_2-create-execute-and-clean-up}

Ces exemples créent une ressource réelle. Ils utilisent une durée de vie de deux minutes et suppriment explicitement l'instance dans `finally`. Exécutez d'abord un seul exemple et vérifiez le nettoyage avant de le relancer.

### JavaScript {#javascript}

Utilisez Node.js 22 ou une version ultérieure dans un répertoire d'application :

```bash
npm install --save-exact e2b@2.51.0
```

Enregistrez sous `sandbox-example.mjs` :

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

Exécutez avec les variables d'environnement du SDK et le template sélectionné configurés :

```bash
node sandbox-example.mjs
```

### Python {#python}

Installez la version épinglée du SDK dans votre environnement Python :

```bash
python -m pip install 'e2b==2.51.0'
```

Enregistrez sous `sandbox_example.py` :

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

La réussite signifie que la vérification des commandes et fichiers ainsi que le nettoyage se sont terminés. Gardez les ID d'exécution et de sandbox au sein de votre organisation. Ne journalisez pas l'objet SDK : il peut contenir des jetons d'accès.

Si la création expire sans renvoyer d'ID, la ressource peut tout de même exister. Demandez à votre opérateur de la localiser à l'aide des métadonnées `quickstartRunId` avant d'en créer une autre. Un délai dépassé ou un processus interrompu ne confirme pas la suppression ; `finally` ne peut pas s'exécuter après l'arrêt forcé d'un processus.

## 3. Prolonger la durée de vie ou mettre en pause et se reconnecter {#_3-extend-the-lifetime-or-pause-and-reconnect}

Insérez ces extraits dans le bloc `try` de l'exemple correspondant, après la vérification des fichiers et avant le nettoyage. La pause et la reprise doivent être prises en charge par le template et le fournisseur sélectionnés.

JavaScript utilise des **millisecondes** pour ces délais du SDK :

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python utilise des **secondes** :

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

La reconnexion renvoie un nouvel objet SDK et de nouveaux identifiants de session. Utilisez cet objet pour les commandes et fichiers suivants. La suppression d'un sandbox met fin à son cycle de vie ; ce guide ne garantit pas la persistance du stockage après suppression. La durée de vie du sandbox et le délai d'une commande ou d'une requête HTTP individuelle sont des paramètres distincts.

## 4. Accéder aux ports d'application {#_4-access-application-ports}

Une fois que votre application écoute dans le sandbox, utilisez `sandbox.getHost(port)` en JavaScript ou `sandbox.get_host(port)` en Python pour obtenir son hôte. Le trafic applicatif exige l'en-tête `e2b-traffic-access-token`, avec la valeur `sandbox.trafficAccessToken` ou `sandbox.traffic_access_token` de la connexion en cours.

L'hôte seul n'autorise pas l'accès. Votre client HTTP ou WebSocket doit envoyer l'en-tête ; ouvrir simplement l'URL dans un onglet du navigateur ne l'ajoute pas. Traitez les jetons de trafic et les URL de fichiers signées comme des identifiants, et tenez-les à l'écart des journaux et des liens partagés. L'accès aux ports doit être pris en charge par l'environnement de sandbox sélectionné.

## Dépannage {#troubleshooting}

| Symptôme | Que vérifier |
|---|---|
| Erreur d'authentification ou de portée | Validité de la clé SandBase, accès de l'organisation et portée de la clé |
| Template introuvable | L'ID ou le nom exact du template activé et sa visibilité pour votre organisation |
| La création réussit mais les commandes ou fichiers échouent | Votre connexion réseau et les identifiants de session actuels ; reconnectez-vous et contactez le support si le problème persiste |
| Les requêtes atteignent le mauvais service | `E2B_API_URL`, `E2B_DOMAIN` et toute option du SDK codée en dur qui les remplace |
| L'accès échoue après une pause | Reconnectez-vous et utilisez le nouvel objet SDK renvoyé |
| Le port d'application rejette une requête | L'état de préparation de l'application et l'en-tête du jeton de trafic actuel |
| `unsupported_operation` | Le fournisseur sélectionné ne prend pas en charge cette opération ; vérifiez sa disponibilité avant de vous y fier |
| La réponse de création est inconnue | Rapprochez l'ID d'exécution enregistré avant de créer une autre instance |
| Le nettoyage échoue | Relancez la suppression pour l'ID d'instance enregistré ; ne relancez pas tout le processus de création |

Les exemples couvrent le flux de base des commandes et fichiers. Les builds de templates, les snapshots, les événements, les webhooks et le réseau avancé nécessitent des vérifications de capacité distinctes. L'installation d'un SDK E2B ne prouve pas à elle seule une compatibilité complète avec chaque fournisseur.

## Références du SDK {#sdk-references}

- [Documentation E2B](https://e2b.dev/docs)
- [SDK JavaScript E2B 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [SDK Python E2B 2.51.0](https://pypi.org/project/e2b/2.51.0/)
