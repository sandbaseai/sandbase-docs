---
i18nSource: faccf5122e785ea0
title: Baixar artefato da Session
description: Baixe um artefato capturado de uma Session pelo ID. Conheça o limite para download de arquivos completos, os tipos de resposta suportados e o comportamento de Range.
aside: false
outline: false
apiReference:
  title: Baixar artefato da Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Baixa um artefato imutável completo usando o ID obtido em Listar artefatos da Session. Arquivos de até 200 MiB são suportados. Nenhum parâmetro de consulta é aceito; requisições com Range retornam 416 após a validação de acesso.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: session_id
          type: string
          required: true
          description: ID da Session (prefixo ses_).
        - name: artifact_id
          type: string
          required: true
          description: ID opaco art_ exato retornado pela lista de artefatos desta Session. IDs de anexos e caminhos do workspace não são aceitos.
    - title: Cabeçalhos da resposta
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Tipo de mídia inferido pela extensão do arquivo, ou application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment com o nome do arquivo do artefato.
        - name: Content-Length
          type: integer
          required: true
          description: Tamanho completo do arquivo em bytes.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

Uma resposta bem-sucedida contém os bytes do arquivo, não JSON. Baixe o arquivo inteiro; transferências parciais e downloads retomáveis com Range não são suportados. Um artefato indisponível retorna `404`; um serviço de artefatos indisponível retorna `executor_unavailable`.

