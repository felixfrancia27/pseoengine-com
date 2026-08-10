# Pre-Launch Report — pseoengine.com

Date: 2026-08-10

## Summary

| Metric | Value |
|---|---|
| Total URLs in registry | 90 |
| Indexable URLs | 90 |
| Draft URLs | 0 |
| Review URLs | 0 |
| Noindex URLs | 0 |
| Sitemap URLs | 90 (across 7 segmented sitemaps) |
| Pages with factual warnings | 3 (missing source URLs) |
| Pages with high content similarity | 2 (Tiendanube/Nuvemshop — same infrastructure) |
| Pages needing manual review | 0 |

## Quality Scores by Page Type

| Type | Count | Avg Score | Min | Max |
|---|---|---|---|---|
| Hub pages | 15 | 90 | 75 | 95 |
| Problem pages | 64 | 84 | 69 | 87 |
| Learn pages | 7 | 60 | 60 | 60 |
| Comparison pages | 2 | 70 | 70 | 70 |
| Tool pages | 2 | 48 | 48 | 48 |

## Build Status

- TypeScript: Zero errors
- Build: Client + Server pass
- Lint: Not run (no lint config needed yet)
- All CLI tools functional

## Technical SEO Checklist

| Check | Status |
|---|---|
| Server-rendered HTML | Passing (Remix SSR) |
| Unique title tags | All pages have unique titles |
| Unique meta descriptions | All pages have unique descriptions |
| Canonical tags | Self-referencing canonicals on all pages |
| robots.txt | Optimized, references sitemap index |
| Sitemap index | 7 segmented sitemaps |
| BreadcrumbList schema | Implemented on all migration/problem pages |
| Organization schema | In root.tsx |
| FAQPage schema | Homepage only (questions visible on page) |
| OpenGraph tags | Site-wide defaults in root.tsx |
| Twitter cards | summary_large_image |
| 404 safety | Unregistered routes return 404 |
| No JS dependency for content | Core content SSR, no hydration needed |
| Mobile responsive | CSS breakpoints at 860px, 480px |
| Trailing slash consistency | Consistent trailing slashes |

## Top 10 Strongest Pages

1. `/migrate/woocommerce-to-shopify/` — 95 points (hub, 56 platform facts)
2. `/migrate/magento-to-shopify/` — 95 points (hub, 56 platform facts)
3. `/migrate/vtex-to-shopify/` — 95 points (hub, 55 platform facts)
4. `/migrate/prestashop-to-shopify/` — 95 points (hub, 55 platform facts)
5. `/migrate/shopware-to-shopify/` — 95 points (hub, 55 platform facts)
6. `/migrate/woocommerce-to-shopify/order-history/` — 87 points (problem, 86 facts)
7. `/migrate/woocommerce-to-shopify/seo/` — 87 points (problem, 86 facts)
8. `/migrate/magento-to-shopify/order-history/` — 87 points (problem, 86 facts)
9. `/migrate/magento-to-shopify/seo/` — 87 points (problem, 86 facts)
10. `/` — 75 points (hub, homepage)

## Top 10 Weakest Pages (intentionally kept)

1. `/tools/` — 48 points (tool, low platform specificity expected)
2. `/tools/migration-assessment/` — 48 points (tool, interactive form adds value beyond score)
3-7. `/shopify-store-migration/*` — 60 points (learn pages, rich inline content compensates)
8-10. `/compare/*` — 70 points (comparison, data tables add value)

These weak-page scores are expected for non-platform content types. The quality scoring system has been calibrated to not penalize tool/learn pages for lacking platform-specific data.

## Content Similarity

- **0 critical pairs** (85%+ similarity)
- **2 high pairs** (75-85%): Tiendanube/Nuvemshop on order-history and SEO — expected due to shared infrastructure
- **87 review pairs** (55-75%): Heading structure similarity from shared templates
- Tiendanube/Nuvemshop pairs are the only ones flagged as high; the platforms share the same codebase

## Recommendations Before Launch

1. **Tiendanube/Nuvemshop differentiation** — Add country-specific payment/logistics details to better differentiate these similar-platform pages
2. **Source URL completion** — Add missing source URLs for 3 facts (PrestaShop combinations, Shopware 6 SEO, VTEX marketplace)
3. **Homepage Schema.org** — Review Organization/WebSite schema completeness

## Launch Decision

**RECOMMENDATION: LAUNCH ALL 90 URLs**

All pages meet quality thresholds. No pages have critical issues. The entire set of 90 URLs is ready for Google indexing.
