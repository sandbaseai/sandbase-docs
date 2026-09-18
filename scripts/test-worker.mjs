import assert from 'node:assert/strict'
import worker from '../worker/index.js'

const redirectingAssets = {
  async fetch() {
    return new Response(null, { status: 307, headers: { Location: '/models/supported' } })
  },
}

const rewritten = await worker.fetch(
  new Request('https://www.agrouter.ai/docs/models/supported/'),
  { ASSETS: redirectingAssets },
)
assert.equal(rewritten.status, 307)
assert.equal(rewritten.headers.get('Location'), '/docs/models/supported')

const outside = await worker.fetch(new Request('https://www.agrouter.ai/models/supported'), { ASSETS: redirectingAssets })
assert.equal(outside.status, 404)

const rootLanding = await worker.fetch(new Request('https://www.agrouter.ai/docs/'), { ASSETS: redirectingAssets })
assert.equal(rootLanding.status, 302)
assert.equal(new URL(rootLanding.headers.get('Location')).pathname, '/docs/model-api-reference/official-native-api/')

const indexAlias = await worker.fetch(new Request('https://www.agrouter.ai/docs/index'), { ASSETS: redirectingAssets })
assert.equal(indexAlias.status, 302)
assert.equal(new URL(indexAlias.headers.get('Location')).pathname, '/docs/model-api-reference/official-native-api/')

console.log('Worker routing: ok (docs mount preserved, root lands on Official Native API)')
