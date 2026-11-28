---
i18nSource: 3b9b3fc27f878cd5
title: API Account
description: Consulta il saldo dell'organizzazione e la cronologia recente delle esecuzioni associate a una API key.
---

# API Account {#account-api}

Gli endpoint Account sono di sola lettura e operano sull'organizzazione risolta dalla API key Bearer.

| Operazione | Endpoint |
|---|---|
| [Ottenere il saldo](./balance) | `GET /v1/account/balance` |
| [Elencare la cronologia delle esecuzioni](./history) | `GET /v1/account/history` |

I valori di saldo e costo sono stringhe decimali esatte. Mantienili come valori decimali invece di convertirli con
l'aritmetica binaria in virgola mobile.

La cronologia delle esecuzioni serve a ispezionare l'attività operativa recente. Per la riconciliazione finanziaria
a lungo termine usa i record di fatturazione o le esportazioni.

Il filtro della cronologia usa timestamp UTC grezzi. Senza `request_id`, il parametro di compatibilità facoltativo `timezone` viene validato come nome di fuso orario IANA ma non trasforma i timestamp della risposta; la modalità esatta `request_id` lo ignora insieme agli altri filtri. I valori di `type` sconosciuti non applicano alcun filtro per tipo di esecuzione; usa `multimodal`, `llm` o `api` per un filtro effettivo. I valori di `range` non supportati ricadono su `7d`.

Le voci della cronologia possono contenere parametri di richiesta salvati e output dei modelli. Limita di conseguenza l'accesso alla API key
e non copiare le risposte della cronologia in log o ticket di supporto senza averle controllate per dati sensibili.
