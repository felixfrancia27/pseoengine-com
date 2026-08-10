/**
 * Centralized Shopify Store Migration capabilities.
 *
 * Verified against the Shopify App Store listing for Store Migration
 * and Shopify Help Center as of 2026-08-10.
 *
 * Official App Store listing supports:
 *   Square, WooCommerce, Etsy, Wix, Amazon, eBay, Clover, Lightspeed R/X (Vend)
 *
 * Shopify Help Center has additional CSV migration guides for:
 *   Squarespace, GoDaddy
 *
 * All other platforms require third-party migration apps or custom development.
 */

export const SHOPIFY_STORE_MIGRATION_SUPPORTED_SOURCES = [
  "woocommerce",
  "wix",
] as const;

export const SHOPIFY_STORE_MIGRATION_HELP_CENTER_GUIDES = [
  ...SHOPIFY_STORE_MIGRATION_SUPPORTED_SOURCES,
  "squarespace",
] as const;

export const SHOPIFY_STORE_MIGRATION_MARKETPLACE_SOURCES = [
  "amazon",
  "ebay",
  "etsy",
] as const;

export const SHOPIFY_STORE_MIGRATION_POS_SOURCES = [
  "square",
  "clover",
  "lightspeed",
] as const;

export function hasStoreMigrationSupport(platformSlug: string): boolean {
  return SHOPIFY_STORE_MIGRATION_SUPPORTED_SOURCES.includes(platformSlug as any);
}

export function hasMigrationGuide(platformSlug: string): boolean {
  return SHOPIFY_STORE_MIGRATION_HELP_CENTER_GUIDES.includes(platformSlug as any);
}

export const STORE_MIGRATION_APP_URL = "https://apps.shopify.com/store-migration";

export const STORE_MIGRATION_SOURCE_URL = "https://help.shopify.com/en/manual/migrating-to-shopify";

export const STORE_MIGRATION_VERIFIED_AT = "2026-08-10";

export const API_VERSION = "2026-07";

export const API_GRAPHQL_ENDPOINT = "/admin/api/2026-07/graphql.json";

export const PRODUCT_VARIANT_LIMIT = 2048;

export const PRODUCT_OPTION_LIMIT = 3;

export const REDIRECT_LIMIT = 100000;

/**
 * Store Migration app capabilities.
 *
 * The Store Migration app focuses on product and customer data import
 * from 8 supported platforms. It does NOT import orders, reviews,
 * blog posts, or other content types.
 */
export const STORE_MIGRATION_IMPORTABLE = [
  "Products (via CSV upload or direct account connection)",
  "Product images (downloaded from source URLs during import)",
  "Customers (name, email, addresses)",
] as const;

export const STORE_MIGRATION_NOT_IMPORTABLE = [
  "Order history (requires third-party apps or API)",
  "Customer passwords (hashing incompatibility — any platform)",
  "Product reviews (requires third-party review app)",
  "Blog posts and CMS pages",
  "Gift cards, certificates, and store credit",
  "Discount codes and coupon history",
  "Custom fields not mappable to standard Shopify fields",
  "Subscription data and payment tokens",
] as const;

/**
 * How to migrate what the app can't handle
 */
export const ALTERNATIVE_MIGRATION_METHODS: Record<string, string> = {
  orders:
    "Use the Shopify GraphQL Admin API (orderCreate mutation at /admin/api/2026-07/graphql.json), third-party apps like Matrixify, or Cart2Cart.",
  reviews:
    "Use a Shopify review app with import capability: Judge.me (free WooCommerce migration), Yotpo, Stamped, or Loox.",
  pages:
    "Manually recreate pages in Shopify, or use a migration app that supports content transfer.",
  customers:
    "Import via CSV or Customer API. Send account invite emails for password reset. Shopify Plus stores can use Multipass for SSO.",
  subscriptions:
    "Choose a Shopify subscription app (Recharge, Bold, Appstle), configure products, and migrate active subscribers manually with customer communication.",
};
