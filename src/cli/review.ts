import { CONTENT_REGISTRY } from "../../data/content-registry";
import { scoreContent } from "../../app/lib/linking";

/**
 * Content review tool.
 *
 * Run with: npx tsx src/cli/review.ts [--path=/migrate/woocommerce-to-shopify/]
 *
 * Reviews a specific page or all published pages for quality issues,
 * AI filler phrases, and metadata problems.
 */

const AI_FILLER_PHRASES = [
  "In today's digital landscape",
  "In the fast-paced world of ecommerce",
  "It is important to note that",
  "As we all know",
  "Needless to say",
  "It goes without saying",
  "In conclusion",
  "To summarize",
];

const PLACEHOLDER_PATTERNS = [
  "TODO",
  "TBD",
  "Lorem ipsum",
  "Content goes here",
  "Coming soon",
];

function main() {
  const args = process.argv.slice(2);
  const pathFilter = args.find((a) => a.startsWith("--path="))?.slice(7);

  console.log("Content Quality Review");
  console.log("======================\n");

  const pages = pathFilter
    ? CONTENT_REGISTRY.filter((e) => e.page.path === pathFilter)
    : CONTENT_REGISTRY.filter((e) => e.page.status === "published");

  if (pages.length === 0) {
    console.log("No pages found to review.");
    return;
  }

  console.log(`Reviewing ${pages.length} pages...\n`);

  const issues: Array<{ path: string; issue: string; severity: "error" | "warn" }> = [];

  for (const entry of pages) {
    const page = entry.page;

    // Check title
    for (const phrase of AI_FILLER_PHRASES) {
      if (page.title.toLowerCase().includes(phrase.toLowerCase())) {
        issues.push({ path: page.path, issue: `Title contains AI filler: "${phrase}"`, severity: "warn" });
      }
    }

    // Check description
    for (const phrase of AI_FILLER_PHRASES) {
      if (page.metaDescription.toLowerCase().includes(phrase.toLowerCase())) {
        issues.push({ path: page.path, issue: `Meta description contains AI filler: "${phrase}"`, severity: "warn" });
      }
    }

    // Check for very short descriptions
    if (page.metaDescription.length < 50) {
      issues.push({ path: page.path, issue: `Meta description too short (${page.metaDescription.length} chars)`, severity: "error" });
    }

    // Check for very long titles
    if (page.metaTitle.length > 70) {
      issues.push({ path: page.path, issue: `Meta title too long (${page.metaTitle.length} chars, should be <70)`, severity: "warn" });
    }

    // Check for placeholder text
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (page.title.includes(pattern) || page.metaDescription.includes(pattern)) {
        issues.push({ path: page.path, issue: `Contains placeholder text: "${pattern}"`, severity: "error" });
      }
    }

    // Check content score
    const { score, issues: scoreIssues } = scoreContent({
      title: page.title,
      description: page.metaDescription,
      hasPlatformFacts: !!page.platform,
      hasUniqueSections: page.problem ? 4 : page.type === "hub" ? 5 : 2,
      hasSources: page.type !== "tool",
      hasInternalLinks: page.type === "hub" || page.type === "problem",
      hasWarningCallouts: !!page.platform,
      wordCount: page.type === "hub" ? 1500 : page.type === "problem" ? 800 : 400,
    });

    if (score < 60) {
      issues.push({ path: page.path, issue: `Quality score below threshold: ${score}/100`, severity: "warn" });
    }

    for (const si of scoreIssues) {
      issues.push({ path: page.path, issue: si, severity: "warn" });
    }
  }

  if (issues.length === 0) {
    console.log("No issues found. All reviewed pages pass quality checks.");
  } else {
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warn");

    console.log(`Found ${errors.length} error(s) and ${warnings.length} warning(s):\n`);

    if (errors.length > 0) {
      console.log("ERRORS:");
      for (const issue of errors) {
        console.log(`  [ERROR] ${issue.path}`);
        console.log(`    ${issue.issue}`);
      }
      console.log();
    }

    if (warnings.length > 0) {
      console.log("WARNINGS:");
      for (const issue of warnings) {
        console.log(`  [WARN] ${issue.path}`);
        console.log(`    ${issue.issue}`);
      }
    }
  }
}

main();
