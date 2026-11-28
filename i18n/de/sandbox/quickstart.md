---
i18nSource: 0d7d66842e233794
title: Sandbox-Schnellstart mit dem E2B SDK
description: Verbinde die offiziellen E2B SDKs für JavaScript und Python mit SandBase, führe Befehle aus, lies und schreibe Dateien und verwalte eine Sandbox sicher.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Sandbox-Schnellstart mit dem E2B SDK {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Verwende das offizielle E2B SDK mit deinem SandBase-API-Key, um eine isolierte Sandbox zu erstellen, einen Befehl auszuführen und Dateien zu lesen und zu schreiben. Diese Anleitung bezieht sich auf **E2B JavaScript and Python SDK 2.51.0**.

Zum Erstellen und Beobachten im Browser meldest du dich in der [Sandbox Console](https://www.sandbase.ai/console/sandboxes) an, erstellst eine Instanz und siehst ihren Status, ihre Logs und Metriken. Für die Integration in Anwendungen folgst du den SDK-Schritten unten, oder du liest die [Sandbox-Produktübersicht](https://www.sandbase.ai/sandbox).

## 1. Offizielles SDK konfigurieren {#_1-configure-the-official-sdk}

[Erstelle in der Console einen SandBase-API-Key](https://www.sandbase.ai/console/keys) und konfiguriere dann die standardmäßigen E2B-Umgebungsvariablen. Das offizielle SDK liest sie in JavaScript und Python automatisch.

| Umgebungsvariable | Wert |
|---|---|
| `E2B_API_KEY` | Dein SandBase-API-Key aus [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Nicht setzen, damit das SDK die Data-Plane-Adresse der jeweiligen Sandbox verwendet |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Wenn du den Key bereits in `SANDBASE_API_KEY` speicherst, verwende ihn wieder:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Du benötigst nur deinen SandBase-API-Key. Verwende einen regulären SandBase-Key mit Sandbox-Zugriff; ein Key, der auf eine andere Fähigkeit beschränkt ist, kann abgelehnt werden. Siehe [API-Keys](/getting-started/api-keys).

### Kann bestehender E2B-Code unverändert bleiben? {#can-existing-e2b-code-stay-unchanged}

Ja, für unterstützte Operationen, sofern deine Anwendung die SDK-Verbindungseinstellungen bereits aus der Umgebung liest und ihr Template auf SandBase verfügbar ist. Behalte das offizielle SDK und deine bestehenden Aufrufe bei; ändere nur Key, API-URL und Domain wie oben. Explizite Verbindungsoptionen im Anwendungscode haben Vorrang vor Umgebungsvariablen, entferne oder aktualisiere also fest codierte E2B-Endpoints, Domains oder Anbieter-Keys.

Setze **beide**, `E2B_API_URL` und `E2B_DOMAIN`. Mit nur einer Domain leitet SDK 2.51.0 einen API-Host mit einem zusätzlichen Präfix `api.` ab. `E2B_SANDBOX_URL` überschreibt die Befehls-/Dateiadresse pro Instanz; setze sie nicht auf den Origin der Control API. Der Debug-Modus ändert die Adresswahl des SDK für die lokale Entwicklung, lass ihn für diesen HTTPS-Dienst also deaktiviert.

Die Control API erstellt und verwaltet Instanzen. Befehle, Dateien und Anwendungsports nutzen Subdomains pro Instanz unter `sandbox.sandbase.ai`. Hänge nicht das Präfix `/v1` der Modell-API an. Eine erfolgreiche Anfrage an die Control API allein bestätigt weder den Befehls-/Dateizugriff noch alle Anbieterfunktionen.

Die Beispiele lesen Umgebungsvariablen des Prozesses. Eine `.env`-Datei funktioniert nur, wenn deine Anwendung oder dein Launcher sie lädt, bevor das SDK verwendet wird.

### Template auswählen {#choose-a-template}

Liste mit deinem SandBase-Key die Templates auf, die für deine Organisation sichtbar sind:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Wähle ein Template mit `buildStatus: "ready"` und kopiere seine `templateID`. Anzeigenamen stehen in `names` oder `aliases`; sind beide leer, verwende die ID. Das Feld `public` unterscheidet öffentliche Templates von privaten, die für deine Organisation sichtbar sind.

Die Antwort ist ein Array. Enthalten die Response-Header `X-Next-Token`, übergib dessen Wert als Query-Parameter `nextToken`, um die nächste Seite abzurufen.

Setze die ausgewählte Template-ID:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` ist eine Variable der folgenden Beispiele, keine integrierte Einstellung des E2B SDK. Die Beispiele übergeben sie explizit an `Sandbox.create`. Bestehender Code kann sein Template-Argument behalten, wenn diese ID oder dieser Name auf SandBase verfügbar ist. Geh nicht davon aus, dass eine Upstream-E2B-Template-ID oder der SDK-Standard `base` verfügbar ist; ist die Liste leer, beantrage Template-Zugriff für deine Organisation.

## 2. Erstellen, ausführen und aufräumen {#_2-create-execute-and-clean-up}

Diese Beispiele erstellen eine echte Ressource. Sie verwenden eine Lebensdauer von zwei Minuten und löschen die Instanz explizit in `finally`. Führe zuerst ein Beispiel aus und bestätige das Aufräumen, bevor du es erneut ausführst.

### JavaScript {#javascript}

Verwende Node.js 22 oder neuer in einem Anwendungsverzeichnis:

```bash
npm install --save-exact e2b@2.51.0
```

Speichere als `sandbox-example.mjs`:

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

Führe es mit konfigurierten SDK-Umgebungsvariablen und ausgewähltem Template aus:

```bash
node sandbox-example.mjs
```

### Python {#python}

Installiere das festgelegte SDK in deiner Python-Umgebung:

```bash
python -m pip install 'e2b==2.51.0'
```

Speichere als `sandbox_example.py`:

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

Erfolg bedeutet, dass sowohl die Befehls-/Dateiprüfung als auch das Aufräumen abgeschlossen wurden. Behalte Run- und Sandbox-IDs innerhalb deiner Organisation. Protokolliere das SDK-Objekt nicht: Es kann Access-Tokens enthalten.

Läuft die Erstellung ohne ID in einen Timeout, kann die Ressource trotzdem existieren. Bitte deinen Operator, sie anhand der Metadaten `quickstartRunId` zu finden, bevor du eine weitere erstellst. Ein Timeout oder ein unterbrochener Prozess bestätigt keine Löschung; `finally` kann nach einem erzwungenen Prozessabbruch nicht ausgeführt werden.

## 3. Lebensdauer verlängern oder pausieren und neu verbinden {#_3-extend-the-lifetime-or-pause-and-reconnect}

Füge diese Snippets im `try`-Block des jeweiligen Beispiels nach der Dateiprüfung und vor dem Aufräumen ein. Pause/Resume muss vom ausgewählten Template und Anbieter unterstützt werden.

JavaScript verwendet für diese SDK-Timeouts **Millisekunden**:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python verwendet **Sekunden**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Beim Neuverbinden erhältst du ein neues SDK-Objekt und neue Session-Zugangsdaten. Verwende dieses Objekt für weitere Befehle und Dateien. Das Löschen einer Sandbox beendet ihren Lebenszyklus; diese Anleitung sichert keine Speicherpersistenz nach dem Löschen zu. Die Lebensdauer der Sandbox und der Timeout für einen einzelnen Befehl oder eine HTTP-Anfrage sind unterschiedliche Einstellungen.

## 4. Auf Anwendungsports zugreifen {#_4-access-application-ports}

Sobald deine Anwendung innerhalb der Sandbox lauscht, ermittelst du ihren Host mit `sandbox.getHost(port)` in JavaScript oder `sandbox.get_host(port)` in Python. Anwendungsverkehr erfordert den Header `e2b-traffic-access-token` mit `sandbox.trafficAccessToken` bzw. `sandbox.traffic_access_token` aus der aktuellen Verbindung.

Der Host allein berechtigt nicht zum Zugriff. Dein HTTP- oder WebSocket-Client muss den Header senden; wenn du die URL einfach in einem Browser-Tab öffnest, wird er nicht hinzugefügt. Behandle Traffic-Tokens und signierte Datei-URLs als Zugangsdaten und halte sie aus Logs und geteilten Links heraus. Der Portzugriff muss von der ausgewählten Sandbox-Umgebung unterstützt werden.

## Fehlerbehebung {#troubleshooting}

| Symptom | Was du prüfen solltest |
|---|---|
| Authentifizierungs- oder Scope-Fehler | Gültigkeit des SandBase-Keys, Zugriff der Organisation und Scope des Keys |
| Template nicht gefunden | Die exakte aktivierte Template-ID bzw. der Name und die Sichtbarkeit für deine Organisation |
| Erstellen klappt, Befehle/Dateien schlagen fehl | Deine Netzwerkverbindung und die aktuellen Session-Zugangsdaten; verbinde dich neu und kontaktiere den Support, wenn das Problem bleibt |
| Anfragen gehen an den falschen Dienst | `E2B_API_URL`, `E2B_DOMAIN` und fest codierte SDK-Optionen, die sie überschreiben |
| Zugriff schlägt nach Pause fehl | Neu verbinden und das neu zurückgegebene SDK-Objekt verwenden |
| Anwendungsport lehnt eine Anfrage ab | Bereitschaft der Anwendung und der aktuelle Traffic-Token-Header |
| `unsupported_operation` | Der ausgewählte Anbieter unterstützt diese Operation nicht; prüfe die Verfügbarkeit, bevor du dich darauf verlässt |
| Antwort auf das Erstellen ist unbekannt | Gleiche die protokollierte Run-ID ab, bevor du eine weitere Instanz erstellst |
| Aufräumen schlägt fehl | Löschen für die protokollierte Instanz-ID wiederholen; nicht den gesamten Erstellungsablauf erneut ausführen |

Die Beispiele decken den grundlegenden Befehls-/Datei-Workflow ab. Template-Builds, Snapshots, Events, Webhooks und erweitertes Networking erfordern separate Prüfungen der Fähigkeiten. Die Installation eines E2B SDK allein belegt keine vollständige Kompatibilität mit jedem Anbieter.

## SDK-Referenzen {#sdk-references}

- [E2B-Dokumentation](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
