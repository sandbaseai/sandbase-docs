---
i18nSource: 06a65ded83bf9438
title: Elenca file del workspace
description: Elenca i file attuali del workspace di una Session con percorso, dimensione e paginazione. Questo endpoint di sola lettura restituisce i metadati dei file.
aside: false
outline: false
apiReference:
  title: Elenca file del workspace
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Elenca i percorsi e le dimensioni attuali dei file in una directory del workspace di una Session. È un elenco di soli metadati, non la cronologia degli allegati né il contenuto degli artifact. Parametri di query sconosciuti o ripetuti restituiscono 400.
  groups:
    - title: Parametri di percorso
      fields:
        - name: session_id
          type: string
          required: true
          description: ID della Session (prefisso ses_).
    - title: Parametri di query
      fields:
        - name: path
          type: string
          required: false
          description: Directory assoluta /workspace o una directory normalizzata al suo interno. Massimo 4096 byte; niente traversal, backslash o slash finale.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Dimensione della pagina da 1 a 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Ordinamento per percorso: asc o desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Valore next opaco della risposta precedente. Omettilo nella prima pagina; non inviare una stringa vuota. Lascia invariati path, order e limit.
    - title: Campi della risposta
      fields:
        - name: object
          type: string
          required: true
          description: Sempre page.
        - name: data
          type: array
          required: true
          description: File della directory corrente, ciascuno con path e size_bytes. L'elenco non è ricorsivo.
        - name: next
          type: string | null
          required: true
          description: Passa questo valore come page per continuare; null alla fine.
        - name: has_more
          type: boolean
          required: true
          description: Indica se è disponibile un'altra pagina.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Le letture del workspace possono restituire `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` o `workspace_unavailable`. Se il cursore non è valido, riparti dalla prima pagina. Usa [Artifacts](./list-artifacts) per trovare gli output generati scaricabili.
