import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";
import { CONTENT_REGISTRY } from "../../data/content-registry";
import type { Platform, MigrationIssue } from "../content/models";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";

export const links = marketingLinks;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug!;

  // Try matching as a platform migration hub: "woocommerce-to-shopify"
  const platformSlug = slug.replace(/-to-shopify$/, "");
  const platform = PLATFORMS.find((p) => p.slug === platformSlug && slug === `${p.slug}-to-shopify`);

  if (platform) {
    // Verify page is registered
    const registered = CONTENT_REGISTRY.find(
      (e) => e.page.path === `/migrate/${slug}/`
    );
    if (!registered || registered.page.status !== "published") {
      throw new Response("Not Found", { status: 404 });
    }

    const issueSlugs = platform.knownProblems;
    const relatedIssues = MIGRATION_ISSUES.filter(
      (i) => i.hasPage && i.affectedPlatforms.includes(platform.slug)
    );
    return { type: "platform" as const, platform, relatedIssues, issueSlugs };
  }

  // Try matching as a generic migration problem: "order-history", "seo", etc.
  const issue = MIGRATION_ISSUES.find((i) => i.hasPage && i.slug === slug);
  if (issue) {
    // Verify page is registered
    const registered = CONTENT_REGISTRY.find(
      (e) => e.page.path === `/migrate/${slug}/`
    );
    if (!registered || registered.page.status !== "published") {
      throw new Response("Not Found", { status: 404 });
    }

    const affectedPlatforms = PLATFORMS.filter(
      (p) => issue.affectedPlatforms.includes(p.slug)
    );
    return { type: "problem" as const, issue, affectedPlatforms };
  }

  // Not found in any data source
  throw new Response("Not Found", { status: 404 });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) return [];
  const d = data as { type: string; platform?: Platform; issue?: MigrationIssue };

  if (d.type === "platform" && d.platform) {
    const p = d.platform;
    return [
      { title: `${p.name} to Shopify Migration Guide — pseoengine` },
      { name: "description", content: `Technical migration guide for moving from ${p.name} to Shopify. Covers what migrates, what doesn't, known problems, SEO considerations, and recommended approach.` },
      { tagName: "link", rel: "canonical", href: `${SITE_URL}/migrate/${p.slug}-to-shopify/` },
    ];
  }

  if (d.type === "problem" && d.issue) {
    const i = d.issue;
    return [
      { title: `${i.title} to Shopify — pseoengine` },
      { name: "description", content: i.description },
      { tagName: "link", rel: "canonical", href: `${SITE_URL}/migrate/${i.slug}/` },
    ];
  }

  return [];
};

export default function MigrateSlug() {
  const data = useLoaderData<typeof loader>();

  if (data.type === "platform") {
    const { platform, relatedIssues } = data;

    const supportLabel = platform.shopifyNativeMigrationSupport === "none"
      ? "No native migration tool available"
      : platform.shopifyNativeMigrationSupport === "partial"
        ? "Partial native migration support"
        : "Full native migration available";

    const supportClass = platform.shopifyNativeMigrationSupport === "none"
      ? "bad" : platform.shopifyNativeMigrationSupport === "partial" ? "warn" : "good";

    // BreadcrumbList structured data
    const breadcrumbJson = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Migration guides", item: `${SITE_URL}/migrate/` },
        { "@type": "ListItem", position: 3, name: `${platform.name} to Shopify` },
      ],
    };

    return (
      <Marketing>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
        <div className="wrap narrow prose">
          <div className="breadcrumb">
            <Link to="/migrate/">Migration guides</Link>
            <span className="breadcrumb__sep">→</span>
            <span>{platform.name} to Shopify</span>
          </div>

          <h1>{platform.name} to Shopify Migration</h1>
          <p className="updated">Last updated August 2026</p>

          <p>{platform.longDescription}</p>

          {/* Migration status card */}
          <div className="migration-status">
            <div className="migration-status__item">
              <b>Native support</b>
              <span className={`is-${supportClass}`}>{supportLabel}</span>
            </div>
            <div className="migration-status__item">
              <b>Complexity</b>
              <span>{platform.migrationComplexity}/10</span>
            </div>
            <div className="migration-status__item">
              <b>Data model</b>
              <span>{platform.shopifyCategory === "major" ? "Major platform" : platform.shopifyCategory === "regional" ? "Regional" : "Niche"}</span>
            </div>
            <div className="migration-status__item">
              <b>Known problems</b>
              <span>{platform.knownProblems.length} documented</span>
            </div>
          </div>

          {/* What migrates */}
          <h2>What Shopify's migration tool transfers</h2>
          {platform.shopifyNativeMigrationSupport === "none" ? (
            <div className="warning">
              <strong>No native migration:</strong> Shopify does not offer a built-in Store Migration tool for {platform.name}. All data migration must be done via third-party tools (Cart2Cart, Matrixify), custom API development, or migration services.
            </div>
          ) : (
            <>
              <ul>
                {platform.shopifyNativeMigrates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3>What does NOT transfer</h3>
              <ul>
                {platform.shopifyNativeDoesNotMigrate.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Data model */}
          <h2>Data model comparison</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Entity</th>
                <th>{platform.name}</th>
                <th>Shopify</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Products</strong></td>
                <td>{platform.dataModel.productModel}</td>
                <td>Product with up to 3 options, 100 variants, metafields</td>
              </tr>
              <tr>
                <td><strong>Variants</strong></td>
                <td>{platform.dataModel.variantModel}</td>
                <td>Variant with SKU, price, inventory, barcode</td>
              </tr>
              <tr>
                <td><strong>Categories</strong></td>
                <td>{platform.dataModel.categoryModel}</td>
                <td>Collections (manual or smart), no deep nesting</td>
              </tr>
              <tr>
                <td><strong>Customers</strong></td>
                <td>{platform.dataModel.customerModel}</td>
                <td>Customer with addresses, tags, metafields</td>
              </tr>
              <tr>
                <td><strong>Orders</strong></td>
                <td>{platform.dataModel.orderModel}</td>
                <td>Order with line items, fulfillment, payments</td>
              </tr>
              <tr>
                <td><strong>URLs</strong></td>
                <td>{platform.dataModel.urlStructure}</td>
                <td>/products/slug, /collections/slug</td>
              </tr>
            </tbody>
          </table>

          {/* Export methods */}
          <h2>How to export data from {platform.name}</h2>
          <ul>
            {platform.exportMethods.map((method) => (
              <li key={method}>{method}</li>
            ))}
          </ul>

          {/* Known problems */}
          <h2>Known migration problems</h2>
          <p>These are the migration issues that commonly affect {platform.name} to Shopify migrations:</p>
          <div className="related-guides">
            {relatedIssues.map((issue) => (
              <Link
                key={issue.slug}
                className="related-guide"
                to={`/migrate/${platform.slug}-to-shopify/${issue.slug}/`}
              >
                {issue.title}
              </Link>
            ))}
          </div>

          {/* SEO considerations */}
          <h2>SEO migration considerations</h2>
          <ul>
            {platform.seoConsiderations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {/* Common Qs */}
          {platform.commonQuestions.length > 0 && (
            <>
              <h2>Frequently asked questions</h2>
              <div className="faq-section">
                {platform.commonQuestions.map((item) => (
                  <div className="faq-item" key={item.q}>
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Tech indicators */}
          <h2>Detecting {platform.name}</h2>
          <p>These technology indicators can identify a {platform.name} storefront:</p>
          <code style={{ display: "block", padding: "12px 16px", marginBottom: 20 }}>
            {platform.techIndicators.join(", ")}
          </code>

          {/* Common integrations */}
          {platform.commonIntegrations.length > 0 && (
            <>
              <h2>Common integrations to plan for</h2>
              <ul>
                {platform.commonIntegrations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Sources */}
          <h2>References</h2>
          <ul className="source-list">
            {platform.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener" target="_blank">{s.title}</a> — {s.publisher}
              </li>
            ))}
          </ul>

          <MigrationCTA
            headline={`Planning a ${platform.name} to Shopify migration?`}
            body="Get a free assessment of your migration complexity, known risks, and recommended approach."
            source={`migrate:${platform.slug}`}
          />
        </div>
      </Marketing>
    );
  }

  // Problem page
  const { issue, affectedPlatforms } = data as { issue: MigrationIssue; affectedPlatforms: Platform[] };

  // BreadcrumbList structured data
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Migration guides", item: `${SITE_URL}/migrate/` },
      { "@type": "ListItem", position: 3, name: issue.title },
    ],
  };

  return (
    <Marketing>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
      <div className="wrap narrow prose">
        <div className="breadcrumb">
          <Link to="/migrate/">Migration guides</Link>
          <span className="breadcrumb__sep">→</span>
          <span>{issue.title}</span>
        </div>

        <h1>{issue.title} to Shopify</h1>
        <p className="updated">Last updated August 2026</p>

        <p>{issue.description}</p>

        {/* Affected platforms */}
        <div className="migration-status">
          <div className="migration-status__item">
            <b>Complexity</b>
            <span>{issue.complexity}/10</span>
          </div>
          <div className="migration-status__item">
            <b>Affected platforms</b>
            <span>{affectedPlatforms.length}</span>
          </div>
          <div className="migration-status__item">
            <b>Approach</b>
            <span>{issue.recommendedApproach.length > 60 ? "See below" : issue.recommendedApproach}</span>
          </div>
        </div>

        {/* What transfers */}
        <h2>What transfers</h2>
        <ul>
          {issue.whatMigrates.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {/* What does NOT */}
        <div className="warning">
          <strong>What does NOT transfer:</strong> Shopify migration tools cannot transfer all data types. The following are commonly lost during migration.
        </div>
        <ul>
          {issue.whatDoesNotMigrate.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {/* Risks */}
        <h2>Risks and common problems</h2>
        <ul>
          {issue.risks.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>

        {/* Recommended approach */}
        <h2>Recommended approach</h2>
        <p>{issue.recommendedApproach}</p>

        {/* Technical notes */}
        {issue.technicalNotes.length > 0 && (
          <>
            <h2>Technical notes</h2>
            <ul>
              {issue.technicalNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </>
        )}

        {/* Platform-specific pages */}
        <h2>Platform-specific guides</h2>
        <div className="related-guides">
          {affectedPlatforms.map((platform) => (
            <Link
              key={platform.slug}
              className="related-guide"
              to={`/migrate/${platform.slug}-to-shopify/${issue.slug}/`}
            >
              {platform.name}: {issue.title}
            </Link>
          ))}
        </div>

        {/* Related issues */}
        {issue.relatedIssues.length > 0 && (
          <>
            <h2>Related migration problems</h2>
            <div className="related-guides">
              {issue.relatedIssues.map((slug) => {
                const rel = MIGRATION_ISSUES.find((i) => i.hasPage && i.slug === slug);
                if (!rel) return null;
                return (
                  <Link key={slug} className="related-guide" to={`/migrate/${slug}/`}>
                    {rel.title}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Sources */}
        {issue.sources.length > 0 && (
          <>
            <h2>References</h2>
            <ul className="source-list">
              {issue.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="noopener" target="_blank">{s.title}</a> — {s.publisher}
                </li>
              ))}
            </ul>
          </>
        )}

        <MigrationCTA
          headline="Planning a Shopify migration?"
          body="Get a free assessment of your migration complexity and risks."
          source={`migrate:${issue.slug}`}
        />
      </div>
    </Marketing>
  );
}
