---
i18nSource: 258f8ff4bb1ed96f
title: Organizzazioni
description: Gestisci organizzazioni, membri e ruoli su SandBase.
---

# Organizzazioni {#organizations}

Le organizzazioni sono l'unità di fatturazione e di controllo degli accessi in SandBase. Chiavi API, saldo, utilizzo e membri appartengono tutti a un'organizzazione.

## Tipi di organizzazione {#organization-types}

| Tipo | Descrizione |
|------|-------------|
| **Personale** | Creata automaticamente al primo accesso. Una per utente. |
| **Team** | Creata manualmente. Più membri con ruoli diversi. |

## Ruoli dei membri {#member-roles}

| Ruolo | Permessi |
|------|-------------|
| **Owner** | Accesso completo al workspace, inclusa la modifica dei ruoli dei membri. |
| **Admin** | Gestisce chiavi e fatturazione, e aggiunge o rimuove i membri che non sono owner. |
| **Member** | Usa il workspace e le sue chiavi API senza accesso alla gestione dei membri. |

## Creare un'organizzazione Team {#create-a-team-organization}

1. Apri il menu dell'account in alto a destra nella Console.
2. Scegli **Create Team**, oppure apri **Developer → Team** e seleziona **Create team**.
3. Inserisci un **Team name**, poi seleziona **Create team**.
4. Seleziona **Add member**, inserisci l'**Account email** di un account SandBase esistente e scegli un **Workspace role**: **Member** o **Admin**.

Un membro aggiunto deve avere già un account SandBase. Gli owner possono modificare i ruoli dei membri; owner e admin possono rimuovere
i membri che non sono owner.

## Cambiare organizzazione {#switch-organizations}

Se appartieni a più organizzazioni, passa dall'una all'altra dal menu dell'account, oppure usa la barra **Switch workspace** in **Developer → Team**. Le tue chiavi API e la fatturazione si riferiscono all'organizzazione attiva.

## Saldo e fatturazione {#balance-and-billing}

Ogni organizzazione ha il proprio saldo. Chiamate ai modelli, chiamate API, Session degli Agent e lavoro di runtime vengono addebitati su questo saldo. Per i dettagli vedi [Fatturazione](/admin/billing).
