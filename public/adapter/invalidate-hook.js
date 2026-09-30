// Kopierad från source-storefront-adapter main 1df51ce (adapter/client/invalidate-hook.js). Ändra i adapter-repot, inte här.
// Portaladapter — hur sajten reagerar på invalidering.
//
// Invalideringen kommer som ett server-till-server-anrop från portalen
// (POST /api/presentation/invalidate och POST /api/campaigns/webhook, se
// server/portalProxy.js). Den träffar sajtens SERVER, aldrig besökarens
// webbläsare. Klientens uppgift är därför inte att ta emot signalen utan att
// hämta om tillräckligt ofta för att den ska synas, utan att hamra.
//
// Kedjan (recon avsnitt 5.1):
//   tenant sparar i portalen → portalen POST:ar invalidate till sajten
//   → sajtens proxy nollar sin cache (60 s TTL i vanliga fall)
//   → nästa GET /api/portal/presentation/:surface från en besökare hämtar färskt
//   → besökarens sida ser ändringen när DEN hämtar om.
//
// Mönstret nedan speglar referenssajtens useRefreshOnVisible (origin/main
// src/lib/useRefreshOnVisible.js): hämta om vid visibilitychange/focus, bara om
// fliken varit dold, högst en gång per 60 s, och behåll gamla värdet vid fel.
//
// AVVIKELSE FRÅN REFERENSEN: ingen. Detta är samma beteende i vanilla JS.
//
// Navigation och landing-layout får INGEN invalidering från portalen (recon
// 5.1: PUT /api/navigation-layout och /api/landing-layout anropar inte
// notifiern). De hämtas om på samma sätt och syns inom TTL.

;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory()
  else root.SourceRefresh = factory()
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict'

  var MIN_INTERVAL_MS = 60 * 1000

  /**
   * @param {function(): Promise<any>} refetch  Funktion som hämtar om och uppdaterar sidan. Fel sväljs.
   * @param {object} [opts]
   * @param {number} [opts.minIntervalMs]       Standard 60 000.
   * @returns {{ stop: function }}
   */
  function onVisible(refetch, opts) {
    var minInterval = (opts && opts.minIntervalMs) || MIN_INTERVAL_MS
    var lastRun = Date.now()
    var wasHidden = false

    function maybeRefetch() {
      if (!wasHidden) return
      if (Date.now() - lastRun < minInterval) return
      wasHidden = false
      lastRun = Date.now()
      try { Promise.resolve(refetch()).catch(function () {}) } catch (e) { /* behåll gamla värdet */ }
    }

    function onVisibility() {
      if (document.visibilityState === 'hidden') { wasHidden = true; return }
      maybeRefetch()
    }

    function onFocus() { maybeRefetch() }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)

    return {
      stop: function () {
        document.removeEventListener('visibilitychange', onVisibility)
        window.removeEventListener('focus', onFocus)
      }
    }
  }

  // Server-sidans krok, dokumenterad här för att hålla hela kedjan på ett ställe.
  // I portalProxy.js:
  //   proxy.invalidateHandler → caches.presets.expire(surface) (+ nav/landing utom booking)
  //   proxy.webhookHandler    → caches.catalog.expireWhere(products*, categories)
  // Vill sajten göra mer (t.ex. rensa en egen SSR-cache eller en CDN-nyckel)
  // görs det i en wrapper runt handlern:
  //
  //   app.post('/api/presentation/invalidate', express.json(), (req, res) => {
  //     proxy.invalidateHandler(req, res)
  //     if (res.statusCode === 200) myOwnCache.purge(req.body.surface)
  //   })
  //
  // Svaret till portalen måste förbli 200/401/400 enligt kontraktet, och arbetet
  // ska vara klart innan 200 skickas (portalen retry:ar bara 5xx och nätverksfel).

  return { onVisible: onVisible }
})
