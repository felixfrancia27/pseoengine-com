# pseoengine — Technical Shopify Migration Intelligence

A programmatic SEO website focused on ecommerce store migrations to Shopify.

**Stack:** Remix v2, TypeScript, Vite

## Quick Start

```bash
npm install
npm run dev          # Development server on :3000
npm run build        # Production build
npm run start        # Production server
npm run typecheck    # TypeScript checks
npm run lint         # ESLint
```

## Architecture

```
app/
  content/          # Brand config, models, content types
    brand.ts        # Site-wide brand/operator/author configuration
    models.ts       # Platform, MigrationIssue, ContentPage, Lead types
  components/       # Reusable UI components
  lib/
    linking.ts      # Internal linking engine + quality scoring
  routes/           # Remix flat routes (file-based routing)
  styles/
    pseo.css        # Complete design system
  entry.server.tsx  # SSR entry
  entry.client.tsx  # Client hydration
  marketing.tsx     # Nav, Footer, Marketing layout, MigrationCTA
  root.tsx          # Root layout (HTML head, structured data)
  sitemap.server.ts # Sitemap generation

data/
  platforms/        # Structured platform facts (11 platforms)
  migration-issues/ # Structured migration problem data (10+ issues)
  content-registry.ts # Page registry (90 pages, all status-tracked)

src/
  cli/
    generate.ts     # AI content generation pipeline
    review.ts       # Content quality review tool
    validate.ts     # Quality gate validation
    content-report.ts # Registry status report
```

## Content Model

### Platforms
11 ecommerce platforms with structured facts: WooCommerce, Magento, BigCommerce, PrestaShop, Shopware, VTEX, Tiendanube, Nuvemshop, Wix, Squarespace, OpenCart.

Each platform includes: data model, native migration support, export methods, known problems, SEO considerations, common integrations, technology indicators, and verified sources.

### Migration Issues
10+ documented migration problems: order history, SEO, redirects, customer passwords, subscriptions, reviews, customer groups, integrations, B2B, configurable products, Shopify Store Migration limitations.

### Content Pages
90+ indexable pages organized by type: hubs, migration guides, problem pages, comparisons, tools.

## How to Add Content

### Add a new platform

1. Add a `Platform` object to `data/platforms/index.ts`
2. It automatically appears on `/migrate/`, the homepage, and the learn page
3. Platform-specific migration problem pages are generated for known problems

### Add a new migration problem

1. Add a `MigrationIssue` object to `data/migration-issues/index.ts`
2. Set `hasPage: true` and `priority` (0-100)
3. Pages are auto-generated for each affected platform

### Add a new article

1. Add a `RegistryEntry` to `data/content-registry.ts` in `buildRegistry()`
2. Set status to `"draft"` or `"published"`
3. The sitemap, internal linking, and quality validation all read from the registry

### Add a new language

1. Add locale-specific pages to the registry with `locale: "es"` or `"pt"`
2. Create locale-specific route directories:
   - `app/routes/es._index.tsx` → `/es/`
   - `app/routes/es.migrate._index.tsx` → `/es/migrate/`
   - etc.
3. Add hreflang tags in meta exports
4. Register pages in `buildRegistry()` with their locale

### Add a new AI provider

1. Add a new provider implementation in the `getProviderConfig()` function in `src/cli/generate.ts`
2. Add environment variables for the provider's API key and model
3. Update `.env.example` with the new variables

## CLI Tools

```bash
# Content generation
npm run content:generate                          # Show targets
npm run content:generate -- --platform=woocommerce
npm run content:generate -- --topic=order-history
npm run content:generate -- --platform=woocommerce --topic=order-history

# Quality checks
npm run content:validate                          # Quality gate validation
npm run content:review                            # Review for AI filler phrases
npm run content:report                            # Registry status
npm run content:report -- --all                   # Full page listing
```

## Content Quality Gates

Pages are scored 0-100 across six dimensions:
- Intent coverage (25) - title, description, word count
- Platform specificity (20) - platform-specific facts
- Original information (20) - unique sections, callouts
- Internal linking (10) - links to related content
- Technical depth (15) - section count, word count
- SEO metadata (10) - metadata quality, sources

Default publish threshold: 60/100 (configurable in `app/lib/linking.ts`).

## SEO Features

- Server-rendered HTML (Remix SSR)
- Dynamic XML sitemap from content registry
- robots.txt with sitemap reference
- Schema.org structured data (Organization, Person, SoftwareApplication, FAQPage)
- Unique title tags and meta descriptions per page
- Canonical URLs
- OpenGraph and Twitter card metadata
- Semantic HTML with breadcrumbs
- No JS dependency for primary content
- Clean static paths (no query parameters for content)

## Lead Capture

The migration assessment tool (`/tools/migration-assessment/`) captures:
- Store URL
- Current platform (auto-detected or selected)
- Revenue range, product count, monthly orders
- B2B and physical retail flags
- Email (optional)

Lead scoring is configurable via platform-specific rules.

## Deployment

Standard Remix deployment:

```bash
npm run build
npm run start    # Listens on PORT env var (default 3000)
```

## License

Private project. All rights reserved.
