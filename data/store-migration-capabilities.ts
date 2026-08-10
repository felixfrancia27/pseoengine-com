/**
 * Centralized Shopify Store Migration capabilities.
 *
 * Every page that references the Shopify Store Migration app's
 * capabilities must consume this shared data. Updated centrally.
 *
 * Verified against Shopify documentation as of August 2026.
 */

import type { StoreMigrationCapability } from "../app/content/provenance";

export const STORE_MIGRATION_CAPABILITIES: StoreMigrationCapability[] = [
  {
    capability: "Products (simple)",
    supported: true,
    conditions: "CSV export from source platform with proper column mapping to Shopify product fields",
    limitations: "Maximum ~15MB file size. Custom fields, EAV attributes, and non-standard product data require manual mapping or third-party tools.",
    notes: "WooCommerce, Magento, BigCommerce, PrestaShop, Shopware, Wix, Squarespace, and OpenCart are supported. VTEX, Tiendanube, Nuvemshop are not.",
    sourceUrl: "https://help.shopify.com/en/manual/migrating-to-shopify",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Product variants",
    supported: "partial",
    conditions: "Up to 3 option dimensions and 100 variants per product. Source platform variants must map to Shopify's option1/option2/option3 structure.",
    limitations: "Products with >3 options or >100 variants must be split. Magento configurable products may not map correctly due to EAV model. PrestaShop combination-specific images not transferred.",
    notes: "Plan product splitting before migration for stores with complex variant structures.",
    sourceUrl: "https://help.shopify.com/en/manual/products/variants/add-variants",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Product images",
    supported: true,
    conditions: "Images referenced by URL in the CSV import file. Shopify downloads images during import.",
    limitations: "Large product catalogs with many images may hit Shopify's import rate limits. Image file names must be accessible via public URL.",
    notes: "Images are downloaded and stored in Shopify's CDN. Original URLs are not preserved.",
    sourceUrl: "https://help.shopify.com/en/manual/migrating-to-shopify",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Product categories / collections",
    supported: true,
    conditions: "Categories from source platform mapped as Shopify custom collections if smart collection rules cannot be replicated.",
    limitations: "Shopify collections are flat (no nested hierarchy beyond 1 level). Smart collections require product conditions that may not match source platform's category logic. Magento category tree depth is not preserved.",
    notes: "Plan collection structure before import. Consider using product tags for faceted navigation.",
    sourceUrl: "https://help.shopify.com/en/manual/products/collections",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Customers",
    supported: true,
    conditions: "Customer CSV with email, first_name, last_name, addresses. Email is the unique identifier.",
    limitations: "Customer passwords cannot be migrated (hashing algorithm incompatibility). Saved payment methods cannot be transferred. Customer groups, tiers, and B2B company accounts not supported natively.",
    notes: "Import customers before orders. Send account invite emails after import so customers can set new passwords. Shopify Plus Multipass can bridge authentication.",
    sourceUrl: "https://help.shopify.com/en/manual/customers/import-export-customers",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Customer passwords",
    supported: false,
    conditions: "N/A — password hashing is platform-specific and irreversible.",
    limitations: "WooCommerce uses phpass, Magento uses SHA-256+32char salt, Shopify uses BCrypt. Hashes are incompatible and cannot be converted.",
    notes: "Send account invite emails after customer import. Shopify Plus stores can use Multipass for SSO-based authentication bridging.",
    sourceUrl: "https://shopify.dev/docs/api/multipass",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Order history",
    supported: "platform-dependent",
    conditions: "BigCommerce orders can be imported natively. For all other platforms (WooCommerce, Magento, PrestaShop, etc.), the native tool does not import orders.",
    limitations: "Orders must reference existing customer and product records. Payment transactions, discounts, and tax breakdowns may not import completely. API rate limits apply (40 req/min standard).",
    notes: "For most stores, historical orders should be exported to a separate reporting system. If Shopify order history is required, use Matrixify or the Shopify Admin API.",
    sourceUrl: "https://help.shopify.com/en/manual/migrating-to-shopify",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Product reviews",
    supported: false,
    conditions: "N/A — Shopify does not have a native reviews system. All reviews require a third-party app.",
    limitations: "WooCommerce reviews stored as WordPress comments. Magento reviews in review/review_detail tables. Each review platform has different data structures.",
    notes: "Use Judge.me (free WooCommerce migration), Yotpo, Stamped, or Loox for review import. Some offer CSV import with product handle mapping.",
    sourceUrl: "https://help.shopify.com/en/manual/products/product-reviews",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Blog posts",
    supported: false,
    conditions: "N/A — Shopify's Store Migration app does not migrate blog content.",
    limitations: "WordPress blog posts, Magento CMS pages, PrestaShop CMS, and other platform content pages are not migrated.",
    notes: "Blog content must be manually recreated in Shopify or maintained on a separate subdomain with a reverse proxy. Consider keeping WordPress/Wix/etc. for blogging at blog.yourdomain.com.",
    sourceUrl: "https://help.shopify.com/en/manual/online-store/blogs",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "URL redirects",
    supported: "partial",
    conditions: "Shopify supports up to 100,000 redirects via admin, CSV import, or API. Redirects are exact-match path redirects.",
    limitations: "No regex/pattern-based redirects. No automatic creation of redirects from old URLs. Redirects only work on the primary domain. Query parameters are ignored in redirect matching.",
    notes: "Create a complete 301 redirect map before migration. For stores with >100K URLs or complex redirect rules, use a CDN (Cloudflare Workers) or reverse proxy.",
    sourceUrl: "https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "SEO metadata",
    supported: "partial",
    conditions: "Meta titles and descriptions can be mapped from CSV during product/category import. Image alt text transfers with images.",
    limitations: "Platform-specific SEO plugins (Yoast, RankMath, MageWorx) store SEO data in formats that require custom export. Structured data (schema.org) must be re-implemented. Canonical tags may reference old URLs.",
    notes: "Export SEO metadata separately from product data. Map to Shopify's SEO fields (page_title, meta_description on products, collections, pages). Verify canonicalls after migration.",
    sourceUrl: "https://help.shopify.com/en/manual/promoting-marketing/seo",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Gift cards / store credit",
    supported: false,
    conditions: "N/A — Platform-specific gift card systems are not compatible.",
    limitations: "WooCommerce gift cards, Magento gift cards, PrestaShop vouchers — none can be transferred. Store credit balances are lost.",
    notes: "Issue Shopify gift cards for equivalent value to affected customers. Contact customers with active gift card balances before migration.",
    sourceUrl: "https://help.shopify.com/en/manual/products/gift-card-products",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Coupons / discounts",
    supported: false,
    conditions: "N/A — Coupon usage history and platform-specific discount rules are not migrated.",
    limitations: "WooCommerce coupons, Magento cart price rules, PrestaShop cart rules — discount configurations and usage history are not transferred.",
    notes: "Recreate active discount codes in Shopify. Historical coupon usage data should be exported separately for reporting.",
    sourceUrl: "https://help.shopify.com/en/manual/discounts",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Digital products / downloads",
    supported: false,
    conditions: "N/A — Downloadable products are not supported by the migration tool.",
    limitations: "WooCommerce downloadable products, Shopware digital products — file attachments and download permissions are not migrated.",
    notes: "Use Shopify's Digital Downloads app and re-upload files. Reconfigure download limits and access permissions.",
    sourceUrl: "https://help.shopify.com/en/manual/products/downloadable-products",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Subscriptions",
    supported: false,
    conditions: "N/A — Active subscriptions cannot be migrated by any native Shopify tool.",
    limitations: "WooCommerce Subscriptions, Magento recurring profiles — billing schedules, payment tokens, and subscription history cannot be transferred. Customers must re-subscribe on Shopify.",
    notes: "Use Recharge, Bold Subscriptions, or Appstle. Run old and new platforms in parallel for 1-2 billing cycles. Contact subscribers before migration.",
    sourceUrl: "https://help.shopify.com/en/manual/products/subscriptions",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "B2B / wholesale",
    supported: false,
    conditions: "N/A — B2B features are not migrated by the native tool.",
    limitations: "Magento B2B company accounts, BigCommerce customer groups, shared catalogs, tier pricing, quote management — none transfer natively.",
    notes: "Shopify Plus offers B2B features (company accounts, price lists, payment terms). Third-party apps (SparkLayer, B2B Handsfree) can fill gaps.",
    sourceUrl: "https://help.shopify.com/en/manual/b2b",
    verifiedAt: "2026-08-09",
  },
  {
    capability: "Multiple stores / store views",
    supported: false,
    conditions: "N/A — Multi-store configurations are not supported by the migration tool.",
    limitations: "Magento multiple websites/stores, PrestaShop multi-store, VTEX multi-account — each store requires separate migration.",
    notes: "Each store becomes a separate Shopify store or a separate expansion store if using Shopify Plus. Redirect planning needed for store-specific domains.",
    sourceUrl: "https://help.shopify.com/en/manual/migrating-to-shopify",
    verifiedAt: "2026-08-09",
  },
];

/**
 * Look up a capability by name.
 */
export function getCapability(name: string): StoreMigrationCapability | undefined {
  return STORE_MIGRATION_CAPABILITIES.find(
    (c) => c.capability.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get all capabilities relevant to a specific migration problem slug.
 */
export function getCapabilitiesForProblem(problemSlug: string): StoreMigrationCapability[] {
  const mapping: Record<string, string[]> = {
    "order-history": ["Order history"],
    seo: ["SEO metadata", "URL redirects"],
    redirects: ["URL redirects"],
    "customer-passwords": ["Customer passwords", "Customers"],
    subscriptions: ["Subscriptions"],
    reviews: ["Product reviews"],
    "customer-groups": ["Customers"],
    integrations: [],
    b2b: ["B2B / wholesale"],
    "configurable-products": ["Product variants"],
    "shopify-store-migration-limitations": [],
  };

  const names = mapping[problemSlug] || [];
  return names.map((n) => getCapability(n)).filter(Boolean) as StoreMigrationCapability[];
}
