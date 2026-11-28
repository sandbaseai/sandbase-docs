---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Nutze Anthropic-kompatible Nachrichten, Content-Blöcke, Tools, Thinking und Streaming mit SandBase.
---

# Anthropic Messages {#anthropic-messages}

SandBase bietet unter `POST /v1/messages` einen Anthropic-kompatiblen Endpoint. Anwendungen mit dem Anthropic SDK verbinden sich, indem du API-Key und Base-URL änderst.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Authentifizierung und Versions-Header {#authentication-and-version-headers}

Verwende `x-api-key` oder `Authorization: Bearer …`. Sind beide angegeben, hat `x-api-key` Vorrang. Der optionale Header `anthropic-version` wird an den Upstream weitergegeben und ist standardmäßig `2023-06-01`, wenn er fehlt. Optionale `anthropic-beta`-Werte werden ebenfalls weitergegeben, sofern der Anbieter sie unterstützt.

## Nachrichten und Content-Blöcke {#messages-and-content-blocks}

Nachrichten verwenden die Rollen `user` und `assistant`. Die Systemanweisung gehört in das Feld `system` auf oberster Ebene. Der Inhalt kann einfacher Text oder ein Array typisierter Blöcke wie `text`, `image`, `tool_use` und `tool_result` sein.

## Tools und Extended Thinking {#tools-and-extended-thinking}

Füge Tool-Definitionen in `tools` hinzu und steuere die Auswahl über `tool_choice`. Unterstützt das gewählte Modell es, konfigurierst du erweitertes Reasoning mit `thinking`; behalte zurückgegebene Thinking-Blöcke bei, wenn du die Konversation fortsetzt.

## Streaming {#streaming}

Setze `stream: true`, um SSE-Events im Anthropic-Stil zu erhalten, darunter `message_start`, Content-Block-Events, `message_delta` und `message_stop`. SandBase leitet außerdem Keepalive- und anbieterdefinierte Beta-Events weiter. Für Vorwärtskompatibilität sollten Consumer unbekannte Event-Typen ignorieren und `error`-Events auf Protokollebene behandeln.

## Kompatibilität {#compatibility}

SandBase ordnet den öffentlichen Modellnamen dem gewählten Anbieter zu. Andere kompatible Request-Felder und die Response-Bytes bleiben erhalten, sofern der Anbieter keine explizite Kompatibilitätsregel hat, die ein nicht unterstütztes Feld entfernt oder den Kandidaten ablehnt. Anbieterspezifische Beta-Funktionen sind möglicherweise nicht auf jedem Modell verfügbar. Das vollständige Request- und Response-Schema findest du unter [Anthropic Message erstellen](/api-reference/anthropic-compat).
