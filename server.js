// server.js — sajtens server: serverar React-bygget och kopplar sajten till kundportalen.
//
// Ersätter `serve -s build`. Samma container och samma Cloud Run-tjänst som tidigare.
//
//   /api/portal/*                 portaladaptern (lib/portal/portalProxy.js), sluten routetabell
//   POST /api/presentation/invalidate  portalen nollar presentationscachen (Bearer FRONTEND_SYNC_SECRET)
//   POST /api/campaigns/webhook        portalen nollar produktcachen (Bearer FRONTEND_SYNC_SECRET)
//   GET  /go/:id                  sluten omdirigering till portalens publika sidor (navigation)
//   GET  /health                  hälsokontroll (JSON)
//   övriga /api/*                 404 JSON, aldrig index.html
//   GET  allt annat               statiska filer ur build/, annars index.html (SPA-fallback)
//
// Konfigurationen läses ur miljön vid start (lib/portal/config.js). Saknas ett obligatoriskt
// namn dör processen med "Missing required env: NAMN", aldrig med ett värde.

'use strict'

const path = require('node:path')
const fs = require('node:fs')
const express = require('express')
const { createPortalProxy } = require('./lib/portal/portalProxy')
const { readConfigFromEnv } = require('./lib/portal/config')

function createApp(env, options) {
  const config = readConfigFromEnv(env)
  const buildDir = (options && options.buildDir) || path.join(__dirname, 'build')
  const proxy = createPortalProxy(config)

  const app = express()
  app.disable('x-powered-by')
  // Cloud Run ligger framför med en proxy; req.ip och secure-flaggor läses därifrån.
  app.set('trust proxy', config.trustedProxyHops)

  // Inramning: bara sajten själv och portalens origins får rama in sidorna
  // (förhandsvisningen). Utan preview-origins får bara sajten själv.
  const frameAncestors = ["'self'", ...config.previewOrigins].join(' ')
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', `frame-ancestors ${frameAncestors}`)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
  })

  app.get('/health', (req, res) => res.json({ status: 'ok' }))

  // Portalens anrop till sajten. Sökvägarna är portalens kontrakt och får inte prefixas.
  app.post('/api/presentation/invalidate', express.json({ limit: '16kb' }), proxy.invalidateHandler)
  app.post('/api/campaigns/webhook', express.json({ limit: '64kb' }), proxy.webhookHandler)

  // Adaptern. Klientens anrop går hit, aldrig direkt mot portalen.
  app.use('/api/portal', express.json({ limit: '64kb' }), proxy.handler)

  // Okända API-vägar svarar JSON 404, så en kontroll aldrig tror att vägen finns.
  app.use('/api', (req, res) => res.status(404).json({ success: false, error: 'Okänd väg' }))

  app.get('/go/:id', proxy.goHandler)

  app.use(express.static(buildDir, { index: false, maxAge: '1h' }))

  // SPA-fallback: bara GET och HEAD utanför /api får index.html.
  const indexFile = path.join(buildDir, 'index.html')
  app.get('*', (req, res) => {
    if (!fs.existsSync(indexFile)) return res.status(503).type('text/plain').send('Sajtens bygge saknas')
    res.setHeader('Cache-Control', 'no-cache')
    res.sendFile(indexFile)
  })

  // Allt annat (till exempel POST mot en sida) finns inte.
  app.use((req, res) => res.status(404).type('text/plain').send('Not found'))

  return app
}

if (require.main === module) {
  let app
  try {
    app = createApp(process.env)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
  const port = Number(process.env.PORT) || 8080
  app.listen(port, () => console.log(`Sajten lyssnar på port ${port}`))
}

module.exports = { createApp }
