/**
 * Factual provenance model.
 *
 * Every factual claim in the system must track its source,
 * verification status, and confidence level.
 *
 * No AI-generated content should be presented as verified fact.
 */

export interface FactSource {
  url: string;
  title: string;
  publisher: string;
  /** When the source was published */
  publishedAt?: string;
  /** When we last accessed/verified this source */
  accessedAt: string;
  sourceType: "official_shopify" | "official_platform" | "official_app" | "official_documentation" | "secondary_source";
  confidence: "high" | "medium" | "low";
}

export interface FactualClaim {
  /** Unique ID for internal tracking */
  id: string;
  /** The factual statement */
  statement: string;
  /** What topic/domain this relates to */
  domain: string;
  /** Platforms this claim applies to (empty = all) */
  platforms: string[];
  /** Source evidence */
  sources: FactSource[];
  /** Whether this claim has been manually verified */
  verified: boolean;
  /** When this fact was last updated */
  updatedAt: string;
  /** Whether this fact may be time-sensitive */
  timeSensitive: boolean;
  /** Notes about verification status */
  notes?: string;
}

/**
 * Centralized Shopify Store Migration capabilities.
 *
 * Every page that references Shopify's migration tool must consume
 * this shared data. Capabilities are updated in one place.
 */
export interface StoreMigrationCapability {
  capability: string;
  /** Whether Shopify's native tool supports this */
  supported: boolean | "partial" | "platform-dependent";
  /** Conditions under which it works */
  conditions: string;
  /** Limitations */
  limitations: string;
  /** Notes for content */
  notes: string;
  /** Source evidence */
  sourceUrl: string;
  /** When last verified */
  verifiedAt: string;
}

/**
 * GSC-ready SEO performance model.
 * Values are null until real data exists.
 */
export interface SEOPerformance {
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  position: number | null;
  lastUpdated: string | null;
}
