---
i18nSource: 3ccdc1071b9be798
title: Models API
description: Ermittle Metadaten, Preise, Supportstatus und Fähigkeiten von SandBase-Modellen.
---

# Models API {#models-api}

Mit der Models API ermittelst du Modelle, bevor du einen Inferenz-Endpoint wählst. Die Listenoperation ist OpenAI-kompatibel und gibt kompakte Identitätsdatensätze zurück. Rufe ein einzelnes Modell ab, um SandBase-Metadaten zu Fähigkeiten, Schema und Preisen zu erhalten.

| Operation | Endpoint | Dokumentation |
|---|---|---|
| Modelle auflisten | `GET /v1/models` | [Modelle auflisten](./list) |
| Ein Modell abrufen | `GET /v1/models/{id_or_name}` | [Modell abrufen](./get) |
| Eine API-Fähigkeit per Pfad aufrufen | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API-Passthrough](./api-passthrough) |
| Ein Modell oder eine API-Fähigkeit ausführen | `POST /v1/run` | [Fähigkeit ausführen](./run) |
| Ein asynchrones Ergebnis abrufen | `GET /v1/run/{id}` | [Run-Ergebnis abrufen](./run-get) |
| Einen asynchronen Callback empfangen | `webhook_url` bei `POST /v1/run` | [Webhook-Callbacks](./run#webhook-callbacks) |
| Unterstützte Modelle durchsuchen | — | [Models-Katalog](https://www.sandbase.ai/models) |

Um ein Modell auszuführen, öffne seine Referenzseite im [Models-Katalog](https://www.sandbase.ai/models); jede Seite zeigt den genauen Bezeichner, die Request-Felder und die Preise. Diese Seite dokumentiert die Ermittlung von Modellen, den einheitlichen Capability-Runner, den API-Passthrough, Assets und die Abfrage von Task-Kosten.

`GET /v1/models` unterstützt `q`, `vendor`, `type` und `order`; die Liste ist nicht paginiert. Ohne `type` gilt standardmäßig `llm`, während ein explizit leeres `type=` alle öffentlichen Modelltypen auflistet. Der Filter `vendor` ist exakt und berücksichtigt Groß-/Kleinschreibung; `q` ist eine Teilstringsuche ohne Berücksichtigung der Groß-/Kleinschreibung. Jeder Listeneintrag enthält `id`, `object`, `created` und `owned_by`, wobei `id` der logische Modellname für Anfragen ist.

Modellnamen können `/` enthalten. Übergib diese Schrägstriche beim Aufruf des Detail-Endpoints als Pfadtrenner, zum Beispiel `/v1/models/openai/gpt-5.6-luna`; die Server-Route wertet den restlichen Pfad als einen logischen Bezeichner. Ermittle die aktuelle ID über `GET /v1/models`, statt einen Bezeichner aus einer älteren Anleitung zu kopieren.

Bei einer asynchronen `202`-Antwort einer Inferenz-API fragst du `GET /v1/run/{id}` mit der zurückgegebenen undurchsichtigen ID ab. Leite kein ID-Präfix ab und konstruiere keinen anderen Polling-Pfad aus Kompatibilitäts-Headern.
