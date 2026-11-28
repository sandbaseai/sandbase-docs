---
i18nSource: 270917aea416aa76
title: Elenca artifact della Session
description: Elenca gli artifact di output acquisiti della Session con paginazione a cursore, ID opachi, dimensioni dei file e link di download.
aside: false
outline: false
apiReference:
  title: Elenca artifact della Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Elenca gli output generati immutabili di questa Session. Gli ID degli artifact sono handle opachi con ambito Session; passa l'ID restituito senza modificarlo all'endpoint di download. I parametri di query sconosciuti o ripetuti restituiscono 400.
  groups:
    - title: Parametri di percorso
      fields:
        - name: session_id
          type: string
          required: true
          description: ID della Session (prefisso ses_).
    - title: Parametri di query
      fields:
        - name: limit
          type: integer
          required: false
          description: Dimensione della pagina da 1 a 100; i valori non validi restituiscono 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc o desc.
          default: desc
        - name: after
          type: string
          required: false
          description: ID dell'artifact restituito come last_id nella pagina precedente. Mantieni lo stesso ordinamento quando prosegui.
    - title: Oggetto artifact
      fields:
        - name: object
          type: string
          required: true
          description: Sempre agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Handle art_ opaco. Non costruirlo né decodificarlo.
        - name: session_id
          type: string
          required: true
          description: ID della Session proprietaria.
        - name: path
          type: string
          required: true
          description: Percorso dell'output generato sotto /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Dimensione dell'artifact in byte.
        - name: created_at
          type: integer
          required: true
          description: Timestamp di creazione in secondi Unix.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

L'handle dell'esempio è solo illustrativo. Usa l'`id` restituito dalla tua richiesta per [Scarica artifact](./download-artifact). Quando `has_more` è true, invia `after=last_id` per la pagina successiva. `first_id` e `last_id` sono null per un elenco vuoto. Non è disponibile un endpoint GET separato per i metadati degli artifact.
