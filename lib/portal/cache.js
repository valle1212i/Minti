// Kopierad från source-storefront-adapter main 1df51ce (adapter/server/cache.js). Ändra i adapter-repot, inte här.
// Minimal TTL-cache i processminne med stale-fallback.
//
// Mönstret är referenssajtens (server.js presetCache/navLayoutCache/landingLayoutCache
// med timestamp-nollning) uttryckt som en klass, så att invalidering och
// fail-open ser likadana ut för alla ytor. Invalidering MARKERAR posten som
// utgången i stället för att radera den: en utgången post är fortfarande det
// bästa svaret om portalen inte nås direkt efter (fail-open till senast kända).
//
// Cachen är per process. På en runtime som skalar till flera instanser får
// varje instans sin egen cache; portalens invalidering träffar bara den
// instans som lastbalanseraren råkade välja, och de andra väntar ut TTL:n.
// Det är samma begränsning som referenssajten har, och den är acceptabel med 60 s TTL.
// Vill kunden ha strikt konsistens över instanser krävs en delad cache
// (Redis eller motsvarande), vilket är ett eget beslut.

'use strict'

class TtlCache {
  constructor(defaultTtlMs) {
    this.defaultTtlMs = defaultTtlMs
    this.map = new Map() // key → { value, expiresAt }
  }

  get(key) {
    const hit = this.map.get(key)
    if (!hit) return undefined
    if (Date.now() >= hit.expiresAt) return undefined
    return hit.value
  }

  getStale(key) {
    const hit = this.map.get(key)
    return hit ? hit.value : undefined
  }

  set(key, value, ttlMs) {
    this.map.set(key, { value, expiresAt: Date.now() + (ttlMs || this.defaultTtlMs) })
  }

  expire(key) {
    const hit = this.map.get(key)
    if (hit) hit.expiresAt = 0
  }

  expireWhere(predicate) {
    for (const [key, hit] of this.map) if (predicate(key)) hit.expiresAt = 0
  }

  clear() {
    this.map.clear()
  }
}

module.exports = { TtlCache }
