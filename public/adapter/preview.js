// Kopierad från source-storefront-adapter main 1df51ce (adapter/client/preview.js). Ändra i adapter-repot, inte här.
// Portaladapter — klientdel: mottagare för portalens live-förhandsvisning.
//
// Vanilla JS, inga beroenden, kan laddas som <script> eller importeras som modul
// (window.SourcePreview eller export). Ramverksoberoende: modulen rör aldrig
// DOM:en själv utan anropar sidans egna callbacks.
//
// Mekaniken (recon onboarding-integrationsyta.md avsnitt 5): portalen laddar
// sajten i en iframe på en fast sökväg, postar meddelanden med window.postMessage
// och väntar på SOURCE_PREVIEW_ACK. Utan ACK inom 16 × 500 ms (bokning,
// kategorier, nyheter) eller 10 × 500 ms (prenumerationer) faller portalen
// tillbaka till en mock. VARJE accepterat meddelande ska därför kvitteras.
//
// Vad skiljer från referenssajten (src/lib/previewBridge.js på origin/main):
//  AVVIKELSE 1: origin-listan är INTE hårdkodad. Den hämtas från serverns
//    GET /api/portal/config ({ previewOrigins }) som läser SOURCE_PREVIEW_ORIGINS.
//    Tom lista = förhandsvisning av (fail closed). Sajtens egen origin läggs
//    ALDRIG till automatiskt; vill man testa lokalt sätter man den i env.
//    (referenssajten lägger till window.location.origin med kommentaren "ta bort före prod".)
//  AVVIKELSE 2: en enda lyssnare per sida med surface-filter, i stället för
//    en lyssnare per komponent med egna inline-kopior av origin-listan.
//  AVVIKELSE 3: ACK skickas ALLTID med surface. Portalens bokningssida ignorerar
//    ACK med annan surface (bokningsdesign.js:640–655); övriga sidor kräver bara
//    type. Att alltid sätta surface är kompatibelt med alla.
//  AVVIKELSE 4: event.source sparas som betrodd avsändare och ORDER_CHANGED
//    skickas bara dit — samma som referenssajten, men här också för PRODUCT/PRESET så att
//    ett andra fönster inte kan "ta över" en pågående session.
//
// Meddelandetyper som accepteras (från portalen):
//   SOURCE_PREVIEW_PRESET   { type, surface, preset }
//   SOURCE_PREVIEW_PRODUCT  { type, product, styling?, draftOrderable? }   (surface saknas ofta — se nedan)
//   SOURCE_PREVIEW_ORDER    { type, surface, order: [key, ...] }
//   SOURCE_PREVIEW_CLEAR    { type, surface? }
// Meddelande som sajten skickar (till portalen):
//   SOURCE_PREVIEW_ORDER_CHANGED { type, surface, order: [key, ...] }
// Kvittens:
//   SOURCE_PREVIEW_ACK      { type, surface }

;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory()
  else root.SourcePreview = factory()
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict'

  var TYPES = {
    PRESET: 'SOURCE_PREVIEW_PRESET',
    PRODUCT: 'SOURCE_PREVIEW_PRODUCT',
    ORDER: 'SOURCE_PREVIEW_ORDER',
    CLEAR: 'SOURCE_PREVIEW_CLEAR',
    ACK: 'SOURCE_PREVIEW_ACK',
    ORDER_CHANGED: 'SOURCE_PREVIEW_ORDER_CHANGED'
  }

  // Utkastkortets id. Portalens skapa-modal för prenumerationer identifierar
  // utkastet med exakt denna sträng i ORDER_CHANGED (prenumeration-skapa.js:28).
  var PREVIEW_ID = '__preview__'

  function isPlainObject(v) { return !!v && typeof v === 'object' && !Array.isArray(v) }

  // Filtrera ett inkommande preset mot sidans kända nycklar. Okända nycklar
  // ignoreras tyst så portalen aldrig kan injicera godtyckliga fält.
  function pickKeys(obj, keys) {
    var out = {}
    if (!isPlainObject(obj)) return out
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k]
    }
    return out
  }

  /**
   * Startar mottagaren på en sida.
   *
   * @param {object} opts
   * @param {string}   opts.surface        'categories' | 'news' | 'subscriptions' | 'gift_cards' | 'booking' | 'products'
   * @param {string[]} opts.allowedOrigins Portal-origins (från GET /api/portal/config). Tom = av.
   * @param {string[]} [opts.presetKeys]   Nycklar som får sättas via PRESET (sidans defaults-nycklar).
   * @param {function} [opts.onPreset]     (preset) → void. Lägg presetet över det sparade och rendera om.
   * @param {function} [opts.onProduct]    (product, styling, draftOrderable) → void. Visa utkastkortet.
   * @param {function} [opts.onOrder]      (orderKeys) → void. Sortera om listan lokalt (tillfälligt).
   * @param {function} [opts.onClear]      () → void. Återställ sparat tillstånd.
   * @param {boolean}  [opts.strictSurface] Kräv att inkommande surface matchar (standard: true för PRESET/ORDER, false för PRODUCT).
   * @returns {{ stop: function, sendOrderChanged: function(string[]): boolean, isActive: function }}
   */
  function start(opts) {
    if (!opts || typeof opts.surface !== 'string') throw new Error('SourcePreview.start: surface krävs')
    var origins = Array.isArray(opts.allowedOrigins) ? opts.allowedOrigins.filter(function (o) { return typeof o === 'string' && o }) : []
    var surface = opts.surface
    var trusted = null // { source, origin } för den avsändare som först talade med oss
    var active = false

    // Fail closed: utan origins lyssnar vi inte alls. Ingen mottagare betyder att
    // portalen visar sin mock — synligt och ofarligt.
    if (origins.length === 0) {
      return { stop: function () {}, sendOrderChanged: function () { return false }, isActive: function () { return false } }
    }

    function ack(event) {
      // Till avsändarfönstret, med event.origin som targetOrigin. Aldrig '*'.
      if (event && event.source && typeof event.source.postMessage === 'function') {
        event.source.postMessage({ type: TYPES.ACK, surface: surface }, event.origin)
      }
    }

    function surfaceMatches(d, required) {
      if (typeof d.surface !== 'string') return !required
      return d.surface === surface
    }

    function onMessage(event) {
      if (origins.indexOf(event.origin) === -1) return
      var d = event.data
      if (!isPlainObject(d) || typeof d.type !== 'string') return

      // Första betrodda meddelandet låser avsändaren. Ett annat fönster från en
      // tillåten origin får inte kapa sessionen.
      if (trusted && event.source !== trusted.source) return

      switch (d.type) {
        case TYPES.PRESET: {
          if (!surfaceMatches(d, opts.strictSurface !== false)) return
          var preset = opts.presetKeys ? pickKeys(d.preset, opts.presetKeys) : (isPlainObject(d.preset) ? d.preset : {})
          if (typeof opts.onPreset === 'function') opts.onPreset(preset)
          break
        }
        case TYPES.PRODUCT: {
          // Portalens PRODUCT-meddelanden bär ofta ingen surface (produktguiden,
          // presentkortsmodalen). Matcha bara om fältet finns.
          if (!surfaceMatches(d, false)) return
          if (typeof opts.onProduct === 'function') opts.onProduct(isPlainObject(d.product) ? d.product : {}, isPlainObject(d.styling) ? d.styling : null, d.draftOrderable === true)
          break
        }
        case TYPES.ORDER: {
          if (!surfaceMatches(d, opts.strictSurface !== false)) return
          if (typeof opts.onOrder === 'function') opts.onOrder(Array.isArray(d.order) ? d.order.filter(function (k) { return typeof k === 'string' && k }) : [])
          break
        }
        case TYPES.CLEAR: {
          if (!surfaceMatches(d, false)) return
          if (typeof opts.onClear === 'function') opts.onClear()
          break
        }
        default:
          return // okända typer ignoreras utan ACK
      }

      if (!trusted) trusted = { source: event.source, origin: event.origin }
      active = true
      ack(event)
    }

    window.addEventListener('message', onMessage)

    return {
      stop: function () { window.removeEventListener('message', onMessage); trusted = null; active = false },
      isActive: function () { return active },
      // Den nya ordningen tillbaka till portalen — bara till den betrodda avsändaren.
      sendOrderChanged: function (order) {
        if (!trusted || !trusted.source) return false
        trusted.source.postMessage({ type: TYPES.ORDER_CHANGED, surface: surface, order: Array.isArray(order) ? order : [] }, trusted.origin)
        return true
      }
    }
  }

  // Hjälpare: hämta konfigurationen från adaptern. Returnerar [] vid fel (fail closed).
  function fetchAllowedOrigins(configUrl) {
    return fetch(configUrl || '/api/portal/config', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : {} })
      .then(function (j) { return Array.isArray(j.previewOrigins) ? j.previewOrigins : [] })
      .catch(function () { return [] })
  }

  // Hjälpare: sortera en lista efter en ordning från portalen. Poster som inte
  // nämns hamnar sist i bevarad ordning; okända nycklar ignoreras. Speglar referenssajtens
  // applyPreviewOrder. Nyckeln läses ur item[matchKey] eller item.id.
  function applyOrder(items, order, matchKey) {
    matchKey = matchKey || 'baseSku'
    var list = Array.isArray(items) ? items : []
    if (!Array.isArray(order) || order.length === 0) return list
    var pos = {}
    var n = 0
    order.forEach(function (k) { if (typeof k === 'string' && k && !(k in pos)) pos[k] = n++ })
    var mentioned = [], rest = []
    list.forEach(function (it) {
      var p = it ? (pos[it[matchKey]] !== undefined ? pos[it[matchKey]] : pos[it.id]) : undefined
      if (p === undefined) rest.push(it); else mentioned.push({ it: it, p: p })
    })
    mentioned.sort(function (a, b) { return a.p - b.p })
    return mentioned.map(function (m) { return m.it }).concat(rest)
  }

  // Hjälpare: nycklar i visningsordning för ORDER_CHANGED. Utkastet (__preview__)
  // tas med bara när allowDraft är satt (skapa-modalen), aldrig i sidopreviewen.
  function orderKeys(items, matchKey, allowDraft) {
    matchKey = matchKey || 'baseSku'
    return (Array.isArray(items) ? items : []).map(function (it) {
      if (!it) return null
      var k = it[matchKey] || it.id
      if (typeof k !== 'string' || !k) return null
      if (k === PREVIEW_ID && !allowDraft) return null
      return k
    }).filter(Boolean)
  }

  return { TYPES: TYPES, PREVIEW_ID: PREVIEW_ID, start: start, fetchAllowedOrigins: fetchAllowedOrigins, applyOrder: applyOrder, orderKeys: orderKeys, pickKeys: pickKeys }
})
