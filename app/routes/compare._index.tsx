import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";

export const links = marketingLinks;

export const meta: MetaFunction = () => [
  { title: "Compare Shopify Migration Tools — pseoengine" },
  { name: "description", content: "Compare Shopify migration tools and services side-by-side. Shopify Store Migration vs Matrixify vs Cart2Cart — features, platform support, pricing." },
  { tagName: "link", rel: "canonical", href: `${SITE_URL}/compare/` },
];

export default function CompareIndex() {
  return (
    <Marketing>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <span className="eyebrow">Tool comparisons</span>
          <h1>Compare Shopify migration tools</h1>
          <p className="hero__sub">
            Side-by-side analysis of Shopify migration tools. Understand the tradeoffs between
            Shopify's native Store Migration app, Matrixify, and Cart2Cart.
          </p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap narrow prose">
          <h2>Migration tool comparison summary</h2>

          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Store Migration</th>
                <th>Matrixify</th>
                <th>Cart2Cart</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Price</strong></td>
                <td>Free (built into Shopify)</td>
                <td>From $20/month</td>
                <td>From $69 (one-time)</td>
              </tr>
              <tr>
                <td><strong>Platforms</strong></td>
                <td>8 platforms</td>
                <td>Any (CSV import)</td>
                <td>85+ platforms</td>
              </tr>
              <tr>
                <td><strong>Order migration</strong></td>
                <td>Limited</td>
                <td>Full support</td>
                <td>Full support</td>
              </tr>
              <tr>
                <td><strong>Custom fields</strong></td>
                <td>No</td>
                <td>Yes (metafields)</td>
                <td>Limited</td>
              </tr>
              <tr>
                <td><strong>Automation</strong></td>
                <td>Manual</td>
                <td>Scheduled imports</td>
                <td>One-time migration</td>
              </tr>
              <tr>
                <td><strong>Learning curve</strong></td>
                <td>Low</td>
                <td>Medium</td>
                <td>Low</td>
              </tr>
            </tbody>
          </table>

          <h2>Detailed comparisons</h2>
          <div className="grid grid--2" style={{ marginTop: 20 }}>
            <Link className="card" to="/compare/shopify-store-migration-vs-matrixify/">
              <h3>Store Migration vs Matrixify</h3>
              <p>Compare Shopify's native migration tool with Matrixify for data import, bulk editing, and scheduled operations.</p>
            </Link>
            <Link className="card" to="/compare/shopify-store-migration-vs-cart2cart/">
              <h3>Store Migration vs Cart2Cart</h3>
              <p>Compare Shopify's built-in tool with the Cart2Cart automated migration service for cross-platform transfers.</p>
            </Link>
          </div>

          <MigrationCTA source="compare" />
        </div>
      </section>
    </Marketing>
  );
}
