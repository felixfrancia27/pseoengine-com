import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PLATFORMS } from "../../data/platforms/index";
import { getPageByPath } from "../../data/content-registry";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";

export const links = marketingLinks;

export const meta: MetaFunction = () => [
  { title: "Shopify Migration Guides by Platform — pseoengine" },
  { name: "description", content: "Technical migration guides for every major ecommerce platform moving to Shopify. Covers WooCommerce, Magento, BigCommerce, PrestaShop, Shopware, VTEX, Tiendanube, Nuvemshop, and more." },
  { tagName: "link", rel: "canonical", href: `${SITE_URL}/migrate/` },
];

export const loader = async () => {
  return { platforms: PLATFORMS };
};

function complexityLabel(n: number): string {
  if (n <= 4) return "Low";
  if (n <= 6) return "Medium";
  if (n <= 8) return "High";
  return "Very High";
}

function supportBadge(support: string) {
  switch (support) {
    case "full": return { label: "Native support", tone: "good" };
    case "partial": return { label: "Partial support", tone: "warn" };
    case "none": return { label: "No native support", tone: "bad" };
    default: return { label: "Unknown", tone: "neutral" };
  }
}

export default function MigrateIndex() {
  const { platforms } = useLoaderData<typeof loader>();

  return (
    <Marketing>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <span className="eyebrow">Migration guides</span>
          <h1 style={{ maxWidth: "16ch" }}>Shopify migration guides by platform</h1>
          <p className="hero__sub">
            Technical migration intelligence for every major ecommerce platform. Each guide covers what data migrates,
            what does not, known problems, SEO considerations, and the recommended approach.
          </p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="grid">
            {platforms.map((platform) => {
              const badge = supportBadge(platform.shopifyNativeMigrationSupport);
              return (
                <Link
                  className="card"
                  key={platform.slug}
                  to={`/migrate/${platform.slug}-to-shopify/`}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h3 style={{ margin: 0 }}>{platform.name} → Shopify</h3>
                    <span className={`pill pill--${badge.tone}`}>{badge.label}</span>
                  </div>
                  <p style={{ fontSize: 14 }}>{platform.description}</p>
                  <div style={{ marginTop: 12, fontSize: 13, color: "var(--ink-3)" }}>
                    Complexity: {complexityLabel(platform.migrationComplexity)} ({platform.migrationComplexity}/10)
                    &nbsp;·&nbsp;
                    {platform.knownProblems.length} documented problems
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <MigrationCTA source="migrate-hub" />
        </div>
      </section>
    </Marketing>
  );
}
