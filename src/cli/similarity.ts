/**
 * Content similarity detection tool.
 *
 * Run with: npx tsx src/cli/similarity.ts
 *
 * Compares all published content pages to detect:
 * - Identical paragraphs
 * - Highly similar sections
 * - Repeated intros/conclusions
 * - Pages mostly differing by entity names (platform substitution)
 */

import { CONTENT_REGISTRY } from "../../data/content-registry";
import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";
import type { ContentPage } from "../../app/content/models";

interface SimilarityResult {
  pair: [string, string];
  score: number;
  severity: "critical" | "high" | "review" | "low";
  sharedPatterns: string[];
}

interface PageContent {
  path: string;
  title: string;
  introParagraph: string;
  headingStructure: string[];
  sections: string[];
  bodyText: string;
  platformSlug?: string;
  problemSlug?: string;
}

function extractPageContent(page: ContentPage): PageContent {
  const bodyParts: string[] = [];

  if (page.platform) {
    const platform = PLATFORMS.find((p) => p.slug === page.platform);
    if (platform) {
      bodyParts.push(platform.longDescription || platform.description);
      bodyParts.push(platform.dataModel.productModel);
      bodyParts.push(platform.dataModel.variantModel);
      bodyParts.push(platform.dataModel.categoryModel);
      bodyParts.push(platform.dataModel.customerModel);
      bodyParts.push(platform.dataModel.orderModel);
      bodyParts.push(platform.dataModel.urlStructure);
    }
  }

  if (page.problem) {
    const issue = MIGRATION_ISSUES.find((i) => i.slug === page.problem);
    if (issue) {
      bodyParts.push(issue.description);
      bodyParts.push(issue.recommendedApproach);
      bodyParts.push(...issue.whatMigrates);
      bodyParts.push(...issue.whatDoesNotMigrate);
      bodyParts.push(...issue.risks);
    }
  }

  const headingStructure: string[] = [];
  if (page.platform) {
    headingStructure.push("Data model comparison");
    headingStructure.push("Export methods");
    headingStructure.push("Known migration problems");
    headingStructure.push("SEO considerations");
  }
  if (page.problem) {
    headingStructure.push("What transfers");
    headingStructure.push("What does NOT transfer");
    headingStructure.push("Risks");
    headingStructure.push("Recommended approach");
    headingStructure.push("Technical notes");
    headingStructure.push("References");
  }

  return {
    path: page.path,
    title: page.title,
    introParagraph: page.metaDescription,
    headingStructure,
    sections: bodyParts,
    bodyText: bodyParts.join(" ").toLowerCase(),
    platformSlug: page.platform,
    problemSlug: page.problem,
  };
}

/**
 * Jaccard similarity on word tokens.
 */
function textSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.toLowerCase().split(/\s+/).filter((t) => t.length > 2));
  const tokensB = new Set(b.toLowerCase().split(/\s+/).filter((t) => t.length > 2));
  const intersection = new Set([...tokensA].filter((x) => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Check if two pages differ mainly by platform name substitution.
 */
function detectNameSubstitution(a: PageContent, b: PageContent): string[] {
  const patterns: string[] = [];

  if (!a.platformSlug || !b.platformSlug) return patterns;

  const platformA = PLATFORMS.find((p) => p.slug === a.platformSlug);
  const platformB = PLATFORMS.find((p) => p.slug === b.platformSlug);

  if (!platformA || !platformB) return patterns;

  // Check if body text is nearly identical after replacing platform names
  let normalizedA = a.bodyText
    .replace(new RegExp(platformA.name.toLowerCase(), "g"), "PLATFORM")
    .replace(new RegExp(platformA.slug, "g"), "PLATFORM");

  let normalizedB = b.bodyText
    .replace(new RegExp(platformB.name.toLowerCase(), "g"), "PLATFORM")
    .replace(new RegExp(platformB.slug, "g"), "PLATFORM");

  const sim = textSimilarity(normalizedA, normalizedB);
  if (sim >= 0.8) {
    patterns.push(`High similarity after platform-name normalization (${(sim * 100).toFixed(0)}%)`);
  }

  return patterns;
}

/**
 * Compare heading structures between two pages.
 */
function compareHeadings(a: PageContent, b: PageContent): string[] {
  const patterns: string[] = [];

  const common = a.headingStructure.filter((h) => b.headingStructure.includes(h));
  const totalUnique = new Set([...a.headingStructure, ...b.headingStructure]).size;

  if (totalUnique === 0) return patterns;

  const hdrSim = common.length / totalUnique;
  if (hdrSim >= 0.7) {
    patterns.push(`Heading structure ${(hdrSim * 100).toFixed(0)}% identical`);
  }

  return patterns;
}

function main() {
  console.log("Content Similarity Report");
  console.log("=========================\n");

  const published = CONTENT_REGISTRY.filter(
    (e) => e.page.status === "published" && (e.page.type === "problem" || e.page.type === "migration")
  );

  const pages = published.map((e) => extractPageContent(e.page));

  console.log(`Analyzing ${pages.length} published pages...\n`);

  const results: SimilarityResult[] = [];

  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const a = pages[i]!;
      const b = pages[j]!;

      // Only compare same-problem or same-platform pages
      const sameProblem = a.problemSlug && b.problemSlug && a.problemSlug === b.problemSlug;
      const samePlatform = a.platformSlug && b.platformSlug && a.platformSlug === b.platformSlug;
      const sameType = (a.platformSlug && b.platformSlug) || (a.problemSlug && b.problemSlug && !a.platformSlug && !b.platformSlug);

      if (!sameType) continue;

      const sharedPatterns: string[] = [];

      // Check heading similarity
      sharedPatterns.push(...compareHeadings(a, b));

      // Check name substitution
      sharedPatterns.push(...detectNameSubstitution(a, b));

      // Check body text similarity
      const bodySim = textSimilarity(a.bodyText, b.bodyText);
      if (bodySim >= 0.6) {
        sharedPatterns.push(`Body text ${(bodySim * 100).toFixed(0)}% similar`);
      }

      if (sharedPatterns.length > 0) {
        // Weight: name substitution + body sim is worse than just heading sim
        let severity: SimilarityResult["severity"] = "low";
        const maxSim = Math.max(
          bodySim,
          sharedPatterns.some((p) => p.includes("platform-name")) ? 0.9 : 0
        );

        if (maxSim >= 0.85) severity = "critical";
        else if (maxSim >= 0.75) severity = "high";
        else if (maxSim >= 0.55) severity = "review";

        results.push({
          pair: [a.path, b.path],
          score: Math.round(bodySim * 100),
          severity,
          sharedPatterns,
        });
      }
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  const critical = results.filter((r) => r.severity === "critical");
  const high = results.filter((r) => r.severity === "high");
  const review = results.filter((r) => r.severity === "review");

  console.log(`Summary:`);
  console.log(`  Critical (85%+): ${critical.length} pairs`);
  console.log(`  High (75-85%): ${high.length} pairs`);
  console.log(`  Review (55-75%): ${review.length} pairs`);
  console.log(`  Low (<55%): ${results.filter((r) => r.severity === "low").length} pairs`);
  console.log();

  if (critical.length > 0) {
    console.log("CRITICAL SIMILARITY:");
    for (const r of critical) {
      console.log(`  ${r.pair[0]} <-> ${r.pair[1]} (${r.score}%)`);
      for (const p of r.sharedPatterns) {
        console.log(`    - ${p}`);
      }
      console.log();
    }
  }

  if (high.length > 0) {
    console.log("HIGH SIMILARITY:");
    for (const r of high.slice(0, 10)) {
      console.log(`  ${r.pair[0]} <-> ${r.pair[1]} (${r.score}%)`);
      for (const p of r.sharedPatterns) {
        console.log(`    - ${p}`);
      }
      console.log();
    }
    if (high.length > 10) console.log(`  ... and ${high.length - 10} more pairs\n`);
  }

  // Platform×problem pairs with same issue
  console.log("PLATFORM×PROBLEM pages sharing same issue:");
  const platformProblemPages = pages.filter((p) => p.platformSlug && p.problemSlug);
  const byProblem: Record<string, typeof pages> = {};
  for (const p of platformProblemPages) {
    const key = p.problemSlug!;
    if (!byProblem[key]) byProblem[key] = [];
    byProblem[key]!.push(p);
  }
  for (const [problem, group] of Object.entries(byProblem)) {
    if (group.length > 1) {
      console.log(`  ${problem}: ${group.length} pages`);
      for (const p of group) {
        const simResult = results.find(
          (r) => (r.pair[0] === p.path || r.pair[1] === p.path) && r.severity !== "low"
        );
        const badge = simResult ? ` (${simResult.severity} similarity: ${simResult.score}%)` : "";
        console.log(`    ${p.path}${badge}`);
      }
      console.log();
    }
  }

  // Recommendations
  console.log("RECOMMENDATIONS:");
  if (critical.length + high.length > 0) {
    console.log("  - Add platform-specific data model details to differentiate platform×problem pages");
    console.log("  - Include platform-specific export procedures and API endpoints");
    console.log("  - Add platform-specific integration considerations");
    console.log("  - Include concrete code/method examples per platform");
  }
  console.log("  - Run 'npx tsx src/cli/similarity.ts > CONTENT-SIMILARITY-REPORT.md' to save");
}

main();
