import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";
import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";

export const links = marketingLinks;

export const meta: MetaFunction = () => [
  { title: "Shopify Migration Knowledge Base — pseoengine" },
  { name: "description", content: "In-depth technical guides on Shopify migration planning, platform compatibility, SEO preservation, and migration tooling." },
  { tagName: "link", rel: "canonical", href: `${SITE_URL}/learn/` },
];

export default function LearnIndex() {
  return (
    <Marketing>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <span className="eyebrow">Knowledge base</span>
          <h1 style={{ maxWidth: "18ch" }}>Shopify migration knowledge base</h1>
          <p className="hero__sub">
            Technical guides, platform compatibility data, and migration planning resources
            for established ecommerce stores moving to Shopify.
          </p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Platform migration guides</h2>
          <p className="sec__lead">Complete migration guides for every platform with platform-specific data.</p>
          <div className="grid">
            {PLATFORMS.map((p) => (
              <Link className="card" key={p.slug} to={`/migrate/${p.slug}-to-shopify/`}>
                <h3>{p.name} → Shopify</h3>
                <p>{p.description}</p>
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-3)" }}>
                  {p.knownProblems.length} documented problems · Complexity {p.migrationComplexity}/10
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2>Migration problem guides</h2>
          <p className="sec__lead">Specific migration problems explained with platform-specific analysis.</p>
          <div className="grid">
            {MIGRATION_ISSUES.filter((i) => i.hasPage).map((issue) => (
              <Link className="card" key={issue.slug} to={`/migrate/${issue.slug}/`}>
                <h3>{issue.title}</h3>
                <p>{issue.description}</p>
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-3)" }}>
                  Affects {issue.affectedPlatforms.length} platforms · Complexity {issue.complexity}/10
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2>Shopify Store Migration tool</h2>
          <div className="grid grid--2">
            <Link className="card" to="/shopify-store-migration/">
              <h3>Complete Store Migration guide</h3>
              <p>Everything you need to know about Shopify's built-in migration tool.</p>
            </Link>
            <Link className="card" to="/shopify-store-migration/limitations/">
              <h3>Store Migration limitations</h3>
              <p>What Shopify's migration tool cannot do, by platform and data type.</p>
            </Link>
            <Link className="card" to="/shopify-store-migration/orders/">
              <h3>Does it migrate orders?</h3>
              <p>Whether the native migration tool transfers order history.</p>
            </Link>
            <Link className="card" to="/shopify-store-migration/seo/">
              <h3>SEO & redirects</h3>
              <p>How Shopify's migration handles SEO and URL redirects.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <MigrationCTA source="learn" />
        </div>
      </section>
    </Marketing>
  );
}
