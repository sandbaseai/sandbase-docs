---
i18nSource: 0d7d66842e233794
title: Szybki start z Sandbox i E2B SDK
description: Połącz oficjalne E2B SDK dla JavaScript i Pythona z SandBase, uruchamiaj polecenia, odczytuj i zapisuj pliki oraz bezpiecznie zarządzaj sandboxem.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Szybki start z Sandbox i E2B SDK {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Użyj oficjalnego E2B SDK z kluczem SandBase API, aby utworzyć izolowany sandbox, uruchomić polecenie oraz odczytywać i zapisywać pliki. Ten przewodnik dotyczy **E2B JavaScript i Python SDK 2.51.0**.

Aby tworzyć i obserwować instancje w przeglądarce, zaloguj się do [Sandbox Console](https://www.sandbase.ai/console/sandboxes), utwórz instancję i przeglądaj jej status, logi oraz metryki. Aby zintegrować aplikację, wykonaj poniższe kroki z SDK lub przeczytaj [przegląd produktu Sandbox](https://www.sandbase.ai/sandbox).

## 1. Skonfiguruj oficjalne SDK {#_1-configure-the-official-sdk}

[Utwórz klucz SandBase API w Console](https://www.sandbase.ai/console/keys), a następnie ustaw standardowe zmienne środowiskowe E2B. Oficjalne SDK odczytuje je automatycznie zarówno w JavaScript, jak i w Pythonie.

| Zmienna środowiskowa | Wartość |
|---|---|
| `E2B_API_KEY` | Twój klucz SandBase API z [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Pozostaw nieustawioną, aby SDK używało adresu płaszczyzny danych każdego sandboxa |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Jeśli przechowujesz już klucz w `SANDBASE_API_KEY`, użyj go ponownie:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Potrzebujesz tylko klucza SandBase API. Użyj zwykłego klucza SandBase z dostępem do Sandbox; klucz ograniczony do innej funkcji może zostać odrzucony. Zobacz [Klucze API](/getting-started/api-keys).

### Czy istniejący kod E2B może pozostać bez zmian? {#can-existing-e2b-code-stay-unchanged}

Tak, w przypadku obsługiwanych operacji, jeśli aplikacja już odczytuje ustawienia połączenia SDK ze środowiska, a jej szablon jest dostępny w SandBase. Zachowaj oficjalne SDK i istniejące wywołania; zmień tylko klucz, adres URL API i domenę opisane powyżej. Jawne opcje połączenia w kodzie aplikacji mają pierwszeństwo przed zmiennymi środowiskowymi, więc usuń lub zaktualizuj wszelkie zakodowane na stałe endpointy E2B, domeny i klucze dostawcy.

Ustaw **obie** zmienne `E2B_API_URL` i `E2B_DOMAIN`. Gdy podana jest tylko domena, SDK 2.51.0 wyprowadza host API z dodatkowym prefiksem `api.`. `E2B_SANDBOX_URL` nadpisuje adres poleceń i plików poszczególnych instancji; nie ustawiaj go na adres API sterowania. Tryb debugowania zmienia sposób wyboru adresów przez SDK na potrzeby lokalnego developmentu, więc dla tej usługi HTTPS pozostaw go wyłączonym.

API sterowania tworzy instancje i nimi zarządza. Polecenia, pliki i porty aplikacji używają subdomen poszczególnych instancji w `sandbox.sandbase.ai`. Nie dodawaj prefiksu `/v1` z API modeli. Udane żądanie do API sterowania samo w sobie nie potwierdza dostępu do poleceń i plików ani wszystkich funkcji dostawcy.

Przykłady odczytują zmienne środowiskowe procesu. Plik `.env` działa tylko wtedy, gdy aplikacja lub program uruchamiający wczyta go przed użyciem SDK.

### Wybierz szablon {#choose-a-template}

Użyj klucza SandBase, aby wyświetlić szablony widoczne dla Twojej organizacji:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Wybierz szablon z `buildStatus: "ready"` i skopiuj jego `templateID`. Nazwy wyświetlane znajdują się w `names` lub `aliases`; jeśli oba pola są puste, użyj identyfikatora. Pole `public` odróżnia szablony publiczne od prywatnych szablonów widocznych dla Twojej organizacji.

Odpowiedź jest tablicą. Jeśli nagłówki odpowiedzi zawierają `X-Next-Token`, przekaż jego wartość jako parametr zapytania `nextToken`, aby pobrać następną stronę.

Ustaw identyfikator wybranego szablonu:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` to zmienna używana w poniższych przykładach, a nie wbudowane ustawienie E2B SDK. Przykłady przekazują ją jawnie do `Sandbox.create`. Istniejący kod może zachować swój argument szablonu, jeśli ten identyfikator lub nazwa jest dostępna w SandBase. Nie zakładaj, że dostępny jest identyfikator szablonu z E2B ani domyślny szablon SDK `base`; jeśli lista jest pusta, poproś o dostęp do szablonów dla swojej organizacji.

## 2. Utwórz, wykonaj i posprzątaj {#_2-create-execute-and-clean-up}

Te przykłady tworzą rzeczywisty zasób. Używają dwuminutowego czasu życia i jawnie usuwają instancję w bloku `finally`. Najpierw uruchom jeden przykład i przed ponownym uruchomieniem potwierdź, że sprzątanie się powiodło.

### JavaScript {#javascript}

Użyj Node.js 22 lub nowszego w katalogu aplikacji:

```bash
npm install --save-exact e2b@2.51.0
```

Zapisz jako `sandbox-example.mjs`:

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

Uruchom ze skonfigurowanymi zmiennymi środowiskowymi SDK i wybranym szablonem:

```bash
node sandbox-example.mjs
```

### Python {#python}

Zainstaluj przypiętą wersję SDK w swoim środowisku Python:

```bash
python -m pip install 'e2b==2.51.0'
```

Zapisz jako `sandbox_example.py`:

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

Powodzenie oznacza, że zakończyły się zarówno weryfikacja poleceń i plików, jak i sprzątanie. Identyfikatory uruchomień i sandboxów zachowuj w obrębie organizacji. Nie loguj obiektu SDK: może zawierać tokeny dostępu.

Jeśli tworzenie przekroczy limit czasu bez zwrócenia identyfikatora, zasób może nadal istnieć. Przed utworzeniem kolejnego poproś operatora o jego odnalezienie na podstawie metadanych `quickstartRunId`. Przekroczenie limitu czasu lub przerwanie procesu nie potwierdza usunięcia; blok `finally` nie wykona się po wymuszonym zakończeniu procesu.

## 3. Wydłuż czas życia lub wstrzymaj i połącz ponownie {#_3-extend-the-lifetime-or-pause-and-reconnect}

Wstaw te fragmenty w bloku `try` odpowiedniego przykładu, po sprawdzeniu pliku i przed sprzątaniem. Wstrzymywanie i wznawianie musi być obsługiwane przez wybrany szablon i dostawcę.

JavaScript używa w tych limitach czasu SDK **milisekund**:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python używa **sekund**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Ponowne połączenie zwraca nowy obiekt SDK i nowe poświadczenia sesji. Używaj tego obiektu do kolejnych poleceń i operacji na plikach. Usunięcie sandboxa kończy jego cykl życia; ten przewodnik nie gwarantuje zachowania danych po usunięciu. Czas życia sandboxa i limit czasu pojedynczego polecenia lub żądania HTTP to różne ustawienia.

## 4. Dostęp do portów aplikacji {#_4-access-application-ports}

Gdy aplikacja nasłuchuje już wewnątrz sandboxa, użyj `sandbox.getHost(port)` w JavaScript lub `sandbox.get_host(port)` w Pythonie, aby uzyskać jej host. Ruch do aplikacji wymaga nagłówka `e2b-traffic-access-token` z wartością `sandbox.trafficAccessToken` lub `sandbox.traffic_access_token` z bieżącego połączenia.

Sam host nie autoryzuje dostępu. Klient HTTP lub WebSocket musi wysłać ten nagłówek; zwykłe otwarcie adresu URL w karcie przeglądarki go nie dodaje. Traktuj tokeny ruchu i podpisane adresy URL plików jako poświadczenia i nie umieszczaj ich w logach ani udostępnianych linkach. Dostęp do portów musi być obsługiwany przez wybrane środowisko sandboxa.

## Rozwiązywanie problemów {#troubleshooting}

| Objaw | Co sprawdzić |
|---|---|
| Błąd uwierzytelniania lub zakresu | Ważność klucza SandBase, dostęp organizacji i zakres klucza |
| Nie znaleziono szablonu | Dokładny identyfikator lub nazwę włączonego szablonu i jego widoczność dla organizacji |
| Tworzenie się udaje, ale polecenia lub pliki nie działają | Połączenie sieciowe i bieżące poświadczenia sesji; połącz się ponownie, a jeśli problem nie ustąpi, skontaktuj się z pomocą techniczną |
| Żądania trafiają do niewłaściwej usługi | `E2B_API_URL`, `E2B_DOMAIN` i wszelkie zakodowane na stałe opcje SDK, które je nadpisują |
| Dostęp nie działa po wstrzymaniu | Połącz się ponownie i użyj nowo zwróconego obiektu SDK |
| Port aplikacji odrzuca żądanie | Gotowość aplikacji i nagłówek z bieżącym tokenem ruchu |
| `unsupported_operation` | Wybrany dostawca nie obsługuje tej operacji; sprawdź dostępność, zanim zaczniesz na niej polegać |
| Wynik tworzenia jest nieznany | Przed utworzeniem kolejnej instancji uzgodnij stan na podstawie zapisanego identyfikatora uruchomienia |
| Sprzątanie się nie udaje | Ponów usuwanie dla zapisanego identyfikatora instancji; nie uruchamiaj ponownie całego procesu tworzenia |

Przykłady obejmują podstawowy przepływ pracy z poleceniami i plikami. Budowanie szablonów, migawki, zdarzenia, webhooki i zaawansowane funkcje sieciowe wymagają osobnego sprawdzenia dostępności. Sama instalacja E2B SDK nie dowodzi pełnej zgodności z każdym dostawcą.

## Dokumentacja SDK {#sdk-references}

- [Dokumentacja E2B](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
