---
title: "OnPage Page Screenshot API Reference"
description: "SandBase API operation page_screenshot."
aside: false
outline: false
generatedBy: "sandbase-platform-api-reference"
apiReference:
  title: "OnPage Page Screenshot"
  operation: "DataForSEO API Operation"
  method: POST
  path: "/v1/run"
  description: "Capture a high-quality screenshot of a webpage with desktop, mobile, or tablet viewport settings."
  groups:
    - title: "Request body"
      description: "Submit the public SandBase model identifier and screenshot options."
      fields:
        - name: model
          type: string
          required: true
          description: "Model identifier. Set to dataforseo/v3/on_page/page_screenshot."
          default: "dataforseo/v3/on_page/page_screenshot"
        - name: url
          type: string
          required: true
          description: "Absolute URL of the page to capture."
        - name: browser_preset
          type: string
          required: false
          description: "Viewport preset."
          constraints: "Allowed values: desktop, mobile, tablet"
          default: desktop
        - name: full_page_screenshot
          type: boolean
          required: false
          description: "Capture the full page when true; capture only the viewport when false."
          default: true
        - name: browser_screen_width
          type: integer
          required: false
          description: "Custom viewport width in pixels. Overrides browser_preset."
          constraints: "Range: 240 to 9999"
        - name: browser_screen_height
          type: integer
          required: false
          description: "Custom viewport height in pixels. Overrides browser_preset."
          constraints: "Range: 240 to 9999"
        - name: browser_screen_scale_factor
          type: number
          required: false
          description: "Custom device scale factor. Overrides browser_preset."
          constraints: "Range: 0.5 to 3"
        - name: disable_cookie_popup
          type: boolean
          required: false
          description: "Dismiss cookie-consent dialogs when true."
          default: false
        - name: accept_language
          type: string
          required: false
          description: "Accept-Language header sent while loading the page."
        - name: custom_user_agent
          type: string
          required: false
          description: "Custom browser user-agent string."
        - name: ip_pool_for_scan
          type: string
          required: false
          description: "Proxy pool location."
          constraints: "Allowed values: us, de"
        - name: switch_pool
          type: boolean
          required: false
          description: "Use additional proxy pools when true."
      
    - title: "Response Schema"
      description: "The unified run envelope contains the operation result in outputs[0].data."
      fields:
        - name: id
          type: string
          required: true
          description: "Opaque SandBase run identifier."
        - name: status
          type: string
          required: true
          description: "Current run status."
          constraints: "Allowed values: pending, running, completed, failed, timeout"
        - name: model
          type: string
          required: true
          description: "Public SandBase model name used for this run."
        - name: outputs
          type: array<object>
          required: false
          description: "Present when the run completes successfully."
        - name: error
          type: object
          required: false
          description: "Present for failed or timeout runs."
        - name: usage
          type: object
          required: false
          description: "Usage details when available."
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "dataforseo/v3/on_page/page_screenshot",
            "url": "https://dataforseo.com/apis",
            "browser_preset": "desktop",
            "full_page_screenshot": true
          }'
  response:
    status: "200 OK"
    code: |-
      {
        "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
        "status": "completed",
        "model": "dataforseo/v3/on_page/page_screenshot",
        "outputs": [{"data": {"screenshot_url": "https://media.sandbase.ai/files/..."}}]
      }
seo:
  modelName: "OnPage Page Screenshot"
  modelId: "dataforseo/v3/on_page/page_screenshot"
  vendor: "DataForSEO"
  vendorSlug: "dataforseo"
  modelSlug: "v3/on_page/page_screenshot"
  protocol: "API Reference"
  endpoint: "/v1/run"
  publishedAt: "2026-08-29T00:00:00Z"
  capabilities: ["onpage", "screenshot", "rendering"]
  category: "APIs"
---

<ApiReferencePage />

Use a public URL that the rendering service can reach. The response data is
operation-specific; inspect `outputs[0].data` for the returned screenshot URL
and persist it before its media retention period expires.
