/**
 * Platform data model.
 *
 * Structured facts about ecommerce platforms. Every claim here should be
 * verifiable from the platform's official documentation.
 *
 * The AI content generator reads this data to ground articles in facts.
 * Never invent platform capabilities.
 */
export interface Platform {
  slug: string;
  name: string;
  website: string;
  description: string;
  /** Full description for hub pages */
  longDescription: string;
  /** Primary market/region */
  primaryMarket: "global" | "latam" | "europe" | "north-america" | "asia";
  /** How Shopify classifies this platform in its migration docs */
  shopifyCategory: "major" | "regional" | "niche";
  /** Shopify's built-in Store Migration tool support */
  shopifyNativeMigrationSupport: "full" | "partial" | "none";
  /** Array of what Shopify's native migration can transfer */
  shopifyNativeMigrates: string[];
  /** Array of what Shopify's native migration cannot transfer */
  shopifyNativeDoesNotMigrate: string[];
  /** Overall migration complexity 1-10 */
  migrationComplexity: number;
  /** Structured data model descriptions */
  dataModel: {
    productModel: string;
    variantModel: string;
    categoryModel: string;
    customerModel: string;
    orderModel: string;
    urlStructure: string;
  };
  /** Available export methods */
  exportMethods: string[];
  /** Common plugins/extensions */
  commonPlugins: string[];
  /** Common integrations */
  commonIntegrations: string[];
  /** Known migration problems */
  knownProblems: string[];
  /** SEO considerations during migration */
  seoConsiderations: string[];
  /** Common questions merchants ask */
  commonQuestions: Array<{ q: string; a: string }>;
  /** Technology indicators (for store scanner) */
  techIndicators: string[];
  /** Sources of information */
  sources: Array<{ title: string; url: string; publisher: string }>;
}

export interface MigrationIssue {
  slug: string;
  title: string;
  description: string;
  /** Platforms this issue affects */
  affectedPlatforms: string[];
  /** What data transfers */
  whatMigrates: string[];
  /** What data does not transfer */
  whatDoesNotMigrate: string[];
  /** Specific risks */
  risks: string[];
  /** Recommended approach */
  recommendedApproach: string;
  /** Complexity 1-10 */
  complexity: number;
  /** Detailed technical notes */
  technicalNotes: string[];
  /** Related issue slugs */
  relatedIssues: string[];
  /** Whether this issue has a page */
  hasPage: boolean;
  /** Page priority (for content registry) */
  priority: number;
  /** Search intent(s) covered */
  intents: string[];
  /** Sources */
  sources: Array<{ title: string; url: string; publisher: string }>;
}

import type { SEOPerformance } from "./provenance";

export interface ContentPage {
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  type: "migration" | "problem" | "comparison" | "tool" | "learn" | "hub";
  locale: string;
  status: "draft" | "review" | "published" | "noindex";
  priority: number;
  platform?: string;
  problem?: string;
  /** For comparison pages */
  compareSubjects?: string[];
  /** Quality score 0-100 */
  qualityScore?: number;
  /** SEO experiment metadata */
  seoExperiment?: {
    cluster: string;
    primaryIntent: string;
    targetQuery: string;
    queryVariants: string[];
    hypothesis: string;
  };
  /** GSC performance data — null until real data exists */
  seoPerformance?: SEOPerformance;
}

export interface Lead {
  id: string;
  email: string;
  storeUrl: string;
  platform: string;
  annualRevenueRange: string;
  productCount: number;
  monthlyOrders: number;
  b2b: boolean;
  physicalRetail: boolean;
  countries: string[];
  sourceUrl: string;
  landingPage: string;
  searchCluster: string;
  score: number;
  classification: "self-service" | "potential-client" | "high-value";
  createdAt: string;
}
