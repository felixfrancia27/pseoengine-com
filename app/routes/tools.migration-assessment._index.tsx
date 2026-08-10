import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";
import { PLATFORMS } from "../../data/platforms/index";

export const links = marketingLinks;

export const meta: MetaFunction = () => [
  { title: "Free Shopify Migration Assessment — pseoengine" },
  { name: "description", content: "Get a free assessment of your ecommerce store's Shopify migration readiness. We analyze your platform, catalog size, and migration complexity." },
  { tagName: "link", rel: "canonical", href: `${SITE_URL}/tools/migration-assessment/` },
  { name: "robots", content: "index, follow" },
];

interface AssessmentResult {
  platform?: string;
  platformName?: string;
  complexity?: number;
  score?: number;
  risks?: string[];
  recommendations?: string[];
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const storeUrl = String(formData.get("storeUrl") || "");
  const platformStr = String(formData.get("platform") || "");
  const revenue = String(formData.get("revenue") || "");
  const productCount = parseInt(String(formData.get("productCount") || "0"), 10);
  const monthlyOrders = parseInt(String(formData.get("monthlyOrders") || "0"), 10);
  const b2b = formData.get("b2b") === "on";
  const physicalRetail = formData.get("physicalRetail") === "on";
  const email = String(formData.get("email") || "");

  // Detect platform from URL or selection
  let detectedPlatform = platformStr;
  if (!detectedPlatform && storeUrl) {
    for (const platform of PLATFORMS) {
      if (platform.techIndicators.some((indicator) =>
        storeUrl.toLowerCase().includes(indicator.toLowerCase())
      )) {
        detectedPlatform = platform.slug;
        break;
      }
    }
  }

  const platform = PLATFORMS.find((p) => p.slug === detectedPlatform);
  if (!platform) {
    return {
      platform: detectedPlatform || "unknown",
      platformName: "Unknown",
      complexity: 5,
      score: 40,
      risks: ["Platform not detected. Please select your current platform from the dropdown."],
      recommendations: ["Select your platform for a more accurate assessment."],
    };
  }

  // Score calculation
  let score = 50;

  // Base complexity from platform
  if (platform.migrationComplexity >= 8) score += 15;
  else if (platform.migrationComplexity >= 6) score += 10;
  else score += 5;

  // Native migration support
  if (platform.shopifyNativeMigrationSupport === "none") score += 10;
  else if (platform.shopifyNativeMigrationSupport === "partial") score += 5;

  // Catalog size
  if (productCount > 5000) score += 15;
  else if (productCount > 1000) score += 10;
  else if (productCount > 100) score += 5;

  // B2B
  if (b2b) score += 20;

  // Physical retail
  if (physicalRetail) score += 10;

  // Monthly orders
  if (monthlyOrders > 5000) score += 10;
  else if (monthlyOrders > 1000) score += 5;

  // Revenue
  if (revenue === "over-10m") score += 15;
  else if (revenue === "1m-10m") score += 10;
  else if (revenue === "100k-1m") score += 5;

  // Cap at 100
  score = Math.min(score, 100);

  const risks: string[] = [];

  if (platform.shopifyNativeMigrationSupport === "none") {
    risks.push(`No native Shopify migration tool available for ${platform.name}. All migration requires third-party tools or custom development.`);
  }
  if (platform.migrationComplexity >= 8) {
    risks.push(`${platform.name} has high migration complexity due to its data model. Plan for a longer migration timeline.`);
  }
  if (platform.knownProblems.includes("order-history")) {
    risks.push("Order history migration requires special handling. Shopify's native tool does not transfer orders from this platform.");
  }
  if (b2b) {
    risks.push("B2B features may require Shopify Plus and additional apps to replicate.");
  }
  if (platform.knownProblems.includes("subscriptions")) {
    risks.push("Active subscriptions cannot be migrated automatically. A phased migration with customer communication is required.");
  }
  if (platform.knownProblems.includes("seo")) {
    risks.push(`SEO migration from ${platform.name} requires careful redirect planning due to different URL structures.`);
  }

  const recommendations: string[] = [];
  if (platform.shopifyNativeMigrationSupport !== "full") {
    recommendations.push(`Consider using Matrixify or Cart2Cart for data types not covered by Shopify's native tool.`);
  }
  if (b2b) {
    recommendations.push("Evaluate Shopify Plus B2B features or B2B apps (SparkLayer, B2B Handsfree) before migration.");
  }
  if (platform.knownProblems.length > 5) {
    recommendations.push(`Review our ${platform.name}-to-Shopify migration guide for specific problem-by-problem guidance.`);
  }
  recommendations.push("Create a complete 301 redirect map before migration to preserve SEO value.");

  return {
    platform: platform.slug,
    platformName: platform.name,
    complexity: platform.migrationComplexity,
    score,
    risks: risks.slice(0, 5),
    recommendations: recommendations.slice(0, 4),
  } satisfies AssessmentResult;
};

export default function MigrationAssessment() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Marketing>
      <div className="wrap narrow prose">
        <div className="breadcrumb">
          <Link to="/tools/">Tools</Link>
          <span className="breadcrumb__sep">→</span>
          <span>Migration Assessment</span>
        </div>

        <h1>Free Shopify Migration Assessment</h1>
        <p className="updated">Enter your store details for an instant migration complexity estimate.</p>

        {!result ? (
          <Form method="post" className="assessment-form">
            <label htmlFor="storeUrl">Store URL</label>
            <input id="storeUrl" name="storeUrl" type="url" placeholder="https://yourstore.com" autoComplete="url" />

            <button type="submit" className="btn btn--primary btn--lg" disabled={isSubmitting} style={{ width: "100%", marginBottom: 28 }}>
              {isSubmitting ? "Analyzing..." : "Analyze my store"}
            </button>

            <details style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "0 18px" }}>
              <summary style={{ padding: "14px 0", cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
                Optional: tell us more for a detailed assessment
              </summary>
              <div style={{ paddingBottom: 14 }}>
                <label htmlFor="platform">Current platform</label>
                <select id="platform" name="platform">
                  <option value="">Auto-detect from URL</option>
                  {PLATFORMS.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>

                <label htmlFor="revenue">Approximate annual revenue</label>
                <select id="revenue" name="revenue">
                  <option value="">Prefer not to say</option>
                  <option value="under-100k">Under $100K</option>
                  <option value="100k-1m">$100K – $1M</option>
                  <option value="1m-10m">$1M – $10M</option>
                  <option value="over-10m">Over $10M</option>
                </select>

                <label htmlFor="productCount">Number of products</label>
                <input id="productCount" name="productCount" type="number" placeholder="e.g. 500" />

                <label htmlFor="monthlyOrders">Monthly orders (approx.)</label>
                <input id="monthlyOrders" name="monthlyOrders" type="number" placeholder="e.g. 200" />

                <div className="checkbox-row">
                  <input type="checkbox" id="b2b" name="b2b" />
                  <label htmlFor="b2b">B2B / wholesale operations</label>
                </div>

                <div className="checkbox-row">
                  <input type="checkbox" id="physicalRetail" name="physicalRetail" />
                  <label htmlFor="physicalRetail">Physical retail / POS</label>
                </div>

                <label htmlFor="email">Email (for follow-up)</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
              </div>
            </details>
          </Form>
        ) : (
          <div>
            <div className="migration-status">
              <div className="migration-status__item">
                <b>Platform</b>
                <span>{result.platformName}</span>
              </div>
              <div className="migration-status__item">
                <b>Complexity</b>
                <span>{result.complexity}/10</span>
              </div>
              <div className="migration-status__item">
                <b>Migration score</b>
                <span>{result.score}/100</span>
              </div>
            </div>

            <div style={{ margin: "20px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)", marginBottom: 4 }}>
                <span>Migration effort</span>
                <span>{result.score}/100</span>
              </div>
              <div className="score-bar">
                <div
                  className={`score-bar__fill ${result.score >= 70 ? "score-bar__fill--bad" : result.score >= 40 ? "score-bar__fill--medium" : "score-bar__fill--good"}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6 }}>
                {result.score >= 70
                  ? "Complex migration. Plan for 3-6 months with dedicated engineering support."
                  : result.score >= 40
                    ? "Moderate complexity. 2-3 months with migration tools and some custom work."
                    : "Straightforward migration. 2-4 weeks with Shopify's native tools."}
              </p>
            </div>

            {result.risks.length > 0 && (
              <>
                <h2>Key risks</h2>
                <ul>
                  {result.risks.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </>
            )}

            {result.recommendations.length > 0 && (
              <>
                <h2>Recommendations</h2>
                <ul>
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </>
            )}

            <div style={{ marginTop: 24 }}>
              <Link to={`/migrate/${result.platform}-to-shopify/`} className="btn btn--primary">
                View {result.platformName} migration guide →
              </Link>
            </div>

            <div style={{ marginTop: 32 }}>
              <Form method="post">
                <input type="hidden" name="reset" value="1" />
                <button type="submit" className="btn btn--ghost">Start a new assessment</button>
              </Form>
            </div>
          </div>
        )}

        {!result && <MigrationCTA source="tools:assessment" />}
      </div>
    </Marketing>
  );
}
