# Google Search Console Launch — pseoengine.com

Date: 2026-08-10

## Post-Deploy Steps

### 1. Add Property

Add `pseoengine.com` as a **Domain property** in Google Search Console.

Do NOT use URL prefix. Domain property automatically covers:
- `https://pseoengine.com`
- `https://pseoengine.com/*`
- `http://pseoengine.com` (should redirect to https)

### 2. Verify Ownership

**Method: DNS TXT record**

Google will provide a TXT record value. Add it to your DNS:

```
Type: TXT
Name: @ (or pseoengine.com)
Value: google-site-verification=...
TTL: 3600
```

Wait for DNS propagation (usually <5 minutes, occasionally 1 hour).

Click "Verify" in Search Console.

### 3. Submit Sitemap

In Search Console → Sitemaps:

Submit: `https://pseoengine.com/sitemap.xml`

This is a sitemap index referencing 7 child sitemaps:
- `/sitemaps/migrations.xml` (12 URLs)
- `/sitemaps/migration-problems.xml` (64 URLs)
- `/sitemaps/shopify-store-migration.xml` (7 URLs)
- `/sitemaps/comparisons.xml` (2 URLs)
- `/sitemaps/tools.xml` (2 URLs)
- `/sitemaps/learn.xml` (1 URL)
- `/sitemaps/pages.xml` (2 URLs)

Total: 90 URLs

### 4. Inspect Key Pages

Use the URL Inspection tool on:

1. `https://pseoengine.com/` — Homepage
2. `https://pseoengine.com/migrate/woocommerce-to-shopify/` — Top migration hub
3. `https://pseoengine.com/migrate/magento-to-shopify/` — High-value lead platform
4. `https://pseoengine.com/migrate/vtex-to-shopify/` — LATAM enterprise platform
5. `https://pseoengine.com/migrate/order-history/` — High-intent problem page

For each: click "Request Indexing" only if the page shows as not indexed after 48 hours.

### 5. Let Discovery Handle the Rest

**Do NOT manually request indexing for all 90 URLs.**

Google will discover pages via:
- The sitemap (submitted in step 3)
- Internal links from the homepage and hub pages
- Natural crawling

Requesting all 90 URLs manually is unnecessary and may look unusual.

### 6. Wait for Data

Initial indexing: 1-7 days for most pages.
First impression data: usually within 1 week.
First meaningful query data: 2-4 weeks.

### 7. What to Monitor

**Week 1:**
- Sitemap status (all segments should show "Success")
- Index coverage report (any errors?)
- Pages indexed count

**Week 2-4:**
- Performance report: impressions, average position
- Queries driving impressions
- Pages getting the most impressions

**Week 4+:**
- Which query clusters are forming
- Which pages rank position 5-30
- Which unexpected queries are appearing

### 8. Do NOT Do This

- Do NOT manually request indexing for all pages
- Do NOT create more pages based on hunches
- Do NOT change URLs while Google is indexing
- Do NOT add noindex tags to "low traffic" pages
- Do NOT panic about position reporting lag (normal, 1-2 weeks delay)

### 9. Response Flow

```
Sitemap submitted
  → Google crawls over 1-7 days
  → Pages indexed in batches
  → Impressions recorded in Search Console
  → Queries associated with pages
  → Position data becomes reliable (2-4 weeks)
  → Decision: expand or optimize based on real data
```

### 10. Questions This Data Will Answer

- Which platform migration pages get the most impressions?
- Are we ranking for "woocommerce to shopify" variations?
- Are long-tail problem pages (subscriptions, B2B, configurable products) getting discovered?
- Which queries does Google associate with each page?
- Are there query clusters we didn't anticipate?
- Which pages should we optimize first?
- Which pages deserve expansion into deeper content?
