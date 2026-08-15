---
title: Service Quickstart
description: Publish a tested Agent as a Service and call it from an app over REST.
---

# Service API Quickstart

Services let another app, AI tool, or user call an Agent you already built and tested. The underlying API resource is called an `endpoint`, so this page uses `/v1/endpoints` in the code examples.

This example requires `curl` and `jq`.

## Publish and run an Agent

```bash
export SANDBASE_API_KEY='sk-sb-YOUR_KEY'
export SANDBASE_API_BASE='https://api.sandbase.ai'

: "${SANDBASE_API_KEY:?SANDBASE_API_KEY is required}"

ENDPOINT_RESPONSE="$(
  curl -fsS -X POST "$SANDBASE_API_BASE/v1/endpoints" \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H 'Content-Type: application/json' \
    --data '{
      "name": "customer-research",
      "agent_id": "agent_01...",
      "environment_id": "env_01...",
      "protocols": ["rest"]
    }'
)"

ENDPOINT_ID="$(jq -er '.id' <<<"$ENDPOINT_RESPONSE")"
RUN_URL="$(jq -er '.run_url' <<<"$ENDPOINT_RESPONSE")"

jq '{id, runtime, status, run_url}' <<<"$ENDPOINT_RESPONSE"

curl -fsS --max-time 240 -X POST "$RUN_URL" \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H 'Content-Type: application/json' \
  --data '{
    "input": "Research this company and return a sourced customer brief."
  }' \
  | jq .
```

The `202 Accepted` response contains `session_id` and an `events` array. Each accepted event has a server-assigned `sevt_*` ID and `processed_at`; no Run or request resource is created. Use the Session Events APIs to read history or stream results. Pass the returned `session_id` in a later Endpoint call to continue the same Session; omit it to create another Session.

## Add capabilities

Add Models, APIs, Skills, and private values while building the Agent. Publish only after the Agent works the way you want. If you need to change behavior, update the Agent and publish a new version.

## Clean up

```bash
curl -fsS -X DELETE "$SANDBASE_API_BASE/v1/endpoints/$ENDPOINT_ID" \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  | jq .
```

## Next steps

- [Services guide](/agents/services) — product concepts and lifecycle
- [Endpoints API](/api-reference/endpoints/) — REST invocation, state, and error reference
- [Build Agent](/agents/) — define and test the Agent before publishing
- [Skills API](/api-reference/skills/) — package, upload, register, and attach a Skill
