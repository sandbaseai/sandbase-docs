---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: SandBase üzerinden GPT modelleriyle OpenAI uyumlu Responses API'yi kullanın.
---

# OpenAI Responses {#openai-responses}

GPT modelleri, `POST /v1/responses` adresindeki OpenAI uyumlu Responses API'yi destekler.
İstemler veya yapılandırılmış içerik için `input` kullanın ve üretilen öğeleri
`output` alanından okuyun.

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Chat Completions uyumluluğu {#chat-completions-compatibility}

Aynı GPT modelleri `POST /v1/chat/completions` uç noktasını da destekler. Bu protokol
istekte `messages`, yanıtta `choices` kullanırken Responses
`input` ve `output` kullanır. Parametre zarfları birbirinin yerine kullanılamaz;
SDK'nıza uyan uç noktayı seçin.

Uyumlu istek biçimi için [Chat Completions](./chat-completions),
modele özgü alanlar ve sınırlar için [GPT model referanslarına](https://www.sandbase.ai/models)
bakın.

## Sonraki adımlar {#next-steps}

- [Responses API referansı](/api-reference/responses)
- [Chat Completions API referansı](/api-reference/llm-gateway)
- [Models kataloğu](https://www.sandbase.ai/models)
