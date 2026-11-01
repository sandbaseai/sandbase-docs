import assert from 'node:assert/strict'
import worker from '../worker/index.js'
const redirectingAssets = {
  async fetch() {
    return new Response(null, { status: 307, headers: { Location: '/models/supported' } })
  },
}
const rewritten = await worker.fetch(
  new Request('https://www.sandbase.ai/docs/guides/streaming.html'),
  { ASSETS: redirectingAssets },
)
// Clean-URL redirects keep the docs mount point and are permanent.
assert.equal(rewritten.status, 301)
assert.equal(rewritten.headers.get('Location'), '/docs/models/supported')
const outside = await worker.fetch(new Request('https://www.sandbase.ai/models/supported'), { ASSETS: redirectingAssets })
assert.equal(outside.status, 404)

const okAssets = { async fetch() { return new Response('ok', { status: 200 }) } }
const retired = async (path) => {
  const response = await worker.fetch(new Request(`https://www.sandbase.ai${path}`), { ASSETS: okAssets })
  return [response.status, response.headers.get('Location')]
}
// Per-model references moved to the main site, in one hop.
assert.deepEqual(await retired('/docs/model-api-reference/platform-apis/tiktok/analytics/detect-fake-views'), [301, 'https://www.sandbase.ai/apis/tiktok/analytics/detect-fake-views/docs'])
assert.deepEqual(await retired('/docs/model-api-reference/platform-apis/tiktok/analytics/detect-fake-views.html'), [301, 'https://www.sandbase.ai/apis/tiktok/analytics/detect-fake-views/docs'])
assert.deepEqual(await retired('/docs/model-api-reference/llm-models/openai/gpt-5.5'), [301, 'https://www.sandbase.ai/models/openai/gpt-5.5/docs'])
assert.deepEqual(await retired('/docs/model-api-reference/platform-apis'), [301, 'https://www.sandbase.ai/apis'])
// Retired catalog and product pages.
assert.deepEqual(await retired('/docs/store/'), [301, 'https://www.sandbase.ai/models'])
assert.deepEqual(await retired('/docs/models/supported'), [301, 'https://www.sandbase.ai/models'])
assert.deepEqual(await retired('/docs/agents/schedules'), [301, 'https://www.sandbase.ai/docs/agents/'])
assert.deepEqual(await retired('/docs/api-reference/services/create'), [301, 'https://www.sandbase.ai/docs/api-reference/agents/'])
assert.deepEqual(await retired('/docs/api-reference/deployments/create.html'), [301, 'https://www.sandbase.ai/docs/api-reference/agents/'])
// Kept pages are served, including the official native API references and Secrets.
assert.deepEqual(await retired('/docs/model-api-reference/official-native-api/openai/gpt-image-2'), [200, null])
assert.deepEqual(await retired('/docs/api-reference/secrets/'), [200, null])
assert.deepEqual(await retired('/docs/guides/streaming'), [200, null])
console.log('Worker routing: ok (docs mount preserved, clean URLs permanent, retired pages redirect once)')
