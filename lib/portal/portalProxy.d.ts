// Kopierad från source-storefront-adapter main 1df51ce (adapter/server/portalProxy.d.ts). Ändra i adapter-repot, inte här.
// Handskrivna typdeklarationer för portalProxy.js. Inget byggsteg, inga beroenden.
// TypeScript hittar filen automatiskt bredvid portalProxy.js (även när filen
// kopieras in i en sajt). node --check kontrollerar inte .d.ts-filer; se README.

/** Konfiguration till createPortalProxy. Se config.d.ts för att läsa den ur env. */
export interface PortalProxyConfig {
  /** Portalens bas-URL, server-till-server (SOURCE_BASE_URL). */
  baseUrl: string;
  /** Tenant-slug (SOURCE_TENANT_ID). Gemenas. Läses aldrig ur request. */
  tenant: string;
  /** Portal-origins som får skicka förhandsvisning (SOURCE_PREVIEW_ORIGINS). Tom = av. */
  previewOrigins?: string[];
  /** Delad hemlighet för inkommande invalidering och lagerwebhook (FRONTEND_SYNC_SECRET). */
  syncSecret?: string;
  /** Portalens API-nyckel för /analytics/events (ANALYTICS_API_KEY). */
  analyticsApiKey?: string;
  /** Portalens publika URL för /go/:id (PORTAL_PUBLIC_URL). Faller till baseUrl. */
  publicUrl?: string;
  /** Slår på POST /analytics/ingest (PORTAL_ANALYTICS_INGEST=true). */
  analyticsIngest?: boolean;
  /** Antal betrodda proxy-hopp för X-Forwarded-For (TRUSTED_PROXY_HOPS). Standard 1. */
  trustedProxyHops?: number;
  /** Loggare. Loggar aldrig hemligheter. */
  logger?: { info?: (msg: string) => void; warn?: (msg: string) => void; error?: (msg: string) => void };
}

/**
 * Express-formad request som adaptern läser. Express, functions-framework och
 * nextBridge.js levererar alla detta. Bara dessa fält används.
 */
export interface AdapterRequest {
  method: string;
  /** Sökväg relativt monteringspunkten, t.ex. "/products". */
  path?: string;
  /** Sökväg plus query, används om path saknas. */
  url: string;
  /** Headers med gemena namn. Adaptern läser bara authorization och x-forwarded-for. */
  headers: Record<string, string | undefined>;
  query?: Record<string, string | undefined>;
  body?: unknown;
  params?: Record<string, string>;
  ip?: string | null;
  socket?: { remoteAddress?: string };
}

/** Express-formad response som adaptern skriver till. */
export interface AdapterResponse {
  statusCode?: number;
  status(code: number): AdapterResponse;
  setHeader(name: string, value: string): void;
  set?(name: string, value: string): void;
  send?(body: string): void;
  end(body?: string): void;
  redirect?(status: number, location: string): void;
}

/** Signaturen för alla adapterns handlers (handler, invalidateHandler, webhookHandler, goHandler). */
export type AdapterHandler = (req: AdapterRequest, res: AdapterResponse) => void | Promise<void>;

export interface PortalProxy {
  /** Sluten routetabell under monteringsprefixet; okända vägar ger 404. */
  handler: AdapterHandler;
  /** POST /api/presentation/invalidate: 401 fel hemlighet, 400 okänd yta, 200 { success, surface, invalidated }. */
  invalidateHandler: AdapterHandler;
  /** POST /api/campaigns/webhook: 401 fel hemlighet, annars 200 { received: true }. */
  webhookHandler: AdapterHandler;
  /** GET /go/:id: 302 till publicUrl + portalPath med no-store, annars 404. */
  goHandler: AdapterHandler;
  /** Exponerat för tester. */
  caches: { presets: unknown; layouts: unknown; catalog: unknown };
  constants: {
    PRESET_SURFACES: readonly string[];
    DEFAULT_PRESET: Readonly<Record<string, unknown>>;
    BOOKING_DEFAULTS: Readonly<Record<string, unknown>>;
    TENANT: string;
  };
  /** Routetabellen som [metod, mönsterkälla]-par. */
  routeTable: Array<[string, string]>;
}

export declare function createPortalProxy(config: PortalProxyConfig): PortalProxy;

/** Bakåtkompatibelt namn; delegerar till nextBridge.js. Använd createNextBridge direkt. */
export declare function nextAdapter(handler: AdapterHandler): (request: Request, context?: unknown) => Promise<Response>;

export declare const PRESET_SURFACES: readonly string[];
export declare const DEFAULT_PRESET: Readonly<Record<string, unknown>>;
export declare const BOOKING_DEFAULTS: Readonly<Record<string, unknown>>;
export declare function mergePreset(surface: string, incoming: unknown): Record<string, unknown>;
export declare function timingSafeEqualString(a: unknown, b: unknown): boolean;
