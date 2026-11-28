---
i18nSource: 06feb27e20f1b7f5
title: Kontoverlauf auflisten
description: Listet die letzten Ausführungsdatensätze der Organisation des API-Schlüssels auf.
aside: false
outline: false
apiReference:
  title: Kontoverlauf auflisten
  operation: Account
  method: GET
  path: /v1/account/history
  description: Listet die letzten Ausführungsdatensätze der Organisation auf, neueste zuerst. Fehlermeldungen werden bereinigt, und gespeicherte JSON-Snapshots werden weggelassen, wenn sie sich nicht dekodieren lassen.
  groups:
    - title: Query-Parameter
      fields:
        - name: model
          type: string
          required: false
          description: Exakter logischer Modellname.
        - name: api_key_id
          type: string
          required: false
          description: Exakte Ressourcen-ID des API-Schlüssels.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Ausführungskategorie; multimodal umfasst Bild, Video und Audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Gruppierter Ausführungsstatus.
        - name: error_type
          type: string
          required: false
          description: Exakter Fehlertyp oder unknown für Datensätze ohne Fehlertyp.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Gleitender Zeitraum für created-at; Standard ist 7d.
        - name: page
          type: integer
          required: false
          description: Seitennummer, beginnend bei 1.
        - name: page_size
          type: integer
          required: false
          description: Einträge pro Seite von 1 bis 100; Standard ist 20.
        - name: request_id
          type: string
          required: false
          description: Exakte Ausführungs-ID innerhalb der Organisation. Wenn gesetzt, werden andere Filter ignoriert und genau ein Ergebnis angefordert.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Zeitstempelbasis für ein explizites Zeitfenster.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Abrechnungsfilter; positive und token erfordern time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Beginn des Zeitfensters (inklusive), zusammen mit end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Ende des Zeitfensters (exklusive); das Fenster darf 32 Tage nicht überschreiten.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Latenzwerte auf positive Werte beschränken.
        - name: min_latency_ms
          type: integer
          required: false
          description: Minimale Latenz in Millisekunden.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Nur zur Kompatibilitätsprüfung. Zeitstempel bleiben in UTC; die exakte Suche per request_id ignoriert diesen Parameter.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
