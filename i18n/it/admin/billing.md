---
i18nSource: d560e2374d91a8d6
title: Fatturazione e crediti
description: Controlla il saldo dell'organizzazione SandBase, acquista crediti con Stripe o Airwallex, configura la ricarica automatica, riscatta coupon e comprendi i controlli di spesa delle chiavi API.
---

# Fatturazione e crediti {#billing-and-credits}

Questa pagina descrive la gestione della fatturazione nella [SandBase Console](https://www.sandbase.ai/console). Per tariffe e ottimizzazione dei costi, vedi [Prezzi](/guides/billing).

SandBase addebita i carichi di lavoro supportati sul saldo dell'organizzazione. Prezzi correnti, offerte, provider di pagamento,
importi minimi di ricarica e disponibilità regionale sono indicati nella Console e possono cambiare indipendentemente da questa
guida.

## Saldo {#balance}

Apri [Developer → Billing](https://www.sandbase.ai/console/billing). La pagina **Credits** mostra, per l'organizzazione attiva:

| Voce | Significato |
|------|---------------|
| **Available balance** | Pronto all'uso su Models e API |
| **Credit limit** | Margine di spesa del workspace |
| **Current level** | Il livello dell'account e la relativa concorrenza |

Lo stesso saldo compare nella scheda **Balance** della Dashboard della Console e nell'intestazione del sito quando hai effettuato l'accesso.
Considera la Console come fonte autorevole per promozioni e condizioni di checkout; non automatizzare le sue richieste di rete
interne.

## Acquistare crediti {#buy-credits}

1. Apri [Billing](https://www.sandbase.ai/console/billing) e verifica che **Credits go to** mostri il workspace che vuoi ricaricare.
2. In **Buy credits**, scegli un importo predefinito o inserisci un **Custom amount** in USD. La ricarica minima è indicata nella pagina.
3. Se è disponibile più di un **Payment provider**, scegli **Stripe** (carte e wallet globali) o **Airwallex** (carte e metodi di pagamento locali).
4. Controlla **Pay**, **Bonus** e **Receive** nell'anteprima, poi seleziona **Continue with Stripe** (o il provider che hai scelto) e completa il checkout ospitato.
5. Verifica il saldo aggiornato in **Credit transactions** prima di avviare un carico di lavoro sensibile ai costi.

SandBase non memorizza mai i dati delle carte; la pagina di pagamento è ospitata dal provider.

### Bonus sulla prima ricarica {#first-top-up-bonus}

Se l'account e il workspace non hanno mai effettuato una ricarica, **Current offers** mostra un bonus sulla prima ricarica. La pagina indica
la percentuale del bonus e il relativo tetto massimo. Si applica un solo bonus per account e per workspace, e i rimborsi recuperano il bonus
in proporzione. Il bonus compare come riga separata in **Credit transactions**.

## Ricarica automatica {#auto-top-up}

**Auto Top-up** ricarica il saldo con una carta salvata quando scende sotto una soglia. Al momento supporta solo Stripe
e solo i proprietari e gli amministratori del workspace possono gestirla.

1. In **Payment cards**, seleziona **Add Card** e salva una carta in Stripe.
2. Seleziona **Turn on auto top-up**, poi imposta **When balance goes below**, **Top-up amount**, un **Monthly limit** facoltativo e la carta.
3. Spunta **I authorize these automatic charges** e conferma.

Una volta raggiunto il limite mensile, la ricarica automatica si interrompe per il resto del mese solare (UTC). Gli addebiti automatici
compaiono in **Credit transactions** con il canale `Auto top-up · Stripe`.

## Riscattare un coupon {#redeem-a-coupon}

Inserisci il **Coupon code** in **Redeem a coupon**, poi seleziona **Redeem credit**. Un coupon si applica solo al workspace
attivo, quindi verifica prima l'organizzazione selezionata.

## Controlli di spesa {#spending-controls}

| Controllo | Ambito | Comportamento |
|---------|-------|----------|
| Limite di copertura dell'organizzazione | Intera organizzazione | Saldo disponibile più l'eventuale limite di credito configurato; una richiesta non coperta può restituire HTTP 402 |
| Limite di spesa della chiave | Per chiave API | Tetto facoltativo per chiave, limitato dal saldo dell'organizzazione |
| Limite mensile della ricarica automatica | Intera organizzazione | Limita gli addebiti automatici per mese solare (UTC) |

Per impostare un limite di spesa per chiave, vedi [Chiavi API](/getting-started/api-keys).

## Attività e analisi {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) ha due schede:

- **Request History** elenca le singole richieste con chiave API, modello, stato, latenza e costo.
- **Usage** mostra richieste e costi su 7 o 30 giorni, **Model APIs by Archived Spend** e **Billing Records**. Entrambe le tabelle offrono **Export CSV**. L'esportazione dei record di fatturazione include una colonna **Free Quota** che indica le chiamate coperte dalla quota gratuita giornaliera.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) aggiunge **Overview**, **Cost analysis** e
**Health diagnostics** per gli ultimi 7 o 30 giorni UTC completi.

Per i prezzi pubblici e i contratti sui costi delle attività, vedi [Prezzi e utilizzo](/guides/billing) e
[Ottieni costo dell'attività](/api-reference/tasks/cost).
