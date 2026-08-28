import assert from 'node:assert/strict'
import worker from '../worker/index.js'

const redirectingAssets = {
  async fetch() {
    return new Response(null, { status: 307, headers: { Location: '/models/supported' } })
  },
}

const rewritten = await worker.fetch(
  new Request('https://www.sandbase.ai/docs/models/supported/'),
  { ASSETS: redirectingAssets },
)
assert.equal(rewritten.status, 307)
assert.equal(rewritten.headers.get('Location'), '/docs/models/supported')

const outside = await worker.fetch(new Request('https://www.sandbase.ai/models/supported'), { ASSETS: redirectingAssets })
assert.equal(outside.status, 404)

console.log('Worker routing: ok (docs mount preserved across asset redirects)')
