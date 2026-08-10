import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { BRAND, SITE_URL } from "../content/brand";
import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";

export const links = marketingLinks;

const TITLE = `${BRAND.name} — Technical Shopify Migration Intelligence`;
const DESCRIPTION = BRAND.shortDescription;

export const meta: MetaFunction = () => [
  { title: TITLE },
  { name: "description", content: DESCRIPTION },
  { tagName: "link", rel: "canonical", href: SITE_URL },
  { property: "og:title", content: TITLE },
  { property: "og:description", content: DESCRIPTION },
  { property: "og:url", content: SITE_URL },
];

const FAQS = [
  {
    q: "Can Shopify's migration tool move order history?",
    a: "The Shopify Store Migration app does not import historical orders from any platform. It handles products, product images, and customer records from its supported platforms (Square, WooCommerce, Etsy, Wix, Amazon, eBay, Clover, Lightspeed). Orders can still be migrated to Shopify using migration apps like Matrixify or the GraphQL Admin API.",
  },
  {
    q: "Will migrating to Shopify hurt my SEO?",
    a: "A platform migration can affect organic search traffic. The impact depends on URL changes, redirect implementation, crawl frequency, and content changes. We document the specific SEO migration steps for each platform.",
  },
  {
    q: "What platforms does Shopify's Store Migration app support?",
    a: "As of 2026, the Store Migration app supports importing from Square, WooCommerce, Etsy, Wix, Amazon, eBay, Clover, and Lightspeed. Other platforms require CSV import or third-party migration apps like Matrixify or Cart2Cart.",
  },
  {
    q: "How long does a Shopify migration take?",
    a: "A basic data migration can be done in days to a couple of weeks. Complex stores with custom integrations, B2B features, subscriptions, or large amounts of data require more planning and testing — typically weeks to months.",
  },
];

const POPULAR_PLATFORMS = ["woocommerce", "magento", "bigcommerce", "vtex", "prestashop", "shopware"];

export default function Index() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <Marketing>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap" style={{ textAlign: "center" }}>
          <span className="eyebrow">Shopify migration intelligence</span>
          <h1 style={{ maxWidth: "14ch", margin: "0 auto 22px" }}>
            Know what will <em>break</em> before moving to Shopify
          </h1>
          <p className="hero__sub" style={{ maxWidth: "56ch", margin: "0 auto 32px" }}>
            Technical migration guides, platform compatibility data, and SEO migration planning for established ecommerce stores moving to Shopify.
          </p>

          <div className="scan-console">
            <div className="scan-console__top">
              <span>Start with your store URL</span>
              <b>Free · No signup</b>
            </div>
            <Link to="/tools/migration-assessment/?source=home:hero" className="btn btn--primary btn--lg" style={{ display: "inline-flex", width: "100%", justifyContent: "center" }}>
              Assess my store
            </Link>
            <div className="scan-console__notes">
              <span>Identify your platform</span>
              <span>Estimate complexity</span>
              <span>Get migration roadmap</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular migrations ─────────────────────────── */}
      <section className="sec">
        <div className="wrap">
          <h2>Popular migrations</h2>
          <p className="sec__lead">Technical migration guides for the most common platform moves.</p>
          <div className="grid">
            {POPULAR_PLATFORMS.map((slug) => {
              const platform = PLATFORMS.find((p) => p.slug === slug);
              if (!platform) return null;
              return (
                <Link className="card" key={slug} to={`/migrate/${slug}-to-shopify/`}>
                  <h3>{platform.name} → Shopify</h3>
                  <p>Migration complexity: {platform.migrationComplexity}/10. {platform.shopifyNativeMigrationSupport === "none" ? "No native migration tool." : platform.shopifyNativeMigrationSupport === "partial" ? "Partial native support." : "Full native migration available."}</p>
                </Link>
              );
            })}
          </div>
          <p style={{ marginTop: 22 }}>
            <Link to="/migrate/">All platform guides →</Link>
          </p>
        </div>
      </section>

      {/* ── Common problems ────────────────────────────── */}
      <section className="sec">
        <div className="wrap">
          <h2>Common migration problems</h2>
          <p className="sec__lead">What breaks, what transfers, and how to handle each.</p>
          <div className="grid">
            {MIGRATION_ISSUES.filter((i) => i.hasPage && i.priority >= 80).slice(0, 9).map((issue) => (
              <Link className="card" key={issue.slug} to={`/migrate/${issue.slug}/`}>
                <h3>{issue.title}</h3>
                <p>{issue.description.slice(0, 120)}...</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Migration tools ────────────────────────────── */}
      <section className="sec">
        <div className="wrap">
          <h2>Migration tools</h2>
          <div className="grid grid--2">
            <Link className="card" to="/tools/migration-assessment/">
              <h3>Free Migration Assessment</h3>
              <p>Enter your store URL. We identify your platform, estimate complexity, and highlight likely migration risks.</p>
            </Link>
            <Link className="card" to="/shopify-store-migration/">
              <h3>Shopify Store Migration Guide</h3>
              <p>Complete reference for Shopify's built-in migration tool: capabilities, limitations, and alternatives.</p>
            </Link>
            <Link className="card" to="/compare/shopify-store-migration-vs-matrixify/">
              <h3>Store Migration vs Matrixify</h3>
              <p>Side-by-side comparison of Shopify's native migration tool and Matrixify for data import.</p>
            </Link>
            <Link className="card" to="/compare/shopify-store-migration-vs-cart2cart/">
              <h3>Store Migration vs Cart2Cart</h3>
              <p>Compare Shopify's built-in tool with the Cart2Cart automated migration service.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section className="sec">
        <div className="wrap">
          <h2>Questions merchants ask first</h2>
          <div className="faq-section">
            {FAQS.map((item) => (
              <div className="faq-item" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="sec">
        <div className="wrap">
          <MigrationCTA source="home:closing" />
        </div>
      </section>
    </Marketing>
  );
}
