---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: Nutze mit SandBase OpenAI-kompatible Chat Completions, Streaming, Tools, multimodale Eingaben und strukturierte Ausgabe.
---

# Chat Completions {#chat-completions}

SandBase bietet unter `POST /v1/chat/completions` einen OpenAI-kompatiblen Endpunkt für Chat Completions. Bestehende Anwendungen mit dem OpenAI SDK können SandBase nutzen, indem du API-Key und Base-URL änderst.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Messages und multimodale Inhalte {#messages-and-multimodal-content}

Sende Messages in der Reihenfolge der Unterhaltung mit Rollen, die der ausgewählte Provider unterstützt, üblicherweise `system`, `developer`, `user`, `assistant` und `tool`. Text kann ein String sein. Modelle mit Vision-Unterstützung akzeptieren außerdem Content-Parts wie `text` und `image_url`.

## Streaming {#streaming}

Setze `stream: true`, um Server-Sent Events zu erhalten. Lies jedes `data:`-Event der Reihe nach und verkette `choices[0].delta.content`. Der Stream endet mit `data: [DONE]`. Füge `stream_options: {"include_usage": true}` hinzu, wenn der ausgewählte Provider Nutzungsdaten beim Streaming liefert; andernfalls können sie fehlen.

## Tools {#tools}

Definiere aufrufbare Funktionen in `tools`. Wenn der Assistent `tool_calls` zurückgibt, führe jede Funktion in deiner Anwendung aus und hänge dann eine `tool`-Message mit der passenden `tool_call_id` an, bevor du fortfährst.

## Strukturierte Ausgabe {#structured-output}

Verwende `response_format`, um ein JSON-Objekt oder eine Antwort nach JSON Schema anzufordern. Die Unterstützung variiert je nach Modell. Prüfe daher die Fähigkeiten des ausgewählten Modells, bevor du dich auf eine strikte Schema-Durchsetzung verlässt.

## Providerspezifische Parameter {#provider-specific-parameters}

SandBase verwendet `model` und `stream` für das Routing. Weitere OpenAI-kompatible Request-Felder bleiben erhalten, wenn der ausgewählte Provider dasselbe Protokoll verwendet. Wenn SandBase zwischen Protokollen übersetzt, verwende dokumentierte Felder oder `extra_body`; die Unterstützung variiert je nach Provider.

## Fehler und Retries {#errors-and-retries}

Verwende begrenzten Backoff für wiederholbare `429`- und vorübergehende Serverantworten, aber nur, wenn eine erneute Generierung unbedenklich ist. Wiederhole fehlerhafte Anfragen, Authentifizierungsfehler oder Anfragen, deren Tool-Seiteneffekte bereits eingetreten sein könnten, nicht automatisch. Siehe [Fehler und Retries](/guides/error-handling). Das vollständige Feld- und Antwortschema findest du unter [Chat Completions API](/api-reference/llm-gateway).
