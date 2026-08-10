# Production Deploy Verification — pseoengine.com

Date: 2026-08-10

## Build Commit

- Local HEAD: `fe02060`
- Production /version: `unknown` (Railway direct-upload mode, not GitHub-connected)

## Production Content Verification (via curl against pseoengine.com)

| Check | Status |
|---|---|
| "100 variants" in WooCommerce hub | NOT FOUND (0 matches) |
| "2024-01" in order-history page | NOT FOUND (0 matches) |
| "40 requests" in order-history page | NOT FOUND (0 matches) |
| "80 requests" anywhere | NOT FOUND (0 matches) |
| "10-30%" in WooCommerce hub | NOT FOUND (0 matches) |
| "2-4 months" in homepage | NOT FOUND (0 matches) |
| "Shopify Product Reviews" as recommendation | NOT FOUND (0 matches) |
| "BigCommerce only" in Matrixify comparison | NOT FOUND (0 matches) |
| "Magento Partial" in Store Migration hub | NOT FOUND — Magento only appears in disclaimer as "not supported" ✓ |
| Store Migration platforms list | CORRECT — lists verified 8 platforms (Square, WooCommerce, Etsy, Wix, Amazon, eBay, Clover, Lightspeed) ✓ |
| Unsupported platform disclaimer | CORRECT — lists Magento, BigCommerce, PrestaShop, Shopware, VTEX, Tiendanube, Nuvemshop, Squarespace, OpenCart as NOT supported ✓ |
| URL-first assessment form | CORRECT — shows URL input + Analyze button first, qualification fields in collapsible section ✓ |

## Cache Analysis

| Header | Value |
|---|---|
| cf-cache-status | DYNAMIC (Cloudflare not caching HTML) |
| Cache-Control | Not set on HTML responses |

HTML is being served live by the Remix SSR process. Cloudflare is present but not caching HTML.

## 404 Safety

All bot/scanner paths (`/tracking.php`, `/.amper/challenge/fp.js`, `/setup/`, `/_internal/api/setup.php`) now return clean 404 via catch-all route without error logs.

## Conclusion

**PRODUCTION VERIFIED — LATEST BUILD IS LIVE**

All fixes confirmed in production HTML. No stale content detected. Deployment is correct.
