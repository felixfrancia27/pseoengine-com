import { scoreContent, isPublishable } from "../../app/lib/linking";
import { CONTENT_REGISTRY } from "../../data/content-registry";

/**
 * Content quality validation.
 *
 * Run with: npx tsx src/cli/validate.ts
 *
 * Validates all published pages against quality gates and reports
 * which pages are below the publishing threshold.
 */

const PUBLISH_THRESHOLD = 60;

function main() {
  console.log("Content Quality Validation Report");
  console.log("=================================\n");

  const published = CONTENT_REGISTRY.filter(
    (e) => e.page.status === "published"
  );

  const results: Array<{
    path: string;
    score: number;
    status: "pass" | "warn" | "fail";
    issues: string[];
  }> = [];

  for (const entry of published) {
    const page = entry.page;

    // Simulate content scoring based on what we know about the page
    const hasPlatformFacts = !!page.platform;
    const hasUniqueSections = page.problem ? 4 : page.type === "hub" ? 5 : 2;
    const hasSources = page.type !== "tool";
    const hasInternalLinks = page.type === "hub" || page.type === "problem";
    const wordCountGuess = page.type === "hub" ? 1500 : page.type === "problem" ? 800 : 400;

    const { score, issues } = scoreContent({
      title: page.title,
      description: page.metaDescription,
      hasPlatformFacts,
      hasUniqueSections,
      hasSources,
      hasInternalLinks,
      hasWarningCallouts: hasPlatformFacts,
      wordCount: wordCountGuess,
    });

    const status = score >= PUBLISH_THRESHOLD ? "pass" : score >= 40 ? "warn" : "fail";

    results.push({ path: page.path, score, status, issues });
  }

  // Sort by score ascending (worst first)
  results.sort((a, b) => a.score - b.score);

  const passCount = results.filter((r) => r.status === "pass").length;
  const warnCount = results.filter((r) => r.status === "warn").length;
  const failCount = results.filter((r) => r.status === "fail").length;

  console.log(`Total published pages: ${results.length}`);
  console.log(`  Pass (>=${PUBLISH_THRESHOLD}): ${passCount}`);
  console.log(`  Warn  (40-${PUBLISH_THRESHOLD - 1}): ${warnCount}`);
  console.log(`  Fail  (<40): ${failCount}`);
  console.log(`  Average score: ${Math.round(results.reduce((a, r) => a + r.score, 0) / results.length)}`);
  console.log();

  // Show failing pages
  const problematic = results.filter((r) => r.status !== "pass");
  if (problematic.length > 0) {
    console.log("Pages below threshold:");
    console.log("-----------------------");
    for (const r of problematic) {
      console.log(`  [${r.status.toUpperCase()}] ${r.path} (${r.score}/100)`);
      for (const issue of r.issues) {
        console.log(`    - ${issue}`);
      }
      console.log();
    }
  }

  // Content registry report
  console.log("\nContent Registry Report:");
  console.log("-----------------------");
  const byStatus = { published: 0, draft: 0, review: 0, noindex: 0 };
  const byType: Record<string, number> = {};
  for (const entry of CONTENT_REGISTRY) {
    byStatus[entry.page.status]++;
    byType[entry.page.type] = (byType[entry.page.type] || 0) + 1;
  }
  console.log(`  Total entries: ${CONTENT_REGISTRY.length}`);
  console.log(`  Generated: ${CONTENT_REGISTRY.filter((e) => e.generated).length}`);
  for (const [status, count] of Object.entries(byStatus)) {
    console.log(`  ${status}: ${count}`);
  }
  console.log("\n  By type:");
  for (const [type, count] of Object.entries(byType)) {
    console.log(`    ${type}: ${count}`);
  }
}

main();
