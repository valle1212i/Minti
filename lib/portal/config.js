// Kopierad från source-storefront-adapter main 1df51ce (adapter/server/config.js). Ändra i adapter-repot, inte här.
// Konfiguration ur miljön för createPortalProxy. ENBART namn ur env, aldrig ur
// request, aldrig ur en .env-fil som adaptern läser själv (hostingen injicerar).
//
// Två modeller för när valideringen sker, eftersom runtimes skiljer sig:
//   - processstart (Express, Cloud Run-container): anropa readConfigFromEnv()
//     vid uppstart så processen dör med tydligt fel om ett namn saknas.
//   - lat (Next.js route handlers, serverless): använd lazyProxy(), som skapar
//     proxyn vid första anrop och låter bryggan svara 500 med felmeddelandet.
// Felmeddelandet innehåller NAMNET på variabeln, aldrig något värde.

'use strict'

const REQUIRED = Object.freeze(['SOURCE_BASE_URL', 'SOURCE_TENANT_ID', 'FRONTEND_SYNC_SECRET'])

function readConfigFromEnv(env) {
  const e = env || process.env
  const read = (name) => String(e[name] == null ? '' : e[name]).trim()
  for (const name of REQUIRED) {
    if (!read(name)) throw new Error(`Missing required env: ${name}`)
  }
  return {
    baseUrl: read('SOURCE_BASE_URL'),
    tenant: read('SOURCE_TENANT_ID'),
    syncSecret: read('FRONTEND_SYNC_SECRET'),
    previewOrigins: read('SOURCE_PREVIEW_ORIGINS').split(',').map((s) => s.trim()).filter(Boolean),
    analyticsApiKey: read('ANALYTICS_API_KEY') || undefined,
    publicUrl: read('PORTAL_PUBLIC_URL') || undefined,
    analyticsIngest: read('PORTAL_ANALYTICS_INGEST') === 'true',
    trustedProxyHops: Number(read('TRUSTED_PROXY_HOPS')) || 1
  }
}

// Lat singleton: () => proxy. Skapas vid första anrop; ett konfigurationsfel
// kastas vid varje anrop tills miljön är rättad (ingen trasig proxy cachas).
function lazyProxy(createPortalProxy, env, extra) {
  let proxy = null
  return function getProxy() {
    if (!proxy) proxy = createPortalProxy({ ...readConfigFromEnv(env), ...(extra || {}) })
    return proxy
  }
}

module.exports = { REQUIRED_ENV: REQUIRED, readConfigFromEnv, lazyProxy }
