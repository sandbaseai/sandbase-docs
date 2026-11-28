---
i18nSource: a86346e2696c732c
title: FAQ
description: Najczęstsze pytania o łączenie narzędzi AI, katalog SandBase, Models, APIs, Agents, Sessions i rozliczenia.
---

# Najczęściej zadawane pytania {#frequently-asked-questions}

## Czym jest SandBase? {#what-is-sandbase}

SandBase pomaga Agents łączyć się z prawdziwym światem.

Możesz korzystać z gotowych Models i APIs, używać ich w swoich narzędziach AI po połączeniu ich w sekcji AI tools albo budować Agents wielokrotnego użytku i uruchamiać je w Sessions.

## Dla kogo jest SandBase? {#who-is-sandbase-for}

SandBase jest przeznaczony głównie dla trzech grup:

- **użytkowników narzędzi AI**, którzy chcą mieć przydatne możliwości w Codex, Claude, Cursor lub Kiro
- **twórców**, którzy chcą bezpośrednio wywoływać Models i APIs
- **FDE i zespołów**, które budują Agents wielokrotnego użytku dla klientów lub wewnętrznych procesów

## Gdzie mogę przeglądać możliwości? {#where-do-i-browse-capabilities}
Katalog możliwości znajduje się na stronie SandBase:

- [Models](https://www.sandbase.ai/models) i [modele obrazów i wideo](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
W zależności od rodzaju możliwości możesz ją sprawdzić, przetestować, zainstalować, wywołać lub sklonować.

## Czym jest AI tools? {#what-is-ai-tools}

**Build → AI tools** w Console łączy SandBase z narzędziem AI, którego już używasz, np. Claude Code, Codex, Cursor lub Kiro. Wklej `set up https://www.sandbase.ai/SKILL.md` do swojego agenta albo uruchom `npx -y @sandbaseai/cli@latest connect`. Połączone narzędzie może wyszukiwać i uruchamiać Models i APIs z katalogu SandBase, a opłaty są naliczane na Twój obszar roboczy. Zobacz [Łączenie narzędzi AI](/setup/).

## Czym jest Build Agent? {#what-is-build-agent}

Build Agent to miejsce, w którym definiujesz i testujesz Agenta.

Agent łączy instrukcje, Model, Skills i narzędzia MCP w jeden wielokrotnego użytku, wersjonowany przepływ pracy.

## Czy Agent różni się od API? {#is-an-agent-different-from-an-api}
Tak. Agent to wersjonowana konfiguracja, którą edytujesz i testujesz, a uruchamiasz ją, tworząc Session. Twoja aplikacja może tworzyć Sessions za pomocą [Sessions API](/api-reference/sessions/), podczas gdy Ty nadal edytujesz Agenta.

## Czym są Sessions? {#what-are-sessions}
Session to jedno wykonanie Agenta wraz z rozmową, aktywnością narzędzi i wynikiem.

## Jak dać Agentowi dostęp do zewnętrznych API? {#how-do-i-give-an-agent-access-to-external-apis}

Podłącz zewnętrzny system jako serwer MCP i dodaj go do połączeń MCP Agenta. Jeśli serwer wymaga tokena Bearer, zapisz go za pomocą [Secrets API](/agents/api-credentials#with-the-api) jako Secret tylko do zapisu, powiązany z URL tego serwera. Tokeny są wysyłane wyłącznie do tego serwera i nigdy nie pojawiają się w promptach ani w środowisku wykonawczym Agenta. Zobacz [Poświadczenia dla narzędzi MCP](/agents/api-credentials).

## Gdzie znajdują się Models? {#where-do-models-live}

Models mają własny [katalog](https://www.sandbase.ai/models), ponieważ są ważnymi elementami składowymi.

Model możesz wywołać bezpośrednio, użyć go z połączonego narzędzia AI lub w Agencie.

## Czy muszę pisać kod? {#do-i-need-to-write-code}

Nie zawsze.

[Połącz swoje narzędzie AI](/setup/), jeśli chcesz mieć w nim nowe możliwości bez pisania kodu.

Użyj API Reference, jeśli chcesz wywoływać SandBase z własnej aplikacji.

Użyj Build Agent, jeśli potrzebujesz wieloetapowej pracy wielokrotnego użytku.

## Jak uzyskać klucz API? {#how-do-i-get-an-api-key}

Otwórz Console, przejdź do **Developer → API Keys** i wybierz **New key**.

Używaj klucza w następujący sposób:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Jak działają rozliczenia? {#how-does-billing-work}

SandBase korzysta z kredytów i rozliczeń na podstawie użycia.

Models, APIs, Agents i praca środowiska wykonawczego mogą mieć różne koszty. Aktualne użycie i ceny sprawdzisz w Console.

## Następne kroki {#next-steps}

- [Pierwsze kroki](/getting-started/)
- [Katalog Models i APIs](https://www.sandbase.ai/models)
- [Łączenie narzędzi AI](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
