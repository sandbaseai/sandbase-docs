import assert from 'node:assert/strict'

// These are published product pages, not API endpoints. Match the complete href
// in Markdown, HTML or a compiled href property; never strip URL prefixes.
const approvedPage = String.raw`https:\/\/www\.sandbase\.ai\/(?:console\/sandboxes|landing\/sandbox)`
const markdownHref = new RegExp(String.raw`(\]\()${approvedPage}(\))`, 'g')
const renderedHref = new RegExp(String.raw`(\bhref["']?\s*[:=]\s*)(\\?["'])${approvedPage}\2`, 'g')

export const sandboxAPIPath = /\/(?:v1\/)?sandboxes?(?:\/|%7b|\{|:|\b)/i

export function maskApprovedSandboxPageHrefs(content) {
  return content
    .replace(markdownHref, '$1/approved-product-page$2')
    .replace(renderedHref, '$1$2/approved-product-page$2')
}

// Both source and built validators import this module, so these regressions run
// in the existing CI commands without a separate test script.
for (const url of [
  'https://www.sandbase.ai/console/sandboxes',
  'https://www.sandbase.ai/landing/sandbox',
]) {
  for (const wrap of [
    value => `[Product](${value})`,
    value => `<a href="${value}">Product</a>`,
    value => `<a href='${value}'>Product</a>`,
    value => `({href:"${value}"})`,
    value => `({"href":"${value}"})`,
    value => String.raw`<a href=\"${value}\">Product</a>`,
  ]) {
    assert.doesNotMatch(maskApprovedSandboxPageHrefs(wrap(url)), sandboxAPIPath)
    // An approved link must not exempt another API path in the same page.
    assert.match(maskApprovedSandboxPageHrefs(`${wrap(url)} GET /v1/sandboxes`), sandboxAPIPath)
    for (const suffix of ['/api', '/v1/sandboxes', '?next=/v1/sandboxes', '#/sandboxes']) {
      const source = wrap(url + suffix)
      assert.equal(maskApprovedSandboxPageHrefs(source), source)
      if (url.includes('/sandboxes') || suffix.includes('/sandboxes')) {
        assert.match(maskApprovedSandboxPageHrefs(source), sandboxAPIPath)
      }
    }
  }
}
for (const source of [
  'GET /sandboxes', 'POST /v1/sandboxes', 'GET /sandboxes/{id}/metrics',
  '[API](https://api.sandbase.ai/sandboxes)',
  '[API](https://www.sandbase.ai/v1/sandboxes)',
  '<a href="https://other.example/console/sandboxes">API</a>',
  '<a href="https://www.sandbase.ai.evil.example/console/sandboxes">API</a>',
  '<a href="/console/sandboxes">Not an approved absolute href</a>',
  'fetch("https://www.sandbase.ai/console/sandboxes")',
]) {
  assert.match(maskApprovedSandboxPageHrefs(source), sandboxAPIPath)
}
