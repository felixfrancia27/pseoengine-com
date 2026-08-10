import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";

export const links = marketingLinks;

const COMPARISONS: Record<string, { title: string; description: string; subjects: string[]; content: string }> = {
  "shopify-store-migration-vs-matrixify": {
    title: "Shopify Store Migration vs Matrixify",
    description: "Detailed comparison of Shopify's built-in Store Migration app vs Matrixify (Excelify) for migrating data to Shopify.",
    subjects: ["Shopify Store Migration", "Matrixify"],
    content: `Matrixify (formerly Excelify) is a Shopify app for bulk data import, export, and migration. Here's how it compares to Shopify's built-in Store Migration tool.

## Key differences

| Aspect | Store Migration | Matrixify |
|---|---|---|
| **Cost** | Free (included with Shopify) | From $20/month (metered by data volume) |
| **Data types** | Products, customers, basic orders | Products, customers, orders, collections, pages, blogs, metafields, redirects, discounts, gift cards |
| **Platform support** | 8 platforms (CSV templates) | Any platform (via Excel/CSV) |
| **Order migration** | BigCommerce only (native) | Full order, transaction, fulfillment import |
| **Custom fields** | Not supported | Full metafield import per entity |
| **Scheduling** | Manual only | Scheduled repeat imports/exports |
| **Bulk editing** | Not available | Edit thousands of items in Excel |
| **File size** | Limited (~15MB) | Up to 5GB per file |

## When to use Shopify Store Migration

- Simple stores with standard product data
- First-time Shopify migration
- Budget-constrained migration (free)
- Small catalogs (< 500 products)
- Platforms with good native support (WooCommerce, BigCommerce)

## When to use Matrixify

- Need to migrate order history
- Complex product data with custom fields
- Large catalogs (thousands of products)
- Need metafield migration
- Require scheduled/repeat imports
- Platform not supported by Shopify's native tool
- Need to bulk-edit data in Excel before import
- Want to export data for backup/reporting

## Migration workflow comparison

### Store Migration workflow
1. Export CSV from source platform
2. Upload to Shopify admin → Import data
3. Map columns to Shopify fields
4. Shopify imports the data

### Matrixify workflow
1. Export data from source platform (any format)
2. Prepare Excel/CSV with Matrixify's template
3. Upload to Matrixify in Shopify admin
4. Configure import options (update vs create, metafields)
5. Matrixify processes the import with detailed logs

## Matrixify advantages

- **Order history** — Full order, transaction, and fulfillment import with customer association
- **Metafields** — Import custom fields as Shopify metafields
- **Bulk editing** — Export your Shopify data, edit in Excel, re-import
- **Scheduled jobs** — Automate regular imports/exports
- **Detailed logs** — See exactly what was imported, skipped, or failed
- **Large files** — Handles up to 5GB files (Store Migration limits to ~15MB)

## Matrixify disadvantages

- **Cost** — Metered pricing can be expensive for large migrations
- **Learning curve** — Excel template format requires careful preparation
- **App dependency** — Unlike the native tool, Matrixify is a third-party app
- **Not migration-specific** — It's a general data tool, not optimized for platform-to-platform migration

## Which is right for your migration?

| Scenario | Best tool |
|---|---|
| Basic WooCommerce migration | Store Migration |
| Historical orders | Matrixify |
| Large Magento catalog | Matrixify |
| Custom fields to preserve | Matrixify |
| Simple Wix store | Store Migration |
| VTEX/Tiendanube | Matrixify or Cart2Cart |
| Scheduled ongoing imports | Matrixify |`,
  },
  "shopify-store-migration-vs-cart2cart": {
    title: "Shopify Store Migration vs Cart2Cart",
    description: "Comparing Shopify's Store Migration app with Cart2Cart's automated migration service.",
    subjects: ["Shopify Store Migration", "Cart2Cart"],
    content: `Cart2Cart is an automated shopping cart migration service. Here's how it compares to Shopify's built-in Store Migration tool.

## Key differences

| Aspect | Store Migration | Cart2Cart |
|---|---|---|
| **Cost** | Free | From $69 (based on entities) |
| **Data types** | Products, customers, basic orders | Products, customers, orders, reviews, categories, manufacturers, taxes, coupons, CMS pages |
| **Platform support** | 8 platforms | 85+ platforms |
| **Automation** | Manual CSV upload | Automated data transfer |
| **Migration speed** | Varies (manual) | Minutes to hours (automated) |
| **Downtime** | Store offline during migration | No downtime (delta migration) |
| **Technical skill** | Basic CSV knowledge | Minimal (guided wizard) |
| **Customization** | Limited column mapping | Entity selection, field mapping |
| **Support** | Shopify docs, community | Live chat, email, phone |

## When to use Shopify Store Migration

- Simple product/customer migration only
- Supported platforms (WooCommerce, BigCommerce, PrestaShop, etc.)
- Budget-constrained
- Comfortable with CSV data preparation
- Small catalog (< 1,000 items)

## When to use Cart2Cart

- Need automated data transfer (no manual CSV work)
- Migrating from unsupported platform (VTEX, Tiendanube, etc.)
- Need order history, reviews, CMS pages migrated
- Want minimal technical involvement
- Need delta migration (migrate changes after initial transfer)
- Large catalogs requiring enterprise support

## Cart2Cart advantages

- **85+ platforms** — Far more than Shopify's 8 supported platforms
- **Automated** — No manual CSV preparation or column mapping
- **Delta migration** — Migrate recent changes after initial transfer without downtime
- **Product reviews** — Migrate reviews with ratings and customer data
- **CMS pages** — Transfer content pages, not just products
- **Taxes and coupons** — Migrate tax rules and discount coupons
- **Support** — Live migration assistance

## Cart2Cart disadvantages

- **Cost** — Not free; pricing scales with entity count
- **Third-party access** — Requires API access to both source and target stores
- **Less control** — Limited ability to transform data during migration
- **Not ongoing** — One-time migration service, not a recurring data tool

## Migration scenarios

### Simple WooCommerce store
Use Shopify's free Store Migration tool. Products, customers, and categories transfer well.

### Magento store with configurable products
Cart2Cart handles the configurable→variant mapping better than Shopify's CSV-based tool. The automated approach reduces mapping errors.

### VTEX or Tiendanube store
Cart2Cart is the only automated option. Shopify has no native migration for these platforms. Cart2Cart supports data extraction via API.

### Store needing review migration
Cart2Cart can migrate product reviews. Shopify's native tool cannot. Matrixify is another option for reviews via CSV.

### Large catalog with complex data
Cart2Cart with delta migration: migrate the bulk of data, then run a delta to capture changes made during the migration setup period. This minimizes downtime.`,
  },
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug!;
  const comparison = COMPARISONS[slug];
  if (!comparison) throw new Response("Not Found", { status: 404 });
  return { slug, comparison };
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) return [];
  const d = data as { slug: string; comparison: typeof COMPARISONS[string] };
  return [
    { title: `${d.comparison.title} — pseoengine` },
    { name: "description", content: d.comparison.description },
    { tagName: "link", rel: "canonical", href: `${SITE_URL}/compare/${d.slug}/` },
  ];
};

export default function ComparePage() {
  const { slug, comparison } = useLoaderData<typeof loader>();

  return (
    <Marketing>
      <div className="wrap narrow prose">
        <div className="breadcrumb">
          <Link to="/compare/">Comparisons</Link>
          <span className="breadcrumb__sep">→</span>
          <span>{comparison.title}</span>
        </div>
        <h1>{comparison.title}</h1>
        <p className="updated">Last updated August 2026</p>

        {comparison.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
          if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
          if (line.startsWith("- ")) return <li key={i}>{line.slice(2)}</li>;
          if (line.startsWith("|")) return null;
          if (line.trim() === "") return <br key={i} />;
          return <p key={i}>{line}</p>;
        })}

        <MigrationCTA source={`compare:${slug}`} />
      </div>
    </Marketing>
  );
}
