import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";
import { Marketing, marketingLinks, MigrationCTA } from "../marketing";
import { SITE_URL } from "../content/brand";
import type { Platform, MigrationIssue } from "../content/models";

export const links = marketingLinks;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { platform: platformParam, problem: problemParam } = params;
  if (!platformParam || !problemParam) throw new Response("Not Found", { status: 404 });

  const platformSlug = platformParam.replace(/-to-shopify$/, "");
  const platform = PLATFORMS.find((p) => p.slug === platformSlug);

  if (!platform || platformParam !== `${platform.slug}-to-shopify`) {
    throw new Response("Not Found", { status: 404 });
  }

  const issue = MIGRATION_ISSUES.find(
    (i) => i.hasPage && i.slug === problemParam && i.affectedPlatforms.includes(platform.slug)
  );

  if (!issue) throw new Response("Not Found", { status: 404 });

  return { platform, issue };
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) return [];
  const d = data as { platform: Platform; issue: MigrationIssue };

  return [
    { title: `${d.platform.name} ${d.issue.title} to Shopify — pseoengine` },
    {
      name: "description",
      content: `How to handle ${d.issue.title.toLowerCase()} when migrating from ${d.platform.name} to Shopify. What transfers, what doesn't, risks, and recommended approach.`,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `${SITE_URL}/migrate/${d.platform.slug}-to-shopify/${d.issue.slug}/`,
    },
  ];
};

export default function PlatformProblemPage() {
  const { platform, issue } = useLoaderData<typeof loader>();

  const otherIssues = MIGRATION_ISSUES.filter(
    (i) => i.hasPage && i.affectedPlatforms.includes(platform.slug) && i.slug !== issue.slug
  ).slice(0, 6);

  // BreadcrumbList structured data
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Migration guides", item: `${SITE_URL}/migrate/` },
      { "@type": "ListItem", position: 3, name: `${platform.name} to Shopify`, item: `${SITE_URL}/migrate/${platform.slug}-to-shopify/` },
      { "@type": "ListItem", position: 4, name: issue.title },
    ],
  };

  return (
    <Marketing>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
      <div className="wrap narrow prose">
        <div className="breadcrumb">
          <Link to="/migrate/">Migration guides</Link>
          <span className="breadcrumb__sep">→</span>
          <Link to={`/migrate/${platform.slug}-to-shopify/`}>{platform.name} → Shopify</Link>
          <span className="breadcrumb__sep">→</span>
          <span>{issue.title}</span>
        </div>

        <h1>{platform.name} {issue.title} to Shopify</h1>
        <p className="updated">Last updated August 2026</p>

        <p>
          A technical guide to handling {issue.title.toLowerCase()} when migrating from{" "}
          {platform.name} to Shopify. This covers what transfers, what does not, the specific
          risks for {platform.name} stores, and the recommended approach.
        </p>

        {/* Status card */}
        <div className="migration-status">
          <div className="migration-status__item">
            <b>Platform</b>
            <span>{platform.name}</span>
          </div>
          <div className="migration-status__item">
            <b>Complexity</b>
            <span>{issue.complexity}/10</span>
          </div>
          <div className="migration-status__item">
            <b>Native support</b>
            <span className={`is-${platform.shopifyNativeMigrationSupport === "none" ? "no" : platform.shopifyNativeMigrationSupport === "partial" ? "partial" : "yes"}`}>
              {platform.shopifyNativeMigrationSupport === "none" ? "Not available" : platform.shopifyNativeMigrationSupport === "partial" ? "Partial" : "Full"}
            </span>
          </div>
          <div className="migration-status__item">
            <b>Data risk</b>
            <span className={issue.complexity >= 7 ? "is-no" : issue.complexity >= 5 ? "is-partial" : "is-yes"}>
              {issue.complexity >= 7 ? "High" : issue.complexity >= 5 ? "Medium" : "Low"}
            </span>
          </div>
        </div>

        {/* Platform-specific context */}
        <h2>{platform.name}-specific considerations</h2>
        <p>
          When migrating {issue.title.toLowerCase()} from {platform.name}, the following
          platform-specific aspects must be considered:
        </p>

        <h3>Data model implications</h3>
        <p>
          {platform.name}'s data model stores this information differently than Shopify.
          In {platform.name}: {platform.dataModel.orderModel || platform.dataModel.productModel}.
        </p>

        {/* Can Shopify's tool handle it? */}
        <h3>Can Shopify's Store Migration app handle {issue.title.toLowerCase()}?</h3>
        {platform.shopifyNativeMigrationSupport === "none" ? (
          <div className="warning">
            <strong>No:</strong> Shopify does not offer a native Store Migration tool for {platform.name}. You must use third-party tools or custom development.
          </div>
        ) : (
          <div className={platform.shopifyNativeDoesNotMigrate.some((item) =>
            item.toLowerCase().includes(issue.slug.replace(/-/g, " "))
          ) || platform.shopifyNativeMigrates.every((item) =>
            !item.toLowerCase().includes(issue.slug.replace(/-/g, " "))
          ) ? "warning" : "info-callout"}>
            {platform.shopifyNativeDoesNotMigrate.some((item) =>
              item.toLowerCase().includes(issue.slug.replace(/-/g, " "))
            )
              ? <><strong>Not supported:</strong> Shopify's native migration tool does not transfer {issue.title.toLowerCase()} from {platform.name}. You must use alternative methods.</>
              : <><strong>Partially supported:</strong> Shopify's native migration can transfer some aspects of {issue.title.toLowerCase()}, but not all. Review the details below.</>
            }
          </div>
        )}

        {/* What transfers */}
        <h2>What transfers</h2>
        <ul>
          {issue.whatMigrates.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>What does NOT transfer</h2>
        <ul>
          {issue.whatDoesNotMigrate.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {/* Risks */}
        <h2>Specific risks for {platform.name} stores</h2>
        <ul>
          {issue.risks.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>

        {/* Approach */}
        <h2>Recommended approach</h2>
        <p>{issue.recommendedApproach}</p>

        {/* Export methods */}
        <h2>Exporting {issue.title.toLowerCase()} data from {platform.name}</h2>
        <ul>
          {platform.exportMethods.map((method) => (
            <li key={method}>{method}</li>
          ))}
        </ul>

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

        {/* Other issues */}
        {otherIssues.length > 0 && (
          <>
            <h2>Other {platform.name} migration issues</h2>
            <div className="related-guides">
              {otherIssues.map((rel) => (
                <Link
                  key={rel.slug}
                  className="related-guide"
                  to={`/migrate/${platform.slug}-to-shopify/${rel.slug}/`}
                >
                  {rel.title}
                </Link>
              ))}
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
          headline={`Migrating ${platform.name} to Shopify?`}
          body="Get a free assessment of your migration complexity, risks, and the specific issues for your platform."
          source={`migrate:${platform.slug}:${issue.slug}`}
        />
      </div>
    </Marketing>
  );
}
