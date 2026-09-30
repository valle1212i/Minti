// Kopierad från source-storefront-adapter main 1df51ce (adapter/server/nextBridge.d.ts). Ändra i adapter-repot, inte här.
// Handskrivna typdeklarationer för nextBridge.js. Inget byggsteg, inga beroenden.
// node --check kontrollerar inte .d.ts-filer; se README.

import type { AdapterHandler, PortalProxy } from "./portalProxy";

/** Fetch-API-formad route handler (Next.js App Router, Workers, Deno, Bun). Andra argumentet ignoreras. */
export type RouteHandler = (request: Request, context?: unknown) => Promise<Response>;

export interface NextBridgeOptions {
  /** Monteringsprefix som strippas i portalRoute. Standard "/api/portal". */
  mount?: string;
  /** Loggare för fel. Loggar aldrig headers eller kroppar. */
  logger?: { error: (msg: string) => void };
}

export interface NextBridge {
  /** Generell väg: kör vald handler med valfri sökvägsöverstyrning. */
  route(pick: (proxy: PortalProxy) => AdapterHandler, pathOverride?: (request: Request, url: URL) => string): RouteHandler;
  /** /api/portal/[...path]: adapterns routetabell. */
  portalRoute(): RouteHandler;
  /** POST /api/presentation/invalidate. */
  invalidateRoute(): RouteHandler;
  /** POST /api/campaigns/webhook. */
  webhookRoute(): RouteHandler;
  /** GET /go/[id]. */
  goRoute(): RouteHandler;
  /** Kompatibilitetslager: befintlig klientväg mappad till en adapterväg, t.ex. url => "/products". */
  compatRoute(toAdapterPath: (url: URL) => string): RouteHandler;
}

/** Headers som släpps in till adaptern: authorization, x-forwarded-for, content-type. */
export declare const INBOUND_HEADERS: readonly string[];

/**
 * Skapar bryggan. getProxy anropas per request (typiskt lazyProxy ur config.js);
 * "Missing required env: NAMN" blir 500 med namnet, andra fel 500 "Adapterfel".
 */
export declare function createNextBridge(getProxy: () => PortalProxy, options?: NextBridgeOptions): NextBridge;
