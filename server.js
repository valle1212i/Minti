// server.js — serverar konceptsajten Minti (React-bygget i build/).
//
// Minti är en demosajt med demodata i repot (src/data/). Servern har ingen koppling till
// kundportalen, ingen tenant och inga hemligheter, och läser inga miljövariabler utom PORT.
//
//   GET  /health        hälsokontroll (JSON)
//   *    /api/*         404 JSON (sajten har inget API)
//   GET  statiska filer ur build/
//   GET  kända sidor    index.html med status 200 (src/data/routes.json)
//   GET  övrigt         index.html med status 404 (appen visar sin 404-sida)

'use strict'

const path = require('node:path')
const fs = require('node:fs')
const express = require('express')
const ROUTES = require('./src/data/routes.json')

// "/product/:id" blir /^\/product\/[^/]+\/?$/
const ROUTE_PATTERNS = ROUTES.map((r) => new RegExp(`^${r.replace(/:[a-z]+/gi, '[^/]+')}/?$`))

function isKnownRoute(pathname) {
  return ROUTE_PATTERNS.some((re) => re.test(pathname))
}

function createApp(options) {
  const buildDir = (options && options.buildDir) || path.join(__dirname, 'build')
  const app = express()
  app.disable('x-powered-by')

  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'")
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
  })

  app.get('/health', (req, res) => res.json({ status: 'ok' }))

  app.use('/api', (req, res) => res.status(404).json({ success: false, error: 'Okänd väg' }))

  app.use(express.static(buildDir, { index: false, maxAge: '1h' }))

  const indexFile = path.join(buildDir, 'index.html')
  app.get('*', (req, res) => {
    if (!fs.existsSync(indexFile)) return res.status(503).type('text/plain').send('Sajtens bygge saknas')
    res.setHeader('Cache-Control', 'no-cache')
    res.status(isKnownRoute(req.path) ? 200 : 404).sendFile(indexFile)
  })

  app.use((req, res) => res.status(404).type('text/plain').send('Not found'))

  return app
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 8080
  createApp().listen(port, () => console.log(`Sajten lyssnar på port ${port}`))
}

module.exports = { createApp, isKnownRoute }
