---
i18nSource: b95a8cd6f82c3a9a
title: KI-lesbare Models und Preise
description: Aktuelle SandBase-Modelle, Fähigkeiten, Schemas und Preise über die Models API ermitteln.
---

# Models und Preise {#models-pricing}

Alle Modelle sind mit einem einzigen SandBase-API-Schlüssel erreichbar. Verfügbarkeit, Schemas, Fähigkeiten, Kontextgrenzen
und Preise der Modelle können sich unabhängig voneinander ändern.

::: info Live-Metadaten der Modelle verwenden
Verwende immer `GET /v1/models` und `GET /v1/models/{id_or_name}` für aktuelle, verbindliche Daten. Geh nicht davon aus, dass jedes
LLM Streaming, Vision, Tools, strukturierte Ausgabe oder Caching unterstützt, und übertrage nicht die Eingabefelder oder
Preise eines Modells auf ein anderes.
:::

## Katalog- und Detailantworten {#catalog-and-detail-responses}

`GET /v1/models` liefert OpenAI-kompatible Identitätsdatensätze mit `id`, `object`, `created` und `owned_by`.
Metadaten zu Fähigkeiten, Schema und Preisen von SandBase lässt es bewusst weg.

`GET /v1/models/{id_or_name}` ergänzt `unified_schema`, `supported_modes` und `model_card`. Detaillierte Preise liest du aus
`model_card`; ein `pricing`-Objekt auf oberster Ebene gibt es nicht. Behandle `capability_tags`, `supported_modes` und
`unified_schema` als modellspezifisch.

## Modelle ermitteln {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Der Listen-Endpunkt unterstützt `q`, `vendor`, `type` und `order`; er ist nicht paginiert und verwendet standardmäßig `type=llm`.
Er liefert OpenAI-kompatible Einträge mit `id`, `object`, `created` und `owned_by`. Verwende die zurückgegebene `id` als
Modellnamen, wenn du Details anforderst oder das Modell aufrufst.

Frage bei jeder asynchronen `202`-Antwort `GET /v1/run/{id}` mit der zurückgegebenen ID ab. Behandle die ID als opak; leite
weder ihr Format ab noch konstruiere einen anderen Polling-Pfad aus einem ID-Präfix oder einem Kompatibilitäts-Header.

## Ein Modell prüfen {#inspect-one-model}

Modellnamen sind mit dem Anbieter qualifiziert und können `/` enthalten:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Prüfe vor der Ausführung:

- `enabled` und `execution_mode`
- `capability_tags` und `supported_modes`
- `unified_schema` für die akzeptierten Anfragefelder
- `model_card` für die aktuelle Preisformel und die Token- oder Cache-Multiplikatoren

## Tatsächliche Kosten einer Aufgabe prüfen {#check-actual-task-cost}

Frage bei einer abgeschlossenen oder laufenden Aufgabe die erfassten Kosten ab, statt sie aus einer veralteten Tabelle neu zu berechnen:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Die Antwortverträge findest du in der [Models-API-Referenz](/api-reference/models/), Hinweise zu Antwortformen und Wiederholungen im
[Fehlerleitfaden](/for-agents/errors).
