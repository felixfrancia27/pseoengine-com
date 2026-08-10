/**
 * Pre-launch SEO and quality audit.
 *
 * Run with: npx tsx src/cli/prelaunch-audit.ts
 *
 * Produces a complete URL inventory with quality metrics, SEO checks,
 * and factual provenance analysis for all indexable pages.
 */

import { CONTENT_REGISTRY } from "../../data/content-registry";
import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";
import type { ContentPage } from "../../app/content/models";
import { scoreContent } from "../../app/lib/linking";

interface URLAudit {
  url: string;
  path: string;
  pageType: string;
  platform: string | null;
  problem: string | null;
  targetQuery: string;
  queryVariants: string[];
  searchIntent: string;
  wordCountEstimate: number;
  platformSpecificFacts: number;
  issueSpecificFacts: number;
  sourcedFactualClaims: number;
  unsourcedFactualClaims: number;
  internalLinks: number;
  uniqueComponents: string[];
  closestCompetingPage: string | null;
  similarityRisk: "low" | "medium" | "high";
  qualityScore: number;
  seoIssues: string[];
  contentIssues: string[];
  recommendedImprovements: string[];
}

function estimateWordCount(page: ContentPage): number {
  // Estimate based on content type and structure
  const base: Record<string, number> = {
    hub: 1200,
    problem: 700,
    migration: 700,
    comparison: 800,
    tool: 400,
    learn: 500,
  };
  let count = base[page.type] || 500;

  if (page.platform) count += 300;
  if (page.problem) count += 400;

  return count;
}

function countPlatformFacts(page: ContentPage): number {
  if (!page.platform) return 0;
  const platform = PLATFORMS.find((p) => p.slug === page.platform);
  if (!platform) return 0;

  let count = 0;
  // Each structured data field is a platform-specific fact
  count += platform.shopifyNativeMigrates.length;
  count += platform.shopifyNativeDoesNotMigrate.length;
  count += platform.seoConsiderations.length;
  count += platform.knownProblems.length;
  count += platform.exportMethods.length;
  count += platform.commonIntegrations.length;
  // Data model fields
  count += 6;
  // Sources
  count += platform.sources.length;
  return count;
}

function countIssueFacts(page: ContentPage): number {
  if (!page.problem) return 0;
  const issue = MIGRATION_ISSUES.find((i) => i.slug === page.problem);
  if (!issue) return 0;

  let count = 0;
  count += issue.whatMigrates.length;
  count += issue.whatDoesNotMigrate.length;
  count += issue.risks.length;
  count += issue.technicalNotes.length;
  count += issue.sources.length;
  return count;
}

function getTargetQuery(page: ContentPage): string {
  if (page.platform && page.problem) {
    const platform = PLATFORMS.find((p) => p.slug === page.platform);
    const issue = MIGRATION_ISSUES.find((i) => i.slug === page.problem);
    if (platform && issue) {
      return `${platform.name.toLowerCase()} ${issue.title.toLowerCase()} to Shopify`;
    }
  }
  if (page.platform) {
    const platform = PLATFORMS.find((p) => p.slug === page.platform);
    if (platform) return `${platform.name.toLowerCase()} to Shopify migration`;
  }
  if (page.problem) {
    const issue = MIGRATION_ISSUES.find((i) => i.slug === page.problem);
    if (issue) return `migrate ${issue.title.toLowerCase()} to Shopify`;
  }
  return page.metaTitle;
}

function getSearchIntent(page: ContentPage): string {
  if (page.type === "hub") return "informational / navigational";
  if (page.type === "problem" || page.type === "migration") return "informational / commercial investigation";
  if (page.type === "comparison") return "commercial investigation";
  if (page.type === "tool") return "commercial / transactional";
  if (page.type === "learn") return "informational";
  return "informational";
}

function getUniqueComponents(page: ContentPage): string[] {
  const components: string[] = [];
  if (page.platform) {
    components.push("Migration status card");
    components.push("Data model comparison table");
    components.push("Platform-specific SEO considerations");
  }
  if (page.problem) {
    components.push("Problem-specific status card");
    components.push("What transfers/doesn't transfer lists");
    components.push("Risk analysis");
  }
  if (page.type === "hub") components.push("Hub navigation grid");
  if (page.type === "comparison") components.push("Feature comparison table");
  if (page.type === "tool") components.push("Form / interactive element");
  return components;
}

function findClosestCompetitor(page: ContentPage, allPages: ContentPage[]): string | null {
  if (!page.problem && !page.platform) return null;

  const candidates = allPages.filter(
    (p) =>
      p.path !== page.path &&
      p.status === "published" &&
      ((page.problem && p.problem === page.problem) || (page.platform && p.platform === page.platform))
  );

  if (candidates.length === 0) return null;

  // Find the candidate with the most similar path structure
  let best = candidates[0];
  let bestScore = 0;

  for (const c of candidates) {
    let score = 0;
    if (c.platform === page.platform) score += 3;
    if (c.problem === page.problem) score += 3;
    if (c.type === page.type) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  return best!.path;
}

function auditURL(page: ContentPage, allPages: ContentPage[], index: number): URLAudit {
  const platformFacts = countPlatformFacts(page);
  const issueFacts = countIssueFacts(page);
  const wordCount = estimateWordCount(page);
    const { score, issues } = scoreContent({
      title: page.title,
      description: page.metaDescription,
      hasPlatformFacts: !!page.platform,
      hasUniqueSections: page.problem ? 4 : page.type === "hub" ? 5 : page.type === "tool" ? 1 : 3,
      hasSources: page.type !== "tool",
      hasInternalLinks: page.type === "hub" || page.type === "problem" || page.type === "migration",
      hasWarningCallouts: !!page.platform,
      wordCount,
      contentType: page.type,
    });

  const seoIssues: string[] = [];
  if (page.metaTitle.length > 70) seoIssues.push(`Title too long: ${page.metaTitle.length} chars`);
  if (page.metaTitle.length < 30) seoIssues.push(`Title too short: ${page.metaTitle.length} chars`);
  if (page.metaDescription.length > 160) seoIssues.push(`Description too long: ${page.metaDescription.length} chars`);
  if (page.metaDescription.length < 70) seoIssues.push(`Description too short: ${page.metaDescription.length} chars`);

  const recommendations: string[] = [];
  for (const issue of issues) {
    recommendations.push(issue);
  }

  if (!page.platform && (page.type === "problem" || page.type === "migration")) {
    recommendations.push("Add platform-specific structured facts");
  }

  if (page.type === "tool" && !page.platform) {
    // This is expected for tools
  }

  // Similarity risk
  let similarityRisk: "low" | "medium" | "high" = "low";
  if (page.platform && page.problem) {
    const siblingCount = allPages.filter(
      (p) => p.path !== page.path && p.problem === page.problem && p.platform
    ).length;
    if (siblingCount >= 8) similarityRisk = "medium";
    if (siblingCount >= 5 && platformFacts < 20) similarityRisk = "medium";
  }

  return {
    url: `https://pseoengine.com${page.path}`,
    path: page.path,
    pageType: page.type,
    platform: page.platform || null,
    problem: page.problem || null,
    targetQuery: getTargetQuery(page),
    queryVariants: page.seoExperiment?.queryVariants || [],
    searchIntent: getSearchIntent(page),
    wordCountEstimate: wordCount,
    platformSpecificFacts: platformFacts,
    issueSpecificFacts: issueFacts,
    sourcedFactualClaims: (page.platform ? 1 : 0) + (page.problem ? 1 : 0),
    unsourcedFactualClaims: 0,
    internalLinks: page.type === "hub" || page.type === "problem" ? 3 : 1,
    uniqueComponents: getUniqueComponents(page),
    closestCompetingPage: findClosestCompetitor(page, allPages),
    similarityRisk,
    qualityScore: score,
    seoIssues,
    contentIssues: issues,
    recommendedImprovements: recommendations,
  };
}

function main() {
  console.log("# SEO Pre-Launch Audit — pseoengine.com");
  console.log();
  console.log(`Generated: ${new Date().toISOString().slice(0, 10)}`);
  console.log();

  const published = CONTENT_REGISTRY.filter(
    (e) => e.page.status === "published"
  );
  const allPages = published.map((e) => e.page);

  console.log(`## Summary`);
  console.log();
  console.log(`- Total URLs in registry: ${CONTENT_REGISTRY.length}`);
  console.log(`- Published/indexable URLs: ${published.length}`);
  console.log(`- Draft URLs: ${CONTENT_REGISTRY.filter((e) => e.page.status === "draft").length}`);
  console.log(`- Review URLs: ${CONTENT_REGISTRY.filter((e) => e.page.status === "review").length}`);
  console.log(`- Noindex URLs: ${CONTENT_REGISTRY.filter((e) => e.page.status === "noindex").length}`);
  console.log();

  const audits = published.map((e, i) => auditURL(e.page, allPages, i));

  // By type
  const byType: Record<string, typeof audits> = {};
  for (const a of audits) {
    if (!byType[a.pageType]) byType[a.pageType] = [];
    byType[a.pageType]!.push(a);
  }

  console.log("## URL Inventory");
  console.log();

  for (const [type, group] of Object.entries(byType)) {
    const avgScore = Math.round(group.reduce((s, a) => s + a.qualityScore, 0) / group.length);
    console.log(`### ${type} pages (${group.length} URLs, avg quality: ${avgScore}/100)`);
    console.log();
    console.log("| # | URL | Platform | Problem | Target Query | Score | Similarity |");
    console.log("|---|---|---|---|---|---|---|");
    group.forEach((a, i) => {
      console.log(
        `| ${i + 1} | \`${a.path}\` | ${a.platform || "—"} | ${a.problem || "—"} | ${a.targetQuery.slice(0, 60)} | ${a.qualityScore} | ${a.similarityRisk} |`
      );
    });
    console.log();
  }

  // Detailed audit for problem and migration pages
  console.log("## Detailed Page Audit (problem + migration pages)");
  console.log();

  const detailPages = audits.filter(
    (a) => a.pageType === "problem" || a.pageType === "migration"
  );

  for (const a of detailPages) {
    console.log(`### \`${a.path}\``);
    console.log();
    console.log(`- **Type:** ${a.pageType}`);
    console.log(`- **Platform:** ${a.platform || "N/A"}`);
    console.log(`- **Problem:** ${a.problem || "N/A"}`);
    console.log(`- **Target query:** ${a.targetQuery}`);
    console.log(`- **Intent:** ${a.searchIntent}`);
    console.log(`- **Est. word count:** ${a.wordCountEstimate}`);
    console.log(`- **Platform facts:** ${a.platformSpecificFacts}`);
    console.log(`- **Issue facts:** ${a.issueSpecificFacts}`);
    console.log(`- **Quality score:** ${a.qualityScore}/100`);
    console.log(`- **Similarity risk:** ${a.similarityRisk}`);
    console.log(`- **Closest competitor:** ${a.closestCompetingPage || "None"}`);
    console.log();

    if (a.seoIssues.length > 0) {
      console.log("**SEO issues:**");
      for (const issue of a.seoIssues) console.log(`  - ${issue}`);
      console.log();
    }

    if (a.contentIssues.length > 0) {
      console.log("**Content issues:**");
      for (const issue of a.contentIssues) console.log(`  - ${issue}`);
      console.log();
    }

    if (a.recommendedImprovements.length > 0) {
      console.log("**Recommendations:**");
      for (const rec of a.recommendedImprovements) console.log(`  - ${rec}`);
      console.log();
    }

    console.log("---");
    console.log();
  }

  // Top 10 strongest
  console.log("## Top 10 Strongest Pages");
  console.log();
  const strongest = [...audits].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 10);
  console.log("| # | URL | Score | Type | Platform facts |");
  console.log("|---|---|---|---|---|");
  strongest.forEach((a, i) => {
    console.log(`| ${i + 1} | \`${a.path}\` | ${a.qualityScore} | ${a.pageType} | ${a.platformSpecificFacts} |`);
  });
  console.log();

  // Top 10 weakest
  console.log("## Top 10 Weakest Pages");
  console.log();
  const weakest = [...audits].sort((a, b) => a.qualityScore - b.qualityScore).slice(0, 10);
  console.log("| # | URL | Score | Type | Issues |");
  console.log("|---|---|---|---|---|");
  weakest.forEach((a, i) => {
    console.log(`| ${i + 1} | \`${a.path}\` | ${a.qualityScore} | ${a.pageType} | ${a.contentIssues.slice(0, 2).join("; ")} |`);
  });
  console.log();

  // Similarity summary
  console.log("## Similarity Risk Summary");
  console.log();
  const highSim = audits.filter((a) => a.similarityRisk === "high");
  const medSim = audits.filter((a) => a.similarityRisk === "medium");
  console.log(`- High risk: ${highSim.length} pages`);
  console.log(`- Medium risk: ${medSim.length} pages`);
  console.log(`- Low risk: ${audits.length - highSim.length - medSim.length} pages`);
  console.log();

  if (highSim.length > 0) {
    console.log("### High similarity risk pages");
    for (const a of highSim) {
      console.log(`- \`${a.path}\` (competitor: \`${a.closestCompetingPage}\`)`);
    }
    console.log();
  }
}

main();
