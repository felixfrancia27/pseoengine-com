import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";

export const links = marketingLinks;

const PAGES: Record<string, { title: string; description: string; content: string }> = {
  limitations: {
    title: "Shopify Store Migration App Limitations",
    description: "Comprehensive list of what Shopify's built-in Store Migration tool cannot do, by data type and platform.",
    content: `Shopify's Store Migration app is useful for basic migrations but has significant limitations. Understanding these before starting prevents data loss and wasted effort.

## Data types not migrated

The Store Migration app does not transfer:

- **Customer passwords** — Password hashes are platform-specific and incompatible. Customers must reset passwords via account invite emails after migration.
- **Order history for most platforms** — WooCommerce, Magento, and most other platforms do not support order migration through the native tool. BigCommerce is one of the few exceptions.
- **Blog posts and CMS pages** — Content pages, blog posts, and landing pages are not migrated. These must be manually recreated in Shopify.
- **Product reviews** — Reviews created through platform-specific systems (WooCommerce reviews, Magento reviews) do not transfer automatically.
- **Gift cards and store credit** — Platform-specific gift card balances and store credit cannot be transferred.
- **Custom fields and metadata** — Platform-specific custom fields, product attributes beyond basic variants, and EAV data (Magento) are not migrated.
- **Subscriptions** — Active subscription data, billing schedules, and payment tokens cannot be transferred.
- **Coupon usage history** — Historical discount usage data is not transferred.
- **Customer groups and tiers** — Platform-specific customer segmentation is lost.
- **Multi-store configurations** — If your platform supports multiple storefronts, each requires separate migration.

## Platform-specific limitations

### WooCommerce
- WordPress-specific data (pages, posts, media library) not transferred
- Plugin data from Subscriptions, Bookings, Memberships, Bundles is not migrated
- Custom product attributes stored as post_meta are skipped
- Downloadable product files not transferred

### Magento
- EAV attribute data beyond standard fields is not transferred
- Configurable product relationships may not map correctly
- Tier pricing and customer group pricing are not migrated
- B2B company accounts and shared catalogs not supported
- Multiple website/store view data requires separate handling

### PrestaShop
- Combination-specific data (images, prices, quantities per combination) may not transfer
- Module-specific data (custom product features, extended fields) is skipped
- CMS pages and custom content blocks not transferred

### VTEX, Tiendanube, Nuvemshop
- No native migration support exists at all
- All data migration requires third-party tools or custom development

## What to use instead

| Limitation | Alternative |
|---|---|
| Order history | Matrixify (Excelify), Shopify API, Cart2Cart |
| Customer passwords | Account invite emails, Shopify Plus Multipass |
| Reviews | Judge.me import, Yotpo migration, Stamped import |
| Blog/CMS | Manually recreate, or use a headless CMS integration |
| Custom fields | Matrixify with metafield columns, Shopify API |
| Subscriptions | Recharge migration, Bold Subscriptions import |
| B2B data | Shopify Plus B2B setup, SparkLayer, custom API`,
  },
  orders: {
    title: "Does Shopify Store Migration Migrate Orders?",
    description: "Whether Shopify's built-in migration tool transfers historical order data, and how to import orders for platforms not supported.",
    content: `The short answer: for most platforms, no. Shopify's Store Migration app does not migrate historical orders from WooCommerce, Magento, PrestaShop, Shopware, or VTEX. BigCommerce is a notable exception.

## Which platforms support order migration?

| Platform | Order migration via Shopify's native tool |
|---|---|
| BigCommerce | Yes (orders can be imported) |
| WooCommerce | No |
| Magento | No |
| PrestaShop | No |
| Shopware | No |
| Wix | No |
| Squarespace | No |
| OpenCart | No |
| VTEX | No native tool at all |
| Tiendanube | No native tool at all |

## Why orders are difficult to migrate

Order data is the most complex entity in any ecommerce system because it references:
- **Customers** — Must exist in Shopify before orders can be associated
- **Products** — Must exist in Shopify with matching SKUs or IDs
- **Payment transactions** — Payment gateway references are platform-specific
- **Fulfillments** — Shipping and tracking data
- **Tax calculations** — Platform-specific tax engines
- **Discounts** — Discount codes and their application logic differ
- **Refunds** — Partial refunds and return data

## How to import orders to Shopify

If you need order history in Shopify, use one of these approaches:

### 1. Matrixify (Excelify)
The most common tool for bulk order import. Export orders from your source platform as CSV, map columns, and import. Supports orders, transactions, and fulfillments. Paid app with metered pricing.

### 2. Shopify GraphQL Admin API
Use the \`orderCreate\` mutation via the GraphQL Admin API (\`POST /admin/api/2026-07/graphql.json\`) for programmatic order import. The mutation accepts customer data, line items, shipping/billing addresses, and transaction information. Requires:
- Customer records to exist in Shopify first (or create them inline with \`toUpsert\`)
- Product/variant IDs mapped to Shopify GIDs (\`gid://shopify/ProductVariant/...\`)
- Transactions imported within the same mutation or separately via \`orderEditBegin\`
- GraphQL cost-based rate limiting applies (check current limits at shopify.dev)

### 3. Cart2Cart
Automated migration service that handles order migration for multiple platforms. Paid service, pricing varies by data volume.

## Should you migrate orders at all?

For most stores, migrating historical orders to Shopify **is not recommended** because:
- It consumes significant time and resources
- Historical order data is rarely accessed in a storefront context
- It bloats the Shopify admin with old data
- Reporting tools can ingest historical data separately

**Better approach:** Export order history to an external reporting tool (Looker, Metabase, Google Sheets) and use Shopify for new orders only. This keeps your Shopify admin clean and fast.`,
  },
  seo: {
    title: "Shopify Store Migration SEO — Redirects, URLs, Rankings",
    description: "How Shopify's Store Migration handles SEO including URL redirects, meta data transfer, and preserving search rankings.",
    content: `SEO migration is the highest-stakes part of any platform move. Shopify's Store Migration app handles some aspects automatically, but several critical steps require manual work.

## What Shopify's migration handles

- **Product meta titles and descriptions** — Can be mapped from source platform CSV columns (if exported correctly)
- **Product image alt text** — Transferred during CSV import when properly mapped

## What Shopify's migration does NOT handle

- **301 redirects** — Shopify does not automatically create redirects from old URLs. You must create these manually.
- **URL structure changes** — Every platform has different URL patterns. Shopify uses /products/slug, /collections/slug, /pages/slug.
- **Canonical tags** — Old canonicals referencing the source platform must be updated.
- **Structured data** — Product schema, BreadcrumbList, and other rich snippets must be re-implemented.
- **Sitemap submission** — Shopify generates its own sitemap, but you must submit it to Google Search Console.
- **Blog post SEO** — Blog content is not migrated; any ranking blog posts lose their URLs.
- **Internal linking** — All internal links must be updated to new Shopify URL structures.

## SEO migration checklist

1. **Export all URLs** from the source platform: products, categories, CMS pages, blog posts
2. **Map old URLs to new Shopify URLs** — Create a spreadsheet with old URL → new URL pairs
3. **Prioritize by traffic** — Use Google Search Console/analytics to identify high-traffic URLs
4. **Create 301 redirects** — Import via Shopify admin or API (max 100,000 redirects)
5. **Transfer meta titles and descriptions** — Map correctly during product/category import
6. **Submit new sitemap** — Via Google Search Console after launch
7. **If changing domains** — Use Google Search Console's Change of Address tool to notify Google of the domain change. This tool is for domain-level moves, not platform-level migrations on the same domain.
8. **Monitor 404 errors** — Aggressively for the first 3 months

## Expected SEO impact

Organic search performance can be affected by any platform migration. The impact varies with:
- How many URLs change structure
- Whether 301 redirects are properly implemented
- Crawl frequency of the existing site
- Number and quality of backlinks
- Internal linking changes
- Content changes during migration
- How quickly Google processes the sitemap submission

A well-executed migration with thorough redirect coverage and preserved metadata typically sees search traffic stabilize within weeks. Complex migrations with significant URL restructuring or content changes may take longer.

## Redirect limits

Shopify enforces a **100,000 redirect limit** per store. For stores with more URLs, consider:
- Using a CDN/edge worker (Cloudflare Workers, Fastly) for redirect logic
- Consolidating redirects with pattern matching (e.g., /old-category/* → /collections/new-category)
- Only redirecting URLs with actual traffic/backlink value

## Platform-specific SEO concerns

### WooCommerce
- WordPress permalink structure differs from Shopify's /products/ format
- Yoast/Rank Math metadata must be mapped to Shopify SEO fields
- Blog posts require separate migration or hosting decision

### Magento
- URL rewrites stored in database (url_rewrite table), must be extracted
- Multiple store views create multiple URL sets requiring redirect mapping

### VTEX
- Dynamic SEO paths managed by catalog configuration
- Multi-domain setups require per-domain redirect plans`,
  },
  redirects: {
    title: "Shopify Store Migration Redirects",
    description: "How to plan and implement URL redirects when migrating to Shopify.",
    content: `URL redirects are the most important post-migration task for preserving SEO value. Shopify's Store Migration app does not create them automatically.

## Shopify redirect format

Redirects are created with a **path** (the old URL) and a **target** (the new URL):

\`\`\`json
{
  "redirect": {
    "path": "/old-product-page/",
    "target": "/products/new-product-slug"
  }
}
\`\`\`

## Creating redirects

### Via Shopify admin
Go to **Settings → Navigation → URL Redirects** and add redirects manually or via CSV import.

### Via Shopify API
\`POST /admin/api/2024-01/redirects.json\` with the redirect payload. Bulk import is limited by API rate limits.

### Via CSV import
Prepare a CSV with two columns: \`path\` and \`target\`. Import in Shopify admin.

## Redirect best practices

1. **One-to-one mapping** — Each old URL should redirect to exactly one new URL
2. **301 (permanent)** — Use 301 redirects for SEO value transfer
3. **Avoid chains** — Don't redirect to a redirect (A → B → C). Point directly to the final URL.
4. **Test after import** — Spot-check a random sample of redirects
5. **Prioritize by traffic** — Import high-traffic URLs first
6. **Handle query parameters** — Shopify ignores query strings in redirect matching

## Limits and constraints

- **100,000 redirects** per store (hard limit)
- Redirects only work on the primary domain
- No regex/pattern-based redirects (exact match only)
- Redirect paths are case-insensitive
- Trailing slash handling is automatic

## Platform-specific redirect patterns

### WooCommerce
Old: \`/product/product-name/\` → New: \`/products/product-name\`
Old: \`/product-category/category-name/\` → New: \`/collections/category-name\`

### Magento
Old: \`/catalog/product/view/id/123\` → New: \`/products/product-name\`
Check \`url_rewrite\` table for custom paths.

### PrestaShop
Old: \`/category/id-product-name.html\` → New: \`/products/product-name\`

### VTEX
Old: \`/department/category/product-name/p\` → New: \`/products/product-name\`

## For complex redirect requirements

If you need pattern-based redirects, header manipulation, or more than 100,000 redirects:
- **Cloudflare Workers** — JavaScript at the edge for redirect logic
- **Fastly** — VCL-based redirect rules
- **Custom proxy** — Nginx/Apache layer before Shopify`,
  },
  "customer-passwords": {
    title: "Shopify Store Migration Customer Passwords",
    description: "Why customer passwords never transfer between platforms and how to handle customer account migration.",
    content: `Customer passwords cannot be migrated to Shopify. This is a universal constraint across all migration paths, not a limitation specific to Shopify's tool.

## Why passwords cannot migrate

Every ecommerce platform hashes passwords using different algorithms. The hash (not the plaintext password) is stored, and these hashes are incompatible:

| Platform | Hashing algorithm |
|---|---|
| WooCommerce/WordPress | phpass (portable PHP password hashing) with unique salts |
| Magento 2 | SHA-256 with 32-character random salt |
| PrestaShop | MD5 → BCrypt (varies by version) |
| Shopify | BCrypt |

Passwords are designed to be one-way. You cannot reverse a hash to obtain the original password, so you cannot re-hash it for Shopify's algorithm.

## What to do

### 1. Migrate customer records without passwords
Export customer data (name, email, addresses, phone) and import into Shopify via CSV or API. Customers will have their accounts but no working password.

### 2. Send account invite emails
After importing customers, send Shopify account invite emails. Customers click the link, set a new password, and regain access.

### 3. Communicate the change
Before migration:
- Email customers explaining that they will need to reset their password
- Provide a timeline for the migration
- Explain that their order history and account information remain intact

### 4. For Shopify Plus stores: Multipass
Multipass allows customers to authenticate on your old platform and be automatically logged into Shopify without setting a new password. This requires:
- Shopify Plus subscription
- A custom authentication bridge between old and new platforms
- Token-based SSO implementation

## Customer data that CAN transfer

| Data | Can migrate? |
|---|---|
| Name, email, phone | Yes |
| Billing/shipping addresses | Yes |
| Marketing preferences | Yes |
| Customer tags/notes | Yes |
| Password | No |
| Saved payment methods | No (PCI compliance) |
| Login history | No |
| Wishlists | Depends on platform/app |

## Migration sequence

1. Export customers from source platform
2. Import customers into Shopify (without passwords)
3. Verify customer records in Shopify admin
4. Send account invite emails
5. Provide customer support for login issues during transition period`,
  },
  reviews: {
    title: "Shopify Store Migration Reviews — Product Review Transfer",
    description: "Whether Shopify's Store Migration app transfers product reviews and how to import reviews.",
    content: `Shopify's Store Migration app does not transfer product reviews from any platform. Reviews must be migrated separately using review apps or CSV imports.

## Why reviews don't migrate

Shopify does not have a native product reviews system. Each review platform stores data differently:
- WooCommerce stores reviews as WordPress comments
- Magento uses dedicated review/review_detail tables
- PrestaShop uses ps_product_comment modules

Shopify's migration focuses on products, customers, and orders — not extensions or module data.

## How to migrate reviews

### 1. Judge.me
Judge.me offers free WooCommerce-to-Shopify review migration. Export reviews from WooCommerce, and Judge.me imports them with product mapping. Supports review text, ratings, author name, date, and verified purchase status.

### 2. Yotpo
Yotpo provides migration services for multiple platforms. Contact their support for platform-specific migration processes.

### 3. Stamped.io (Stamped)
Stamped supports CSV import of reviews from any platform. Export reviews as CSV from the source platform, map columns to Stamped's format, and import.

### 4. Loox
Loox supports review import via CSV for photos and text reviews. Paid plans required for import functionality.

### 5. Shopify Product Reviews (legacy, no longer available)
Shopify's free Product Reviews app has been discontinued. For review migration to Shopify, use a third-party review app:
- product_handle
- rating
- author
- body
- email
- created_at

## Review data mapping

| Source field | Shopify review app field |
|---|---|
| Review text | body |
| Star rating (1-5) | rating |
| Author name | author |
| Review date | created_at |
| Product ID/SKU | product_handle (mapped) |
| Verified purchase | verified (if supported) |
| Review title | title (if supported) |
| Review images | Photo URL (Judge.me, Loox, Yotpo) |

## What is typically lost

- Review helpfulness votes
- Merchant responses to reviews
- Review approval status
- Review images (unless using photo-enabled migration)`,
  },
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug!;
  const page = PAGES[slug];
  if (!page) throw new Response("Not Found", { status: 404 });
  return { slug, page };
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) return [];
  const d = data as { slug: string; page: typeof PAGES[string] };
  return [
    { title: `${d.page.title} — pseoengine` },
    { name: "description", content: d.page.description },
    { tagName: "link", rel: "canonical", href: `${SITE_URL}/shopify-store-migration/${d.slug}/` },
  ];
};

export default function StoreMigrationPage() {
  const { slug, page } = useLoaderData<typeof loader>();

  return (
    <Marketing>
      <div className="wrap narrow prose">
        <div className="breadcrumb">
          <Link to="/shopify-store-migration/">Shopify Store Migration</Link>
          <span className="breadcrumb__sep">→</span>
          <span>{page.title}</span>
        </div>

        <h1>{page.title}</h1>
        <p className="updated">Last updated August 2026</p>

        {page.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return <h2 key={i}>{line.slice(3)}</h2>;
          }
          if (line.startsWith("### ")) {
            return <h3 key={i}>{line.slice(4)}</h3>;
          }
          if (line.startsWith("- ")) {
            return <li key={i}>{line.slice(2)}</li>;
          }
          if (line.startsWith("| ")) {
            return null; // Tables handled below
          }
          if (line.startsWith("```")) {
            return null; // Code blocks handled below
          }
          if (line.trim() === "") {
            return <br key={i} />;
          }
          return <p key={i}>{line}</p>;
        })}

        <MigrationCTA source={`shopify-store-migration:${slug}`} />
      </div>
    </Marketing>
  );
}
