---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (sperimentale)
description: Prova sandbox SandBase reali con la tua API key. Creale, esegui comandi, verifica i file dopo la pausa e la ripresa e controlla gli eventi del ciclo di vita.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Prova la Sandbox API con la tua chiave. Le operazioni si collegano a **sandbox.sandbase.ai** e possono comportare costi.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## La tua chiave resta sotto il tuo controllo {#your-key-stays-under-your-control}

- **Solo nella memoria della pagina.** Questo Playground non salva la tua API key né i token di connessione nello storage del browser o nei cookie, non li inserisce negli URL e non li registra nell'attività della pagina o negli esempi di richiesta.
- **Cancellabile in qualsiasi momento.** Seleziona **Clear key** per rimuovere la chiave, i token di connessione e l'attività visualizzata, anche mentre una richiesta è in corso. Anche aggiornare o lasciare questa pagina li cancella. Per riconnetterti dovrai inserire di nuovo la chiave.
- **Usata solo per le tue richieste.** La tua chiave viene trasmessa a SandBase per autenticare le operazioni Sandbox che richiedi. Cancellare questa pagina non revoca la chiave; se necessario, revocala in [Developer → API Keys](https://www.sandbase.ai/console/keys).

Questi impegni riguardano il modo in cui questo Playground gestisce le credenziali. Non significano che l'attività della Sandbox o i registri di utilizzo lato servizio vengano cancellati. Evita di inserire secret in comandi o file, il cui contenuto può restare nella tua sandbox.

## Pulisci le risorse separatamente {#clean-up-resources-separately}

Cancellare la chiave non annulla un'operazione già ricevuta dal servizio né elimina una sandbox. Elimina le istanze quando hai finito. Se l'esito di una creazione è incerto, controlla le tue istanze prima di crearne un'altra. Prima di cancellare questa pagina, annota gli ID delle istanze che ti servono per la pulizia.

[Panoramica e funzionalità](./index) · [Quickstart / SDK E2B](./quickstart)
