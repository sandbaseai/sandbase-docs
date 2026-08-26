const DOCS_PREFIX = '/docs'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === DOCS_PREFIX) {
      url.pathname = `${DOCS_PREFIX}/`
      return Response.redirect(url, 308)
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
    return env.ASSETS.fetch(new Request(url, request))
  },
}
