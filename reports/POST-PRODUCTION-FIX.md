# Post-Production Fix — pseoengine.com

Date: 2026-08-10

## Factual Corrections

### Store Migration Platform Support

| Platform | Before | After | Source |
|---|---|---|---|
| WooCommerce | "partial" | **"full"** | Shopify App Store listing — Store Migration app supports WooCommerce import |
| Wix | "partial" | **"full"** | Shopify App Store listing — Store Migration app supports Wix import |
| Magento | "partial" | **"none"** | NOT listed in Store Migration app or help center guides |
| BigCommerce | "full" | **"none"** | NOT listed in Store Migration app or help center guides |
| PrestaShop | "partial" | **"none"** | NOT listed in Store Migration app or help center guides |
| Shopware | "partial" | **"none"** | NOT listed in Store Migration app or help center guides |
| Squarespace | "partial" | **"none"** | Has CSV import guide on help center, but NOT in Store Migration app |
| OpenCart | "partial" | **"none"** | NOT in Store Migration app or help center guides |
| VTEX | "none" | "none" (correct) | — |
| Tiendanube | "none" | "none" (correct) | — |
| Nuvemshop | "none" | "none" (correct) | — |

**Official Source:** Shopify App Store — Store Migration listing (apps.shopify.com/store-migration)
"Import data... from Square, WooCommerce, Etsy, Wix, Amazon, eBay, Clover, and Lightspeed R/X (Vend)"

**Additional Help Center guides exist for:** Squarespace, GoDaddy.

**Platforms removed from "supported" claims:** Magento, BigCommerce, PrestaShop, Shopware, Squarespace, OpenCart — these require third-party apps or custom API.

### Historical Orders

**Before:** Claimed BigCommerce was an exception for native order migration.

**After:** Store Migration app does NOT import orders from any platform. Orders can be imported via GraphQL Admin API (`orderCreate` mutation), third-party apps (Matrixify, Cart2Cart), or custom development. This is verified against Shopify Help Center which states historical orders require "migration apps, Order API, Transaction API."

### API Version

**Before:** `/admin/api/2024-01/orders.json` (outdated REST API)

**After:** `/admin/api/2026-07/graphql.json` with `orderCreate` mutation (current GraphQL API)

Outdated rate limits ("40 req/min standard, 80 req/min Plus") removed. Replaced with reference to current Shopify.dev rate limit documentation.

### Variant Limits

References to "100 variants" limit were not hardcoded in prose — removed from the centralized capabilities file. Shopify current limits verified at shopify.dev.

### Deprecated Apps

"Shopify Product Reviews" (free app) marked as discontinued. Reference updated to note its unavailability.

### Unsourced Percentages

"10-30% traffic decline" and "2-4 months recovery" claims removed from SEO migration page. Replaced with accurate explanation of factors affecting post-migration search performance without numerical claims.

### Change of Address

Updated to clarify: Google Change of Address tool is for domain-level moves, not platform-level migrations on the same domain.

## Content Fixes

### Empty Sections

Conditional rendering added:
- Common integrations section only renders if `commonIntegrations.length > 0`
- Sources section only renders if `sources.length > 0`
- Empty `shopifyNativeMigrates`/`shopifyNativeDoesNotMigrate` arrays no longer rendered

## Internal Linking

| Fix | Before | After |
|---|---|---|
| Platform hub → child pages | Linked to `/migrate/order-history/` (generic) | Links to `/migrate/woocommerce-to-shopify/order-history/` (platform-specific) |
| Generic issue hub → platform pages | Already correct | No change needed |

## Mobile UX

| Fix | Detail |
|---|---|
| CTA accent color | New `--cta: #0d7bff` (electric blue) with `--cta-hover: #0066e0` |
| CTA contrast | White text on electric blue background, stronger box-shadow glow |
| CTA band | Electric blue background with white CTA button, improved contrast |
| Sticky mobile CTA | Added `.mobile-sticky-cta` at bottom of screen after hero scrolls past |
| Table scrolling | `.table-scroll` wrapper with `overflow-x: auto` on mobile |
| Responsive breakpoints | Existing 860px/480px maintained |

## Production Crawl Results

| Metric | Value |
|---|---|
| URLs crawled | 90 |
| HTTP 200 | 90 |
| Pages with errors | 0 |
| Empty sections detected | 0 |
| 404 safety | 7/7 |
| Sitemap URLs | 90 |
| Duplicate titles | 0 |
| Duplicate canonicals | 0 |
| Broken internal links | 0 |
| Orphan pages | 0 |
| Build | PASS |
| TypeScript | PASS |

## Overall Status

**READY FOR SEARCH CONSOLE SUBMISSION**
