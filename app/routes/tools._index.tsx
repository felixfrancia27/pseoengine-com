import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Marketing, marketingLinks } from "../marketing";
import { SITE_URL } from "../content/brand";

export const links = marketingLinks;

export const meta: MetaFunction = () => [
  { title: "Shopify Migration Tools — pseoengine" },
  { name: "description", content: "Free tools for planning your Shopify migration. Store assessment, migration complexity calculator, and platform analysis." },
  { tagName: "link", rel: "canonical", href: `${SITE_URL}/tools/` },
];

const TOOLS = [
  {
    to: "/tools/migration-assessment/",
    title: "Migration Assessment",
    desc: "Enter your store URL. We identify your platform, estimate migration complexity, and highlight likely risks.",
    badge: "Free",
  },
];

export default function ToolsIndex() {
  return (
    <Marketing>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <span className="eyebrow">Free tools</span>
          <h1>Shopify migration tools</h1>
          <p className="hero__sub">
            Free tools for planning your Shopify migration. Understand your store's migration complexity
            before you start.
          </p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="grid">
            {TOOLS.map((tool) => (
              <Link className="card" key={tool.to} to={tool.to}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <h3 style={{ margin: 0 }}>{tool.title}</h3>
                  <span className="pill pill--brand">{tool.badge}</span>
                </div>
                <p>{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Marketing>
  );
}
