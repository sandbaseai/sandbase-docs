import { Readable } from 'node:stream'
import { sandboxProxy, PREFIX } from '../worker/sandbox-proxy.js'
export default function sandboxDev() {
  const install = server => { server.middlewares.use(async (req, res, next) => {
    if (!req.url?.startsWith(PREFIX + '/')) return next()
    // Local dev uses exactly the same stateless handler as the deployed Worker.
    try {
      const init = { method: req.method, headers: req.headers }
      if (!['GET','HEAD'].includes(req.method)) { init.body = Readable.toWeb(req); init.duplex = 'half' }
      const reply = await sandboxProxy(new Request(`http://${req.headers.host}${req.url}`, init))
      res.writeHead(reply.status, Object.fromEntries(reply.headers))
      if (!reply.body) return res.end()
      Readable.fromWeb(reply.body).on('error', () => res.destroy()).pipe(res)
    } catch { res.writeHead(502, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end('{"error":{"code":"proxy_unavailable"}}') }
  }); }
  return { name: 'sandbox-playground', configureServer: install, configurePreviewServer: install }
}
