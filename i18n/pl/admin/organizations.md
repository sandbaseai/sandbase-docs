---
i18nSource: 258f8ff4bb1ed96f
title: Organizacje
description: Zarządzaj organizacjami, członkami i rolami w SandBase.
---

# Organizacje {#organizations}

Organizacje są w SandBase jednostką rozliczeń i kontroli dostępu. Klucze API, saldo, zużycie i członkowie należą do organizacji.

## Typy organizacji {#organization-types}

| Typ | Opis |
|------|-------------|
| **Personal** | Tworzona automatycznie przy pierwszym logowaniu. Jedna na użytkownika. |
| **Team** | Tworzona ręcznie. Wielu członków z rolami. |

## Role członków {#member-roles}

| Rola | Uprawnienia |
|------|-------------|
| **Owner** | Pełny dostęp do przestrzeni roboczej, w tym zmiana ról członków. |
| **Admin** | Zarządzanie kluczami i rozliczeniami oraz dodawanie i usuwanie członków niebędących właścicielami. |
| **Member** | Korzystanie z przestrzeni roboczej i jej kluczy API bez dostępu do zarządzania członkami. |

## Tworzenie organizacji zespołowej {#create-a-team-organization}

1. Otwórz menu konta w prawym górnym rogu Console.
2. Wybierz **Create Team** lub otwórz **Developer → Team** i wybierz **Create team**.
3. Wpisz **Team name**, a następnie wybierz **Create team**.
4. Wybierz **Add member**, wpisz **Account email** istniejącego konta SandBase i wybierz **Workspace role**: **Member** lub **Admin**.

Dodawany członek musi mieć już konto SandBase. Właściciele mogą zmieniać role członków; właściciele i administratorzy mogą usuwać
członków niebędących właścicielami.

## Przełączanie organizacji {#switch-organizations}

Jeśli należysz do kilku organizacji, przełączaj się między nimi w menu konta albo za pomocą paska **Switch workspace** w **Developer → Team**. Klucze API i rozliczenia dotyczą aktywnej organizacji.

## Saldo i rozliczenia {#balance-and-billing}

Każda organizacja ma własne saldo. Wywołania modeli, wywołania API, sesje Agent i praca środowiska wykonawczego są obciążane z tego salda. Szczegóły znajdziesz w sekcji [Rozliczenia](/admin/billing).
