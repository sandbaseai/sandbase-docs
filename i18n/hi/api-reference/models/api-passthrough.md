---
i18nSource: fb62188053fb216d
title: API पासथ्रू
description: Enabled catalog API capabilities को उनके vendor-qualified paths से call करें।
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: vendor/upstream_path नाम वाली enabled catalog capability को resolve करें और unified SandBase pipeline से एक JSON object execute करें। जिन capabilities में GET का उपयोग होता है, उनके लिए GET भी समर्थित है।
  groups:
    - title: Path parameters
      fields:
        - name: vendor
          type: string
          required: true
          description: Capability name का पहला segment।
        - name: upstream_path
          type: string
          required: true
          description: बाकी path
          including literal slash-separated segments when present.: null
    - title: Request body
      fields:
        - name: model
          type: string
          required: false
          description: URL से निकली vendor/path identity इस्तेमाल करने के लिए इसे न भेजें। यदि दिया जाए
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: चुनी गई capability के live schema में परिभाषित fields।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

URL, `vendor/upstream_path` नाम वाले किसी enabled model को resolve करता है। [Models API](./) द्वारा लौटाया गया exact vendor-qualified name इस्तेमाल करें। Nested capability names percent-encoded slashes के बजाय literal path segments ही रहते हैं।

POST केवल JSON object स्वीकार करता है। खाली POST body की अनुमति है और यह URL से निकले model वाले object की तरह व्यवहार करती है। GET खाली body का उपयोग करता है। Response fields और synchronous या asynchronous व्यवहार चुनी गई capability पर निर्भर करते हैं; asynchronous results को `GET /v1/run/{id}` से poll करें।
