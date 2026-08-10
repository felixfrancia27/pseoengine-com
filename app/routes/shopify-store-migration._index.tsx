import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";

export const links = marketingLinks;

export const meta: MetaFunction = () => [
  { title: "Shopify Store Migration App — Complete Guide — pseoengine" },
  { name: "description", content: "Everything you need to know about Shopify's built-in Store Migration tool. Covers capabilities, limitations by platform, what data transfers, and when to use alternatives." },
  { tagName: "link", rel: "canonical", href: `${SITE_URL}/shopify-store-migration/` },
];

const PAGES = [
  { to: "/shopify-store-migration/limitations/", title: "Store Migration Limitations", desc: "What Shopify's built-in migration tool cannot do, by platform and data type." },
  { to: "/shopify-store-migration/orders/", title: "Does it migrate orders?", desc: "Whether the native migration tool transfers historical order data and how to import orders." },
  { to: "/shopify-store-migration/seo/", title: "SEO & Redirects", desc: "How Shopify's migration handles SEO, URL redirects, metadata, and preserving search rankings." },
  { to: "/shopify-store-migration/redirects/", title: "URL Redirects", desc: "301 redirect management during Shopify migration, limits, and best practices." },
  { to: "/shopify-store-migration/customer-passwords/", title: "Customer Passwords", desc: "Why customer passwords never transfer between platforms and how to handle account migration." },
  { to: "/shopify-store-migration/reviews/", title: "Product Reviews", desc: "Whether product reviews transfer through Shopify's migration and how to migrate reviews." },
];

export default function StoreMigrationIndex() {
  return (
    <Marketing>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <span className="eyebrow">Shopify Store Migration</span>
          <h1 style={{ maxWidth: "16ch" }}>Shopify Store Migration App — Complete Guide</h1>
          <p className="hero__sub">
            Everything you need to know about Shopify's built-in Store Migration tool. What it migrates,
            what it doesn't, its limitations by platform, and when you need a different approach.
          </p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap narrow prose">
          <h2>What is Shopify's Store Migration app?</h2>
          <p>
            The Store Migration app is Shopify's free, first-party app for importing product and customer
            data from other platforms. It supports CSV upload and direct account connections for select
            source platforms. It does <strong>not</strong> import orders, reviews, blog posts, or gift cards.
          </p>

          <h2>Supported source platforms</h2>
          <p>As verified against the Shopify App Store listing (August 2026):</p>
          <div className="migration-status">
            <div className="migration-status__item">
              <b>WooCommerce</b>
              <span className="is-yes">Supported</span>
            </div>
            <div className="migration-status__item">
              <b>Wix</b>
              <span className="is-yes">Supported</span>
            </div>
            <div className="migration-status__item">
              <b>Etsy</b>
              <span className="is-yes">Supported</span>
            </div>
            <div className="migration-status__item">
              <b>Amazon</b>
              <span className="is-yes">Supported</span>
            </div>
            <div className="migration-status__item">
              <b>eBay</b>
              <span className="is-yes">Supported</span>
            </div>
            <div className="migration-status__item">
              <b>Square</b>
              <span className="is-yes">Supported</span>
            </div>
            <div className="migration-status__item">
              <b>Clover</b>
              <span className="is-yes">Supported</span>
            </div>
            <div className="migration-status__item">
              <b>Lightspeed</b>
              <span className="is-yes">Supported</span>
            </div>
          </div>

          <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 12 }}>
            Platforms not listed — including Magento, BigCommerce, PrestaShop, Shopware, VTEX, 
            Tiendanube, Nuvemshop, Squarespace, and OpenCart — are not supported by the Store 
            Migration app. Use third-party apps like Matrixify or Cart2Cart, or the Shopify 
            GraphQL Admin API for custom migrations.
          </p>

          <h2>Guide pages</h2>
          <div className="grid grid--2" style={{ marginTop: 20 }}>
            {PAGES.map((page) => (
              <Link key={page.to} className="card" to={page.to}>
                <h3>{page.title}</h3>
                <p>{page.desc}</p>
              </Link>
            ))}
          </div>

          <h2>When to use alternatives</h2>
          <div className="info-callout">
            Shopify's Store Migration app works well for simple stores with standard product data.
            If your store has custom fields, B2B features, subscriptions, complex product configurations,
            or you need order history migration, consider using Matrixify, Cart2Cart, or a custom
            migration approach.
          </div>

          <h2>Tool comparisons</h2>
          <div className="grid grid--2" style={{ marginTop: 20 }}>
            <Link className="card" to="/compare/shopify-store-migration-vs-matrixify/">
              <h3>Store Migration vs Matrixify</h3>
              <p>Compare Shopify's native tool with Matrixify (Excelify) for data import and bulk editing.</p>
            </Link>
            <Link className="card" to="/compare/shopify-store-migration-vs-cart2cart/">
              <h3>Store Migration vs Cart2Cart</h3>
              <p>Compare Shopify's built-in migration with the Cart2Cart automated migration service.</p>
            </Link>
          </div>

          <MigrationCTA source="shopify-store-migration" />
        </div>
      </section>
    </Marketing>
  );
}
