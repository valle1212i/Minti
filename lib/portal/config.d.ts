// Kopierad från source-storefront-adapter main 1df51ce (adapter/server/config.d.ts). Ändra i adapter-repot, inte här.
// Handskrivna typdeklarationer för config.js. Inget byggsteg, inga beroenden.
// node --check kontrollerar inte .d.ts-filer; se README.

import type { PortalProxy, PortalProxyConfig } from "./portalProxy";

/** De obligatoriska namnen: SOURCE_BASE_URL, SOURCE_TENANT_ID, FRONTEND_SYNC_SECRET. */
export declare const REQUIRED_ENV: readonly string[];

/**
 * Läser konfigurationen ur env (standard process.env). Kastar
 * Error("Missing required env: NAMN") när ett obligatoriskt namn saknas eller är tomt.
 * Felet innehåller aldrig ett värde.
 */
export declare function readConfigFromEnv(env?: Record<string, string | undefined>): PortalProxyConfig & {
  baseUrl: string;
  tenant: string;
  syncSecret: string;
  previewOrigins: string[];
  analyticsIngest: boolean;
  trustedProxyHops: number;
};

/**
 * Lat proxy-getter: skapar proxyn vid första anrop och kastar vid varje anrop
 * tills miljön är rättad. Använd för Next och serverless; för processstart,
 * anropa readConfigFromEnv i uppstarten.
 */
export declare function lazyProxy(
  createPortalProxy: (config: PortalProxyConfig) => PortalProxy,
  env?: Record<string, string | undefined>,
  extra?: Partial<PortalProxyConfig>
): () => PortalProxy;
