const DOCS_PREFIX = '/docs'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === DOCS_PREFIX) {
      url.pathname = `${DOCS_PREFIX}/`
      return Response.redirect(url, 308)
    }

    // The docs landing page is the Official Native API reference. Redirect the
    // root (and its legacy /docs/index alias) there instead of the homepage.
    if (url.pathname === `${DOCS_PREFIX}/` || url.pathname === `${DOCS_PREFIX}/index`) {
      url.pathname = `${DOCS_PREFIX}/model-api-reference/official-native-api/`
      return Response.redirect(url, 302)
    }

    if (!url.pathname.startsWith(`${DOCS_PREFIX}/`)) {
      return new Response('Not Found', { status: 404 })
    }

    // The former origin permanently redirected /docs/ to /docs/index. Some
    // browsers still cache that redirect, so serve the homepage internally
    // instead of redirecting /docs/index back to /docs/ and creating a loop.
    url.pathname = url.pathname === `${DOCS_PREFIX}/index`
      ? '/'
      : url.pathname.slice(DOCS_PREFIX.length) || '/'
    const response = await env.ASSETS.fetch(new Request(url, request))

    // Static asset clean-URL redirects are generated against the stripped
    // pathname (for example `/models/supported`). Re-attach the docs mount
    // point so trailing-slash links never escape to the main site and 404.
    const location = response.headers.get('Location')
    if (location?.startsWith('/') && !location.startsWith(`${DOCS_PREFIX}/`)) {
      const headers = new Headers(response.headers)
      headers.set('Location', `${DOCS_PREFIX}${location}`)
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }

    return response
  },
}
