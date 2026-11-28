---
i18nSource: 91c5a0d1b6de6434
title: Prezzi e utilizzo
description: Trova i prezzi attuali dei modelli, controlla i costi dei task e gestisci la fatturazione di SandBase in sicurezza.
---

# Prezzi e utilizzo {#pricing-and-usage}

SandBase usa una fatturazione a consumo. Disponibilità dei modelli, formule di prezzo, moltiplicatori della cache e addebiti specifici
delle funzionalità possono cambiare in modo indipendente, quindi le integrazioni dovrebbero leggere i metadati in tempo reale invece di affidarsi a tabelle
dei prezzi copiate.

## Chiamate API gratuite giornaliere {#daily-free-api-calls}

Ogni organizzazione riceve 100 chiamate gratuite alle API di dati (ricerca, social, scraping, e-commerce, finanza) per giorno UTC. La
quota è condivisa da tutte le API di dati idonee e da tutte le chiavi dell'organizzazione, e si azzera alle 00:00 UTC. LLM e
modelli multimediali non sono idonei. Anche alcune API di dati non lo sono: quelle più costose o con prezzo a formula, come alcuni
endpoint batch, gli endpoint di crawl, Xiaohongshu PGY e le route `kol-*` di Douyin Xingtu, vengono addebitate dalla prima chiamata.
Per verificare un tool, esegui `sandbase_inspect`: i tool idonei hanno `pricing.free_quota`, mentre quelli che non lo hanno vengono sempre
addebitati.

- Le chiamate entro la quota non vengono addebitate e un'organizzazione con saldo zero può comunque usarle.
- Dopo la centesima chiamata, le chiamate idonee continuano a funzionare e vengono addebitate per chiamata al prezzo indicato dal tool. Non vengono
  rifiutate né limitate in frequenza perché la quota è esaurita.
- Le chiamate non usate non si accumulano per il giorno successivo.

Nei [tool MCP di SandBase](/setup/), `sandbase_inspect` contrassegna i tool idonei con `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` restituisce la quota del giorno come `free_api_quota` con
`daily_limit`, `used_today`, `remaining` e `resets_at`; `used_today` e `remaining` vengono omessi quando il conteggio è
temporaneamente non disponibile. Dopo l'addebito di un'esecuzione, `sandbase_run` e `sandbase_run_get` riportano `free_quota_status`:
`free` (coperta dalla quota), `overage` (addebitata dopo l'esaurimento della quota) o `degraded` (non addebitata
perché il conteggio della quota non era disponibile).

## Gestire la fatturazione nella Console {#manage-billing-in-the-console}

Usa **Developer → Billing** per vedere il saldo, acquistare crediti, configurare la ricarica automatica, riscattare coupon e gestire le impostazioni di fatturazione disponibili per la tua
organizzazione. Apri **Developer → Activities → Usage** per i riepiloghi di richieste, token e costi a livello di organizzazione.

::: info Confini dell'API pubblica
Gli endpoint di saldo, ricarica, esportazione della fatturazione e utilizzo a livello di organizzazione non fanno attualmente parte dell'API
pubblica supportata. Non automatizzare le richieste di rete della Console e non dipendere dalle route interne della Console.
:::

## Leggere i prezzi attuali dei modelli {#read-current-model-pricing}

Per prima cosa individua un modello abilitato:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Poi richiedi la sua scheda completa:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

L'endpoint di elenco è ottimizzato per la scoperta e omette di proposito i prezzi dettagliati di token, cache e reasoning.
Leggi i prezzi dettagliati del modello selezionato da `model_card` nella risposta di dettaglio. Non esiste una formula universale
valida per ogni LLM, modello multimediale, modello di embedding o funzionalità API.

## Verificare il costo registrato di un task {#check-one-task-s-recorded-cost}

Quando un'operazione restituisce un ID di task, interroga il suo record di addebito:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

La risposta distingue il `cost` corrente da `estimated_cost` e indica se l'addebito è definitivo. Non
usare `cost` per la riconciliazione della fatturazione finché `settled` non è `true`. I record dei task sono dati di consultazione operativa e non
un registro contabile. Per la riconciliazione e lo storico a lungo termine usa i record di fatturazione e le esportazioni CSV disponibili in **Developer → Activities → Usage**.

## Buone pratiche per il controllo dei costi {#cost-control-practices}

- Recupera la scheda del modello aggiornata prima di avviare un nuovo carico di lavoro.
- Controlla `capability_tags`, `supported_modes` e `unified_schema`; le alternative più economiche sono utili solo se
  supportano il comportamento di input e output richiesto.
- Limita il contesto del prompt non necessario e imposta un limite adeguato di token di output quando il modello selezionato lo supporta.
- Considera la cache specifica del modello. Controlla la scheda del modello e i campi di utilizzo restituiti invece di presumere uno sconto
  valido per tutto il provider.
- Registra gli ID dei task solo per la consultazione del costo del task; per il lavoro asincrono su `/v1/run`, registra l'ID opaco dell'esecuzione restituito e interroga `GET /v1/run/{id}` solo mentre lo stato è `pending` o `running`.
- Usa i controlli di spesa disponibili nella Console per la tua organizzazione.

## Errori di pagamento {#payment-errors}

Un'operazione API può restituire HTTP `402` quando l'organizzazione non può coprire il costo della richiesta. Gli envelope di errore variano in base alla
superficie di compatibilità dell'API, quindi gestisci lo stato HTTP e l'oggetto di errore documentato invece di confrontare una singola stringa
di messaggio. Dopo aver risolto la fatturazione nella Console, riprova secondo le regole di idempotenza e ripristino dell'operazione.

Anche gli invii di video vengono verificati rispetto al costo stimato prima dell'avvio. Una singola ricarica di almeno 10 $
alza il livello del tuo account, il che consente di eseguire più task video contemporaneamente. Vedi
[Limiti di concorrenza](/guides/concurrency-limits).

Vedi [Modelli e prezzi](/for-agents/models), [Costo del task](/api-reference/tasks/cost) ed
[Errori](/api-reference/errors) per i contratti pubblici attuali.
