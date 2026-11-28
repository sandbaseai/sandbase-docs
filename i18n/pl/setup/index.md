---
i18nSource: 28b1ef75a197824a
title: Łączenie narzędzi AI
description: Udostępnij Claude Code, Codex, Cursor, Kiro i innym narzędziom AI katalog Models i APIs SandBase za pomocą jednego promptu lub jednego polecenia CLI.
---

# Łączenie narzędzi AI {#connect-ai-tools}

Strona [AI tools](https://www.sandbase.ai/console/setup) w Console (**Build → AI tools**) łączy SandBase z agentem lub narzędziem AI, którego już używasz. Połączone narzędzia mogą przeszukiwać katalog Models i APIs SandBase, odczytywać schemat wejścia i cenę każdego narzędzia oraz je uruchamiać. Każde wywołanie jest rozliczane na aktywny obszar roboczy.

Obsługiwane klienty to między innymi Claude Code, Codex, Cursor, Kiro IDE i Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop i ChatGPT. Aktualną listę znajdziesz na stronie AI tools.

## Szybki start: wklej jeden prompt {#quick-start-paste-one-prompt}

Wklej ten wiersz do swojego agenta:

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent odczytuje Skill SandBase, instaluje CLI i prosi Cię o zatwierdzenie jednego logowania w przeglądarce. Nie wklejasz klucza API. Gdy agent zgłosi, że klient jest skonfigurowany, rozpocznij nową sesję lub uruchom aplikację ponownie, aby załadowały się narzędzia `sandbase_*`.

Skill wymaga Node.js 20 lub nowszego na maszynie, na której działa agent.

## Inne sposoby połączenia {#other-ways-to-connect}

### CLI {#cli}

Połącz się z terminala. Bez `--client` CLI konfiguruje każdy znaleziony obsługiwany klient:

```sh
npx -y @sandbaseai/cli@latest connect
```

Aby skonfigurować jeden klient, przekaż jego identyfikator, na przykład `codex`, `claude-code`, `cursor` lub `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Skrypt instalacyjny uruchamia to samo polecenie:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Aby wyświetlić klienty rozpoznawane przez instalator bez zmieniania lokalnej konfiguracji:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` otwiera autoryzację w przeglądarce, tworzy klucz **CLI Login** dla zatwierdzonego obszaru roboczego i zapisuje wyłącznie konfigurację klienta należącą do SandBase. Każdy klient jest opisany w dokumentacji open source [SandBase CLI](https://github.com/sandbaseai/cli).

### Klienty MCP konfigurowane ręcznie {#mcp-clients-you-configure-by-hand}

Zalogowani użytkownicy widzą adres serwera MCP w sekcji **Other ways to connect** na stronie [AI tools](https://www.sandbase.ai/console/setup). Uwierzytelnij go [kluczem API](/getting-started/api-keys) z **Developer → API Keys** i przechowuj klucz w konfiguracji sekretów klienta.

## Weryfikacja połączenia {#verify-the-connection}

Sama instalacja lub autoryzacja nie dowodzi, że klient jest połączony. Sprawdź, czy:

- serwer lub konektor SandBase jest widoczny w kliencie
- narzędzia `sandbase_*` są wykrywane w nowej sesji
- jedno bezpieczne żądanie w języku naturalnym kończy się powodzeniem

W przypadku klientów zarządzanych przez CLI uruchom diagnostykę po ponownym połączeniu lub zmianie konfiguracji:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` sprawdza lokalne poświadczenie, wpis MCP i Skill, a następnie wykonuje jedno żądanie do SandBase i z powrotem. Ostatnie wywołanie narzędzia zawsze wykonuj w samym kliencie.

Uruchomienia wykonane przez połączone narzędzia pojawiają się w [Activities](https://www.sandbase.ai/console/activities) wraz z kosztem.

## Rozwiązywanie problemów {#troubleshooting}

| Problem | Co sprawdzić |
|---|---|
| Narzędzia się nie pojawiają | Rozpocznij nową sesję klienta lub uruchom aplikację ponownie, wykonaj `npx -y @sandbaseai/cli doctor --client <client>` i spróbuj ponownie. |
| Brak autoryzacji | Uruchom ponownie `connect` i zatwierdź logowanie w przeglądarce dla obszaru roboczego, który ma być obciążany. |
| Wywołania kończą się błędem HTTP 402 | Dodaj kredyty w [Billing](https://www.sandbase.ai/console/billing) dla aktywnego obszaru roboczego. |

## Usuwanie zarządzanej konfiguracji {#remove-the-managed-configuration}

Usuń tylko wpis należący do SandBase dla jednego klienta:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

Polecenie usuwa tylko konfigurację, której przynależność do SandBase może zweryfikować, i pozostawia bez zmian niepowiązane wpisy oraz wpisy zarządzane przez użytkownika. Następnie, jeśli nie jest Ci już potrzebny, unieważnij odpowiedni klucz **CLI Login** w **Developer → API Keys**.

## Kod źródłowy i pomoc {#source-and-support}

- [Kod źródłowy](https://github.com/sandbaseai/cli)
- [Pakiet npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Pytania i przykłady](https://github.com/sandbaseai/cli/discussions)
- [Zgłaszanie błędów](https://github.com/sandbaseai/cli/issues/new/choose)

## Następne kroki {#next-steps}

- [Katalog Models i APIs](https://www.sandbase.ai/models)
- [Samouczki Skills](/guides/skills/)
- [Tworzenie Agenta](/agents/)
