---
i18nSource: adfacb669489863e
title: Account e fatturazione
description: Gestisci l'organizzazione SandBase, le API key, la fatturazione, l'utilizzo e i limiti.
---

# Account e fatturazione {#account-and-billing}

Le impostazioni della tua organizzazione determinano a chi è intestato l'utilizzo, come si autenticano le applicazioni e come viene monitorata la spesa.

## Cosa gestisci {#what-you-manage}

| Area | A cosa serve |
|---|---|
| [Organizzazioni](/admin/organizations) | Gestire il perimetro del workspace, i membri e la proprietà |
| [API Key](/getting-started/api-keys) | Creare, ruotare e revocare le credenziali delle applicazioni |
| [Fatturazione e crediti](/admin/billing) | Controllare il saldo, acquistare crediti, configurare la ricarica automatica e analizzare l'utilizzo in Activities e Analysis |
| [Prezzi e utilizzo](/guides/billing) | Consultare i prezzi dei modelli, le chiamate API gratuite giornaliere e il costo di un singolo task |
| [Limiti di frequenza](/guides/rate-limiting) | Capire i limiti delle richieste e come gestire i retry in modo sicuro |

## Configurazione consigliata {#recommended-setup}

1. Verifica di lavorare nell'organizzazione corretta.
2. Crea API key separate per sviluppo, staging e produzione.
3. Dai alle chiavi il nome dell'applicazione e dell'ambiente.
4. Controlla Activities e la fatturazione dopo le prime richieste in produzione.
5. Revoca le chiavi inutilizzate e indaga subito su eventuali utilizzi imprevisti.

## Proprietà e accesso {#ownership-and-access}

Le API key e l'utilizzo appartengono a un'organizzazione. Cambiando organizzazione cambiano le risorse, le chiavi e il contesto di fatturazione visibili nella Console. Prima di modificare la configurazione di produzione, verifica l'organizzazione selezionata e coordina la rotazione delle chiavi con le applicazioni che le usano.

## Sicurezza di base {#security-basics}

- conserva le chiavi in variabili d'ambiente o in un secrets manager
- non incollare mai le chiavi nelle istruzioni dell'Agent, nel codice sorgente, negli screenshot o nei messaggi al supporto
- usa una chiave separata per ogni applicazione e ambiente
- revoca subito una chiave se potrebbe essere stata esposta
- monitora Activities per individuare volumi, modelli o endpoint imprevisti
