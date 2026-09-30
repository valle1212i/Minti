// Kopierad från source-storefront-adapter main 1df51ce (adapter/server/nextBridge.js). Ändra i adapter-repot, inte här.
// Brygga mellan Fetch-API-formade route handlers (Next.js App Router,
// Cloudflare Workers, Deno, Bun) och adapterns Express-formade handlers.
//
// Förlaga: bryggan som skrevs i första fullkörningen mot testsajten. Den
// ersätter den tidigare nextAdapter i portalProxy.js, som hade fyra fel:
// den strippade bara prefixet /api/portal, den skickade ALLA klientheaders
// vidare (mot adapterns egen allow-lista), den saknade felhantering för
// saknad konfiguration, och den skickade Next 15:s params (en Promise) rakt in.
//
// Regler:
//  - Inkommande headers filtreras mot INBOUND_HEADERS. Adaptern bygger alla
//    utgående headers själv, så klientens cookies, X-Tenant och Authorization
//    når aldrig proxyn annat än där adaptern uttryckligen läser dem
//    (authorization för inkommande bearer, x-forwarded-for för analys).
//  - Konfigurationen läses lat via getProxy(); "Missing required env: NAMN"
//    blir 500 med namnet i svaret, aldrig ett värde. Andra fel blir 500
//    "Adapterfel" och loggas.
//  - params ignoreras: adapterns handlers tar id ur sökvägen.
//  - Sökvägen kan överstyras per route (kompatibilitetslager), annars
//    strippas monteringsprefixet.

'use strict'

const INBOUND_HEADERS = Object.freeze(['authorization', 'x-forwarded-for', 'content-type'])

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}

/**
 * @param {() => object} getProxy  Lat proxy-getter (t.ex. från config.lazyProxy) eller () => färdig proxy.
 * @param {object} [options]
 * @param {string} [options.mount]   Monteringsprefix som strippas för portalRoute. Standard '/api/portal'.
 * @param {object} [options.logger]  { error }. Loggar aldrig headers eller kroppar.
 */
function createNextBridge(getProxy, options) {
  if (typeof getProxy !== 'function') throw new Error('createNextBridge: getProxy måste vara en funktion')
  const mount = (options && options.mount) || '/api/portal'
  const log = (options && options.logger) || console

  // Bygger en Express-formad req/res ur en Fetch-Request och kör vald handler.
  function route(pick, pathOverride) {
    if (typeof pick !== 'function') throw new Error('route: pick måste vara en funktion (proxy) => handler')
    return async function handle(request /*, context ignoreras */) {
      const url = new URL(request.url)
      const path = pathOverride ? pathOverride(request, url) : url.pathname
      const headers = {}
      for (const k of INBOUND_HEADERS) {
        const v = request.headers.get(k)
        if (v) headers[k] = v
      }
      let body
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        try { body = await request.json() } catch { body = {} }
      }
      const req = { method: request.method, url: path + url.search, path, headers, query: Object.fromEntries(url.searchParams), body, ip: null }
      let status = 200
      const outHeaders = {}
      let payload = ''
      const res = {
        get statusCode() { return status },
        status(s) { status = s; return res },
        setHeader(k, v) { outHeaders[k] = v },
        set(k, v) { outHeaders[k] = v },
        send(b) { payload = b == null ? '' : String(b) },
        end(b) { payload = b == null ? '' : String(b) },
        redirect(s, loc) { status = s; outHeaders.Location = loc }
      }
      let proxy
      try {
        proxy = getProxy()
      } catch (err) {
        const msg = err && err.message ? err.message : ''
        if (msg.startsWith('Missing required env')) return jsonResponse(500, { success: false, error: msg })
        log.error(`[portal-bridge] konfiguration: ${msg}`)
        return jsonResponse(500, { success: false, error: 'Adapterfel' })
      }
      try {
        await pick(proxy)(req, res)
      } catch (err) {
        log.error(`[portal-bridge] ${request.method} ${path}: ${err && err.message}`)
        return jsonResponse(500, { success: false, error: 'Adapterfel' })
      }
      return new Response(payload, { status, headers: outHeaders })
    }
  }

  return {
    route,
    // /api/portal/* (eller options.mount): adapterns routetabell.
    portalRoute() {
      return route((p) => p.handler, (request, url) => (url.pathname.startsWith(mount) ? url.pathname.slice(mount.length) : url.pathname) || '/')
    },
    invalidateRoute() { return route((p) => p.invalidateHandler) },
    webhookRoute() { return route((p) => p.webhookHandler) },
    goRoute() { return route((p) => p.goHandler) },
    // Kompatibilitetslager: en befintlig klientväg mappas till en adapterväg.
    compatRoute(toAdapterPath) { return route((p) => p.handler, (request, url) => toAdapterPath(url)) }
  }
}

module.exports = { createNextBridge, INBOUND_HEADERS }
