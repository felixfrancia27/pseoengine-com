# PSEO Growth Strategy — pseoengine.com

Date: 2026-08-10

## Phase 1: Launch (Current)

**90 indexable URLs** across 7 content segments:

| Segment | URLs | Target intent |
|---|---|---|
| Platform migration hubs | 12 | "woocommerce to shopify", "magento to shopify" |
| Migration problem pages | 11 generic | "migrate order history to shopify" |
| Platform×problem pages | 53 specific | "woocommerce order history to shopify" |
| Shopify Store Migration | 7 | "shopify store migration limits" |
| Tool comparisons | 2 | "shopify store migration vs matrixify" |
| Tools | 2 | "shopify migration assessment" |
| Learn/knowledge base | 3 | "shopify migration knowledge base" |

**Strategy:** Ship small, index everything, collect data.

## Phase 2: GSC Data Collection (Weeks 2-8)

After Google indexes the initial 90 URLs:

1. **Monitor Search Console weekly** for:
   - Impressions per URL
   - Click-through rate per URL
   - Average position per URL cluster
   - Query variations driving impressions
   - Unexpected query clusters

2. **Identify high-potential pages**:
   - Pages ranking position 5-30 (one improvement push from page 1)
   - Pages with high impressions but low CTR (title/description optimization)
   - Pages receiving impressions for unexpected queries

3. **Data model for GSC performance**:
```
SEO Performance per page:
  path
  targetQuery
  cluster (platform, problem, etc.)
  
  gscData:
    impressions: number | null
    clicks: number | null
    ctr: number | null
    position: number | null
    queries: [{ query, impressions, position }]
    lastUpdated: date
```

## Phase 3: Expand Based on Demand (Months 2-4)

### Decision Framework

For each query cluster discovered in GSC:

1. **Does it represent distinct search intent?**
   - Different intent → new page candidate
   - Same intent, different phrasing → optimize existing page

2. **Is there sufficient data to justify expansion?**
   - 50+ impressions/month → consider new page
   - <50 impressions → optimize existing page
   - Position <30 → page has discoverability, improve it

3. **Can a new page offer unique value?**
   - Platform-specific angle → yes
   - Generic advice already covered → no
   - Vendor/app comparison → yes

### Example Expansion Path

Existing page: `/migrate/woocommerce-to-shopify/order-history/`

May receive impressions for:
- "import old woocommerce orders to shopify"
- "transfer woocommerce historical orders"
- "can shopify import past woocommerce orders"
- "woocommerce order history to shopify matrixify"
- "woocommerce to shopify orders migration app"

**Decision:** First verify intent differences.
- If "import old woocommerce orders" and "transfer woocommerce historical orders" are the same intent → don't create separate pages → improve existing page
- If "matrixify" variant shows distinct commercial investigation intent → create `/compare/matrixify-for-woocommerce-order-migration/`

## Phase 4: Platform-Specific Depth (Months 3-6)

Prioritize platform expansions based on:

1. **Search demand signal** (from GSC)
2. **Lead qualification value** (higher-value leads come from complex platforms)
3. **Content gap size** (how much unique platform-specific content can we add)

### Platform Priority Matrix

| Platform | Lead Value | Complexity | GSC Signal (est.) | Priority |
|---|---|---|---|---|
| Magento | High (B2B/enterprise) | High | Medium | 1 |
| WooCommerce | Medium (volume) | Medium | High | 2 |
| VTEX | High (LATAM enterprise) | High | Low | 3 |
| BigCommerce | Medium | Medium | Medium | 4 |
| Shopware | Medium (DACH region) | Medium | Low | 5 |
| Tiendanube/Nuvemshop | Medium (LATAM SMB) | Low-Medium | Low | 6 |

## Phase 5: Content Format Expansion (Months 4-8)

Based on GSC data for query intent:

- **Commercial investigation** queries → comparison/matrix pages
- **"How to"** queries → step-by-step guides
- **"vs"** queries → comparison pages
- **"cost" "pricing"** queries → pricing breakdown pages
- **"app" "tool"** queries → tool review/comparison pages
- **"SEO" variant** queries → deeper SEO migration sub-pages

## Content Generation Pipeline

New pages follow strict pipeline:

```
Candidate identified (from GSC data)
  ↓
Enable in content registry
  ↓
AI generates draft (with structured platform/problem facts)
  ↓
Quality validation (score ≥60)
  ↓
Content similarity check (<85% match to existing pages)
  ↓
Manual review
  ↓
Publish
```

## Safety Rules

1. **No Cartesian-product expansion** — 15 platforms × 30 problems does NOT auto-generate 450 pages
2. **Explicit enablement** — Pages only exist when registered with `status: "published"`
3. **Quality gate** — Score <60 OR similarity >85% → do not publish
4. **Intent validation** — Each page must answer a distinct search intent
5. **GSC-driven** — Expand based on real demand, not theoretical keyword lists

## International Expansion

Languages supported by architecture: en, es, pt

When to expand:
1. English pages ranking well (position <10)
2. GSC shows impressions from es/pt queries
3. Lead capture shows demand from Spanish/Portuguese-speaking markets

Initial international pages (not yet generated):
- `/es/migrar/tiendanube-a-shopify/` (Tiendanube is LATAM-native — strong es intent)
- `/pt/migrar/nuvemshop-para-shopify/` (Nuvemshop is Brazil-native — strong pt intent)
- `/es/migrar/vtex-a-shopify/` (VTEX is LATAM-strong)

## Long-Term Defensibility

What makes this content defensible vs generic AI SEO blogs:

1. **Structured platform data** — Not generic, platform-specific facts that change over time
2. **Shopify documentation tracking** — Migrations change as Shopify updates, content must evolve
3. **Verifiable sources** — Every claim traceable to official documentation
4. **Lead qualification data** — Assessment tool captures real merchant demand signals
5. **GSC feedback loop** — Content decisions driven by actual search data, not keyword tools

## Success Metrics

- **Month 1-2:** Indexing of 90 URLs, first impressions
- **Month 2-3:** First clicks, initial query data
- **Month 3-4:** Identify high-potential pages, begin optimization
- **Month 4-6:** First expansion based on GSC data
- **Month 6-12:** Lead volume from organic search, assessment tool conversion rate
